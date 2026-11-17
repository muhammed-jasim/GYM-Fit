from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from apps.exercises.models import Exercise
from apps.workouts.models import Workout


class PersonalRecord(models.Model):
    RECORD_TYPES = [
        ('max_weight', 'Heaviest Weight Lifted'),
        ('estimated_1rm', 'Estimated 1 Rep Max'),
        ('max_reps', 'Max Reps at Weight'),
        ('max_volume', 'Highest Single Set Volume'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='personal_records')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='personal_records')
    workout = models.ForeignKey(Workout, on_delete=models.SET_NULL, null=True, blank=True, related_name='personal_records')
    record_type = models.CharField(max_length=30, choices=RECORD_TYPES)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    achieved_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'analytics_personalrecord'
        ordering = ['-achieved_at']

    def __str__(self):
        return f"{self.user.username} - {self.exercise.name} {self.record_type}: {self.value}"
