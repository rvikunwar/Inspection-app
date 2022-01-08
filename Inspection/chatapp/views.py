from accounts.models import Profile
from django.contrib.auth import get_user_model
from .models import MemberMessages
from chatapp.restApi.serializer import MessengerMessageSerializer
User = get_user_model()


def getMessengerData(currentUser, selectedUser):
    message = MemberMessages.objects.filter(sender=currentUser, receiver=selectedUser).order_by('timestamp').first()
    serializer = MessengerMessageSerializer(message)
    print(serializer.data)

