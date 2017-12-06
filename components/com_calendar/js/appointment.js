class Appointment {
  
  static get(id,callback){
    
     $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'getAppointment',
        appointmentID: id
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
  }
  
  static getRequests(group,callback){
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'getAppointmentRequests',
        group: group
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
  }
  
  static add(oAppointment,callback){
    
     $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'addAppointment',
        appointment: JSON.stringify(oAppointment)
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
  }

  static setStatus(appointment_id, status, callback) {
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'setStatus',
        appointmentID: appointment_id,
        status: status
      },
      success: function() {
        if (callback) {
          callback();
        }
      }
    });

  }


  static addLog(appointment_id, tag, log,labelclass, callback) {
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'addAppointmentLog',
        appointment_id: appointment_id,
        datetime: moment().format(),
        tag: tag,
        log: log,
        labelclass:labelclass
      },
      success: function() {
        if (callback) {
          callback();
        }
      }
    });

  }
  

  static getLog(appointment_id,callback) {
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'getLog',
        appointment_id: appointment_id
      },
      success: function(data) {
        if (callback) {
          callback(data);
        }
      }
    });
  }
  
  static update(oAppointment,callback,sendEmail,fail){
    log(JSON.stringify(oAppointment));
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'updateAppointment',
        appointment : JSON.stringify(oAppointment),
        sendEmail : sendEmail

      },
      success: function(data) {
        if (callback) {
          callback(data);
        }
      },
      fail: function(){
        log('tis failing');
        fail();}
    });
  }

}
