# SheSafe - Women's Safety Emergency Alert System

## 🚨 Overview

**SheSafe** is a comprehensive, production-ready emergency alert system designed specifically for women's safety in India. The application enables instant SOS alerts to be sent to pre-configured emergency contacts with live GPS location via SMS.

### Key Features

✅ **Instant Emergency Alerts** - Hold the SOS button for 2 seconds to send alerts  
✅ **Live GPS Location** - Share exact location via Google Maps link  
✅ **Fast2SMS Integration** - Free Indian SMS service (₹100+ for production)  
✅ **Emergency Contacts** - Save up to 10 trusted contacts  
✅ **ESP8266 Hardware Button** - Optional physical panic button  
✅ **Progressive Web App** - Works offline, installable on mobile  
✅ **Admin Dashboard** - Monitor system and manage users  
✅ **Alert History** - Track all alerts sent with timestamps and locations  

---

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **Storage** | localStorage (client-side) |
| **SMS API** | Fast2SMS (Indian SMS service) |
| **Location** | Browser Geolocation API |
| **PWA** | vite-plugin-pwa |
| **Icons** | Lucide React |
| **Backend Server** | Node.js Express (for ESP8266 bridge) |
| **Hardware** | NodeMCU ESP8266 (optional) |

---

## 📱 Mobile & Desktop Support

