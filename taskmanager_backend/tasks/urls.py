from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

# Use DefaultRouter to automatically generate routes for list and detail views
router = DefaultRouter()
# Register TaskViewSet to 'tasks' path
# This will generate routes like /v1/tasks/ and /v1/tasks/{id}/
router.register(r'tasks', TaskViewSet)

# router.urls is a list containing all auto-generated URL patterns
urlpatterns = router.urls