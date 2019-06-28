/**
 * content_script.js
 * Licensed under GPL v.3.0 license: https://github.com/PollyP/ICWtool/blob/master/LICENSE
 **/

'use strict';

// extract the data we need from a matchRow
function processMatchRow(item) {

	// dig out the matchesName element
	var namenl = item.getElementsByClassName("userCardContent");
	var namearr = Array.prototype.slice.call(namenl)
	var namesplit = namearr[0].innerText.split('\n');
	const nameString = "\"" + namesplit[0] + "\"";
	//console.log(nameString);

	// dig out the href
	var nameanl = namearr[0].getElementsByClassName("userCardTitle");
	var aarr = Array.prototype.slice.call(nameanl)
	// fixme prepend with https://...
	const hrefString = aarr[0].getAttribute("href");
	//console.log(hrefString);

	// dig out the guids for the source and match
	var guidpatt = /compare-ng\/(.*)\/with\/(.*)/
	var m = guidpatt.exec(hrefString)
	// FIXME need to test for success
	const sourceGuidString = m[1];
	const matchGuidString = m[2];
	//console.log(matchGuidString);

	// dig out the cm data
	var sharedDnanl = item.getElementsByClassName("cMText");
	var sharedDnaarr = Array.prototype.slice.call(sharedDnanl)
	//console.log(sharedDnaarr[0].innerText);
	const cmString = "\"" + sharedDnaarr[0].innerText + "\"";

	// add to the results
	results.push( { sourcedisplayname : page_data.sourcedisplayname, sourceguid: sourceGuidString, pagenum : page_data.resultspagenum, matchname: nameString, matchguid : matchGuidString, href: hrefString, cm: cmString } ); 
	
}

// find all the matchesRows on the page and extract the data we need from each
function getMatches() {
	var mrnl = document.getElementsByTagName("match-entry");
	var mrarr = Array.prototype.slice.call(mrnl)
	//console.log(mrarr);
	//console.log(mrarr.length);
	for(var i=0; i < mrarr.length; i++ ) {
		processMatchRow(mrarr[i]);
	}
}

// get the source's display name and the page number from the page
function getPageData() {
	var ptnl = document.getElementsByClassName("pageTitle");
	var ptarr = Array.prototype.slice.call(ptnl)
	//console.log(ptarr);
	var pageTitleString = ptarr[0].innerText;
	// FIXME will break on other languages
	var pagetitlepatt = /(.*)'s DNA Matches/
	var m = pagetitlepatt.exec(pageTitleString);
	var testDisplayNameString = "\"" + m[1] + "\"";
	//console.log(testDisplayNameString);

	//var pagenumpatt = /(page=.*)&?/;
	//var m2 = pagenumpatt.exec(document.location.href);
	//var pageNumString = m2[1];
	var pageNumString = "1";
	//console.log(pageNumString);

	return { sourcedisplayname : testDisplayNameString, resultspagenum : pageNumString }
}


var results = [];
var page_data = {};

// see https://stackoverflow.com/questions/35882089/popup-is-not-appearing-when-used-page-action
chrome.runtime.sendMessage({"action": "activate_icon"});

// just hang out and wait for messages to come in
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		/*
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		*/

		if ( request.action == "get_initial_matches" ) {
			// the background script would like a list of initial matches from this page
			page_data = getPageData();
			results = [];
			getMatches();
			sendResponse( {initial_matches: results} );
		}
		else {
			console.log("unknown message: ");
			console.log(sender);
			console.log(request);
		}

		return true;	// response will be asynchronous
});
