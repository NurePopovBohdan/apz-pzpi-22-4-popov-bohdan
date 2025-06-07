package com.autocare.autocare1.ui.vehicles

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.autocare.autocare1.data.model.Vehicle
import com.autocare.autocare1.ui.components.*

@Composable
fun VehicleListScreen(
    token: String,
    onVehicleClick: (String) -> Unit,
    onLogout: () -> Unit,
    viewModel: VehiclesViewModel = hiltViewModel()
) {
    var showAddDialog by remember { mutableStateOf(false) }
    var make by remember { mutableStateOf("") }
    var model by remember { mutableStateOf("") }
    var year by remember { mutableStateOf("") }

    val vehiclesState by viewModel.vehiclesState.collectAsState()

    LaunchedEffect(token) {
        viewModel.loadVehicles(token)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Vehicles") },
                actions = {
                    IconButton(onClick = onLogout) {
                        Text("Logout")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { showAddDialog = true }) {
                Text("+")
            }
        }
    ) { padding ->
        when (val state = vehiclesState) {
            is VehiclesState.Loading -> LoadingSpinner()
            is VehiclesState.Error -> ErrorMessage(state.message)
            is VehiclesState.Success -> {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(16.dp)
                ) {
                    items(state.vehicles) { vehicle ->
                        VehicleCard(
                            vehicle = vehicle,
                            onViewDetails = { onVehicleClick(vehicle.id) },
                            onDelete = { viewModel.deleteVehicle(token, vehicle.id) }
                        )
                    }
                }
            }
            else -> {}
        }

        if (showAddDialog) {
            AlertDialog(
                onDismissRequest = { showAddDialog = false },
                title = { Text("Add Vehicle") },
                text = {
                    Column {
                        AutoCareTextField(
                            value = make,
                            onValueChange = { make = it },
                            label = "Make",
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        AutoCareTextField(
                            value = model,
                            onValueChange = { model = it },
                            label = "Model",
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        AutoCareTextField(
                            value = year,
                            onValueChange = { year = it },
                            label = "Year"
                        )
                    }
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            year.toIntOrNull()?.let { yearInt ->
                                viewModel.addVehicle(token, make, model, yearInt)
                                showAddDialog = false
                                make = ""
                                model = ""
                                year = ""
                            }
                        }
                    ) {
                        Text("Add")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}

@Composable
fun VehicleCard(
    vehicle: Vehicle,
    onViewDetails: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "${vehicle.year} ${vehicle.make} ${vehicle.model}",
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                TextButton(onClick = onViewDetails) {
                    Text("View Details")
                }
                TextButton(onClick = onDelete) {
                    Text("Delete")
                }
            }
        }
    }
} 