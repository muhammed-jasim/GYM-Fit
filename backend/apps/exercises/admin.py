from django.contrib import admin
from .models import Exercise


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'primary_muscle_group', 'equipment', 'category', 'difficulty', 'is_custom')
    list_filter = ('primary_muscle_group', 'equipment', 'category', 'difficulty', 'is_custom')
    search_fields = ('name', 'instructions')
    prepopulated_fields = {'slug': ('name',)}
