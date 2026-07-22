// Import any needed model functions 
import { getAllProjects, getProjectDetails, getUpcomingProjects, createProject } from '../models/projects.js'
import { getCategoriesByProject } from '../models/categories.js'
import { getAllOrganizations } from '../models/organizations.js'
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define validation and sanitization rules for project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 1000 })
        .withMessage('Organization description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required')
        .isLength({ max: 200 })
        .withMessage('Project title must be between 3 and 150 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    await res.render('projects', { title, projects });
};

// this give me project_id, title, description, date, location, organization_id, organization_name - getProjectDetails +
// project_id, category_id, name (category name) and title (project title) - getCategoriesByProject
const showProjectDetailsPage = async (req, res) => {
    const project_id = req.params.id;
    const project = await getProjectDetails(project_id);
    const categories = await getCategoriesByProject(project_id);
    const title = 'Project Details';

    await res.render('project', { title, project, categories }); // the 'project' here is the project.ejs view file
}

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Check for validation errors 1st
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // stop execution and immediately redirect to the form
        return res.redirect('/new-project');
    }
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database - if validation has been passed
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

// export any controller functions
export { showProjectsPage, showProjectDetailsPage, processNewProjectForm, showNewProjectForm, projectValidation };
