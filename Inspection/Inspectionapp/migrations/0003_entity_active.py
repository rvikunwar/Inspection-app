# Generated by Django 3.2.9 on 2021-11-12 14:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Inspectionapp', '0002_alter_entitymembers_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='entity',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]