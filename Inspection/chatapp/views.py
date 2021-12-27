from django.shortcuts import render
from accounts.models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()


def AddProfileToMessenger(sender, receiver):
    receiver_profile = Profile.objects.get(user=receiver)
    sender_profile = Profile.objects.get(user=sender)

    receiver_list = receiver_profile.messenger_list.filter(id=sender)

    if len(receiver_list) > 0:
        new_sender = User.objects.get(id=sender)
        new_receiver = User.objects.get(id=receiver)
        receiver_profile.messenger_list.remove(new_sender)
        sender_profile.messenger_list.remove(new_receiver)
        sender_profile.messenger_list.add(new_receiver)
        receiver_profile.messenger_list.add(new_sender)

    else:
        new_sender = User.objects.get(id=sender)
        new_receiver = User.objects.get(id=receiver)
        sender_profile.messenger_list.add(new_receiver)
        receiver_profile.messenger_list.add(new_sender)

