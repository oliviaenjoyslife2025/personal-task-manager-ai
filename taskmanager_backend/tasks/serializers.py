from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task model, used to handle Task data input and output in API requests.
    """
    # Ensure priority field displays readable name in output (e.g., "High" instead of "H")
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = Task
        # Exclude updated_at field as it's typically managed automatically by the model
        fields = (
            'id', 
            'title', 
            'description', 
            'completed', 
            'created_at', 
            'due_date', 
            'priority', 
            'priority_display', # Add readable priority
            'is_recurring', 
            'ai_insight'
        )
        read_only_fields = ('created_at', 'ai_insight', 'priority_display',)