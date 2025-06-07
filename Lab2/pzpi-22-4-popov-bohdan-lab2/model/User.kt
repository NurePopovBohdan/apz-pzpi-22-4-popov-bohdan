package com.autocare.autocare1.data.model

data class User(
    val id: String = "",
    val email: String,
    val password: String
)

data class AuthRequest(
    val email: String,
    val password: String
)

data class AuthResponse(
    val token: String,
    val userId: String
) 