from django.conf.urls import include, url
from django.contrib import admin
import views
admin.autodiscover()

# if USE_CAS:
#     admin.site.login = login_required(admin.site.login)
#     urlpatterns += patterns('',
#         url(r'^login/$', 'cas.views.login', name='login'),
#         url(r'^logout/$', 'cas.views.logout', name='logout'),
#         url(r'^admin/logout/$', 'cas.views.logout'),
#     )

from rest_framework import routers
from api import NoteViewSet, FileViewSet, URLViewSet

router = routers.DefaultRouter()
router.register(r'notes', NoteViewSet,'Note')
router.register(r'files', FileViewSet,'File')
router.register(r'urls', URLViewSet,'URL')


urlpatterns = [
    # Examples:
#     url(r'^$', 'glims.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^file/(?P<pk>\d+)/get/$', views.get_file, name='get_file'),
    url(r'^files/(?P<content_type_id>\d+)/(?P<pk>[\-\w]+)/attach/$', views.attach_file, name='attach_file'),
    url(r'^api/', include(router.urls)),
]

