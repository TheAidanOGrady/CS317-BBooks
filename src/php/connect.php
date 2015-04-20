<?php
	$login = "login";
	$password = "password";
	$db = $login;
	mysql_connect("devweb2014.cis.strath.ac.uk", $login, $password);
	mysql_select_db($db) or die(mysql_error());
?>
