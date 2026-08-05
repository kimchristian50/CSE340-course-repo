import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
    RETURNING user_id
    `;

    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
}

const findUserByEmail = async (email) => {
    const query = `
    SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, r.role_name
    FROM users u
    JOIN roles r on u.role_id = r.role_id
    WHERE u.email = $1
    `;

    const queryParams = [email];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // user not found
    }

    return result.rows[0];
}

const getAllUsers = async () => {
    const query = `
    SELECT u.user_id, u.name, u.email, r.role_name
    FROM users u
    JOIN roles r on u.role_id = r.role_id
    `;

    const result = await db.query(query);

    return result.rows;
}

const verifyPassword = async (password, password_hash) => {
    return bcrypt.compare(password, password_hash);
}

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // check before trying to access user properties
    }
    console.log(user.role_name);

    // use verifyPassword to check if the password is correct
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    // if correct, remove password_hash and return the user object; if not, return null
    if (isPasswordValid) {
        delete user.password_hash;
        return user;
    } else {
        return null;
    }
}

const getUsersByProject = async (projectId) => {
    const query = `
       SELECT
        project.project_id,
        project_users.user_id,
        users.email,
        project.title
        FROM project
        JOIN project_users ON project.project_id = project_users.project_id
        JOIN users ON project_users.user_id = users.user_id
        WHERE project.project_id = $1;
      `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const addVolunteer = async (userId, projectId) => {
    const query = `
    INSERT INTO project_users (user_id, project_id)
    VALUES ($1, $2);
    `;

    await db.query(query, [userId, projectId]);
}

const removeVolunteer = async (userId, projectId) => {
    const deleteQuery = `
    DELETE FROM project_users
    WHERE project_id = $2 AND user_id = $1;
  `;

    await db.query(deleteQuery, [userId, projectId]);
}

const getAllUserProjects = async (userId) => {
    const query = `
       SELECT
        project.project_id,
        project_users.user_id,
        users.email,
        project.title
        FROM project
        JOIN project_users ON project.project_id = project_users.project_id
        JOIN users ON project_users.user_id = users.user_id
        WHERE users.user_id = $1;
      `;
    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

export { createUser, authenticateUser, getAllUsers, getUsersByProject, addVolunteer, removeVolunteer, getAllUserProjects }