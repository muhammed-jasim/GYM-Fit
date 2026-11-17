from django.contrib import admin
from .models import Routine, RoutineDay, RoutineExercise


class RoutineExerciseInline(admin.TabularInline):
    model = RoutineExercise
    extra = 1


class RoutineDayInline(admin.StackedInline):
    model = RoutineDay
    extra = 1


@admin.register(Routine)
class RoutineAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'days_per_week', 'is_template', 'user')
    list_filter = ('category', 'is_template')
    inlines = [RoutineDayInline]


@admin.register(RoutineDay)
class RoutineDayAdmin(admin.ModelAdmin):
    list_display = ('name', 'routine', 'day_number')
    inlines = [RoutineExerciseInline]
