from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    university = models.CharField(max_length=100)
    student_id = models.CharField(max_length=50, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'

class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ('academic', 'Academic'),
        ('sports', 'Sports'),
        ('cultural', 'Cultural'),
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('social', 'Social'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=200)
    Event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default='other')
    image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    max_participants = models.PositiveIntegerField(default=100)
    registration_deadline = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    @property
    def is_registration_open(self):
        return timezone.now() < self.registration_deadline and self.is_active

    @property
    def registered_count(self):
        return self.registrations.count()

    @property
    def spots_remaining(self):
        return self.max_participants - self.registered_count

    class Meta:
        ordering = ['date', 'time']
        verbose_name = 'Event'
        verbose_name_plural = 'Events'

class EventRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_registrations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"

    class Meta:
        unique_together = ['user', 'event']
        verbose_name = 'Event Registration'
        verbose_name_plural = 'Event Registrations'