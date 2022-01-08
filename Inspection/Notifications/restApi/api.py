from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import *
from ..models import Notifications
from django.db.models import Prefetch
from .customPagination import CustomPagination


class FetchNotification(APIView):
    pagination_class = CustomPagination

    def get(self, request):
        user = request.user.id
        if user is not None:
            data = Notifications.objects.filter(reciever=user).order_by('-timestamp').select_related('sender')

            page = self.paginate_queryset(data)
            if page is not None:
                serializer = NotificationSerializers(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = NotificationSerializers(data, many=True)
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
