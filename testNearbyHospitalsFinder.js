// Test the Nearby Hospitals Finder component functionality
const testNearbyHospitalsFinder = () => {
  console.log('Testing Nearby Hospitals Finder...\n');
  
  // Haversine formula implementation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  
  // Sample user location (Amritsar)
  const userLocation = { latitude: 31.6964, longitude: 74.7974 };
  
  // Sample hospitals
  const hospitals = [
    {
      name: "Government Medical College & Hospital",
      city: "Amritsar",
      latitude: 31.6964,
      longitude: 74.7974
    },
    {
      name: "Civil Hospital",
      city: "Ludhiana",
      latitude: 30.9010,
      longitude: 75.8572
    },
    {
      name: "Government Medical College",
      city: "Patiala",
      latitude: 30.3391,
      longitude: 76.3892
    }
  ];
  
  console.log('User Location: Amritsar (31.6964, 74.7974)');
  console.log('----------------------------------------');
  
  // Find nearest hospital
  let nearest = null;
  let shortestDistance = Infinity;

  hospitals.forEach(hospital => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      hospital.latitude,
      hospital.longitude
    );

    console.log(`${hospital.name} (${hospital.city}): ${distance.toFixed(2)} km`);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = {
        ...hospital,
        distance: distance.toFixed(2)
      };
    }
  });
  
  console.log('\n--- Nearest Hospital ---');
  if (nearest) {
    console.log(`Hospital: ${nearest.name}`);
    console.log(`City: ${nearest.city}`);
    console.log(`Distance: ${nearest.distance} km`);
  }
  
  console.log('\nNearby Hospitals Finder test completed.');
};

testNearbyHospitalsFinder();