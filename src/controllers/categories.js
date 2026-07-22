// Import any needed model functions 
import { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory, updateCategoryAssignments } from '../models/categories.js'
import { getProjectDetails } from '../models/projects.js'

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

// export any controller functions
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };
