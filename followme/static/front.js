var FrontUI = function (container) {
    this._container = container;
};

FrontUI.prototype.draw = function () {
    var header = document.createElement('div');
    header.textContent = "Choose a session to follow:";
    console.log(header);
    this._container.appendChild(header);
};

FrontUI.prototype.addSession = function (id) {
    var url = 'follow?id=' + id;
    var link = document.createElement('a');
    link.href = url;
    link.textContent = id;
    var br = document.createElement('br');
    this._container.appendChild(link);
    this._container.appendChild(br);
};

var init = function (ids) {
    window.addEventListener('load', function () {
	var container = document.getElementById('ui-container');
	var ui = new FrontUI(container);
	ui.draw();
	
	for (var index in ids) {
	    var id = ids[index];
	    ui.addSession(id);
	}

	var source = new EventSource('streams/updates');
	source.addEventListener('message', function (event) {
	    console.log(event);
	    var update = JSON.parse(event.data);
	    if (update.action =='add') {
		ui.addSession(update.id, update.url);
	    } else if (update.action == 'remove') {
		ui.removeSession(update.id);
	    }
	});
    });
}