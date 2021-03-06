var oPatient,objEvent,objNewAppointment, oldEventStart, oldEventUsername, eventStart, eventEnd, eventAllDay, eventTitle, eventID, patientID, patientName, userID, userName, eventStatus;
var calendar;
var users;
var clinics; 
var clinicID;
var selectedClinic = 'all';
var fcMessage;
var highlightEvent = false;
var eventIDtoHighlight;

$(document).ready(function() {
	
	document.title = 'Calendar';
  //set some vars

  /*
	date store today date.
	d store today date.
	m store current month.
	y store current year.
	*/
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();


  var selectUser = "";
  var selectedUser = "";
	

  var mode; //do not set this var as GLOBAL as it WILL interfere with other mode vars (ex. editEvent.js)!!
  //minify the main menu
  $('#main-menu-toggle').click();
  //hide the side panel
  $('#rightPanel').toggle();

	//append the modals to the body to avoid Z-index problems
	$('#editPatient').appendTo("body");
	$('#editEvent').appendTo("body");
	$('#paymentModal').appendTo("body");
	
  // get users for the calendar select and init calendar for the selected user
  initCal();

  $.ajax({
    type: "post",
    url: "ajax.php",
    dataType: "json",
    data: {
      com: 'calendar',
      task: 'getUsers'
    }
  }).done(function(data) {

		//store users 
    users = data;
		
    // make the practitioner selector 
    selectUser = "<select id='userSelect' name='userSelect' class='form-control' style='width:174px'>";
		if (Object.keys(data).length > 1){//there is > 1 user.. show all practitioners option
			selectUser += "<option value='all_practitioners'>All practitioners</option>";
		}
    $.each(data, function() {
      selectUser += "<option value=" + this.data.ID + ">" + this.data.display_name + "</option>";
    });

    selectUser += "</select>";


	  addSelectClinic();
		
    addSelectUser();
	  
    // check selectedUserID: if !=null then we have a practitioner who is logged in.. we want to show him his own calendar by default..
    // otherwize show first calendar in list

    userID = $('#selectedUserID').val();
  
    if (userID != 'none') {
      $('#userSelect option[value=' + userID + ']').attr('selected', 'selected');
      
    } else {
      $('#userSelect option:eq(1)').attr('selected', 'selected');
    }

    selectedUser = $('#userSelect').val();
    getEvents(selectedUser);
    getResource(selectedUser);
    renderWorkingPlan();

    $('#userSelect').on('change', function() {
      calendar.fullCalendar('removeEventSources');
      if ($('#userSelect').val() == 'all_practitioners') {
        //get all the resources
        getResources();
        //change to dayview
        calendar.fullCalendar('changeView', 'agendaDay');
        //set mode to 0
        mode = 0;
      } else {
        //remove the resources
        removeResources();
        selectedUser = $('#userSelect').val();
        console.log('refetching events : ' + selectedUser);
        getResource(selectedUser);
        getEvents(selectedUser);
        renderWorkingPlan();
        //set mode to 1
        mode = 1;
      }

    });

  });
	
	function addSelectClinic() {
		Clinic.getClinics(function(data){
			
			clinics = data;
			
			//render clinic select for the calendar
			var selectClinic = "<select id='clinicSelect' name='clinicSelect' class='form-control' style='width:174px'>";
			if (clinics.length > 1){
			selectClinic += "<option value='all'>All Clinics</option>";
			}
			$.each(clinics, function() {
				selectClinic += "<option value='"+ this.clinic_id + "'>"+ this.clinic_name +"</option>";
			});
			selectClinic += "</select>";
		
			$('.fc-toolbar .fc-left').prepend(selectClinic);
			
			//render clinic select for the editApp modal
			selectClinic = "<select id='clinicSelectEditApp' name='clinicSelectEditApp' class='form-control' style='width:250px'>";
			$.each(clinics, function() {
				selectClinic += "<option value='"+ this.clinic_id + "'>"+ this.clinic_name +"</option>";
			});
			selectClinic += "</select>";
			$('#editAppointment .selectClinic').html(selectClinic);
			
			//render clinic select for the editPatient modal
			selectClinic = "<select id='clinicSelectEditPatient' name='clinic' class='form-control' style='width:250px'>";
			$.each(clinics, function() {
				selectClinic += "<option value='"+ this.clinic_id + "'>"+ this.clinic_name +"</option>";
			});
			selectClinic += "</select>";
			$('#editPatient .selectClinic').html(selectClinic);
			
			//update the validator..
			$('#editPatientForm').validator('update');
			$('#editAppointment').validator('update');
			
			//set the onchange for the calendar clinic selector
			$('#clinicSelect').on('change', function() {
				selectedClinic = $(this).val();
				//log (selectedClinic + ' is the clinic');
      renderWorkingPlan();	
      
			switch(selectedClinic) {
				case 'all':
					
					$('.appointment').show();
        break;
				
				default:
					$('.appointment').hide();
					$('.clinic' + selectedClinic).show();
			}
				

			});	
			
		});
	}
	
  function addSelectUser() {
    $('.fc-toolbar .fc-left').prepend(selectUser);
  }

  function getResources() {
    //add each user as a Resource
    log('getting the resources!!!');

    $.each(users, function() {
      log('the color is : ' + this.calendar_color);
      calendar.fullCalendar('addResource', {
        id: this.data.ID,
        title: this.data.display_name,
        eventColor: this.calendar_color

      });
      getEvents(this.data.ID);

    });
  }

  function getResource(id) {
    calendar.fullCalendar('addResource', {
      id: id,
      title: users[id].data.display_name  
    });
    
  }

  function removeResources() {
    $.each(users, function() {
      calendar.fullCalendar('removeResource', this.data.ID);
    });

  }


  function getEvents(userID) {
    var events = {
      url: 'ajax.php',
      type: 'POST',
      data: {
        com: 'calendar',
        task: 'get_data',
        user_id: userID,

      }
    };

    calendar.fullCalendar('addEventSource', events);

  }


  function renderWorkingPlan() {
    calendar.fullCalendar('removeEvents','not_working');
    calendar.fullCalendar('removeEvents','working');
    calendar.fullCalendar('removeEvents','break');
    $.ajax({
      type: "post",
      url: "ajax.php",
      dataType: "json",
      data: {
        com: 'calendar',
        task: 'getWorkingPlan',
        userID:selectedUser
      }
    }).done(function(workingPlan) {
       $.each(workingPlan,function(){
        if(selectedClinic == 'all'){
          var color = this.color;
          var clinic = this.clinic;
          $.each(this.workingPlan,function(){
            
            $.each(this,function( day, dayplan ) {
                calendar.fullCalendar('renderEvent', {
                  id:'not_working', //all need the same ID, else you would get cumulative layer coloring
                  className: 'fc-nonbusiness',
                  start: dayplan.start,
                  end: dayplan.end,
                  dow: [dayplan.dow], 
                  rendering: 'inverse-background',
                  type:'bgEvent'
                },true);
                calendar.fullCalendar('renderEvent', {
                  id:'working', //all need the same ID, else you would get cumulative layer coloring
                  //className: className,
                  start: dayplan.start,
                  end: dayplan.end,
                  dow: [dayplan.dow], 
                  rendering: 'background',
                  type:'bgEvent',
                  //color:color,
                  clinic:clinic
                },true);
              //render the breaks
              $.each(dayplan.breaks,function(){
                log('break start:' + this.start + 'dow: ' + dayplan.dow);
                  calendar.fullCalendar('renderEvent', {
                  id:'break', //all need the same ID, else you would get cumulative layer coloring
                  className: 'fc-nonbusiness',
                  start: this.start,
                  end: this.end,
                  dow: [dayplan.dow], 
                  rendering: 'background',
                  type:'bgEvent'
                },true); 
              });   
            });
          });


        }else{ 
          
          if(this.clinic == selectedClinic){
            log('WE HAVE A MATCH :' + this.clinic ); // only render this working plan
            $.each(this.workingPlan,function(){
              $.each(this,function( day, dayplan ) {
                  calendar.fullCalendar('renderEvent', {
                    id:'not_working', //all need the same ID, else you would get cumulative layer coloring
                    className: 'fc-nonbusiness',
                    start: dayplan.start,
                    end: dayplan.end,
                    dow: [dayplan.dow], 
                    rendering: 'inverse-background',
                    type:'bgEvent'
                  },true); 
                //render the breaks
              $.each(dayplan.breaks,function(){
                log('break start:' + this.start + 'dow: ' + dayplan.dow);
                calendar.fullCalendar('renderEvent', {
                  id:'break', //all need the same ID, else you would get cumulative layer coloring
                  className: 'fc-nonbusiness',
                  start: this.start,
                  end: this.end,
                  dow: [dayplan.dow], 
                  rendering: 'background',
                  type:'bgEvent'
                },true);
              });   
              });
            });   
          } 
        } 
      }); 
    });
  }

	



  //bring up the calendar
  function initCal() {


    calendar = $('#calendar').fullCalendar({
      //height: 800,   //set dynamically with $('#calendar').fullCalendar('option', 'height', 700);
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      locale: locale,
			firstDay: 1,
      defaultView: 'agendaWeek',
      hiddenDays: [0],
      slotDuration: '00:10:00',
      snapDuration: '00:05:00',
      slotLabelInterval: '00:15:00',
      slotEventOverlap: 'false',
      weekNumbers: true,
      minTime: '07:00:00',
      maxTime: '22:30:00',
      slotLabelFormat: 'HH:mm',
      columnFormat: 'ddd D/M',
      titleFormat: 'D MMM YYYY',
      timeFormat: 'H(:mm)', // time format for the events displayed on the calendar
      scrollTime: '08:00:00',
      nowIndicator: 'true',
      displayEventTime: false,
			lazyFetching: true,
	  
      //theme:'false',
      //allDayDefault: false,
      //contentHeight: 5000,
	  
      businessHours: {
        start: '07:00', // a start time (10am in this example)
        end: '23:30', // an end time (6pm in this example)

        dow: [1, 2, 3, 4, 5, 6]
          // days of week. an array of zero-based day of week integers (0=Sunday)
          // (Monday-Thursday in this example)
      },
      customButtons: {
        plus3m: {
          text: '+3M',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              months: 3
            });
          }
        },
        plus4m: {
          text: '+4M',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              months: 3
            });
          }
        },
        plus6m: {
          text: '+6M',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              months: 6
            });
          }
        },
				
		toggleSidebarRight:{
			//text: '<i class="fa fa-chevron-left"',
			icon: 'fa fa-chevron-right',
			click: function() {
				$('#calendar').toggleClass('col-md-9');
				$('#calendar').toggleClass('col-md-12');
				$('#rightPanel').toggle();
				$('#rightPanel .patient-search').focus();
				
					}
				}
      },
			
      /*
					header option will define our calendar header.
					left define what will be at left position in calendar
					center define what will be at center position in calendar
					right define what will be at right position in calendar
				*/

      header: {
        left: 'prev,next today plus3m,plus4m,plus6m',
        center: 'title',
        right: 'agendaDay,agendaWeek,month toggleSidebarRight'
          //        left: 'add,sell,locationSelect,staffSelect',
          //        center: 'prev,jumpLeft,today,title,jumpRight,next',
          //        right: 'resourceDay,agendaWeek,month'

      },

      /*
      	selectable:true will enable user to select datetime slot
      	selectHelper will add helpers for selectable.
      */
      selectable: true,
      selectHelper: true,
      editable: true,
      resources: [],
      /*
      	when user select timeslot this option code will execute.
      	It has three arguments. Start,end and allDay.
      	Start means starting time of event.
      	End means ending time of event.
      	allDay means if events is for entire day or not.
      */
      /* function(start, end, allDay, event, resourceId) {*/
      select: function(start, end, jsEvent, view, resource) {

        if (bFlagBookNext == true) {
          //bring up the add appointment modal
          //set the patient as selected
          //set the service as selected
					appModalMode = 'newAppointment';



          $('#editEvent .modal-title').html('Book next appointment');
					$('#editEvent .datetime').html(moment(start).locale(locale).format('LLL'));
          $('#editEvent').appendTo("body").modal('show');
          $('.patient-select #patient-search').val(objNewAppointment.patientName); //if patient-search field is empty the save button will stay disabled.
					$('.patient-select #phone').val(objNewAppointment.phone); //if patient-search field is empty the save button will stay disabled.
					
          $('.patient-select').hide();
          $('.selected').show();

          $('.selected-patient-name').html(objNewAppointment.patientName);
          $('.selected-dob').html(objNewAppointment.dob);
          $('.selected-telephone').html(objNewAppointment.phone);
          $('.selected-email').html(objNewAppointment.email);

          if (selectedClinic != 'all'){
            $('#clinicSelectEditApp').val(selectedClinic);
            renderServicesLookup(selectedClinic);
            $('#selectService').val(iDefaultService);
          } else if (clinicID != '') {
            //get the clinic id from the background event if it exists
            $('#clinicSelectEditApp').val(clinicID);
            renderServicesLookup(clinicID);
            $('#selectService').val(iDefaultService);
            clinicID ='';
          } else {
            $('.selectService').html('Select a clinic first');
          }

          
          $('.patient-select #patient-search').blur();
					$('.warningSelectClinic').hide();
					fcMessage.close();

          eventStart = start;
          eventEnd = end;
          //eventAllDay = allDay;
          if (mode === 0) { //we are in resource mode .. we can get the resource.id without getting an error
            userID = resource.id;
            //log(resourceID + 'is the resource');
          } else {
            userID = selectedUser;
          }
          return;
        }
        //check if in reschedule mode...
        if (bFlagReschedule === true) {
          oldEventStart = objEvent.start;
          var bFlagRefetchEventsAfterReschedule = false;
					oldEventUsername = users[objEvent.resourceId].data.display_name;


          if (mode === 0) { //we are in resource mode .. we can get the resource.id without getting an error
            objEvent.resourceId = resource.id;
            var newEventUsername = users[resource.id].data.display_name;

          } else {
            var newEventUsername = users[selectedUser].data.display_name;
            if (objEvent.resourceId != selectedUser) {
              bFlagRefetchEventsAfterReschedule = true;
              objEvent.resourceId = selectedUser;
            }
          }
          var duration = moment.duration(objEvent.end.diff(objEvent.start));



          objEvent.start = start;
          objEvent.end = start.clone().add(duration);

          calendar.fullCalendar('updateEvent', objEvent);
          calendar.fullCalendar('unselect');

          if (selectedClinic != 'all'){
            clinic = selectedClinic;
          } else if (clinicID != ''){
            clinic = clinicID;
            clinicID = '';
          } else {
            clinic = objEvent.clinic;
          }

          Appointment.update({
            id: objEvent.id,
            start: objEvent.start.format(),
            end: objEvent.end.format(),
            user: objEvent.resourceId,
            patientID: objEvent.patientID,
            service: objEvent.serviceId,
            status: objEvent.status,
						clinic: clinic
          }, function() {
            renderRightPanelPatientAppointments();
            if (bFlagRefetchEventsAfterReschedule === true) {
              calendar.fullCalendar('refetchEvents');
            }
	
            if (oldEventUsername != newEventUsername) {
              Appointment.addLog(objEvent.id, 'Rescheduled', 'appointment changed from ' + oldEventUsername + ' - ' + moment(oldEventStart).locale(locale).format('LLL') + ' to ' + newEventUsername + ' - ' + moment(objEvent.start).locale(locale).format('LLL'), 'label-warning');
            } else {
              Appointment.addLog(objEvent.id, 'Rescheduled', 'appointment changed from ' + moment(oldEventStart).locale(locale).format('LLL') + ' to ' + moment(objEvent.start).locale(locale).format('LLL'), 'label-warning');
            }
						Appointment.addLog(objEvent.id, 'Email', 'Appointment amendment sent','label-primary');
          },'yes'); //true = send email



					fcMessage.close();
          bFlagReschedule = false;

          return;

        }

        //bring up the modal and push start and end into global vars
        $('#editEvent .modal-title').html('Book Appointment');
				$('.clear-selected-patient').click();
        $('#editEvent .datetime').html(moment(start).locale(locale).format('LLL'));
        appModalMode = 'newAppointment';
        $('#editEvent').modal('show');
        $('#editEvent :input').val('');
				
				log('selected clinic is : ' + selectedClinic);
				if (selectedClinic != 'all'){
          $('#clinicSelectEditApp').val(selectedClinic);
					renderServicesLookup(selectedClinic);
					$('#selectService').val(iDefaultService);
				} else if (clinicID != '') {
          //get the clinic id from the background event if it exists
          log('the clinic id from BG is : ' + clinicID);
          $('#clinicSelectEditApp').val(clinicID);
          renderServicesLookup(clinicID);
					$('#selectService').val(iDefaultService);
          clinicID ='';
				} else {
          $('.selectService').html('Select a clinic first');
        }
				$('.warningSelectClinic').hide();
        eventStart = start;
        eventEnd = end;
        //eventAllDay = allDay;
        if (mode === 0) { //we are in resource mode .. we can get the resource.id without getting an error
          userID = resource.id;
          //log(resourceID + 'is the resource');
        } else {
          userID = selectedUser;
        }

      },
      eventClick: function(event, jsEvent, view) {
        objEvent = event;
        objNewAppointment = event; //used for book next appointment
        eventID = event.id; //set the global var of eventID
        patientID = event.patientID;


        loadEventDetails();


      },
      eventDragStart: function(event, jsEvent, ui, view) {
        //log('start draggin!');
        oldEventStart = event.start;
        oldEventUsername = event.resourceName;



      },

      eventDrop: function(event, delta, revertFunc) {

        //log(oldEventStart);
        objEvent = event;
        bootbox.confirm({
          message: "Confirm the move?",
          buttons: {
            cancel: {
              label: 'No',
              className: 'btn-primary'
            },
            confirm: {
              label: 'Yes',
              className: 'btn-primary'
            }

          },
          callback: function(result) {
            if (result === true) // update appointment in DB
            {



              Appointment.update({
									id: event.id,
                  patientID: event.patientID,
                  start: event.start.format(),
                  end: event.end.format(),
                  user: event.resourceId,
                  service: event.serviceId,
									status: event.status,
									clinic: function (){
                    if (clinicID != ''){
                      return clinicID; 
                    } else { 
                      return event.clinic;}
                    }
				  
              }, function() {
                renderRightPanelPatientAppointments(); 
                event.resourceName = users[event.resourceId].data.display_name;
                var newEventUsername = event.resourceName;
								
                if (oldEventUsername != newEventUsername) {
                  Appointment.addLog(objEvent.id, 'Rescheduled', 'appointment changed from ' + oldEventUsername + ' - ' + moment(oldEventStart).locale(locale).format('LLL') + ' to ' + newEventUsername + ' - ' + moment(objEvent.start).locale(locale).format('LLL'), 'label-warning');
                } else {
                  Appointment.addLog(objEvent.id, 'Rescheduled', 'appointment changed from ' + moment(oldEventStart).locale(locale).format('LLL') + ' to ' + moment(objEvent.start).locale(locale).format('LLL'), 'label-warning');
                }
								Appointment.addLog(objEvent.id, 'Email', 'Appointment amendment sent','label-primary');
              }, 'yes' ,function() { //true = send email 
					revertFunc();
					});

				    

            } else { //revert the drop
              revertFunc();
            }
          }
        });

      },

      eventResize: function(event, delta, revertFunc) {
		
			Appointment.update({
				  id: event.id,
              patientID: event.patientID,
              start: event.start.format(),
              end: event.end.format(),
              user: event.resourceId,
              service: event.serviceId,
							status:event.status,
							clinic: event.clinic
              }, function() {
                log ('app updated');
              }, 'no' ,function () {
					revertFunc();
					});
				

      },


      eventRender: function(event, element) {
				
				
				if (event.insurance === null || event.insurance === undefined){
					insurance = '';
				}else{
					insurance = '<span class="event_insurance">[' + event.insurance + ']<span>';
				}
				
        icons = '<i class="fa fa-thumbs-down icon-thumbs-down tip-init" data-original-title="Did not show" title="Did not show"></i>';
        icons += '<i class="fa fa-thumbs-up icon-thumbs-up tip-init" title="Arrived"></i>';

        $(".fc-content", element).append(insurance);
				$(".fc-content", element).append(icons);

        if (event.status == 1) {
          $(element).find('.icon-thumbs-up').show();
        } else {
          $(element).find('.icon-thumbs-up').hide();
        }

        if (event.status == 8) {
          $(element).find('.icon-thumbs-down').show();
        } else {
          $(element).find('.icon-thumbs-down').hide();
        }

        if (event.status == 6) {
          $(element).find('.fc-title').addClass('appointmentCancelled');
        }



				if (event.type != 'bgEvent'){
				  element.addClass('clinic' + event.clinic);
				  element.addClass('appointment');
        }


        
        if (highlightEvent === true){
          if (event.id == eventIDtoHighlight){
            highlightEvent = false;
            element.addClass('run-long-pop-animation');
            
          }
          
        }

    

      },
			
			eventAfterAllRender: function (view) {
				//log("after render");
				//log(selectedClinic + ' is selected');
				if (selectedClinic == 'all') {
					//show events for all clinics
					$('.appointment').show();
					//log('showing all appointments');
        
				} else {
        //show events for selected clinic
					$('.appointment').hide();
					$('.clinic' + selectedClinic).show();
					//log('showing only specific clinic');
        }

			},

      viewRender: function(view, element) {
        if (view.name == 'agendaDay') {
          //do something
        }

      },
      selectOverlap: function(event) {
        //Little trick to get BG event details (clinic id etc..)
        //if the function returns true it will allow the selection
        console.log('BG event ' + event.clinic);
        clinicID = event.clinic;
        return true;
    }




    }); // end calendar

  } // end initCal()

  $('.tip-init').tooltip();
	
	
});

//outside document ready



function renderServicesLookup(clinic_id){
		selectService = "<select id='selectService' name='selectService' class='form-control'>";
		oClinic = clinics.find(x => x.clinic_id === clinic_id.toString());
		log('here comes the c!!');
		log(oClinic);
		  $.each(oClinic.services, function() {
		    if (this.default == 1) {
		      iDefaultService = this.id;
		    }
		    selectService += "<option color =" + this.color + " duration=" + this.duration + " value=" + this.id + ">" + this.name + "</option>";
		  });
    selectService += "</select>";

    $('.selectService').html(selectService);
	}	


  