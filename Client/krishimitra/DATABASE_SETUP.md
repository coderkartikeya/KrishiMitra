# Database Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/krishimitra

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-long-and-random
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Application
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

## MongoDB Installation

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition:**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Ubuntu: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

2. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in your `.env.local` file

### Option 3: Docker

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use docker-compose
docker-compose up -d
```

## Database Structure

### User Model

The User model includes the following fields:

- **Authentication:**
  - `mobile` (String, required, unique) - 10-digit mobile number
  - `aadhaar` (String, required, unique) - 12-digit Aadhaar number
  - `pin` (String, required) - 4-digit PIN (hashed)

- **Location:**
  - `location.latitude` (Number, required)
  - `location.longitude` (Number, required)
  - `location.address` (String, optional)
  - `location.city` (String, optional)
  - `location.state` (String, optional)
  - `location.pincode` (String, optional)

- **Profile:**
  - `profile.firstName` (String, optional)
  - `profile.lastName` (String, optional)
  - `profile.email` (String, optional)
  - `profile.dateOfBirth` (Date, optional)
  - `profile.gender` (String, optional)
  - `profile.profilePicture` (String, optional)

- **Farm Information:**
  - `farm.farmName` (String, optional)
  - `farm.farmSize` (Number, optional) - in acres
  - `farm.crops` (Array, optional)
  - `farm.soilType` (String, optional)
  - `farm.irrigationType` (String, optional)

- **Security:**
  - `isVerified` (Boolean, default: false)
  - `isActive` (Boolean, default: true)
  - `loginAttempts` (Number, default: 0)
  - `lockUntil` (Date, optional)

- **Preferences:**
  - `preferences.language` (String, default: 'en')
  - `preferences.notifications` (Object)
  - `preferences.theme` (String, default: 'light')

## API Endpoints

### Authentication Routes

- `POST /api/auth/verify-mobile` - Verify mobile number and send OTP
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT tokens
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Security Features

- **Password Hashing:** PINs are hashed using bcryptjs
- **JWT Tokens:** Access and refresh tokens for session management
- **Cookies:** Secure HTTP-only cookies for token storage
- **Rate Limiting:** Account lockout after failed login attempts
- **Input Validation:** Comprehensive validation for all inputs

## Testing

### Test User Creation

```javascript
// Example test user data
const testUser = {
  mobile: "9876543210",
  aadhaar: "123456789012",
  pin: "1234",
  location: {
    latitude: 12.9716,
    longitude: 77.5946
  }
};
```

### API Testing

Use tools like Postman or curl to test the API endpoints:

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210",
    "aadhaar": "123456789012", 
    "pin": "1234",
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  }'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210",
    "pin": "1234"
  }'
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Check firewall settings

2. **JWT Secret Error:**
   - Ensure `JWT_SECRET` is set in `.env.local`
   - Use a long, random string for production

3. **Cookie Issues:**
   - Check if cookies are enabled in browser
   - Verify domain settings for production

### Development Tips

- Use MongoDB Compass for database visualization
- Enable MongoDB logs for debugging
- Use environment-specific configurations
- Test with different user scenarios
