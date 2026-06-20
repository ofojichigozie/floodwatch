# FloodWatch Firmware

This folder contains the ESP8266 firmware for the FloodWatch sensor node. The device reads rain and distance data, sends it to the backend API, and blinks an LED to indicate success or error.

## Prerequisites

- Arduino CLI installed and available on your PATH
- An ESP8266 board package installed in Arduino IDE or Arduino CLI
- A configured Wi-Fi connection and backend endpoint

## 1. Enter the firmware folder

Use the firmware folder as your working directory so relative paths work correctly:

```bash
cd floodwatch-firmware
```

## 2. Configure the device

Open config.h and update the values for your Wi-Fi credentials, backend endpoint, API key, container height, and sensor location.

## 3. Build and upload with Arduino CLI

If you are in the firmware folder, the commands can use dot paths cleanly:

```bash
arduino-cli core update-index
arduino-cli core install esp8266:esp8266
arduino-cli compile --fqbn esp8266:esp8266:nodemcuv2 .
arduino-cli upload -p COM3 --fqbn esp8266:esp8266:nodemcuv2 .
```

If your board is connected on a different port, replace COM3 with the correct port such as COM4 or /dev/ttyUSB0.

## 4. Monitor serial output

```bash
arduino-cli monitor -p COM3
```

## Notes

- The firmware sends readings at the interval defined by READING_INTERVAL_MS in config.h.
- If the backend is unavailable, the device will continue retrying and blink an error pattern.
