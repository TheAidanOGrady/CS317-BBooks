<?php

include("connect.php");

session_start();

if (!isset($_SESSION['id']))
	echo "err-notloggedin";
else
{
	$result = mysql_query("SELECT borrower_id FROM loans WHERE l_id = {$_GET['bid']};");
	if ($row = mysql_fetch_array($result))
	{
		if ($row[0] == -1)
		{
			mysql_query("UPDATE `gvb12187`.`loans` SET 
				`borrower_id` = '{$_SESSION['id']}'
				WHERE `loans`.`l_id` = '{$_GET['bid']}';") or die(mysql_error());
			echo "OK";
		}
		else echo "err-notavailable";
	}
	else echo "err-nosuchbook";
}
?>