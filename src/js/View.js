/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function View() {

    var bookSource   = $("#bookTemplate").html(),
        bookTemplate = Handlebars.compile(bookSource);

    /*
     * Initialization of the view
     */
    this.init = function () {
        console.log("View Created");
        $(".button-collapse").sideNav({
            closeOnClick: true
        });
        $('.collapsible').collapsible({accordion: true});
        $(".dropdown-button").dropdown({constrainwidth: false});
    };


    /***************************************************************************
     *
     * GET INFORMATION FROM DOM
     *
     **************************************************************************/

    /*
     * Gets the user details from the login form.
     */
    this.getLogin = function () {
        var details = {};
        details.email = $("#loginForm :input[name=email]").val();
        details.password = $("#loginForm :input[name=password]").val();
        return details;
    };

    /*
     * Gets the user details from the signup form.
     */
    this.getSignup = function () {
        var details = {};
        details.firstName = $("#signupForm :input[name=firstName]").val();
        details.lastName = $("#signupForm :input[name=lastName]").val();
        details.email = $("#signupForm :input[name=email]").val();
        details.password = $("#signupForm :input[name=password]").val();
        details.password2 = $("#signupForm :input[name=passwordConfirm]").val();
        details.postcode = $("#signupForm :input[name=postcode]").val();
        return details;
    };
    
    this.getChangeDetails = function () {
        var details = {};
        details.firstName = $("#changeDetailForm :input[name=firstnameSettings]").val();
        details.lastName = $("#changeDetailForm :input[name=surnameSettings]").val();
        details.email = $("#changeDetailForm :input[name=emailSettings]").val();
        details.postcode = $("#changeDetailForm :input[name=postcodeSettings]").val();
        details.maxDistance = $("#changeDetailForm :input[name=maxDistanceSettings]").val();
        return details;
    };

    /***************************************************************************
     *
     * DISPLAY CHANGING
     *
     **************************************************************************/

    /*
     * Switches between the login and welcome page.
     */
    this.toggleLogin = function () {
        $("#login").toggleClass("hide");
        $("#welcome").toggleClass("hide");
    };

    /*
     * Switches between the signup and welcome page.
     */
    this.toggleSignup = function () {
        $("#signup").toggleClass("hide");
        $("#welcome").toggleClass("hide");
    };

    /*
     * Switches to a div with the given ID.
     */
    this.switchTo = function (div) {
        $("#mainView > .BBookSection").addClass("hide");
        $("#" + div).removeClass("hide");

        if (div === "search") {
            $("#searchFilterMenu").removeClass("hide");
        } else {
            $("#searchFilterMenu").addClass("hide");            
        }
    };

    /*
     * Toggles the display of the nav menus.
     */
    this.toggleNav = function () {
        //console.log("View: Toggling Nav Bar");
        $("#nav-desktop").toggleClass("hide");
        $("#nav-mobile").toggleClass("hide");
        $("#nav-menu").toggleClass("hide");
    };

    this.clearBooks = function () {
        $('#borrowingTab').empty();   
        $('#lendingTab').empty();   
    };
    
    this.addBook = function (borrow, book) {
        var books,
            lend,
            context,
            html;
        if (borrow) {
            books = $('#borrowingTab');
            lend = "Borrowing from";
        } else {
            books = $('#lendingTab');
            lend = "Lending to";
        }

        context = {title: book.title,
            author: book.author,
            lend: lend,
            owner: book.owner,
            status: book.status};
        html = bookTemplate(context);
        books.append(html);
    };

    /***************************************************************************
     *
     * BUTTON CALLBACKS
     *
     **************************************************************************/

    this.loginCallback = function (callback) {
        $("#loginButton").click(callback);
    };

    this.signupCallback = function (callback) {
        $("#signupButton").click(callback);
    };

    this.loginConfirmCallback = function (callback) {
        $("#loginConfirm").click(callback);
    };

    this.signupConfirmCallback = function (callback) {
        $("#signupConfirm").click(callback);
    };

    this.cancelCallback = function (callback) {
        $("#loginCancel").click(callback);
        $("#signupCancel").click(callback);
    };

    this.filterCallback = function (callback) {
        $("#filterButton").click(callback);
    };

    this.clearFilterCallback = function (callback) {
        $("#clearFilterButton").click(callback);
    };

    this.addBookCallback = function (callback) {
        $("#addBookButton").click(callback);
        $("#addBookSmallButton").click(callback);
    };

    this.getLocationCallback = function (callback) {
        $("#getLocationButton").click(callback);
    };

    this.amendDetailsCallback = function (callback) {
        $("#amendDetailsButton").click(callback);
    };

    /***************************************************************************
     *
     * NAV CALLBACKS
     *
     **************************************************************************/

    this.homeCallback = function (callback) {
        $(".homeMenu").click(callback);
    };

    this.searchCallback = function (callback) {
        $(".searchMenu").click(callback);
    };

    this.booksCallback = function (callback) {
        $(".booksMenu").click(callback);
    };

    this.settingsCallback = function (callback) {
        $(".settingsMenu").click(callback);
    };

    this.aboutCallback = function (callback) {
        $(".aboutMenu").click(callback);
    };

    this.logoutCallback = function (callback) {
        $(".logoutMenu").click(callback);
    };
}