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
            view.switchTo("login");
        });

        view.signupCallback(function () {
            view.switchTo("signup");
        });

        view.cancelCallback(function () {
            view.switchTo("welcome");
        });

        view.loginConfirmCallback(function () {
            model.login(view.getLogin());
        });

        view.signupConfirmCallback(function () {
            model.signup(view.getSignup());
        });

        view.homeCallback(function () {
            view.switchTo("home");
        });

        view.searchCallback(function () {
            view.switchTo("search");
        });

        view.booksCallback(function () {
            view.switchTo("books");
        });

        view.settingsCallback(function () {
            view.switchTo("settings");
        });

        view.aboutCallback(function () {
            view.switchTo("about");
        });

    };
}

var Controller = new Controller();
window.addEventListener("load", Controller.init(), false);