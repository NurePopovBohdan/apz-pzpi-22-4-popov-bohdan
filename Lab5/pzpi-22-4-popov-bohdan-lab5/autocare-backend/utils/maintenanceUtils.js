const Maintenance = require('../models/maintenance');

/**
 * Checks the condition of the vehicle and adds records of problems to the database.
 * @param {Object} vehicle -Vehicle object from the database.
 */
async function checkAndCreateMaintenance(vehicle) {
  const issues = [];

  if (vehicle.tirePressure < 20 || vehicle.tirePressure > 40) {
    issues.push('Low or high tire pressure');
  }
  if (vehicle.batteryVoltage < 11) {
    issues.push('Low battery voltage');
  }
  if (vehicle.brakePadThickness < 3) {
    issues.push('Brake pads are worn out');
  }

  for (const issue of issues) {
    const existingIssue = await Maintenance.findOne({
      vehicle_id: vehicle._id,
      maintenance_type: issue,
      resolved: false
    });

    if (!existingIssue) {
      await Maintenance.create({
        vehicle_id: vehicle._id,
        maintenance_type: issue,
        maintenance_date: new Date(),
        mileage: 0,
        comments: `Detected via IoT device`
      });
      console.log(`Maintenance issue logged: ${issue}`);
    }
  }
}

module.exports = { checkAndCreateMaintenance };
