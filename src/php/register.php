<?php

include("connect.php");

// check if duplicate email
$countE =  mysql_query("SELECT COUNT(*) FROM users WHERE email = '{$_GET['email']}'") or die(mysql_error());
$query_rowE =mysql_fetch_array($countE);
$emailExists = $query_rowE[0];
if ($emailExists == 0) {
    // if not save to database
    $insert = mysql_query("INSERT into users(email, password, f_name, s_name) 
	      values ('{$_GET['email']}', '{$_GET['password']}', '{$_GET['firstName']}', '{$_GET['lastName']}');") or die(mysql_error());
    echo "Registered Suggestfully<br>Log in with form above.";
} else {
    echo "Email already registered to another user.";
}
?>