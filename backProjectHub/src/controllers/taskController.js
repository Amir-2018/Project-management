const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const query = {};

        // Filter by project if provided
        if (req.query.project) {
            query.project = req.query.project;
        }

        // Filter by assigned user if provided
        if (req.query.assignedTo) {
            query.assignedTo = req.query.assignedTo;
        }

        const tasks = await Task.find(query)
            .populate('project', 'name')
            .populate('assignedTo', 'name email');

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name')
            .populate('assignedTo', 'name email');

        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, project, assignedTo, dueDate } = req.body;

        // Verify project exists
        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user has access to the project
        const isOwner = projectExists.owner.toString() === req.user._id.toString();
        const isMember = projectExists.members.some(
            (member) => member.toString() === req.user._id.toString()
        );
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isMember && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            project,
            assignedTo,
            dueDate,
        });

        const populatedTask = await Task.findById(task._id)
            .populate('project', 'name')
            .populate('assignedTo', 'name email');

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to the project
        const isOwner = task.project.owner.toString() === req.user._id.toString();
        const isMember = task.project.members.some(
            (member) => member.toString() === req.user._id.toString()
        );
        const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isMember && !isAssigned && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const { title, description, status, priority, assignedTo, dueDate } = req.body;

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
        task.dueDate = dueDate || task.dueDate;

        const updatedTask = await task.save();

        const populatedTask = await Task.findById(updatedTask._id)
            .populate('project', 'name')
            .populate('assignedTo', 'name email');

        res.json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to delete (owner or admin)
        const isOwner = task.project.owner.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};
