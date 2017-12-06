<div class="row">
	<div data-theme="b" data-content-theme="b" id="patient-details-div">
		<ul data-role="listview" data-inset="true" data-divider-theme="d">
			<li data-role="fieldcontain">
				<img src="images/face-placeholder.jpg">
				<h2>
					<?
					echo $patient->patient_surname.' '.$patient->patient_firstname?>
				</h2>
				<p>
					<strong>
						ID
					</strong>
					<?
					echo $patient->patient_id?>
				</p>
				<p>
					<strong>
						DOB
					</strong>
					<?
					echo $patient->dob?>
				</p>
				<br>
				<p>
					<strong>
						Physician:
					</strong>
					<?
					echo $user->user_lastname.' '.$user->user_firstname;
					?>
				</p>
			</li>
			<li data-role="list-divider">
				Contact details
			</li>
			<li data-icon="false">
				<?
				echo sprintf('<a href="http://maps.google.com/?q=%s %s %s %s">',$patient->address,$patient->postcode,$patient->city,$patient->country);
				?>
				<?
				echo sprintf('%s - %s %s - %s',$patient->address,$patient->postcode,$patient->city,$patient->country)?>
			</a>
		</li>
		<?
		if($patient->phone!=NULL){
			echo sprintf('<li data-icon="false"><a href="tel:%s" rel="external">%s</a></li>',$patient->phone,$patient->phone);
		}
		?>
		<?
		if($patient->phone_work!=NULL){
			echo sprintf('<li data-icon="false"><a href="tel:%s" rel="external">%s</a></li>',$patient->phone_work,$patient->phone_work);
		}
		?>
		<?
		if($patient->gsm!=NULL){
			echo sprintf('<li data-icon="false"><a href="tel:%s" rel="external">%s</a></li>',$patient->gsm,$patient->gsm);
		}
		?>
		<?
		if($patient->email!=NULL){
			echo sprintf('<li data-icon="false"><a href="mailto:%s" rel="external">%s</a></li>',$patient->email,$patient->email);
		}
		?>
		<li data-role="list-divider">
			Info
		</li>
		<li>
			<p>
				<strong>
					Profession:
				</strong>
				<?
				echo $patient->profession;
				?>
			</p>
			<p>
				<strong>
					Insurance:
				</strong>
				<?
				echo $patient->insurance;
				?>
			</p>
			<p>
				<strong>
					Referrer:
				</strong>
				<?
				echo $patient->referrer;
				?>
			</p>
		</li>
	</ul>
	<div data-role="collapsible-set" data-theme="c" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d">
		<div data-role="collapsible" data-collapsed="false">
			<h3>
				Consultations
			</h3>
			<table data-role="table" class="ui-body-d ui-shadow table-stripe ui-responsive">
				<thead>
					<tr class="ui-bar-d">
						<th data-priority="1">
							Date
						</th>
						<th data-priority="1">
							Time
						</th>
						<th data-priority="2">
							Physician
						</th>
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
							<td>
								<?
								echo $appointment->scheduled_time?>
							</td>
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
		</div>
	</div>
</div>
</div>
<!-- /content -->
</div>