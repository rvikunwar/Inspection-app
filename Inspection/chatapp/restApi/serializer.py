from rest_framework import serializers
from chatapp.models import MemberMessages
from accounts.models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberMessages
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'first_name', 'last_name', 'profile_image', 'online']


class UserSerializer(serializers.ModelSerializer):
    profile_user = ProfileSerializer(many=True)
    last_message_time = serializers.DateTimeField()
    message = serializers.CharField()
    is_seen = serializers.BooleanField()
    sender = serializers.IntegerField()
    unseen_count = serializers.IntegerField()

    class Meta:
        model = User
        fields = ['id', 'last_message_time', 'message', 'unseen_count', 'sender', 'profile_user', 'is_seen']


class MessengerMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberMessages
        fields = ['content', 'is_seen', 'timestamp']

