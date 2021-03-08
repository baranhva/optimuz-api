'use strict';

const Promise = require('bluebird');
global.Promise = Promise;

// loads environment variables from .env file into process.env
require('dotenv').config();

const config = require('./config');

const diContainer = require('./helper/di-container')();

diContainer.register('bcryptjs', require('bcryptjs'));
diContainer.register('jwt', require('jsonwebtoken'));

diContainer.register('config', config);

const { Sequelize, DataTypes } = require('sequelize');

diContainer.register('Sequelize', Sequelize);
diContainer.register('DataTypes', DataTypes);
diContainer.factory('db', require('./db'));

const { Router } = require('express');
diContainer.register('Router', Router);

/**
 * Models
 */
diContainer.factory('User', require('./models/user-model'));

/**
 * Services
 */
diContainer.factory('HashService', require('./service/hash-service'));
diContainer.factory('TokenService', require('./service/token-service'));
diContainer.factory('UserService', require('./service/user-service'));

/**
 * Interactor
 */
diContainer.factory('PatientInteractor', require('./interactor/patient-interactor'));


/**
 * Controller
 */
diContainer.factory('PatientController', require('./controller/patient-controller'));


/**
 * Routes
 */
diContainer.factory('PatientRoutes', require('./routes/patient-routes'));



/**
 * Server
 */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');

const server = express();

// Middleware that enables Cross Origin Resource Sharing
server.use(cors());

// Sets morgan as the logger and initialize it with our custom logging structure
server.use(morgan(config.logging.network.detailed));

// server.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON body and limit the request size to '250kb'
server.use(bodyParser.json({limit: '250kb'}));

// Hide the fact that express is used
server.disable('x-powered-by');

// compress all responses
server.use(compression());


/**
 * Register Routes to Server
 */
server.use('/patient', diContainer.get('PatientRoutes'));


/**
 * Setting Up Of The Server
 */
let runningServer, db;


runServer()
    .then(testDatabaseConnection)
    .then(onServerRunning)
    .catch(catchErrorAndShutdown("startup"));


function runServer() {
    return new Promise(resolve => runningServer = server.listen(process.env.PORT, resolve));
}

async function testDatabaseConnection() {
    try {
        db = diContainer.get('db');
        await db.authenticate();
        console.log('* Connection to database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

 function onServerRunning() {
    console.log(`* The server is running on port: ${process.env.PORT}`);
}

function catchErrorAndShutdown(location) {
    return function (err) {
        console.log(`location: ${location}`);
        console.error(err);
    }
}

/** Action to perform when application shutdown is called  **/
process.on("SIGINT", () => shutdown());

/** Listens to uncaught exceptions **/
process.on('uncaughtException', catchErrorAndShutdown('process.on(uncaughtException)'));

async function shutdown() {
    await closeDatabaseConnection();
    await stopServer();
}

async function closeDatabaseConnection() {
    try {
        await db.close();
        console.log('* Connection to database is closed.');
    } catch(error) {
        console.error('* Something whent wrong when closing connection to database:', error);
    }
}

const stopServer = () => {
    if (runningServer) runningServer.close();
    process.exit(0);
};
