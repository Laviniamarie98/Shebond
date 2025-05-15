# SheBond Login System Instructions

This document provides instructions on how to use the SheBond login system with Supabase authentication.

## Overview

The SheBond app uses Supabase for authentication and user management. The login flow includes:

1. Sign up with email/password
2. Email verification (if enabled in Supabase)
3. Profile setup after first login
4. Authentication state management throughout the app

## URLs

- `/login` - Main login/signup page
- `/auth/callback` - OAuth callback page for email confirmation
- `/profile-setup` - Profile setup page (redirected after first login)

## How to Login

1. Navigate to the login page by clicking "Sign In" or "Sign Up" in the navbar
2. Enter your email and password
3. Click "Sign In"
4. If it's your first login, you'll be redirected to the profile setup page
5. If you've already completed your profile, you'll be redirected to the dashboard

## How to Sign Up

1. Navigate to the login page by clicking "Sign Up" in the navbar, or go to `/login?signup=true`
2. Enter your email and password (minimum 6 characters)
3. Click "Sign Up"
4. If email confirmation is enabled in Supabase:
   - You'll see a message asking you to check your email
   - Click the link in the email to verify your account
   - You'll be redirected to the callback page and then to profile setup
5. If email confirmation is disabled:
   - You'll be directly redirected to the profile setup page

## Profile Setup

After signing up, you'll need to complete your profile by providing:

1. Your full name
2. Pregnancy start date (optional, but required for pregnancy tracking features)

## Troubleshooting

If you're having issues with login:

1. **Can't log in**: Make sure you're using the correct email and password
2. **Didn't receive confirmation email**: Check your spam folder or try signing up again
3. **Reset password**: Use the "Forgot your password?" link on the login page
4. **Still having problems**: Clear your browser cache or try using incognito mode

## Database Schema

The authentication uses the following Supabase tables:

- `auth.users` - Managed by Supabase, contains authentication information
- `profiles` - Custom table linked to auth.users via foreign key, contains user profile information

## Required Environment Variables

Make sure the following environment variables are set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security

- All authentication is handled securely by Supabase
- Passwords are never stored in plain text
- JWT tokens are used for session management
- Row-level security (RLS) policies are implemented in the database to ensure users can only access their own data 