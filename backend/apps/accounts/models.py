from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer_not_to_say', 'Prefer not to say'),
    ]

    GOAL_CHOICES = [
        ('hypertrophy', 'Muscle Gain / Hypertrophy'),
        ('strength', 'Strength & Power'),
        ('weight_loss', 'Weight Loss / Fat Loss'),
        ('endurance', 'Endurance & Stamina'),
        ('general_fitness', 'General Health & Fitness'),
    ]

    ACTIVITY_CHOICES = [
        ('sedentary', 'Sedentary'),
        ('lightly_active', 'Lightly Active'),
        ('moderately_active', 'Moderately Active'),
        ('very_active', 'Very Active'),
        ('extremely_active', 'Extremely Active'),
    ]

    UNITS_CHOICES = [
        ('kg', 'Kilograms (kg)'),
        ('lbs', 'Pounds (lbs)'),
    ]

    THEME_CHOICES = [
        ('dark', 'Dark'),
        ('light', 'Light'),
        ('system', 'System'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    avatar = models.CharField(max_length=255, blank=True, default='')
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    target_weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    height_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='prefer_not_to_say')
    fitness_goal = models.CharField(max_length=50, choices=GOAL_CHOICES, default='hypertrophy')
    activity_level = models.CharField(max_length=50, choices=ACTIVITY_CHOICES, default='moderately_active')
    preferred_units = models.CharField(max_length=10, choices=UNITS_CHOICES, default='kg')
    theme_mode = models.CharField(max_length=10, choices=THEME_CHOICES, default='dark')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'accounts_userprofile'

    def __str__(self):
        return f"{self.user.username}'s Profile"


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
