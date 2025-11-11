from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from signup.models import Event

class Command(BaseCommand):
    help = 'Create sample events for testing'

    def handle(self, *args, **options):
        # Get or create a superuser for creating events
        try:
            admin_user = User.objects.filter(is_superuser=True).first()
            if not admin_user:
                admin_user = User.objects.create_superuser(
                    username='admin',
                    email='admin@campusconnect.com',
                    password='admin123'
                )
        except:
            admin_user = User.objects.first()  # Fallback to any user

        # Sample events data
        sample_events = [
            {
                'title': 'Tech Talk: AI in Education',
                'description': 'Join us for an exciting discussion about how artificial intelligence is transforming the education sector.',
                'date': timezone.now().date() + timedelta(days=7),
                'time': timezone.now().time().replace(hour=14, minute=0),
                'location': 'Auditorium A',
                'Event_type': 'seminar',
                'max_participants': 150,
                'registration_deadline': timezone.now() + timedelta(days=5),
            },
            {
                'title': 'Annual Sports Meet',
                'description': 'Campus-wide sports competition featuring various indoor and outdoor games.',
                'date': timezone.now().date() + timedelta(days=14),
                'time': timezone.now().time().replace(hour=9, minute=0),
                'location': 'Sports Complex',
                'Event_type': 'sports',
                'max_participants': 500,
                'registration_deadline': timezone.now() + timedelta(days=10),
            },
            {
                'title': 'Cultural Night 2025',
                'description': 'A night filled with music, dance, and cultural performances by talented students.',
                'date': timezone.now().date() + timedelta(days=21),
                'time': timezone.now().time().replace(hour=18, minute=30),
                'location': 'Main Campus Ground',
                'Event_type': 'cultural',
                'max_participants': 1000,
                'registration_deadline': timezone.now() + timedelta(days=18),
            },
            {
                'title': 'Python Workshop for Beginners',
                'description': 'Learn Python programming from scratch in this hands-on workshop.',
                'date': timezone.now().date() + timedelta(days=10),
                'time': timezone.now().time().replace(hour=10, minute=0),
                'location': 'Computer Lab 1',
                'Event_type': 'workshop',
                'max_participants': 30,
                'registration_deadline': timezone.now() + timedelta(days=8),
            },
            {
                'title': 'Career Fair 2025',
                'description': 'Meet with top companies and explore career opportunities.',
                'date': timezone.now().date() + timedelta(days=28),
                'time': timezone.now().time().replace(hour=10, minute=0),
                'location': 'Exhibition Hall',
                'Event_type': 'academic',
                'max_participants': 200,
                'registration_deadline': timezone.now() + timedelta(days=25),
            },
            {
                'title': 'Movie Night: Student Choice',
                'description': 'Relax and enjoy a movie chosen by student vote. Popcorn and drinks included!',
                'date': timezone.now().date() + timedelta(days=3),
                'time': timezone.now().time().replace(hour=19, minute=0),
                'location': 'Student Center',
                'Event_type': 'social',
                'max_participants': 100,
                'registration_deadline': timezone.now() + timedelta(days=2),
            },
        ]

        created_count = 0
        for event_data in sample_events:
            event, created = Event.objects.get_or_create(
                title=event_data['title'],
                defaults={
                    **event_data,
                    'created_by': admin_user,
                    'is_active': True,
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created event: {event.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Event already exists: {event.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully created {created_count} new events!')
        ) 