/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Model() {

    var loggedIn = false;
    var map;

    /*
     * Initialization of the model
     */
    this.init = function () {
        console.log("Model: Created");
        if (this.getLoginCookie() !== null) {
            loggedIn = true;
        }

        console.log("Model: Logged in: " + loggedIn);
        
        //remove below
        console.log("Model: Testing Create Book JSON:");
        this.createBookJSON("1", "Book One", "A. Man", "£10", "£8", "Blurb for Book One, by A.Man", "A. Nother Man", 55.8300, -4.290);
    };

    /*
     * Logs the user into the system.
     */
    this.login = function (details) {
        console.log("Model: Attempting login");
        console.log(details);

        // TODO: Server side stuff
        // if (login is accepted) 
        this.setLoginCookie(details);
        loggedIn = true;
        // all log in works for now, for testing
        // else tell user log in is wrong
    };

    this.isLoggedIn = function () {
        return loggedIn;
    };

    this.signup = function (details) {
        console.log("Model: Attempting signup");
        console.log(details);
        // TODO: Server side stuff

        // If signup is successful, login
        this.login(details);

    };

    this.setLoginCookie = function (details) {
        console.log("Model: Attempting to set log in cookie");
        this.setCookie("login", details.username);
        this.getLoginCookie(); // remove this
    };

    this.getLoginCookie = function () {
        var username = this.getCookie('login');
        console.log('Model: Login cookie says: ' + username);
        return username;
    };

    this.logout = function () {
        console.log("Model: Attempting to Log out");
        this.deleteCookie('login');
        loggedIn = false;

        // remove below
        this.getLoginCookie();
        console.log("Model: Logged in: " + loggedIn);
    };
    
    this.getCookie = function (name) {
        var cname = name + '=', ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(cname) != -1) return c.substring(cname.length,c.length);
        }  
    }
    
    this.deleteCookie = function (name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    
    this.setCookie = function (name, info) {
        document.cookie = name + '=' + info;
        console.log("Model: Set cookie: " + name + " = " + info);
    };
    
    this.createMap = function() {
        var myLatlng = new google.maps.LatLng(55.8580,-4.2590) // middle of Glasgow
        var mapOptions = {
            zoom: 12,
            center: myLatlng
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        
        // map book test,
        // remove below
        var book1 = this.createBookJSON("1", "Book One", "A. Man", 
                                        "£10", "£8", "Blurb for Book One, by A.Man", 
                                        "A. Nother Man", 55.8300, -4.290);
        var book2 = this.createBookJSON("2", "Book Two", "A. Man 2", 
                                        "£12", "£9", "Blurb for Book Two, by A.Man", 
                                        "A. Nother Man", 55.8350, -4.280);
        var books = [book1, book2];
        this.addBooksToMap(books);
        
    };
    
    this.addBooksToMap = function(books) {
        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            var myLatLng = new google.maps.LatLng(book.location.lat, book.location.lng);
            var contentString = '<div id="content">' +
                                '<h5>' + book.title + ' by ' + book.author + '</h5>' +
                                '<h6>' + book.retail + '<h6>' + 
                                '<h6>' + book.price + '<h6>' + 
                                '<p>' + book.blurb + '</p></div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: book.title,
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });
        }
    };
    
    this.getMap = function () {
        return map;   
    };
    
    this.createBookJSON = function (ISBN, title, author, retail, price, blurb, owner, lat, lng) {
           var bookJSON = { 
                        "ISBN":ISBN, 
                        "title" : title, 
                        "author" : author, 
                        "retail" : retail, 
                        "price" : price, 
                        "blurb" : blurb,
                        "owner" : owner,
                        "location": 
                            {
                                "lat":lat,
                                "lng":lng
                            }
                        };
            console.log("Model: Created bookJSON: \n" + JSON.stringify(bookJSON));
            return bookJSON;
    }
}