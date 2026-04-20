# ESP8266 Quick Setup Card

## 🛒 You Must Buy First

**Pushbutton Switch** - ₹20-50
- 6mm × 6mm momentary pushbutton (normal open)
- Search: "6x6 push button" on Amazon/local shop
- ⚠️ You CANNOT use the app without this!

---

## 🔌 Wiring (5 Wire Connections Only)

```
NodeMCU 3.3V  ──────→  Resistor (10kΩ) ──→ D3
NodeMCU D3    ◄─────── Resistor + Pushbutton Lead #1
Pushbutton L2 ──────→  NodeMCU GND
NodeMCU GND   ◄─────── Breadboard GND rail

Power: 3.3V (red) + GND (black) to breadboard rails
```

---

## ⚙️ Arduino IDE Setup (3 Steps)

1. **Download Arduino IDE** → https://arduino.cc/en/software
2. **Add Board Support:**
   - File → Preferences
   - Additional Boards: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   - OK
   - Tools → Board → Boards Manager → Search "esp8266" → Install
3. **Select Board:**
   - Tools → Board → NodeMCU 1.0 (ESP-12E)
   - Tools → Port → COM3 (or your port)
   - Tools → Upload Speed → 115200

---

## 📝 Code Configuration (3 Lines to Change)

**Get your PC IP:**
```cmd
Windows Key + R → type: cmd → Enter
ipconfig   (look for "IPv4 Address: 192.168.X.X")
```

**In Arduino Code - Find & Replace:**
```cpp
#define WIFI_SSID "YourHotspot"      → "Your_WiFi_Name"
#define WIFI_PASSWORD "YourPassword"  → "Your_Password"
#define SERVER_IP "192.168.137.1"     → "192.168.X.X"  (from ipconfig)
```

**Then:** Upload → Done ✅

---

## ✅ Verify It Works

### Check Serial Monitor:
```
Tools → Serial Monitor (Baud: 115200)
Should see:
  ✓ Connected!
  [WiFi] IP Address: 192.168.X.X
  [WiFi] Server: 192.168.X.X:3000
```

### Press Physical Button:
```
Output should show:
  🆘 BUTTON PRESSED! 🆘
  [ALERT] ✓ Alert sent successfully!
  (3 LED blinks = success)
```

---

## 🚨 Common Issues

| Problem | Fix |
|---------|-----|
| "Board not available" | Install CH340 driver: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers |
| "Failed to connect WiFi" | Check SSID & password exact match, use 2.4GHz not 5GHz |
| "Cannot connect to server" | Run `npm run dev:all`, check PC IP matches |
| Button not detected | Check D3 and GND connections, press harder |

---

## 📱 Test with App

1. Open: http://localhost:5173
2. Login: priya123 / test123
3. Press physical button
4. Check: Admin → Alert History (should show alert)

---

## Full Guide

See: `ESP8266_SETUP_GUIDE.md` for detailed instructions

---

**Ready?** Go buy the pushbutton and come back! 🔘
