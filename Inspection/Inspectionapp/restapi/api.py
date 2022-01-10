from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import *
from accounts.models import *


class EntityListAPI(APIView):
    def get(self, request):
        entity = Entity.objects.filter()
        serializer = EntitySerializer(entity, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TasksAssignedv1API(APIView):
    def get(self, request):
        user = request.user.id
        role = request.query_params.get('role')
        if role is not None and role == 'MANAGER':
            manager = Profile.objects.get(id=user)
            entity = manager.entity
            task = TaskAssigned.objects.filter(entity=entity).order_by('-timestamp')
            serializer = TaskAssignedSerializer(task, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if role is not None and role == 'INSPECTOR':
            task = (TaskAssigned.objects.filter(assigned_by=user) | TaskAssigned.objects.filter(assigned_to=user))
            serializer = TaskAssignedSerializer(task, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        user = request.user.pk
        data['assigned_by'] = user
        serializer = TaskAssignedSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TasksAssignedv2API(APIView):
    def put(self, request, id):
        data = request.data
        task = TaskAssigned.objects.get(pk=id)
        serializer = TaskAssignedSerializer(task, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        task = TaskAssigned.objects.get(pk=id)
        task.delete()
        return Response("Successfully deleted", status=status.HTTP_200_OK)


class Todov1API(APIView):
    def get(self, request):
        task = request.query_params.get('task')
        task = Todo.objects.filter(task=task)
        serializer = TodoSerializer(task, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = TodoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response("Data successfully added", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Todov2API(APIView):
    def put(self, request, id):
        data = request.data
        todo = Todo.objects.get(pk=id)
        serializer = TodoSerializer(todo, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response("Data successfully updated", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request,id):
        todo = Todo.objects.get(pk=id)
        todo.delete()
        return Response("Successfully deleted", status=status.HTTP_200_OK)


class FileUpload(APIView):
    def get(self, request):
        task = request.query_params.get('id')
        files = Files.objects.filter(task=task)
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = FileSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileUploadv1(APIView):
    def delete(self, request, id, format=None):
        file = Files.objects.get(pk=id)
        file.delete()
        return Response("Successfully deleted", status=status.HTTP_204_NO_CONTENT)


class Entityv1API(APIView):
    def get(self, request):
        entity = Entity.objects.all()
        serializer = EntitySerializer(entity, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Entityv2API(APIView):
    def get(self, request, id):
        entity = Entity.objects.get(id=id)
        serializer = EntitySerializer(entity)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AreaAPI(APIView):
    def get(self, request):
        inspector = request.query_params.get('inspector', None)
        entity = request.query_params.get('entity', None)

        if inspector is not None:
            area = Inspector.objects.get(user=inspector)
            areas = area.area_allocated.filter()
            serializer = AreaSerializer(areas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif entity is not None:
            area = Entity.objects.get(id=entity)
            areas = area.areas.filter()
            serializer = AreaSerializer(areas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)


class TodoStats(APIView):
    def get(self, request):
        task = request.query_params.get('task', None)
        if task is not None:
            total = Todo.objects.filter(task=task).count()
            completed = Todo.objects.filter(task=task, status="COMPLETED").count()
            return Response({"total": total, "completed": completed}, status=status.HTTP_200_OK)


class InspectorTasksAPI(APIView):
    def get(self, request):
        userv1 = request.user.id
        role = request.query_params.get('role', None)
        user = request.query_params.get('user', None)
        if role is not None and role == 'MANAGER':
            taskFrom = TaskAssigned.objects.filter(assigned_to=user).order_by('-timestamp')
            taskTo = TaskAssigned.objects.filter(assigned_by=user).order_by('-timestamp')
            serializerFrom = TaskAssignedSerializer(taskFrom, many=True)
            serializerTo = TaskAssignedSerializer(taskTo, many=True)
            return Response({"from": serializerFrom.data, "to": serializerTo.data},
                            status=status.HTTP_200_OK)

        if role is not None and role == 'INSPECTOR':
            tasks = TaskAssigned.objects.filter(assigned_to=user, assigned_by=userv1).order_by('-timestamp')
            serializer = TaskAssignedSerializer(tasks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_200_OK)


class InspectorStat(APIView):
    def get(self, request):
        user = request.user.id
        role = request.query_params.get('role', None)
        entity = request.query_params.get('entity', None)
        inspector = request.query_params.get('inspector', None)
        if inspector is not None and role == "MANAGER":
            # TASK ASSIGNED BY CURRENT USER TO OTHERS
            total_1 = TaskAssigned.objects.filter(assigned_by=inspector).count()
            completed_1 = TaskAssigned.objects.filter(assigned_by=inspector, status="COMPLETED").count()
            new_1 = TaskAssigned.objects.filter(assigned_by=inspector, status="NEW").count()
            processing_1 = TaskAssigned.objects.filter(assigned_by=inspector, status="PROCESSING").count()
            has_issue_1 = TaskAssigned.objects.filter(assigned_by=inspector, status="ISSUE").count()
            re_assigned_1 = TaskAssigned.objects.filter(assigned_by=inspector, status="RE-ASSIGNED").count()

            # TASK ASSIGNED BY OTHER USERS TO CURRENT USER
            total_2 = TaskAssigned.objects.filter(assigned_to=inspector).count()
            completed_2 = TaskAssigned.objects.filter(assigned_to=inspector, status="COMPLETED").count()
            new_2 = TaskAssigned.objects.filter(assigned_to=inspector, status="NEW").count()
            processing_2 = TaskAssigned.objects.filter(assigned_to=inspector, status="PROCESSING").count()
            has_issue_2 = TaskAssigned.objects.filter(assigned_to=inspector, status="ISSUE").count()
            re_assigned_2 = TaskAssigned.objects.filter(assigned_to=inspector, status="RE-ASSIGNED").count()

            return Response({"task_assigned_to_others": {"total": total_1, "completed": completed_1, "new": new_1,
                             "processing": processing_1, "has_issue": has_issue_1, "re_assigned": re_assigned_1},
                             "task_assigned_by_others": {"total": total_2, "completed": completed_2, "new": new_2,
                             "processing": processing_2, "has_issue": has_issue_2, "re_assigned": re_assigned_2}},
                            status=status.HTTP_200_OK)

        elif entity is not None and role == "MANAGER":
            total = TaskAssigned.objects.filter(entity=entity).count()
            completed = TaskAssigned.objects.filter(entity=entity, status="COMPLETED").count()
            new = TaskAssigned.objects.filter(entity=entity, status="NEW").count()
            processing = TaskAssigned.objects.filter(entity=entity, status="PROCESSING").count()
            has_issue = TaskAssigned.objects.filter(entity=entity, status="ISSUE").count()
            re_assigned = TaskAssigned.objects.filter(entity=entity, status="RE-ASSIGNED").count()

            return Response({"total": total, "completed": completed, "new": new,
                             "processing": processing, "has_issue": has_issue, "re_assigned": re_assigned},
                            status=status.HTTP_200_OK)

        # STATS FOR INSPECTOR FOR PARTICULAR ENTITY
        elif entity is not None and role == "INSPECTOR":
            total = TaskAssigned.objects.filter(assigned_by=user, entity=entity).count()
            completed = TaskAssigned.objects.filter(assigned_by=user, entity=entity, status="COMPLETED").count()
            new = TaskAssigned.objects.filter(assigned_by=user, entity=entity, status="NEW").count()
            processing = TaskAssigned.objects.filter(assigned_by=user, entity=entity, status="PROCESSING").count()
            has_issue = TaskAssigned.objects.filter(assigned_by=user, entity=entity, status="ISSUE").count()
            re_assigned = TaskAssigned.objects.filter(assigned_by=user, entity=entity, status="RE-ASSIGNED").count()

            return Response({"total": total, "completed": completed, "new": new,
                             "processing": processing, "has_issue": has_issue, "re_assigned": re_assigned},
                            status=status.HTTP_200_OK)

        # STATS FOR INSPECTOR FOR PARTICULAR ENTITY
        elif inspector is not None and role == "INSPECTOR":

            total = TaskAssigned.objects.filter(assigned_by=user, assigned_to=inspector).count()
            completed = TaskAssigned.objects.filter(assigned_by=user, assigned_to=inspector, status="COMPLETED").count()
            new = TaskAssigned.objects.filter(assigned_by=user, assigned_to=inspector, status="NEW").count()
            processing = TaskAssigned.objects.filter(assigned_by=user, assigned_to=inspector, status="PROCESSING").count()
            has_issue = TaskAssigned.objects.filter(assigned_by=user, assigned_to=inspector, status="ISSUE").count()
            re_assigned = TaskAssigned.objects.filter(assigned_by=user, assigned_to=inspector, status="RE-ASSIGNED").count()
            return Response({"total": total, "completed": completed, "new": new,
                             "processing": processing, "has_issue": has_issue, "re_assigned": re_assigned},
                            status=status.HTTP_200_OK)

        # STATS FOR ALL THE TASK ASSIGNED BY INSPECTOR
        elif role is not None and role == "INSPECTOR":
            total = TaskAssigned.objects.filter(assigned_by=user).count()
            completed = TaskAssigned.objects.filter(assigned_by=user, status="COMPLETED").count()
            new = TaskAssigned.objects.filter(assigned_by=user, status="NEW").count()
            processing = TaskAssigned.objects.filter(assigned_by=user, status="PROCESSING").count()
            has_issue = TaskAssigned.objects.filter(assigned_by=user, status="ISSUE").count()
            re_assigned = TaskAssigned.objects.filter(assigned_by=user, status="RE-ASSIGNED").count()

            return Response({"total": total, "completed": completed, "new": new,
                             "processing": processing, "has_issue": has_issue, "re_assigned": re_assigned},
                            status=status.HTTP_200_OK)

        return Response({}, status=status.HTTP_200_OK)


class AreaStat(APIView):
    def get(self, request):
        id = request.query_params.get('id', None)
        entity = request.query_params.get('entity', None)
        if id is not None:
            inspector = Inspector.objects.filter(area_allocated=id).values('user')
            inspector_count = Profile.objects.filter(user__in=inspector, entity=entity).count()
            online_inspector = Profile.objects.filter(user__in=inspector, entity=entity, online=True).count()
            return Response({"inspector_count": inspector_count,
                             "online_inspector": online_inspector}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_200_OK)


class UpdateStatus(APIView):
    def get(self, request):
        statusv1 = request.query_params.get('status', None)
        id = request.query_params.get('id', None)
        if id is not None:
            task = TaskAssigned.objects.get(id=id)
            task.status = statusv1
            task.save()
            return Response({"updated"}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_200_OK)


class UpdateTodoStatus(APIView):
    def get(self, request):
        statusv1 = request.query_params.get('status', None)
        id = request.query_params.get('id', None)
        if id is not None:
            todo = Todo.objects.get(id=id)
            todo.status = statusv1
            todo.save()
            return Response({"updated"}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_200_OK)













