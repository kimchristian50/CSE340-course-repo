// Import any needed model functions 
import { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory } from '../models/categories.js'

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

// export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };
