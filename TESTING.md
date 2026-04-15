# Nyay Setu Frontend - Testing & QA Guide

## Testing Overview

This document provides comprehensive testing procedures for the Nyay Setu online FIR tracking system frontend.

## 1. Manual Testing

### 1.1 Landing Page (index.html)

#### Test Cases
- [ ] **TC-001**: Page loads without errors
  - **Steps**: Open index.html in browser
  - **Expected**: Page displays with hero section, features, testimonials

- [ ] **TC-002**: Navigation links work
  - **Steps**: Click "Get Started" button
  - **Expected**: Navigates to login.html

- [ ] **TC-003**: Contact form validation
  - **Steps**: Try submitting empty form
  - **Expected**: Validation error messages appear

- [ ] **TC-004**: Contact form submission
  - **Steps**: Fill form with valid data and submit
  - **Expected**: Success message, form clears

- [ ] **TC-005**: Responsive design (mobile)
  - **Steps**: Open DevTools (F12), resize to 375px width
  - **Expected**: Layout adapts, no horizontal scroll, readable text

- [ ] **TC-006**: Smooth scrolling
  - **Steps**: Click navigation links
  - **Expected**: Smooth scroll animation to sections

### 1.2 Login Page (login.html)

#### Test Cases - Citizen Role
- [ ] **TC-101**: Citizen tab selection
  - **Steps**: Click "Citizen" tab
  - **Expected**: Tab active, citizen login form displays

- [ ] **TC-102**: Empty field validation
  - **Steps**: Try submitting without entering credentials
  - **Expected**: Error messages for required fields

- [ ] **TC-103**: Invalid email validation
  - **Steps**: Enter invalid email format
  - **Expected**: Email validation error appears

- [ ] **TC-104**: Login attempt (mock)
  - **Steps**: Enter valid email and password
  - **Expected**: Loading spinner, redirected to citizen dashboard

- [ ] **TC-105**: Role redirect
  - **Steps**: Check localStorage after login
  - **Expected**: Token and role stored correctly

#### Test Cases - Police Officer Role
- [ ] **TC-111**: Officer tab selection
  - **Steps**: Click "Officer" tab
  - **Expected**: Officer login form with Officer ID field

- [ ] **TC-112**: Officer ID validation
  - **Steps**: Enter non-numeric Officer ID
  - **Expected**: Validation error message

- [ ] **TC-113**: Login redirect to officer dashboard
  - **Steps**: Complete login with valid officer credentials
  - **Expected**: Redirected to dashboard_police.html

#### Test Cases - Senior Officer Role
- [ ] **TC-121**: Senior Officer login
  - **Steps**: Complete login with senior officer ID
  - **Expected**: Redirected to dashboard_senior.html

#### Test Cases - Admin Role
- [ ] **TC-131**: Admin login
  - **Steps**: Complete login with admin credentials
  - **Expected**: Redirected to dashboard_admin.html

### 1.3 Registration Page (register.html)

#### Test Cases - Step 1: Personal Information
- [ ] **TC-201**: Form displays all fields
  - **Expected**: Name, Email, Phone, Address, City, State, Pincode, DOB fields visible

- [ ] **TC-202**: Email validation
  - **Steps**: Enter invalid email
  - **Expected**: Error message

- [ ] **TC-203**: Phone validation
  - **Steps**: Enter non-numeric phone
  - **Expected**: Error message

- [ ] **TC-204**: Pincode validation
  - **Steps**: Enter non-numeric pincode
  - **Expected**: Error message

- [ ] **TC-205**: Mandatory field check
  - **Steps**: Try proceeding with empty field
  - **Expected**: Cannot proceed, error message

#### Test Cases - Step 2: Password
- [ ] **TC-211**: Password strength indicator
  - **Steps**: Enter 'abc'
  - **Expected**: "Weak" indicator, red color

- [ ] **TC-212**: Password strength medium
  - **Steps**: Enter 'Abc123'
  - **Expected**: "Medium" indicator, yellow color

- [ ] **TC-213**: Password strength strong
  - **Steps**: Enter 'Abc123!@#'
  - **Expected**: "Strong" indicator, green color

