## How do I write a module for it to work with the Di-Container.

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
<br>

### Add dependency


When you want to use another module as a dependency, add that in the parameter of the top function.
So if this service would make use of the **MedicalPassport** ORM model then add it like this:

```Javascript
module.exports = function(MedicalPassport) {
    
    let svc = {};
    
    return svc;
};
```
<br>

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

## How to register a module
