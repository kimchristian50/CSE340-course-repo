// Import any needed model functions 
import { getAllCategories } from '../models/categories.js'

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Categories';

    await res.render('categories', { title, categories });
};

// export any controller functions
export { showCategoriesPage };
