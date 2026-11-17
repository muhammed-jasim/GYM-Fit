from rest_framework import serializers
from .models import Workout, WorkoutSet
from apps.exercises.models import Exercise
from apps.exercises.serializers import ExerciseSerializer


class WorkoutSetSerializer(serializers.ModelSerializer):
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(), source='exercise', write_only=True
    )
    exercise_detail = ExerciseSerializer(source='exercise', read_only=True)

    class Meta:
        model = WorkoutSet
        fields = [
            'id', 'workout', 'exercise', 'exercise_id', 'exercise_detail',
            'set_number', 'set_type', 'weight_kg', 'reps', 'rpe',
            'completed', 'rest_seconds', 'order'
        ]
        read_only_fields = ['id', 'workout', 'exercise']


class WorkoutSerializer(serializers.ModelSerializer):
    sets = WorkoutSetSerializer(many=True, required=False)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    routine_day_name = serializers.CharField(source='routine_day.name', read_only=True)

    class Meta:
        model = Workout
        fields = [
            'id', 'client_id', 'title', 'started_at', 'completed_at',
            'duration_seconds', 'status', 'status_display',
            'total_volume_kg', 'total_reps', 'notes', 'rating',
            'created_at', 'routine_day', 'routine_day_name', 'sets'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        sets_data = validated_data.pop('sets', [])
        user = validated_data.pop('user', None)
        if not user:
            request = self.context.get('request')
            user = request.user if request else None

        # Prevent duplicate if client_id already exists for this user
        client_id = validated_data.get('client_id')
        if client_id and user:
            existing = Workout.objects.filter(user=user, client_id=client_id).first()
            if existing:
                return self.update(existing, {**validated_data, 'sets': sets_data})

        workout = Workout.objects.create(user=user, **validated_data)

        total_volume = 0
        total_reps = 0

        for s_data in sets_data:
            s = WorkoutSet.objects.create(workout=workout, **s_data)
            if s.completed:
                total_volume += float(s.weight_kg) * s.reps
                total_reps += s.reps

        workout.total_volume_kg = total_volume
        workout.total_reps = total_reps
        workout.save(update_fields=['total_volume_kg', 'total_reps'])

        # Check PRs & Achievements
        from apps.analytics.services import check_workout_prs
        from apps.achievements.services import check_user_achievements
        try:
            check_workout_prs(workout)
            check_user_achievements(workout.user)
        except Exception as e:
            pass

        return workout

    def update(self, instance, validated_data):
        sets_data = validated_data.pop('sets', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if sets_data is not None:
            instance.sets.all().delete()
            total_volume = 0
            total_reps = 0
            for s_data in sets_data:
                s = WorkoutSet.objects.create(workout=instance, **s_data)
                if s.completed:
                    total_volume += float(s.weight_kg) * s.reps
                    total_reps += s.reps

            instance.total_volume_kg = total_volume
            instance.total_reps = total_reps
            instance.save(update_fields=['total_volume_kg', 'total_reps'])

            from apps.analytics.services import check_workout_prs
            from apps.achievements.services import check_user_achievements
            try:
                check_workout_prs(instance)
                check_user_achievements(instance.user)
            except Exception as e:
                pass

        return instance
