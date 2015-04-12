/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Controller() {
    var view = new View(),
        model = new Model();

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
    };
}

var Controller = new Controller();
window.addEventListener("load", Controller.init(), false);