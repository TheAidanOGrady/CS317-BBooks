/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Controller() {
    var view = new View(),
        model = new Model();

    /*
     * Initializes the controller.
     */
    this.init = function () {
        console.log("Controller Created");
        model.init();
        view.init();

        view.loginCallback(function () {
            view.toggleLogin();
        });

        view.signupCallback(function () {
            view.toggleSignup();
        });

        view.loginConfirmCallback(function () {
            model.login(view.getLogin());
        });
    };
}

var Controller = new Controller();
window.addEventListener("load", Controller.init(), false);