from django.contrib import admin
from .models import Workout, WorkoutSet


class WorkoutSetInline(admin.TabularInline):
    model = WorkoutSet
    extra = 1


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'started_at', 'status', 'total_volume_kg', 'total_reps')
    list_filter = ('status', 'started_at')
    search_fields = ('title', 'user__username')
    inlines = [WorkoutSetInline]
