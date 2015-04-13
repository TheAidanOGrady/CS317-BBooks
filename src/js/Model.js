/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Model() {

    /*
     * Initialization of the model
     */
    this.init = function () {
        console.log("Model Created");
    };

    /*
     * Logs the user into the system.
     */
    this.login = function (details) {
        console.log("Attempting login");
        console.log(details);

        // TODO: Server side stuff
    };
}