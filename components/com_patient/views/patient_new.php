<script>

	var userID = <?=$userID?>;
	var patientID = <?=$patient_id?>;
	var patientName = '<?=$patient->patient_surname.' '.$patient->patient_firstname?>';
	
</script>

<input id="patient_id" type="hidden" value="<?= $patient->patient_id;?>">
<input id="practitioner_id" type="hidden" value="<?= $practitioner_id;?>">
<input id="clinic_id" type="hidden" value="<?= $patient->clinic;?>">
<input id="patient_name" type="hidden" value="<?=$patient->patient_surname.' '.$patient->patient_firstname?>">


<div class="col-sm-10 col-md-10 left-content" style="display:none;"><!-- Start Left content -->
	
	<!-- start: Breadcrumb -->
	<!-- <?loadModule('breadcrumbs');?> -->
	<!-- /breadcrumb-->
	<div class="row">
	
	
	<div class="col-xs-12 top_panel">
		<div class="box">
						<div class="box-header">
							<h2><i class="icon-user"></i><span class="break"></span><strong><?= $patient->patient_surname.' '.$patient->patient_firstname?></strong></h2>
							<ul class="nav tab-menu nav-tabs" id="myTab">
								<li class="active"><a href="#info">Info</a></li>
								<li><a href="#details">Details</a></li>
								<li><a href="#notes_tab">Notes</a></li>
							</ul>
							
						</div>
						<div class="box-content">
							
							<div id="myTabContent" class="tab-content">
								<div class="tab-pane active" id="info">
									
									
								</div>
								<div class="tab-pane" id="details">
									<div class="row">
										<div class="col-xs-2"><img width="100%" src="assets/img/face-placeholder.jpg"></div>
										<div class="col-xs-4">
										
										</div>
									</div>
								</div>
								<div class="tab-pane" id="notes_tab">
									<div class="row">
										<div class="col-xs-2"><img width="100%" src="assets/img/face-placeholder.jpg"></div>
										<div class="col-xs-9">
										<label class="control-label" for="textarea2">Notes</label>
								  					
											<div class="box">
												
								  					
														<div contenteditable="true" id="thierry" rows="6">
														<?echo $patient->notes?>
														</div>
											</div>
											<button onclick="saveNotes();" type="button" class="btn btn-primary">Save</button>
											
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
		
	</div><!--/col-->
	</div><!--/row-->


<div class='row'>
	<div class="col-md-12 visible-md visible-lg list-encounters"><!--Start encounter flow -->
	<div class="box">
						<div class="box-header">
							<h2><i class="fa fa-stethoscope" aria-hidden="true" style="border-right: none;"></i></h2>
							<ul class="nav nav-tabs" style="float:left">
								<li id="tab_encounters" class="active"><a data-toggle="tab" href="#pane_encounters">Encounters</a></li>
								<li id="tab_new_encounter" ><a data-toggle="tab" href="#pane_new_encounter">New encounter</a></li>
								
								
							</ul>
							<div id="btn_new_encounter" class="box-icon pull-right">
								<i class="fa fa-plus blue" aria-hidden="true"></i>
							</div>
						</div>
						
						<div class="box-content">
						<div id="my2tabs" class="tab-content">
						<div class="tab-pane active" id="pane_encounters">		
						<div id="timeline" class="timeline">
						
							
						</div><!--/timeline-->
						</div><!--/tab-pane #encounters-->
						
						
						
						<div class="tab-pane" id="pane_new_encounter">
							
							<div class="row">
								<div class="col-sm-3 pull-right">
								<span class="pull-right">
								<span id="label_encounter_saved" class="label label-success">Saved &nbsp&nbsp&nbsp;</span>
								<span id="label_encounter_saving" class="label label-success">Saving... &nbsp;</span>
								<span id="label_encounter_saving_error" class="label label-danger">Not Saved!</span>
								</span>
								</div>
						    </div>
							<div class="row">
								
								<div class="col-sm-2">
								<button type="button" class="btn btn-primary btn_close_encounter btn-block">Close</button>
								</div>
							</div>
							<br>
						
							<div id="history-panel" class="panel panel-success history">
								<div class="panel-heading">History</div>
								<div class='panel-body'>
									<ul class="nav nav-tabs" id="history_tabs">
										<li class="active"><a href="#general_history" data-toggle="tab">General</a></li>
										<li><a href="#paediatric_history" data-toggle="tab">Peadiatric</a></li>
									</ul>
									
									<div class='tab-content'>
										<div class='tab-pane active' id='general_history'>
											adult
										</div>
										<div class='tab-pane' id='paediatric_history'>
											child
										</div>
									</div>
								</div>
							</div><!-- /panel -->
							
							<div id="complaints-panel" class="panel panel-success">
								<div class="panel-heading">Complaints</div>
								<div class='panel-body'>
									
								</div>
							</div><!-- /panel -->
							
							
							
							<div class="panel panel-primary">
								<div class="panel-heading">SOAP note</div>
								<div class="panel-body">
							
							
							<form id="editSOAP" role="form">
			
							
							<div class="row">
								<div class="col-sm-6">
									<div class="form-group ">
										<input id="SOAP_ID" name="id" type="hidden">
										<label class="" for="subjective">Subjective</label>
										<textarea class="form-control" rows="5" id="subjective" name="subjective"></textarea>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group ">
										<label class="" for="objective">Objective</label>
										<textarea class="form-control" rows="5" id="objective" name="objective"></textarea>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-6">
									<div class="form-group ">
										<label class="" for="assessment">Assessment</label>
										<textarea class="form-control" rows="5" id="assessment" name="assessment"></textarea>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group ">
										<label class="" for="plan">Plan</label>
										<textarea class="form-control" rows="5" id="plan" name="plan"></textarea>
									</div>
								</div>
							</div>
							</form>
							</div>
							</div>
							<div class="row">
								
								<div class="col-sm-2">
								<button type="button" class="btn btn-primary btn_close_encounter btn-block">Close</button>
								</div>
							</div>
							
						</div><!--/tab-pane #new encounter-->
					 </div><!--/tab-content-->	
					 </div><!--/box-content-->
					 </div><!--/box-->
					
	</div><!--/history flow -->
