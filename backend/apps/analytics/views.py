from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count, Avg, F
from .models import PersonalRecord
from .serializers import PersonalRecordSerializer
from apps.workouts.models import Workout, WorkoutSet
from apps.exercises.models import Exercise


class PersonalRecordViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PersonalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = PersonalRecord.objects.filter(user=self.request.user).select_related('exercise')
        exercise_id = self.request.query_params.get('exercise')
        if exercise_id:
            qs = qs.filter(exercise_id=exercise_id)
        return qs


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        seven_days_ago = now - timedelta(days=7)

        completed_workouts = Workout.objects.filter(user=user, status='completed')

        total_workouts = completed_workouts.count()
        total_volume = completed_workouts.aggregate(Sum('total_volume_kg'))['total_volume_kg__sum'] or 0
        total_seconds = completed_workouts.aggregate(Sum('duration_seconds'))['duration_seconds__sum'] or 0
        total_hours = round(total_seconds / 3600, 1)

        recent_workouts = completed_workouts.filter(started_at__gte=seven_days_ago).count()
        month_workouts = completed_workouts.filter(started_at__gte=thirty_days_ago).count()

        # Weekly volume progression for the last 6-8 weeks
        weekly_volume = []
        for i in range(7, -1, -1):
            start = (now - timedelta(days=(i + 1) * 7)).replace(hour=0, minute=0, second=0)
            end = (now - timedelta(days=i * 7)).replace(hour=23, minute=59, second=59)
            vol = completed_workouts.filter(started_at__gte=start, started_at__lte=end).aggregate(Sum('total_volume_kg'))['total_volume_kg__sum'] or 0
            count = completed_workouts.filter(started_at__gte=start, started_at__lte=end).count()
            week_label = f"Wk -{i}" if i > 0 else "This Wk"
            weekly_volume.append({
                'week': week_label,
                'volume_kg': float(vol),
                'workouts': count,
            })

        # Muscle Group Distribution (based on completed workout sets)
        muscle_stats = (
            WorkoutSet.objects
            .filter(workout__user=user, completed=True)
            .values('exercise__primary_muscle_group')
            .annotate(
                total_sets=Count('id'),
                total_vol=Sum(F('weight_kg') * F('reps'))
            )
            .order_by('-total_sets')
        )

        muscle_distribution = [
            {
                'name': m['exercise__primary_muscle_group'].capitalize() if m['exercise__primary_muscle_group'] else 'Other',
                'sets': m['total_sets'],
                'volume': float(m['total_vol'] or 0)
            }
            for m in muscle_stats
        ]

        # Recent personal records
        recent_prs = (
            PersonalRecord.objects
            .filter(user=user)
            .select_related('exercise')
            .order_by('-achieved_at')[:5]
        )

        return Response({
            'total_workouts': total_workouts,
            'total_volume_kg': float(total_volume),
            'total_hours': total_hours,
            'workouts_this_week': recent_workouts,
            'workouts_this_month': month_workouts,
            'weekly_volume': weekly_volume,
            'muscle_distribution': muscle_distribution,
            'recent_prs': PersonalRecordSerializer(recent_prs, many=True).data,
        })


class ExerciseProgressionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, exercise_id):
        user = request.user
        sets = (
            WorkoutSet.objects
            .filter(workout__user=user, exercise_id=exercise_id, completed=True)
            .select_related('workout')
            .order_by('workout__started_at')
        )

        history_map = {}
        for s in sets:
            date_str = s.workout.started_at.strftime('%Y-%m-%d')
            weight = float(s.weight_kg)
            reps = s.reps
            e1rm = weight * (1.0 + reps / 30.0) if reps > 1 else weight

            if date_str not in history_map:
                history_map[date_str] = {
                    'date': date_str,
                    'max_weight': weight,
                    'estimated_1rm': round(e1rm, 1),
                    'total_volume': weight * reps
                }
            else:
                history_map[date_str]['max_weight'] = max(history_map[date_str]['max_weight'], weight)
                history_map[date_str]['estimated_1rm'] = max(history_map[date_str]['estimated_1rm'], round(e1rm, 1))
                history_map[date_str]['total_volume'] += (weight * reps)

        history = list(history_map.values())
        return Response({'exercise_id': exercise_id, 'history': history})
