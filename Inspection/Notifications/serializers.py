from rest_framework import serializers
from .models import Notifications


class NotificationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = "__all__"
