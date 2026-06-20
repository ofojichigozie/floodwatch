#pragma once

// ─────────────────────────────────────────────
//  WiFi Credentials
// ─────────────────────────────────────────────
#define WIFI_SSID       "YOUR_WIFI_SSID"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

// ─────────────────────────────────────────────
//  Backend API
// ─────────────────────────────────────────────
#define API_HOST        "your-app.onrender.com"   // No https:// — just the hostname
#define API_PORT        443
#define API_ENDPOINT    "/api/v1/readings"
#define API_KEY         "your_hardware_api_key_here"

// ─────────────────────────────────────────────
//  Pin Definitions
// ─────────────────────────────────────────────
#define PIN_RAIN_SENSOR  A0   // Analog pin — rain sensor signal
#define PIN_TRIG         D6   // Ultrasonic trigger
#define PIN_ECHO         D7   // Ultrasonic echo
#define PIN_LED          D4   // Status LED (blinks on successful send)

// ─────────────────────────────────────────────
//  Sensor Configuration
// ─────────────────────────────────────────────
#define CONTAINER_HEIGHT_CM   30.0f   // ← Set this to your actual container height
#define SOUND_SPEED_CM_US     0.0343f // Speed of sound in cm/µs at ~20°C
#define ULTRASONIC_TIMEOUT_US 30000UL // Max echo wait (≈5 m range)

// ─────────────────────────────────────────────
//  Timing
// ─────────────────────────────────────────────
#define READING_INTERVAL_MS   10000UL  // How often to send a reading (10 s)
#define WIFI_TIMEOUT_MS       15000UL  // Max time to wait for WiFi connection

// ─────────────────────────────────────────────
//  Location Tag
// ─────────────────────────────────────────────
#define SENSOR_LOCATION  "Lab Test Zone A"   // Descriptive name for this node
