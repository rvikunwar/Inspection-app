# Generated by Django 3.2.9 on 2021-11-22 14:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Inspectionapp', '0016_areas_entity'),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inspector',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('area_allocated', models.ManyToManyField(to='Inspectionapp.Areas')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inspector_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='profile',
            name='active_on_service',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='area_allocated',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='manager_contact',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='office_contact',
        ),
        migrations.AlterField(
            model_name='profile',
            name='position',
            field=models.CharField(choices=[('INSPECTOR', 'INSPECTOR'), ('MANAGER', 'MANAGER')], default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Manager',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inspector_allocated', models.ManyToManyField(to='accounts.Inspector')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='manager_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]