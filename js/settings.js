var codeblocks = [];
var current_block_id;
var current_schedule_id;

/**
 * Reads in a hex representation of an rgb color and returns an object
 * representing that color in r g b.
 * 
 * @param hex
 *            A hex string, either starting with a '#' or containing solely 6
 *            hex characters
 * @returns An object with three attributes: r g and b, each representing the
 *          red green and blue values of the file respectively
 */
function HexToRGB(hex) {
    var hexInt = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex),
        16);
    return {
        r : hexInt >> 16,
        g : (hexInt & 0x00FF00) >> 8,
        b : (hexInt & 0x0000FF)
    };
}

/**
 * Attempts to parse a text string as a time of day. This function trys a
 * variety of formats one a time until a match is found. The purpose is to pop
 * up suggestions while the user is typing an hour.
 * 
 * @param txt
 *            A string, hopefully containing an textual representation of an
 *            hour
 * @returns A time representing the hour in txt or null if txt was not in a
 *          parsable format.
 */
function tryToParse(txt) {

    // The listing of all possible formats that can reasonably be parsed, listed
    // in order from shortest to longest string.
    var formatArray = [ "H",
        "HH",
        "HHm",
        "HHmm",
        "H:",
        "HH:",
        "H:m",
        "HH:m",
        "H:mm",
        "HH:mm",
        "H:mt",
        "HH:mt",
        "H:mmt",
        "HH:mmt",
        "H:mtt",
        "HH:mtt",
        "H:mmtt",
        "HH:mmtt" ];

    // An index to be used for iterating through the format array
    var formatIdx = null;

    // Get rid of any spaces
    var hourText = txt.replace(/\s/g, "");

    // Iterate through every format, and attempt to parse using that format.
    for (formatIdx in formatArray) {
        var cTime = Date.parseExact(hourText, formatArray[formatIdx]);
        if (cTime) {
            return cTime;
        }
    }

    // If not a single format matches, then return null
    return null;
}

/**
 * Fills in a &lt;select&gt; html element with &lt;option&gt;s corresponding to
 * codeblock names and values corresponding to their ids. This function will
 * erase any exsting &lt;option&gt;s within the select element.
 * 
 * @param element
 *            A jQuery &lt;select&gt; element.
 */
function populateWithCodeblocks(element) {
    // Clear the select of any pre-existing options.
    element.html("");

    // Iterate over the codeblocks and add one for each codeblock.
    jQuery.each(codeblocks, function(key, value) {
        if (value) {
            element.append(jQuery('<option>', {
                value : key
            }).text(value.block_name));
        }
    });
}

/**
 * Generates a list of suggestions for times, based on the currently enterer
 * text. This is for use with the autocomplete jQuery plugin.
 * 
 * @param txt
 *            A text string formatted as a time (either 12 or 24 hour)
 * @returns A list of suggestions, if the text is formatted as a time, and an
 *          empty string otherwise.
 * @see tryToParse
 */
function generateTimeSuggestions(txt) {

    // Parse the text representing the current time
    var cTime = tryToParse(txt);

    // A variable that will be used to hold the time as we iterate over the
    // times to generate
    var tTime;

    // An array to hold all of the suggested times.
    var times = [];

    // The minutes before and after the current time that we will iterate
    // through.
    var minuteOffset = -720;

    // If the time was able to be parsed, generate a list
    if (cTime) {

        // Start at 12 hours prior to the suggested time.
        tTime = cTime.addMinutes(-720);

        // Iterate over every half hour until 12 hours after the current time.
        // The minuteOffset variable is used only for iteration, not for
        // determining the actual time.
        for (minuteOffset = -720; minuteOffset <= 720; minuteOffset += 30) {

            // Add the time to the list as a string
            times.push(tTime.toString("h:mm tt"));

            // Since we can't easily iterate using a date object, we add minutes
            // separately from the minuteOffset variable
            tTime.addMinutes(30);
        }

        // The autocomplete widget requires a single string with each entry
        // separated by a newline
        return times.join("\n");
    }
    // If the time was not able to be parsed, return nothing.
    return "";
}

/**
 * Either enable or disable the codeblock editing buttons so that multiple
 * requests can't be sent at the same time, potentially confusing the system.
 * 
 * @param enabled
 *            True to enable the buttons, false to disable them.
 */
function changeCodeblockButtons(enabled) {
    if (enabled) {
        jQuery("#codeblock_add").button("enable");
        jQuery("#codeblock_save").button("enable");
        jQuery("#codeblock_remove").button("enable");
        jQuery("#codeblock_reset").button("enable");
    } else {
        jQuery("#codeblock_add").button("disable");
        jQuery("#codeblock_save").button("disable");
        jQuery("#codeblock_remove").button("disable");
        jQuery("#codeblock_reset").button("disable");
    }
}

/**
 * Either enable or disable the schedule editing buttons so that multiple
 * requests can't be made at the same time.
 * 
 * @param enabled
 *            True to enable the buttons, false to disable them.
 */
