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
let runningServer;

runServer()
    .then(onServerRunning)
    .catch(catchErrorAndShutdown("startup"));


function runServer() {
    return new Promise(resolve => runningServer = server.listen(process.env.PORT || 3000, resolve));
}


 function onServerRunning() {
    console.log('The server is running');
}

function catchErrorAndShutdown(location) {
    return function (err) {
        console.log(`location: ${location}`);
        console.error(err);
    }
}

/** Action to perform when application shutdown is called  **/
process.on("SIGINT", () => shutdown);

/** Listens to uncaught exceptions **/
process.on('uncaughtException', catchErrorAndShutdown('process.on(uncaughtException)'));

async function shutdown() {
    await closeDatabaseConnection();
    await stopServer();
}

async function closeDatabaseConnection() {
    // actions to perform
    return true;
}

const stopServer = () => {
    if (runningServer) runningServer.close();
    process.exit(0);
};
