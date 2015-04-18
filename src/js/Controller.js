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
        console.log("Controller: Created");
        model.init();
        view.init();
        var searchFunc = function () {
                view.switchTo("search");
                model.setLastScreen("search");
                model.createMap();
            },
            signupFunc = function () {
                view.switchTo("signup");
                model.setLastScreen("signup");
            },
            loginFunc = function () {
                view.switchTo("login");
                model.setLastScreen("login");
            },
            homeFunc = function () {
                view.switchTo("home");
                model.setLastScreen("home");
            },
            bookFunc = function () {
                view.switchTo("books");
                model.setLastScreen("books");
            },
            settingsFunc = function () {
                view.switchTo("settings");
                model.setLastScreen("settings");
            },
            aboutFunc = function () {
                view.switchTo("about");
                model.setLastScreen("about");
            },
            welcomeFunc = function () {
                view.switchTo("welcome");
                model.setLastScreen("welcome");
            };

        // if user is logged in
        if (model.getLoggedIn()) {
            // go to their last screen
            view.toggleNav();
            switch (model.getLastScreen()) {
            case "search":
                searchFunc();
                break;
            case "home":
                homeFunc();
                break;
            case "books":
                bookFunc();
                break;
            case "settings":
                settingsFunc();
                break;
            }
        } else {
            welcomeFunc();
        }

        view.loginCallback(loginFunc);

        view.signupCallback(signupFunc);

        view.homeCallback(homeFunc);

        view.searchCallback(searchFunc);

        view.booksCallback(bookFunc);

        view.settingsCallback(settingsFunc);

        view.aboutCallback(aboutFunc);

        view.cancelCallback(welcomeFunc);

        view.loginConfirmCallback(function () {
            model.login(view.getLogin());
            homeFunc();
            view.toggleNav();
        });

        view.signupConfirmCallback(function () {
            model.signup(view.getSignup());
        });

        view.logoutCallback(function () {
            model.logout();
            welcomeFunc();
            view.toggleNav();
        });

    };
}

var Controller = new Controller();
window.addEventListener("load", Controller.init(), false);