# Generated by Django 3.2.9 on 2022-01-04 13:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0015_auto_20220103_1451'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='messenger_list',
        ),
    ]