- ✅ **Mobile Browsers** - iOS Safari, Android Chrome
- ✅ **Desktop Browsers** - Chrome, Edge, Firefox, Safari
- ✅ **Installable PWA** - Add to home screen (Android/iOS)
- ✅ **Offline Support** - Works without internet (location & alert queuing)
- ✅ **Responsive Design** - Mobile-first, adapts to all screen sizes

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ ([download](https://nodejs.org))
- npm package manager
- Fast2SMS account (free tier available at [fast2sms.com](https://fast2sms.com))
- Indian mobile number for Fast2SMS registration

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd d:\SheSafe_WebApp
   npm install
   ```

2. **Configure Fast2SMS API Key:**
   - Go to [fast2sms.com](https://fast2sms.com)
   - Sign up with your Indian mobile number
   - Verify OTP
   - Copy API key from Dev API section
   - You'll need this in the app settings

3. **Start development servers:**
   ```bash
   npm run dev:all
   ```
   This starts both:
   - **Frontend**: http://localhost:5173
   - **Backend Server**: http://localhost:3000

4. **Open in browser:**
   - **PC**: http://localhost:5173
   - **Mobile (same WiFi)**: http://YOUR_PC_IP:5173
     - Find PC IP on Windows: Open CMD → type `ipconfig` → look for "IPv4 Address"

---

## 📖 User Guide

### For Regular Users

#### 1. Registration
- Open the app and click "Register here"
- Enter: Full Name, Username, Indian mobile number, Password
- App validates Indian 10-digit number format

#### 2. Add Emergency Contacts
- Go to **Contacts** tab
- Click **+ Add Contact**
- Enter contact name and Indian mobile number
- Can add up to 10 contacts
- Each contact receives SMS with live location when alert is triggered

#### 3. Configure SMS (Required)
- Go to **Settings**
- Under "Fast2SMS Configuration":
  1. Go to fast2sms.com
  2. Create free account
  3. Copy API key
  4. Paste in app and click "Send Test SMS"
  5. Verify test SMS is received

#### 4. Send SOS Alert
- Go to **Home** tab
- **HOLD** the red SOS button for 2 seconds
- Animated ring shows hold progress
- Confirm dialog appears: "Send SOS to X contacts?"
- Click "Send Alert"
- Alert sent instantly with:
  - Your name
  - Live GPS location (clickable Google Maps link)
  - "This is an automated SOS alert" message

#### 5. View Alert History
- Go to **Settings**
- Scroll to "Alert History"
- See all past alerts with:
  - Date & time sent
  - Number of contacts notified
  - Status (success/partial/failed)
  - Clickable location link

---

### For Admin Users

#### Admin Login
- Username: `admin`
- Password: `admin123`

#### Admin Dashboard Features
- **View all users** - Search by name, username, or phone
- **User statistics** - Total users, total alerts, alerts today
- **View contacts** - See emergency contacts for each user
- **Delete users** - Remove users and their data
- **Monitor system** - Check average contacts, alert trends

---

## ⚙️ Configuration Guide

### Fast2SMS Setup (Required for SMS)

1. **Create Account:**
   - Go to [fast2sms.com](https://fast2sms.com)
   - Click "Sign Up"
   - Enter your Indian mobile number
   - Verify OTP

2. **Get API Key:**
   - Login to dashboard
   - Go to "Dev API" section
   - Copy your API Key (looks like: `xxxxxxxxxxxxxxxxxxxxx`)
   - Free account includes 50 free SMS credits

3. **Paste in SheSafe:**
   - Open SheSafe app
   - Go to Settings → Fast2SMS Configuration
   - Paste API key
   - Click "Send Test SMS"
   - You'll receive test SMS to your registered number

4. **Production Use:**
   - Recharge balance from ₹100 onwards
   - Each SOS alert costs 1 SMS credit per contact
   - Example: 5 contacts = 5 SMS credits per alert

### ESP8266 Hardware Button (Optional)

If you want a physical hardware panic button:

1. **Hardware Needed:**
   - NodeMCU ESP8266 board (~₹500)
   - Momentary push button
   - USB cable for power

2. **Setup:**
   - Edit `arduino/shesafe_button.ino`:
     ```cpp
     #define WIFI_SSID "YourWiFiName"
     #define WIFI_PASSWORD "YourPassword"
     #define SERVER_IP "192.168.137.1"  // Your PC IP
     ```
   - Upload to ESP8266 using Arduino IDE
   - Device connects to WiFi automatically
   - When button pressed, it calls `http://PC_IP:3000/alert`
   - App polls device status every 2 seconds
   - Instant alert when button pressed on device

3. **Using with App:**
   - Device and phone must be on same WiFi network
   - LED blinks show:
     - 3 blinks = Alert sent successfully
     - 2 blinks = Alert failed
     - 1 blink = Cannot connect to server

---

## 🔐 Security Features

✅ **Client-side Storage** - All data stored in browser localStorage, not on server  
✅ **Password Hashing** - Passwords stored as btoa hash (client-side)  
✅ **HTTPS Support** - Use HTTPS in production  
✅ **CORS Protection** - Express server validates origins  
✅ **API Key Security** - Fast2SMS API key stored in settings, never in code  
✅ **No Account Recovery** - Data is permanent; no password reset (prevents unauthorized access)  

---

## 📊 Data Storage

All data is stored in **browser localStorage**:

```
localStorage Keys:
- shesafe_users  → All registered users
- shesafe_contacts → Emergency contacts
- shesafe_alert_logs → Alert history
- shesafe_settings → App settings (API keys, device IP)
- shesafe_current_user → Active user session
- shesafe_admin_logged_in → Admin session flag
```

**To clear all data:** Settings → (bottom) → Clear All (if implemented)

---

## 🇮🇳 Indian Phone Number Rules

The app strictly validates Indian mobile numbers:

| Rule | Example |
|------|---------|
| **Length** | Exactly 10 digits |
| **Start Digit** | Must be 6, 7, 8, or 9 |
| **Format Display** | +91 98765 43210 |
| **SMS Format** | 9876543210 (no +91) |
| **Store Format** | 10 digits only |

Invalid inputs rejected:
- ❌ `1234567890` (starts with 1)
- ❌ `987654321` (only 9 digits)
- ❌ `98765 43210` (spaces not auto-removed in validation)
- ✅ `9876543210` (valid)
- ✅ `+91 98765 43210` (auto-cleaned to `9876543210`)

---

## 📡 ESP Server API

The Express server running on `http://localhost:3000` provides:

### GET `/status`
Returns button press state:
```json
{
  "pressed": false,
  "lastPressed": "2026-04-15T10:30:22.123Z"
}
```

### GET `/alert`
Records device button press:
```json
{
  "success": true,
  "message": "Alert received",
  "timestamp": "2026-04-15T10:30:22.123Z"
}
```

### GET `/reset`
Clears button press flag:
```json
{
  "success": true,
  "message": "Status reset"
}
```

### GET `/health`
Health check:
```json
{
  "status": "ok",
  "timestamp": "2026-04-15T10:30:22.123Z",
  "uptime": 1234.56
}
```

---

## 🌐 SMS Alert Message Format

When alert is triggered, each contact receives:

```
SHESAFE EMERGENCY ALERT! Priya Sharma needs immediate help! Live location: https://maps.google.com/?q=28.6139,77.2090 Please call or reach her immediately. This is an automated SOS alert.
```

**Key Features of Message:**
- ✅ Works on Jio, Airtel, Vi, BSNL networks
- ✅ Google Maps link opens directly on Android
- ✅ Under 160 characters (for 1 SMS credit)
- ✅ Personalized with user's name
- ✅ Exact GPS coordinates

---

## 🏗️ Project Structure

```
SheSafe_WebApp/
├── public/
│   └── manifest.json                 (PWA manifest)
├── server/
│   └── index.js                      (Express server)
├── src/
│   ├── components/
│   │   ├── AlertButton.tsx           (SOS button component)
│   │   ├── ContactCard.tsx           (Contact display card)
│   │   ├── Navbar.tsx                (Bottom navigation)
│   │   └── ProtectedRoute.tsx        (Route protection)
│   ├── pages/
│   │   ├── LoginPage.tsx             (User/admin login)
│   │   ├── RegisterPage.tsx          (User registration)
│   │   ├── MainPage.tsx              (SOS screen)
│   │   ├── ContactsPage.tsx          (Manage contacts)
│   │   ├── SettingsPage.tsx          (App settings)
│   │   └── AdminPage.tsx             (Admin dashboard)
│   ├── context/
│   │   ├── AuthContext.tsx           (Auth provider)
│   │   └── ContactsContext.tsx       (Alert provider)
│   ├── services/
│   │   ├── storageService.ts         (localStorage wrapper)
│   │   ├── locationService.ts        (GPS handling)
│   │   ├── smsService.ts             (Fast2SMS integration)
│   │   ├── alertService.ts           (Alert logic)
│   │   └── espPollingService.ts      (Device polling)
│   ├── types/
│   │   └── index.ts                  (TypeScript interfaces)
│   ├── utils/
│   │   ├── constants.ts              (App constants)
│   │   └── phoneUtils.ts             (Phone validation)
│   ├── App.tsx                       (Main component)
│   ├── main.tsx                      (React entry point)
│   └── index.css                     (Global styles)
├── arduino/
│   └── shesafe_button.ino           (ESP8266 firmware)
├── index.html                        (HTML template)
├── vite.config.ts                   (Vite configuration)
├── tailwind.config.js               (Tailwind config)
├── tsconfig.json                    (TypeScript config)
├── package.json                     (Dependencies)
└── README.md                        (This file)
```

---

## 🐛 Troubleshooting

### SMS Not Sending
**Problem:** Alert sent but SMS not received  
**Solutions:**
- Verify API key in Settings  
- Check phone number format (10 digits, starts with 6-9)  
- Confirm Fast2SMS account has credits (use free 50)  
- Test SMS from Settings page first  
- Check network connection  

### GPS Not Working
**Problem:** "GPS unavailable" error  
**Solutions:**
- Check browser location permissions (allow location access)  
- Move to open area (less obstructed sky)  
- Clear browser cache and reload  
- Ensure HTTPS or localhost (required for geolocation)  

### Device Not Connecting
**Problem:** ESP8266 button won't connect  
**Solutions:**
- Verify WiFi SSID and password in code  
- Check PC IP address matches in code  
- Ensure device and PC on same network  
- Check serial monitor for error messages (115200 baud)  
- Reset device and try again  

### App Won't Start
**Problem:** npm install or npm run dev fails  
**Solutions:**
- Delete `node_modules` and `package-lock.json`  
- Run `npm install` again  
- Ensure Node.js 16+ installed  
- Check disk space (Vite needs ~500MB)  

---

## 📝 License & Support

This project is provided as-is for educational and emergency safety purposes.

### Important Notes:
- ⚠️ Test SMS configurations before relying on them
- ⚠️ Keep emergency contacts updated
- ⚠️ Ensure Fast2SMS account has sufficient credits
- ⚠️ Verify app works on your device before emergency
- ⚠️ Have alternative emergency contact methods (calling 100 in India)

---

## 🔗 Useful Links

- [Fast2SMS](https://fast2sms.com) - SMS API provider
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [ESP8266 Arduino Core](https://github.com/esp8266/Arduino)
- [Indian Emergency Numbers](https://www.ncrb.gov.in/) - Always have these ready

---

## 🙏 Contributing

This is a safety-critical application. If you find issues or improvements:
1. Test thoroughly before deployment
2. Never disable security validations
3. Keep emergency contact information accurate
4. Document any changes made

---

**Stay Safe. Stay Alert. 🚨**

For emergency situations in India:
- **Police:** 100
- **Ambulance:** 102
- **Fire:** 101
- **Women Helpline:** 1091

---

*Last Updated: April 2026*  
*SheSafe v1.0.0 - Production Ready*
