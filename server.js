const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

// Constants
const configs = require('./src/constants/configConstants');
const urls = require('./src/constants/urlConstants');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const accountRoutes = require('./src/routes/accountRoutes');
const lecturerRoutes = require('./src/routes/lecturerRoutes');
const configurationRoutes = require('./src/routes/configurationRoutes');
const articleRoutes = require('./src/routes/articleRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

const rootUrl = urls.ROOT_API_URL;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
const whitelist = [
	'http://localhost:3001',
	'http://localhost:5000',
	'http://localhost:8080',
];
const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.use('/test', function (req, res) {
	res.json('text successfully');
});
app.use(`${rootUrl}${urls.AUTH_PREFIX_API_URL}`, authRoutes);
app.use(`${rootUrl}${urls.ACCOUNT_PREFIX_API_URL}`, accountRoutes);
app.use(`${rootUrl}${urls.LECTURER_PREFIX_API_URL}`, lecturerRoutes);
app.use(`${rootUrl}${urls.CONFIG_PREFIX_API_URL}`, configurationRoutes);
app.use(`${rootUrl}${urls.ARTICLE_PREFIX_API_URL}`, articleRoutes);
app.use(`${rootUrl}${urls.REPORT_PREFIX_API_URL}`, reportRoutes);

app.all('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ error: '404 Not Found' });
	} else {
		res.type('txt').send('404 Not Found');
	}
});

app.use(errorHandler);

app.listen(configs.APP_PORT, () => {
	console.log(`Server is serving on port ${configs.APP_PORT}`);
});
