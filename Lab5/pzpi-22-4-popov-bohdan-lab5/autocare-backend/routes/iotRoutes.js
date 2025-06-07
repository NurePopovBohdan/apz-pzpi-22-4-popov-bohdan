const express = require('express');
const router = express.Router();

const IoTData = require('../models/IoTData');

router.post('/iot-data', async (req, res) => {
  const { tirePressure, batteryVoltage, brakePadThickness } = req.body;

  try {
    const newData = new IoTData({
      tirePressure,
      batteryVoltage,
      brakePadThickness,
      timestamp: new Date(),
    });
    await newData.save();
    res.status(200).json({ message: 'Данные успешно сохранены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при сохранении данных' });
  }
});

module.exports = router;
