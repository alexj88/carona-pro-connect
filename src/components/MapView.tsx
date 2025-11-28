import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

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
    const map = L.map("map").setView([-8.0476, -34.8770], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    let routingControl: any = null;

    if (rideData?.currentCoords && rideData?.destinationCoords) {
      // Marcador atual
      L.marker(rideData.currentCoords, { title: "Local Atual" })
        .addTo(map)
        .bindPopup(`<b>Saída:</b> ${rideData.currentLocation}`);

      // Marcador destino (vermelho)
      const redIcon = L.divIcon({
        html: `<div style="background-color: #b32626ff; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [25, 25],
        className: "custom-marker",
      });

      L.marker(rideData.destinationCoords, {
        icon: redIcon,
        title: "Destino",
      })
        .addTo(map)
        .bindPopup(`<b>Destino:</b> ${rideData.destination}`);

      // 🚗 **Rota de carro REAL**
      routingControl = (L as any).Routing.control({
        waypoints: [
          L.latLng(rideData.currentCoords[0], rideData.currentCoords[1]),
          L.latLng(
            rideData.destinationCoords[0],
            rideData.destinationCoords[1]
          ),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
        lineOptions: {
          styles: [{ color: "blue", weight: 5 }],
        },
      }).addTo(map);
    }

    return () => {
      map.remove();
      if (routingControl) {
        routingControl.remove();
      }
    };
  }, [rideData]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}
