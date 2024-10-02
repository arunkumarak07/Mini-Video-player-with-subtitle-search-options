from django.apps import AppConfig


class MultitenantappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'MultitenantApp'
