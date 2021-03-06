<?php 
//Component Settings

loadCSS('settings.css','settings');
loadJS('settings.js','settings');
loadLib('invoice');


switch (getTask()) 
{
	case 'save_template':
		
		$wpdb->update( 
		'table_letter_templates', 
		array( 
			'template' => getVar('template'),
			'name'     => getVar('template_name')
			), 
		array( 'id' => getVar('template_id')) 
		 
		);
		
	break;
	
	case 'delete_template':
		$wpdb->delete( 'table_letter_templates', array( 'id' => getVar('template_id') ));

	break;
	
	case 'add_new_template':
		$wpdb->insert( 
			'table_letter_templates', 
				array( 
					'category_id' => getVar('category_id'),
					'name' => 'New template'				
					) 
	 			);
	 			
	 			//get the letter_id just created to pass to the select_category view
	 	$template_id = $wpdb->insert_id;		
	break;
	
	
}

switch (getView()) {
	
	case 'general':
		// display the settings menu
		
	include('views/general.php');
		
	break;
	case 'select_category':
		// get letter categories to select from
		
		$query="SELECT * from table_letter_categories";
		$categories = $wpdb->get_results($query);
		
		include('views/select_category.php');
	

	break;
	
	case 'templates':
		
		// get category name
		$query = sprintf('SELECT * from table_letter_categories WHERE category_id = %s',$_GET["category_id"]); 
		$category =  $wpdb->get_row($query);
		// get all templates for selected category
		
		$query = sprintf('SELECT * from table_letter_templates WHERE category_id = %s',$_GET["category_id"]); 
		$templates = $wpdb->get_results($query);
		
		include('views/templates.php');
	

	break;
	
	case 'edit_template':
		
		if (getVar('template_id') != NULL) //a call was made from the list view
		{
			$template_id = getVar('template_id');
			
		} // if template_id == NULL -> a call was made from the template view so we have a new template 
		
		// get the template
		
		$query = sprintf('SELECT * from table_letter_templates WHERE id = %s',$template_id); 
		$template = $wpdb->get_row($query);
		
		//get category_id to make back button
		$category_id = getVar('category_id');
		
		
		include('views/edit_template.php');
	

	break;
	
	case 'edit_invoice_heading':
		$invoice_headings = Invoice::getInvoiceHeadings();
		include('views/edit_invoice_heading.php');
	break;
	
	
	
}





?>
