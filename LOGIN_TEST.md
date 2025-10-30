# Testing Login & Logout

## ✅ Your System Already Saves Email & Password!

Let me show you how to test it:

## Test Steps:

### 1️⃣ **Create Your Account**
1. Go to: http://localhost:8000/register.html
2. Fill in:
   - Email: `myemail@example.com`
   - Password: `mypassword123`
   - First Name: `John`
   - Last Name: `Doe`
3. Click "CREATE ACCOUNT"
4. ✅ You're now logged in and on the account page!

### 2️⃣ **Test Logout**
1. Click the **profile icon** in the top right
2. Click **"LOGOUT"**
3. ✅ You're logged out!

### 3️⃣ **Test Login Again**
1. Go to: http://localhost:8000/login.html
2. Enter:
   - Email: `myemail@example.com`
   - Password: `mypassword123`
3. Click "LOGIN"
4. ✅ You're logged back in!

### 4️⃣ **Your Account is Saved!**
- Your email and password are stored
- You can logout and login anytime
- Your profile info stays saved
- Your cart stays saved too!

## Where is Everything Stored?

Open your browser console (F12) and type:
```javascript
// See all saved users
localStorage.getItem('vitasyn_users')

// See if you're logged in
localStorage.getItem('vitasyn_token')

// See your current user info
localStorage.getItem('vitasyn_user')
```

## Common Questions:

**Q: Will my password be saved?**
✅ Yes! It's saved in your browser's localStorage

**Q: Can I login after I close the browser?**
✅ Yes! Your account stays saved

**Q: What if I forget my password?**
❌ Right now there's no password reset (we can add that later)
💡 For now, just register with a new email

**Q: Can I have multiple accounts?**
✅ Yes! Just use different email addresses

**Q: Is this secure?**
⚠️ For local testing: Yes, it's on your computer only
⚠️ For production: We'll use the Neon database with encrypted passwords

## Test Multiple Accounts:

Try creating a few different accounts:

**Account 1:**
- Email: `user1@test.com`
- Password: `password1`

**Account 2:**
- Email: `user2@test.com`
- Password: `password2`

Then test logging out and logging in with each one!

## Features You Can Test:

1. ✅ **Register** → Create account
2. ✅ **Auto-login** → Automatically logged in after registration
3. ✅ **View Profile** → See your info
4. ✅ **Edit Profile** → Change your details
5. ✅ **Logout** → Sign out (profile icon → logout)
6. ✅ **Login** → Sign back in with email/password
7. ✅ **Stay Logged In** → Refresh page, still logged in
8. ✅ **Multiple Accounts** → Create different users

## Quick Actions:

### See All Saved Users
Open browser console (F12) and paste:
```javascript
console.log('All Users:', JSON.parse(localStorage.getItem('vitasyn_users') || '[]'));
```

### Check If You're Logged In
```javascript
console.log('Logged In:', !!localStorage.getItem('vitasyn_token'));
console.log('Current User:', JSON.parse(localStorage.getItem('vitasyn_user')));
```

### Clear Everything (Start Fresh)
```javascript
localStorage.clear();
location.reload();
```

## Everything Works! 🎉

Your email and password ARE being saved. You can:
- ✅ Register once
- ✅ Logout
- ✅ Login again anytime
- ✅ Account stays saved even after closing browser
