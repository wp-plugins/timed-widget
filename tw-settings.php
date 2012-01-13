<?php

/**
 * @package TimedBlock
 * @version 0.1
 */
/*
 * 
 */



function tw_settings_display () {
	$codeblocks = get_option("tw_codeblock_list");
	$schedules = get_option("tw_schedule_list");
	$noCodes = count($codeblocks) == 0;

?>
	<h1>Timed Block Widget Settings</h1>
	<div id='accordion'>
		
		<h3><a href='#'>Code Blocks</a></h3>
		<div>
			<form action="#" method="get" name="codeblock_select_form" id="codeblock_select_form">
				<button name="codeblock_add" id="codeblock_add" type="button">Add New Code Block</button>
			</form>
			<div id='codeblock_tabs'>
				<ul>
				<?php 
					
					foreach ($codeblocks as $block_id => $block)
					{
						echo "<li><a href='#codeblock_tab_$block_id'>{$block->block_name}</a></li>";	
					}
				?>
				</ul>
				
				<?php 
					
					foreach ($codeblocks as $block_id => $block)
					{
						echo "<div id='codeblock_tab_$block_id'></div>";	
					}
				?>
			</div>
			<div id="codeblock_panel" >
			
				<div id="codeblock_setup">

				</div>
				<div id="codeblock_info"  <?php if($noCodes){?> class="tb-hidden"<?php }?>>
					<form action="#" method="get" name="codeblock_form" id="codeblock_form">
						<div id='codeblock_meta'>
							<label for="codeblock_name">Name</label><input type="text" name="codeblock_name" id="codeblock_name" />
							<div id='color_panel'><label for='colorpicker'>Timeslot Color: </label><div id='colorpicker_container'><div id='colorpicker'></div></div></div>
							<input type="hidden" name='codeblock_color' id='codeblock_color' />
							<div id='codeblock_buttons'>
								<button name="codeblock_save" id="codeblock_save" type="button">Save</button>
								<button name="codeblock_remove" id="codeblock_remove" type="button">Remove</button>
								<button name="codeblock_reset" id="codeblock_reset" type="button">Reset</button>
							</div>
						</div>
						<div id='tawrap'><textarea rows="25" cols="30" name="codeblock_code" id="codeblock_code"></textarea></div>
					</form>
				</div>
			</div>
		</div>
		<h3><a href='#'>Widget Schedules</a></h3>
		<div id='widget_schedules'> 
		<div id='schedule_tabs'>
				<ul>
				<?php 
					
					foreach ($schedules as $schedule_id => $schedule)
					{
						echo "<li><a href='#schedule_tab_$schedule_id'>{$schedule->title}</a></li>";	
					}
				?>
				</ul>
				
				<?php 
					
					foreach ($schedules as $schedule_id => $schedule)
					{
						echo "<div id='schedule_tab_$schedule_id'></div>";	
					}
				?>
			</div>
			<div id='schedule_panel'>
				<form id='schedule_form'>
					<button type="button" name='schedule_edit' id='schedule_edit'>Edit Schedule</button>
					<button type="button" name='schedule_remove' id='schedule_remove'>Remove Schedule</button>
					<button type="button" name='schedule_add' id='schedule_add'>New Schedule</button>
					<button type="button" name='schedule_embed' id='schedule_embed'>Embed Schedule</button>
				</form>
				<div id='calendar_panel'>
				<div id="calendar"></div>
			</div>
			</div>
			
		</div>
	</div>
	<div id='timeslot_dialog'>
		<form>
			<div>
				<label for='timeslot_codelblock'>Codeblock: </label>
				<select name='timeslot_codeblock' id='timeslot_codeblock'>
				</select>
			</div>
			<div>
				<label for='timeslot_start_time'>Start Time: </label>
				<input type='text' id='timeslot_start_time' name='timeslot_start_time' />
			</div>
			<div>
				<label for='timeslot_end_time'>End Time: </label>
				<input type='text' id='timeslot_end_time' name='timeslot_end_time' />
			</div>
			<div>
				<label for='timeslot_start_date'>Start Date: </label>
				<input type='text' id='timeslot_start_date' name='timeslot_start_date' />
			</div>
			<div>
				<label for='timeslot_end_date'>End Date: </label>
				<input type='text' id='timeslot_end_date' name='timeslot_end_date' />
			</div>
			<div>
				<div id='timeslot_day_box_label'>Display on:</div>
				<div class='timeslot_day_box'><label for='timeslot_on_monday'>M</label><input class='timeslot_day' type='checkbox' name=timeslot_on_monday' id='timeslot_on_monday' /></div>
				<div class='timeslot_day_box'><label for='timeslot_on_tuesday'>T</label><input class='timeslot_day' type='checkbox' name=timeslot_on_tuesday' id='timeslot_on_tuesday' /></div>
				<div class='timeslot_day_box'><label for='timeslot_on_wednesday'>W</label><input class='timeslot_day' type='checkbox' name=timeslot_on_wednesday' id='timeslot_on_wednesday' /></div>
				<div class='timeslot_day_box'><label for='timeslot_on_thursday'>T</label><input class='timeslot_day' type='checkbox' name=timeslot_on_thursday' id='timeslot_on_thursday' /></div>
				<div class='timeslot_day_box'><label for='timeslot_on_friday'>F</label><input class='timeslot_day' type='checkbox' name=timeslot_on_friday' id='timeslot_on_friday' /></div>
				<div class='timeslot_day_box'><label for='timeslot_on_saturday'>S</label><input class='timeslot_day' type='checkbox' name=timeslot_on_saturday' id='timeslot_on_saturday' /></div>
				<div class='timeslot_day_box'><label for='timeslot_on_sunday'>S</label><input class='timeslot_day' type='checkbox' name=timeslot_on_sunday' id='timeslot_on_sunday' /></div>
			</div>
		</form>
	</div>
	
	<div id='schedule_dialog'>
		<form>
			<div>
				<label for='schedule_name'>Schedule Name: </label>
				<input type='text' id='schedule_name' name='schedule_name' />
			</div>
			<div>
				<label for='schedule_default'>Default Timeblock: </label>
				<select id='schedule_default', name='schedule_default'></select>
			</div>
		</form>
	</div>
	
	<div id='embed_dialog'></div>
	
	<ul id='event_enabled_menu' class='contextMenu'>
		<li class='event_disable'><a href='#disable'>Disable this occurence</a></li>
		<li class='event_edit'><a href='#edit'>Edit this series</a></li>
	</ul>
	
	<ul id='event_disabled_menu' class='contextMenu'>
		<li class='event_enable'><a href='#enable'>Enable this occurence</a></li>
		<li class='event_edit'><a href='#edit'>Edit this series</a></li>
	</ul>
<?php 	
}

