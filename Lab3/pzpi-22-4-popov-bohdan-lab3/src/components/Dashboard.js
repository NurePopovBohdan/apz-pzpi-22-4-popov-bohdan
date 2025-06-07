import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState({});
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    vin_number: '',
  }); // Видалено user_id
  const [iotData, setIotData] = useState({});

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/my-vehicles', { withCredentials: true });
        setVehicles(res.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const fetchMaintenance = async (vehicleId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}/maintenance`, { withCredentials: true });
      setMaintenanceRecords(prev => ({ ...prev, [vehicleId]: res.data }));
    } catch (error) {
      console.error('Error fetching maintenance:', error);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        make: newVehicle.make,
        model: newVehicle.model,
        year: parseInt(newVehicle.year),
        vin_number: newVehicle.vin_number,
      };
      await axios.post('http://localhost:5000/api/vehicles', payload, { withCredentials: true });
      const res = await axios.get('http://localhost:5000/api/my-vehicles', { withCredentials: true });
      setVehicles(res.data);
      setNewVehicle({ make: '', model: '', year: '', vin_number: '' });
    } catch (error) {
      console.error('Error adding vehicle:', error.response?.data || error.message);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`, { withCredentials: true });
      setVehicles(vehicles.filter(v => v._id !== vehicleId));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const simulateIotData = (vehicleId) => {
    setInterval(() => {
      setIotData(prev => ({
        ...prev,
        [vehicleId]: {
          tirePressure: (Math.random() * (35 - 28) + 28).toFixed(1),
          batteryVoltage: (Math.random() * (13 - 11.5) + 11.5).toFixed(1),
          brakePadThickness: (Math.random() * (10 - 3) + 3).toFixed(1),
        },
      }));
    }, 5000);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
      
      {/* Form to add a vehicle */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Vehicle</h3>
        <form onSubmit={handleAddVehicle} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Make"
            value={newVehicle.make}
            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={newVehicle.year}
            onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="VIN Number"
            value={newVehicle.vin_number}
            onChange={(e) => setNewVehicle({ ...newVehicle, vin_number: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="col-span-2 bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Add Vehicle
          </button>
        </form>
      </div>

      {/* Vehicles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map(vehicle => (
          <div key={vehicle._id} className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold">{vehicle.make} {vehicle.model}</h3>
            <p>Year: {vehicle.year}</p>
            <p>VIN: {vehicle.vin_number}</p>

            {/* IoT Data Simulation */}
            <div className="mt-4">
              <h4 className="font-semibold">Sensor Data</h4>
              {iotData[vehicle._id] ? (
                <>
                  <p>Tire Pressure: {iotData[vehicle._id].tirePressure} PSI</p>
                  <p>Battery Voltage: {iotData[vehicle._id].batteryVoltage} V</p>
                  <p>Brake Pad Thickness: {iotData[vehicle._id].brakePadThickness} mm</p>
                </>
              ) : (
                <button
                  onClick={() => simulateIotData(vehicle._id)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2"
                >
                  Start Sensor Simulation
                </button>
              )}
            </div>

            {/* Maintenance Records */}
            <div className="mt-4">
              <h4 className="font-semibold">Maintenance Records</h4>
              {maintenanceRecords[vehicle._id] ? (
                maintenanceRecords[vehicle._id].length > 0 ? (
                  maintenanceRecords[vehicle._id].map(record => (
                    <div key={record._id} className="border-t pt-2 mt-2">
                      <p>Type: {record.maintenance_type}</p>
                      <p>Date: {new Date(record.maintenance_date).toLocaleDateString()}</p>
                      <p>Mileage: {record.mileage}</p>
                      <p>Comments: {record.comments || 'N/A'}</p>
                    </div>
                  ))
                ) : (
                  <p>No maintenance records found.</p>
                )
              ) : (
                <button
                  onClick={() => fetchMaintenance(vehicle._id)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2"
                >
                  View Maintenance Records
                </button>
              )}
            </div>

            <button
              onClick={() => handleDeleteVehicle(vehicle._id)}
              className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete Vehicle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;