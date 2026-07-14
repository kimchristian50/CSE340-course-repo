// Import any needed model functions 
import { getAllProjects } from '../models/projects.js'

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    await res.render('projects', { title, projects });
};

// export any controller functions
export { showProjectsPage };
