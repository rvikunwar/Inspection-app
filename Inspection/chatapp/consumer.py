from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from django.contrib.auth import get_user_model
from .serializer import *
from .views import AddProfileToMessenger
User = get_user_model()
from accounts.models import Profile


class ChatConsumer(WebsocketConsumer):

    def fetch_message(self, data):
        current_user = data['currentUser']
        selected_user = data['selectedUser']
        messages = (MemberMessages.objects.filter(sender=current_user, receiver=selected_user) |
                    MemberMessages.objects.filter(receiver=current_user, sender=selected_user))
        serializer = MessageSerializer(messages, many=True)
        content = {
            'command': 'fetch_messages',
            'message': serializer.data
        }
        self.send_message(content)

    def message_to_json(self, message):
        return {
            'sender': message.sender.id,
            'receiver': message.receiver,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    def new_message(self, data):
        sender = data['sender']
        receiver = data['receiver']
        AddProfileToMessenger(sender, receiver)
        receiver_profile = Profile.objects.get(user=receiver)
        status = receiver_profile.online

        if status == False:
            count = receiver_profile.un_seen_messages
            receiver_profile.un_seen_messages = count+1
            receiver_profile.save()

        room_name = self.scope['url_route']['kwargs']['room_name']
        sender = User.objects.get(id=sender)
        message = MemberMessages.objects.create(sender=sender, receiver=receiver,
                                                content=data['content'], room_name=room_name)
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    def online_user(self, data):
        user = data['user']
        status = data['status']

        profile = Profile.objects.get(user=user)
        profile.online = status
        profile.save()
        un_seen_messages = profile.un_seen_messages
        content = {
            'command': 'online_status',
            'online': status,
            'un_seen_messages': un_seen_messages
        }
        return self.send_online_status(content)

    commands = {
        'fetch_messages': fetch_message,
        'new_message': new_message,
        'online_status': online_user

    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):    # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))

    # Online status
    def send_online_status(self, data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'online_status_func',
                'data': data
            }
        )

    def online_status_func(self, event):
        data = event['data']
        self.send(text_data=json.dumps(data))