- [ ] **TC-214**: Password mismatch
  - **Steps**: Enter different password and confirmation
  - **Expected**: Mismatch error message

#### Test Cases - Step 3: OTP
- [ ] **TC-221**: OTP input format
  - **Steps**: Try entering non-numeric characters
  - **Expected**: Only numeric input accepted

- [ ] **TC-222**: Auto-focus between fields
  - **Steps**: Enter digit in first field
  - **Expected**: Focus moves to next field automatically

- [ ] **TC-223**: OTP validation
  - **Steps**: Enter valid OTP (mock)
  - **Expected**: Account created, redirect to login

- [ ] **TC-224**: Resend OTP
  - **Steps**: Click "Resend" button
  - **Expected**: New OTP sent message

### 1.4 Forgot Password Page (forgot-password.html)

#### Test Cases - Step 1: Email
- [ ] **TC-301**: Email validation
  - **Expected**: Invalid email shows error

- [ ] **TC-302**: Email submission
  - **Steps**: Enter valid email
  - **Expected**: Proceed to OTP step

#### Test Cases - Step 2: OTP
- [ ] **TC-311**: OTP verification
  - **Steps**: Enter received OTP
  - **Expected**: Proceed to password reset

#### Test Cases - Step 3: Reset Password
- [ ] **TC-321**: Password strength check
  - **Expected**: Strong password required

- [ ] **TC-322**: Password confirmation
  - **Expected**: Passwords must match

- [ ] **TC-323**: Success redirect
  - **Steps**: Complete password reset
  - **Expected**: Redirect to login with success message

### 1.5 Citizen Dashboard (dashboard_citizen.html)

#### Test Cases
- [ ] **TC-401**: Dashboard loads with user data
  - **Expected**: Statistics display, FIR list shows

- [ ] **TC-402**: FIR statistics accuracy
  - **Expected**: Total, active, resolved, escalated counts correct

- [ ] **TC-403**: FIR list display
  - **Expected**: All FIRs listed with status, date, priority

- [ ] **TC-404**: FIR filters work
  - **Steps**: Filter by status
  - **Expected**: List updates with selected status

- [ ] **TC-405**: FIR detail modal
  - **Steps**: Click on FIR card
  - **Expected**: Modal opens with full FIR details

- [ ] **TC-406**: Submit FIR button
  - **Steps**: Click "Submit New FIR"
  - **Expected**: Navigate to submit_fir.html

- [ ] **TC-407**: Profile modal
  - **Steps**: Click profile icon
  - **Expected**: Profile modal with user details, password change option

- [ ] **TC-408**: Notification panel
  - **Steps**: Check notification area
  - **Expected**: Notifications display with sender, type, time

- [ ] **TC-409**: Session timeout warning
  - **Steps**: Idle for 25 minutes (or wait in test)
  - **Expected**: Warning modal appears

- [ ] **TC-410**: Escalate FIR
  - **Steps**: Click escalate on FIR
  - **Expected**: Escalation form modal appears, submission redirects

### 1.6 Submit FIR Page (submit_fir.html)

#### Test Cases - Location
- [ ] **TC-501**: Get current location
  - **Steps**: Click "Detect Location" button
  - **Expected**: Browser requests permission, location updates

- [ ] **TC-502**: Address autocomplete
  - **Steps**: Type address in autocomplete
  - **Expected**: Dropdown suggestions appear

- [ ] **TC-503**: Location on map
  - **Steps**: Complete location selection
  - **Expected**: Map shows location, marker placed

#### Test Cases - Police Station
- [ ] **TC-511**: Station list displays
  - **Expected**: Nearby stations show with distance

- [ ] **TC-512**: Station selection
  - **Steps**: Click station
  - **Expected**: Station selected (highlighted), marker added

- [ ] **TC-513**: Distance calculation
  - **Expected**: Distances calculated correctly

#### Test Cases - Evidence Upload
- [ ] **TC-521**: Drag and drop upload
  - **Steps**: Drag file to upload area
  - **Expected**: File added to list

- [ ] **TC-522**: File type validation
  - **Steps**: Try uploading unsupported file type
  - **Expected**: Error message

