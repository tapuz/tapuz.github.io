class Patient {
  static add(oPatient, callback) {
    
    $.ajax({
      url: "ajax.php",
      //dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'addNewPatient',
        patient:JSON.stringify(oPatient)

      },
      success: function(data) {
        patientID = getResponse(data);
            callback(patientID);
      }
    });
  }
  
  static get(patient_id, callback){
    return $.ajax({
      url: "ajax.php",
      //dataType: "json",
      type: 'post',
      dataType: "json",
      data: {
        com: 'patient',
        task: 'get_patient',
        patient_id:patient_id

      },
      success: function(data) {
        if(callback){callback(data);}
        //return data;
      }
    });
  }
  
  static update(id,oPatient, callback){
    
    $.ajax({
      url: "ajax.php",
      
      type: 'post',
    
      data: {
        com: 'patient',
        task: 'update_patient',
        patient:JSON.stringify(oPatient),
        patient_id:id
      },
      success: function(data) {
        callback(data);
      },
      error : function(jqXHR, textStatus, errorThrown){
        log(textStatus);
      }
    });
  }
}