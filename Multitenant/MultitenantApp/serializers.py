from rest_framework import serializers
from .models import UploadedVideos, SubtitleTrack
class VideoSerializers(serializers.ModelSerializer):
    class Meta:
        model = UploadedVideos
        fields = '__all__'  

class SubtitleTrackSerializers(serializers.ModelSerializer):
    class Meta:
        model = SubtitleTrack
        fields = '__all__'