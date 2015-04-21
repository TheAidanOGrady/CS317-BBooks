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
                model.addBooksToMap(model.getLimitedUsers(), model.getFilterBook());
                Materialize.toast('Displaying Books within ' + 
                                  model.getUser().maxDistance + 'km', 2000)
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
                model.setUseFilter(!model.getUseFilter());
                model.addBooksToMap(model.getLimitedUsers(), model.getFilterBook());
                if (model.getUseFilter()) {
                    Materialize.toast('Filter on.', 2000)
                } else {
                    Materialize.toast('Filter off.', 2000)
                }
            },
            clearFilterFunc = function () {
                model.setUseFilter(false);
                model.addBooksToMap(model.getLimitedUsers(), model.getFilterBook());
                Materialize.toast('Filter cleared.', 2000)
            },
			addBookFunc = function() {
				model.addBookToUser(model.getUser(), model.getCurrentBook());
                model.addBooksToMap(model.getLimitedUsers(), model.getFilterBook());
                
                // TODO MVC? clear books before adding as well.
                var books = model.getUser().books;
                var rented = false;
                for (var i = 0; i < books.length; i++) {
                    view.addBook(rented, books[i]);
                    rented = !rented; // for testing
                }
			},
            getLocationFunc = function () {
                Materialize.toast('Getting Location.', 2000)
                model.setUserLocation(model.getUser());
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
		
		view.addBookCallback(addBookFunc);
        
        view.getLocationCallback(getLocationFunc);

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

        Materialize.toast('Welcome, ' + model.getUser().firstname, 2000);

    };
}

var Controller = new Controller();
window.addEventListener("load", Controller.init(), false);