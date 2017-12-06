<?
//view calendar
?>

<input type="hidden" id="selectedUserID" value="<?=$selectedUserID;?>"
<div class="row">
	<div class="col-sm-12 col-md-12"><!-- Start Left content -->
 <div class="row">
<!-- start: calendar -->
	
	<div id="calendar"></div>
	<div id="sidebar_right" class="col-md-2 hidden">This is the sidebar</div>


<!--end calendar-->

	 </div>
	</div>
</div>



<!--start: modal -->

<div class="modal modal-wide fade" id="editEvent" role="dialog" tabindex="-1">
  <div class="modal-dialog" role="document">
	<form id="editAppointment" role="form" data-toggle="validator">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
		<h5 class="modal-title">Add Appointment</h5>
      </div>
      <div class="modal-body">
        <!-- Nav tabs -->
        <ul class="nav nav-pills">
			<li class="active">
                <a  href="#details" data-toggle="tab"><i class="fa fa-calendar fa-fw"></i>Details</a>
			</li>
            <li>
                <a  href="#notes" data-toggle="tab"><i class="fa fa-pencil fa-fw"></i>Notes</a>
			</li>
			
		</ul>
	
		
		<div class="tab-content">
            <div class="tab-pane active" id="details">
                <div class="patient-section">
					
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Date</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="datetime"></span>
								
							</div>
						</div>	
					</div>
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Clinic</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="selectClinic"></span><span class="text-danger warningSelectClinic" style="display: none;">Patient not usually booked at this location!</span>
								
							</div>
						</div>	
					</div>
					<div class="row">&nbsp</div>
                    <div class="row">
                        <div class="col-sm-2">
							<label class="patient-name">Patient</label>
						</div>
                        <div class="col-sm-9">
								<div class="row patient-select">
									<div class="col-sm-9">
										<div class="input-group" style="padding: 5px;">
											<span class="input-group-addon"><i class="fa fa-fw fa-user"></i></span>
											<input type="text" class="form-control" id="patient-search" pattern="^[a-zA-Z '.-]+$" placeholder="Patient last and first name" required>
										</div>
										<div class="input-group" style="padding: 5px;">
											<span class="input-group-addon"><i class="fa fa-fw fa-phone"></i></span>
											<input type="tel" class="form-control" id="phone" placeholder="Telephone" required>
										</div>
										<div class="input-group" style="padding: 5px;">
											<span class="input-group-addon"><i class="fa fa-fw fa-envelope-o"></i></span>
											<input type="email" class="form-control" id="email" placeholder="Email">
										</div>
									</div>
								</div>
							
							
							<div class="row">
								<div class="col-sm-9 selected">
									<p>
										<span class="selected-patient-name"></span>
										<span class="pull-right"><a title="Remove patient from event" class="clear-selected-patient"><i class="fa fa-times-circle">&nbsp;</i></a></span>
									</p>
									<p class="selected-patient-details">
										<span class="selected-dob-holder">
											<i class="fa fa-calendar-o"></i> <span class="selected-dob"></span> &nbsp; &nbsp;
										</span>
										<span class="selected-telephone-holder">
											<i class="fa fa-fw fa-phone"></i> <span class="selected-telephone"></span> &nbsp; &nbsp;
										</span>
										<span class="selected-mobile-holder hide">
											<i class="fa fa-fw fa-mobile-phone"></i>+32 <span class="selected-mobile">474323335</span> &nbsp; &nbsp;
										</span>
										<span class="selected-email-holder">
											<i class="fa fa-fw fa-envelope-o"></i> <span class="selected-email"></span>&nbsp; &nbsp;
										</span>
										<span class="selected-clinic-holder">
											<i class="fa fa-hospital-o"></i> <span class="selected-clinic">RUGCENTRUM GENT</span>
										</span>
										
										

									</p>
								</div>
								
		
							</div>	
						</div>
                    </div>
					<div class="row">&nbsp</div>
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Service</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="selectService"></span>
								
							</div>
						</div>	
					</div>
                </div>
            </div>
			<div class="tab-pane" id="notes">
                <h3>Notes</h3>
			</div>
            
		</div>
		
       
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary editAppSubmit">Save</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
	</form>
  </div>
</div>
<!--stop: modal -->

<!--start: eventDetails-modal -->
<div class="modal fade" id="eventDetails">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Thierry Duhameeuw</h3>      
      </div>
      <div class="modal-body">
		
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<!--stop: eventDetails-modal -->

<!--start: editPatient-modal -->
<div class="modal modal-medium fade" id="editPatient">
  <div class="modal-dialog" role="document">
	<form id="editPatientForm" role="form" data-toggle="validator">
    <div class="modal-content">
      <div class="modal-header well">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Edit Patient</h3>      
      </div>
      <div class="modal-body">
		<div class="loading">Loading patient...</div>
		<div class="patientDetails" style="display: none;">
		<div class="row">
			
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_FirstName">First name</label>
					<input autocomplete="off" class="first form-control" id="Patient_FirstName" name="patient_firstname" type="text">
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_LastName">Last name</label>
					<input autocomplete="off" class="last form-control" id="Patient_LastName" name="patient_surname" type="text">
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group ">
					<label>Date of birth</label>
					<input autocomplete="off" class="last form-control" id="Patient_DOB" name="dob" type="text">
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_LastName">Sex</label>
					<select name=sex id="Patient_Sex" class="form-control" style="width:100px;">
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_FirstName">Telephone</label>
					<input autocomplete="off" class="first form-control" id="Patient_Phone" name="phone" type="text">
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_LastName">Email</label>
					<input autocomplete="off" class="last form-control" id="Patient_Email" name="email" type="text">
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_FirstName">Address</label>
					<input autocomplete="off" class="first form-control" id="Patient_Address" name="address" type="text">
				</div>
				<div class="form-group ">
					<label class="" for="Patient_FirstName">Postcode</label>
					<input autocomplete="off" class="first form-control" id="Patient_Postcode" name="postcode" type="text">
				</div>
			
			
				<div class="form-group ">
					<label class="" for="Patient_LastName">City</label>
					<input autocomplete="off" class="last form-control" id="Patient_City" name="city"  type="text">
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group">
					<label class="" for="Patient_Clinic">clinic</label>
					<span class="selectClinic"></span>
					
				</div>
			</div>	
		</div>
		</div>
		<div class="row">
			
			
		</div>
		
      </div>
      <div class="modal-footer well">
		<button type="submit" class="btn btn-primary">Save</button>
		<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		
        
      </div>
    </div>
	</form>
  </div>
</div>
<!--stop: editPatient-modal -->







