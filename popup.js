/**
 * popup.js
 * Licensed under GPL v.3.0 license: https://github.com/PollyP/ICWtool/blob/master/LICENSE
 **/

'use strict';

function click(e) {

	console.log("sending get_icw_matches message to the background script");
	document.getElementById( "status" ).innerHTML = "Retrieving ...";


	// tell the background script to get shared matches for matches on this page
	chrome.runtime.sendMessage({action: "get_icw_matches"} , function(response) {
		console.log("got a response to get_icw_matches");
		console.log(response);

		// turn the results into a csv blob and download it
		var blob = new Blob([response.results], {type: 'text/csv'});
		var elem = document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = response.filename;
		document.body.appendChild(elem);
		elem.click();        
		document.body.removeChild(elem);

		document.getElementById( "status" ).innerHTML = "ICW matches downloaded";


		// results are downloaded. reenable the download button again
		let btn = document.getElementById( "geticw" );
		btn.addEventListener( 'click', click, {once : true} );	// re-add in the listener again

  });
}

// when popup is loaded, add a click action to the download button
document.addEventListener('DOMContentLoaded', function () {
	let btn = document.getElementById( "geticw" );
	btn.addEventListener( 'click', click, {once : true} );	// remove listener after this has been clicked
});

