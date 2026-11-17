from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BodyMeasurementViewSet

router = DefaultRouter()
router.register(r'', BodyMeasurementViewSet, basename='measurement')

urlpatterns = [
    path('', include(router.urls)),
]
