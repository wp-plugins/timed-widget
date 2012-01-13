<?php

/**
 * @package TimedWidget
 * @version 0.1
 */
/*
Plugin Name: Timed Widget
Plugin URI: http://grwl.unbc.ca/
Description: Displays timed content
Author: Daniel Yule
Version: 0.1
*/

require_once 'tw-widget.php';
require_once  'tw-settings.php';

add_action('admin_menu', 'tw_settings_menu');


function tw_settings_menu (){
	$page = add_options_page("Timed Widget Settings", "Timed Widget", "manage_options", "tw_settings", "tw_settings_display");
	add_action("admin_print_styles-".$page, "tw_add_css_js");
	//delete_option("tw_codeblock_list");
}

function tw_initialize_plugin() {
	$codeblocks = get_option("tw_codeblock_list", null);
	
	if($codeblock == null)
	{
		$codeblocks[0] = new codeblock("Default Codeblock", "");
		add_option("tw_codeblock_list", $codeblocks);
	}
	
	$schedules = get_option("tw_schedule_list", null);
	
	if($schedules == null)
	{
		$schedules[0] = new widget_schedule("Default Schedule");
		add_option("tw_schedule_list", $schedules);
	}
	
	$exceptions = get_option("tw_exception_list", null);
	
	if($exceptions == null)
	{
		$exceptions = array();
		add_option("tw_exception_list", $exceptions);
	}
}

function tw_add_css_js() {
	wp_enqueue_style("jquery.smoothness.css", plugins_url(). '/timed-widget/css/smoothness/jquery-ui-1.8.11.custom.css', array(), false, "all");
	wp_enqueue_style("jquery.weekcalendar.css", plugins_url(). '/timed-widget/css/jquery.weekcalendar.css', array(), false, "all");
	wp_enqueue_style("jquery.contextMenu.css", plugins_url(). '/timed-widget/css/jquery.contextMenu.css', array(), false, "all");
	wp_enqueue_style("colorpicker.css", plugins_url(). '/timed-widget/css/colorpicker.css', array(), false, "all");
	wp_enqueue_style("timed-widget.css", plugins_url(). '/timed-widget/css/timed-widget.css', array(), false, "all");
	
	wp_enqueue_script("jquery.weekcalendar.js", plugins_url() . "/timed-widget/js/jquery.weekcalendar.js", array("jquery", "jquery-ui-core", "jquery-ui-widget", "jquery-ui-button", "jquery-ui-droppable", "jquery-ui-resizable"));
	wp_enqueue_script("jquery.contextMenu.js", plugins_url() . "/timed-widget/js/jquery.contextMenu.js", array("jquery", "jquery-ui-core", "jquery-ui-widget"));
	wp_enqueue_script("date.js", plugins_url() . "/timed-widget/libs/date.js", array());
	wp_enqueue_script("jquery-ui-datepicker", plugins_url() . "/timed-widget/libs/jquery.ui.datepicker.js", array("jquery", "jquery-ui-core", "jquery-ui-widget"));
	wp_enqueue_script("custom-colorpicker", plugins_url() . "/timed-widget/libs/colorpicker.js", array("jquery"));
	wp_enqueue_script("jquery-ui-accordion", plugins_url() . "/timed-widget/libs/jquery.ui.accordion.js", array("jquery", "jquery-ui-core", "jquery-ui-widget"));
	wp_enqueue_script("jquery.suggest.local", plugins_url() . "/timed-widget/js/jquery-suggest-local.js", array("jquery"));
	wp_enqueue_script("tw.settings.js", plugins_url() . "/timed-widget/js/settings.js", array("jquery.weekcalendar.js", "date.js", "jquery.suggest.local","jquery-ui-datepicker", "jquery-ui-dialog", "jquery-ui-accordion", "jquery-ui-tabs", "custom-colorpicker"));
	
// 	delete_option('tw_timeslot_list');
// 	add_option('tw_timeslot_list', array());
// 	delete_option(('tw_exception_list'));
// 	add_option('tw_exception_list', array());

	
	$codeblocks = get_option("tw_codeblock_list");
	
	reset($codeblocks);
	 	
	$first_block_id = key($codeblocks);
	
	$schedules = get_option("tw_schedule_list");
	
// 	$exceptions = get_option("tw_exception_list", array());
	
// 	$timeslots = get_option('tw_timeslot_list');
// 	foreach($timeslots as $timeslot_id => $timeslot) {
// 		if(!isset($exceptions[$timeslot_id]))
// 			$exceptions[$timeslot_id] = array();
// 	}
	
// 	update_option('tw_exception_list', $exceptions);
	
	reset($schedules);
	 	
	$first_schedule_id = key($schedules);
	
	$codeblock_json = json_encode($codeblocks);
	
	
	wp_localize_script( 'tw.settings.js', 'tw_ajax', array(  'codeblocks' => $codeblock_json, 'current_block' => $first_block_id, 'current_schedule' => $first_schedule_id ) );
}

register_activation_hook(__FILE__, 'tw_initialize_plugin');

add_action( 'wp_ajax_tw-ajax-schedule-add', 'tw_ajax_schedule_add' );
add_action('wp_ajax_tw-ajax-schedule-update', 'tw_ajax_schedule_update');
add_action('wp_ajax_tw-ajax-schedule-remove', 'tw_ajax_schedule_remove' );
add_action( 'wp_ajax_tw-ajax-codeblock-add', 'tw_ajax_codeblock_add' );
add_action( 'wp_ajax_tw-ajax-codeblock-save', 'tw_ajax_codeblock_save' );
add_action( 'wp_ajax_tw-ajax-codeblock-remove', 'tw_ajax_codeblock_remove' );
add_action( 'wp_ajax_tw-ajax-timeslot-add-update', 'tw_ajax_timeslot_add_update');
add_action( 'wp_ajax_tw-ajax-timeslot-remove', 'tw_ajax_timeslot_remove');
add_action( 'wp_ajax_tw-ajax-get-timeslot', 'tw_ajax_timeslot_get');
add_action( 'wp_ajax_tw-ajax-list-events', 'tw_ajax_date_list');
add_action( 'wp_ajax_tw-ajax-exception-add', 'tw_ajax_exception_add');
add_action( 'wp_ajax_tw-ajax-exception-remove', 'tw_ajax_exception_remove');
add_action( 'wp_ajax_nopriv_tw-ajax-output-codeblocks', 'tw_ajax_output_codeblocks');
?>