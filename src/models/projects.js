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

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */
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

export { getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects, createProject }  