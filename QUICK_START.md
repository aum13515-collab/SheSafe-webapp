# SheSafe - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 16+ installed
- npm installed
- Port 5173 and 3000 available

### Installation

1. **Navigate to project:**
   ```bash
   cd d:\SheSafe_WebApp
   ```

2. **Start development:**
   ```bash
   npm run dev:all
   ```

3. **Open in browser:**
   - **PC:** http://localhost:5173
   - **Mobile:** http://192.168.43.153:5173 (on same WiFi)

---

## 👤 User Flow

### 1. Create Account
- Click "Register here"
- Fill: Name, Username, Phone (10-digit Indian), Password
- Click "Create Account"
- ✅ Logged in automatically

### 2. Add Emergency Contact
- Go to **Contacts** tab
- Click **+ Add Contact**
- Enter: Contact Name, Phone Number
- Click **Add Contact**
- ✅ Contact saved

### 3. Configure SMS
- Go to **Settings** tab
- Paste Fast2SMS API key
- Click **Save Settings**
- ✅ SMS ready

### 4. Trigger Alert
- Go to **Home** tab
- **HOLD** SOS button 2 seconds
- Confirm in dialog
- ✅ Alert sent with location to all contacts

---

## 🛡️ Admin Access

**Credentials:**
- Username: `admin`
- Password: `admin123`

**Features:**
- View all users
- View/manage emergency contacts
- Delete users
- See alert statistics
- Search users by name, phone, username

---

## 📊 Test Data

### Pre-created User
```
Name: Priya Sharma
Username: priya123
Phone: 9876543210
Password: test123
```

### Pre-created Contact
```
Name: Mom
Phone: 9123456789
```

---

## 🔧 Configuration

### Fast2SMS API
1. Visit: https://fast2sms.com
2. Sign up with Indian mobile number
3. Go to Dev API → Copy API Key
4. Paste in SheSafe Settings
5. Click "Send Test SMS"

### ESP8266 Device (Optional)
1. Flash `arduino/shesafe_button.ino` to NodeMCU
2. Update WiFi SSID/password in code
3. Update SERVER_IP to your PC IP
4. Device will auto-connect and poll for alerts

---

## 📱 Mobile Testing

### On Android
1. Open http://192.168.43.153:5173 in Chrome
2. Click menu → "Install app"
3. Opens as standalone app
4. Full screen, no browser UI

### On iPhone
1. Open http://192.168.43.153:5173 in Safari
2. Tap Share → "Add to Home Screen"
3. Opens as standalone app
4. Full screen experience

---

## 🧪 Test Scenarios

### Scenario 1: SOS Alert
1. Register new account
2. Add 1+ emergency contact
3. Go to Settings, add Fast2SMS API key
4. Main page: All indicators should be 🟢
5. Hold SOS button, confirm alert
6. Check Settings → Alert History

### Scenario 2: Admin Dashboard
1. Click "Admin Login" on login page
2. Username: admin, Password: admin123
3. View system statistics
4. Search for users
5. Click "Contacts" to see emergency contacts
6. User count should show 1+

### Scenario 3: Offline Mode
1. Close internet/WiFi
2. App still loads from PWA cache
3. Can still view contacts, settings, history
4. SOS alert queued (ready to send when online)

---

## 🐛 Troubleshooting

### "Port 5173 in use"
```bash
npm run dev -- --port 5174
```

### "Port 3000 in use"
```bash
npm run server
```
Edit `server/index.js`, change `const PORT = 3001`

### "Phone validation failing"
- Must be 10 digits
- Must start with 6, 7, 8, or 9
- No spaces/dashes (auto-removed)

### "SMS not sending"
- Check API key in Settings
- Ensure Fast2SMS account has credits
- Verify phone numbers are 10-digit Indian format
- Check network connection

### "Device shows offline"
- Ensure server running on port 3000
- Check ESP IP in Settings
- Verify WiFi connection if using ESP8266

---

## 📁 Project Structure

```
SheSafe_WebApp/
├── public/          # PWA manifest
├── server/          # Express backend
├── src/
│   ├── pages/       # 6 full pages
│   ├── components/  # 4 reusable components
│   ├── services/    # 5 service modules
│   ├── context/     # Auth & Alert context
│   ├── types/       # TypeScript interfaces
│   └── utils/       # Phone validation, constants
├── arduino/         # ESP8266 firmware
└── package.json     # Dependencies
```

---

## 🔐 Security Notes

- **Passwords:** Hashed with btoa (client-side)
- **Data:** All in localStorage (no server-side storage)
- **API Key:** Never shared or logged
- **Geolocation:** Only collected when SOS triggered
- **CORS:** Enabled for device communication

---

## 📈 Monitoring

### Server Logs
Console shows:
- ✓ Device alerts received
- ✓ SMS API calls
- ✓ Device polling status
- ✓ Connection errors

### Client Logs
Browser console shows:
- ✓ Auth state changes
- ✓ Alert triggers
- ✓ Location updates
- ✓ Storage operations

---

## 🎯 Next Steps

1. **Production Deployment**
   - Deploy frontend to Netlify/Vercel
   - Deploy backend to Render/Railway
   - Use HTTPS everywhere
   - Add database for persistent storage

2. **Feature Expansion**
   - Audio/vibration on alert
   - SMS templates
   - Multiple alert levels
   - Scheduled safety check-ins
   - Community features

3. **Compliance**
   - GDPR compliance
   - India data localization
   - Security audit
   - Accessibility (WCAG)

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review TESTING_REPORT.md
3. Check README.md for detailed docs
4. Verify all npm packages installed

---

## ✅ Checklist for Production

- [ ] HTTPS certificate acquired
- [ ] Database setup (MongoDB/PostgreSQL)
- [ ] Email service integrated
- [ ] SMS quotas set
- [ ] Analytics configured
- [ ] Error tracking (Sentry)
- [ ] CDN configured
- [ ] Backup system in place
- [ ] Security audit complete
- [ ] Load testing done
- [ ] User documentation ready
- [ ] Support team trained
- [ ] Legal review completed
- [ ] Privacy policy updated
- [ ] Go-live date announced

---

**Ready to save lives! 🚨**

SheSafe v1.0.0 - April 2026
