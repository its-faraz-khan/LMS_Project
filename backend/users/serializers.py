from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
import re


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password']

    def validate_email(self, value):
        value = value.lower()
        if not CustomUser.is_valid_student_email(value):
            raise serializers.ValidationError(
                "Only UET student emails are accepted (e.g., 2024CS542@student.uet.edu.pk)"
            )
        # Note: RegisterView now handles existing unverified users, 
        # but we keep this for clean API behavior on already-verified emails.
        if CustomUser.objects.filter(email__iexact=value, is_verified=True).exists():
            raise serializers.ValidationError("An account with this email already exists and is verified.")
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken. Please choose another.")
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', value):
            raise serializers.ValidationError("Username must be 3-20 characters, letters, numbers, and underscores only.")
        return value

    def validate_password(self, value):
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = validated_data['email']
        reg_num = CustomUser.extract_registration(email)
        user = CustomUser.objects.create_user(
            **validated_data,
            registration_number=reg_num,
            is_verified=False,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate_email(self, value):
        return value.lower()


import json

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'role', 'is_verified', 'registration_number',
            'description', 'profile_pic', 'social_links'
        ]
        read_only_fields = ['email', 'registration_number', 'role', 'is_verified']

    def to_internal_value(self, data):
        # Convert QueryDict to a regular dict to allow non-string values (like our parsed JSON dict)
        if hasattr(data, 'dict'):
            data = data.dict()
        else:
            data = data.copy() if hasattr(data, 'copy') else dict(data)

        # Handle social_links if it comes as a string (from FormData)
        if 'social_links' in data and isinstance(data['social_links'], str):
            try:
                data['social_links'] = json.loads(data['social_links'])
            except (json.JSONDecodeError, TypeError):
                pass
        
        # Ensure we don't try to save empty strings or 'null' strings as profile pictures
        if 'profile_pic' in data and (not data['profile_pic'] or data['profile_pic'] == 'null'):
            data.pop('profile_pic')
            
        return super().to_internal_value(data)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower()


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)
    purpose = serializers.ChoiceField(choices=['verify_email', 'forgot_password'])

    def validate_email(self, value):
        return value.lower()


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField()

    def validate_email(self, value):
        return value.lower()

    def validate_new_password(self, value):
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data
