<?php
class Image {
    public $image_id;
	
	public function insertImage($patientID,$filename,$tag) {
		global $wpdb;
		$wpdb->insert( 
				'table_images', 
				array( 
					'patient_id' => $patientID, 
					'tag' => $tag,
					'filename' => $filename			
					) 
	 			);
	 			
	 			//get the letter_id just created to pass to the select_category view
	 	//$this->image_id = $wpdb->insert_id;
		
	
	}
    
    public function getImages($patient_id,$tag) {
        global $wpdb;
        $query=sprintf('SELECT * from table_images WHERE (patient_id = "%s" AND tag = "%s" )',$patient_id,$tag);
		$images=$wpdb->get_results($query);
		return  $images;
        
    }

}

?>