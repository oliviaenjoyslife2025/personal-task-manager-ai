from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    """
    Provides CRUD (Create, Read, Update, Delete) API endpoints for Task model.
    
    Allowed methods:
    - GET /v1/tasks/       (list)
    - POST /v1/tasks/      (create)
    - GET /v1/tasks/{id}/  (detail)
    - PUT /v1/tasks/{id}/  (full update)
    - PATCH /v1/tasks/{id}/ (partial update)
    - DELETE /v1/tasks/{id}/ (delete)
    """
    # Define queryset to get all tasks
    queryset = Task.objects.all()
    # Define serializer class to use
    serializer_class = TaskSerializer

    def get_queryset(self):
        """
        Override this method to ensure tasks are always ordered as we want.
        The ordering in models.py already defines sorting, this is just a redundant guarantee.
        """
        return Task.objects.all()