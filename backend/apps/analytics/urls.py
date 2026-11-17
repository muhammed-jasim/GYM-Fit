from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonalRecordViewSet, DashboardSummaryView, ExerciseProgressionView

router = DefaultRouter()
router.register(r'records', PersonalRecordViewSet, basename='personal-record')

urlpatterns = [
    path('dashboard/', DashboardSummaryView.as_view(), name='dashboard_summary'),
    path('progression/<int:exercise_id>/', ExerciseProgressionView.as_view(), name='exercise_progression'),
    path('', include(router.urls)),
]