function changeScheduleButtons(enabled) {
    if (enabled) {
        jQuery('#schedule_edit').button('enable');
        jQuery('#schedule_remove').button('enable');
        jQuery('#schedule_add').button('enable');
        jQuery('#schedule_embed').button('enable');
    } else {
        jQuery('#schedule_edit').button('disable');
        jQuery('#schedule_remove').button('disable');
        jQuery('#schedule_add').button('disable');
        jQuery('#schedule_embed').button('disable');
    }
}

/**
 * Adds a codeblock to the server, the local codeblock array and the list of
 * tabs. This function disables the add button until a response comes back from
 * the server. The server provides defaults for all codeblock values. This
 * function also triggers updateCodeblockForm() so the form fields get filled in
 * as well.
 */
function addCodeblock() {

    // Disable the codeblock buttons so that multiple codeblocks can't be
    // added/saved/removed at once.
    changeCodeblockButtons(false);
    jQuery("#codeblock_add").button("option", "label", "Adding...");

    // Request that the server adds a new codeblock.
    jQuery.post(ajaxurl, {

        action : 'tw-ajax-codeblock-add'

    }, function(response) {
        // Re enable the codeblock buttons now that we've gotten a response from
        // the server.
        changeCodeblockButtons(true);
        jQuery("#codeblock_add")
            .button("option", "label", "Add New Code Block");

        // Only update the UI if the addition of the tab was successful.
        if (response.success) {

            // Create a new codeblock object and populate it with data from the
            // server.
            codeblocks[response.block_id] = {
                block_name : response.block_name,
                block_code : response.block_code,
                block_color : response.block_color
            };

            // Add a new tab to the UI.
            var $codeblock_tabs = jQuery('#codeblock_tabs');
            $codeblock_tabs.tabs("add", "#codeblock_tab_" + response.block_id,
                response.block_name);

            // Select the newly created tab, thus triggering a form update.
            $codeblock_tabs.tabs("select", "#codeblock_tab_"
                + response.block_id);
        }

    });
}

/**
 * Fills in the codeblock editing form with data pulled from the codeblock
 * array. This function should only be called after the codeblock array has been
 * filled in with a response from the server. This function is called at
 * initialization and also each time a new codeblock tab is selected. This
 * function removes the form from the tab panel it previously was attached to
 * (the previously selected tab) and attaches it to the currently selected tab.
 * This is so there isn't a different form for every tab.
 */
function updateCodeblockForm() {
    // Will hold the currently selected codeblock object
    var current_block;
    // Check to make sure that the current_block_id hasn't been set to an
    // illegal value.
    if (codeblocks[current_block_id] !== undefined) {
        // Pull the codeblock panel off of the tab it is currently on
        var $panel = jQuery('#codeblock_panel').detach();
        // Put the codeblock panel back onto the currently selected tab
        jQuery('#codeblock_tab_' + current_block_id).append($panel);

        // Update the form elements with the contents of the current codeblock
        // object.
        current_block = codeblocks[current_block_id];
        jQuery('#codeblock_name').val(current_block.block_name);
        jQuery('#codeblock_code').val(current_block.block_code);
        jQuery('#codeblock_color').val(current_block.block_color);
        jQuery('#colorpicker').css('background-color',
            "#" + current_block.block_color);
        jQuery('#colorpicker').ColorPickerSetColor(
            "#" + current_block.block_color);
    }
}

/**
 * Saves the information currently entered into the codeblock form, both to the
 * server, and once the request returns, to the codeblocks array.
 */
function saveCodeblockForm() {

    // Disable the codeblock buttons so they can't be hit multiple times.
    changeCodeblockButtons(false);
    jQuery('#codeblock_save').button('option', 'label', 'Saving...');
    // Save the information stored in the form.
    jQuery.post(ajaxurl, {
        action : 'tw-ajax-codeblock-save',
        block_id : current_block_id,
        block_name : jQuery('#codeblock_name').val(),
        block_code : jQuery('#codeblock_code').val(),
        block_color : jQuery('#codeblock_color').val()
    }, function(response) {

        // Re-enable the codeblock buttons upon response
        changeCodeblockButtons(true);
        jQuery('#codeblock_save').button('option', 'label', 'Save');

        // If there was a problem with saving the codeblock, don't bother
        // to update the local copy.
        if (response.saved) {
            // Set the name of the tab to match the name of the codeblock
            // (although this also happens automatically when typing).
            jQuery(
                '#codeblock_tabs>ul>li>a[href=#codeblock_tab_'
                    + response.block_id + ']').text(response.block_name);
            // Set the information from the response as the saved codeblock
            // information.
            codeblocks[response.block_id].block_name = response.block_name;
            codeblocks[response.block_id].block_code = response.block_code;
            codeblocks[response.block_id].block_color = response.block_color;

            // Refresh the data in the calendar, as the names and colors might
            // have changed.
            jQuery('#calendar').weekCalendar('refresh');
        }
    });
}

/**
 * Removes a codeblock both from the server, and after the request comes back,
 * from the codeblock array. This will also remove any timeslots that are linked
 * to this codeblock.
 */
