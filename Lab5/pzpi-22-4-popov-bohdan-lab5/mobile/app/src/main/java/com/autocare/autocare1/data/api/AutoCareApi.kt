package com.autocare.autocare1.data.api

import com.autocare.autocare1.data.model.AuthRequest
import com.autocare.autocare1.data.model.AuthResponse
import com.autocare.autocare1.data.model.User
import com.autocare.autocare1.data.model.Vehicle
import retrofit2.http.*

interface AutoCareApi {
    @POST("auth/register")
    suspend fun register(@Body request: AuthRequest): AuthResponse

    @POST("auth/login")
    suspend fun login(@Body request: AuthRequest): AuthResponse

    @GET("vehicles")
    suspend fun getVehicles(@Header("Authorization") token: String): List<Vehicle>

    @POST("vehicles")
    suspend fun addVehicle(@Header("Authorization") token: String, @Body vehicle: Vehicle): Vehicle

    @DELETE("vehicles/{id}")
    suspend fun deleteVehicle(@Header("Authorization") token: String, @Path("id") vehicleId: String)

    @GET("vehicles/{id}")
    suspend fun getVehicle(@Header("Authorization") token: String, @Path("id") vehicleId: String): Vehicle
} 