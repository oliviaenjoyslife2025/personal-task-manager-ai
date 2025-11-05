import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Grid,
  Divider
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Close as CloseIcon, Insights as InsightsIcon } from '@mui/icons-material';

// ----------------- CONFIGURATION -----------------
const API_BASE_URL = '/v1/tasks/';

const TaskPriorityOptions = [
  { value: 'H', label: 'High', color: 'error' }, // MUI default error is red
  { value: 'M', label: 'Medium', color: 'warning' }, // MUI default warning is orange
  { value: 'L', label: 'Low', color: 'primary' }, // Using primary for low/info, which we'll keep soft
];

const getPriorityColor = (priorityValue) => {
  return TaskPriorityOptions.find(p => p.value === priorityValue)?.color || 'default';
};


// ----------------- MAIN COMPONENT -----------------

function App() {
  // State for task data
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for new task input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('M');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  
  // State for editing task
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // State for AI Insight panel
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // State for Snackbar notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // --- Utility Functions ---
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };


  // --- API Handlers ---

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Enable exponential backoff retry mechanism
      let response;
      const maxRetries = 3;
      for (let i = 0; i < maxRetries; i++) {
        try {
          response = await axios.get(API_BASE_URL);
          break; // Success
        } catch (err) {
          if (i === maxRetries - 1) throw err;
          // Exponential backoff: 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }

      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showSnackbar('Failed to load tasks. Check backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      showSnackbar('Task title cannot be empty.', 'warning');
      return;
    }

    const taskData = {
      title: newTaskTitle,
      priority: newTaskPriority,
      // Only include due_date if it's set
      due_date: newTaskDueDate || null,
      description: ''
    };

    try {
      await axios.post(API_BASE_URL, taskData);
      setNewTaskTitle('');
      setNewTaskPriority('M');
      setNewTaskDueDate('');
      fetchTasks();
      showSnackbar('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      showSnackbar('Failed to add task.', 'error');
    }
  };

  const handleToggleComplete = async (task) => {
    const updatedTask = { completed: !task.completed };
    try {
      await axios.patch(`${API_BASE_URL}${task.id}/`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      showSnackbar('Failed to update task status.', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}${id}/`);
      fetchTasks();
      showSnackbar('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      showSnackbar('Failed to delete task.', 'error');
    }
  };
  
  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };
  
  const handleSaveEdit = async (id) => {
    if (!editingTitle.trim()) {
      showSnackbar('Task title cannot be empty.', 'warning');
      return;
    }
    const updatedData = { title: editingTitle };
    try {
      await axios.patch(`${API_BASE_URL}${id}/`, updatedData);
      setEditingId(null);
      fetchTasks();
      showSnackbar('Task updated successfully!');
    } catch (error) {
      console.error('Error saving task:', error);
      showSnackbar('Failed to save task.', 'error');
    }
  };

  // --- AI Analysis Handler (Placeholder) ---

  const handleGenerateInsight = async () => {
    setAiLoading(true);
    setAiInsight('Analyzing past task data...');
    try {
      // ⚠️ FUTURE: This will be a POST request to a dedicated AI endpoint like /api/analyze/
      // For now, we simulate the logic client-side and post a placeholder to the first task if possible
      
      const insightText = "AI Insight: Your task completion rate in the last 72 hours is 85%. You tend to schedule high-priority tasks in the late evening, suggesting effective focus during non-standard working hours. Consider front-loading medium tasks to clear your mornings.";
      
      setAiInsight(insightText);

      // We don't have the backend AI endpoint yet, so we just simulate and show the text.
      showSnackbar('AI analysis simulated successfully.', 'info');

    } catch (error) {
      console.error('Error generating AI insight:', error);
      setAiInsight('Error fetching AI insight.');
      showSnackbar('Failed to get AI insight.', 'error');
    } finally {
      setAiLoading(false);
    }
  };


  // --- Rendering Functions ---

  const renderTaskItem = (task) => {
    const isEditing = editingId === task.id;
    const priorityColor = getPriorityColor(task.priority);
    // Format date nicely
    const dueDateText = task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'No Due Date';

    return (
      <ListItem 
        key={task.id} 
        divider 
        sx={{
          borderRadius: 1,
          transition: 'all 0.2s',
          opacity: task.completed ? 0.7 : 1,
          bgcolor: task.completed ? 'grey.50' : 'transparent',
          '&:hover': {
            bgcolor: task.completed ? 'grey.100' : 'action.hover'
          }
        }}
        secondaryAction={
          <ListItemSecondaryAction>
            {isEditing ? (
              <IconButton edge="end" aria-label="save" onClick={() => handleSaveEdit(task.id)} color="primary">
                <SaveIcon />
              </IconButton>
            ) : (
              <IconButton 
                edge="end" 
                aria-label="edit" 
                onClick={() => handleEdit(task)} 
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)} color="error" size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        }
      >
        <Checkbox
          edge="start"
          checked={task.completed}
          tabIndex={-1}
          disableRipple
          onChange={() => handleToggleComplete(task)}
        />
        {isEditing ? (
          <TextField
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === 'Enter') handleSaveEdit(task.id);
            }}
            fullWidth
            size="small"
            variant="standard"
          />
        ) : (
          <ListItemText
            primary={
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 'medium',
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}
              >
                {task.title}
              </Typography>
            }
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Typography component="span" variant="body2" color={priorityColor} sx={{ fontWeight: 'semibold' }}>
                  {task.priority_display}
                </Typography>
                <Typography component="span" variant="caption" color="text.secondary">
                  {dueDateText}
                </Typography>
                {task.is_recurring && (
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    (Recurring)
                  </Typography>
                )}
              </Box>
            }
          />
        )}
      </ListItem>
    );
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4, 
        minHeight: '100vh',
        bgcolor: '#f0f8ff'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'text.primary',
            mb: 4
          }}
        >
          Personal AI Task Manager
        </Typography>

        <Stack spacing={4}>
          {/* Upper Section: Add New Task (Left) and Task List (Right) */}
          <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
            {/* Left Column: Add New Task */}
            <Grid item xs={12} md={6}>
              <Paper 
                component="form" 
                onSubmit={handleAddTask}
                elevation={1}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: '#e0f2fe'
                }}
              >
                <Stack spacing={3}>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Add New Task
                  </Typography>
                  
                  <TextField
                    label="Task Title"
                    variant="outlined"
                    fullWidth
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                          labelId="priority-label"
                          label="Priority"
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value)}
                        >
                          {TaskPriorityOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Due Date (Optional)"
                        type="datetime-local"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    sx={{ mt: 1 }}
                  >
                    Add Task
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Right Column: Task List */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3,
                    color: 'text.secondary',
                    fontWeight: 'medium'
                  }}
                >
                  Task List ({tasks.filter(t => !t.completed).length} Pending)
                </Typography>

                {loading ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 200,
                      gap: 2
                    }}
                  >
                    <CircularProgress color="primary" />
                    <Typography variant="body1" color="text.secondary">
                      Loading tasks...
                    </Typography>
                  </Box>
                ) : tasks.length === 0 ? (
                  <Alert severity="info" variant="outlined">
                    No tasks found. Start by adding a new one above!
                  </Alert>
                ) : (
                  <Paper 
                    elevation={1}
                    sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      bgcolor: '#f3e8ff'
                    }}
                  >
                    <List sx={{ p: 0 }}>
                      {tasks.map(renderTaskItem)}
                    </List>
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider />

          {/* Lower Section: AI Behavioral Insights (Full Width) */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: '#fff9e6', 
              borderRadius: 2,
              borderLeft: 4,
              borderColor: '#fbbf24'
            }}
          >
            <Stack spacing={2}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <InsightsIcon /> AI Behavioral Insights
              </Typography>
              <Button 
                variant="outlined" 
                onClick={handleGenerateInsight} 
                disabled={aiLoading}
                sx={{ 
                  alignSelf: 'flex-start',
                  borderColor: '#fbbf24',
                  color: '#92400e',
                  '&:hover': {
                    borderColor: '#f59e0b',
                    bgcolor: '#fef3c7'
                  }
                }}
              >
                {aiLoading ? (
                  <CircularProgress size={20} sx={{ mr: 1, color: '#92400e' }} />
                ) : null}
                Analyze My Habits
              </Button>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  minHeight: 60
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {aiInsight || "Click 'Analyze My Habits' to get insights based on your recent task data (completion rates, scheduling, priority trends)."}
                </Typography>
              </Paper>
            </Stack>
          </Paper>
        </Stack>
      </Paper>

      {/* --- SNACKBAR NOTIFICATIONS --- */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;