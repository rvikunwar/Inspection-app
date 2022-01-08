from rest_framework import serializers
from accounts.models import Profile
from ..models import Notifications


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'profile_image', 'online']


class NotificationSerializers(serializers.ModelSerializer):
    select_related_fields = ('sender')
    sender = ProfileSerializer()

    class Meta:
        model = Notifications
        fields = ['sender', 'id', 'timestamp', 'title', 'is_seen', 'content']

