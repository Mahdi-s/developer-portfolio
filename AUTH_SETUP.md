# Authentication Setup Guide

This guide will help you set up the email-based authentication system for the admin panel.

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
 
# Email Configuration (Gmail example)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Admin Configuration
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

## Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
   - Use this password in `EMAIL_SERVER_PASSWORD`

## Security Configuration

1. **NEXTAUTH_SECRET**: Generate a random secret key:
   ```bash
   openssl rand -base64 32
   ```

2. **ADMIN_EMAILS**: Add comma-separated email addresses that should have admin access

## Testing the System

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin`

3. Enter an authorized email address

4. Check your email for the verification code

5. Enter the code to access the admin dashboard

## Features

- ✅ Passwordless email authentication
- ✅ Secure verification codes (6-digit, 10-minute expiry)
- ✅ Protected admin routes with middleware
- ✅ Session management with NextAuth.js
- ✅ Responsive UI with loading states
- ✅ Email whitelist for admin access

## Routes

- `/admin` - Login page
- `/admin/dashboard` - Protected admin dashboard
- `/admin/verify` - Email verification confirmation page

## API Endpoints

- `POST /api/auth/send-code` - Send verification code
- `POST /api/auth/verify-code` - Verify code and email
- `/api/auth/[...nextauth]` - NextAuth.js endpoints

## Security Notes

- Verification codes expire after 10 minutes
- Only whitelisted emails can access admin features
- Sessions are managed securely by NextAuth.js
- Middleware protects admin routes from unauthorized access
