# ESP8266 Emergency Button Setup Guide for SheSafe

**Status:** Complete Hardware Integration  
**Device:** NodeMCU ESP8266  
**Purpose:** Physical emergency button for SOS alerts  

---

## ✅ What You Have

- ✅ ESP8266 (NodeMCU board)
- ✅ Breadboard
- ✅ 6m male-to-male jumper wires
- ✅ 6m female-to-female jumper wires

---

## ⚠️ What You NEED to Buy (Cheap Components)

You'll need a **pushbutton switch** to complete the setup. Here are affordable options:

### Option 1: Pushbutton Switch (Easiest) - ₹20-50
- **6x6x5mm momentary pushbutton switch** (normal open/NO type)
- Available on Amazon/local electronics shops
- Search: "6x6 push button switch"
- Also called "tactile button" or "momentary switch"

### Option 2: DIY with Coin/Magnet (FREE - if you're creative)
- Use a magnet and reed switch (detects magnet proximity)
- Available if you salvage old equipment
- More elaborate but works

### Recommended: Buy Option 1 (Pushbutton)
**Why:** Cost ₹20-50, widely available, works perfectly with the code

---

## Hardware Wiring (Pushbutton Button)

### Components Needed:
```
- 1x NodeMCU ESP8266
- 1x Pushbutton switch (6mm)
- 1x 10kΩ resistor (pull-up resistor)
- Breadboard
- Jumper wires (you have these!)
```

### Wiring Diagram

```
                    ┌─────────────────────────────┐
                    │     NodeMCU ESP8266         │
                    │                             │
                    │  D3(GPIO0)  ─────────────┐  │
                    │                          │  │
                    │  3.3V ────────────────┐  │  │
                    │                       │  │  │
                    │  GND ────────────┐    │  │  │
                    └─────────────────┼────┼──┼──┘
                                      │    │  │
                        ┌──────────────┘    │  │
                        │                   │  │
                 ┌──────┴─────────────────┐ │  │
                 │ 10kΩ Resistor (Pull-up)│ │  │
                 └──────┬─────────────────┘ │  │
                        │                   │  │
                        └─────┬─────────────┘  │
                              │                │
                        ┌─────┴──────┐         │
                        │  Pushbutton│ (6mm)  │
                        └─────┬──────┘         │
                              │                │
                              └────────────────┘
                                   to 3.3V
```

### Pin Connections (Detailed):

| Component | Connected To | Wire Color (Suggested) |
|-----------|--------------|------------------------|
| **NodeMCU 3.3V** | Pushbutton + 10kΩ resistor | Red |
| **NodeMCU D3** | 10kΩ resistor middle pin | Green |
| **Pushbutton Lead 1** | 10kΩ resistor end + D3 | Green |
| **Pushbutton Lead 2** | GND (via breadboard) | Black |
| **NodeMCU GND** | Breadboard GND rail | Black |

---

## Step-by-Step Hardware Setup

### Step 1: Insert NodeMCU into Breadboard
```
Place NodeMCU across the center channel (the deep groove)
Position it so pins are on both left and right sides
```

### Step 2: Create Ground Rail
```
Take 1 black female-to-male jumper wire
Connect: NodeMCU GND pin → Breadboard GND column (negative rail)
Do this for both GND pins if available
```

### Step 3: Install 10kΩ Pull-up Resistor
```
This resistor keeps D3 at HIGH (3.3V) when button is not pressed
- Insert resistor across breadboard holes
- One leg touches 3.3V power rail
- Other leg touches same column as D3
- Don't touch GND yet!
```

### Step 4: Connect Pushbutton
```
Lead 1: Insert into breadboard hole connected to D3 + resistor
Lead 2: Insert into breadboard hole connected to GND
```

### Step 5: Connect Power
```
From NodeMCU:
- 3.3V pin → Breadboard positive rail (red jumper wire)
- GND pins → Breadboard negative rail (black jumper wire)
```

### Step 6: Verify Connections
```
When button is RELEASED:
  D3 reads HIGH (3.3V via pull-up resistor) ✅

When button is PRESSED:
  D3 reads LOW (0V via GND connection) ✅
```

---

## Arduino IDE Setup

### Step 1: Download Arduino IDE
- Windows: https://www.arduino.cc/en/software
- Download "Windows Installer"
- Install with default settings

### Step 2: Add ESP8266 Board Support
1. Open Arduino IDE
2. Go to **File → Preferences**
3. Find "Additional Boards Manager URLs" field
4. Paste this URL:
```
http://arduino.esp8266.com/stable/package_esp8266com_index.json
```
5. Click OK

