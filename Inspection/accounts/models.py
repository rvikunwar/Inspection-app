from django.db import models
from django.contrib.auth import get_user_model
from Inspectionapp.models import Entity, Areas

User = get_user_model()


class ExpoToken(models.Model):
    token = models.CharField(max_length=1000, unique=True)

    def __str__(self):
        return f"{self.token}"


POSITION = (('INSPECTOR', 'INSPECTOR'),
            ('MANAGER', 'MANAGER'),
            ('ADMIN', 'ADMIN'))


class Profile(models.Model):
    user = models.ForeignKey(User, related_name="profile_user", on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField()
    phone_number = models.IntegerField(blank=True, null=True)
    position = models.CharField(choices=POSITION, max_length=100)
    profile_image = models.ImageField(upload_to=f"profiles")
    entity = models.ForeignKey(Entity, on_delete=models.SET_NULL, null=True)
    online = models.BooleanField(default=False)
    un_seen_messages = models.IntegerField(default=0)
    expo_token = models.ManyToManyField(ExpoToken, blank=True)
    notification_count = models.IntegerField(default=0)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}"


class Inspector(models.Model):
    user = models.ForeignKey(User, related_name="inspector_user", on_delete=models.CASCADE)
    area_allocated = models.ManyToManyField(Areas, blank=True)

    def __str__(self):
        return f"{self.user.username}"
