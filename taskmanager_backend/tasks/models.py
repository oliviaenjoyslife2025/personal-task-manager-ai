from django.db import models

# Define enumeration for task priority
class TaskPriority(models.TextChoices):
    HIGH = 'H', 'High'
    MEDIUM = 'M', 'Medium'
    LOW = 'L', 'Low'

class Task(models.Model):
    """
    Main task model for personal task manager
    """
    title = models.CharField(max_length=255, verbose_name="Task Title")
    description = models.TextField(blank=True, null=True, verbose_name="Task Description")
    
    # Status and timestamps
    completed = models.BooleanField(default=False, verbose_name="Completed")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")
    due_date = models.DateTimeField(blank=True, null=True, verbose_name="Due Date")

    # Priority and recurrence
    priority = models.CharField(
        max_length=1,
        choices=TaskPriority.choices,
        default=TaskPriority.MEDIUM,
        verbose_name="Priority"
    )
    is_recurring = models.BooleanField(default=False, verbose_name="Is Recurring")
    
    # ----------------- AI Related Fields -----------------
    # Store AI-analyzed user habit insights or task difficulty assessments
    ai_insight = models.TextField(
        blank=True, 
        null=True, 
        verbose_name="AI Insight",
        help_text="Behavior insights text generated based on user history"
    )
    
    def __str__(self):
        return self.title

    class Meta:
        # Order by due date or creation date in descending order
        ordering = ['due_date', '-created_at']
        verbose_name = "Task"
        verbose_name_plural = "Tasks"