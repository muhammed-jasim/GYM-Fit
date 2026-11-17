from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import Workout, WorkoutSet
from .serializers import WorkoutSerializer, WorkoutSetSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'routine_day']
    ordering_fields = ['started_at', 'duration_seconds', 'total_volume_kg']
    ordering = ['-started_at']

    def get_queryset(self):
        return (
            Workout.objects
            .filter(user=self.request.user)
            .select_related('routine_day')
            .prefetch_related('sets__exercise')
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='previous-performance')
    def previous_performance(self, request):
        """
        Returns the user's previous session performance and overload guidance for exercises.
        Query params:
        - exercise_ids: comma-separated list of IDs (e.g. ?exercise_ids=1,13,5)
        """
        exercise_ids_str = request.query_params.get('exercise_ids', '')
        if exercise_ids_str:
            try:
                exercise_ids = [int(x.strip()) for x in exercise_ids_str.split(',') if x.strip()]
            except ValueError:
                exercise_ids = []
        else:
            exercise_ids = list(
                WorkoutSet.objects
                .filter(workout__user=request.user, workout__status='completed', completed=True)
                .values_list('exercise_id', flat=True)
                .distinct()[:25]
            )

        result = {}
        for ex_id in exercise_ids:
            last_completed_sets = (
                WorkoutSet.objects
                .filter(workout__user=request.user, workout__status='completed', exercise_id=ex_id, completed=True)
                .select_related('workout', 'exercise')
                .order_by('-workout__started_at', 'set_number')
            )

            if not last_completed_sets.exists():
                result[str(ex_id)] = {
                    'has_history': False,
                    'last_date': None,
                    'last_workout_title': None,
                    'sets': [],
                    'max_weight': 0,
                    'overload_recommendation': {
                        'suggested_weight': None,
                        'increment': 2.5,
                        'message': 'No prior session data. Start with a comfortable weight and focus on form!'
                    },
                    'history': []
                }
                continue

            last_workout = last_completed_sets.first().workout
            session_sets = (
                last_workout.sets
                .filter(exercise_id=ex_id, completed=True)
                .order_by('set_number')
            )

            sets_data = [
                {
                    'set_number': s.set_number,
                    'weight_kg': float(s.weight_kg),
                    'reps': s.reps,
                    'rpe': float(s.rpe) if s.rpe else None,
                    'set_type': s.set_type
                }
                for s in session_sets
            ]

            weights = [s['weight_kg'] for s in sets_data]
            max_weight = max(weights) if weights else 0
            avg_reps = sum(s['reps'] for s in sets_data) / len(sets_data) if sets_data else 0

            exercise_obj = last_completed_sets.first().exercise
            is_isolation = (
                exercise_obj.equipment in ['dumbbell', 'cable'] or
                exercise_obj.primary_muscle_group in ['arms', 'biceps', 'triceps', 'shoulders', 'calves', 'core']
            )
            increment = 1.25 if is_isolation else 2.5

            if avg_reps >= 8 or (sets_data and sets_data[0]['reps'] >= 8):
                suggested_weight = round(max_weight + increment, 2)
                overload_msg = f"Ready for overload! Try +{increment}kg ({suggested_weight}kg) or push for +1 rep today."
            else:
                suggested_weight = max_weight
                overload_msg = f"Hold at {max_weight}kg and target +1 to +2 extra reps per set to build capacity."

            hist_workouts = (
                Workout.objects
                .filter(user=request.user, status='completed', sets__exercise_id=ex_id, sets__completed=True)
                .distinct()
                .order_by('-started_at')[:5]
            )

            history = []
            for hw in hist_workouts:
                hw_sets = hw.sets.filter(exercise_id=ex_id, completed=True).order_by('set_number')
                hw_max = max([float(s.weight_kg) for s in hw_sets], default=0)
                hw_vol = sum([float(s.weight_kg) * s.reps for s in hw_sets])
                history.append({
                    'workout_id': hw.id,
                    'workout_title': hw.title,
                    'date': hw.started_at.strftime('%Y-%m-%d'),
                    'max_weight': hw_max,
                    'total_volume': round(hw_vol, 1),
                    'sets': [
                        {'set_number': s.set_number, 'weight_kg': float(s.weight_kg), 'reps': s.reps}
                        for s in hw_sets
                    ]
                })

            result[str(ex_id)] = {
                'has_history': True,
                'last_date': last_workout.started_at.strftime('%Y-%m-%d'),
                'last_workout_title': last_workout.title,
                'sets': sets_data,
                'max_weight': max_weight,
                'overload_recommendation': {
                    'suggested_weight': suggested_weight,
                    'increment': increment,
                    'message': overload_msg
                },
                'history': history
            }

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def active(self, request):
        active_workout = Workout.objects.filter(
            user=request.user,
            status='in_progress'
        ).prefetch_related('sets__exercise').first()

        if not active_workout:
            return Response(None, status=status.HTTP_200_OK)

        serializer = self.get_serializer(active_workout)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def sync_batch(self, request):
        """Syncs an array of workouts logged offline"""
        workouts_data = request.data.get('workouts', [])
        synced = []
        for w_data in workouts_data:
            serializer = WorkoutSerializer(data=w_data, context={'request': request})
            if serializer.is_valid():
                workout = serializer.save()
                synced.append(WorkoutSerializer(workout).data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'synced': synced, 'count': len(synced)}, status=status.HTTP_200_OK)
