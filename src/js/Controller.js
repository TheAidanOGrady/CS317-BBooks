function Controller() {
    var view = new View(),
        model = new Model();
    
    this.init = function () {
        console.log("Controller Created");   
        view.setButtonClick(function () {
            console.log("buttonid: " + this.id);
        });
    };
    
}

var Controller = new Controller();
window.addEventListener("load", Controller.init(), false);