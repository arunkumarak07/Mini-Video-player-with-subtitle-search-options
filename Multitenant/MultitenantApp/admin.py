from django.contrib import admin
from .models import UploadedVideos, SubtitleTrack

# Register your models here.
admin.site.register(UploadedVideos)
admin.site.register(SubtitleTrack)