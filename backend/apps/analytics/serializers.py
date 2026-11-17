from rest_framework import serializers
from .models import PersonalRecord
from apps.exercises.serializers import ExerciseSerializer


class PersonalRecordSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    record_type_display = serializers.CharField(source='get_record_type_display', read_only=True)
    exercise_detail = ExerciseSerializer(source='exercise', read_only=True)

    class Meta:
        model = PersonalRecord
        fields = [
            'id', 'record_type', 'record_type_display', 'value',
            'achieved_at', 'exercise', 'exercise_name', 'exercise_detail',
            'workout', 'user'
        ]
        read_only_fields = ['id', 'achieved_at', 'user']
