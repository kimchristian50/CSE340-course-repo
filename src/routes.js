import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showProjectsPage, showProjectDetailsPage, processNewProjectForm, showNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categories.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.get('/assign-categories/:id', showAssignCategoriesForm);
router.get('/edit-project/:id', showEditProjectForm);
router.get('/new-category', showNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);

// Route to handle new form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.post('/assign-categories/:id', processAssignCategoriesForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);

// Route to handle the edit form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;