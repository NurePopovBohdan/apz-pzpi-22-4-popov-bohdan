#include <WiFi.h>
#include <PubSubClient.h>

// WiFi настройки
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// MQTT настройки
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* topic = "autocare/iot";

WiFiClient espClient;
PubSubClient client(espClient);

// VIN автомобиля
const char* vin = "1HGCM82633A123499";

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

void loop() {
  // Считываем данные с датчиков
  float tirePressure = 30.5;  // Примерное значение
  float batteryVoltage = 12.2;
  float brakePadThickness = 8.0;

  // Создаем JSON-строку
  String payload = String("{") +
                   "\"vin\":\"" + vin + "\"," +
                   "\"tirePressure\":" + String(tirePressure) + "," +
                   "\"batteryVoltage\":" + String(batteryVoltage) + "," +
                   "\"brakePadThickness\":" + String(brakePadThickness) +
                   "}";

  // Отправляем данные
  client.publish(topic, payload.c_str());
  Serial.println("Published: " + payload);

  delay(5000); // Отправляем данные каждые 5 секунд
}
