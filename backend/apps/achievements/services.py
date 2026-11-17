from django.db.models import Sum, Max
from django.utils import timezone
from .models import Achievement, UserAchievement
from apps.workouts.models import Workout, WorkoutSet


def check_user_achievements(user):
    """Evaluates whether the user has unlocked new achievements"""
    unlocked_now = []
    already_unlocked = set(
        UserAchievement.objects.filter(user=user).values_list('achievement__slug', flat=True)
    )

    # 1. Total completed workouts
    completed_count = Workout.objects.filter(user=user, status='completed').count()

    # 2. Total volume lifted
    total_volume = (
        Workout.objects.filter(user=user, status='completed')
        .aggregate(Sum('total_volume_kg'))['total_volume_kg__sum'] or 0
    )

    # 3. Max weight lifted
    max_weight = (
        WorkoutSet.objects.filter(workout__user=user, completed=True)
        .aggregate(Max('weight_kg'))['weight_kg__max'] or 0
    )

    all_achievements = Achievement.objects.all()

    for ach in all_achievements:
        if ach.slug in already_unlocked:
            continue

        should_unlock = False
        if ach.category == 'workouts' and completed_count >= ach.threshold:
            should_unlock = True
        elif ach.category == 'volume' and float(total_volume) >= float(ach.threshold):
            should_unlock = True
        elif ach.category == 'strength' and float(max_weight) >= float(ach.threshold):
            should_unlock = True

        if should_unlock:
            ua = UserAchievement.objects.create(
                user=user,
                achievement=ach,
                unlocked_at=timezone.now()
            )
            unlocked_now.append(ua)

    return unlocked_now
