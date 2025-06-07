package com.autocare.autocare1.data.repository

import com.autocare.autocare1.data.api.AutoCareApi
import com.autocare.autocare1.data.model.AuthRequest
import com.autocare.autocare1.data.model.AuthResponse
import com.autocare.autocare1.data.model.Vehicle
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AutoCareRepository @Inject constructor(
    private val api: AutoCareApi
) {
    suspend fun login(email: String, password: String): AuthResponse {
        return api.login(AuthRequest(email, password))
    }

    suspend fun register(email: String, password: String): AuthResponse {
        return api.register(AuthRequest(email, password))
    }

    suspend fun getVehicles(token: String): List<Vehicle> {
        return api.getVehicles("Bearer $token")
    }

    suspend fun addVehicle(token: String, vehicle: Vehicle): Vehicle {
        return api.addVehicle("Bearer $token", vehicle)
    }

    suspend fun deleteVehicle(token: String, vehicleId: String) {
        api.deleteVehicle("Bearer $token", vehicleId)
    }

    suspend fun getVehicle(token: String, vehicleId: String): Vehicle {
        return api.getVehicle("Bearer $token", vehicleId)
    }
} 