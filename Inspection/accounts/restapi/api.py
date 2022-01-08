from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import *
from rest_framework import generics


class ListOfProfiles(APIView):
    def get(self, request):
        user = request.user
        area = request.query_params.get('area', None)
        entity = request.query_params.get('entity', None)

        if area is not None and entity is not None:
            ins = Inspector.objects.filter(area_allocated=area).values('user')
            profiles = Profile.objects.filter(user__in=ins, entity=entity).exclude(user=user)

        # FOR MANAGERS TO SHOW INSPECTORS IN ENTITY
        elif entity is not None:
            profiles = (Profile.objects.filter(entity=entity).exclude(position='MANAGER') &
                        Profile.objects.filter(entity=entity).exclude(position='ADMIN'))

        else:
            profiles = Profile.objects.exclude(user=user)

        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PersonalProfileDetails(APIView):
    def get(self, request):
        user = request.user
        profiles = Profile.objects.get(user=user)
        serializer = ProfileSerializer(profiles)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MemberProfileDetails(APIView):
    def get(self, request):
        user = request.query_params.get('id')
        user = User.objects.get(id=user)
        profiles = Profile.objects.get(user=user)
        serializer = ProfileSerializer(profiles)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetManagerProfile(APIView):
    def get(self, request):
        user = request.user.id
        manager = Manager.objects.get(inspector_allocated=user)
        profile = Profile.objects.get(user=manager.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetUserPersonalDetails(APIView):
    def get(self, request):
        user = request.query_params.get('id')
        user = User.objects.get(id=user)
        profiles = Profile.objects.get(user=user)
        serializer = ProfileSerializerv1(profiles)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddExpoToken(APIView):
    def post(self, request):
        user = request.user.id
        data = request.data
        expo = ExpoToken.objects.create(token=data['token'])
        expo.save()
        profile = Profile.objects.get(user=user)
        profile.expo_token.add(expo)
        return Response({"token posted"}, status=status.HTTP_201_CREATED)


class RemoveExpoToken(APIView):
    def get(self, request):
        token = request.query_params.get('token')
        expo_token = ExpoToken.objects.filter(token=token).first()
        expo_token.delete()
        return Response({"token deleted"}, status=status.HTTP_200_OK)


class UserProfileAPI(APIView):
    def put(self, request, pk):
        data = request.data
        profile = Profile.objects.get(id=pk)
        serializer = ProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)