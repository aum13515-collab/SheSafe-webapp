#include <ESP8266WiFi.h>
#include <WiFiClient.h>

// ==================== CONFIGURATION ====================
#define WIFI_SSID "Redmi"                 // Change to your WiFi SSID
#define WIFI_PASSWORD "12345678"          // Change to your WiFi password
#define SERVER_IP "192.168.43.153"        // Change to your PC's IP (Windows: ipconfig → IPv4 Address)
#define SERVER_PORT 3000
#define BUTTON_PIN D3                     // GPIO0 on NodeMCU

// ==================== GLOBALS ====================
WiFiClient client;
int buttonState = HIGH;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;
bool isConnected = false;

// ==================== SETUP ====================
void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n\n╔════════════════════════════════════════╗");
  Serial.println("║     SheSafe Emergency Button Setup     ║");
  Serial.println("║     NodeMCU ESP8266                    ║");
  Serial.println("╚════════════════════════════════════════╝\n");
  
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(D8, OUTPUT);  // Built-in LED
  
  Serial.println("[STARTUP] Button pin configured: D3 (GPIO0)");
  Serial.println("[STARTUP] LED pin configured: D8");
  
  connectToWiFi();
}

// ==================== MAIN LOOP ====================
void loop() {
  // Read button with debouncing
  int reading = digitalRead(BUTTON_PIN);
  
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }
  
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;
      
      if (buttonState == LOW) {  // Button pressed
        Serial.println("\n╔════════════════════════════════════════╗");
        Serial.println("║          🆘 BUTTON PRESSED! 🆘         ║");
        Serial.println("╚════════════════════════════════════════╝");
        handleButtonPress();
      }
    }
  }
  
  lastButtonState = reading;
  
  // Check WiFi connection every 5 seconds
  static unsigned long lastWiFiCheck = 0;
  if (millis() - lastWiFiCheck > 5000) {
    lastWiFiCheck = millis();
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WARNING] WiFi disconnected, reconnecting...");
      connectToWiFi();
    }
  }
  
  delay(10);
}

// ==================== WIFI CONNECTION ====================
void connectToWiFi() {
  Serial.println("\n[WiFi] Connecting to: " + String(WIFI_SSID));
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    isConnected = true;
    Serial.println("\n✓ Connected!");
    Serial.println("[WiFi] IP Address: " + WiFi.localIP().toString());
    Serial.println("[WiFi] Server: " + String(SERVER_IP) + ":" + SERVER_PORT);
  } else {
    isConnected = false;
    Serial.println("\n✗ Failed to connect to WiFi");
    Serial.println("[WiFi] Check SSID and Password");
  }
}

// ==================== BUTTON PRESS HANDLER ====================
void handleButtonPress() {
  if (!isConnected) {
    Serial.println("[ERROR] Not connected to WiFi");
    blinkLED(1);
    return;
  }
  
  Serial.println("[ALERT] Attempting to connect to server...");
  Serial.println("[ALERT] Server: " + String(SERVER_IP) + ":" + SERVER_PORT);
  
  if (client.connect(SERVER_IP, SERVER_PORT)) {
    Serial.println("[ALERT] ✓ Connected to server");
    
    // Send HTTP GET request
    String request = "GET /alert HTTP/1.1\r\n";
    request += "Host: " + String(SERVER_IP) + "\r\n";
    request += "Connection: close\r\n";
    request += "\r\n";
    
    client.print(request);
    Serial.println("[ALERT] Sent SOS request to server");
    
    // Wait for response
    unsigned long timeout = millis();
    String response = "";
    while (client.connected() && millis() - timeout < 3000) {
      if (client.available()) {
        response += char(client.read());
      }
      delay(10);
    }
    
    client.stop();
    
    // Check response
    if (response.indexOf("200") > 0 || response.indexOf("ok") > 0) {
      Serial.println("[ALERT] ✓ Alert sent successfully!");
      Serial.println("[ALERT] SMS will be sent to all emergency contacts");
      blinkLED(3);  // Success: 3 blinks
    } else {
      Serial.println("[ERROR] Server returned error");
      Serial.println("[ERROR] Response: " + response.substring(0, 200));
      blinkLED(2);  // Error: 2 blinks
    }
  } else {
    Serial.println("[ERROR] ✗ Failed to connect to server");
    Serial.println("[ERROR] Check server IP and port");
    Serial.println("[ERROR] Server should be running: node server/index.js");
    blinkLED(1);  // Fail: 1 blink
  }
  
  Serial.println("[ALERT] Ready for next alert\n");
}

// ==================== LED BLINK INDICATOR ====================
void blinkLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(D8, LOW);   // LED on
    delay(200);
    digitalWrite(D8, HIGH);  // LED off
    delay(200);
  }
}

// ==================== SERIAL COMMANDS ====================
// Uncomment to enable serial debugging commands
/*
void serialEvent() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == 's' || c == 'S') {
      Serial.println("[DEBUG] Status request");
      Serial.println("  WiFi: " + String(isConnected ? "Connected" : "Disconnected"));
      Serial.println("  IP: " + WiFi.localIP().toString());
      Serial.println("  Signal: " + String(WiFi.RSSI()) + " dBm");
    }
  }
}
*/
