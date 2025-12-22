// Test the improved map URL generation with markers
const testMapUrlWithMarkers = () => {
  const lat = '30.9010';
  const lng = '75.8572';
  const delta = 0.05;
  const bbox = [
    parseFloat(lng) - delta,
    parseFloat(lat) - delta,
    parseFloat(lng) + delta,
    parseFloat(lat) + delta
  ];
  
  // Create base URL
  let url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join(',')}&layer=mapnik`;
  
  // Add marker for user location with label
  url += `&marker=${lat},${lng}(You%20are%20here)`;
  
  // Add sample hospital markers
  const sampleHospitals = [
    { name: "Government Medical College", coordinates: [30.9123, 75.8654] },
    { name: "Civil Hospital", coordinates: [30.8956, 75.8421] },
    { name: "District Hospital", coordinates: [30.9089, 75.8732] }
  ];
  
  sampleHospitals.forEach((hospital, index) => {
    const hospLat = hospital.coordinates[0];
    const hospLng = hospital.coordinates[1];
    const name = encodeURIComponent(hospital.name.substring(0, 20));
    url += `&marker=${hospLat},${hospLng}(${name})`;
  });
  
  console.log('Generated Map URL with Markers:');
  console.log(url);
  console.log('\nURL Length:', url.length);
};

testMapUrlWithMarkers();