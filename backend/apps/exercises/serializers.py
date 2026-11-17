from rest_framework import serializers
from .models import Exercise


class ExerciseSerializer(serializers.ModelSerializer):
    primary_muscle_display = serializers.CharField(source='get_primary_muscle_group_display', read_only=True)
    equipment_display = serializers.CharField(source='get_equipment_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)

    class Meta:
        model = Exercise
        fields = [
            'id', 'name', 'slug', 'primary_muscle_group', 'primary_muscle_display',
            'secondary_muscles', 'equipment', 'equipment_display',
            'category', 'category_display', 'difficulty', 'difficulty_display',
            'instructions', 'tips', 'is_custom', 'created_at', 'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']


class ExerciseDetailSerializer(ExerciseSerializer):
    personal_records = serializers.SerializerMethodField()
    recent_history = serializers.SerializerMethodField()

    class Meta(ExerciseSerializer.Meta):
        fields = ExerciseSerializer.Meta.fields + ['personal_records', 'recent_history']

    def get_personal_records(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return []
        prs = obj.personal_records.filter(user=request.user)
        return [
            {
                'record_type': pr.record_type,
                'value': float(pr.value),
                'achieved_at': pr.achieved_at
            }
            for pr in prs
        ]

    def get_recent_history(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return []
        # Return last 3 workout sets of this exercise for the user
        from apps.workouts.models import WorkoutSet
        sets = (
            WorkoutSet.objects
            .filter(exercise=obj, workout__user=request.user, completed=True)
            .select_related('workout')
            .order_by('-workout__started_at', 'set_number')[:10]
        )
        return [
            {
                'date': s.workout.started_at,
                'set_number': s.set_number,
                'weight_kg': float(s.weight_kg),
                'reps': s.reps,
                'rpe': float(s.rpe) if s.rpe else None
            }
            for s in sets
        ]
