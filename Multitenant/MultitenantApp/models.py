from django.db import models
import os

def upload_to_videos(instance, filename):
    return f'{filename}'

def upload_to_subtitles(instance, filename):
    return f'{filename}'

class UploadedVideos(models.Model):
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_to=upload_to_videos)
    
class SubtitleTrack(models.Model):
    video = models.ForeignKey(UploadedVideos, related_name='subtitles', on_delete=models.CASCADE)
    subtitle_path = models.FileField()
    srclang = models.CharField(max_length=10, null=True, blank=True)
    language = models.CharField(max_length=100, null=True, blank=True)