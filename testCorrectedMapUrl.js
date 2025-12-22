// Test the corrected map URL generation without labels
const testCorrectedMapUrl = () => {
  console.log('Testing Corrected Map URL Generation...\n');
  
  // Test coordinate validation
  const lat = '30.9010';
  const lng = '75.8572';
  
  if (lat && lng) {
    console.log('✓ Coordinates are valid');
    
    // Test bounding box calculation
    const delta = 0.05;
    const bbox = [
      parseFloat(lng) - delta,
      parseFloat(lat) - delta,
      parseFloat(lng) + delta,
      parseFloat(lat) + delta
    ];
    
    console.log('✓ Bounding box calculated:', bbox);
    
    // Test URL generation WITHOUT labels
    let url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join(',')}&layer=mapnik`;
    url += `&marker=${lat},${lng}`; // No label
    
    // Add sample hospital markers without labels
    const sampleCoords = [
      [31.3256, 75.5725],
      [31.634, 74.8719],
      [31.5145, 75.0794]
    ];
    
    sampleCoords.forEach(([hospLat, hospLng]) => {
      url += `&marker=${hospLat},${hospLng}`;
    });
    
    console.log('✓ Map URL generated successfully (without labels)');
    console.log('Sample URL (first 100 chars):', url.substring(0, 100) + '...');
    console.log('Full URL length:', url.length);
    
    if (url.length > 2000) {
      console.warn('⚠️  Warning: URL is quite long and might cause issues');
    } else {
      console.log('✓ URL length is acceptable');
    }
    
    console.log('\nURL Preview:');
    console.log(url);
  } else {
    console.log('✗ Invalid coordinates');
  }
  
  console.log('\nCorrected map URL test completed.');
};

testCorrectedMapUrl();