function removeCodeblock() {

    // Disable the codeblock buttons so they can't be hit multiple times.
    changeCodeblockButtons(false);
    jQuery('#codeblock_remove').button('option', 'label', 'Removing...');

    // Request the server removes the codeblock. This will also remove any
    // timeslots that use this codeblock.
    jQuery.post(ajaxurl, {
        action : 'tw-ajax-codeblock-remove',
        block_id : current_block_id
    }, function(response) {

        // Re-enable the codeblock buttons upon response
        changeCodeblockButtons(true);
        jQuery('#codeblock_remove').button('option', 'label', 'Remove');

        // Only update the array if the request was successful.
        if (response.removed) {
            // Remove the entry from the codeblock array
            delete codeblocks[response.block_id];

            // Select the tab that comes before this one in the sequence (this
            // will cause the form to be updated with information from a new
            // codeblock)
            jQuery('#codeblock_tabs').tabs("select",
                "#codeblock_tab_" + response.prev_id);

            // Remove the current tab as well.
            jQuery('#codeblock_tabs').tabs("remove",
                "#codeblock_tab_" + response.block_id);

            current_block_id = response.prev_id;

            // Refresh the calendar, in case any timeslots have
            // been removed.
            jQuery('#calendar').weekCalendar('refresh');
        }
    });
}

/**
 * Removes a schedule from the server, and gets rid of the tab that houses that
 * schedule from the ui. If there is only one schedule, this removes that
 * schedule and replaces it with a default schedule.
 */
function removeSchedule() {
    // Disable the scheduling buttons while talking to the server.
    changeScheduleButtons(false);

    // Request the server removes the current schedule.
    jQuery.post(ajaxurl, {
        action : 'tw-ajax-schedule-remove',
        schedule_id : current_schedule_id
    }, function(response) {
        // Re-enable the scheduling buttons.
        changeScheduleButtons(true);
        // Only update the UI if the removal was successful
        if (response.removed) {
            // If the schedule was removed and not replaced with the a default,
            // then
            // remove the schedule's tab from the UI.
            if (!response.replaced) {
                // Select a new tab that isn't the one we're removing.
                jQuery('#schedule_tabs').tabs("select",
                    "#schedule_tab_" + response.prev_id);

                // Remove the tab in questions
                jQuery('#schedule_tabs').tabs("remove",
                    "#schedule_tab_" + response.schedule_id);
                current_schedule_id = response.prev_id;
            } else {
                jQuery(
                    // Change the name of the current tab to the default.
                    '#schedule_tabs>ul>li>a[href=#schedule_tab_'
                        + response.schedule_id + ']').text("Default Schedule");
                current_schedule_id = response.schedule_id;
                // Update the calendar's data with the now empty schedule.
                jQuery('#calendar').weekCalendar('refresh');

            }

        }
    });
}

/**
 * Adds a new timeslot to the current schedule. This function displays the
 * dialog and also handles the response from the server after the request comes
 * back. This function is called when a user creates a new event on the
 * calendar.
 * 
 * @param event
 *            The calEvent from the calendar
 */