</div><!--/row-->
<div class="row">
	
  				
	<div class="col-xs-8 col-md-8 hidden">
	<div class="box">
						<div class="box-header">
							<h2><i class="icon-reorder"></i><span class="break"></span>Consultations</h2>
							
								
							
						</div>
						<div class="box-content">
							<table class="table">
								  <thead>
									  <tr>
										  <th>Date</th>
										  <th>S</th>
										  <th>O</th>
										  <th>T</th>
										  <th>Practitioner</th>
									  </tr>
								  </thead>   
								  	<tbody>
					<?
					foreach($appointments as $appointment){
						?>
						<tr>
							<td>
								<?
								echo $appointment->scheduled_date?>
							</td>
							<td>++</td>
							<td>SLR 95deg</td>
							<td>T10;L5</td>
							<td>
								<?
								echo $appointment->scheduled_practitioner_name?>
							</td>
						</tr>
						<?
					}
					?>
				</tbody>
							</table>
						</div><!--/box-content -->
	</div><!--/box --->
	</div><!--/col -->
</div><!--/row -->
</div><!--/col /left content -->

<div class="col-md-2 hidden-xs hidden-sm" id="feed"><!-- Start Right content -->
	<!--start right menu -->
		<?loadModule('patient_menu');?>
				
					
	<!--/right menu -->
	

</div><!--/col /Right Content-->

<!--</div><!--/row-->




<!--start:diagnoses-modal -->
<div class="modal fade" id="diagnosesModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Search diagnosis</h3>      
      </div>
      <div class="modal-body">
		<form role="form">
		<div class="form-group">
			<input class="form-control" autocomplete="off" id="searchinputDiagnoses" type="search" size="30" placeholder="Search diagnoses..." />
		</div>
		<div id="searchlistDiagnoses" class="list-group">
			
			<!-- FILLED DYNAMICALLY -->
		</div>
	</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<!--stop: diagnoses-modal -->





<!-- Mustache Templates -->





<script id='tmpl_complaint_tab' type='xml-tmpl-mustache'>
	<li class="{{active}}"><a id="{{complaint_tab_id}}" data-toggle="tab" href="#{{pane_name}}">{{tab_title}}</a></li>
</script>

<script id='tmpl_complaint_init' type='xml-tmpl-mustache'>
	
									<div class="row">
									<div class="col-sm-12">
								
									<ul id="complaints_tabs" class="nav nav-tabs">
										<li class="add_complaint"><a  href="#add">+ Add Complaint</a></li>	
									</ul>

									<div id="complaints_panes" class="tab-content">
										<div class="tab-pane active" id="add"><br>No complaints<br></div>
									</div>
								
								
								</div>
								</div>
								
</script>




<?include(TEMPLATES . 'top_panel.html'); ?>
<?include(TEMPLATES . 'encounter_flow.html'); ?>
<?include(TEMPLATES . 'complaint.html'); ?>
<?include(TEMPLATES . 'general_history.html'); ?>
<?include(TEMPLATES . 'paediatric_history.html'); ?>


