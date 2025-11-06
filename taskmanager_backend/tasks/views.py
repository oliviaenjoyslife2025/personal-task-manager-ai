from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    """
    Allowed methods:
    - GET /v1/tasks/       (list - retrieve all tasks)
    - POST /v1/tasks/      (create - create new task)
    - GET /v1/tasks/{id}/  (retrieve - get single task)
    - PUT /v1/tasks/{id}/  (update - full update)
    - PATCH /v1/tasks/{id}/ (partial_update - partial update)
    - DELETE /v1/tasks/{id}/ (destroy - delete task)
    """
    # Define queryset to get all tasks
    # The ordering is already defined in models.py Meta class
    queryset = Task.objects.all()
    # Define serializer class to use
    serializer_class = TaskSerializer