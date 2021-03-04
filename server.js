'use strict';

const Promise = require('bluebird');
global.Promise = Promise;

const { Sequelize, DataTypes } = require('sequelize');

const diContainer = require('./helper/di-container')();

diContainer.register('bcryptjs', require('bcryptjs'));
diContainer.register('jwt', require('jsonwebtoken'));

diContainer.register('config', require('./config'));

/**
 * Models
 */
diContainer.factory('User', require('./models/user-model'));

/**
 * Services
 */
diContainer.factory('HashService', require('./service/hash-service'));
diContainer.factory('TokenService', require('./service/token-service'));