class codeblock {
	
	public $block_name;
	public $block_code;
	public $block_color;
	
	function __construct($name, $code)
	{
		$this->block_name = $name;
		$this->block_code = $code;
		$this->block_color = sprintf("%02X%02X%02X", mt_rand(0, 255), mt_rand(0, 255), mt_rand(0, 255));
	}
}

class codeblock_list_response {
	
	public $codeblocks;
	public $block_id;
	
	function __construct($codeblocks, $block_id)
	{
		$this->codeblocks = $codeblocks;
		$this->block_id = $block_id;
	}
}

class timeslot {
	public $codeblock_id;
	public $schedule_id;
	public $start_time;
	public $end_time;
	public $start_date;
	public $end_date;
	public $onMonday;
	public $onTuesday;
	public $onWednesday;
	public $onThursday;
	public $onFriday;
	public $onSaturday;
	public $onSunday;
	
	function __construct($codeblock_id, $schedule_id, $start_time, $end_time, $start_date,  $end_date, $onMonday, $onTuesday, $onWednesday, $onThursday, $onFriday, $onSaturday, $onSunday) {
		$this->codeblock_id = $codeblock_id;
		$this->schedule_id = $schedule_id;
		$this->start_time = $start_time;
		$this->end_time = $end_time;
		$this->start_date = $start_date;
		$this->end_date = $end_date;
		$this->onMonday = $onMonday;
		$this->onTuesday = $onTuesday;
		$this->onWednesday = $onWednesday;
		$this->onThursday = $onThursday;
		$this->onFriday = $onFriday;
		$this->onSaturday = $onSaturday;
		$this->onSunday = $onSunday;
	}
}

