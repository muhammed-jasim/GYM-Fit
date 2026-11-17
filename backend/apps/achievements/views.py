from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Achievement, UserAchievement
from .serializers import AchievementSerializer, UserAchievementSerializer
from .services import check_user_achievements


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def evaluate(self, request):
        unlocked = check_user_achievements(request.user)
        return Response({
            'newly_unlocked_count': len(unlocked),
            'newly_unlocked': [ua.achievement.title for ua in unlocked]
        })
