$(document).ready(function() {
    var patientID;
    $('#editPatient').on('shown.bs.modal', function() {
        
        //get the Patients' data
    
        log(objEvent.title);
        Patient.get(objEvent.patientID,function(patient){
            
            patientID = patient.patient_id;
           // moment.locale('en');moment.locale('en');
            //moment("20111031", "YYYYMMDD")
            $('#Patient_FirstName').val(patient.patient_firstname);
            $('#Patient_LastName').val(patient.patient_surname);
            $('#Patient_DOB').val(moment(patient.dob,'YYYY-MM-DD').format('L'));
            $('#Patient_Sex').val(patient.sex);
            $('#Patient_Phone').val(patient.phone);
            $('#Patient_Email').val(patient.email);
            $('#clinicSelectEditPatient').val(patient.clinic);
           
            $('#Patient_Address').val(patient.address);
            $('#Patient_Postcode').val(patient.postcode);
            $('#Patient_City').val(patient.city);
            
            $('#editPatientForm .patientDetails').show();
            $('#editPatientForm .loading').hide();
            
            
        });
        
       
      
        
        
    
    });
    
    $('#editPatient').on('hidden.bs.modal', function () {
        $('#editPatientForm .patientDetails').hide();
        $('#editPatientForm .loading').show();
    });
    

  
    
    $('#editPatientForm').on('submit', function(e) {
        e.preventDefault();
        form = ($(this).serializeArray());
        //save the data to the server
        log(form[2].value);
        
        //format date for DB
        var dob = form[2].value = moment(form[2].value, 'DD-MM-YYYY').format();
        Patient.update(patientID,form,function(){
            var filter = patientID;
            var events = $('#calendar').fullCalendar('clientEvents', function(evt) {
              return evt.patientID == filter;
            });
            
            log(events);
            
            $.each(events, function() {
            log(this.id + ' is the ID');
                this.title =  $('#Patient_LastName').val() + ' ' +  $('#Patient_FirstName').val();
                this.patientName = this.title;
                this.email = $('#Patient_Email').val();
                this.phone = $('#Patient_Phone').val();
                this.dob = dob;
            });
            calendar.fullCalendar( 'updateEvents', events );
            
            
            $('#editPatient').modal('hide');
            
        
          
            
            
            
        });
        
        
        
        
    });
    


});