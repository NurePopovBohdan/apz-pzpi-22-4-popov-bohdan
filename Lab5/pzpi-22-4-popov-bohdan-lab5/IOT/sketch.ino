#include <WiFi.h>
#include <PubSubClient.h>

// WiFi
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// MQTT
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* topic = "autocare/iot";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  client.setServer(mqtt_server, mqtt_port);
  while (!client.connected()) {
    if (client.connect("ESP32Client")) {
      Serial.println("Connected to MQTT broker");
    } else {
      delay(1000);
      Serial.println("Connecting to MQTT...");
    }
  }
}

// VIN
const char* vin = "1HGCM82633A123456";

void loop() {
  float tirePressure = 30.5;
  float batteryVoltage = 12.2;
  float brakePadThickness = 8.0;

  String payload = String("{") +
                   "\"vin\":\"" + vin + "\"," +
                   "\"tirePressure\":" + String(tirePressure) + "," +
                   "\"batteryVoltage\":" + String(batteryVoltage) + "," +
                   "\"brakePadThickness\":" + String(brakePadThickness) +
                   "}";

  client.publish(topic, payload.c_str());
  Serial.println("Published: " + payload);

  delay(5000);
}
