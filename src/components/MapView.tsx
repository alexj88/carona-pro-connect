import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RideData {
  currentLocation: string;
  destination: string;
  currentCoords?: [number, number];
  destinationCoords?: [number, number];
}

interface MapViewProps {
  rideData?: RideData | null;
}

export default function MapView({ rideData }: MapViewProps) {
  useEffect(() => {
    const map = L.map("map").setView([-8.0476, -34.8770], 13); // Recife

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Se houver dados de carona, adiciona marcadores
    if (rideData && rideData.currentCoords && rideData.destinationCoords) {
      // Marcador do local atual (verde)
      L.marker(rideData.currentCoords, {
        title: "Local Atual",
      })
        .addTo(map)
        .bindPopup(`<b>Saída:</b> ${rideData.currentLocation}`)
        .openPopup();

      // Marcador do destino (vermelho)
      const redMarkerIcon = L.divIcon({
        html: `<div style="background-color: #b32626ff; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [25, 25],
        className: "custom-marker",
      });

      L.marker(rideData.destinationCoords, {
        icon: redMarkerIcon,
        title: "Destino",
      })
        .addTo(map)
        .bindPopup(`<b>Destino:</b> ${rideData.destination}`)
        .openPopup();

      // Desenha uma linha entre os dois pontos
      L.polyline(
        [rideData.currentCoords, rideData.destinationCoords],
        {
          color: "blue",
          weight: 2,
          opacity: 0.7,
          dashArray: "5, 5",
        }
      ).addTo(map);

      // Ajusta o zoom para mostrar ambos os marcadores
      const group = L.featureGroup([
        L.marker(rideData.currentCoords),
        L.marker(rideData.destinationCoords),
      ]);
      map.fitBounds(group.getBounds().pad(0.1));
    } else {
      // Marcador padrão se não houver dados
      L.marker([-8.0476, -34.8770])
        .addTo(map)
        .bindPopup("Você está aqui! 🚗")
        .openPopup();
    }

    return () => {
      map.remove();
    };
  }, [rideData]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}
