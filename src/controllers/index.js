// Route handlers for static pages
const homePage = (req, res) => {
    res.render('home', { title: 'Home' });
};

const aboutPage = (req, res) => {
    res.render('about_us', { title: 'About' });
};

export { homePage, aboutPage };