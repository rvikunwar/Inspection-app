from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from chatapp.restApi.serializer import *
User = get_user_model()
from accounts.models import Profile
from .restApi.serializer import MessageSerializer
from Notifications.utils import send_push_message


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

    def new_message(self, data):
        sender = data['sender']
        reciever = data['receiver']
        try:
            sender = User.objects.get(id=sender)
            reciever = User.objects.get(id=reciever)
            message = MemberMessages.objects.create(sender=sender, reciever=reciever,
                                                    content=data['content'])
            message.save()
            profile = Profile.objects.filter(user=reciever).first()
            profile.un_seen_messages = profile.un_seen_messages + 1
            profile.save()
            serializer = MessageSerializer(message)
        except Exception as e:
            print(e)
            raise e

        try:
            message = serializer.data['content']
            profile = Profile.objects.get(user=reciever.id)
            tokens = profile.expo_token.all()
            message = message
            title = f'New message from {profile.first_name} {profile.last_name}'
            for tk in tokens:
                send_push_message(str(tk), title, message)
        except Exception as e:
            print(e)

        content = {
            'command': 'new_message',
            'message': serializer.data
        }
        return self.send_chat_message(content)

    def update_un_seen(self, data):
        user = self.scope['user']
        selectedUser = data['selectedUser']
        print(data, selectedUser)
        try:
            messages = (MemberMessages.objects.filter(sender=user, reciever=selectedUser, is_seen=False) |
                MemberMessages.objects.filter(sender=selectedUser, reciever=user, is_seen=False))
            messages.update(is_seen=True)
            print('Un seen messages update successfull')
        except Exception as e:
            print(e)
            print('something went wrong while updating un seen messages')


    commands = {
        'fetch_messages': fetch_message,
        'new_message': new_message,
        'update_un_seen': update_un_seen
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

