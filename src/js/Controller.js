/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Controller() {
    var view = new View(),
        model = new Model(view);
            
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
                model.addBooksToMap(model.getFilteredBooks());
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
            },
            filterFunc = function () {
                //model.setFilterBook(view.getFilterBook());
                model.filterBooks(model.getFilterBook());
                model.addBooksToMap(model.getFilteredBooks());
            },
            clearFilterFunc = function () {
                model.copyBooksToFBooks(model.getBooks(), model.getFilteredBooks());
                model.addBooksToMap(model.getFilteredBooks());
            };

        var books = model.getBooks();
        view.addBook(true, books[0]);
        view.addBook(true, books[1]);
        view.addBook(false, books[2]);
        view.addBook(false, books[3]);

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
            case "about":
                aboutFunc();
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
        
        view.filterCallback(filterFunc);
        
        view.clearFilterCallback(clearFilterFunc);

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