mapboxgl.accessToken = mapToken;
const coordinates = campground.geometry.coordinates;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/gpnl/cko7buabf3ca718team2loe67", // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
