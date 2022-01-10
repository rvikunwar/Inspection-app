from rest_framework import serializers
from ..models import *


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = ['name', 'logo', 'email', 'person_in_charge', 'phone_number']


class TaskAssignedSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAssigned
        fields = '__all__'


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'


class FileSerializer(serializers.ModelSerializer):
    file = serializers.FileField()

    class Meta:
        model = Files
        fields = ('id', 'task', 'file')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        file = {
            "url": representation.pop("file"),
            "size": instance.file.size,
            "name": instance.file.name.split('/')[1],
        }
        representation['file'] = file
        return representation


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = '__all__'


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Areas
        fields = '__all__'
