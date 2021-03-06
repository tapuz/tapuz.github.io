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



//API methods

error_log('API Called');

loadLib('patient');
//loadLib('clinic');
loadLib('image');
//loadJS('educate.js','educate');
//loadCSS('educate.css','educate');

//get the patient details


switch (getVar('task')){
	
    case 'getClinicsFromGroup':
		
		loadLib('clinic');
		$clincs = Clinic::getClinicsFromGroup(getVar('group'));
		echo json_encode($clincs);						   
		
	break;
	case 'getPractitionersFromClinic':
		loadLib('clinic');
		echo json_encode(Clinic::getPractitionersFromClinic(getVar('clinic')));
		//error_log(json_encode(Clinic::getPractitionersFromClinic(getVar('clinic'))));
	break;

	case 'findPatientMatch':
		echo(Patient::findPatientMatch(getVar('patient')));
	break;
    case 'message':
        $message = getVar('message');
        error_log($message);
        error_log('the message should be here');
        
    break;
	
	case 'addAppointment':
		loadLib('calendar');
		$appointment =  json_decode(stripslashes(getVar('appointment')));
		
		$appointment->service = get_user_meta( $appointment->userID, $appointment->service,1);
		
		
		error_log(print_r($appointment,1));
		$appointment = Calendar::addAppointment($appointment);
		echo json_encode($appointment);
	break;
    case "post_image":
        define('UPLOAD_DIR', 'userdata/camera_pictures/');
        //the vars that need to be posted
		error_log('post_image_called');
		
		$request_body = file_get_contents('php://input');
		
		$data = json_decode($request_body);
        $img = $data->image;
        $patientID = $data->patientID;

        $img = str_replace('data:image/jpeg;base64,', '', $img);
		$img = str_replace(' ', '+', $img);
		$data = base64_decode($img);
		$myimage = imagecreatefromstring($data);
		$filename = uniqid($patientID.'_test_posture_') . '.jpg';
		//compress the png
		//imagepng($myimage, $file);
		$savePath = UPLOAD_DIR . $filename;
		imagejpeg($myimage,$savePath);
		
		//link image with patient in DB
		Image::insertImage($patientID,$filename,'camera');
		
    break;
    
	case 'saveToPatientPortfolio':
		
		// create the image
	 	define('UPLOAD_DIR', 'userdata/portfolio_images/');
		$patientID = getVar('patientID');
		$patientName=getVar('patientName');
		$patientDOB =getVar('patientDOB');
		
		$img = getVar('imgBase64');
		$img = str_replace('data:image/jpeg;base64,', '', $img);
		$img = str_replace(' ', '+', $img);
		$data = base64_decode($img);
		$myimage = imagecreatefromstring($data);
		$filename = uniqid($patientID.'_') . '.jpg';
		//compress the png
		//imagepng($myimage, $file);
		$savePath = UPLOAD_DIR . $filename;
		imagejpeg($myimage,$savePath);
		
		//link image with patient in DB
		Image::insertImage($patientID,$filename,'educate');
		
		
		loadExtLib('fpdf');
		$pdf = new FPDF();
		$pdf->AddPage();
		$pdf->SetFont('Arial','B',16);
		$pdf->Cell(0,10,$patientName . ' (' .$patientDOB . ')' );
		$pdf->Ln();
		$pdf->Image($savePath	,null,null,-150);
		//$pdf->Output();
		$filename="/var/www/clients/client2/web51/web/wp_dev/alice/userdata/pdf/mysuperpdf.pdf";
		$pdf->Output($filename,'F');
		
	break;
	
	case 'getAvailableTimes':
		loadLib('calendar');
		$user = getVar('user'); //1;
		$clinic = getVar('clinic');
		$timing = getVar('timing');
		//how many working days we want to check??
		$start = getVar('start'); 
		$days = 10;
		$timeslots_to_retain_per_day = 3;
		$max_timeslots_search_for = 6;
		$service_duration = 15;
		$try_block_book = FALSE;
		$timeslots_to_present = array();
		$date = new DateTime($start);
		for ($i = 0; $i < $days; $i++) {
			
			$date->modify('+' . 1 . ' days');
			$selected_date = $date->format('Y-m-d');
			$availableTimeslots = Calendar::getUserAvailableTimeslots($user,$clinic,$selected_date,$service_duration,$timing);
			
			if ($availableTimeslots!=FALSE){
				
				//error_log(print_r($availableTimeslots,1));
				usort($timeslots_to_present, function($a, $b) {
					return $a['priority'] - $b['priority'];
				});
				$timeslots_to_retain = array_slice($availableTimeslots,0,$timeslots_to_retain_per_day);
				$timeslots_to_present = array_merge($timeslots_to_present,$timeslots_to_retain);
				//error_log(print_r($timeslots_to_retain,1));
			} else {
				//no available timeslots for this day , look in an extra day
				$days++;
			}
			
				
			if(count($timeslots_to_present) >= $max_timeslots_search_for){
				error_log('we shourld break!!');
				break;}
			
			error_log(count($timeslots_to_present));
			//error_log($selected_date);
		}
		
		
		
		
		
		//experimental// not in use
		if ($try_block_book){
			//lets chop off those low priority bookings
			//sort timeslots by priority
			$sort = array();
			foreach($timeslots_to_present as $k=>$v) {
				$sort['priority'][$k] = $v['priority'];
				//$sort['start'][$k] = $v['start'];
			}
			# sort by event_type desc and then title asc
			array_multisort($sort['start'], SORT_DESC, $sort['priority'], SORT_ASC,$timeslots_to_present);
			
			
			
			//if we have more timeslots then needed... keep only the needed amount
			//of timeslots = $max_timeslots_search_for
			if(count($timeslots_to_present) > $max_timeslots_search_for){
				//$timeslots_to_present = array_slice($availableTimeslots,0,$max_timeslots_search_for);
			}
			
		}

		//sort array by timeslot start time
			
		usort($timeslots_to_present, function($a, $b) {
			return strtotime($a['start']) - strtotime($b['start']);
		});
		//error_log(print_r($timeslots_to_present,1));
		
		echo json_encode($timeslots_to_present);
		
		
		
		
		
		
		
	break;
	
	
	case 'test':
		
		$i = 0;
		
		global $wpdb;
		$query='SELECT * from table_treatments';
		$appointments=$wpdb->get_results($query);
		return $appointments;
		
		foreach($appointments as $appointment){
					
								echo $appointment->scheduled_date;
							
					}
					
		
		
		
		
	break;
	
}



?>
