from django.contrib import admin
from .models import Achievement, UserAchievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'badge_level', 'category', 'threshold')
    list_filter = ('badge_level', 'category')
    search_fields = ('title', 'description')


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'unlocked_at')
    list_filter = ('unlocked_at',)
    search_fields = ('user__username', 'achievement__title')
