# Generated by Django 3.2.9 on 2021-11-27 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Inspectionapp', '0021_taskassigned_reason_for_reassigning'),
    ]

    operations = [
        migrations.AlterField(
            model_name='files',
            name='type',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
