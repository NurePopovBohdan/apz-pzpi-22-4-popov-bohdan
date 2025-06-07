package com.autocare.autocare1.data.model

import kotlin.random.Random

data class Vehicle(
    val id: String = "",
    val userId: String = "",
    val make: String,
    val model: String,
    val year: Int,
    var sensorData: SensorData = SensorData()
)

data class SensorData(
    val tirePressure: Double = generateRandomTirePressure(),
    val batteryVoltage: Double = generateRandomBatteryVoltage(),
    val brakePadThickness: Double = generateRandomBrakePadThickness()
) {
    companion object {
        fun generateRandomTirePressure(): Double = String.format("%.1f", Random.nextDouble(30.0, 40.0)).toDouble()
        fun generateRandomBatteryVoltage(): Double = String.format("%.1f", Random.nextDouble(11.0, 14.0)).toDouble()
        fun generateRandomBrakePadThickness(): Double = String.format("%.1f", Random.nextDouble(5.0, 12.0)).toDouble()
    }
} 