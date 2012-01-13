<?php

/**
 * @package TimedBlock
 * @version 0.1
 */


function inTimeslot($timeslot, $current_time, $exceptions)
{
	
	//$timeslot_start = strtotime($timeslot->start_date);
	//$timeslot_end = strtotime($timeslot->end_date) + 86400;
	//$timeslot_start = date_create_from_format("YmdHi", $timeslot->start_date. "0000")->getTimestamp();
	//$timeslot_end = date_create_from_format("YmdHi", $timeslot->end_date. "0000")->getTimestamp() + 86400;
	
	list( $today_year, $today_month, $today_day, $hour, $minute, $second ) = preg_split( '#([^0-9])#', $current_time );
	
	
	//$curdate = date("Ymd", $timestamp);
	$curdate = $today_year.$today_month.$today_day;
	$probe = 0;
	if(tw_ajax_exception_search($curdate, $exceptions, $probe)){
		return false;
	}
	
	if(strcmp($timeslot->start_date, $curdate) <= 0 && strcmp($curdate, $timeslot->end_date) <= 0)
	{
		$curHour = $hour.$minute;

		if(strcmp($timeslot->start_time, $curHour) <= 0 && strcmp($curHour, $timeslot->end_time) <= 0)
		{
			$curTimeInfo = getdate( date_create_from_format("YmdHi",$curdate.$curHour)->getTimestamp());
			switch ($curTimeInfo["wday"]) {
				case 0:
					if($timeslot->onSunday){
						return true;
					}
					break;
				case 1:
					if($timeslot->onMonday){
						return true;
					}
					break;
				case 2:
					if($timeslot->onTuesday){
						return true;
					}
					break;
				case 3:
					if($timeslot->onWednesday){
						return true;
					}
					break;
				case 4:
					if($timeslot->onThursday){
						return true;
					}
					break;
				case 5:
					if($timeslot->onFriday){
						return true;
					}
					break;
				case 6:
					if($timeslot->onSaturday){
						return true;
					}
					break;
			}
		}
	}
	return false;
}


function outputCodeblocks($schedule) {
	//date_default_timezone_set ( 'UTC' );
	//echo ('<!--date_default_timezone_set: ' . date_default_timezone_get() . '-->');
	$timeslots = get_option("tw_timeslot_list");
	$codeblocks = get_option("tw_codeblock_list");
	$schedules = get_option("tw_schedule_list");
	$exceptions = get_option("tw_exception_list");
	$current_time = current_time("mysql");
	$at_least_one = false;
	$retval = "";
	foreach ($timeslots as $timeslot_id => $timeslot)
	{
		if($timeslot->schedule_id == $schedule && inTimeslot($timeslot, $current_time, $exceptions[$timeslot_id])){
			$retval.= $codeblocks[$timeslot->codeblock_id]->block_code;
			$at_least_one = true;
		}
	}
	if(!$at_least_one && isset($schedules[$schedule]) && $schedules[$schedule]->default_codeblock != null)
	{
		$retval =  $codeblocks[$schedules[$schedule]->default_codeblock]->block_code;
	}
	return $retval;
}


function tw_ajax_output_codeblocks() {
	$schedule = $_REQUEST['schedule'];
	$text = outputCodeblocks($schedule);
	$json_text = json_encode($text);
	echo("var text = $json_text;");
	?>
	
	
	var codeblock_element = document.getElementById("codeblock");
  while(codeblock_element.childNodes.length >= 1) {
    codeblock_element.removeChild(codeblock_element.firstChild);
  }
  codeblock_element.appendChild(codeblock_element.ownerDocument.createTextNode(text));
	
	
	<?php 
	
	exit();
}
/**
 * tw_Widget Class
 */
class tw_Widget extends WP_Widget {
	/** constructor */
	function __construct() {
		parent::WP_Widget( /* Base ID */'tw_widget', /* Name */'Timed Widget', array( 'description' => 'A widget for displaying timed content' ) );
	}

	/** @see WP_Widget::widget */
	function widget( $args, $instance ) {

		extract( $args );
		$title = apply_filters( 'widget_title', $instance['title'] );
		echo $before_widget;
		if ( $title )
			echo $before_title . $title . $after_title;
		$schedule = $instance['schedule'];
		echo(outputCodeblocks($schedule));
		echo $after_widget;
	}

	/** @see WP_Widget::update */
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		$instance['schedule'] = strip_tags($new_instance['schedule']);
		return $instance;
	}

	/** @see WP_Widget::form */
	function form( $instance ) {
		$schedules = get_option("tw_schedule_list");
		if ( $instance ) {
			$title = esc_attr( $instance[ 'title' ] );
			$selected_schedule = esc_attr($instance['schedule']);
		}
		else {
			$title = __( 'New title', 'text_domain' );


	
			reset($schedules);
			 	
			$selected_schedule = key($schedules);
		}
		?>
		<p>
		<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
		<label for="<?php echo $this->get_field_id('schedule'); ?>"><?php _e('Widget Schedule:'); ?></label> 
		<select class="widefat" id="<?php echo $this->get_field_id('schedule'); ?>" name="<?php echo $this->get_field_name('schedule'); ?>">
					<?php 
					foreach ($schedules as $schedule_id => $schedule)
					{
						if($selected_schedule == $schedule_id)
							echo "<option value='$schedule_id' selected='selected'>{$schedule->title}</option>";	
						else
							echo "<option value='$schedule_id'>{$schedule->title}</option>";
					}
				?>
		</select>
		</p>
		<?php 
	}

} // class tw_Widget
// register tw_Widget widget
add_action( 'widgets_init', create_function( '', 'register_widget("tw_Widget");' ) );

?>