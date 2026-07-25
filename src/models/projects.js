import db from './db.js'



const getAllProjects = async () => {
  const query = `
SELECT
project.project_id,
project.organization_id,
project.title,
project.description,
project.location,
project.date,
organization.name

FROM public.project
JOIN public.organization ON organization.organization_id = project.organization_id;
    `;

  const result = await db.query(query);

  return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

async function getUpcomingProjects(number_of_projects) {
// const getUpcomingProjects = async (number_of_projects) => {
  const query = `
        SELECT
          project_id,
          title,
          project.description,
          date,
          location,
          organization.organization_id,
          organization.name as organization_name
        FROM public.project
        JOIN public.organization ON organization.organization_id = project.organization_id
        ORDER BY date
        LIMIT $1;
      `;
  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams);

  return result.rows;
}

async function getProjectDetails(id) {
  const query = `
        SELECT
          project_id,
          title,
          project.description,
          date,
          location,
          organization.organization_id,
          organization.name as organization_name
        FROM project
        JOIN public.organization ON organization.organization_id = project.organization_id
        WHERE project.project_id = $1
        ORDER BY date;
      `;
  const queryParams = [id];
  const result = await db.query(query, queryParams);

  return result.rows[0]; // return the first row (the project object)
}

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create organization');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (projectId, organizationId, title, description, location, date) => {
  const query = `
    UPDATE project
      SET organization_id = $1, title = $2, description = $3, location = $4, date = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const queryParams = [organizationId, title, description, location, date, projectId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', organizationId);
  }
  return result.rows[0].projectId;
}    

export { getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects, createProject, updateProject }  