function addNewTimeslot(event) {

    // Remove the dialogclose binding, or it will fire once for every
    // time the dialog has been created, causing multiple refreshes
    // every time the dialog is closed.
    jQuery('#timeslot_dialog').unbind('dialogclose');

    // Refresh the calendar on dialog close. The dialog is closed after saving,
    // canceling or deleting, and the calendar should be updated in all three of
    // those cases.
    jQuery('#timeslot_dialog').bind('dialogclose', function(closeEvent) {
        jQuery('#calendar').weekCalendar('refresh');
    });

    // Fill in the codeblock select element with the current codeblocks
    populateWithCodeblocks(jQuery('#timeslot_codeblock'));

    // Populate the form with the time and date from the event
    jQuery('#timeslot_start_time').val(event.start.toString("hh:mm tt"));
    jQuery('#timeslot_end_time').val(event.end.toString("hh:mm tt"));

    jQuery('#timeslot_start_date').val(event.start.toString("dd/MM/yyyy"));
    jQuery('#timeslot_end_date').val(event.end.toString("dd/MM/yyyy"));

    // Enable the day on which this event was created, and no others.
    jQuery('.timeslot_day').prop('checked', false);

    switch (event.start.getDay()) {
    case 1:
        jQuery('#timeslot_on_monday').prop('checked', true);
        break;
    case 2:
        jQuery('#timeslot_on_tuesday').prop('checked', true);
        break;
    case 3:
        jQuery('#timeslot_on_wednesday').prop('checked', true);
        break;
    case 4:
        jQuery('#timeslot_on_thursday').prop('checked', true);
        break;
    case 5:
        jQuery('#timeslot_on_friday').prop('checked', true);
        break;
    case 6:
        jQuery('#timeslot_on_saturday').prop('checked', true);
        break;
    case 0:
        jQuery('#timeslot_on_sunday').prop('checked', true);
        break;
    }

    // Display the timeslot add dialog. This dialog has three buttons: Save,
    // Delete and Cancel. Save sends a request to the server to add a new
    // timeslot, Delete and Cancel are synonyms that do nothing. After all three
    // complete, the dialog is closed, which sends a request to the server for a
    // refresh. In the case of save, that means that the new timeslot is
    // displayed on the calendar. For the other two, it means the placeholds
    // event created by dragging will disappear.
    jQuery('#timeslot_dialog')
        .dialog(
            'option',
            'buttons',
            {
                "Save" : function() {

                    // Read in the date information from the timeslot
                    // form. The hours can be in various formats and
                    // still be read, but the dates must be in day month
                    // year form, separated by slashes. This shouldn't
                    // be a problem, as the pop up calendar does this
                    // automatically.
                    var startTime = tryToParse(jQuery('#timeslot_start_time')
                        .val());
                    var endTime = tryToParse(jQuery('#timeslot_end_time').val());
                    var startDate = Date.parseExact(jQuery(
                        '#timeslot_start_date').val(), "dd/MM/yyyy");
                    var endDate = Date.parseExact(jQuery('#timeslot_end_date')
                        .val(), "dd/MM/yyyy");

                    // Send a request to the server to create the
                    // timeslot, along with the parsed date information
                    // in the interchange format.
                    jQuery.post(ajaxurl, {
                        action : "tw-ajax-timeslot-add-update",
                        codeblock_id : jQuery('#timeslot_codeblock').val(),
                        schedule_id : current_schedule_id,
                        start_time : startTime.toString("HHmm"),
                        end_time : endTime.toString("HHmm"),
                        start_date : startDate.toString("yyyyMMdd"),
                        end_date : endDate.toString("yyyyMMdd"),
                        on_monday : jQuery('#timeslot_on_monday:checked').prop(
                            'checked'),
                        on_tuesday : jQuery('#timeslot_on_tuesday:checked')
                            .prop('checked'),
                        on_wednesday : jQuery('#timeslot_on_wednesday:checked')
                            .prop('checked'),
                        on_thursday : jQuery('#timeslot_on_thursday:checked')
                            .prop('checked'),
                        on_friday : jQuery('#timeslot_on_friday:checked').prop(
                            'checked'),
                        on_saturday : jQuery('#timeslot_on_saturday:checked')
                            .prop('checked'),
                        on_sunday : jQuery('#timeslot_on_sunday:checked').prop(
                            'checked')
                    }, function() {
                        // When the request comes back, close the
                        // dialog. This will trigger an update of the
                        // calendar data, which should reflect the new
                        // timeslot being added.
                        jQuery('#timeslot_dialog').dialog('close');
                    });
                },
                "Delete" : function() {
                    // Close the dialog without saving any changes. This
                    // will trigger a refresh of calendar data, and so
                    // the placeholder event should disappear.
                    jQuery('#timeslot_dialog').dialog('close');
                },
                "Cancel" : function() {
                    // Close the dialog without saving any changes. This
                    // will trigger a refresh of calendar data, and so
                    // the placeholder event should disappear.
                    jQuery('#timeslot_dialog').dialog('close');
                }
            });
    // Display the dialog.
    jQuery('#timeslot_dialog').dialog('open');
}

/**
 * Called to allow the user to edit a timeslot. This function gets the
 * timeslot's information from the server and populates the timeslot form with
 * that information.
 * 
 * @param calEvent
 *            An event that is part of the timeslot we are updating. Any event
 *            associated with a timeslot can be passed.
 */
