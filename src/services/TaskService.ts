import { Task, TaskStatus, Comment, Attachment } from '../models';

class TaskService {
    private STORAGE_KEY = 'camping_management_tasks';

    private getTasks(): Task[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            // Seed initial data for demo
            const initialTasks: Task[] = [
                {
                    id: '1',
                    projectId: 1,
                    title: 'Design UI for Dashboard',
                    description: 'Create a modern and clean UI for the main dashboard.',
                    status: 'In Progress',
                    priority: 'High',
                    assignee: 'Amir',
                    dueDate: '2026-02-20',
                    attachments: [],
                    comments: [
                        { id: 'c1', userId: 'u1', userName: 'Amir', text: 'Working on the color palette now.', createdAt: new Date().toISOString() }
                    ]
                },
                {
                    id: '2',
                    projectId: 1,
                    title: 'Setup Project Structure',
                    description: 'Initialize the React project with TypeScript and Tailwind CSS.',
                    status: 'Done',
                    priority: 'Medium',
                    assignee: 'Dev',
                    dueDate: '2026-02-14',
                    attachments: [],
                    comments: []
                },
                {
                    id: '3',
                    projectId: 1,
                    title: 'Implement Authentication',
                    description: 'Login and logout functionality using AuthContext.',
                    status: 'Done',
                    priority: 'High',
                    assignee: 'Dev',
                    dueDate: '2026-02-15',
                    attachments: [],
                    comments: []
                }
            ];
            this.saveTasks(initialTasks);
            return initialTasks;
        }
        return JSON.parse(stored);
    }

    private saveTasks(tasks: Task[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }

    public getAllTasks(): Task[] {
        return this.getTasks();
    }

    public getTasksByProject(projectId: number): Task[] {
        return this.getTasks().filter(t => t.projectId === projectId);
    }

    public addTask(task: Omit<Task, 'id' | 'comments' | 'attachments'>): Task {
        const tasks = this.getTasks();
        const newTask: Task = {
            ...task,
            id: Math.random().toString(36).substr(2, 9),
            comments: [],
            attachments: []
        };
        tasks.push(newTask);
        this.saveTasks(tasks);
        return newTask;
    }

    public updateTaskStatus(taskId: string, status: TaskStatus): void {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index].status = status;
            this.saveTasks(tasks);
        }
    }

    public addComment(taskId: string, userId: string, userName: string, text: string): void {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const newComment: Comment = {
                id: Math.random().toString(36).substr(2, 9),
                userId,
                userName,
                text,
                createdAt: new Date().toISOString()
            };
            tasks[index].comments.push(newComment);
            this.saveTasks(tasks);
        }
    }

    public addAttachment(taskId: string, attachment: Omit<Attachment, 'id' | 'uploadedAt'>): void {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const newAttachment: Attachment = {
                ...attachment,
                id: Math.random().toString(36).substr(2, 9),
                uploadedAt: new Date().toISOString()
            };
            tasks[index].attachments.push(newAttachment);
            this.saveTasks(tasks);
        }
    }

    public updateTask(taskId: string, updates: Partial<Task>): void {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            this.saveTasks(tasks);
        }
    }

    public deleteTask(taskId: string): void {
        const tasks = this.getTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        this.saveTasks(filtered);
    }
}

export const taskService = new TaskService();
