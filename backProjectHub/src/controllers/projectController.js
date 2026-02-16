const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const query = {};

        // Filter by user's projects (owner or member)
        if (req.user.role !== 'admin') {
            query.$or = [
                { owner: req.user._id },
                { members: req.user._id }
            ];
        }

        const projects = await Project.find(query)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { name, description, status, members, startDate, endDate } = req.body;

        const project = await Project.create({
            name,
            description,
            status,
            owner: req.user._id,
            members: members || [],
            startDate,
            endDate,
        });

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        res.status(201).json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is owner or admin
        if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        const { name, description, status, startDate, endDate } = req.body;

        project.name = name || project.name;
        project.description = description !== undefined ? description : project.description;
        project.status = status || project.status;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;

        const updatedProject = await project.save();

        const populatedProject = await Project.findById(updatedProject._id)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        res.json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is owner or admin
        if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
const addMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is owner or admin
        if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add members' });
        }

        const { userId } = req.body;

        if (project.members.includes(userId)) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        project.members.push(userId);
        await project.save();

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        res.json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is owner or admin
        if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to remove members' });
        }

        project.members = project.members.filter(
            (member) => member.toString() !== req.params.userId
        );

        await project.save();

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        res.json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
};
