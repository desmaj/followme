import eventlet
eventlet.monkey_patch()
from eventlet import wsgi

from pyramid.config import Configurator

from followme.resources import RootResource

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings,
                          root_factory=RootResource)
    config.include('pyramid_mako')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.scan()
    return config.make_wsgi_app()

settings = {
    'pyramid.reload_templates': True,
    'pyramid.debug_authorization': True,
    'pyramid.debug_notfound': True,
    'pyramid.debug_routematch': False,
    'pyramid.default_locale_name': 'en',
}

if __name__ == '__main__':
    app = main(None, **settings)
    wsgi.server(eventlet.listen(('', 6543)), app)
