/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Model() {

    var loggedIn = false;
    var map, lastInfoWindow;

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
        var book1 = this.createBookJSON("185326041X", "The Great Gatsby", "F. Scott Fitzgerald", 
                                        "£10", "£8", "http://i.imgur.com/8JYDBGR.jpg", 
                                        "Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!", 
                                        "A. N. Owner", ["Novel", "Fiction", "Drama"], 55.869332, -4.292197);
        var book2 = this.createBookJSON("0575094184", "Do Androids Dream of Electric Sheep?", "Philip K. Dick", 
                                        "£7", "£3.50", "http://i.imgur.com/uHZp2cY.jpg", 
                                        "Do Androids Dream of Electric Sheep? is a book that most people think they remember, and almost always get more or less wrong.", 
                                        "A. Nother Owner", ["Sci-Fi, Dystopia"], 55.8200, -4.300);
        var book3 = this.createBookJSON("0575094184", "Do Androids Dream of Electric Sheep?", "Philip K. Dick", 
                                        "£6", "£3.00", "http://i.imgur.com/uHZp2cY.jpg", 
                                        "Do Androids Dream of Electric Sheep? is a book that most people think they remember, and almost always get more or less wrong.", 
                                        "A. Smith", ["Sci-Fi", "Dystopia"], 55.826159, -4.226965);
        var book4 = this.createBookJSON("0241950430", "The Catcher in the Rye", "J. Salinger", 
                                        "£4.50", "£2.50", "http://i.imgur.com/sETNmjW.jpg", 
                                        "Since his debut in 1951 as The Catcher in the Rye, Holden Caulfield has been synonymous with 'cynical adolescent'.", 
                                        "J. Smith", ["Fiction"], 55.860085, -4.234175);
        var books = [book1, book2, book3, book4];
        this.addBooksToMap(books);
    };
    
    this.addBooksToMap = function(books) {
        // TODO make "books" a filtered array using options on page
        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            var myLatLng = new google.maps.LatLng(book.location.lat, book.location.lng);
            var contentString = '<div id="content">' +
                                '<h6>' + book.title + '</h6>' + 
                                '' + book.author + '<br>' +
                                '<img src=' + book.cover + '><br>' +
                                'Retail: ' + book.retail + '<br>' + 
                                'Guarantee: ' + book.price + '<br>' +
                                '' + book.blurb + '<br>' + 
                                'Genres: ' + book.genre + '<br></p>' +
                                '<button id = "moreInfo">More Infomation (TODO)</button></div>';
            
            // create infowindow with book info
            var iw = new google.maps.InfoWindow({
                content: contentString
            });
            // create marker using book info
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: book.title,
                infowindow: iw 
            });
            // add click listener to marker
            google.maps.event.addListener(marker, 'click', function() {
                // close last window open
                if (lastInfoWindow) lastInfoWindow.close();
                // set current window to the last one opened
                lastInfoWindow = this.infowindow;
                // open it
                this.infowindow.open(map, this);
            });
        }
    };
    
    this.getMap = function () {
        return map;   
    };
    
    this.createBookJSON = function (ISBN, title, author, retail, price, cover, blurb, owner, genres, lat, lng) {
           var bookJSON = { 
                        "ISBN":ISBN, 
                        "title" : title, 
                        "author" : author, 
                        "retail" : retail, 
                        "price" : price, 
                        "cover" : cover,
                        "blurb" : blurb,
                        "genre" : genres.toString(),
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