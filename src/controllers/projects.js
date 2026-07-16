// Import any needed model functions 
import { getAllProjects, getProjectDetails, getUpcomingProjects } from '../models/projects.js'
import { getCategoriesByProject } from '../models/categories.js'

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

// export any controller functions
export { showProjectsPage, showProjectDetailsPage };
