<?php

include("connect.php");

// get count of users
$count =  mysql_query("SELECT COUNT(user_id) FROM Users") or die(mysql_error());
$query_row=mysql_fetch_array($count);
$numberOfUsers = $query_row[0];
$nextUserID = strval($numberOfUsers) + 1;

// check if duplicate email
$countE =  mysql_query("SELECT COUNT(*) FROM Users WHERE email = '{$_GET['email']}'") or die(mysql_error());
$query_rowE =mysql_fetch_array($countE);
$emailExists = $query_rowE[0];
if ($emailExists == 0) {
    // if not save to database
    $insert = mysql_query("INSERT into Users(user_id, email, password, firstname, surname, postcode) 
	      value ({$nextUserID}, '{$_GET['email']}', '{$_GET['password']}', '{$_GET['firstname']}', '{$_GET['surname']}', '{$_GET['postcode']}'") or die(mysql_error());
    echo "Registered Suggestfully<br>Log in with form above.";
} else {
    echo "Email already registered to another user.";
}
?>