function updateTimeslot(calEvent) {

    // Get the information about the event's timeslot from the server.
    jQuery.post(ajaxurl, {
        action : "tw-ajax-get-timeslot",
        timeslot_id : calEvent.timeslot_id
    }, function(response) {
        // If the server was able to retrieve the timeslot's information, then
        // populate the timeslot dialog with information and display it.
        if (response.success) {
            // Fill in the codeblock select element with the current codeblocks
            populateWithCodeblocks(jQuery('#timeslot_codeblock'));

            // Populate the form with dates and times from the server's
            // response. All dates and times are in the interchange format.
            jQuery('#timeslot_codeblock').val(response.timeslot.codeblock_id);

            jQuery('#timeslot_start_time').val(
                Date.parseExact(response.timeslot.start_time, "HHmm").toString(
                    "hh:mm tt"));
            jQuery('#timeslot_end_time').val(
                Date.parseExact(response.timeslot.end_time, "HHmm").toString(
                    "hh:mm tt"));

            jQuery('#timeslot_start_date').val(
                Date.parseExact(response.timeslot.start_date, "yyyyMMdd")
                    .toString("dd/MM/yyyy"));
            jQuery('#timeslot_end_date').val(
                Date.parseExact(response.timeslot.end_date, "yyyyMMdd")
                    .toString("dd/MM/yyyy"));

            // Read in which days the timeslot is enabled on.
            jQuery('#timeslot_on_monday').prop('checked',
                response.timeslot.onMonday);
            jQuery('#timeslot_on_tuesday').prop('checked',
                response.timeslot.onTuesday);
            jQuery('#timeslot_on_wednesday').prop('checked',
                response.timeslot.onWednesday);
            jQuery('#timeslot_on_thursday').prop('checked',
                response.timeslot.onThursday);
            jQuery('#timeslot_on_friday').prop('checked',
                response.timeslot.onFriday);
            jQuery('#timeslot_on_saturday').prop('checked',
                response.timeslot.onSaturday);
            jQuery('#timeslot_on_sunday').prop('checked',
                response.timeslot.onSunday);

            // Remove the dialogclose binding, or it will fire once for every
            // time the dialog has been created, causing multiple refreshes
            // every time the dialog is closed.
            jQuery('#timeslot_dialog').unbind('dialogclose');

            // Refresh the calendar on dialog close. The dialog is closed after
            // saving, canceling or deleting, and the calendar should be updated
            // unless there is a cancel, in which case the refresh is disabled.
            jQuery('#timeslot_dialog').bind('dialogclose',
                function(closeEvent) {
                    jQuery('#calendar').weekCalendar('refresh');
                });

            // Display the timeslot edit dialog. This dialog has three buttons:
            // Save, Delete and Cancel. Save sends a request to the server to
            // update the timeslot information. Delete sends a request to the
            // server to update the current timeslot's information. Cancel
            // simply closes the dialog with no changes made.
            jQuery('#timeslot_dialog').dialog(
                'option',
                'buttons',
                {
                    "Save" : function() {

                        // Read in the date information from the timeslot
                        // form. The hours can be in various formats and
                        // still be read, but the dates must be in day month
                        // year form, separated by slashes. This shouldn't
                        // be a problem, as the pop up calendar does this
                        // automatically.
                        var startTime = tryToParse(jQuery(
                            '#timeslot_start_time').val());
                        var endTime = tryToParse(jQuery('#timeslot_end_time')
                            .val());
                        var startDate = Date.parseExact(jQuery(
                            '#timeslot_start_date').val(), "dd/MM/yyyy");
                        var endDate = Date.parseExact(jQuery(
                            '#timeslot_end_date').val(), "dd/MM/yyyy");
                        // Send a request to the server to update the
                        // timeslot, along with the parsed date information
                        // in the interchange format.
                        jQuery.post(ajaxurl, {
                            action : "tw-ajax-timeslot-add-update",
                            timeslot_id : calEvent.timeslot_id,
                            schedule_id : current_schedule_id,
                            codeblock_id : jQuery('#timeslot_codeblock').val(),
                            start_time : startTime.toString("HHmm"),
                            end_time : endTime.toString("HHmm"),
                            start_date : startDate.toString("yyyyMMdd"),
                            end_date : endDate.toString("yyyyMMdd"),
                            on_monday : jQuery('#timeslot_on_monday:checked')
                                .prop('checked'),
                            on_tuesday : jQuery('#timeslot_on_tuesday:checked')
                                .prop('checked'),
                            on_wednesday : jQuery(
                                '#timeslot_on_wednesday:checked').prop(
                                'checked'),
                            on_thursday : jQuery(
                                '#timeslot_on_thursday:checked')
                                .prop('checked'),
                            on_friday : jQuery('#timeslot_on_friday:checked')
                                .prop('checked'),
                            on_saturday : jQuery(
                                '#timeslot_on_saturday:checked')
                                .prop('checked'),
                            on_sunday : jQuery('#timeslot_on_sunday:checked')
                                .prop('checked')
                        }, function() {
                            // When the request comes back, close the
                            // dialog. This will trigger an update of the
                            // calendar data, which should reflect the edits
                            // done to the timeslot.
                            jQuery('#timeslot_dialog').dialog('close');
                        });
                    },
                    "Delete" : function() {
                        // If the delete button is pressed, then we request
                        // the server removes the current timeslot
                        jQuery.post(ajaxurl, {
                            action : "tw-ajax-timeslot-remove",
                            timeslot_id : calEvent.timeslot_id
                        }, function() {
                            // Close the dialog, triggering a refresh of the
                            // calendar, which will remove the deleted
                            // timeslot from view.
                            jQuery('#timeslot_dialog').dialog('close');
                        });
                    },
                    "Cancel" : function() {
                        // Disable the refresh that happens when the dialog
                        // is closed.
                        jQuery('#timeslot_dialog').unbind('dialogclose');

                        // Close the timeslot editing dialog
                        jQuery('#timeslot_dialog').dialog('close');
                    }
                });

            // Open the dialog.
            jQuery('#timeslot_dialog').dialog('open');
        }

    });
}

/**
 * This function requests calendar data from the server. When the data is
 * returned, this function passes hte returned data off to the calendar widget
 * for display. This function is implicitly called each time the calendar is
 * refreshed.
 * 
 * @param start
 *            The date that marks the beginnging of the data that the calendar
 *            widget is requesting
 * @param end
 *            The date that marks the end of the data that the calendar widget
 *            is requesting.
 * @param callback
 *            A function to call when the data has been recieved from the
 *            server. This function is provided by the calendar widget.
 */
