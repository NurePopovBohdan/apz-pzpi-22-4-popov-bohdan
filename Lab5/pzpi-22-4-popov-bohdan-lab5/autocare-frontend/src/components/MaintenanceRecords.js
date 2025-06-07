import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MaintenanceRecords.css';

const MaintenanceRecords = () => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [maintenanceData, setMaintenanceData] = useState({
        tirePressure: { value: 0, unit: 'PSI', status: 'loading', threshold: { min: 25, max: 35 } },
        batteryVoltage: { value: 0, unit: 'V', status: 'loading', threshold: { min: 12, max: 14.4 } },
        brakePadThickness: { value: 0, unit: 'mm', status: 'loading', threshold: { min: 3, max: 12 } }
    });

    useEffect(() => {
        const fetchVehicleInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`, { withCredentials: true });
                setVehicleInfo(response.data);
            } catch (error) {
                console.error('Error fetching vehicle info:', error);
                navigate('/dashboard');
            }
        };

        const fetchMaintenanceData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}/maintenance-data`, { withCredentials: true });
                const data = response.data;
                
                // Update status based on thresholds
                const updatedData = {};
                Object.entries(maintenanceData).forEach(([key, sensorData]) => {
                    if (data[key] !== undefined) {
                        const value = data[key];
                        const status = getStatus(value, sensorData.threshold);
                        updatedData[key] = {
                            ...sensorData,
                            value: value,
                            status: status
                        };
                    }
                });
                
                setMaintenanceData(prev => ({
                    ...prev,
                    ...updatedData
                }));
            } catch (error) {
                console.error('Error fetching maintenance data:', error);
            }
        };

        fetchVehicleInfo();
        fetchMaintenanceData();
        
        // Fetch new data every 30 seconds
        const interval = setInterval(fetchMaintenanceData, 30000);
        return () => clearInterval(interval);
    }, [vehicleId, navigate]);

    const getStatus = (value, threshold) => {
        if (value < threshold.min) return 'critical';
        if (value > threshold.max) return 'critical';
        if (value < threshold.min + (threshold.max - threshold.min) * 0.2) return 'warning';
        if (value > threshold.max - (threshold.max - threshold.min) * 0.2) return 'warning';
        return 'normal';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical':
                return '#ff4444';
            case 'warning':
                return '#ffbb33';
            case 'normal':
                return '#00C851';
            default:
                return '#2BBBAD';
        }
    };

    return (
        <div className="maintenance-records">
            {vehicleInfo && (
                <h2>{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} - Maintenance Records</h2>
            )}
            <button 
                onClick={() => navigate('/dashboard')}
                className="back-button"
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#4a5568',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Back to Dashboard
            </button>
            <div className="maintenance-grid">
                {Object.entries(maintenanceData).map(([key, data]) => (
                    <div 
                        key={key} 
                        className="maintenance-item"
                        style={{ borderColor: getStatusColor(data.status) }}
                    >
                        <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <div className="value">
                            {data.status === 'loading' ? 'Loading...' : `${data.value.toFixed(1)} ${data.unit}`}
                        </div>
                        <div className="status" style={{ color: getStatusColor(data.status) }}>
                            Status: {data.status.toUpperCase()}
                        </div>
                        <div className="threshold">
                            Normal Range: {data.threshold.min} - {data.threshold.max} {data.unit}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MaintenanceRecords; 