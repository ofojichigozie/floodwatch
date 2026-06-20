#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "config.h"

WiFiClientSecure client;
unsigned long lastReadingMs = 0;

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - start >= WIFI_TIMEOUT_MS) {
      Serial.println("\nWiFi timeout — restarting.");
      ESP.restart();
    }
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("WiFi connected | IP: ");
  Serial.println(WiFi.localIP());
}

void blinkLED(int times, int delayMs = 150) {
  for (int i = 0; i < times; i++) {
    digitalWrite(PIN_LED, LOW);   // LOW = ON for most ESP8266 boards
    delay(delayMs);
    digitalWrite(PIN_LED, HIGH);  // HIGH = OFF
    delay(delayMs);
  }
}

int readRainSensor() {
  return analogRead(PIN_RAIN_SENSOR);  // 0 (wet) – 1023 (dry)
}

float readDistanceCm() {
  // Send 10 µs trigger pulse
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duration = pulseIn(PIN_ECHO, HIGH, ULTRASONIC_TIMEOUT_US);

  if (duration == 0) {
    Serial.println("Ultrasonic: no echo received");
    return -1.0f;
  }

  return (duration * SOUND_SPEED_CM_US) / 2.0f;
}

void sendReading(int rainIntensity, float distanceCm) {
  float waterLevelCm = CONTAINER_HEIGHT_CM - distanceCm;
  if (waterLevelCm < 0.0f) waterLevelCm = 0.0f;

  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["location"]          = SENSOR_LOCATION;
  doc["rainIntensity"]     = rainIntensity;
  doc["distanceCm"]        = distanceCm;
  doc["containerHeightCm"] = CONTAINER_HEIGHT_CM;

  char payload[256];
  serializeJson(doc, payload);

  Serial.println("Connecting to backend...");

  // Render uses a valid TLS cert — skip fingerprint, accept any cert
  // For production you can pin the cert fingerprint here instead
  client.setInsecure();

  if (!client.connect(API_HOST, API_PORT)) {
    Serial.println("Connection failed.");
    return;
  }

  // Build HTTP request
  String request =
    String("POST ") + API_ENDPOINT + " HTTP/1.1\r\n" +
    "Host: " + API_HOST + "\r\n" +
    "Content-Type: application/json\r\n" +
    "x-api-key: " + API_KEY + "\r\n" +
    "Content-Length: " + strlen(payload) + "\r\n" +
    "Connection: close\r\n\r\n" +
    payload;

  client.print(request);

  // Read response status line
  String statusLine = client.readStringUntil('\n');
  Serial.print("Response: ");
  Serial.println(statusLine);

  // Check for HTTP 201 Created
  if (statusLine.indexOf("201") != -1) {
    Serial.println("Reading sent successfully.");
    blinkLED(3);  // 3 quick blinks = success
  } else {
    Serial.println("Server returned an error.");
    blinkLED(1, 500);  // 1 slow blink = error
  }

  client.stop();
}

void setup() {
  Serial.begin(9600);
  delay(100);

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_LED,  OUTPUT);
  digitalWrite(PIN_LED, HIGH);  // LED off initially

  connectWiFi();

  Serial.println("FloodWatch node ready.");
  blinkLED(2, 300);  // 2 slow blinks = system ready
}

void loop() {
  // Reconnect WiFi if dropped
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi lost — reconnecting...");
    connectWiFi();
  }

  if (millis() - lastReadingMs >= READING_INTERVAL_MS) {
    lastReadingMs = millis();

    int rainIntensity = readRainSensor();
    float distanceCm  = readDistanceCm();

    Serial.printf("Rain: %d | Distance: %.2f cm | Water level: %.2f cm\n",
                  rainIntensity, distanceCm, CONTAINER_HEIGHT_CM - distanceCm);

    if (distanceCm < 0.0f) {
      Serial.println("Skipping — bad ultrasonic reading.");
      return;
    }

    sendReading(rainIntensity, distanceCm);
  }
}
