'use strict';

const Promise = require('bluebird');
global.Promise = Promise;

// loads environment variables from .env file into process.env
require('dotenv').config();

const config = require('./config');

const diContainer = require('./util/di-container')();

diContainer.registerDependency('bcryptjs', require('bcryptjs'));
diContainer.registerDependency('jwt', require('jsonwebtoken'));

diContainer.registerDependency('config', config);

const { Sequelize, DataTypes } = require('sequelize');

diContainer.registerDependency('Sequelize', Sequelize);
diContainer.registerDependency('DataTypes', DataTypes);
diContainer.registerFactory('db', require('./util/db'));

diContainer.registerDependency('redis', require('redis'));
diContainer.registerFactory('RedisClient', require('./util/redis'));

const { Router } = require('express');
diContainer.registerDependency('Router', Router);


/**
 * Middleware
 */
diContainer.registerFactory('AuthMiddleware', require('./middleware/auth.middleware'));

/**
 * Models
 */
diContainer.registerFactory('CaretakerPatientLink', require('./models/caretaker-patient-link.model'));
diContainer.registerFactory('Medicine', require('./models/medicine.model'));
diContainer.registerFactory('User', require('./models/user.model'));
diContainer.registerFactory('UserMedicine', require('./models/user-medicine.model'));

/**
 * Services
 */
diContainer.registerFactory('CaretakerPatientLinkService', require('./service/caretaker-patient-link.service'));
diContainer.registerFactory('HashService', require('./service/hash.service'));
diContainer.registerFactory('MedicineService', require('./service/medicine.service'));
diContainer.registerFactory('TokenService', require('./service/token.service'));
diContainer.registerFactory('UserService', require('./service/user.service'));

/**
 * Interactor
 */
diContainer.registerFactory('AdminInteractor', require('./interactor/admin.interactor'));
diContainer.registerFactory('AuthInteractor', require('./interactor/auth.interactor'));
diContainer.registerFactory('PatientInteractor', require('./interactor/patient.interactor'));


/**
 * Controller
 */
diContainer.registerFactory('AdminController', require('./controller/admin.controller'));
diContainer.registerFactory('AuthController', require('./controller/auth.controller'));
diContainer.registerFactory('PatientController', require('./controller/patient.controller'));


/**
 * Routes
 */
diContainer.registerFactory('AdminRoutes', require('./routes/admin.routes'));
diContainer.registerFactory('AuthRoutes', require('./routes/auth.routes'));
diContainer.registerFactory('PatientRoutes', require('./routes/patient.routes'));



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


const AuthMiddleware = diContainer.get('AuthMiddleware');

/**
 * Register Routes to Server
 */
server.use('/auth', diContainer.get('AuthRoutes'));

server.use('/patient', diContainer.get('PatientRoutes'));

server.use('/admin',
    AuthMiddleware.authenticationMiddleware,
    AuthMiddleware.userTypeAccessMiddleware([config.user.types.admin]),
    diContainer.get('AdminRoutes')
);


/**
 * Setting Up Of The Server
 */
let runningServer, db;


runServer()
    .then(testDatabaseConnection)
    .then(syncDatabase)
    .then(onServerRunning)
    // .then(createAccountForEachDifferentUserType)
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

async function syncDatabase() {
    console.log('* Start with syncing database.');
    await db.sync();
    console.log('* Syncing database is done.');
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
        console.error('* Something went wrong when closing connection to database:', error);
    }
}

const stopServer = () => {
    if (runningServer) runningServer.close();
    process.exit(0);
};

/**
 * This is for creating a Admin & Caretaker account
 *
 */
async function createAccountForEachDifferentUserType() {
    const UserService = diContainer.get('UserService');

    console.log(`Create admin`)
    await UserService.createUser("admin@hva.nl", "password", "Admin", "lastName", config.user.types.admin);

    console.log(`Create caretaker`)
    await UserService.createUser("caretaker@hva.nl", "password", "Caretaker", "lastName", config.user.types.caretaker);

    console.log(`Create patient`)
    await UserService.createUser("patient@hva.nl", "password", "Patient", "lastName", config.user.types.patient);
}
