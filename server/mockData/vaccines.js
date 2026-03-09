// Mock vaccine data for when database is unavailable
const mockVaccines = [
  {
    "_id": "1",
    "name": "COVID-19 Vaccine (Pfizer)",
    "doseRequired": 2,
    "availableQuantity": 100,
    "location": {
      "type": "Point",
      "coordinates": [77.2088, 28.6139],
      "address": "123 Healthcare Ave",
      "city": "New Delhi",
      "pinCode": "110001"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "_id": "2", 
    "name": "COVID-19 Vaccine (Moderna)",
    "doseRequired": 2,
    "availableQuantity": 80,
    "location": {
      "type": "Point",
      "coordinates": [77.22634, 28.63493],
      "address": "456 Medical Plaza",
      "city": "New Delhi",
      "pinCode": "110001"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "_id": "3",
    "name": "Hepatitis B Vaccine",
    "doseRequired": 3,
    "availableQuantity": 50,
    "location": {
      "type": "Point",
      "coordinates": [77.2599, 28.5952],
      "address": "789 Wellness St",
      "city": "New Delhi",
      "pinCode": "110048"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "_id": "4",
    "name": "Influenza Vaccine",
    "doseRequired": 1,
    "availableQuantity": 120,
    "location": {
      "type": "Point",
      "coordinates": [77.1825, 28.5828],
      "address": "101 Health Blvd",
      "city": "New Delhi",
      "pinCode": "110028"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "_id": "5",
    "name": "MMR Vaccine",
    "doseRequired": 2,
    "availableQuantity": 60,
    "location": {
      "type": "Point",
      "coordinates": [77.2728, 28.5417],
      "address": "202 Immunization Rd",
      "city": "New Delhi",
      "pinCode": "110092"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
];

module.exports = mockVaccines;