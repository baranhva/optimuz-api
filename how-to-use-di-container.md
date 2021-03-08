# How do I write a module for it to work with the Di-Container.

### Create module

When creating a new module you need to work in the following way by exporting a function from **module.exports**.
Inside this function you need to have a variable where all the public functions are set to which will be returned at the end of the function.
When creating a **Service** use the name **svc**, when creating a **Controller** use **ctrl**, when creating an **Interactor** use **interactor**.
So say if we would create a service called MedicalPassportService it would need to be created like this:

```Javascript
module.exports = function() {
    
    let svc = {};
    
    return svc;
};
```

### Add dependency


When you want to use another module as a dependency, add that in the parameter of the top function.
So if this service would make use of the **MedicalPassport** ORM model then add it like this:

```Javascript
module.exports = function(MedicalPassport) {
    
    let svc = {};
    
    return svc;
};
```

### Add public function

When you want to add a public function, like for instance a function called *getAllMedicalPassports* and another called *removeMedicalPassport*.<br>
You'd add them like this:

```Javascript
module.exports = function(MedicalPassport) {
    
    let svc = {};
    
    svc.getAllMedicalPassports = function() {
        /* code */
    };
    
    svc.removeMedicalPassport = function(id) {
        /* code */
    };
    
    return svc;
};
```

### Add private functions

When a module is used somewhere the caller only has access to the functions added to the returned variable.
If you want to have private functions you can just declare them like a normal function.
This can be done inside the module.exports function as Javascript allows for nested functions.
So if you'd want to add a private function called *hiddenPrivateFunction* the code would look like this:

```Javascript
module.exports = function(MedicalPassport) {
    
    let svc = {};
    
    svc.getAllMedicalPassports = function() {
        /* code */
    };

    function hiddenPrivateFunction() {
        /* code */
    }
    
    svc.removeMedicalPassport = function(id) {
        /* code */
    };
    
    return svc;
};
```

<br>

# Adding Modules to Di-Container

### How to register a module

When having created a new module and you want to add the module to the DiContainer you need to load it in the server.js file.
If we would add the MedicalPassportService to the application we first need to find the place where the services are loaded as we group them by there type.
We then need to register it as a factory as the module needs to also be injected with dependencies.
So we would add the following code:

```Javascript
diContainer.registerFactory('MedicalPassportService', require('./service/medical-passport-service'));
```

The first part contains the name of the service, the second is the actual module being loaded in.
We use require to load the module.
<br>

We could also have loaded the module and then provide that loaded value like below.
But this is unnecessary boilerplate code and is made redundant when directly doing the import in the parameter.

```Javascript
const MedicalPassportService = require('./service/medical-passport-service');
diContainer.registerFactory('MedicalPassportService', MedicalPassportService);
```

### How to register 3rd party module

When you want to register a module from 3rd party like for instance express you can add it using the *registerDependency* function.

```Javascript
diContainer.registerDependency('express', require('express'));
```
