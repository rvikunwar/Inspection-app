from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import *
from django.contrib.auth import get_user_model
from .customPagination import CustomPagination
from django.db.models import Q

User = get_user_model()


class messengerListAPI(APIView):
    pagination_class = CustomPagination

    def get(self, request):
        user = request.user
        if user is not None:
            users = User.objects.filter(Q(r__sender=user.id) | Q(s__reciever=user.id)).distinct().extra(select={
                'last_message_time': 'select MAX(timestamp) from chatapp_membermessages where (reciever_id=auth_user.id and sender_id=%s) or (reciever_id=%s and sender_id=auth_user.id)'},
                                                       select_params=(user.id, user.id,)).extra(select={
                'is_seen': 'select is_seen from chatapp_membermessages where (timestamp=(select MAX(timestamp) from chatapp_membermessages where (reciever_id=auth_user.id and sender_id=%s) or (reciever_id=%s and sender_id=auth_user.id)) and ((reciever_id=auth_user.id and sender_id=%s) or (reciever_id=%s and sender_id=auth_user.id)))', },
                                                       select_params=(user.id, user.id, user.id, user.id,)).extra(select={
                'message': 'select content from chatapp_membermessages where (timestamp=(select MAX(timestamp) from chatapp_membermessages where (reciever_id=auth_user.id and sender_id=%s) or (reciever_id=%s and sender_id=auth_user.id)) and ((reciever_id=auth_user.id and sender_id=%s) or (reciever_id=%s and sender_id=auth_user.id)))', },
                                                       select_params=(user.id, user.id, user.id, user.id,)).extra(select={
                'unseen_count': 'select count(id) from chatapp_membermessages where reciever_id=%s and sender_id=auth_user.id and is_seen=false',},
                                                        select_params=(user.id,)).extra(select={
                'sender': 'select sender_id from chatapp_membermessages where (timestamp=(select MAX(timestamp) from chatapp_membermessages where (reciever_id=auth_user.id and sender_id=%s) or (reciever_id=%s and sender_id=auth_user.id)) and ((reciever_id=auth_user.id and sender_id=%s) or (reciever_id=%s and sender_id=auth_user.id)))', },
                                                       select_params=(user.id, user.id, user.id, user.id,)).order_by('-last_message_time')

            data = users.prefetch_related('profile_user')

            page = self.paginate_queryset(data)
            if page is not None:
                serializer = UserSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = UserSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            response = {
                'message': 'not allowed',
                'status': status.HTTP_400_BAD_REQUEST
            }
            return Response(response)


    @property
    def paginator(self):
        """
        The paginator instance associated with the view, or `None`.
        """
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        return self._paginator

    def paginate_queryset(self, queryset):
        """
        Return a single page of results, or `None` if pagination is disabled.
        """
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def get_paginated_response(self, data):
        """
        Return a paginated style `Response` object for the given output data.
        """
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data)


class FetchMessages(APIView):
    pagination_class = CustomPagination

    def get(self, request):
        user = request.user.id
        selectedUser = request.query_params.get('selectedUser', None)

        if selectedUser is not None:
            data = (MemberMessages.objects.filter(sender_id=user, reciever_id=selectedUser) |
                        MemberMessages.objects.filter(reciever=user, sender=selectedUser)).order_by('-timestamp')
            page = self.paginate_queryset(data)
            if page is not None:
                serializer = MessageSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = MessageSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            response = {
                'message': 'not allowed',
                'status': status.HTTP_400_BAD_REQUEST
            }
            return Response(response)




    @property
    def paginator(self):
        """
        The paginator instance associated with the view, or `None`.
        """
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        return self._paginator

    def paginate_queryset(self, queryset):
        """
        Return a single page of results, or `None` if pagination is disabled.
        """
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def get_paginated_response(self, data):
        """
        Return a paginated style `Response` object for the given output data.
        """
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data)

