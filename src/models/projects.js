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
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId }  