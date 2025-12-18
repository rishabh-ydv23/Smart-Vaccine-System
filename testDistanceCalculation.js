// Test the distance calculation function
const testDistanceCalculation = () => {
  console.log('Testing Distance Calculation...\n');
  
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
  
  // Test coordinates for Ludhiana hospitals
  const userLocation = { lat: 30.9010, lng: 75.8572 }; // Amritsar
  const hospitals = [
    { name: "Civil Hospital Ludhiana", lat: 30.9010, lng: 75.8572 },
    { name: "District Hospital Ludhiana", lat: 30.9100, lng: 75.8600 },
    { name: "Government Medical College Ludhiana", lat: 30.8900, lng: 75.8500 },
    { name: "ESIC Hospital Ludhiana", lat: 30.9200, lng: 75.8700 }
  ];
  
  console.log('User Location: Amritsar (30.9010, 75.8572)');
  console.log('----------------------------------------');
  
  hospitals.forEach(hospital => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      hospital.lat,
      hospital.lng
    );
    
    console.log(`${hospital.name}: ${distance.toFixed(2)} km`);
  });
  
  console.log('\nDistance calculation test completed.');
};

testDistanceCalculation();