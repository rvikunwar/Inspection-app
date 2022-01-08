from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class MemberMessages(models.Model):
    sender = models.ForeignKey(User, related_name="message_author",
                               related_query_name='s',
                               on_delete=models.SET_NULL,
                               null=True)
    reciever = models.ForeignKey(User, related_name="message_reciever",
                                on_delete=models.SET_NULL,
                                related_query_name='r',
                                null=True)
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_seen = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.content[0:30]} . . . ({self.timestamp.strftime('%d-%m-%Y, %H:%M')})"

    class Meta:
        ordering = ('-timestamp',)


