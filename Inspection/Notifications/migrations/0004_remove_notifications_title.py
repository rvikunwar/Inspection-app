# Generated by Django 3.2.9 on 2021-12-31 13:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Notifications', '0003_alter_notifications_areas'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notifications',
            name='title',
        ),
    ]