from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from apps.exercises.models import Exercise
from apps.routines.models import RoutineDay


class Workout(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    routine_day = models.ForeignKey(RoutineDay, on_delete=models.SET_NULL, null=True, blank=True, related_name='workouts')
    client_id = models.CharField(max_length=64, blank=True, null=True, db_index=True)
    title = models.CharField(max_length=200)
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    total_volume_kg = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_reps = models.IntegerField(default=0)
    notes = models.TextField(blank=True, default='')
    rating = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workouts_workout'
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.started_at.strftime('%Y-%m-%d')})"

    def recalculate_stats(self):
        sets = self.sets.filter(completed=True)
        self.total_volume_kg = sum(s.weight_kg * s.reps for s in sets)
        self.total_reps = sum(s.reps for s in sets)
        self.save(update_fields=['total_volume_kg', 'total_reps'])


class WorkoutSet(models.Model):
    SET_TYPES = [
        ('normal', 'Normal Set'),
        ('warmup', 'Warmup Set'),
        ('drop', 'Drop Set'),
        ('failure', 'Failure Set'),
    ]

    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='sets')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='workout_sets')
    set_number = models.IntegerField(default=1)
    set_type = models.CharField(max_length=20, choices=SET_TYPES, default='normal')
    weight_kg = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    reps = models.IntegerField(default=0)
    rpe = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    completed = models.BooleanField(default=True)
    rest_seconds = models.IntegerField(default=60)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'workouts_workoutset'
        ordering = ['order', 'set_number', 'id']

    def __str__(self):
        return f"{self.exercise.name} Set #{self.set_number}: {self.weight_kg}kg x {self.reps}"
