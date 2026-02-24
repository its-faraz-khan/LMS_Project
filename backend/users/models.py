from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import re


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email).lower()
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_verified', True)
        return self.create_user(email, username, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
        ('guest', 'Guest'),
    )

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # UET Registration number extracted from email (read-only)
    registration_number = models.CharField(max_length=20, blank=True)
    
    # Profile customization
    description = models.TextField(max_length=500, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    social_links = models.JSONField(default=dict, blank=True) # {github: '', linkedIn: '', website: ''}

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    @staticmethod
    def is_valid_student_email(email):
        """Validates UET student email like 2024CS542@student.uet.edu.pk"""
        pattern = r'^\d{4}[A-Za-z]+\d+@student\.uet\.edu\.pk$'
        return bool(re.match(pattern, email, re.IGNORECASE))

    @staticmethod
    def extract_registration(email):
        """Extract registration number from email"""
        local = email.split('@')[0]
        # Convert 2024CS542 to 2024-CS-542
        match = re.match(r'^(\d{4})([A-Za-z]+)(\d+)$', local, re.IGNORECASE)
        if match:
            return f"{match.group(1)}-{match.group(2).upper()}-{match.group(3)}"
        return local


class OTP(models.Model):
    PURPOSE_CHOICES = (
        ('verify_email', 'Verify Email'),
        ('forgot_password', 'Forgot Password'),
    )

    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    data = models.JSONField(null=True, blank=True)  # Store pending registration data

    def __str__(self):
        return f"{self.email} - {self.otp_code} ({self.purpose})"
