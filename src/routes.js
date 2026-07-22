import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, processNewProjectForm, showNewProjectForm, projectValidation } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm , processAssignCategoriesForm } from './controllers/categories.js';
import {
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
// router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.get('/assign-categories/:id', showAssignCategoriesForm);

// Route to handle new organization/project form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.post('/new-project', projectValidation, processNewProjectForm);
// router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.post('/assign-categories/:id', processAssignCategoriesForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;