<?php

include("connect.php");

if (isset($_GET['email']) && isset($_GET['password'])) {     
    $result = mysql_query("SELECT * FROM Users WHERE email = '{$_GET['email']}' AND password = '{$_GET['password']}'") or die(mysql_error());
    while($row = mysql_fetch_array($result)) {
        echo "{$row[3]}+{$row[0]}";
    }
} else {
    echo "Database error signing in";   
}
?>