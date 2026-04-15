# Nyay Setu Frontend - Quick Start Guide

## Getting Started in 5 Minutes

### Option 1: Using Python's Built-in Server (Easiest)

```bash
# Navigate to frontend directory
cd frontend

# Start Python server
python -m http.server 8000

# Open browser
# Visit: http://localhost:8000
```

### Option 2: Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Navigate to frontend directory
cd frontend

# Start server
http-server -p 8000 -o

# Opens automatically in browser at http://localhost:8000
```

### Option 3: Using Docker

```bash
# Build Docker image
docker build -t nyay-setu-frontend ./frontend

# Run container
docker run -p 3000:80 nyay-setu-frontend

# Visit: http://localhost:3000
```

### Option 4: Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Frontend available at http://localhost:3000
# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

## Configuration

### 1. Google Maps API Key

1. **Get API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project
   - Enable Maps JavaScript API, Places API, Geocoding API
   - Create API key
   - Restrict to website domain

2. **Configure in Frontend**:

   **Option A: Update HTML file directly**
   ```html
   <!-- In submit_fir.html, find the script tag and update: -->
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,geometry"></script>
   ```

   **Option B: Use environment variable**
   ```javascript
   // In js/maps-service.js, update:
   const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
   ```

### 2. API Configuration

1. **Update API Base URL**:
   ```javascript
   // In js/api-service.js, line ~7:
   const apiService = new APIService('http://localhost:8000/api');
   // Change to your Django backend URL
   ```

2. **Configure CORS** (in Django backend):
   ```python
   ALLOWED_HOSTS = ['localhost', 'yourdomain.com']
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://localhost:8000",
       "https://yourdomain.com"
   ]
   ```

### 3. Environment Variables

```bash
# Copy example file
cp frontend/.env.example frontend/.env

# Edit .env with your values
nano frontend/.env
```

## Project Structure

```
frontend/
├── index.html              # Landing page
├── login.html              # Login with 4 roles
├── register.html           # Registration process
├── forgot-password.html     # Password recovery
├── dashboard_citizen.html   # Citizen dashboard
├── dashboard_police.html    # Police officer dashboard
├── dashboard_senior.html    # Senior officer dashboard
├── dashboard_admin.html     # Admin dashboard
├── submit_fir.html         # FIR submission form
├── track_fir.html          # FIR tracking page
├── css/
│   └── style.css           # All styling (800+ lines)
├── js/
│   ├── api-service.js      # API client and utilities
│   └── maps-service.js     # Google Maps integration
├── images/                 # Place logos here
├── components/             # Reusable components (optional)
└── pages/                  # Additional pages (optional)
```

## Development Workflow

### 1. Make Changes
```bash
# Edit any HTML, CSS, or JS file
# Changes take effect on page refresh
```

### 2. Test Locally
```bash
# Open each page in browser and test
# Use browser DevTools (F12) for debugging
# Check Console for errors
```

### 3. Test with API
```bash
# Start Django backend
python manage.py runserver

# Test API calls by logging in
# Check Network tab for API requests
```

### 4. Prepare for Deployment
```bash
# Verify all API endpoints are correct
# Test on mobile devices (inspect responsive design)
# Check console for warnings
# Verify Google Maps displays correctly
```

## File Structure Explanation

### index.html
- **Purpose**: Landing page with hero, features, testimonials
- **SPA Routing**: Links to login, register pages
- **Interactive**: Contact form, form validation
- **API Integration**: Contact form submission

### Authentication Pages
- **login.html**: 4 role tabs (Citizen, Officer, Senior, Admin)
- **register.html**: 3-step registration (personal, password, OTP)
- **forgot-password.html**: Email → OTP → Reset password

### Role-Based Dashboards
- **dashboard_citizen.html**: FIR list, notifications, statistics
- **dashboard_police.html**: Assigned cases, priority filtering, status updates
- **dashboard_senior.html**: Escalation review, delayed cases, activity logs
- **dashboard_admin.html**: System analytics, user management, logs

### Business Logic Pages
- **submit_fir.html**: Form with Google Maps integration
- **track_fir.html**: Timeline visualization with escalation workflow

### JavaScript Modules

**api-service.js** (500+ lines)
- `APIService` class: All API endpoints (login, register, submit FIR, etc.)
- `AuthManager`: Login flow, token management, role checking
- `UIUtils`: Toast notifications, modals, form utilities
- `FormValidator`: Client-side validation
- `SessionManager`: 30-minute timeout with warning

**maps-service.js** (350+ lines)
- `MapsService` class: Map initialization, location detection
- Geolocation API wrapper
- Google Maps Places API integration
- Geocoding API wrapper
- Station detection and distance calculation

**style.css** (800+ lines)
- CSS variables for theming
- Responsive grid system (using Bootstrap 5)
- Animations and transitions
- Component styling (cards, modals, timeline)
- Dark mode ready

## Common Tasks

### Add New Page
1. Create new HTML file in frontend/
2. Include common header/footer
3. Link to js/api-service.js and js/maps-service.js
4. Update navigation in existing pages

### Add New API Endpoint
1. Add method to `APIService` class in js/api-service.js
   ```javascript
   async getMyData() {
       return this.request('GET', '/my-endpoint');
   }
   ```
2. Use in your page:
   ```javascript
   const data = await apiService.getMyData();
   ```

### Customize Styling
1. Edit CSS variables in css/style.css `:root` section
2. Colors, fonts, spacing are all customizable
3. Responsive breakpoints: 576px, 768px, 992px, 1200px

### Add Google Maps to New Page
```javascript
// Initialize Maps Service
const mapsService = new MapsService('YOUR_API_KEY');

