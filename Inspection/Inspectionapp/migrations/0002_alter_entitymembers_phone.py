# Generated by Django 3.2.9 on 2021-11-12 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Inspectionapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entitymembers',
            name='phone',
            field=models.IntegerField(),
        ),
    ]
