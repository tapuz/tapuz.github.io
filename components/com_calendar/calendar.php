<?php 
//Component Calendar
loadLib('patient');
loadLib('calendar');
loadLib('clinic');
loadLib('service');


loadCSS('fullcalendar.min.css');
loadCSS('scheduler.min.css');
//loadCSS('fullcalendar.print.css');
loadCSS('calendar.css','calendar');

loadJS('fullcalendar.min.js');
loadJS('scheduler.min.js');
loadJS('typeahead.min.js');
loadJS('appointment.js','calendar');
loadJS('patient.js','patient');
loadJS('calendar.js','calendar');
loadJS('editEvent.js','calendar');
loadJS('eventDetails.js','calendar');
loadJS('clinic.js','calendar');
loadJS('editPatient.js','calendar');
loadJS('email.js','calendar');

//loadJS('jquery.balloon.min.js');

//

switch (getVar('task')){
	
	case 'get_data':
		$appointments = Calendar::getAppointments(getVar('user_id'));
		echo json_encode($appointments);
		
			
 
			//error_log(json_encode($appointments));
			//error_log('user id: ' . getVar('user_id'));
	break;
	   
	case 'getUsers':
		// WP_User_Query arguments
		$args = array(
			'role'           => 'practitioner',
			'order'          => 'ASC',
			'orderby'        => 'display_name',
			'fields'         => 'all_with_meta',
		);

	// The User Query
		$user_query = new WP_User_Query( $args );
		$users = $user_query->results;
		
		foreach($users as $user){
		 error_log(print_r(get_user_meta ( $user->working_plan),1));;
		}
		
		echo $users = json_encode($user_query->results);
		
		//error_log($users);
	break;
	
	case 'getClinics':
		 echo $clinics = json_encode(Clinic::getClinics());
	   
	break;
	
	case 'searchPatients':
		$name = getVar('name');
		echo json_encode(Patient::searchPatients($name));
	break;
	
	case 'addAppointment':
		
		loadLib('email');
		loadLib('ics');//generate ICS file
		
		
		$appointment =  Calendar::addAppointment(json_decode(stripslashes(getVar('appointment'))));
		
		echo json_encode($appointment);
		//send confirmation email
		
		
		
		$clinic = Clinic::getClinic($appointment->clinic);
		
		//add clinic name to $appointment object
		$appointment->{"clinic_name"} = $clinic->clinic_name;
		$appointment->{"clinic_address"} = $clinic->clinic_street . " - " . $clinic->clinic_postcode . " " . $clinic->clinic_city;  
		$appointment->{"time"} = strftime('%e %B %Y om %H:%M',strtotime($appointment->start)); //set accorde to locale set in configuration.php
		
		$email = new Email();
		
		$email->smtp_server = $clinic->smtp_server;
		$email->smtp_username = $clinic->smtp_username;
		$email->smtp_password = $clinic->smtp_password;
		
		$email->to = $appointment->email;
		$email->from_email = $clinic->clinic_email;
		$email->from_name = $clinic->email_name;
		$email->subject = $clinic->email_appointment_confirmation_subject;
		
		
		$message = file_get_contents('assets/email_templates/appointmentConfirmation.html');
		$message = str_replace('%title%', $clinic->email_appointment_confirmation_subject, $message);
		$message = str_replace('%text%', $clinic->email_appointment_confirmation_text, $message);
		$message = str_replace('%patient%', $appointment->patient_firstname, $message);
		$message = str_replace('%time%', $appointment->time, $message);
		$message = str_replace('%address%', $appointment->clinic_name . " - "  . $appointment->clinic_address, $message);
		$message = str_replace('%practitioner%', $appointment->resourceName, $message);
		
		$email->message = $message;
		$email->ics = ICS::render($appointment);
		
		$email->send();
		
		
		
	break;

	case 'updateAppointment':
		//Calendar::updateAppointment(getVar('id'),getVar('start'),getVar('end'),getVar('user'),getVar('patientID'),getVar('status'),getVar('service'));
		$appointment =  Calendar::updateAppointment(stripslashes(getVar('appointment')));
		echo json_encode($appointment);
		
		error_log('flag : '. getVar('sendEmail'));
		
		if (getVar('sendEmail') == true) {
			
			//lets send a mail to notify patient of updated appointment
			loadLib('email');
			loadLib('ics');
			
			$clinic = Clinic::getClinic($appointment->clinic);
		
			//add clinic name to $appointment object
			$appointment->{"clinic_name"} = $clinic->clinic_name;
			$appointment->{"clinic_address"} = $clinic->clinic_street . " - " . $clinic->clinic_postcode . " " . $clinic->clinic_city;  
			$appointment->{"time"} = strftime('%e %B %Y om %H:%M',strtotime($appointment->start)); //set accorde to locale set in configuration.php
			
			$email = new Email();
			$email->smtp_server = $clinic->smtp_server;
			$email->smtp_username = $clinic->smtp_username;
			$email->smtp_password = $clinic->smtp_password;
			
			$email->to = $appointment->email;
			$email->from_email = $clinic->clinic_email;
			$email->from_name = $clinic->email_name;
			$email->subject = $clinic->email_appointment_amended_subject;
			
			
			$message = file_get_contents('assets/email_templates/appointmentConfirmation.html');
			$message = str_replace('%title%', $clinic->email_appointment_amended_subject, $message);
			$message = str_replace('%text%', $clinic->email_appointment_amended_text, $message);
			$message = str_replace('%patient%', $appointment->patient_firstname, $message);
			$message = str_replace('%time%', $appointment->time, $message);
			$message = str_replace('%address%', $appointment->clinic_name . " - "  . $appointment->clinic_address, $message);
			$message = str_replace('%practitioner%', $appointment->resourceName, $message);
		
			$email->message = $message;
			$email->ics = ICS::render($appointment);
			$email->send(); 
				
		}
		 //add a log that an email was sent
		
	break;
	
	case 'getAppointment':
		echo json_encode(Calendar::getAppointment(getVar('appointmentID')));
	break;
	
	case 'getAppointmentRequests':
		echo json_encode(Calendar::getAppointmentRequests(getVar('group')));
	break;
	case 'setStatus':
		Calendar::setStatus(getVar('appointmentID'),getVar('status'));
	break;
	
	case 'addNewPatient':
		
		$newPatientID = Patient::addNewPatient(stripslashes(getVar('patient')));
		setResponse($newPatientID);
	break;

	case 'getServices':
		$services = Service::getServices();
		echo json_encode($services);
	break;

	case 'addAppointmentLog':
		Calendar::addAppointmentLog(getVar('appointment_id'),getVar('datetime'),getVar('tag'),getVar('log'),getVar('labelclass'));
	break;

	

	case 'getLog':
		$log = Calendar::getLog(getVar('appointment_id'));
		echo json_encode($log);
	break;

	case 'send_email':
		
		$email = new Email();
		$email->to = 'patricia.mulders@gmail.com';
		$email->from_email = 'info@rugcentrumgent.be';
		$email->from_name = 'Marijke';
		$email->subject = 'Afspraak 300';
		
		
		$message = file_get_contents('assets/email_templates/appointmentConfirmation.html');
		$message = str_replace('%patient%', t, $message); 
		$email->send();
		
	break;

}



