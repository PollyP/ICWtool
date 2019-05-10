/**
 * background_script.js
 * Licensed under GPL v.3.0 license: https://github.com/PollyP/ICWtool/blob/master/LICENSE
 **/

'use strict';

// process each response to our request for in common with data.
// if we have processed each icw request, then format the response to
// popup's get_icw_matches query and send it. 
function process_icw_matches(initial_match,icw_href, icw_matches, popupresponsef) {

	// build a record with the fields we're interested in
	icw_matches.matchGroups.forEach(function(mgroup) {
		console.log(mgroup);

		// format each icw response
		mgroup.matches.forEach(function(m) {

			// double quote user-input strings to escape commas
			// FIXME FIXME but what if there are double quotes in the field?
			let escapedicwdisplayname = "\"" + m.matchTestDisplayName + "\"";
			let escapedicwnote = "\"" + m.note + "\"";

			// build the icw string
			let icw_record = 
				initial_match.sourcedisplayname + "," +
				initial_match.sourceguid + "," + 
				initial_match.pagenum + "," +
				initial_match.matchname + "," + 
				initial_match.matchguid + "," + 
				initial_match.cm + "," + 
				m.testGuid + "," + 
				escapedicwdisplayname + "," + 
				m.subjectGender + "," +
				m.sharedCentimorgans + "," + 
				m.sharedSegments + "," + 
				m.starred + "," + 
				escapedicwnote;

			// store it
			icw_records.push(icw_record);


		});
	});

	// remove the initial_match_guid from the work queue
	workqueue = workqueue.filter( function(value,index,arr) {
		return value != initial_match.matchguid;
	});
	//console.log("items left to process, post process: " + workqueue.length);
		
	// if we don't have any more items in the work queue, then we have all the data
	if ( workqueue.length == 0 ) {

		// send the icw_records to the popup so the user can download

		// turn the icw_records array into a long string
		let results = icw_records.join('\n');

		// prepend this long string with column headers and retrieval information
		var manifest = chrome.runtime.getManifest();
		let ext_info = "# File produced by " + manifest.name + " version: " + manifest.version + " Created " + Date() + "\n";
		let user_info = "# Looking for in common with data for matches for " + initial_match.sourcedisplayname + " GUID: " + initial_match.sourceguid + " from URL " + initial_match.href + "\n";
		let column_headers = "User display name,User GUID,Results page number,Match Name,Match GUID,Match Centimorgans,ICW GUID,ICW Name,ICW Gender,ICW Centimorgans (rel. to User),ICW Num Segments (rel. to User),ICW starred,ICW note\n"; 
		let data = ext_info + user_info + column_headers + results;
		let fname = initial_match.sourceguid + "_" + initial_match.pagenum + "_ICW_Matches.csv"

		// send this to the popup
		//console.log("\n\n================================================\nsending popup this:");
		//console.log(results);
		popupresponsef({ action: "get_icw_matches", filename : fname, results: data });
    	}
}

// give the source's guid and a match guid, build a href to query for in common with data
function build_icw_href( sourceguid, matchguid ) {
	return "https://www.ancestry.com/dna/secure/tests/" + sourceguid + "/matchesInCommon?filterBy=ALL&sortBy=RELATIONSHIP&page=1&matchTestGuid=" + matchguid;
}

// send a request for in common with data and process its results
function get_icw_matches( initial_match, icw_href, popupresponsef) {

	// FIXME: timeout and set an error message?
	console.log("Sending icw request");
	var req = new XMLHttpRequest();
	req.open("GET", icw_href, true);
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200) {
				//console.log(req.responseText);
				var icw_matches = JSON.parse(req.responseText);
				// extract icw data and store it
				process_icw_matches( initial_match, icw_href, icw_matches, popupresponsef );
			}
		}
	};
	req.send();
}


var workqueue = [];
var icw_records = [];

// just hang out and wait for messages to process
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		if (request.action == "get_icw_matches") {

			// popup requests the in common data for the matches on the active tab
			workqueue = [];
			icw_records = [];

			// find the current active tab ...
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

				// ... and send a get_initial_matches message to the attached content script
				chrome.tabs.sendMessage(tabs[0].id, {action: "get_initial_matches"}, function(response) {

					// content script replies with a list of initial matches found
					console.log("background got a get_initial_matches response from content_script");
					console.log(response);

					// build a work queue so we can tell when we're done
					response.initial_matches.forEach(function(initial_match) {
						workqueue.push( initial_match.matchguid );
					});
					//console.log("items to process: " + workqueue.length);

					// for each initial match, go get the in common withs
					response.initial_matches.forEach(function(initial_match) {
						let icw_href = build_icw_href( initial_match.sourceguid, initial_match.matchguid );
						console.log(icw_href);
						get_icw_matches( initial_match, icw_href, sendResponse );
					});
	
				});  
			});

			return true;	// tell the popup there will be an asynchronous response, so keep the channel open
		}
		else if ( request.action == "activate_icon" ) {
			// see https://stackoverflow.com/questions/35882089/popup-is-not-appearing-when-used-page-action
        		chrome.pageAction.show(sender.tab.id);
		}
		else {
			console.log("I do not understand this message?!?" + JSON.stringify(sender) + JSON.stringify(response));
		}
});

