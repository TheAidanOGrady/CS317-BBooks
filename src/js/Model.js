/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Model() {

    var map,
        lastInfoWindow,
        lastScreen,
        books = [],
        fBooks = [],
        markers = [],
        filterBook,
        loggedIn = false,
        user,
		currentBook;

    
    //remove below
    var book1, book2, book3, book4;
    
    /*
     * Initialization of the model
     */
    this.init = function () {
        console.log("Model: Created");
        // ignore JSLints suggestion to change != to !==
        if (this.getLoginCookie() != null) {
            loggedIn = true;
        }
        console.log("Model: Logged in: " + loggedIn);
        
        //remove below
        var book1 = this.createBookJSON("185326041X", "The Great Gatsby", "F. Scott Fitzgerald",
                                        "£10", "£8", "testbookimg/185326041X.jpg",
                                        "Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!",
                                        "A. N. Owner", ["Novel", "Fiction", "Drama"], 55.869332, -4.292197, "On Loan"),
            book5 = this.createBookJSON("185326041X", "Great Gatsby", "F. Scott Fitzgerald",
                                        "£10", "£8", "testbookimg/185326041X.jpg",
                                        "Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!",
                                        "A. N. Owner", ["Novel", "Fiction", "Drama"], 55.869332, -4.292197, "On Loan"),
            book2 = this.createBookJSON("0575094184", "Do Androids Dream of Electric Sheep?", "Philip K. Dick",
                                        "£7", "£3.50", "testbookimg/0575094184.jpg",
                                        "Do Androids Dream of Electric Sheep? is a book that most people think they remember, and almost always get more or less wrong.",
                                        "A. Nother Owner", ["Sci-Fi, Dystopia"], 55.8200, -4.300, "Available"),
            book3 = this.createBookJSON("0575094184", "Do Androids Dream of Electric Sheep?", "Philip K. Dick",
                                        "£6", "£3.00", "testbookimg/0575094184.jpg",
                                        "Do Androids Dream of Electric Sheep? is a book that most people think they remember, and almost always get more or less wrong.",
                                        "A. Smith", ["Sci-Fi", "Dystopia"], 55.826159, -4.226965, "Awaiting Collection"), 
            book4 = this.createBookJSON("0241950430", "The Catcher in the Rye", "J. Salinger",
                                        "£4.50", "£2.50", "testbookimg/0241950430.jpg",
                                        "Since his debut in 1951 as The Catcher in the Rye, Holden Caulfield has been synonymous with 'cynical adolescent'.",
                                        "J. Smith", ["Fiction"], 55.860085, -4.234175, "Available");
		this.addBookToBooks(book1, books);
		this.addBookToBooks(book2, books);
		this.addBookToBooks(book3, books);
		this.addBookToBooks(book4, books);
        
        this.copyBooksToFBooks(books, fBooks);
        this.setFilterBook(book3);
        this.addBooksToMap(fBooks);
        
        this.getUserInfo();
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

    this.getLoggedIn = function () {
        return loggedIn;
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
            zoom: 11,
            center: myLatlng
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    };
    
    this.clearBooksFromMap = function() {
        console.log("Model: Clearing Map");
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    };
    
    this.addBooksToMap = function(books) {
        this.clearBooksFromMap();
        console.log("Model: Adding Books to Map");
        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            var myLatLng = new google.maps.LatLng(book.location.lat, book.location.lng);
            // var contentString = '<h6>' + book.title + ' by ' + book.author + '</h6>' + 
            //                     '<img src=' + book.cover + '><br>' +
            //                     'Retail: ' + book.retail + ', Guarantee: ' + book.price + '<br>' +
            //                     'Genres: ' + book.genre + '<br></p>' + 
            //                     '<a class="waves-effect waves-light btn red" id="infomationButton">More Information</a><br>';
            // create marker using book info
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                book: book
            });
            markers[i] = marker;
            // add click listener to marker
            google.maps.event.addListener(marker, 'click', function() {
                var book = this.book,
                    bookSource   = $("#cBookTemplate").html(),
                    bookTemplate = Handlebars.compile(bookSource),
                    context = {title: book.title,
                        author: book.author,
                        retail: book.retail,
                        guarantee: book.price,
                        genres: book.genre},
                    html = bookTemplate(context);
        
                $('#searchModal .modal-content .collapsible').empty();
                $('#searchModal .modal-content .collapsible').append(html);
                $('.collapsible').collapsible({accordion: true});
                $('#searchModal').openModal();
                // TODO MVC this
                // TODO change it to hidesearch text, change "booktext"
            });
        }
    };
    
    this.getMap = function () {
        return map;   
    };
    
    this.getLastScreen = function() {
        if (lastScreen == null) {
            lastScreen = localStorage.lastScreen;   
        }
        console.log("Model: Get Last screen: " + lastScreen);
        return lastScreen;
    };
    
    this.setLastScreen = function(screen) {
        lastScreen = screen;
        if (localStorage) {
            localStorage.lastScreen = lastScreen;
        }
        console.log("Model: Set Last screen: " + lastScreen);
    };
    
    this.createBookJSON = function (ISBN, title, author, retail, price, cover, blurb, owner, genres, lat, lng, status) {
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
                        "status" : status,
                        "location": 
                            {
                                "lat":lat,
                                "lng":lng
                            }
                        };
            console.log("Model: Created bookJSON: \n" + JSON.stringify(bookJSON));
            return bookJSON;
    };
    
    this.copyBooksToFBooks = function(books, fBooks) {
        console.log("Model: Setting fBooks back to original Array");
        for (var i = 0; i < books.length; i++) {
            fBooks[i] = books[i];
        }
    };
    
    this.getFilteredBooks = function() {
        return fBooks;    
    };
    
    this.getFilterBook = function() {
        return filterBook;
    };
    
    this.setFilterBook = function(fBook) {
        filterBook = fBook;  
    };
    
    this.clearFilter = function () {
        // needed?
    };
    
    this.getBooks = function () {
        return books;  
    };
    
    this.createUserJSON = function (firstname, surname, email, 
                                    postcode, payment, maxDistance, 
                                    books, filter, city, likes, dislikes) {
        var userJSON = { 
                        "firstname": firstname,
                        "surname": surname,
                        "email": email,
                        "postcode": postcode,
                        "payment": payment,
                        "maxDistance": maxDistance,
                        "books": books,
                        "filter": filter,
                        "city": city,
                        "like": likes,
                        "dislikes": dislikes
                        };
        console.log("Model: Created UserJSON: " + JSON.stringify(userJSON));
        return userJSON;
    };
    
    this.getUserInfo = function () {
        // return information about user from server
        // param email?
        var user = this.createUserJSON("Adam", "Manner", 
                                       "amanner@gmail.com", "G56", 
                                       "paypal", "20", books, "filter", 
                                       "Glasgow", "10", "6");
        return user;
    };
    
    this.filterBooks = function(filter) {
        if (filter != null) {
            console.log("Model: Filtering Books With Filter: " + JSON.stringify(filter));
            // keep track of number of books remaining
            fBooks = [];
            var booksFiltered = 0;
            for (var i = 0; i < books.length; i++) {
                // TODO add additional filters
                if (books[i].title == filter.title) {
                    console.log("Model: Title Match");
                    fBooks[booksFiltered] = books[i];   
                    booksFiltered++;
                    console.log(books[i].title + ":" + filter.title);
                }
            }
            console.log("Model: Books Found: " + booksFiltered);
        }
    }

	this.setCurrentBook = function(book) {
		currentBook = book;
	};
	
	this.addBookToBooks = function(book, books) {
		books[books.length] = book;
		console.log("Model: Adding book to Books: " + JSON.stringify(book));
	};
	
	this.getCurrentBook = function() {
		var currentBook =   this.createBookJSON("185326041X", "The Great Gatsby", "F. Scott Fitzgerald",
						"£10", "£8", "testbookimg/185326041X.jpg",
						"Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!",
						"A. N. Owner", ["Novel", "Fiction", "Drama"], 55.861000, -4.290000, "Awaiting Postage");
		console.log("Model: Returning current book: " + JSON.stringify(currentBook));
		return currentBook;
	}
}