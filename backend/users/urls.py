from django.urls import path
from .views import (
    RegisterView, LoginView, GuestLoginView,
    ForgotPasswordView, ResetPasswordView,
    VerifyEmailView, ResendOTPView, MeView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('guest-login/', GuestLoginView.as_view(), name='guest-login'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('me/', MeView.as_view(), name='me'),
]
