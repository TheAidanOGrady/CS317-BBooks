function Controller() {
    var view = new View(),
        model = new Model();
    
    this.init = function () {
        console.log("Controller Created");   
    };
    
}

var Controller = new Controller();
window.addEventListener("load", Controller.init(), false);