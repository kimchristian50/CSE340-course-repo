// Import any needed model functions 
import { getAllProjects, getProjectDetails, getUpcomingProjects } from '../models/projects.js'

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    await res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const project_id = req.params.id;
    const project = await getProjectDetails(project_id);
    const title = 'Project Details';

    await res.render('project', { title, project });
}

// export any controller functions
export { showProjectsPage, showProjectDetailsPage };
