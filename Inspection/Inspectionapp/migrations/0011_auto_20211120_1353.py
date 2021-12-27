# Generated by Django 3.2.9 on 2021-11-20 08:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Inspectionapp', '0010_files_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='entity',
            old_name='logo',
            new_name='background_image',
        ),
        migrations.AddField(
            model_name='entity',
            name='description',
            field=models.TextField(default=3, help_text='small description about entity'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='entity',
            name='person_in_charge',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]