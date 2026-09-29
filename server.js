// Imports
// Import express using ESM syntax
import express from 'express';

//import paths
import { fileURLToPath } from 'url';
import path from 'path';

// Variables
//access environmental variable
const name = process.env.NAME;

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express setup
// Create an instance of an Express application
const app = express();

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


//routes
/**
 * Routes
 */
/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});

app.get('/about_us', (req, res) => {
    const title = 'About Me';
    res.render('about_us', { title });
});

app.get('/about_mulch', (req, res) => {
    const title = 'Our Products';
    res.render('about_mulch', { title });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});