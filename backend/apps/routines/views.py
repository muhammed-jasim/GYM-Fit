from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Routine, RoutineDay, RoutineExercise
from .serializers import RoutineSerializer, RoutineDaySerializer, RoutineExerciseSerializer


class RoutineViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return (
                Routine.objects
                .filter(Q(is_template=True) | Q(user=user))
                .prefetch_related('days__routine_exercises__exercise')
            )
        return (
            Routine.objects
            .filter(is_template=True)
            .prefetch_related('days__routine_exercises__exercise')
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_template=False)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.is_template or instance.user != self.request.user:
            raise permissions.PermissionDenied("You cannot modify standard library templates. Clone it first to customize!")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.is_template or instance.user != self.request.user:
            raise permissions.PermissionDenied("You cannot delete standard library templates.")
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def clone(self, request, pk=None):
        source_routine = self.get_object()
        new_name = request.data.get('name', f"My {source_routine.name}")

        new_routine = Routine.objects.create(
            name=new_name,
            description=source_routine.description,
            category=source_routine.category,
            days_per_week=source_routine.days_per_week,
            is_template=False,
            user=request.user
        )

        for day in source_routine.days.all():
            new_day = RoutineDay.objects.create(
                routine=new_routine,
                day_number=day.day_number,
                name=day.name,
                description=day.description
            )
            for ex in day.routine_exercises.all():
                RoutineExercise.objects.create(
                    routine_day=new_day,
                    exercise=ex.exercise,
                    order=ex.order,
                    target_sets=ex.target_sets,
                    target_reps=ex.target_reps,
                    target_weight=ex.target_weight,
                    sets_data=ex.sets_data,
                    target_rpe=ex.target_rpe,
                    rest_seconds=ex.rest_seconds,
                    notes=ex.notes
                )

        serializer = self.get_serializer(new_routine)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
