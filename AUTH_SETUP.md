# Evans Peptides - Authentication Setup Guide

## Database Setup (Neon PostgreSQL)

### 1. Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`)

### 2. Run the Database Schema

1. In your Neon dashboard, go to the SQL Editor
2. Copy the contents of `database-schema.sql`
3. Paste and execute it in the SQL Editor
4. Verify that all tables were created successfully

### 3. Configure Environment Variables

#### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```bash
   DATABASE_URL=postgresql://your_username:your_password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=your_super_secret_random_key_here_make_it_very_long_and_random
   ```

3. Generate a secure JWT secret:
   - Visit: https://www.grc.com/passwords.htm
   - Copy one of the 63 random character passwords
   - Use it as your JWT_SECRET

#### For Netlify Deployment:

1. Go to your Netlify site dashboard
2. Navigate to: Site settings → Environment variables
3. Add the following variables:
   - `DATABASE_URL`: Your Neon connection string
   - `JWT_SECRET`: Your secure random string

### 4. Install Dependencies

```bash
npm install
```

This will install:
- `pg` - PostgreSQL client for Node.js
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token generation

### 5. Deploy Netlify Functions

The authentication system uses Netlify serverless functions located in `netlify/functions/`:

- `auth.js` - Handles login and registration
- `user.js` - Handles user profile operations  
- `cart.js` - Handles shopping cart operations
- `orders.js` - Handles order management

These functions will automatically be deployed when you push to Netlify.

## Features

### User Authentication
- ✅ User registration with email/password
- ✅ Secure password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Login/logout functionality
- ✅ Protected routes

### Account Management
- ✅ User profile page (`account.html`)
- ✅ Edit profile information
- ✅ View order history
- ✅ Save addresses

### Shopping Features
- ✅ Shopping cart with localStorage
- ✅ Add/remove items
- ✅ Quantity management
- ✅ Cart persistence across sessions

## File Structure

```
/
├── netlify/
│   ├── functions/
│   │   ├── auth.js          # Authentication endpoint
│   │   ├── user.js          # User profile endpoint
│   │   ├── cart.js          # Shopping cart endpoint
│   │   └── orders.js        # Orders endpoint
│   └── auth.js              # Frontend Auth class
├── account.html             # User account page
├── login.html               # Login page
├── register.html            # Registration page
├── order.html               # Shopping page
├── index.html               # Home page
├── navbar.js                # Shared navbar functionality
├── database-schema.sql      # Database table definitions
└── .env.example             # Example environment variables
```

## API Endpoints

### POST `/.netlify/functions/auth`

#### Register
```json
{
  "action": "register",
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-0100"
}
```

#### Login
```json
{
  "action": "login",
  "email": "user@example.com",
  "password": "securepassword"
}
```

### GET `/.netlify/functions/user`
Headers: `Authorization: Bearer <token>`

Returns user profile information

### POST `/.netlify/functions/user`
Headers: `Authorization: Bearer <token>`

```json
{
  "action": "update",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-0100"
}
```

### GET `/.netlify/functions/orders`
Headers: `Authorization: Bearer <token>`

Returns user's order history

## Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with 30-day expiration
- ✅ SQL injection protection via parameterized queries
- ✅ CORS headers configured
- ✅ Secure database connection with SSL

## Testing

### Local Development

1. Start the development server:
   ```bash
   npm run dev
   # or
   python3 -m http.server 8000
   ```

2. For testing Netlify functions locally:
   ```bash
   netlify dev
   ```

### Test User Flow

1. Visit `register.html`
2. Create a new account
3. Verify redirect to `account.html`
4. Test logout functionality
5. Visit `login.html` and sign back in
6. Test profile editing
7. Add items to cart on `order.html`
8. Verify cart persists after logout/login

## Troubleshooting

### "Address already in use" error
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Database connection errors
- Verify your `DATABASE_URL` is correct
- Check that your Neon database is active
- Ensure SSL mode is enabled in connection string

### JWT errors
- Make sure `JWT_SECRET` is set in environment variables
- Verify the secret is the same across all environments
- Check token hasn't expired (30 days)

### Authentication not working
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors
- Verify Netlify functions are deployed
- Check network tab for API responses

## Production Deployment

1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

Your authentication system will be live at your Netlify URL.

## Support

For issues or questions:
- Check the browser console for errors
- Review Netlify function logs
- Verify environment variables are set correctly
- Ensure database schema is properly created
