from django.contrib import admin
from .models import PersonalRecord


@admin.register(PersonalRecord)
class PersonalRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'exercise', 'record_type', 'value', 'achieved_at')
    list_filter = ('record_type', 'achieved_at')
    search_fields = ('user__username', 'exercise__name')
