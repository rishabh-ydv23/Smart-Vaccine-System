// Test the map URL generation
const testMapUrl = () => {
  const lat = '30.9010';
  const lng = '75.8572';
  const delta = 0.05;
  const bbox = [
    parseFloat(lng) - delta,
    parseFloat(lat) - delta,
    parseFloat(lng) + delta,
    parseFloat(lat) + delta
  ];
  
  let url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join(',')}&layer=mapnik`;
  url += `&marker=${lat},${lng}`;
  
  console.log('Generated Map URL:');
  console.log(url);
};

testMapUrl();