class widget_schedule {
	public $title;
	public $default_codeblock;
	function __construct($title) {
		$this->title = $title;
		$this->default_codeblock = null;
	}
}

class timeslot_exception {
	public $exception_day;

	function __construct($exception_day) {
		$this->exception_day = $exception_day;
	}
}

class calEvent {
	public $id;
	public $starttime;
	public $endtime;
	public $date;
	public $title;
	public $timeslot_id;
	public $color;
	public $enabled;
	
	function __construct($id, $starttime, $endtime, $date, $title, $timeslot_id, $color, $enabled) {
		$this->id = $id;
		$this->starttime = $starttime;
		$this->endtime = $endtime;
		$this->title = $title;
		$this->date = $date;
		$this->timeslot_id = $timeslot_id;
		$this->color = $color;
		$this->enabled = $enabled;
	}
}

//Based on code taken from http://www.php.net/manual/en/function.array-search.php#93352
function tw_ajax_exception_search($needle, $haystack, &$probe) {
	$high = Count( $haystack ) -1;
    $low = 0;
    
    while ( $high >= $low )
    {
        $probe = Floor( ( $high + $low ) / 2 );
        $comparison = strcmp( $haystack[$probe], $needle );
        if ( $comparison < 0 )
        {
            $low = $probe +1;
        }
        elseif ( $comparison > 0 ) 
        {
            $high = $probe -1;
        }
        else
        {
            return true;
        }
    }
    //The loop ended without a match 
    //Compensate for needle greater than highest haystack element
    if(count($haystack) == 0 || strcmp($haystack[count($haystack)-1], $needle) < 0)
    {
        $probe = count($haystack);
    } 
    return false;
}

function tw_ajax_exception_add() {
	$timeslots = get_option("tw_timeslot_list");
	$exceptions = get_option("tw_exception_list");
	$timeslot_id = $_POST['timeslot_id'];
	$day = $_POST['day'];
	if(!$timeslots[$timeslot_id]){
		$success = false;
	} else {
		$exception_index = 0;
		if(tw_ajax_exception_search($day, $exceptions[$timeslot_id], $exception_index)){
			$success = false;
		} else {
			array_splice( $exceptions[$timeslot_id], $exception_index, 0, array($day) );
			update_option('tw_exception_list', $exceptions);
			$success = true;
		}
	}
	$response = json_encode(array("success" => $success));
	
	
	header( "Content-Type: application/json" );
	echo $response;
	
	exit;
}

function tw_ajax_exception_remove() {
	$timeslots = get_option("tw_timeslot_list");
	$exceptions = get_option("tw_exception_list");
	$timeslot_id = $_POST['timeslot_id'];
	$day = $_POST['day'];
	if(!$timeslots[$timeslot_id]){
		$success = false;
	} else {
		$exception_index = 0;
		if(!tw_ajax_exception_search($day, $exceptions[$timeslot_id], $exception_index)){
			$success = false;
		} else {
			array_splice( $exceptions[$timeslot_id], $exception_index, 1 );
			update_option('tw_exception_list', $exceptions);
			$success = true;
		}
	}
	$response = json_encode(array("success" => $success));


	header( "Content-Type: application/json" );
	echo $response;

	exit;
}



