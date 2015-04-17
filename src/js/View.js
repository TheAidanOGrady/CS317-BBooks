/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function View() {

    /*
     * Initialization of the view
     */
    this.init = function () {
        console.log("View Created");
        $(".button-collapse").sideNav({
            closeOnClick: true
        });
        var myLatlng = new google.maps.LatLng(55.8580,-4.2590) // middle of Glasgow
        var mapOptions = {
            zoom: 12,
            center: myLatlng
        };

        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
        details.username = $("#loginForm :input[name=email]").val();
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
        $("#mainView > .container").addClass("hide");
        $("#" + div).removeClass("hide");
    };

    /*
     * Toggles the display of the nav menus.
     */
    this.toggleNav = function () {
        $("#nav-desktop").toggleClass("hide");
        $("#nav-mobile").toggleClass("hide");
        $("#nav-menu").toggleClass("hide");
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