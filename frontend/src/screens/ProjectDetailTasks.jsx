import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Badge, Button, Input } from '../components/ui';
import { useTasks } from '../hooks/useTasks';

export default function ProjectDetailTasks() {
  const { projectId } = useParams();
  const { tasks, isLoading, error, fetchTasks, createTask, updateTaskStatus, addSubtask, toggleSubtask } = useTasks(projectId);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const groupedTasks = {
    'Todo': tasks.filter(t => t.status === 'todo'),
    'In Progress': tasks.filter(t => t.status === 'in_progress'),
    'Done': tasks.filter(t => t.status === 'done')
  };

  // Mock sprint metrics for now as they aren't explicitly requested from backend
  const sprintMetrics = { velocity: 42, open: groupedTasks['Todo'].length + groupedTasks['In Progress'].length, closed: groupedTasks['Done'].length };

  if (isLoading) return <div className="p-6">Loading tasks...</div>;

  return (
    <div className="flex-1 overflow-auto p-6 flex gap-6">
      <div className="flex-1 space-y-8">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-headline-md font-semibold text-on-surface">{status}</h3>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-semibold">{statusTasks.length}</span>
            </div>
            
            <div className="space-y-2">
              {statusTasks.map(task => (
                <div key={task._id || task.id} className="bg-surface-container-lowest border border-surface-variant rounded-xl p-4 hover:border-outline-variant transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <button 
                        className="mt-1 flex-shrink-0 text-on-surface-variant hover:text-primary transition-colors"
                        onClick={() => updateTaskStatus(task._id, task.status === 'done' ? 'todo' : 'done')}
                      >
                        <span className="material-symbols-outlined">{task.status === 'done' ? 'check_circle' : 'radio_button_unchecked'}</span>
                      </button>
                      <div>
                        <h4 className={`font-label-md font-medium ${task.status === 'done' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{task.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          {task.priority && <Badge variant="warning">{task.priority}</Badge>}
                          {task.tags && task.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                        
                        {/* Subtasks */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-3 pl-2 border-l-2 border-surface-variant space-y-1">
                            {task.subtasks.map(sub => (
                              <div key={sub._id || sub.id} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={sub.completed} onChange={() => toggleSubtask(sub._id)} />
                                <span className={sub.completed ? 'line-through text-outline' : 'text-on-surface-variant'}>{sub.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {task.assignee && <Avatar src={task.assignee.avatar} initials={task.assignee.initials || 'A'} size="sm" />}
                  </div>
                </div>
              ))}

              {/* Inline Add Task */}
              {status === 'Todo' && (
                <form onSubmit={e => { 
                  e.preventDefault(); 
                  if(newTaskTitle.trim()) {
                    createTask({ title: newTaskTitle, status: 'todo' }); 
                    setNewTaskTitle(''); 
                  }
                }} className="flex items-center gap-2 p-2 rounded-xl border border-dashed border-surface-variant hover:bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-outline">add</span>
                  <input 
                    type="text" 
                    placeholder="Add new task..." 
                    className="bg-transparent border-none outline-none flex-1 text-sm"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                  />
                </form>
              )}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">task</span>
              <p>No tasks yet. Create one to get started.</p>
            </div>
        )}
      </div>

      {/* METRICS PANEL */}
      <aside className="w-80 space-y-6">
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5">
          <h3 className="font-headline-sm font-semibold mb-4">Sprint Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-on-surface-variant mb-1">
                <span>Velocity</span>
                <span className="font-semibold text-on-surface">{sprintMetrics.velocity || 0} pts</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-surface-container-low rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">{sprintMetrics.open || 0}</div>
                <div className="text-xs text-on-surface-variant mt-1">Open</div>
              </div>
              <div className="flex-1 bg-surface-container-low rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-600">{sprintMetrics.closed || 0}</div>
                <div className="text-xs text-on-surface-variant mt-1">Closed</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