- [ ] **TC-523**: File size validation
  - **Steps**: Try uploading 100MB file
  - **Expected**: Error message (max 50MB)

- [ ] **TC-524**: File count limit
  - **Steps**: Try uploading 11 files
  - **Expected**: Error message (max 10 files)

- [ ] **TC-525**: File preview
  - **Steps**: Upload image
  - **Expected**: Thumbnail preview displays

#### Test Cases - Form Submission
- [ ] **TC-531**: Crime type required
  - **Steps**: Try submitting without crime type
  - **Expected**: Validation error

- [ ] **TC-532**: Description required
  - **Steps**: Try submitting without description
  - **Expected**: Validation error

- [ ] **TC-533**: Checkbox validation
  - **Steps**: Try submitting without checking agreements
  - **Expected**: Cannot submit, error message

- [ ] **TC-534**: Successful submission
  - **Steps**: Complete form and submit
  - **Expected**: Success modal with Case ID

### 1.7 Track FIR Page (track_fir.html)

#### Test Cases
- [ ] **TC-601**: FIR details load
  - **Expected**: Case ID, incident date, location, station display

- [ ] **TC-602**: Timeline displays
  - **Expected**: 6-step timeline visible (submitted, investigation, etc.)

- [ ] **TC-603**: Active status indicator
  - **Steps**: Check current step
  - **Expected**: Current step highlighted clearly

- [ ] **TC-604**: Evidence section
  - **Expected**: All evidence files listed with dates

- [ ] **TC-605**: Officer updates
  - **Expected**: Updates displayed with officer name and timestamp

- [ ] **TC-606**: Share functionality
  - **Steps**: Click share button
  - **Expected**: Share dialog opens (or fallback)

- [ ] **TC-607**: Print functionality
  - **Steps**: Click print button
  - **Expected**: Print dialog opens with formatted content

- [ ] **TC-608**: Escalation status
  - **Steps**: Check escalated case
  - **Expected**: Escalation alert/badge visible

- [ ] **TC-609**: Auto-refresh
  - **Steps**: Wait 30 seconds
  - **Expected**: Page refreshes with updated data

### 1.8 Police Officer Dashboard (dashboard_police.html)

#### Test Cases
- [ ] **TC-701**: Assigned cases load
  - **Expected**: Cases list displays with all columns

- [ ] **TC-702**: Priority filtering
  - **Steps**: Filter by "High" priority
  - **Expected**: Only high priority cases display

- [ ] **TC-703**: Status filter
  - **Steps**: Filter by "Active" status
  - **Expected**: Only active cases display

- [ ] **TC-704**: Search functionality
  - **Steps**: Search by case ID
  - **Expected**: Matching cases display

- [ ] **TC-705**: Status update form
  - **Steps**: Click status update on case
  - **Expected**: Form modal appears

- [ ] **TC-706**: Status update submission
  - **Steps**: Update status with notes
  - **Expected**: Success message, case status updates

- [ ] **TC-707**: Priority indicator colors
  - **Expected**: High=red, Medium=yellow, Low=green

### 1.9 Senior Officer Dashboard (dashboard_senior.html)

#### Test Cases - Escalations Tab
- [ ] **TC-801**: Escalations load
  - **Expected**: Escalated cases list with reason displayed

- [ ] **TC-802**: Approve escalation
  - **Steps**: Click approve on escalation
  - **Expected**: Modal for approval documentation

- [ ] **TC-803**: Reject escalation
  - **Steps**: Click reject on escalation
  - **Expected**: Modal for rejection reason

- [ ] **TC-804**: Reassign case
  - **Steps**: Click reassign option
  - **Expected**: Officer selection dropdown appears

#### Test Cases - Delayed Investigations Tab
- [ ] **TC-811**: Delayed cases display
  - **Expected**: Cases inactive for >5 days listed

- [ ] **TC-812**: Days inactive calculation
  - **Expected**: Correct inactive days calculated

- [ ] **TC-813**: Request explanation
  - **Steps**: Click request explanation on delayed case
  - **Expected**: Officer receives notification