switch (getView())
{
	
	case 'calendar':
	    
	    //add capabilities check to limit view to certain calendars
		if( current_user_can('practitioner')) {
			$selectedUserID = get_current_user_id();
		} else {
			$selectedUserID = 'none';
		}
		include('views/calendar.php');

	break;

	case 'copy':
	    
	    //lets copy all of User 1-> thierry
		
		
		global $wpdb;
		$query = "SELECT * from table_treatments WHERE practitioner = 1";
		$treatments = $wpdb->get_results($query);
		
		foreach($treatments as $treatment){
			
			
			
			$sql = "INSERT INTO table_appointments (user,start,end,patient_id,service,clinic) VALUES (%d,%s,%s,%d,%d,%d)";
			$user = 1;
			$start = $treatment->scheduled_date . ' ' . $treatment->scheduled_time;
			$end = date('Y-m-d H:i:s',strtotime('+15 minutes',strtotime($start)));
			$patient_id = $treatment->patient_id;
			if ($treatment->type == 1) {$service = 2;}
			if ($treatment->type == 2) {$service = 3;}
			
			$clinic = 1;
			
			$sql = $wpdb->prepare($sql,$user,$start,$end,$patient_id,$service,$clinic);
			var_dump($sql); // debug
			$wpdb->query($sql);
		}
		
		
		
		include('views/copy.php');

	break;


	
	
	
}


?>
