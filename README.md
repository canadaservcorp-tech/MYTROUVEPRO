# myTROUVEpro Authentication System

## Files to Upload to GitHub

### New Files (Create these):
```
src/
├── context/
│   └── AuthContext.jsx       # User authentication state management
├── components/
│   ├── AuthModal.jsx         # Login/Signup modal
│   ├── UserMenu.jsx          # Dropdown menu for logged-in users
│   └── Header.jsx            # Updated header with auth buttons
├── pages/
│   ├── ProviderDashboard.jsx # Dashboard for service providers
│   ├── SeekerDashboard.jsx   # Dashboard for customers
│   └── ProfilePage.jsx       # User profile settings
```

## Integration Steps

### Step 1: Wrap App with AuthProvider

In your main `App.jsx`, wrap everything with AuthProvider:

```jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your existing app content */}
    </AuthProvider>
  );
}
```

### Step 2: Add Routes

Add these routes to your App.jsx:

```jsx
import ProviderDashboard from './pages/ProviderDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import ProfilePage from './pages/ProfilePage';

// Inside Routes:
<Route path="/dashboard" element={<ProviderDashboard />} />
<Route path="/my-dashboard" element={<SeekerDashboard />} />
<Route path="/profile" element={<ProfilePage />} />
```

### Step 3: Replace Header

Replace your existing Header component with the new one that includes auth buttons.

## Business Model Implemented

- ✅ FREE registration for all users
- ✅ Providers: 10% commission on bookings
- ✅ Seekers: Always FREE
- ✅ Contact info hidden until booking

## Features Included

1. **Sign In / Sign Up** buttons in header
2. **Role Selection**: Seeker or Provider
3. **Provider Registration** with:
   - Business name
   - Service category
   - Description
   - 10% commission notice
4. **Seeker Registration** (basic info)
5. **User Dashboards**:
   - Provider: Earnings, bookings, services
   - Seeker: Upcoming bookings, favorites
6. **Profile Settings** page
7. **User Menu** with role-specific options

## For Netlify Agent

Copy this prompt to add authentication:

```
Add user authentication system:
1. Import AuthProvider from context/AuthContext and wrap the app
2. Replace Header with new Header component that has Sign In / Join Free buttons
3. Add routes for /dashboard, /my-dashboard, /profile
4. Show different dashboards based on user role (provider vs seeker)
```
