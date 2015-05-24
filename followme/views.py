import json

from eventlet.timeout import Timeout

from pyramid.response import Response
from pyramid.view import view_config

from followme.resources import streams

@view_config(context='followme.resources.RootResource', renderer='templates/front.mako')
def front(request):
    return {'ids': json.dumps(streams.sessions())}

@view_config(name='lead', context='followme.resources.StreamsResource', renderer='json')
def lead(context, request):
    new_id = context.new()
    context.send_message(None, {'action': "add", 'id': new_id})
    request.response.headers['Access-Control-Allow-Origin'] = '*'
    return {'id': new_id}

@view_config(name='stop', context='followme.resources.StreamsResource')
def stop(context, request):
    id = request.params.get('id')
    context.stop(id)
    context.send_message(id, {'action': 'stop'})
    return Response('OK')

@view_config(name='follow', context='followme.resources.RootResource', renderer='templates/follow.mako')
def follow(request):
    return {'id': request.params.get('id')}

@view_config(name='navigate', context='followme.resources.StreamsResource')
def navigate(context, request):
    print "Navigating: {}".format(request.params)
    id = request.params.get('id')
    url = request.params.get('url')
    context.send_message(id, {'action': 'navigate', 'url': url})
    return Response('OK', headers={'Access-Control-Allow-Origin': '*',
                                   'Access-Control-Allow-Headers': '*'})

def make_message(**kwargs):
    return 'data: {}\n\n'.format(json.dumps(kwargs))

@view_config(name='updates', context='followme.resources.StreamsResource')
def updates(context, request):
    id = request.params.get('id')
    def _send_updates():
        timeout = Timeout(20)
        try:
            while True:
                message = context.get_message(id)
                yield make_message(**message)
        except Timeout:
            pass
    return Response(app_iter=_send_updates(), content_type='text/event-stream')
