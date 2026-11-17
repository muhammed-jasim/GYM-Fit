from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Exercise
from .serializers import ExerciseSerializer, ExerciseDetailSerializer


class ExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['primary_muscle_group', 'equipment', 'category', 'difficulty', 'is_custom']
    search_fields = ['name', 'primary_muscle_group', 'secondary_muscles', 'equipment', 'instructions']
    ordering_fields = ['name', 'created_at', 'difficulty']
    ordering = ['name']

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Exercise.objects.filter(
                Q(created_by__isnull=True) | Q(created_by=user)
            ).prefetch_related('personal_records')
        return Exercise.objects.filter(created_by__isnull=True)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ExerciseDetailSerializer
        return ExerciseSerializer

    def perform_create(self, serializer):
        serializer.save(is_custom=True, created_by=self.request.user)

    def perform_destroy(self, instance):
        if not instance.is_custom or instance.created_by != self.request.user:
            raise permissions.PermissionDenied("You cannot delete standard library exercises.")
        instance.delete()
