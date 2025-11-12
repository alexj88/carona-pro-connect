import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  useEffect(() => {
    // Inicializa o mapa
    const map = L.map("map").setView([-8.0476, -34.8770], 13); // Recife

    // Camada base (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Marcador inicial
    L.marker([-8.0476, -34.8770])
      .addTo(map)
      .bindPopup("Você está aqui! 🚗")
      .openPopup();

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default Map;
