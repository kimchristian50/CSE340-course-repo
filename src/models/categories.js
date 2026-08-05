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
          title,
          description
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

const assignCategoryToProject = async (categoryId, projectId ) => {
  const query = `
    INSERT INTO project_category (category_id, project_id)
    VALUES ($1, $2);
    `;
  
  await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
  // first delete existing categories for the project
  const deleteQuery = `
    DELETE FROM project_category
    WHERE project_id = $1;
  `;
  await db.query(deleteQuery, [projectId]);

  // next add the new category assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId)
  }
}

const createCategory = async (name) => {
  const query = `
    INSERT INTO category (name)
    VALUES ($1)
    RETURNING category_id
    `;
  
  const queryParam = [name];
  const result = await db.query(query, queryParam);

  if (result.rows.length === 0) {
    throw new Error('Failed to create organization');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new category with ID:', result.rows[0].category_id);
  }

  return result.rows[0].category_id;
}

const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;

  const queryParams = [name, categoryId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated category with ID:', categoryId);
  }

  return result.rows[0].category_id;
};


export { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory, updateCategoryAssignments, createCategory, updateCategory  }  