function tw_ajax_schedule_add () {

 	$schedules = get_option("tw_schedule_list");
 	

 	end($schedules);
 	
 	$blockid = key($schedules) + 1;
 	
 	reset($schedules);
 	
 	array_push($schedules, new widget_schedule("Schedule " . ($blockid + 1)));
    
 	update_option("tw_schedule_list", $schedules);
 	
    $response = json_encode(array("schedules" => $schedules, "schedule_id" => $blockid));
    
 
    header( "Content-Type: application/json" );
    echo $response;
 
    exit;
}

function tw_ajax_schedule_update() {
	$schedule_id = $_POST['schedule_id'];
	$schedules = get_option("tw_schedule_list");
	$schedule_name = $_POST['schedule_title'];
	$schedule_default = $_POST['schedule_default'];
	
	
	if(isset($schedules[$schedule_id])) {
		$schedules[$schedule_id]->title = $schedule_name;
		if ($schedule_default != "none") {
			$schedules[$schedule_id]->default_codeblock = intval($schedule_default);
		} else {
			$schedules[$schedule_id]->default_codeblock = null;
		}
		update_option("tw_schedule_list", $schedules);
		$response = json_encode(array("success" => true));
	} else {
		$response = json_encode(array("success" => false));
	}
	
	   header( "Content-Type: application/json" );
    echo $response;
 
    exit;
}

function tw_ajax_schedule_remove() {
	$schedule_id = $_POST['schedule_id'];
	$schedules = get_option("tw_schedule_list");
	$timeslots = get_option('tw_timeslot_list', array());
	$can_delete = false;
	foreach ($schedules as $key => $value) {
		if($key == $schedule_id) {
			$can_delete = true;
			break;
		}
		$prev_id = $key;
	}
	if($can_delete )
	{
		if (sizeof($schedules) > 1) {
			unset($schedules[$schedule_id]);
			$replaced = false;
		} else {
			$replaced = true;
			$schedules[$schedule_id] = new widget_schedule("Default Schedule");
		}
		update_option("tw_schedule_list", $schedules);
		foreach ($timeslots as $timeslot_id => $timeslot)
		{
			if($timeslot->schedule_id == $schedule_id){
				unset($timeslots[$timeslot_id]);
			}
		}
		update_option("tw_timeslot_list", $timeslots);
		$response = json_encode(array("removed" => true, "schedule_id" => $schedule_id, "prev_id" => $prev_id, "replaced" => $replaced));
	} else {
		$response = json_encode(array("removed" => false));
	}
	
	
	header( "Content-Type: application/json" );
    echo $response;
	exit;
	
}


function tw_ajax_codeblock_add () {
	// get the submitted parameters
    // $postID = $_POST['postID'];
 	$codeblocks = get_option("tw_codeblock_list");
 	

 	end($codeblocks);
 	
 	$blockid = key($codeblocks) + 1;
 	
 	reset($codeblocks);
 	
 	$newblock = new codeblock("Codeblock " . ($blockid + 1), "");
 	
 	array_push($codeblocks, $newblock);
    
 	update_option("tw_codeblock_list", $codeblocks);
 	
    $response = json_encode( array("success" => true, "block_name" => $newblock->block_name, "block_code" => $newblock->block_code, "block_id" => $blockid, "block_color" => $newblock->block_color));
    
 
    header( "Content-Type: application/json" );
    echo $response;
 
    exit;
}

