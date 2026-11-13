// Imports
// Import express using ESM syntax
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupDatabase, testConnection } from './src/models/setup.js';

// Import MVC components
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';

// Server Configuration
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

// Allow Express to receive and process POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/**
 * Global Middleware
 */
app.use(addLocalVariables);

// don't delete this one! It logs for all routes
app.use((req, res, next) => {
    // Skip logging for routes that start with /. (like /.well-known/)
    if (!req.path.startsWith('/.')) {
        //I really like this console log, keep forever!
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

/**
 * Routes
 */
app.use('/', routes);
// I think we can get rid of these?
//app.get('/', (req, res) => {
  //  const title = 'Welcome Home';
  //  res.render('home', { title });
//});

//app.get('/about_us', (req, res) => {
  //  const title = 'About Me';
  //  res.render('about_us', { title });
//});

//app.get('/about_mulch', (req, res) => {
  //  const title = 'Our Products';
  //  res.render('about_mulch', { title });
//});

// Course detail page with route parameter
//app.get('/catalog/:courseId', (req, res) => {
    // Extract the course ID from the URL
  //  const courseId = req.params.courseId;

    // Look up the course in our data
    //const course = courses[courseId];

    // Handle course not found
    //if (!course) {
      //  const err = new Error(`Course ${courseId} not found`);
        //err.status = 404;
       // return next(err);
    //}

    // Log the parameter for debugging
    //console.log('Viewing course:', courseId);

    // Render the course detail template
    //res.render('course-detail', {
      //  title: `${course.id} - ${course.title}`,
       // course: course
    //});
//});

/**
 * Error Handling
 */
// 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Prevent infinite loops, if a response has already been sent, do nothing
    if (res.headersSent || res.finished) {
        return next(err);
    }

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV // Our WebSocket check needs this and its convenient to pass along
    };

    // Render the appropriate error template with fallback
    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        // If rendering fails, send a simple error page instead
        if (!res.headersSent) {
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
});


// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}


// Start the server and listen on the specified port
app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
