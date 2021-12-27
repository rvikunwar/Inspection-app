from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class MemberMessages(models.Model):
    sender = models.ForeignKey(User, related_name="message_author",
                               on_delete=models.SET_NULL, null=True)
    receiver = models.IntegerField()
    content = models.TextField()
    room_name = models.CharField(max_length=500)
    timestamp = models.DateTimeField(default=timezone.now)
    is_seen = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} ({self.timestamp.strftime('%d-%m-%Y, %H:%M')})"

    class Meta:
        ordering = ('timestamp',)


