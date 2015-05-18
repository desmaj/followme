var LeadUI = function (container) {
    this._container = container;
    this._window = null;
};

LeadUI.prototype.draw = function () {
    var object = document.createElement('object');
    object.data = 'https://www.google.com'
    this._container.appendChild(object);
};

LeadUI.prototype.load = function (url) {
    this._window = window.open();
    this._window.location = url;
    var self = this;
    setTimeout(function () { console.log(self._window.location.url) }, 5000);
};

window.addEventListener('load', function () {
    var container = document.getElementById('ui-container');
    var ui = new LeadUI(container);
    // ui.draw();
    ui.load('https://www.google.com');
});
