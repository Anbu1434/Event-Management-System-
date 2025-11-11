from django.urls import path
from .views import *
urlpatterns = [
    path('', home, name='home'),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('register_user/', register_user, name='register_user'),
    path('hmain/', hmain, name='hmain'),
    path('logout/', logout, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('allevents/', allevents, name='allevents'),
    path('myevents/', myevents, name='myevents'),
    path('register-event/<int:event_id>/', register_for_event, name='register_event'),
    path('unregister-event/<int:event_id>/', unregister_from_event, name='unregister_event'),
]  