function tw_ajax_codeblock_save() {
	$block_id = $_POST['block_id'];
	$block_name = $_POST['block_name'];
	$block_code = $_POST['block_code'];
	$block_color = $_POST['block_color'];
	
	$codeblocks = get_option("tw_codeblock_list");
	
	if (isset($codeblocks[$block_id])) {
		$block_code = str_replace('\\\'', '\'', $block_code);
		$block_code = str_replace('\\"', '"', $block_code);
		$codeblocks[$block_id]->block_name = $block_name;
		$codeblocks[$block_id]->block_code = $block_code;
		$codeblocks[$block_id]->block_color = $block_color;
		update_option("tw_codeblock_list", $codeblocks);
		$response = json_encode(array("saved" => true, "block_name" => $block_name, "block_code" => $block_code, "block_id" => $block_id, "block_color" => $block_color));
	} else {
		$response = json_encode(array("saved" => false));
	}
	header( "Content-Type: application/json" );
    echo $response;
	
	exit;
}

function tw_ajax_codeblock_remove() {
	$block_id = $_POST['block_id'];
	$codeblocks = get_option("tw_codeblock_list");
	$timeslots = get_option('tw_timeslot_list', array());
	$can_delete = false;
	foreach ($codeblocks as $key => $value) {
		if($key == $block_id) {
			$can_delete = true;
			break;
		}
		$prev_id = $key;
	}
	if($can_delete && sizeof($codeblocks) > 1)
	{
		unset($codeblocks[$block_id]);
		update_option("tw_codeblock_list", $codeblocks);
		foreach ($timeslots as $timeslot_id => $timeslot)
		{
			if($timeslot->codeblock_id == $block_id){
				unset($timeslots[$timeslot_id]);
			}
		}
		update_option("tw_timeslot_list", $timeslots);
		$response = json_encode(array("removed" => true, "block_id" => $block_id, "prev_id" => $prev_id));
	} else {
		$response = json_encode(array("removed" => false));
	}
	
	
	header( "Content-Type: application/json" );
    echo $response;
	exit;
	
}

function throw_time_exception()
{
	throw new InvalidArgumentException("\$inputTime must be in format hhmm where hh is the hours in 24 hour time, and mm are the minutes");
}

function parseTime($inputTime)
{
	if(strlen($inputTime) != 4)
	{
		throw_time_exception();
	}
	
	$iTime = str_split($inputTime, 2);
	if(!is_numeric($iTime[0]))
	{
		throw_time_exception();
	}
	$hours = intval($iTime[0]);
	if($hours > 23 || $hours < 0)
	{
		throw_time_exception();
	}
	if(!is_numeric($iTime[1]))
	{
		throw_time_exception();
	}
	$minutes = intval($iTime[1]);
	if($minutes > 59 || $minutes < 0)
	{
		throw_time_exception();
	}
	return $inputTime;
	
}

function throw_date_exception()
{
	throw new InvalidArgumentException("\$inputDate must be in format ddmmyyyy where dd is the day, mm the month and yyyy the year");
}
function parseDate($inputDate) {
	if(strlen($inputDate) != 8)
	{
		throw_date_exception();
	}
	$iDate = str_split($inputDate, 2);
	
	for($i = 0; $i < 4; $i++)
	{
		if(!is_numeric($iDate[$i]))
		{
			throw_date_exception();
		}
	}
	
	$day = $iDate[3];
	$month = $iDate[2];
	if($day < 1 || $month < 1 || $month > 12) {
		throw_date_exception();
	}
	if($day > 31)
		throw_date_exception();
	if(($month == 4 || $month == 6 || $month == 9 || $month == 11 ) && $day == 31)
		throw_date_exception();
		
	$year = $iDate[0].$iDate[1];
	if($month == 2)
	{
		if($day > 29)
			throw_date_exception();
		if($day == 29 && (date("L", strtotime("January 1, ".$year)) == 0) ) 
			throw_date_exception();
	}
	
	return $inputDate;
	
}

function addCalEvent($id, &$calEvents, $timeslot, $codeblock, $timestamp, $timeslot_id, $enabled) {
	array_push($calEvents, new calEvent($id, $timeslot->start_time, $timeslot->end_time, date("Ymd", $timestamp), $codeblock->block_name, $timeslot_id, $codeblock->block_color, $enabled));
}

