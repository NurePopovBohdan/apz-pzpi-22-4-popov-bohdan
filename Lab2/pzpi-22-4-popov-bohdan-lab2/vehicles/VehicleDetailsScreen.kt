package com.autocare.autocare1.ui.vehicles

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.autocare.autocare1.data.model.Vehicle
import com.autocare.autocare1.ui.components.*

@Composable
fun VehicleDetailsScreen(
    token: String,
    vehicleId: String,
    onNavigateBack: () -> Unit,
    viewModel: VehiclesViewModel = hiltViewModel()
) {
    val selectedVehicleState by viewModel.selectedVehicleState.collectAsState()

    LaunchedEffect(vehicleId) {
        viewModel.loadVehicleDetails(token, vehicleId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Vehicle Details") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Text("←")
                    }
                }
            )
        }
    ) { padding ->
        when (val state = selectedVehicleState) {
            is SelectedVehicleState.Loading -> LoadingSpinner()
            is SelectedVehicleState.Error -> ErrorMessage(state.message)
            is SelectedVehicleState.Success -> {
                VehicleDetails(
                    vehicle = state.vehicle,
                    modifier = Modifier.padding(padding)
                )
            }
            else -> {}
        }
    }
}

@Composable
fun VehicleDetails(
    vehicle: Vehicle,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "${vehicle.year} ${vehicle.make} ${vehicle.model}",
                    style = MaterialTheme.typography.headlineSmall,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                Text(
                    text = "Sensor Data",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                SensorDataItem(
                    label = "Tire Pressure",
                    value = "${vehicle.sensorData.tirePressure} PSI"
                )

                SensorDataItem(
                    label = "Battery Voltage",
                    value = "${vehicle.sensorData.batteryVoltage} V"
                )

                SensorDataItem(
                    label = "Brake Pad Thickness",
                    value = "${vehicle.sensorData.brakePadThickness} mm"
                )
            }
        }
    }
}

@Composable
fun SensorDataItem(
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label)
        Text(text = value)
    }
} 