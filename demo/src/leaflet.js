import {
  LeafletMap,
  Tile,
  Marker,
  Circle,
  Polygon,
} from "@zikojs/leaflet";

// Declarative Map setup
const map = LeafletMap(
  {
    center: [34.0333, -5.0], // Fez, Morocco coordinates
    zoom: 13,
    height: "500px",
  },
  Tile({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  }),
  Marker({
    position: [34.0333, -5.0],
    popup: "<b>Hello from Fez!</b>",
    events: {
      onClick: (e) => console.log("Marker clicked", e.latlng),
    },
  }),
  Circle({
    center: [34.035, -4.99],
    radius: 500,
    color: "#4f46e5",
    fillColor: "#6366f1",
    fillOpacity: 0.4,
    popup: "Coverage Zone",
  }),
  Polygon({
    positions: [
      [34.04, -5.01],
      [34.04, -4.98],
      [34.02, -4.99],
    ],
    color: "#ef4444",
    fillColor: "#f87171",
    fillOpacity: 0.3,
  })
);

map.style({ width : '100vw', height : '100vh'})
// Append to DOM tree
map.mount(document.body);