function tw_ajax_date_list() {
	$timeslots = get_option("tw_timeslot_list", array());
	$codeblocks = get_option("tw_codeblock_list");
	$exceptions = get_option("tw_exception_list");
	$schedule_id = $_POST['schedule_id'];
	
	$interval_begin = $_POST['interval_begin'];
	$interval_end = $_POST['interval_end'];
	
	$ib_time = date_create_from_format("YmdHi", $interval_begin . "0000")->getTimestamp();
	$ie_time = date_create_from_format("YmdHi", $interval_end . "0000")->getTimestamp() +  86400;
	$id = 0;
	$events = array();
	foreach ($timeslots as $timeslot_id => $timeslot) {
		if($timeslot->schedule_id == $schedule_id) {
			$ts_time = strtotime($timeslot->start_date);
			$te_time = strtotime($timeslot->end_date) + 86400;
			$present = true;
			if($ts_time <= $ib_time){
				if($te_time >= $ib_time) {
					$start_time = $ib_time;
					if($te_time > $ie_time) {
						$end_time = $ie_time;
					} else {
						$end_time = $te_time;
					}
				} else {
					$present = false;
				}
			} else if($ts_time < $ie_time) {
				$start_time = $ts_time;
				if($te_time > $ie_time) {
					$end_time = $ie_time;
				} else {
					$end_time = $te_time;
				}
			} else {
				$present = false;
			}
		
		
			if($present) {
				for ($curtime = $start_time; $curtime < $end_time; $curtime+= 86400) {
					$curdate = date("Ymd", $curtime);
					$probe = 0;
					$enabled = !tw_ajax_exception_search($curdate, $exceptions[$timeslot_id], $probe);
					$curTimeInfo = getdate($curtime);
					switch ($curTimeInfo["wday"]) {
						case 0:
							if($timeslot->onSunday){
								addCalEvent($id, $events, $timeslot, $codeblocks[$timeslot->codeblock_id], $curtime, $timeslot_id, $enabled);
							}
							break;
						
						case 1:
							if($timeslot->onMonday){
								addCalEvent($id, $events, $timeslot, $codeblocks[$timeslot->codeblock_id], $curtime, $timeslot_id, $enabled);
							}
							break;
						case 2:
							if($timeslot->onTuesday){
								addCalEvent($id, $events, $timeslot, $codeblocks[$timeslot->codeblock_id], $curtime, $timeslot_id, $enabled);
							}
							break;
						case 3:
							if($timeslot->onWednesday){
								addCalEvent($id, $events, $timeslot, $codeblocks[$timeslot->codeblock_id], $curtime, $timeslot_id, $enabled);
							}
							break;
						case 4:
							if($timeslot->onThursday){
								addCalEvent($id, $events, $timeslot, $codeblocks[$timeslot->codeblock_id], $curtime, $timeslot_id, $enabled);
							}
							break;
						case 5:
							if($timeslot->onFriday){
								addCalEvent($id, $events, $timeslot, $codeblocks[$timeslot->codeblock_id], $curtime, $timeslot_id, $enabled);
							}
							break;
						case 6:
							if($timeslot->onSaturday){
								addCalEvent($id, $events, $timeslot, $codeblocks[$timeslot->codeblock_id], $curtime, $timeslot_id, $enabled);
							}
							break;
					}
				$id = $id + 1;
				}
			}
		}
		
		
	}
	$response = json_encode(array("success" => true, "events" => $events));
	header( "Content-Type: application/json" );
    echo $response;
    exit;
	
	
}

