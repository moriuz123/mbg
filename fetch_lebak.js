async function fetchLebak() {
  const resDistricts = await fetch('https://emsifa.github.io/api-wilayah-indonesia/api/districts/3602.json');
  const districts = await resDistricts.json();
  console.log(`Found ${districts.length} districts in Lebak.`);
  console.log(districts.slice(0, 3));
}
fetchLebak();
