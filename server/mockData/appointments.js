// Mock appointment data for when database is unavailable
const mockAppointments = [
  {
    "_id": "1",
    "userId": "user123",
    "vaccineId": {
      "_id": "1",
      "name": "COVID-19 Vaccine (Pfizer)"
    },
    "hospitalId": "hospital123",
    "date": "2023-06-15T10:30:00.000Z",
    "time": "10:30",
    "status": "completed",
    "createdAt": "2023-06-10T09:00:00.000Z",
    "updatedAt": "2023-06-15T11:00:00.000Z"
  },
  {
    "_id": "2",
    "userId": "user123",
    "vaccineId": {
      "_id": "3",
      "name": "Hepatitis B Vaccine"
    },
    "hospitalId": "hospital456",
    "date": "2023-06-20T14:00:00.000Z",
    "time": "14:00",
    "status": "scheduled",
    "createdAt": "2023-06-12T11:30:00.000Z",
    "updatedAt": "2023-06-12T11:30:00.000Z"
  }
];

module.exports = mockAppointments;