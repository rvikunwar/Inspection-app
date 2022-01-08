from django.db import models
from django.contrib.auth import get_user_model
from Inspectionapp.models import Entity, Areas
from accounts.models import Profile

User = get_user_model()


class Notifications(models.Model):
    title = models.CharField(max_length=300)
    content = models.TextField()
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="notification_sender")
    reciever = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notification_reciever")
    timestamp = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.content[0:30]} . . ."

