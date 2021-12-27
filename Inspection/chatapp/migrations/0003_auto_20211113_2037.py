# Generated by Django 3.2.9 on 2021-11-13 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0002_auto_20211113_1906'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='membermessages',
            options={'ordering': ('timestamp',)},
        ),
        migrations.AddField(
            model_name='membermessages',
            name='room_name',
            field=models.CharField(default='!', max_length=500),
            preserve_default=False,
        ),
    ]
