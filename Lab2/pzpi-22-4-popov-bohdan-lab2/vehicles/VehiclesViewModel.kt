package com.autocare.autocare1.ui.vehicles

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.autocare.autocare1.data.model.Vehicle
import com.autocare.autocare1.data.repository.AutoCareRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class VehiclesViewModel @Inject constructor(
    private val repository: AutoCareRepository
) : ViewModel() {

    private val _vehiclesState = MutableStateFlow<VehiclesState>(VehiclesState.Initial)
    val vehiclesState: StateFlow<VehiclesState> = _vehiclesState

    private val _selectedVehicleState = MutableStateFlow<SelectedVehicleState>(SelectedVehicleState.Initial)
    val selectedVehicleState: StateFlow<SelectedVehicleState> = _selectedVehicleState

    fun loadVehicles(token: String) {
        viewModelScope.launch {
            try {
                _vehiclesState.value = VehiclesState.Loading
                val vehicles = repository.getVehicles(token)
                _vehiclesState.value = VehiclesState.Success(vehicles)
            } catch (e: Exception) {
                _vehiclesState.value = VehiclesState.Error(e.message ?: "Failed to load vehicles")
            }
        }
    }

    fun addVehicle(token: String, make: String, model: String, year: Int) {
        viewModelScope.launch {
            try {
                val vehicle = Vehicle(make = make, model = model, year = year)
                val addedVehicle = repository.addVehicle(token, vehicle)
                loadVehicles(token)
            } catch (e: Exception) {
                _vehiclesState.value = VehiclesState.Error(e.message ?: "Failed to add vehicle")
            }
        }
    }

    fun deleteVehicle(token: String, vehicleId: String) {
        viewModelScope.launch {
            try {
                repository.deleteVehicle(token, vehicleId)
                loadVehicles(token)
            } catch (e: Exception) {
                _vehiclesState.value = VehiclesState.Error(e.message ?: "Failed to delete vehicle")
            }
        }
    }

    fun loadVehicleDetails(token: String, vehicleId: String) {
        viewModelScope.launch {
            try {
                _selectedVehicleState.value = SelectedVehicleState.Loading
                val vehicle = repository.getVehicle(token, vehicleId)
                _selectedVehicleState.value = SelectedVehicleState.Success(vehicle)
            } catch (e: Exception) {
                _selectedVehicleState.value = SelectedVehicleState.Error(e.message ?: "Failed to load vehicle details")
            }
        }
    }
}

sealed class VehiclesState {
    object Initial : VehiclesState()
    object Loading : VehiclesState()
    data class Success(val vehicles: List<Vehicle>) : VehiclesState()
    data class Error(val message: String) : VehiclesState()
}

sealed class SelectedVehicleState {
    object Initial : SelectedVehicleState()
    object Loading : SelectedVehicleState()
    data class Success(val vehicle: Vehicle) : SelectedVehicleState()
    data class Error(val message: String) : SelectedVehicleState()
} 