// Use in your code
const location = await mapsService.getUserLocation();
mapsService.initializeMap('mapContainer', location);
```

## Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works between pages
- [ ] Forms validate input correctly
- [ ] API calls are being made (check Network tab)
- [ ] Responsive design works on mobile (test with DevTools)
- [ ] Google Maps displays and works correctly
- [ ] Login workflow works with test user
- [ ] Logout clears authentication
- [ ] Session timeout warning appears
- [ ] File uploads work (if configured)
- [ ] Timeline visualization displays correctly
- [ ] Modals open and close properly
- [ ] Toast notifications appear correctly

## Troubleshooting

### Issue: Google Maps not loading
**Solution**: 
- Check API key is correct in HTML
- Verify API key has Maps JavaScript API enabled
- Check browser console for errors
- Ensure API key is not restricted by IP

### Issue: API calls failing with 404
**Solution**:
- Check API base URL in js/api-service.js
- Verify Django backend is running
- Check CORS configuration in Django
- Look at Network tab for actual endpoint URLs

### Issue: Responsive design breaks on mobile
**Solution**:
- Force reload page (Ctrl+Shift+R)
- Check viewport meta tag in HTML `<head>`
- Test with actual mobile device
- Use Chrome DevTools mobile emulation

### Issue: Forms not submitting
**Solution**:
- Check form validation errors in console
- Verify API endpoint exists
- Check CORS headers
- Ensure all required fields are filled

### Issue: Session timeout not working
**Solution**:
- Check `SessionManager` is initialized
- Verify timeout values are correct (30 min default)
- Check browser cookie settings
- Look for console errors

## Performance Tips

1. **Minimize JavaScript**: Remove console.logs in production
2. **Compress Images**: Use JPG for photos, PNG for graphics, SVG for icons
3. **Cache Static Assets**: Set proper cache headers (handled by nginx.conf)
4. **Use CDN**: Deploy to CloudFront (see DEPLOYMENT.md)
5. **Lazy Load Maps**: Load Google Maps only when needed
6. **Debounce Events**: Form inputs are debounced
7. **Minify CSS/JS**: Can be done via build tool or manually

## Security Checklist

- [ ] Never commit API keys to Git
- [ ] Use HTTPS in production
- [ ] Validate user input on frontend and backend
- [ ] Implement CSRF protection
- [ ] Check X-Frame-Options header
- [ ] Use secure cookies (HttpOnly, Secure flags)
- [ ] Implement rate limiting on API
- [ ] Sanitize user-generated content
- [ ] Use Content Security Policy headers
- [ ] Regular security updates

## Next Steps

1. **Connect to Django Backend**: Update API base URL in js/api-service.js
2. **Deploy to AWS**: Follow DEPLOYMENT.md
3. **Add Real-Time Features**: Implement WebSocket for live notifications
4. **Mobile App**: Convert to React Native or Flutter
5. **Internationalization**: Add multi-language support
6. **Analytics**: Integrate Google Analytics or Sentry
7. **PWA**: Add service workers for offline support

## Need Help?

- Check console for JavaScript errors (F12)
- View Network tab for API calls
- Check mobile responsiveness (Chrome DevTools)
- Review code comments in js/ files
- Consult README.md for detailed documentation
- Check DEPLOYMENT.md for production setup

## Contact Support

For deployment or integration issues:
- Email: support@nyaysetu.gov.in
- Documentation: README.md, DEPLOYMENT.md
- API Docs: Check your Django backend documentation
