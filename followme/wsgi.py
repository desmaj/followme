import eventlet
eventlet.monkey_patch()
from eventlet import wsgi

def eventlet_server_factory(global_conf, host, port):
    port = int(port)
    def serve(app):
        wsgi.server(eventlet.listen((host, port), app))
    return serve