function getCalendarData(start, end, callback) {

    // Parse the start and end date as strings in the interchange format.
    var interval_begin = start.toString("yyyyMMdd");
    var interval_end = end.toString("yyyyMMdd");

    // Request all calendar events between the start and end dates.
    jQuery.post(ajaxurl, {
        "interval_begin" : interval_begin,
        "interval_end" : interval_end,
        "schedule_id" : current_schedule_id,
        "action" : "tw-ajax-list-events"
    }, function(response) {
        // Will hold an array of events in the format that the calendar expects.
        var calEvents = Array();

        // Used for the creation of each individual event before adding to the
        // array
        var calEvent;

        // Used to hold each event information retrieved from the server
        var serverEvent;

        // An index for iterating through all of the server events
        var serverEventIdx = 0;

        // Don't bother to update the calendar if the request was un successful.
        if (response.success) {
            // Loop through all of the serverEvents in the response.
            for (serverEventIdx in response.events) {
                // Cache the current event
                serverEvent = response.events[serverEventIdx];

                // Create a new calEvent. The structure of this object is
                // determined by the calendar widget, with some extra fields
                // added for this application
                calEvent = {
                    // Add the required fields to the calendar event in the
                    // format it would like
                    id : serverEvent.id,
                    title : serverEvent.title,
                    start : Date.parseExact(serverEvent.date
                        + serverEvent.starttime, "yyyyMMddHHmm"),
                    end : Date.parseExact(serverEvent.date
                        + serverEvent.endtime, "yyyyMMddHHmm"),
                    // Add the application specific fields to the calendar
                    // event.
                    timeslot_id : serverEvent.timeslot_id,
                    color : serverEvent.color,
                    enabled : serverEvent.enabled
                };

                // Add the event to the list of events to be rendered
                calEvents.push(calEvent);
            }

            // Inform the calendar that the events are ready to be registered.
            callback(calEvents);

            // Add right click context menu functionality to all of the events.
            // Those events that are enabled (don't have an exception associated
            // with them) have the option to be disabled or edit the timeslot
            // they are associated with. Those that are disabled have the
            // ability to be enabled or edit the timeslot. The type of event in
            // question is determined based on the css class assigned to it.
            // This is therefore dependent on the correct css class being
            // assigned to disabled events, which happens at the time they are
            // rendered.
            jQuery('.event_enabled').contextMenu({
                menu : 'event_enabled_menu'

            }, function(action, el, pos) {
                // Pull up the event from the target of the click. The target is
                // an HTML element, and we need to wrap it in jQuery to get its
                // information out.
                var $target = jQuery(el);
                var cEvent = $target.data('calEvent');
                // Read the day we are creating an exception for from the event
                // that we clicked on.
                var day = cEvent.start.toString('yyyyMMdd');
                switch (action) {
                case 'disable':
                    // Request we add an exception for today on this timeslot.
                    // This will disable the event.
                    jQuery.post(ajaxurl, {
                        "action" : "tw-ajax-exception-add",
                        "timeslot_id" : cEvent.timeslot_id,
                        "day" : day
                    }, function(exceptionResponse) {
                        // After the event has been disabled, refresh the
                        // calendar to update the css of the disabled event
                        if (exceptionResponse.success) {
                            jQuery('#calendar').weekCalendar('refresh');
                        }
                    });
                    break;
                case 'edit':
                    // This is the exact same as if we had left clicked on this
                    // event
                    updateTimeslot(cEvent);
                    break;

                }
            });
            // Display the enabling menu if the event is disabled.
            jQuery('.event_disabled').contextMenu({
                menu : 'event_disabled_menu'

            }, function(action, el, pos) {
                // Pull up the event from the target of the click. The target is
                // an HTML element, and we need to wrap it in jQuery to get its
                // information out.
                var $target = jQuery(el);
                var cEvent = $target.data('calEvent');
                // Read the day we are removing the excpetion for from the event
                // that we clicked on.
                var day = cEvent.start.toString('yyyyMMdd');
                switch (action) {
                case 'enable':
                    // Request that we remove the exception for this day and
                    // this timeslot. This will enable the event.
                    jQuery.post(ajaxurl, {
                        "action" : "tw-ajax-exception-remove",
                        "timeslot_id" : cEvent.timeslot_id,
                        "day" : day
                    }, function(exceptionResponse) {
                        if (exceptionResponse.success) {
                            // After the event has been enabled, refresh the
                            // calendar to update the css of the enabled event.
                            jQuery('#calendar').weekCalendar('refresh');
                        }
                    });
                    break;
                case 'edit':
                    // This is the exact same as if we had left clicked on this
                    // event
                    updateTimeslot(cEvent);
                    break;

                }
            });
        }
    });
}

/**
 * Adds styling information to divs representing events on the calendar. This
 * both provides the correct look and allows the correct context menu to be
 * attached to events based on whether or not they are enabled.
 * 
 * @param calEvent
 *            The event that this div represents
 * @param $element
 *            The jQuery element that represents the event.
 */
function renderEvent(calEvent, $element) {

    // If the event is enabled, do all of the theming
    if (calEvent.enabled) {
        // Add the enabled class to the event
        $element.addClass('event_enabled');

        // If a color has been specified for the codeblock associated with this
        // event, color the event with it.
        if (calEvent.color !== undefined) {
            var rgb = HexToRGB(calEvent.color);
            var v = (rgb.r + rgb.g + rgb.b) / 3;
            // If the background color is dark, make the text white; if it is
            // light, make the text black.
            if (v > 128) {
                $element.css("color", "#000000");
            } else {
                $element.css("color", "#FFFFFF");
            }
            $element.css("backgroundColor", "#" + calEvent.color);
        }
    } else {
        // Add the disabled theme to this event.
        $element.addClass('event_disabled');
    }

}

