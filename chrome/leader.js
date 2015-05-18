var serviceURLBase = "http://localhost:6543/streams/"
var sessionIDs = {};

var doPOST = function (url, params, callback) {
    var xhr = new XMLHttpRequest();
    if (callback) {
	xhr.addEventListener('load', callback);
    }
    xhr.open('POST', url, true);
    if (params) {
	console.log("sending params: " + params);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.send(params);
    } else {
	xhr.send();
    }
};

var withCurrentTab = function (callback) {
    var queryInfo = {active: true, currentWindow: true};
    chrome.tabs.query(queryInfo, function (tabs) {
	if (tabs[0]) {
	    callback(tabs[0]);
	}
    });
};

chrome.browserAction.onClicked.addListener(function () {
    withCurrentTab(function (currentTab) {
	if (sessionIDs[currentTab.index]) {
	    delete sessionIDs[currentTab.index];
	    console.log('capture off');
	} else {
	    var leadURL = serviceURLBase + "lead";
	    doPOST(leadURL, null, function (event) {
		var data = JSON.parse(event.currentTarget.responseText);
		console.log(data);
		sessionIDs[currentTab.index] = data.id;
		console.log('capture on');
	    });	    
	}
    });
});

chrome.webNavigation.onCommitted.addListener( function (details) {
    withCurrentTab(function (currentTab) {
	if (sessionIDs[currentTab.index]) {
	    console.log(details);
	    console.log(currentTab);
	    if (details.tabId == currentTab.id || true) {
		var navigateURL = serviceURLBase + 'navigate';
		var params = encodeURI('id=' + sessionIDs[currentTab.index] + '&url=' + currentTab.url);
		console.log('navigating to ' + params);
		doPOST(navigateURL, params);
	    }
	}
    });
});