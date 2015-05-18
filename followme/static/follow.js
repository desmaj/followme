window.addEventListener('load', function () {
    var newWindow = window.open('https://www.google.com', 'followMeFollower');
    var source = new EventSource('streams/updates?id=' + id);
    source.addEventListener('message', function (event) {
	var update = JSON.parse(event.data);
	console.log(update);
	if (update.action =='navigate') {
	    newWindow.location = update.url;
	}	
    });
});
