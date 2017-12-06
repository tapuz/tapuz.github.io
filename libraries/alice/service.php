<?
class Service {
    
    public function getServices(){
        global $wpdb;
        $query='SELECT * FROM table_services';
        return $wpdb->get_results($query);
        
    }
    
}
?>