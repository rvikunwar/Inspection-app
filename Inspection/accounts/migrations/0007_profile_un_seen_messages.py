# Generated by Django 3.2.9 on 2021-11-25 06:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_profile_online'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='un_seen_messages',
            field=models.IntegerField(default=0),
        ),
    ]
