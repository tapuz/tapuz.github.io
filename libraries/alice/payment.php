<?php
class Payment {

public function getAllPayments() {
    global $wpdb;
	$query='
	SELECT * FROM table_payments
	ORDER BY payment_id DESC';
	$payments=$wpdb->get_results($query);
	return  $payments;
    
    
}

public function getPayments($patient_id,$status) {
    global $wpdb;
    $query= sprintf('SELECT * from table_payments WHERE patient_id = "%s" AND invoiced=%s',$patient_id,$status);
    $payments = $wpdb->get_results($query);
    return $payments;
}

public function setPaymentInvoicedStatus($payment_id,$status) {
    global $wpdb;
    $wpdb->update( 
				'table_payments', 
				array( 
					'invoiced' => $status
					),
				array( 'payment_id' => $payment_id) 
		 		
	 			);
}

public function addPayment($patient_id,$clinic_id,$practitioner_id,$description,$amount,$payment_date){
	error_log($payment_date,0);
	
	
    global $wpdb;
    $wpdb->insert( 
				'table_payments', 
				array( 
					'clinic_id' => $clinic_id,
					'patient_id' => $patient_id, 
					'practitioner_id' => $practitioner_id,
					'description' => $description,
					'amount' => $amount,
					'payment_date' => convertDateBE2ISO($payment_date)
					) 
	 			);
	 			
	
}

public function getFees() {
    global $wpdb;
	$query='SELECT * from table_fees';
	$fees=$wpdb->get_results($query);
	return  $fees;
    
    
}




}

?>