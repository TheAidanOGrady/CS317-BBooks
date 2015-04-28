<?php

include("connect.php");

session_start();

if (!isset($_SESSION['id']))
	echo "err-notloggedin";
else
{
	mysql_query("UPDATE `gvb12187`.`loans` SET 
				`status` = '{$_GET['status']}'
				WHERE `loans`.`lender_id` = '{$_SESSION['id']}' AND `loans`.`l_id` = '{$_GET['bid']}';") or die(mysql_error());

	echo "Book Updated";
}
?>