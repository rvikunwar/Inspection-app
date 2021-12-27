# Generated by Django 3.2.9 on 2021-11-19 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Inspectionapp', '0007_alter_todo_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='taskassigned',
            name='start_date',
        ),
        migrations.AlterField(
            model_name='taskassigned',
            name='status',
            field=models.CharField(choices=[('RESOLVED', 'RESOLVED'), ('NEW', 'NEW'), ('PROCESSING', 'PROCESSING')], default='NEW', max_length=50),
        ),
    ]