### Step 3: Install ESP8266 Board Package
1. Go to **Tools → Board → Boards Manager**
2. Search for "esp8266"
3. Click "ESP8266 Community" by ESP8266 Community
4. Click **Install** button (wait 2-3 minutes)
5. Close Boards Manager

### Step 4: Select NodeMCU Board
1. Go to **Tools → Board → ESP8266 Boards**
2. Select **NodeMCU 1.0 (ESP-12E Module)**

### Step 5: Configure Serial Port
1. Go to **Tools → Port**
2. Select the COM port (usually highest number, like COM3, COM4, etc.)
   - If you don't see it, install CH340 driver:
   - https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
3. Go to **Tools → Upload Speed** → Set to **115200**

---

## Code Configuration & Upload

### Step 1: Copy Arduino Code
1. Open the file: `d:\SheSafe_WebApp\arduino\shesafe_button.ino`
2. Copy all contents

### Step 2: Paste into Arduino IDE
1. Create new sketch in Arduino IDE
2. Delete any existing code
3. Paste the full `shesafe_button.ino` code

### Step 3: Configure WiFi Credentials
Find these lines in the code:
```cpp
#define WIFI_SSID "YourHotspot"           // Change to your WiFi SSID
#define WIFI_PASSWORD "YourPassword"      // Change to your WiFi password
#define SERVER_IP "192.168.137.1"         // Change to your PC's IP
```

**Get Your PC IP Address:**

**Windows:**
1. Open Command Prompt (Windows key + R → type `cmd` → Enter)
2. Type: `ipconfig`
3. Find line: "IPv4 Address: 192.168.X.X"
4. Copy that number (e.g., 192.168.43.153)

**Example Configuration:**
```cpp
#define WIFI_SSID "MyHotspot"
#define WIFI_PASSWORD "MyPassword123"
#define SERVER_IP "192.168.43.153"        // Your PC IP from ipconfig
```

### Step 4: Upload Code to ESP8266
1. Connect NodeMCU to computer via USB cable
2. Click **Upload** button (→ arrow icon) or **Sketch → Upload**
3. Wait for "Uploading..." message
4. Should say "✓ Done uploading" after ~15-20 seconds

### Step 5: Verify Upload Success
1. Click **Tools → Serial Monitor**
2. Set baud rate to **115200** (bottom right)
3. You should see:
```
╔════════════════════════════════════════╗
║     SheSafe Emergency Button Setup     ║
║     NodeMCU ESP8266                    ║
╚════════════════════════════════════════╝

[STARTUP] Button pin configured: D3 (GPIO0)
[STARTUP] LED pin configured: D8

[WiFi] Connecting to: MyHotspot
....... (dots while connecting)
✓ Connected!
[WiFi] IP Address: 192.168.43.100
[WiFi] Server: 192.168.43.153:3000
```

---

## Testing the Setup

### Test 1: WiFi Connection ✅

**Expected:**
- Serial monitor shows: "✓ Connected!"
- Shows "IP Address: 192.168.XX.XX"
- Shows "Server: 192.168.X.X:3000"

**If Failed:**
- Check WIFI_SSID matches exactly (case-sensitive)
- Check WIFI_PASSWORD is correct
- Ensure WiFi is 2.4GHz (not 5GHz)
- Some ESP8266 don't support 5GHz

---

### Test 2: Button Press Detection ✅

**Steps:**
1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud to **115200**
3. **Press the pushbutton** for 1 second
4. Release

**Expected Output:**
```
╔════════════════════════════════════════╗
║          🆘 BUTTON PRESSED! 🆘         ║
╚════════════════════════════════════════╝

[ALERT] Attempting to connect to server...
[ALERT] Server: 192.168.43.153:3000
[ALERT] ✓ Connected to server
[ALERT] Sent SOS request to server
[ALERT] ✓ Alert sent successfully!
[ALERT] SMS will be sent to all emergency contacts
[ALERT] Ready for next alert
```

**If Shows Error:**
- Check server is running: `npm run dev:all` in PowerShell
- Check SERVER_IP is correct
- Verify NodeMCU and PC are on same WiFi network

---

### Test 3: Verify in Web App ✅

**Steps:**
1. Open SheSafe app: http://localhost:5173
2. Login as: priya123 / test123
3. Go to Main Page
4. Press the physical pushbutton on your ESP8266
5. Check Serial Monitor (should see "Alert sent successfully!")

**Expected in App:**
- Main Page updates to show pressed status
- Admin Page > Alert History shows new SOS alert
- If SMS configured: Emergency contacts receive SMS

**Endpoint Hit:**
- Serial Monitor shows: "✓ Alert sent successfully!"
- Browser console shows no errors

---

## LED Status Indicator

The NodeMCU has a built-in LED on **D8** that blinks to show status:

