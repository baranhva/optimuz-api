"use strict";

const argsList = require('args-list');

module.exports = function () {

    let dependencies = {};
    let factories = {};
    let svc = {};

    svc.registerFactory = function (name, factory) {
        factories[name] = factory;
    };

    svc.registerDependency = function (name, dep) {
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
