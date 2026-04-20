import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Shared state for button press
let buttonPressed = false;
let lastPressedTime = null;

// Routes

// GET /status - Check if button was pressed
app.get('/status', (req, res) => {
  res.json({
    pressed: buttonPressed,
    lastPressed: lastPressedTime
  });
  console.log(`[${new Date().toLocaleTimeString()}] Status checked - Pressed: ${buttonPressed}`);
});

// GET /alert - Record button press (called by ESP8266)
app.get('/alert', (req, res) => {
  buttonPressed = true;
  lastPressedTime = new Date().toISOString();
  
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 🚨 ALERT RECEIVED from device!`);
  console.log(`    Location: ${req.ip}`);
  console.log(`    Timestamp: ${lastPressedTime}`);
  
  // Send plain text response that ESP8266 can recognize
  res.type('text/plain').send('ok');
});

// GET /reset - Reset button flag
app.get('/reset', (req, res) => {
  buttonPressed = false;
  console.log(`[${new Date().toLocaleTimeString()}] Status reset`);
  
  res.json({
    success: true,
    message: 'Status reset'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║    SheSafe ESP8266 Bridge Server       ║`);
  console.log(`║    Listening on port ${PORT}              ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
  console.log(`✓ Ready to receive alerts from device`);
  console.log(`✓ CORS enabled for all origins`);
  console.log(`✓ Visit http://localhost:${PORT}/health to test\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nServer shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nServer shutting down...');
  process.exit(0);
});
