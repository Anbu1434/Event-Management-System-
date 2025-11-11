
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import handler404
from signup import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('signup.urls'))
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = views.custom_page_not_found