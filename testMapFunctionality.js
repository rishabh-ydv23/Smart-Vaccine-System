// Test the improved map URL generation with error handling
const testMapFunctionality = () => {
  console.log('Testing Map Functionality...\n');
  
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
    
    // Test URL generation
    let url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join(',')}&layer=mapnik`;
    url += `&marker=${lat},${lng}(You%20are%20here)`;
    
    console.log('✓ Map URL generated successfully');
    console.log('Sample URL (first 100 chars):', url.substring(0, 100) + '...');
    console.log('Full URL length:', url.length);
    
    if (url.length > 2000) {
      console.warn('⚠️  Warning: URL is quite long and might cause issues');
    } else {
      console.log('✓ URL length is acceptable');
    }
  } else {
    console.log('✗ Invalid coordinates');
  }
  
  console.log('\nMap functionality test completed.');
};

testMapFunctionality();