# The Dependency Inversion Principle

We have created a DI-container in our NodeJS api which is responsible for loading all needed dependencies for each dependency required. 

We do this by specifying the used dependencies in the parameter of the exported function of each file. 

The Di-Container searches for each dependency needed in each module. If a dependency is not yet initialised then it will do this in the same manner. The controllers, interacters, services & routes are all Singletons who only have to be setup once. 


We have a single place where we need to register all the needed dependencies. There is no hard connection to any dependency. 


You can easily now swap out a dependency as long as the replaced dependency has the functions that are being called. This makes it way easier to test in isolation without having to actually use all the dependencies.


## DI-Container

```Javascript
const argsList = require('args-list');

module.exports = function () {

    let dependencies = {};
    let factories = {};
    let svc = {};

    svc.registerFactory = function (name, factory) {
        factories[name] = factory;
    };

    svc.register = function (name, dep) {
        dependencies[name] = dep;
    };

    svc.get = function (name) {
        if (!dependencies[name]) {
            let factory = factories[name];
            dependencies[name] = factory && svc.inject(factory);
            if (!dependencies[name]) {
                throw new Error('Cannot find module: ' + name)
            }
        }
        return dependencies[name];
    };

    svc.inject = function (factory) {
        let args = argsList(factory)
            .map(function (dependency) {
                return svc.get(dependency)
            });
        return factory.apply(null, args);
    };

    return svc;
};

```

## Modules

To demonstrate how we implement our modules I have added the PatientController and HashService modules.
Here you can see that we declare a function on the main exports. The parameters of this function are the dependencies used by the module.

### PatientController

```Javascript
module.exports = function(PatientInteractor) {

    let ctrl = {};

    ctrl.performTest = async function(req, res) {
        try {
            const {email, password, firstName, lastName} = req.body;
            res.json({ msg: "The returned result" });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    ctrl.createPatientAccount = async function(req, res) {
        try {
            const {email, password, firstName, lastName} = req.body;
            await PatientInteractor.createPatientAccount(email, password, firstName, lastName);
            res.json({ successful: true });
        } catch (err) {
            res.sendStatus(500);
        }
    };

    return ctrl;
};

```

### HashService

```Javascript
module.exports = function(bcryptjs, SALT_NUMBER) {
    let svc = {};

    svc.hash = async function(value) {
        const salt = await bcryptjs.genSalt(SALT_NUMBER);
        return await bcryptjs.hash(value, salt);
    };

    svc.compare = async function(givenValue, hashedValue) {
        const valid = await bcryptjs.compare(givenValue, hashedValue);
        return valid === true;
    };

    return svc;
};

```

## server.js

There need to be at least one place where all the dependencies that are used are registered to the Di-Container.
In the file server.js we set everything up and here we will also register all the dependencies.

The Di-Container has two ways, the first is the register function.
This is used for adding a dependency that has a fixed value. This can be a single value or a module that is already setup and does not need to be initialised.
The other way is with the registerFactory function which adds the dependency and when loaded needs to be initialised if not done yet.


Below you can see how we load the diContainer, add third party modules by using register() and adding our own modules using the **registerFactory**.
We then load the PatientRoutes dependency by using the diContainers.get() function which will start the process of loading all the dependencies for each module that is being used.


````Javascript

const diContainer = require('./di-container')();

diContainer.register('bcryptjs', require('bcryptjs'));
diContainer.register('jwt', require('jsonwebtoken'));

diContainer.register('config', config);

const { Router } = require('express');
diContainer.register('Router', Router);

/**
 * Models
 */
diContainer.registerFactory('User', require('./user-model'));

/**
 * Services
 */
diContainer.registerFactory('HashService', require('./hash-service'));
diContainer.registerFactory('TokenService', require('./token-service'));
diContainer.registerFactory('UserService', require('./user-service'));

/**
 * Interactor
 */
diContainer.registerFactory('PatientInteractor', require('./patient-interactor'));


/**
 * Controller
 */
diContainer.registerFactory('PatientController', require('./patient-controller'));


/**
 * Routes
 */
diContainer.registerFactory('PatientRoutes', require('./patient-routes'));



/**
 * Server
 */
const express = require('express');
const server = express();


/**
 * Register Routes to Server
 */
server.use('/patient', diContainer.get('PatientRoutes'));

````


## How do I write a module for it to work with the Di-Container.

When creating a new module tbat you need to work in the following way



* Explain in text how to use the Di mechanism *
