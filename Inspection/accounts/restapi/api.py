from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import *


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
