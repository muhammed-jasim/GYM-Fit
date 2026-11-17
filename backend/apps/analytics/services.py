from decimal import Decimal
from django.utils import timezone
from .models import PersonalRecord


def calculate_1rm(weight, reps):
    """Epley formula for 1RM estimate"""
    if reps <= 0 or weight <= 0:
        return Decimal('0')
    if reps == 1:
        return Decimal(str(weight))
    # Epley: 1RM = weight * (1 + reps / 30)
    rm = float(weight) * (1.0 + float(reps) / 30.0)
    return Decimal(f"{rm:.2f}")


def check_workout_prs(workout):
    """Evaluates workout sets to find and record new personal records"""
    user = workout.user
    sets = workout.sets.filter(completed=True)
    new_prs = []

    for s in sets:
        weight = s.weight_kg
        reps = s.reps
        if weight <= 0 or reps <= 0:
            continue

        e1rm = calculate_1rm(weight, reps)

        # 1. Check max_weight
        existing_max = PersonalRecord.objects.filter(
            user=user, exercise=s.exercise, record_type='max_weight'
        ).first()

        if not existing_max:
            new_prs.append(PersonalRecord.objects.create(
                user=user, exercise=s.exercise, workout=workout,
                record_type='max_weight', value=weight, achieved_at=workout.started_at
            ))
        elif weight > existing_max.value:
            existing_max.value = weight
            existing_max.workout = workout
            existing_max.achieved_at = workout.started_at
            existing_max.save()
            new_prs.append(existing_max)

        # 2. Check estimated_1rm
        existing_1rm = PersonalRecord.objects.filter(
            user=user, exercise=s.exercise, record_type='estimated_1rm'
        ).first()

        if not existing_1rm:
            new_prs.append(PersonalRecord.objects.create(
                user=user, exercise=s.exercise, workout=workout,
                record_type='estimated_1rm', value=e1rm, achieved_at=workout.started_at
            ))
        elif e1rm > existing_1rm.value:
            existing_1rm.value = e1rm
            existing_1rm.workout = workout
            existing_1rm.achieved_at = workout.started_at
            existing_1rm.save()
            new_prs.append(existing_1rm)

    return new_prs