function tw_ajax_timeslot_add_update() {
	$timeslots = get_option("tw_timeslot_list", array());
	$codeblocks = get_option("tw_codeblock_list");
	$schedules= get_option("tw_schedule_list", array());
	$exceptions = get_option("tw_exception_list");
	$codeblock_id = intval($_POST['codeblock_id']);
	$schedule_id = intval($_POST['schedule_id']);
	
	
	$use_provided_id = false;
	if(isset($_POST['timeslot_id'])){
		$timeslot_id = intval($_POST['timeslot_id']);
		unset($timeslots[$timeslot_id]);
		$use_provided_id = true;
	}
	
	if (! isset($codeblocks[$codeblock_id]) || ! isset($schedules[$schedule_id]))
	{
		$response = json_encode( array("success" => false));
	}
	else {
		try {
	
			//Add in some checking to make sure start and end times and dates are in the correct order
		$start_time = parseTime($_POST['start_time']);
		$stop_time = parseTime($_POST['end_time']);
		$start_date = parseDate($_POST['start_date']);
		$stop_date = parseDate($_POST['end_date']);
		
		$onMonday = $_POST['on_monday'] == "true";
		$onTuesday = $_POST['on_tuesday'] == "true";
		$onWednesday = $_POST['on_wednesday'] == "true";
		$onThursday = $_POST['on_thursday'] == "true";
		$onFriday = $_POST['on_friday'] == "true";
		$onSaturday = $_POST['on_saturday'] == "true";
		$onSunday = $_POST['on_sunday'] == "true";
		
		$timeslot = new timeslot($codeblock_id, $schedule_id, $start_time, $stop_time, $start_date, $stop_date, $onMonday, $onTuesday, $onWednesday, $onThursday, $onFriday, $onSaturday, $onSunday);
		
		if(sizeof($timeslots) == 0)
	 	{
	 		if($use_provided_id) {
	 			$timeslots[$timeslot_id] = $timeslot;
	 			$exceptions[$timeslot_id] = array();
	 		} else {
	 			array_push($timeslots,  $timeslot);
	 			array_push($exceptions, array());
	 		}
	 		$slotid = 0;
	 		add_option("tw_timeslot_list", $timeslots);
	 		update_option("tw_timeslot_list", $timeslots);
	 		update_option("tw_exception_list", $exceptions);
	 	} else {
	 		if($use_provided_id) {
	 			$timeslots[$timeslot_id] = $timeslot;
	 			$exceptions[$timeslot_id] = array();
	 		} else {
	 			array_push($timeslots,  $timeslot);
	 			array_push($exceptions, array());
	 			
	 		}
	    	
		 	update_option("tw_timeslot_list", $timeslots);
		 	update_option("tw_exception_list", $exceptions);
	 	}
	
 	
	    $response = json_encode( array("success" => true));
	    
	 
	
	 
			
		} catch (InvalidArgumentException $e) {
			$response = json_encode( array("success" => false));
		}
	}
	
	header( "Content-Type: application/json" );
    echo $response;
    exit;
}

function tw_ajax_timeslot_get() {
	$timeslots = get_option("tw_timeslot_list", array());
	
	$timeslot_id = $_POST['timeslot_id'];
	
	if(isset($timeslots[$timeslot_id])) {
		$response = json_encode(array("success" => true, "timeslot" => $timeslots[$timeslot_id]));
	} else {
		$response = json_encode(array("success" => false));
	}
	
	header( "Content-Type: application/json" );
    echo $response;
    exit;
}

function tw_ajax_timeslot_remove() {
	$timeslots = get_option("tw_timeslot_list", array());
	$exceptions = get_option("tw_exception_list");
	$timeslot_id = $_POST['timeslot_id'];
	
	if(isset($timeslots[$timeslot_id])){
		unset($timeslots[$timeslot_id]);
		unset($exceptions[$timeslot_id]);
		update_option('tw_timeslot_list', $timeslots);
		update_option('tw_exception_list', $exceptions);
		$response = json_encode(array("success" => true));
	} else {
		$response = json_encode(array("success" => false));
	}
	header( "Content-Type: application/json" );
    echo $response;
    exit;
}
?>