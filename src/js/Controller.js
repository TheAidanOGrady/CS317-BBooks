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
                setTimeout(model.getUserBooksFromDatabase, 300);
                model.setLastScreen("search");
                model.createMap();
                model.addBooksToMap(model.getNearUsers(), model.getFilterBook());
                Materialize.toast('Displaying Books within ' + 
                                  (model.getUser().maxDistance / 1000) + 'km', 2000)
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
                model.getUserInfo();
                view.switchTo("home");
                model.setLastScreen("home");
            },
            bookFunc = function () {
                model.getNearUsersFromDatabase();
                var books = model.getUsersBooks();
                view.clearBooks();
                view.switchTo("books");
                model.setLastScreen("books");
                for (var i = 0; i < books.length; i++) {
                    var owner = model.getUserByID(parseInt(books[i].owner));
                    if (books[i].owner == model.getUser().ID) {
                        //console.log("user owns book: true");
                        view.addBook(false, books[i], books[i].borrower);
                    } else {
                        //console.log("user owns book: false");
                        view.addBook(true, books[i], owner.firstname);
                    }
                }
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
                model.addBooksToMap(model.getNearUsers(), model.getFilterBook());
                if (model.getUseFilter()) {
                    Materialize.toast('Filter on.', 2000)
                } else {
                    Materialize.toast('Filter off.', 2000)
                }
            },
            clearFilterFunc = function () {
                model.setUseFilter(false);
                model.addBooksToMap(model.getNearUsers(), model.getFilterBook());
                Materialize.toast('Filter cleared.', 2000)
            },
			addBookFunc = function() {
                view.switchTo("addBook");
                model.setLastScreen("addBook");
				model.addBookToUser(model.getUser(), model.getCurrentBook());
                model.addBooksToMap(model.getNearUsers(), model.getFilterBook());
                Materialize.toast('Book Added.', 1000);
                setTimeout(homeFunc, 500);

			},
            getLocationFunc = function () {
                Materialize.toast('Getting Location.', 2000)
                model.getUserLocation(model.getUser());
                setTimeout(model.getUserInfo, 200);
            };


        // if user is logged in
        if (model.getLoggedIn()) {
            // go to their last screen
            model.getUserInfo();
            switch (model.getLastScreen()) {
            case "addBook":
                view.toggleNav();
                setTimeout(addBookFunc, 500);
                break;
            case "search":
                view.toggleNav();
                model.getNearUsersFromDatabase();
                setTimeout(searchFunc, 500);
                break;
            case "home":
                view.toggleNav();
                homeFunc();
                break;
            case "books":
                view.toggleNav();
                setTimeout(bookFunc, 500); // wait on ajax response
                break;
            case "settings":
                view.toggleNav();
                settingsFunc();
                break;
            case "about":
                view.toggleNav();
                aboutFunc();
                break;
            default:
                welcomeFunc();
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

        view.addCreditsCallback(function () {
            var credits = parseInt(view.getCredits());
            model.addCredits(credits);
            console.log(model.getCredits());
            Materialize.toast('Adding Credits', 1000);
        });
        
        view.removeCreditsCallback(function () {
            var credits = parseInt(view.getCredits());
            var response = model.removeCredits(credits);
            console.log(model.getCredits());
            
            if (response != false) {
                Materialize.toast('Removing Credits', 1000);
            } else {
                Materialize.toast('You don\'t have that many Credits!', 1000);
            }
        });
                                   
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
        
        view.amendDetailsCallback(function () {
            var newDetails = view.getChangeDetails();
            model.amendUserDetails(newDetails.firstName, newDetails.lastName, 
                                   newDetails.email, newDetails.postcode, 
                                   parseInt(newDetails.maxDistance), "Glasgow", "", "");
            Materialize.toast('Details Amended.', 2000);
            model.getUserInfo();
        });

        view.addBookConfirmCallback(function () {
            model.addBook(view.getAddBook());
        });

        view.addBookCancelCallback(function () {
            homeFunc();
        });

        view.borrowBookCallback(function () {
            var id = $(this).attr("id"),
            book = {};
            // TODO change to book ID (need to add book ID)
            book.title = $("#" + id + " .searchTitle").html();
            book.author = $("#" + id + " .searchAuthor").html();
            book.price = $("#" +id + " .searchPrice").html();
            book.BID = $("#" +id + " .searchBID").html();
            model.rentBook(book.BID);
            Materialize.toast('Book Borrowed. Remaining Credits: ' + model.getCredits(), 2000);
            setTimeout(homeFunc, 500);
        });

        view.showAddFilterCallback(function (){
            $('#filterModal').openModal();
        });
        
        view.setFilterCallback(function () {
            model.setFilterBook(view.getFilter());
        });

        view.changeStatusCallback(function () {
            var status = $(this).val(),
                id = $(this).attr("id");
            model.changeBookStatus(id, status);
            Materialize.toast('Book Status Changed', 2000);
            setTimeout(homeFunc, 500);
        });

    };
    window.addEventListener('load', function(e) {
        window.applicationCache.addEventListener('updateready', function(e) {
                if (window.applicationCache.status 
                        == window.applicationCache.UPDATEREADY) {
                    window.location.reload();
                    }
            }, false);
    }, false);
}

var Controller = new Controller();
window.addEventListener("load", Controller.init(), false);