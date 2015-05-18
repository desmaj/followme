import uuid

import eventlet
from eventlet.event import Event

class StreamsResource(object):

    def __init__(self):
        self._action_event = Event()
        self._session_events = {}

    def new(self):
        new_id = str(uuid.uuid4())
        self._session_events[new_id] = Event()
        print self._session_events.keys()
        return new_id

    def sessions(self):
        return self._session_events.keys()
    
    def send_message(self, id, message):
        if id:
            self._session_events[id].send(message)
            eventlet.sleep()
            self._session_events[id] = Event()
        else:
            self._action_event.send(message)
            eventlet.sleep
            self._action_event = Event()
    
    def get_message(self, id):
        if id:
            return self._session_events[id].wait()
        else:
            return self._action_event.wait()
    
streams = StreamsResource()

class RootResource(object):

    def __init__(self, request):
        self._request = request

    def __getitem__(self, key):
        if key == 'streams':
            return streams
        raise KeyError(key)
