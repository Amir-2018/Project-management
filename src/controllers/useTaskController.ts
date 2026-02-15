import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, Attachment } from '../models';
import { taskService } from '../services';

export const useTaskController = (projectId?: number) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(() => {
        setLoading(true);
        const data = projectId
            ? taskService.getTasksByProject(projectId)
            : taskService.getAllTasks();
        setTasks(data);
        setLoading(false);
    }, [projectId]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const addTask = (task: Omit<Task, 'id' | 'comments' | 'attachments'>) => {
        const newTask = taskService.addTask(task);
        fetchTasks();
        return newTask;
    };

    const updateTaskStatus = (taskId: string, status: TaskStatus) => {
        taskService.updateTaskStatus(taskId, status);
        fetchTasks();
    };

    const addComment = (taskId: string, userId: string, userName: string, text: string) => {
        taskService.addComment(taskId, userId, userName, text);
        fetchTasks();
    };

    const addAttachment = (taskId: string, attachment: Omit<Attachment, 'id' | 'uploadedAt'>) => {
        taskService.addAttachment(taskId, attachment);
        fetchTasks();
    };

    const deleteTask = (taskId: string) => {
        taskService.deleteTask(taskId);
        fetchTasks();
    };

    return {
        tasks,
        loading,
        addTask,
        updateTaskStatus,
        addComment,
        addAttachment,
        deleteTask,
        refreshTasks: fetchTasks
    };
};
