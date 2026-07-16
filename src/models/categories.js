import db from './db.js'

const getAllCategories = async () => {
  const query = `
      SELECT category_id, name
      FROM category;
    `;

  const result = await db.query(query);

  return result.rows;
}

async function getCategoryDetails(id) {
  const query = `
        SELECT
          category_id,
          name
          FROM category
        WHERE category.category_id = $1;
      `;
  const queryParams = [id];
  const result = await db.query(query, queryParams);

  return result.rows[0]; // return the first row (the category object)
}

async function getProjectsByCategory(category_id) {
  const query = `
        SELECT
          category.category_id,
          name,
          project.project_id,
          title
        FROM project
        JOIN project_category ON project.project_id = project_category.project_id
        JOIN category ON project_category.category_id = category.category_id
        WHERE category.category_id = $1;
      `;
  const queryParams = [category_id];
  const result = await db.query(query, queryParams);

  return result.rows;
}

// this gets me project_id, category_id, name (category name) and title (project title)
async function getCategoriesByProject(project_id) {
  const query = `
         SELECT
		  project.project_id,
          category.category_id,
          name,
          title
        FROM project
        JOIN project_category ON project.project_id = project_category.project_id
        JOIN category ON project_category.category_id = category.category_id
        WHERE project.project_id = $1;
      `;
  const queryParams = [project_id];
  const result = await db.query(query, queryParams);

  return result.rows;
}

export { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory }  