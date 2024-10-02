from django.shortcuts import render, redirect, get_object_or_404
from .models import UploadedVideos, SubtitleTrack
from rest_framework.views import APIView
from .serializers import VideoSerializers, SubtitleTrackSerializers
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import subprocess
import pycountry
import json
import re
import os

# API Creation:

class VideoPlayerAPI(APIView):
    def get(self, request):
        videos = UploadedVideos.objects.all()
        serializers = VideoSerializers(videos, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class VideoUploadApi(APIView):
    unknown_subtitle = 1

    def post(self, request, *args, **kwargs):
        serializer = VideoSerializers(data=request.data)

        if serializer.is_valid():
            video_instance = serializer.save()
            video_path = video_instance.file.path
            output_directory = os.path.join(settings.MEDIA_ROOT)
            os.makedirs(output_directory, exist_ok=True)

            # Step 1: Get information about all subtitle streams using FFmpeg
            result = subprocess.run(
                ['ffmpeg', '-i', video_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            # Step 2: Find all subtitle streams in the stderr output
            subtitle_streams = re.findall(r'Stream #(\d+:\d+)\((\w+)\): Subtitle', result.stderr)

            for stream_index, lang_code in subtitle_streams:
                output_vtt_file = os.path.join(output_directory, f"{video_instance.file_name}_subtitle_{stream_index.replace(':', '_')}_{lang_code}.vtt")
                #output_vtt_file = f"{video_instance.file_name}_subtitle_{stream_index.replace(':', '_')}_{lang_code}.vtt"

                # Run FFmpeg to extract the subtitle stream
                command = [
                    'ffmpeg', '-i', video_path,
                    '-map', f'{stream_index}',
                    '-c:s', 'webvtt',  # Convert subtitles to WebVTT format
                    output_vtt_file
                ]

                try:
                    subprocess.run(command, check=True)

                    relative_path = os.path.relpath(output_vtt_file, settings.MEDIA_ROOT)
                    
                    srclang = self.detect_srclang(video_path, stream_index) or lang_code
                    SubtitleTrack.objects.create(
                        video=video_instance,
                        subtitle_path=relative_path,
                        srclang=self.get_language_srclang(srclang),
                        language=self.get_language_name(srclang)
                    )

                    print(f"Extracted subtitle stream {stream_index} ({lang_code}) to {output_vtt_file}")

                except subprocess.CalledProcessError as e:
                    return Response({'error': f'Error extracting subtitle stream {stream_index}: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'message': 'Video and subtitles uploaded successfully'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def detect_srclang(self, video_path, stream_index):
        try:
            command = [
                'ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_streams',
                '-select_streams', f's:{stream_index}', video_path
            ]
            result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            metadata = json.loads(result.stdout)
            if metadata['streams'] and 'tags' in metadata['streams'][0]:
                return metadata['streams'][0]['tags'].get('language')

        except Exception as e:
            print(f"Error detecting srclang: {e}")
            
        return None 

    def get_language_name(self, srclang):
        srclang_to_language = {
            'eng': 'English',
            'spa': 'Spanish',
            'fra': 'French',
            'deu': 'German',
            'ita': 'Italian',
            'urd': 'Urdu',
            'zho': 'Chinese',
            'hin': 'Hindi',
            'jpn': 'Japanese',
            'kor': 'Korean',
            'por': 'Portuguese',
            'rus': 'Russian',
            'ara': 'Arabic',
            'ben': 'Bengali'
            }
        if srclang in srclang_to_language:
            return srclang_to_language[srclang]
        else:                
            return f'unknown_{self.unknown_subtitle}'

    def get_language_srclang(self, srclang):
        srclang_to_language = {
            'eng': 'en',  # English
            'spa': 'es',  # Spanish
            'fra': 'fr',  # French
            'deu': 'de',  # German
            'ita': 'it',  # Italian
            'urd': 'ur',  # Urdu
            'zho': 'zh',  # Chinese
            'hin': 'hi',  # Hindi
            'jpn': 'ja',  # Japanese
            'kor': 'ko',  # Korean
            'por': 'pt',  # Portuguese
            'rus': 'ru',  # Russian
            'ara': 'ar',  # Arabic
            'ben': 'bn'   # Bengali
            }
        if srclang in srclang_to_language:
            return srclang_to_language[srclang]
        else:
            self.unknown_subtitle += 1
            return f'unknown_{self.unknown_subtitle}'


class GetVideo(APIView):
    def get(self, request, pk):
        video = get_object_or_404(UploadedVideos, pk=pk)
        serializer = VideoSerializers(video)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetVideoSubtitleTrack(APIView):
    def get(self, request, pk):
        subtitles = SubtitleTrack.objects.filter(video_id=pk).select_related('video')
        if not subtitles.exists():
            return Response({"detail": "No subtitles found for the given video."}, status=status.HTTP_404_NOT_FOUND)
        serializer = SubtitleTrackSerializers(subtitles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)