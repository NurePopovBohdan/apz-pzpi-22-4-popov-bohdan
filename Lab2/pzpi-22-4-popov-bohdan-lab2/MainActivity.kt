package com.autocare.autocare1

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.autocare.autocare1.ui.auth.AuthScreen
import com.autocare.autocare1.ui.vehicles.VehicleDetailsScreen
import com.autocare.autocare1.ui.vehicles.VehicleListScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AutoCareApp()
        }
    }
}

@Composable
fun AutoCareApp() {
    var token by remember { mutableStateOf<String?>(null) }
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = if (token == null) "auth" else "vehicles"
    ) {
        composable("auth") {
            AuthScreen(
                onAuthSuccess = { authToken ->
                    token = authToken
                    navController.navigate("vehicles") {
                        popUpTo("auth") { inclusive = true }
                    }
                }
            )
        }

        composable("vehicles") {
            token?.let { authToken ->
                VehicleListScreen(
                    token = authToken,
                    onVehicleClick = { vehicleId ->
                        navController.navigate("vehicle/$vehicleId")
                    },
                    onLogout = {
                        token = null
                        navController.navigate("auth") {
                            popUpTo("vehicles") { inclusive = true }
                        }
                    }
                )
            }
        }

        composable(
            route = "vehicle/{vehicleId}",
            arguments = listOf(
                navArgument("vehicleId") { type = NavType.StringType }
            )
        ) { backStackEntry ->
            token?.let { authToken ->
                VehicleDetailsScreen(
                    token = authToken,
                    vehicleId = backStackEntry.arguments?.getString("vehicleId") ?: "",
                    onNavigateBack = {
                        navController.popBackStack()
                    }
                )
            }
        }
    }
}