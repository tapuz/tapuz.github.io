class SOAP
{
    static add(oSOAP,callback){
    
     $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'addSOAP',
        SOAP: JSON.stringify(oSOAP)
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
 
  
  static update(oSOAP,callback){
        
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'updateSOAP',
        SOAP: JSON.stringify(oSOAP)
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
    
    
}


