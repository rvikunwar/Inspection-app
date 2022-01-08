from rest_framework import serializers
from .models import Notifications
from accounts.models import Profile


class NotificationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = "__all__"


class ProfileSerializerv2(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'profile_image']
