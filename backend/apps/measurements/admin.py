from django.contrib import admin
from .models import BodyMeasurement


@admin.register(BodyMeasurement)
class BodyMeasurementAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'weight_kg', 'body_fat_pct', 'created_at')
    list_filter = ('date',)
    search_fields = ('user__username', 'notes')
