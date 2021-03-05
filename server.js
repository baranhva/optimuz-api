'use strict';

const Promise = require('bluebird');
global.Promise = Promise;

const config = require('./config');

const { Sequelize, DataTypes } = require('sequelize');

const diContainer = require('./helper/di-container')();

diContainer.register('bcryptjs', require('bcryptjs'));
diContainer.register('jwt', require('jsonwebtoken'));

diContainer.register('config', config);

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