#### Test Cases - Activity Logs Tab
- [ ] **TC-821**: Logs display all activities
  - **Expected**: Officer actions logged with timestamp

- [ ] **TC-822**: Log filtering by officer
  - **Steps**: Filter by officer name
  - **Expected**: Only that officer's activities display

### 1.10 Admin Dashboard (dashboard_admin.html)

#### Test Cases - Analytics
- [ ] **TC-901**: Statistics display
  - **Expected**: All 6 analytics cards show data

- [ ] **TC-902**: Chart placeholders
  - **Expected**: Chart areas visible with labels

#### Test Cases - User Management
- [ ] **TC-911**: User list loads
  - **Expected**: All users display with role, status, joined date

- [ ] **TC-912**: Add user
  - **Steps**: Click add user button
  - **Expected**: Form modal appears

- [ ] **TC-913**: Edit user
  - **Steps**: Click edit on user
  - **Expected**: Edit form modal appears

- [ ] **TC-914**: Delete user
  - **Steps**: Click delete on user
  - **Expected**: Confirmation modal, user removed

- [ ] **TC-915**: Role badge display
  - **Expected**: Different colors for different roles

#### Test Cases - Police Stations
- [ ] **TC-921**: Station list loads
  - **Expected**: All stations with location, officer count, cases

- [ ] **TC-922**: Add station
  - **Steps**: Click add station button
  - **Expected**: Form modal appears

- [ ] **TC-923**: Edit station
  - **Expected**: Edit form modal appears

- [ ] **TC-924**: Delete station
  - **Expected**: Confirmation modal, station removed

#### Test Cases - System Logs
- [ ] **TC-931**: Logs display
  - **Expected**: Timestamped log entries visible

- [ ] **TC-932**: Log filtering
  - **Steps**: Filter by user or action
  - **Expected**: Logs updated

## 2. Responsive Design Testing

### Device Testing Matrix

#### Mobile (375px - 576px)
- [ ] iPhone SE (375x667)
- [ ] iPhone 12 (390x844)
- [ ] Pixel 5 (393x851)

#### Tablet (576px - 992px)
- [ ] iPad (768x1024)
- [ ] iPad Pro (1024x1366)

#### Desktop (992px+)
- [ ] 1366x768
- [ ] 1920x1080
- [ ] 2560x1440

### Responsive Testing Checklist
- [ ] No horizontal scrolling
- [ ] Touch targets minimum 44x44 pixels
- [ ] Text readable without zoom
- [ ] Images scale appropriately
- [ ] Modals adapt to screen size
- [ ] Navigation responsive (hamburger on mobile)
- [ ] Sidebar collapses on mobile

## 3. Browser Compatibility Testing

### Desktop Browsers
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Testing Checklist
- [ ] Page loads completely
- [ ] JavaScript executes without errors
- [ ] CSS renders correctly
- [ ] Form submission works
- [ ] Maps display properly
- [ ] File uploads work
- [ ] Modals function correctly

## 4. Performance Testing

### Load Time Benchmarks
- [ ] First Contentful Paint (FCP): < 1.5s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Time to Interactive (TTI): < 3.5s

### Testing Tools
```bash
# Using Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Select "Mobile" or "Desktop"
# 4. Run audit

# Using Google PageSpeed Insights
# Visit: https://pagespeed.web.dev/
# Enter website URL
# Review recommendations
```

### Performance Checklist
- [ ] LCP image optimized (lazy load)
- [ ] CSS critical path optimized
- [ ] JavaScript minified
- [ ] Images compressed
- [ ] No render-blocking resources
- [ ] Unused CSS removed
- [ ] HTTP/2 enabled

## 5. Security Testing

### Security Checklist
- [ ] **HTTPS**: All traffic encrypted
  - [ ] Redirect HTTP → HTTPS
  - [ ] HSTS header present
  
- **API Security**:
  - [ ] JWT tokens validated
  - [ ] Token expiration enforced
  - [ ] CORS headers correct
  - [ ] API rate limiting works
  
- **XSS Protection**:
  - [ ] Input validation on forms
  - [ ] Output encoding in templates
  - [ ] CSP headers present
  - [ ] No inline scripts
  
