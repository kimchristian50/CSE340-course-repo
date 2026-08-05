// Import any needed model functions 
import { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js'
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for project form
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Categories';

    await res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const category_id = req.params.id;

    // fetch both the category details (for the header name) and the list of projects
    const category = await getCategoryDetails(category_id);
    const projects = await getProjectsByCategory(category_id);
    const title = 'Category Details';

    await res.render('category', { title, category, projects }); // the category here is the category.ejs view file
}

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;

    const projectDetails = await getProjectDetails(projectId);

    // Safeguard: If no project was found in the DB, redirect or show 404
    if (!projectDetails) {
        req.flash('error', 'Project not found.');
        return res.redirect('/projects');
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProject(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
}

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const selectedCategoryIds = req.body.categoryIds || [];

    // ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
}

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
}

const processNewCategoryForm = async (req, res) => {
    // Check for validation errors 1st
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // stop execution and immediately redirect to the form
        return res.redirect('/new-category');
    }
    // Extract form data from req.body
    const { name } = req.body;

    try {
        // Create the new project in the database - if validation has been passed
        const newCategoryId = await createCategory(name);

        req.flash('success', 'New category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error('Error creating new category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
}

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryDetails(categoryId);

    if (!category) {
        req.flash('error', 'Category not found.');
        return res.redirect('/categories');
    }
    
    const title = 'Edit Category';
    res.render('edit-category', { title, category });
}

const processEditCategoryForm = async (req, res) => {
    console.log("Form submission data:", req.body);
    const categoryId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit category form
        return res.redirect(`/edit-category/${categoryId}`);
    }
    const { name } = req.body; // gets the data from req.body
    try {
        // update in database
        await updateCategory(categoryId, name);
        // set a success flash message and redirect back to organization details
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        return res.redirect(`/edit-category/${categoryId}`);
    }
}

// export any controller functions
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, categoryValidation, showEditCategoryForm, processEditCategoryForm };
