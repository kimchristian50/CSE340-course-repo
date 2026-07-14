// Import any needed model functions (none are needed for the home page)

// Define any controller functions
const showHomePage = async (req, res) => {
    const title = 'Home';

    res.render('home', { title });
};

// export any controller functions
export { showHomePage };