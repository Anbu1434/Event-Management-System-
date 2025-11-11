from django.contrib import admin
from .models import Profile, Event, EventRegistration

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'university', 'student_id', 'phone_number']
    list_filter = ['university']
    search_fields = ['user__username', 'user__email', 'student_id']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'time', 'location', 'Event_type', 'created_by', 'is_active', 'registered_count']
    list_filter = ['Event_type', 'date', 'is_active', 'created_by']
    search_fields = ['title', 'description', 'location']
    date_hierarchy = 'date'
    readonly_fields = ['created_at', 'updated_at', 'registered_count']
    
    def registered_count(self, obj):
        return obj.registered_count
    registered_count.short_description = 'Registered'

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'registered_at', 'attended']
    list_filter = ['attended', 'registered_at', 'event__Event_type']
    search_fields = ['user__username', 'event__title']
    date_hierarchy = 'registered_at'
