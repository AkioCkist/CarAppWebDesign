# OAuth Setup Guide

This application now supports Google and Facebook OAuth authentication in addition to phone/password login.

## Required Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Facebook OAuth Configuration  
FACEBOOK_CLIENT_ID="your-facebook-app-id-here"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret-here"
```

## Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create "OAuth 2.0 Client IDs"
5. Set the application type to "Web application"
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env` file

## Setting up Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add "Facebook Login" product to your app
4. In Facebook Login settings, add valid OAuth redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/facebook`
   - For production: `https://yourdomain.com/api/auth/callback/facebook`
5. Copy the App ID and App Secret to your `.env` file

## Features Implemented

✅ **Google OAuth Integration**
- Sign in with Google account
- Automatic user creation in database
- User data sync with existing system

✅ **Facebook OAuth Integration**  
- Sign in with Facebook account
- Automatic user creation in database
- User data sync with existing system

✅ **Hybrid Authentication System**
- Supports both OAuth and phone/password login
- Seamless user experience across login methods
- Cross-tab session synchronization

✅ **Database Schema Updates**
- Added OAuth provider fields to accounts table
- Email field for OAuth users
- Avatar URL storage
- Unique constraints for OAuth accounts

✅ **Enhanced UI**
- Modern OAuth buttons with proper branding
- Loading states and error handling
- Responsive design for all screen sizes

## How It Works

1. **OAuth Flow**: Users click Google/Facebook buttons → Redirected to provider → Authenticated → Redirected back with user data
2. **User Creation**: If user doesn't exist, automatically created in database with OAuth provider info
3. **Session Management**: Uses NextAuth.js for OAuth sessions, localStorage for phone/password sessions
4. **Cross-compatibility**: OAuth users and phone/password users can both access the same features

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/signin_registration`
3. Try both phone/password login and OAuth buttons
4. Verify user data appears in header dropdown
5. Test logout functionality for both auth methods

## Production Deployment

1. Update `NEXTAUTH_URL` in `.env` to your production domain
2. Add production callback URLs to Google and Facebook app settings
3. Ensure all environment variables are set in your hosting platform
4. Run database migrations: `npx prisma migrate deploy`

## Troubleshooting

- **OAuth buttons not working**: Check that client IDs and secrets are correctly set
- **Redirect URI mismatch**: Ensure OAuth app settings match your domain
- **Database errors**: Run `npx prisma migrate dev` to apply schema changes
- **Session issues**: Clear browser storage and localStorage if experiencing login problems
