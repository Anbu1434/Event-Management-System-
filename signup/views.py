
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Profile, Event, EventRegistration
from django.contrib.auth.decorators import login_required
from .forms import UserUpdateForm, ProfileUpdateForm
from django.utils import timezone
from django.db.models import Q
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.template import TemplateDoesNotExist
import logging
import qrcode
import json
from io import BytesIO
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)
def home(request):
    return render(request, 'home.html')

def register(request):
    # Redirect authenticated users to main page
    if request.user.is_authenticated:
        return redirect('hmain')
    return render(request, 'register.html')

def login(request):
    # Redirect authenticated users to main page
    if request.user.is_authenticated:
        return redirect('hmain')
        
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('hmain')
        else:
            messages.error(request, 'Invalid credentials. Please try again.')
            return render(request, 'login.html')
    return render(request, 'login.html')

def register_user(request):
    # Redirect authenticated users to main page
    if request.user.is_authenticated:
        return redirect('hmain')
        
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        cpassword = request.POST.get('cpassword')
        university = request.POST.get('university')
        student_id = request.POST.get('student_id')
        terms = request.POST.get('terms')

        # Basic validation
        if not all([first_name, last_name, email, password, cpassword, university, terms]):
            messages.error(request, 'All required fields must be filled.')
            return render(request, 'register.html')

        # Email validation
        try:
            validate_email(email)
        except ValidationError:
            messages.error(request, 'Invalid email address.')
            return render(request, 'register.html')

        # Password matching
        if password != cpassword:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'register.html')

        # Password strength (basic check)
        
        if len(password) < 8:
            messages.error(request, 'Password must be at least 8 characters long.')
            return render(request, 'register.html')

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email address is already registered.')
            return render(request, 'register.html')

        try:
            # Create user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )

            # Create profile
            Profile.objects.create(
                user=user,
                university=university,
                student_id=student_id if student_id else None
            )
            messages.success(request, 'Registration successful! Welcome to CampusConnect.')
            return redirect('login')

        except Exception as e:
            messages.error(request, f'Registration failed: {str(e)}')
            return render(request, 'register.html')
@login_required(login_url='login') 
def hmain(request):
    # Get upcoming events
    events = Event.objects.filter(
        date__gte=timezone.now().date(),
        is_active=True
    ).order_by('date', 'time')[:6]  # Show only 6 recent events
    
    context = {
        'events': events
    }
    return render(request, 'hmain.html', context)

@login_required(login_url='login')
def logout(request):
    auth_logout(request)
    messages.success(request, 'You have been successfully logged out.')
    return redirect('home')

@login_required(login_url='login')
def profile_view(request):
    # Get or create profile if it doesn't exist
    profile, created = Profile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(request.POST, request.FILES, instance=profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('profile')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        user_form = UserUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=profile)
    
    context = {
        'user_form': user_form,
        'profile_form': profile_form,
        'user': request.user,
        'profile': profile
    }
    return render(request, 'profile.html', context)

@login_required(login_url='login')
def allevents(request):
    # Get all upcoming active events
    events = Event.objects.filter(
        date__gte=timezone.now().date(),
        is_active=True
    ).order_by('date', 'time')
    
    # Get user's registered event IDs
    registered_event_ids = []
    if request.user.is_authenticated:
        registered_event_ids = EventRegistration.objects.filter(
            user=request.user
        ).values_list('event_id', flat=True)
    
    context = {
        'events': events,
        'registered_event_ids': list(registered_event_ids)
    }
    return render(request, 'allevents.html', context)

@login_required(login_url='login')
def myevents(request):
    # Get events user has registered for
    registered_events = Event.objects.filter(
        registrations__user=request.user
    ).order_by('date', 'time')
    
    # Get events created by the user
    created_events = Event.objects.filter(
        created_by=request.user
    ).order_by('date', 'time')
    
    context = {
        'registered_events': registered_events,
        'created_events': created_events
    }
    return render(request, 'myevents.html', context)


@login_required(login_url='login')
def register_for_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    if not event.is_registration_open:
        messages.error(request, 'Registration for this event is closed.')
        return redirect('allevents')

    if EventRegistration.objects.filter(user=request.user, event=event).exists():
        messages.warning(request, 'You are already registered for this event.')
        return redirect('allevents')

    if event.registered_count >= event.max_participants:
        messages.error(request, 'This event is full.')
        return redirect('allevents')

    registration = EventRegistration.objects.create(
        user=request.user,
        event=event
    )

    # -----------------------------
    # QR CODE GENERATION
    # -----------------------------
    qr_payload = {
        "username": request.user.username,
        "event": event.title,
        "date": event.date.strftime("%Y-%m-%d"),
        "time": event.time.strftime("%I:%M %p"),
    }

    qr_data = json.dumps(qr_payload)

    qr = qrcode.make(qr_data)
    qr_buffer = BytesIO()
    qr.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    # -----------------------------
    # EMAIL PREPARATION
    # -----------------------------
    subject = f"Registration Confirmation – {event.title}"
    context = {
        "user": request.user,
        "event": event,
    }

    if request.user.email:
        try:
            html_content = render_to_string("email.html", context)
            text_content = strip_tags(html_content)

            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[request.user.email],
            )

            email.attach_alternative(html_content, "text/html")

            # Attach QR Code
            email.attach(
                filename="event_qr_code.png",
                content=qr_buffer.getvalue(),
                mimetype="image/png",
            )

            email.send()
            logger.info(f"QR email sent to {request.user.email}")

        except Exception as e:
            logger.error(f"Email failed: {e}", exc_info=True)
            messages.warning(
                request,
                "Registered successfully, but email delivery failed."
            )
    else:
        messages.warning(
            request,
            "Registered successfully, but no email is linked to your account."
        )

    messages.success(request, f"Successfully registered for {event.title}!")
    return redirect("allevents")


@login_required(login_url='login')
def unregister_from_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    
    try:
        registration = EventRegistration.objects.get(user=request.user, event=event)
        registration.delete()
        messages.success(request, f'Successfully unregistered from {event.title}.')
    except EventRegistration.DoesNotExist:
        messages.error(request, 'You are not registered for this event.')
    
    return redirect('myevents') 

from django.shortcuts import render

def custom_page_not_found(request, exception):
    return render(request, '404.html', status=404)
