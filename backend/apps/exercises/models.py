from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Exercise(models.Model):
    MUSCLE_GROUPS = [
        ('chest', 'Chest'),
        ('back', 'Back'),
        ('legs', 'Legs / Quads / Hamstrings'),
        ('shoulders', 'Shoulders'),
        ('arms', 'Arms / Biceps / Triceps'),
        ('core', 'Core / Abs'),
        ('full_body', 'Full Body'),
        ('cardio', 'Cardio'),
    ]

    EQUIPMENT_CHOICES = [
        ('barbell', 'Barbell'),
        ('dumbbell', 'Dumbbell'),
        ('cable', 'Cable Machine'),
        ('machine', 'Machine'),
        ('bodyweight', 'Bodyweight'),
        ('kettlebell', 'Kettlebell'),
        ('bands', 'Resistance Bands'),
        ('other', 'Other'),
    ]

    CATEGORY_CHOICES = [
        ('strength', 'Strength'),
        ('hypertrophy', 'Hypertrophy'),
        ('endurance', 'Endurance'),
        ('calisthenics', 'Calisthenics'),
        ('mobility', 'Mobility & Stretching'),
        ('olympic', 'Olympic Weightlifting'),
    ]

    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    name = models.CharField(max_length=150)
    slug = models.CharField(max_length=150, db_index=True)
    primary_muscle_group = models.CharField(max_length=50, choices=MUSCLE_GROUPS)
    secondary_muscles = models.CharField(max_length=200, blank=True, default='')
    equipment = models.CharField(max_length=50, choices=EQUIPMENT_CHOICES, default='barbell')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='hypertrophy')
    difficulty = models.CharField(max_length=30, choices=DIFFICULTY_CHOICES, default='intermediate')
    instructions = models.TextField(blank=True, default='')
    tips = models.TextField(blank=True, default='')
    is_custom = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='custom_exercises')

    class Meta:
        db_table = 'exercises_exercise'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            self.slug = base_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
