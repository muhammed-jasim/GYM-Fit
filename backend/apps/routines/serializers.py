from rest_framework import serializers
from .models import Routine, RoutineDay, RoutineExercise
from apps.exercises.serializers import ExerciseSerializer
from apps.exercises.models import Exercise


class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise_detail = ExerciseSerializer(source='exercise', read_only=True)
    exercise = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(), required=False
    )
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(), source='exercise', write_only=True, required=False
    )

    class Meta:
        model = RoutineExercise
        fields = [
            'id', 'routine_day', 'exercise', 'exercise_id', 'exercise_detail',
            'order', 'target_sets', 'target_reps', 'target_weight', 'sets_data',
            'target_rpe', 'rest_seconds', 'notes'
        ]
        read_only_fields = ['id', 'routine_day']


class RoutineDaySerializer(serializers.ModelSerializer):
    routine_exercises = RoutineExerciseSerializer(many=True, required=False)

    class Meta:
        model = RoutineDay
        fields = ['id', 'routine', 'day_number', 'name', 'description', 'routine_exercises']
        read_only_fields = ['id', 'routine']


class RoutineSerializer(serializers.ModelSerializer):
    days = RoutineDaySerializer(many=True, required=False)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    exercises_count = serializers.SerializerMethodField()

    class Meta:
        model = Routine
        fields = [
            'id', 'name', 'description', 'category', 'category_display',
            'days_per_week', 'is_template', 'created_at', 'updated_at',
            'user', 'days', 'exercises_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']

    def get_exercises_count(self, obj):
        return sum(day.routine_exercises.count() for day in obj.days.all())

    def create(self, validated_data):
        days_data = validated_data.pop('days', [])
        routine = Routine.objects.create(**validated_data)

        for day_data in days_data:
            exercises_data = day_data.pop('routine_exercises', [])
            day = RoutineDay.objects.create(routine=routine, **day_data)
            for ex_data in exercises_data:
                RoutineExercise.objects.create(routine_day=day, **ex_data)

        return routine

    def update(self, instance, validated_data):
        days_data = validated_data.pop('days', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if days_data is not None:
            # Recreate days if explicitly supplied in payload
            instance.days.all().delete()
            for day_data in days_data:
                exercises_data = day_data.pop('routine_exercises', [])
                day = RoutineDay.objects.create(routine=instance, **day_data)
                for ex_data in exercises_data:
                    RoutineExercise.objects.create(routine_day=day, **ex_data)

        return instance
