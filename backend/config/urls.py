from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/exercises/', include('apps.exercises.urls')),
    path('api/routines/', include('apps.routines.urls')),
    path('api/workouts/', include('apps.workouts.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/measurements/', include('apps.measurements.urls')),
    path('api/achievements/', include('apps.achievements.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
