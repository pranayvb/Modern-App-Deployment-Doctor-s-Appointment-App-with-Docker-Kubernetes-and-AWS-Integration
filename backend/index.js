const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://mongo:27017/appointments')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const AppointmentSchema = new mongoose.Schema({
  patientName: String,
  doctorName: String,
  date: Date,
});


const Appointment = mongoose.model('Appointment', AppointmentSchema);

app.get('/appointments', async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});


app.post('/appointments', async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.json(appointment);
});

app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).send('MongoDB is running');
  } catch (err) {
    res.status(500).send('MongoDB is down');
  }
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});