| LED Pattern | Meaning |
|------------|---------|
| **3 quick blinks** | ✅ Alert sent successfully! SMS queued |
| **2 blinks** | ⚠️ Server error (check response) |
| **1 blink** | ❌ Failed (WiFi down or server unreachable) |

---

## Troubleshooting

### Problem: "Board at COM3 is not available"
**Solution:**
1. Download CH340 driver: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
2. Install driver
3. Restart Arduino IDE
4. Reconnect NodeMCU via USB

---

### Problem: "Failed to connect to WiFi" in Serial Monitor
**Solution:**
1. Verify WIFI_SSID is exactly correct (case-sensitive)
2. Verify WIFI_PASSWORD is correct
3. Ensure using 2.4GHz WiFi (not 5GHz)
4. Try: `ipconfig /all` to see WiFi network details

---

### Problem: "✗ Failed to connect to server" when button pressed
**Solution:**
1. Verify server is running: `npm run dev:all` in PowerShell
2. Verify PC IP (use `ipconfig`) matches SERVER_IP in code
3. Ensure NodeMCU and PC on same WiFi network
4. Try connecting from NodeMCU IP: `ping 192.168.X.X` from PC

---

### Problem: Button press not detected
**Solution:**
1. Check that button is actually pressing (try pressing harder)
2. Verify button is connected to D3 and GND pins
3. Check Serial Monitor for bounce messages
4. Try swapping button leads (they can go both ways)

---

### Problem: Upload fails / "Timed out waiting for packet header"
**Solution:**
1. Try again - sometimes requires 2-3 attempts
2. Set Upload Speed to **115200** (Tools → Upload Speed)
3. Try setting to **74880** instead
4. May need to press **BOOT** button during upload on older NodeMCU boards

---

## Complete Checklist

### Hardware ✅
- [ ] Pushbutton switch purchased and on hand
- [ ] NodeMCU ESP8266 connected to breadboard
- [ ] 10kΩ resistor installed (3.3V → D3)
- [ ] Pushbutton connected (D3 → GND)
- [ ] Power connected (3.3V and GND)
- [ ] USB cable connected to computer

### Software ✅
- [ ] Arduino IDE downloaded and installed
- [ ] ESP8266 board package installed (via Boards Manager)
- [ ] Serial port selected (COM3/COM4/etc)
- [ ] Upload speed set to 115200
- [ ] NodeMCU 1.0 board selected

### Configuration ✅
- [ ] WIFI_SSID set to your network name
- [ ] WIFI_PASSWORD set to your password
- [ ] SERVER_IP set to your PC's IP (from `ipconfig`)
- [ ] Code uploaded successfully
- [ ] Serial Monitor shows "✓ Connected!"

### Testing ✅
- [ ] Pushbutton press shows in Serial Monitor
- [ ] LED blinks 3 times = alert sent
- [ ] Web app receives alert (Admin → Alert History)
- [ ] SMS sent to emergency contacts (if API key configured)

---

## Next Steps

### After Hardware Works:

1. **Test Full SOS Flow:**
   - Press physical button
   - Check that app shows alert received
   - Verify emergency contacts get SMS (if API configured)

2. **Production Deployment:**
   - Can mount breadboard + button in a case
   - Consider adding a red LED for status indicator
   - Use shielded wires if in noisy RF environment

3. **Advanced Features:**
   - Add double-click detection (requires code change)
   - Add buzzer for confirmation (GPIO pin)
   - Add accelerometer for fall detection (I2C)

---

## Reference

- **ESP8266 Pinout:** https://github.com/esp8266/Arduino/blob/master/variants/nodemcu/pins_arduino.h
- **Arduino IDE Docs:** https://docs.arduino.cc
- **Button Debouncing:** Implemented in code (50ms delay)
- **WiFi Timeout:** 20 attempts × 500ms = 10 seconds

---

## Quick Copy-Paste Configuration Reference

```cpp
// FOR YOUR SETUP - COPY THIS SECTION

#define WIFI_SSID "YourWiFiName"           // Replace with your WiFi SSID
#define WIFI_PASSWORD "YourPassword"       // Replace with your WiFi password
#define SERVER_IP "192.168.X.X"            // Replace with PC IP from ipconfig
#define SERVER_PORT 3000
#define BUTTON_PIN D3                      // GPIO0 - Don't change this
```

---

## Support

**If you get stuck:**
1. Check Serial Monitor output (Tools → Serial Monitor, set to 115200)
2. Verify `npm run dev:all` is running on your PC
3. Check both NodeMCU and PC are on same network
4. Restart NodeMCU (unplug USB, wait 2s, plug back in)
5. Try uploading code again

---

*Last Updated: April 16, 2026*  
*SheSafe ESP8266 Emergency Button Integration*  
*Ready for production deployment*
