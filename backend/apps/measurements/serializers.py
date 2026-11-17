from rest_framework import serializers
from .models import BodyMeasurement


class BodyMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyMeasurement
        fields = [
            'id', 'date', 'weight_kg', 'body_fat_pct',
            'chest_cm', 'waist_cm', 'hips_cm', 'biceps_cm', 'thigh_cm',
            'notes', 'created_at', 'user'
        ]
        read_only_fields = ['id', 'created_at', 'user']

    def create(self, validated_data):
        user = validated_data.pop('user', None)
        if not user:
            request = self.context.get('request')
            user = request.user if request else None

        date = validated_data.get('date')
        if date and user:
            existing = BodyMeasurement.objects.filter(user=user, date=date).first()
            if existing:
                for attr, val in validated_data.items():
                    setattr(existing, attr, val)
                existing.save()
                if existing.weight_kg and hasattr(user, 'profile'):
                    user.profile.weight_kg = existing.weight_kg
                    user.profile.save(update_fields=['weight_kg'])
                return existing

        measurement = BodyMeasurement.objects.create(user=user, **validated_data)

        # Update profile weight if provided
        if measurement.weight_kg and hasattr(user, 'profile'):
            user.profile.weight_kg = measurement.weight_kg
            user.profile.save(update_fields=['weight_kg'])

        return measurement
