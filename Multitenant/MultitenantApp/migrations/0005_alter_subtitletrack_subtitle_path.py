# Generated by Django 5.1.1 on 2024-09-21 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MultitenantApp', '0004_delete_uploadedsubtitles'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subtitletrack',
            name='subtitle_path',
            field=models.FileField(upload_to=''),
        ),
    ]
