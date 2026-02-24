from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
import random
from django.db import models

from .models import CustomUser, OTP
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    ForgotPasswordSerializer, VerifyOTPSerializer, ResetPasswordSerializer
)


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_to_console(email, otp_code, purpose):
    """Prints OTP to terminal (development mode)"""
    print("\n" + "="*60)
    print(f"  📧 OTP for {email}")
    print(f"  Purpose: {purpose.upper()}")
    print(f"  OTP Code: {otp_code}")
    print(f"  Valid for: 10 minutes")
    print("="*60 + "\n")


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        if email:
            # Check if user already exists
            if CustomUser.objects.filter(email__iexact=email, is_verified=True).exists():
                return Response({'error': 'An account with this email already exists and is verified. Please log in.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # We DON'T save the user yet. 
            # We store the validated data in the OTP object.
            validated_data = serializer.validated_data
            
            # Generate and send OTP for email verification
            otp_code = generate_otp()
            OTP.objects.create(
                email=email,
                otp_code=otp_code,
                purpose='verify_email',
                data=validated_data  # Store registration data here
            )
            print(f"DEBUG: Pending registration for {email}, sending OTP...")
            send_otp_to_console(email, otp_code, 'Email Verification')
            return Response({
                'message': 'Verification code sent! Please verify your email to complete registration.',
                'email': email,
                'require_verification': True
            }, status=status.HTTP_200_OK)
        
        print(f"DEBUG: Registration validation failed for {email}: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        purpose = serializer.validated_data['purpose']

        email = serializer.validated_data['email']  # Serializer now lowercases it
        otp_code = serializer.validated_data['otp_code']
        purpose = serializer.validated_data['purpose']

        ten_min_ago = timezone.now() - timedelta(minutes=10)
        otp = OTP.objects.filter(
            email__iexact=email,
            otp_code=otp_code,
            purpose=purpose,
            is_used=False,
            created_at__gte=ten_min_ago
        ).last()

        if not otp:
            # Enhanced debug info
            print(f"DEBUG: OTP verification failed for {email} with code {otp_code} (purpose: {purpose})")
            existing = OTP.objects.filter(email__iexact=email, purpose=purpose, is_used=False).last()
            if existing:
                print(f"DEBUG: Found OTP {existing.otp_code} in DB for this user/purpose, but it didn't match {otp_code}, has different purpose, or is expired.")
            else:
                print(f"DEBUG: No unused OTP for {email} with purpose {purpose} found in DB at all.")
            
            return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        if purpose == 'verify_email':
            # Check if user already exists (just in case)
            if CustomUser.objects.filter(email__iexact=email, is_verified=True).exists():
                 otp.is_used = True
                 otp.save()
                 return Response({'error': 'Your email is already verified. Please log in.'}, status=status.HTTP_400_BAD_REQUEST)

            if not otp.data:
                return Response({'error': 'Registration data missing. Please try registering again.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Create the user now from the stored data
                reg_data = otp.data.copy()
                reg_data.pop('confirm_password', None)
                
                # Clean up any existing unverified user with this email/username 
                # (to satisfy "don't create until verified" rule and handle legacy data)
                old_count = CustomUser.objects.filter(
                    models.Q(email__iexact=email) | models.Q(username=reg_data.get('username'))
                ).filter(is_verified=False).delete()[0]
                if old_count > 0:
                    print(f"DEBUG: Cleaned up {old_count} unverified records for {email}")

                # Final uniqueness check for verified users
                if CustomUser.objects.filter(username=reg_data['username'], is_verified=True).exists():
                    return Response({'error': 'Username already taken by a verified user.'}, status=status.HTTP_400_BAD_REQUEST)
                if CustomUser.objects.filter(email__iexact=email, is_verified=True).exists():
                    return Response({'error': 'Email already registered and verified.'}, status=status.HTTP_400_BAD_REQUEST)

                reg_num = CustomUser.extract_registration(email)
                user = CustomUser.objects.create_user(
                    **reg_data,
                    registration_number=reg_num,
                    is_verified=True,
                )
                
                # Mark OTP as used only AFTER successful user creation
                otp.is_used = True
                otp.save()
                
                print(f"DEBUG: User {email} created and verified successfully")
                return Response({'message': 'Account created and verified! You can now log in.'})
            except Exception as e:
                import traceback
                traceback.print_exc()
                print(f"DEBUG: Creation error: {str(e)}")
                return Response({'error': f'Failed to create account: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # For forgot_password, we DON'T mark it as used here.
        # We let the ResetPasswordView do that so it can verify the same code.
        return Response({'message': 'OTP verified successfully. You can now reset your password.'})


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        # Find the actual user to handle case-insensitive email login
        try:
            user_obj = CustomUser.objects.get(email__iexact=email)
            actual_email = user_obj.email
        except CustomUser.DoesNotExist:
            # Check if there's a pending registration OTP for this email
            pending = OTP.objects.filter(email__iexact=email, purpose='verify_email', is_used=False).last()
            if pending:
                 print(f"DEBUG: Login attempted for pending registration: {email}")
                 return Response({
                    'error': 'Please verify your email to complete registration.',
                    'require_verification': True,
                    'email': email
                }, status=status.HTTP_403_FORBIDDEN)
            
            print(f"DEBUG: Login failed - No user found for {email}")
            return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=actual_email, password=password)
        if not user:
            print(f"DEBUG: Login failed - Authentication failed for {actual_email} (wrong password)")
            return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_verified and user.role == 'student':
            return Response({
                'error': 'Please verify your email first.',
                'require_verification': True,
                'email': user.email
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })


class GuestLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Return a guest token (limited access)
        return Response({
            'guest': True,
            'message': 'Logged in as guest. Some features may be limited.',
            'role': 'guest'
        })


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].lower()

        try:
            # Only send reset OTP for verified users
            user = CustomUser.objects.get(email__iexact=email, is_verified=True)
        except CustomUser.DoesNotExist:
            print(f"DEBUG: Forgot password requested for non-existent or unverified email: {email}")
            return Response({'error': 'No verified account found with this email. Please register first.'}, status=status.HTTP_404_NOT_FOUND)

        otp_code = generate_otp()
        OTP.objects.create(
            email=email,
            otp_code=otp_code,
            purpose='forgot_password'
        )
        send_otp_to_console(email, otp_code, 'Forgot Password')

        return Response({'message': 'OTP sent to your email. Check the terminal for development OTP.'})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].lower()
        otp_code = serializer.validated_data['otp_code']
        new_password = serializer.validated_data['new_password']

        ten_min_ago = timezone.now() - timedelta(minutes=10)
        otp = OTP.objects.filter(
            email__iexact=email,
            otp_code=otp_code,
            purpose='forgot_password',
            is_used=False,
            created_at__gte=ten_min_ago
        ).last()

        if not otp:
            return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save()

        try:
            user = CustomUser.objects.get(email__iexact=email)
            user.set_password(new_password)
            user.save()
            print(f"DEBUG: Password successfully reset for user: {user.email}")
        except CustomUser.DoesNotExist:
             return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'Password reset successfully! You can now log in with your new password.'})


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        purpose = request.data.get('purpose', 'verify_email')

        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists for forgot_password
        if purpose == 'forgot_password':
            if not CustomUser.objects.filter(email__iexact=email, is_verified=True).exists():
                return Response({'error': 'Cannot resend OTP for an unverified or non-existent email.'}, status=status.HTTP_404_NOT_FOUND)

        # Carry forward registration data if this is a resend for verification
        registration_data = None
        if purpose == 'verify_email':
            last_otp = OTP.objects.filter(email__iexact=email, purpose='verify_email').last()
            if last_otp:
                registration_data = last_otp.data

        otp_code = generate_otp()
        OTP.objects.create(
            email=email, 
            otp_code=otp_code, 
            purpose=purpose,
            data=registration_data
        )
        send_otp_to_console(email, otp_code, f"{purpose} (Resend)")

        return Response({'message': 'OTP resent successfully.'})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
