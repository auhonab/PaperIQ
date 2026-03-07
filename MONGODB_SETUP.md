# MongoDB Setup Guide for PaperIQ

## Overview
PaperIQ now uses MongoDB to store user data, authentication, and paper metadata.

## Database Structure

### Collections:

1. **users**
   - `name`: String (required)
   - `email`: String (required, unique, lowercase)
   - `password`: String (hashed with bcrypt)
   - `createdAt`: Date
   - `lastLogin`: Date

2. **papers**
   - `userId`: ObjectId (reference to User)
   - `fileName`: String (required)
   - `fileSize`: Number
   - `uploadedAt`: Date
   - `elifCount`: Number (default: 0)
   - `scholarSightCount`: Number (default: 0)
   - `chatMessageCount`: Number (default: 0)
   - `lastAccessed`: Date

## Setup Instructions

### Option 1: Local MongoDB (Development)

1. **Install MongoDB locally:**
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB service
   brew services start mongodb-community
   ```

2. **Update .env.local:**
   ```
   MONGODB_URI=mongodb://localhost:27017/paperiq
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create a free MongoDB Atlas account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Create a new cluster (M0 Free tier)

2. **Get your connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `paperiq`

3. **Update .env.local:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/paperiq?retryWrites=true&w=majority
   ```

4. **Whitelist your IP address:**
   - In MongoDB Atlas, go to Network Access
   - Add your current IP address or use `0.0.0.0/0` for all IPs (development only)

## API Endpoints

### Authentication

**POST** `/api/auth/register`
- Body: `{ name, email, password }`
- Returns: `{ success: true, user: { id, name, email } }`

**POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: `{ success: true, user: { id, name, email } }`

### Papers Management

**POST** `/api/papers`
- Body: `{ userId, fileName, fileSize }`
- Returns: `{ success: true, paper: { id, fileName, uploadedAt } }`

**GET** `/api/papers?userId=<userId>`
- Returns: `{ success: true, papers: [...] }`

**PATCH** `/api/papers`
- Body: `{ paperId, analysisType: 'elif' | 'scholarsight' | 'chat' }`
- Returns: `{ success: true, paper: { id, counts... } }`

## User Flow

1. **Registration:**
   - User fills registration form
   - POST to `/api/auth/register`
   - User data saved to MongoDB
   - User redirected to dashboard

2. **Login:**
   - User enters credentials
   - POST to `/api/auth/login`
   - Credentials validated against MongoDB
   - User redirected to dashboard

3. **Dashboard:**
   - Displays user's name and email from context
   - Shows real-time statistics

## Security Notes

- Passwords are hashed using bcrypt (10 rounds)
- Never store plain text passwords
- Keep your MONGODB_URI secret
- Don't commit `.env.local` to git

## Testing

1. **Test registration:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

2. **Test login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## Troubleshooting

**Error: "Please define the MONGODB_URI environment variable"**
- Make sure `.env.local` exists and contains `MONGODB_URI`
- Restart your Next.js development server

**Connection timeout:**
- Check if MongoDB service is running (local)
- Verify IP whitelist in MongoDB Atlas
- Check connection string format

**Duplicate key error:**
- Email already registered
- Try a different email address
