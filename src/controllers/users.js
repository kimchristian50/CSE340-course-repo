import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers, addVolunteer, removeVolunteer, getAllUserProjects } from '../models/users.js';

const showUserRegistrationForm = async (req, res) => {
    const title = 'Register New User';

    res.render('register', { title });
}

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the new user registration in the database 
        const userId = await createUser(name, email, passwordHash);

        // redirect to home page after successful registration
        req.flash('success', 'New user created successfully!');
        res.redirect(`/`);
    } catch (error) {
        console.error('Error creating new user:', error);
        req.flash('error', 'There was an error creating the user.');
        res.redirect('/register');
    }
}

const showLoginForm = async (req, res) => {
    const title = 'User Login';

    res.render('login', { title });
}

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            // store user info in session
            req.session.user = user;
            req.flash('success', 'Login was successful!');
            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }
            // make sure the session saves before redirecting
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error", err);
                }
                // redirect since login was successful and the session was saved
                res.redirect(`/dashboard`);
            })

        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        req.flash('error', 'There was an error with the user login.');
        res.redirect('/login');
    }
}

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    req.flash('success', 'Logout successful!');
    res.redirect('/login');
}

const requireLogin = (req, res, next) => {
    // check if session or user does not exist
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
}

const showDashboard = async (req, res) => {
    const user = req.session.user;
    const userId = req.session.user.user_id;
    const userProjects = await getAllUserProjects(userId);
    const title = 'Dashboard';
    const subtitle = 'Your Projects';

    res.render('dashboard', { title, name: user.name, email: user.email, subtitle, userProjects });
}

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        // User has required role, continue
        next();
    };
};

const showUsers = async (req, res) => {
    const users = await getAllUsers();

    const title = 'All Users';
    res.render('users', { title, users });
}

const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You have signed up to volunteer for this project!');
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'There was an error signing you up.');
    }
    res.redirect(`/project/${projectId}`);
};

const removeVolunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have removed yourself as a volunteer for this project!');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'There was an error removing you as a volunteer.');
    }
    const referrer = req.get('Referrer')
    if (referrer && referrer.includes('dashboard')) {
        res.redirect(referrer);
    } else {
        res.redirect(`/project/${projectId}`);
    }
}

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsers,
    volunteerForProject,
    removeVolunteerForProject
};