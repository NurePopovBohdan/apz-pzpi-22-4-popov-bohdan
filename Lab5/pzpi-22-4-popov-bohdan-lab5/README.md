# API Документація для проєкту "Програмна система моніторингу стану зносу частин автотранспорту та сповіщення про заміну деталей «AutoCare»"

## Загальна інформація

- **Базовий URL**: `https://api.autocare.com/v1`  
- **Формат відповіді**: JSON  
- **Аутентифікація**: JWT Token  
- **Кодування**: UTF-8  
## Розгортання

### Вимоги до системи

- **Серверна частина**: Node.js 16+, MongoDB 5.0+, MQTT брокер (наприклад, Mosquitto), Redis (опціонально)  
- **IoT-пристрій**: ESP8266 з датчиками (тиск у шинах, напруга батареї, знос гальмівних колодок) або емулятор Wokwi  
- **Веб-клієнт**: Node.js 16+, браузер (Chrome, Firefox)  
- **Мобільний додаток**: Android Studio, Android SDK 31+  

### Змінні середовища

Створіть файл `.env` у кореневій папці серверної частини з наступними параметрами:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autocare
JWT_SECRET=your_jwt_secret_key
MQTT_BROKER_URL=mqtt://localhost:1883
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
REDIS_URL=redis://localhost:6379
```

### Кроки розгортання

1. **Клонування репозиторію:**
```bash
git clone https://github.com/your-username/autocare-backend.git
cd autocare-backend
```

2. **Встановлення залежностей:**
```bash
npm install
```

3. **Налаштування змінних середовища:**
- Скопіюйте `.env.example` до `.env` і відредагуйте його зі своїми значеннями.

4. **Запуск сервера:**
```bash
npm start
```

### Налаштування IoT-пристрою

1. **Підготовка Wokwi:**
   - Імпортуйте код прошивки.
   - Встановіть бібліотеки ESP8266WiFi та PubSubClient.
   - Налаштуйте віртуальні датчики.
   - Запустіть емуляцію.

3. **Налаштування прошивки:**
   - Вкажіть параметри Wi-Fi мережі та налаштування MQTT-брокера.
   - Завантажте прошивку на ESP8266.

4. **Підключення датчиків:**
   - Датчик тиску в шинах → A0  
   - Датчик напруги батареї → A1  
   - Датчик зносу гальмівних колодок → A2  

## Аутентифікація

### Реєстрація користувача
```http
POST /auth/register
```

**Тіло запиту:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "Іван",
    "lastName": "Петренко",
    "phone": "+380501234567"
}
```

**Успішна відповідь (201 Created):**
```json
{
    "status": "success",
    "message": "Користувача успішно зареєстровано",
    "data": {
        "userId": "12345",
        "email": "user@example.com",
        "firstName": "Іван",
        "lastName": "Петренко"
    }
}
```

### Авторизація користувача
```http
POST /auth/login
```

**Тіло запиту:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Успішна відповідь (200 OK):**
```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Управління автомобілями

### Додавання нового автомобіля
```http
POST /vehicles
```

**Заголовки:**
```
Authorization: Bearer <your_jwt_token>
```

**Тіло запиту:**
```json
{
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "vin": "1HGCM82633A123456",
    "licensePlate": "AA1234BB",
    "initialMileage": 50000,
    "sensors": [
        {
            "type": "tirePressure",
            "serialNumber": "TP123"
        },
        {
            "type": "batteryVoltage",
            "serialNumber": "BV456"
        },
        {
            "type": "brakePadWear",
            "serialNumber": "BP789"
        }
    ]
}
```

**Успішна відповідь (201 Created):**
```json
{
    "status": "success",
    "data": {
        "vehicleId": "v12345",
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        "vin": "1HGCM82633A123456",
        "licensePlate": "AA1234BB",
        "currentMileage": 50000
    }
}
```

### Отримання списку автомобілів користувача
```http
GET /vehicles
```

**Заголовки:**
```
Authorization: Bearer <your_jwt_token>
```

**Успішна відповідь (200 OK):**
```json
{
    "status": "success",
    "data": {
        "vehicles": [
            {
                "vehicleId": "v12345",
                "make": "Toyota",
                "model": "Camry",
                "year": 2020,
                "vin": "1HGCM82633A123456",
                "licensePlate": "AA1234BB",
                "currentMileage": 50000
            }
        ]
    }
}
```

## Моніторинг даних датчиків

### Отримання даних з датчиків автомобіля
```http
GET /sensors/data
```

**Заголовки:**
```
Authorization: Bearer <your_jwt_token>
```

**Параметри запиту:**
```json
{
    "vehicleId": "v12345"
}
```

**Успішна відповідь (200 OK):**
```json
{
    "status": "success",
    "data": {
        "tirePressure": {
            "value": 2.5,
            "unit": "bar",
            "timestamp": "2024-03-20T12:00:00Z"
        },
        "batteryVoltage": {
            "value": 12.6,
            "unit": "V",
            "timestamp": "2024-03-20T12:00:00Z"
        },
        "brakePadWear": {
            "value": 75,
            "unit": "%",
            "timestamp": "2024-03-20T12:00:00Z"
        }
    }
}
```

### Відправка даних з датчиків (для IoT-пристрою)
```http
POST /sensors/data
```

**Тіло запиту:**
```json
{
    "vehicleId": "v12345",
    "sensorType": "tirePressure",
    "value": 2.5,
    "unit": "bar",
    "timestamp": "2024-03-20T12:00:00Z"
}
```

**Успішна відповідь (201 Created):**
```json
{
    "status": "success",
    "message": "Дані успішно збережено"
}
```

## Сповіщення

### Отримання сповіщень
```http
GET /notifications
```

**Заголовки:**
```
Authorization: Bearer <your_jwt_token>
```

**Параметри запиту:**
```json
{
    "vehicleId": "v12345",
    "status": "unread"
}
```

**Успішна відповідь (200 OK):**
```json
{
    "status": "success",
    "data": {
        "notifications": [
            {
                "notificationId": "n12345",
                "vehicleId": "v12345",
                "type": "tirePressure",
                "message": "Низький тиск у шинах",
                "severity": "high",
                "createdAt": "2024-03-20T12:00:00Z",
                "status": "unread"
            }
        ]
    }
}
```

## Коди помилок

| Код | Опис                     |
|-----|--------------------------|
| 400 | Неправильний запит       |
| 401 | Не авторизовано          |
| 403 | Доступ заборонено        |
| 404 | Ресурс не знайдено       |
| 422 | Помилка валідації даних  |
| 500 | Внутрішня помилка сервера|


## Безпека

- Усі запити до API захищені JWT токенами.  
- Паролі хешуються за допомогою bcrypt.  
- Для продакшн-розгортання використовуйте HTTPS.  
- Реалізовано обмеження кількості запитів (rate limiting) для запобігання DDoS-атакам.  
- Налаштуйте брандмауер для обмеження доступу до MQTT-брокера.  
- Використовуйте CORS політики для веб-клієнта.  

## Моніторинг та логування

- **Prometheus**: для збору метрик продуктивності.  
- **Grafana**: для візуалізації метрик.  
- **ELK Stack**: для централізованого логування подій та помилок.
