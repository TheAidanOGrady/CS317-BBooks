<?php

// Make a MySQL Connection
include("connect.php");

//Status 0 = available
$status = 0;

$isbn = $_GET['isbn'];
$title = $_GET['title'];
$author = $_GET['author'];
$blurb = $_GET['blurb'];
$genre = $_GET['genre'];
$retail = $_GET['retail'];
$lendtime = $_GET['lendtime'];
$id = $_SESSION['id'];
   


//Insert the information into the table “website”
mysql_query("INSERT INTO `books`(`isbn`, `Title`, `author`, `blurb`, `genre`) VALUES ('$isbn','$title','$author','$blurb','$genre','$retail')")
or die(mysql_error());
mysql_query("INSERT INTO `loans`(`lender_id`, `isbn`, `price`, `condition`, `status`,'lend_time') VALUES ('$id','$isbn','$price','$condition','$status','$lendtime')")
or die(mysql_error());  

echo "Book has been added<br/>";
?>