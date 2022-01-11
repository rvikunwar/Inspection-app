from django.urls import path
from .api import *


urlpatterns = [
    path('entitylist/', EntityListAPI.as_view(), name="entity-list"),
    path('tasksassigned/', TasksAssignedv1API.as_view(), name="task-assigned-v1"),
    path('tasksassigned/<int:id>/', TasksAssignedv2API.as_view(), name="task-assigned-v2"),
    path('todo/', Todov1API.as_view(), name="list-get-post-todo"),
    path('todo/<int:id>/', Todov2API.as_view(), name="update-del-todo"),
    path('fileupload/', FileUpload.as_view(), name="file"),
    path('fileupload/<int:id>/', FileUploadv1.as_view(), name="filev1"),
    path('entity/', Entityv1API.as_view(), name="entityv1"),
    path('entity/<int:id>/', Entityv2API.as_view(), name="entityv2"),
    path('areas/', AreaAPI.as_view(), name="area"),
    path('todostats/', TodoStats.as_view(), name="todo-stats"),
    path('inspectortasks/', InspectorTasksAPI.as_view(), name="ins-tasks"),
    path('inspectorstat/', InspectorStat.as_view(), name="inspector-stat"),
    path('areastat/', AreaStat.as_view(), name="area-stat"),
    path('updatestatus/', UpdateStatus.as_view(), name="update-status"),
    path('updatetodostatus/', UpdateTodoStatus.as_view(), name="update-todo-status")
]
