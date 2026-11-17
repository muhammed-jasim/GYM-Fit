from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class BodyMeasurement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='measurements')
    date = models.DateField(default=timezone.now)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    body_fat_pct = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    chest_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    waist_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    hips_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    biceps_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    thigh_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'measurements_bodymeasurement'
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.date}: {self.weight_kg or 0}kg"
