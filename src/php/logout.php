<?php
session_start();
if (isset($_SESSION['id']))
	echo "id: ", $_SESSION['id'], " closed";
else
	echo "Not set";
$_SESSION = array();
session_unset();
session_destroy();
?>