from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Achievement(models.Model):
    BADGE_LEVELS = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]

    CATEGORY_CHOICES = [
        ('workouts', 'Workout Consistency'),
        ('volume', 'Total Volume Lifted'),
        ('strength', 'Strength Milestone'),
        ('streak', 'Workout Streak'),
    ]

    slug = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=150)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='EmojiEvents')
    badge_level = models.CharField(max_length=20, choices=BADGE_LEVELS, default='bronze')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='workouts')
    threshold = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        db_table = 'achievements_achievement'
        ordering = ['threshold']

    def __str__(self):
        return f"{self.title} ({self.badge_level})"


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='unlocked_users')
    unlocked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'achievements_userachievement'
        unique_together = ('user', 'achievement')
        ordering = ['-unlocked_at']

    def __str__(self):
        return f"{self.user.username} unlocked {self.achievement.title}"
