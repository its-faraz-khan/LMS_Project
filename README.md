# UET LMS – Learning Management System

## 📁 Project Structure

```
lms-project/
├── backend/                    ← Django Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── lms/                   ← Django project config
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── users/                 ← Auth app
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py          ← CustomUser + OTP models
│       ├── serializers.py     ← DRF serializers
│       ├── views.py           ← API views
│       ├── urls.py            ← Auth endpoints
│       └── admin.py           ← Django admin config
│
└── frontend/                  ← React Frontend
    ├── package.json
    ├── tailwind.config.js
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css          ← Tailwind + custom styles
        ├── App.jsx            ← Routes
        ├── context/
        │   └── AuthContext.jsx
        ├── utils/
        │   └── api.js         ← Axios API calls
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── SignupPage.jsx
        │   ├── ForgotPasswordPage.jsx
        │   └── HomePage.jsx
        └── components/
            ├── IllustrationPanel.jsx   ← Left SVG illustration
            └── OTPModal.jsx            ← OTP verification modal
```

---

## 🚀 Setup Guide

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

---

### 1. PostgreSQL Setup

```sql
-- Open psql or pgAdmin and run:
CREATE DATABASE lms_db;
CREATE USER postgres WITH PASSWORD '@Uckhan@6435';
GRANT ALL PRIVILEGES ON DATABASE lms_db TO postgres;
```

---

### 2. Backend Setup

```bash
cd lms-project/backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin superuser
python manage.py createsuperuser
# Use any email and password you like

# Start the server
python manage.py runserver
```

Backend runs at: http://localhost:8000
Admin panel at: http://localhost:8000/admin

---

### 3. Frontend Setup

```bash
cd lms-project/frontend

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start the app
npm start
```

Frontend runs at: http://localhost:3000

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/ | Register student |
| POST | /api/auth/login/ | Login |
| POST | /api/auth/guest-login/ | Guest access |
| POST | /api/auth/verify-email/ | Verify email OTP |
| POST | /api/auth/resend-otp/ | Resend OTP |
| POST | /api/auth/forgot-password/ | Send reset OTP |
| POST | /api/auth/reset-password/ | Reset password |
| GET | /api/auth/me/ | Get current user |

---

## 👤 User Roles

### Student
- Email format: `2024CS542@student.uet.edu.pk`
  - `2024` = year
  - `CS` = department code
  - `542` = roll number
- Must verify email via OTP after signup
- Registration number auto-extracted: `2024-CS-542`

### Teacher
- Added manually by admin via Django admin panel (`/admin`)
- Admin sets their initial password
- Teacher can change password via forgot password flow

### Admin
- Created via `python manage.py createsuperuser`
- Full access to Django admin panel
- Can add teacher emails and set their passwords

### Guest
- No account needed
- Redirected to empty homepage
- Can browse limited public content

---

## 🔐 OTP System (Development Mode)

Since this is not in production, OTPs are printed to the Django terminal instead of being emailed.

When a user:
1. **Signs up** → OTP printed for email verification
2. **Requests forgot password** → OTP printed for password reset

Look for this in your terminal:
```
============================================================
  📧 OTP for 2024CS542@student.uet.edu.pk
  Purpose: EMAIL VERIFICATION
  OTP Code: 847293
  Valid for: 10 minutes
============================================================
```

OTPs expire after **10 minutes**.

---

## 🔒 Password Rules

Passwords must contain:
- At least 8 characters
- One uppercase letter (A-Z)
- One lowercase letter (a-z)
- One digit (0-9)
- One special character (!@#$%^&*...)

---

## 🛠 Admin: Adding Teachers

1. Go to http://localhost:8000/admin
2. Log in with superuser credentials
3. Navigate to **Users → Custom Users**
4. Click **Add Custom User**
5. Fill in:
   - Email: `teacher@uet.edu.pk` (any email)
   - Username: choose one
   - Role: select **Teacher**
   - Password: set an initial password
   - Is Verified: ✅ check this
6. Click **Save**

Teacher can then use **Forgot Password** to set their own password.

---

## 🎨 Design Notes

- Color scheme: Dark forest green (`#1B4D3E`) + orange accent (`#F26522`)
- Fonts: Merriweather (headings) + DM Sans (body)
- Responsive: mobile-first, desktop has split illustration panel
- Illustration: Custom SVG of person balancing emoji-face balls
- Animations: Floating illustration, fade-slide page transitions

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, React Router v6 |
| Backend | Django 4.2, Django REST Framework |
| Auth | JWT (SimpleJWT) |
| Database | PostgreSQL |
| API Client | Axios |
