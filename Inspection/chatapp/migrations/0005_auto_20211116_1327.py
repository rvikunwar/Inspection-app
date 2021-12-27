# Generated by Django 3.2.9 on 2021-11-16 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0004_auto_20211113_2058'),
    ]

    operations = [
        migrations.RenameField(
            model_name='membermessages',
            old_name='message',
            new_name='content',
        ),
        migrations.RenameField(
            model_name='membermessages',
            old_name='author',
            new_name='sender',
        ),
        migrations.AddField(
            model_name='membermessages',
            name='receiver',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