- **CSRF Protection**:
  - [ ] CSRF tokens on forms
  - [ ] SameSite cookie attribute
  - [ ] POST requests protected
  
- **Data Protection**:
  - [ ] Passwords never logged
  - [ ] Sensitive data in localStorage (not exposed)
  - [ ] File uploads validated
  - [ ] Error messages don't leak info

### Security Testing Tools
```bash
# Browser DevTools Security
# 1. F12 → Security tab
# 2. Check certificate validity
# 3. Review mixed content warnings

# Content Security Policy testing
# Check headers in Network tab
```

## 6. API Integration Testing

### Mock API Testing
```javascript
// Test without backend:
// 1. Use browser DevTools mock responses
// 2. Modify localStorage for test data
// 3. Mock fetch responses in console

// Example mock API:
window.apiService.setMockMode(true);
```

### Real API Testing
- [ ] Login endpoint returns token
- [ ] FIR submission returns case ID
- [ ] FIR retrieval returns correct data
- [ ] Status update persists correctly
- [ ] Escalation workflow completes
- [ ] Notifications load correctly
- [ ] File uploads process correctly
- [ ] Session timeout triggers correctly

## 7. Accessibility Testing

### WCAG 2.1 AA Compliance
- [ ] **Perceivable**:
  - [ ] Color not sole means of info
  - [ ] Text contrast ratio ≥ 4.5:1
  - [ ] Images have alt text
  - [ ] Videos have captions
  
- **Operable**:
  - [ ] Keyboard navigation works
  - [ ] Tab order logical
  - [ ] No keyboard traps
  - [ ] Touch targets ≥ 44x44px
  
- **Understandable**:
  - [ ] Page language defined
  - [ ] Form labels clear
  - [ ] Error messages helpful
  - [ ] Instructions provided
  
- **Robust**:
  - [ ] Valid HTML (no errors)
  - [ ] ARIA labels correct
  - [ ] Screen reader compatible

### Testing Tools
```bash
# Browser extensions:
# - axe DevTools
# - WAVE
# - Lighthouse (Accessibility)

# Online tools:
# - https://www.tpgi.com/arc-platform/

# Screen readers:
# - NVDA (Windows, free)
# - JAWS (Windows, paid)
# - VoiceOver (Mac, built-in)
```

## 8. Regression Testing

### Pre-Deployment Checklist
- [ ] All pages load without errors
- [ ] No console errors or warnings
- [ ] All links work correctly
- [ ] All forms submit successfully
- [ ] Navigation between pages works
- [ ] Authentication flow complete
- [ ] Role-based access correct
- [ ] FIR submission workflow complete
- [ ] FIR tracking displays correctly
- [ ] Dashboard data accurate
- [ ] Mobile responsive design works
- [ ] Maps display and function correctly
- [ ] File uploads work
- [ ] Session management works
- [ ] Logout clears data

## 9. Test Results Documentation

### Test Case Template
```markdown
## Test Case: TC-XXX

**Title**: [Brief description]

**Preconditions**: 
- Logged in as [role]
- Data: [test data needed]

**Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**:
- [Expected outcome]

**Actual Result**:
- [What actually happened]

**Status**: ✅ PASS / ❌ FAIL

**Notes**: [Any additional information]
```

### Test Report Structure
```
Test Report: v1.0.0
Date: YYYY-MM-DD
Tester: [Name]

Summary:
- Total Test Cases: XXX
- Passed: XXX
- Failed: XXX
- Skipped: XXX

Critical Issues:
- [List critical failures]

Minor Issues:
- [List minor failures]

Recommendations:
- [Recommendations for fixes]
```

## 10. Continuous Testing

### Automated Testing Setup
```bash
# Unit testing with Jest (if added)
npm test

# E2E testing with Cypress (if added)
npx cypress run
```

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
```

## Conclusion

This comprehensive testing guide ensures the Nyay Setu frontend meets quality standards. Execute these test cases before each deployment to maintain reliability and user satisfaction.

For questions or issues during testing, refer to QUICKSTART.md or README.md.
