<?php

include("connect.php");

if (isset($_GET['email']) && isset($_GET['password'])) {     
    $result = mysql_query("SELECT * FROM users WHERE email = '{$_GET['email']}' AND password = '{$_GET['password']}'") or die(mysql_error());
    if($row = mysql_fetch_array($result)) {
		session_start();
		$_SESSION['id'] = $row[0];
        echo "{$row[0]},{$row[1]},{$row[2]},{$row[3]},{$row[4]},{$row[5]},{$row[6]},{$row[7]},{$row[8]},{$row[9]},{$row[11]},{$row[12]}";
    }
	else echo "err-wrongdata";
} else {
    if (!isset($_GET['email']) && !isset($_GET['password']))
		echo "err-nodata";
	else if (!isset($_GET['email']))
		echo "err-noemail";
	else if (!isset($_GET['password']))
		echo "err-nopw";
}
?>