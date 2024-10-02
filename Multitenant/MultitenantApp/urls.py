from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/list-videos/', VideoPlayerAPI.as_view(), name='videos-lists'),
    path('api/upload-videos/', VideoUploadApi.as_view(), name='video-upload'),
    path('api/get-video/<int:pk>/', GetVideo.as_view(), name='get-video'),
    path('api/get-subtitle/<int:pk>/', GetVideoSubtitleTrack.as_view(), name='get-subtitle'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
