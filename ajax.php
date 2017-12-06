<?php
header('Access-Control-Allow-Origin: *');  
include('configuration.php');
require_once ($config['path_wp-config']);

define('ROOT',						dirname(__FILE__));



//check debug mode


if ($config['debug_mode'] === true)
	{
		error_reporting(E_ALL);
        ini_set('display_errors', 'off');
        ini_set('log_errors', 'on');
        ini_set('error_log', 'error.log');
	}
	

include('libraries/alice/alice.php');



if ( !is_user_logged_in() ) {
    die();
    login();
}
if (getVar('com')<>'debug'){
	error_log('AJAX called -> component [' . getVar('com') . '] and task [' . getVar('task') .']' );
}
include('includes/component_selector.php');





?>