/**
 * Initializes the timed widget settings page. This function sets up all the
 * jQuery UI widgets on the page, configures some of the dialogs and connects
 * the application's logic together. This function should be called from the
 * jQuery ready function.
 * 
 * @param $
 *            Set to be the jQuery object.
 */
function initialize($) {

    // Set up some jQuery elements to be accessed later.
    var $codeblock_tabs = $('#codeblock_tabs');
    var codeblocks_obj;
    var $schedule_tabs = $('#schedule_tabs');

    // Read the current block id out of the localized variable embedded by
    // WordPress
    current_block_id = tw_ajax.current_block;

    // Read the current schedule id out of the localized variable embedded by
    // WordPress
    current_schedule_id = tw_ajax.current_schedule;

    // Because the JSON library jQuery uses returns arrays as 'array-like
    // objects' we want to transform the localized variable for codeblocks into
    // an actual array for proper, safe iteration. Otherwise we'll also get any
    // properties that are set.
    codeblocks_obj = $.parseJSON(tw_ajax.codeblocks);
    $.each(codeblocks_obj, function(key, value) {
        codeblocks[key] = value;
    });

    // Set up the codeblock tabs. These tabs are generated correctly in the php
    // file, so we simply wrap a jQuery tab interface around them.
    $codeblock_tabs.tabs({
        // When a new tab is selected, save the current form, then update the
        // form with the newly selected codeblock
        select : function(event, ui) {
            saveCodeblockForm();

            // This parses the current block id out of the tab's name, which is
            // 'codeblock_tab_##' where ## is the id. This line removes the
            // prefix, and parses the resulting string.
            current_block_id = parseInt(ui.panel.id.substring(14), 10);
            updateCodeblockForm();
        }
    });

    // Select the current codeblock. This will probably be the one that is
    // selected by default, but it never hurts to make sure.
    $codeblock_tabs.tabs("select", current_block_id);

    // Update the codeblock form with whatever the current information is.
    updateCodeblockForm();

    // Create the tabs for the different schedules. Since these tabs are
    // generated by php, there is no need to do anything but wrap them in the
    // jQuery UI tabs widget.
    $schedule_tabs.tabs({

        // When a new tab is selected, the schedule related buttons should move
        // to the new tab and the calendar should be refreshed with the new
        // schedule's timeslots
        select : function(event, ui) {
            // This parses the current schedule id out of the tab's name, which
            // is
            // 'schedule_tab_##' where ## is the id. This line removes the
            // prefix, and parses the resulting string.
            current_schedule_id = parseInt(ui.panel.id.substring(13), 10);

            var $panel = jQuery('#schedule_panel').detach();
            jQuery('#schedule_tab_' + current_schedule_id).append($panel);

            jQuery('#calendar').weekCalendar('refresh');

        },
        // Begin by selecting whatever the current schedule id is.
        selected : current_schedule_id
    });

    // Attach the schedule button panel to the currently displayed tab.
    jQuery('#schedule_tab_' + current_schedule_id).append(
        jQuery('#schedule_panel').detach());

    // Wrap the start and end time boxes on the timeslot dialog with
    // autocomplete widgets.
    $('#timeslot_start_time').suggest(generateTimeSuggestions, {});
    $('#timeslot_end_time').suggest(generateTimeSuggestions, {});

    // Make sure that the date picker uses the same date format as every other
    // component
    jQuery.datepicker.setDefaults({
        dateFormat : "dd/mm/yy"
    });

    // Wrap the start and end date text boxes on the timeslot dialog with
    // datepicker widgets.
    $('#timeslot_start_date').datepicker();
    $('#timeslot_end_date').datepicker();

    // Wrap the timeslot dialog div with a dialog widget so it can be opened.
    // This dialog is further configured when it is opened, as its behviour is
    // different when it is opened for editing vs opened for creating.
    $('#timeslot_dialog').dialog({
        autoOpen : false,
        modal : true,
        resizable : false
    });

    $('#schedule_dialog').dialog(
        {
            autoOpen : false,
            modal : true,
            resizable : false,
            buttons : {
                "Save" : function() {

                    jQuery.post(ajaxurl, {

                        action : 'tw-ajax-schedule-update',
                        schedule_id : current_schedule_id,
                        schedule_title : jQuery('#schedule_name').val(),
                        schedule_default : jQuery('#schedule_default').val()

                    }, function(response) {
                        jQuery(
                            '#schedule_tabs>ul>li>a[href=#schedule_tab_'
                                + current_schedule_id + ']').text(
                            jQuery('#schedule_name').val());
                        jQuery('#schedule_dialog').dialog('close');
                    });
                },
                "Cancel" : function() {
                    jQuery('#schedule_dialog').dialog('close');
                }
            },
            open : function(event, ui) {
                var $default_select = jQuery('#schedule_default');
                var select_html;
                jQuery('#schedule_name').val(
                    jQuery(
                        '#schedule_tabs>ul>li>a[href=#schedule_tab_'
                            + current_schedule_id + ']').text());
                populateWithCodeblocks($default_select);
                select_html = $default_select.html();
                select_html = "<option value='none'>Nothing</option>"
                    + select_html;
                $default_select.html(select_html);
            }
        });

    $('#colorpicker').ColorPicker(
        {
            onChange : function(hsb, hex, rgb) {
                $('#colorpicker').css('backgroundColor', '#' + hex);
                $('#codeblock_color').val(hex);
            },
            onBeforeShow : function() {
                $('#colorpicker').ColorPickerSetColor(
                    '#' + codeblocks[current_block_id].block_color);
            }

        });

    $('#codeblock_add').button();
    $('#codeblock_add').button("enable");
    $('#codeblock_add').click(addCodeblock);

    $('#schedule_add').button();
    $('#schedule_add').button("enable");
    $('#schedule_add').click(
        function($) {
            jQuery("#schedule_add").button("disable");
            jQuery("#schedule_add").button("option", "label", "Adding...");

            jQuery.post(ajaxurl, {

                action : 'tw-ajax-schedule-add'

            }, function(response) {

                $schedule_tabs.tabs("add", "#schedule_tab_"
                    + response.schedule_id,
                    response.schedules[response.schedule_id].title);
                $schedule_tabs.tabs("select", "#schedule_tab_"
                    + response.schedule_id);
                jQuery("#schedule_add").button("enable");
                jQuery("#schedule_add").button("option", "label",
                    "Add Schedule");
            });
        });

    $('#codeblock_save').button();
    $('#codeblock_save').click(function($) {
        saveCodeblockForm();
    });

    $('#schedule_edit').button();
    $('#schedule_edit').click(function($) {
        jQuery('#schedule_dialog').dialog('open');
    });

    $('#codeblock_remove').button();
    $('#codeblock_remove').click(function($) {
        if (codeblocks.length > 1)
            removeCodeblock();
        else {
            codeblocks[current_block_id].block_name = "Default Codeblock";
            codeblocks[current_block_id].block_code = "";
            updateCodeblockForm();
            saveCodeblockForm();
        }

    });
    $('#schedule_remove').button();
    $('#schedule_remove').click(function($) {
        removeSchedule();
    });

    $('#codeblock_name').keyup(
        function($) {
            jQuery(
                '#codeblock_tabs>ul>li>a[href=#codeblock_tab_'
                    + current_block_id + ']').text(
                jQuery('#codeblock_name').val());
        });

    $('#codeblock_reset').button();
    $('#codeblock_reset').click(
        function($) {
            updateCodeblockForm();
            jQuery(
                '#codeblock_tabs>ul>li>a[href=#codeblock_tab_'
                    + current_block_id + ']').text(
                jQuery('#codeblock_name').val());
        });

    $('#schedule_embed').button();
    $('#schedule_embed')
        .click(
            function($) {
                var embedText = "<div id='codeblock'></div>\n";
                embedText += "<script type='text/javascript'>\n";
                embedText += "(function() {\n";
                embedText += "var x = document.createElement('script'); x.type = 'text/javascript'; x.async = true;\n";
                embedText += " x.src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + '"
                    + ajaxurl
                    + "?action=tw-ajax-output-codeblocks&schedule="
                    + current_schedule_id + "';\n";
                embedText += "var y = document.getElementsByTagName('script')[0]; y.parentNode.insertBefore(x, y);\n";
                embedText += "})();\n";
                embedText += "</script>";
                var newText = jQuery('<textarea />', {
                    cols : '250',
                    rows : '8',
                    value : embedText
                });
                jQuery('#embed_dialog').empty();
                jQuery('#embed_dialog')
                    .text(
                        "Copy and paste the following code into your webpage where you want the widget to appear");
                newText.appendTo('#embed_dialog');
                newText.select();
                // jQuery('#embed_dialog').text(embedText);
                jQuery('#embed_dialog').dialog({
                    minWidth : 400,
                    minHeight : 250
                });

            });

    $('#calendar').weekCalendar({
        timeslotsPerHour : 2,
        dateFormat : "d M y",
        height : function($calendar) {
            return $(window).height() * 0.6;
        },
        draggable : function(calEvent, eventElement) {
            return false;
        },
        resizable : function(calEvent, eventElement) {
            return false;
        },

        allowCalEventOverlap : true,
        overlapEventsSeparate : true,
        eventRender : function(calEvent, $element) {

            renderEvent(calEvent, $element);

        },
        eventNew : function(calEvent, $event) {
            addNewTimeslot(calEvent);
        },

        eventClick : function(calEvent, $event) {
            updateTimeslot(calEvent);
        },

        title : function(date, calendar) {
            return "Scheduled Codeblocks";
        },

        data : getCalendarData
    });

    $("#accordion").accordion({
        header : 'h3',
        autoHeight : false,
        change : function(event, ui) {
            $('#calendar').weekCalendar('refresh');
        }
    });
}

jQuery(document).ready(initialize);
