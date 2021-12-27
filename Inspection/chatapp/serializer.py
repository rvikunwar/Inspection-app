from rest_framework import serializers
from .models import MemberMessages


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberMessages
        fields = "__all__"

