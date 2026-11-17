from django.db import models
from django.contrib.auth.models import User
from apps.exercises.models import Exercise


class Routine(models.Model):
    CATEGORY_CHOICES = [
        ('ppl', 'Push / Pull / Legs'),
        ('upper_lower', 'Upper / Lower Split'),
        ('full_body', 'Full Body'),
        ('bro_split', 'Body Part Split / Bro Split'),
        ('custom', 'Custom Routine'),
    ]

    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='custom')
    days_per_week = models.IntegerField(default=3)
    is_template = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='routines')

    class Meta:
        db_table = 'routines_routine'
        ordering = ['-is_template', 'name']

    def __str__(self):
        return self.name


class RoutineDay(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE, related_name='days')
    day_number = models.IntegerField(default=1)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'routines_routineday'
        ordering = ['day_number']

    def __str__(self):
        return f"{self.routine.name} - Day {self.day_number}: {self.name}"


class RoutineExercise(models.Model):
    routine_day = models.ForeignKey(RoutineDay, on_delete=models.CASCADE, related_name='routine_exercises')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='routine_assignments')
    order = models.IntegerField(default=0)
    target_sets = models.IntegerField(default=3)
    target_reps = models.CharField(max_length=50, default='8-12')
    target_weight = models.DecimalField(max_digits=6, decimal_places=2, default=0.0, blank=True, null=True)
    sets_data = models.JSONField(default=list, blank=True)
    target_rpe = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    rest_seconds = models.IntegerField(default=90)
    notes = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'routines_routineexercise'
        ordering = ['order', 'id']

    def __str__(self):
        weight_str = f" @ {self.target_weight}kg" if self.target_weight else ""
        return f"{self.routine_day.name} - {self.exercise.name} ({self.target_sets} sets x {self.target_reps} reps{weight_str})"
