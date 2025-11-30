import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const { id } = useParams();

  // Coordenadas para o mapa (formato [lat, lng] para Leaflet)
  const origin = [-8.0476, -34.877];
  const destination = [-8.055, -34.9515];
  
  // Array de coordenadas para a polyline
  const polylineCoordinates = [origin, destination];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Rota da Carona {id}</h1>

      <MapContainer
        center={origin}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <Marker position={origin}>
          <Popup>Origem</Popup>
        </Marker>
        
        <Marker position={destination}>
          <Popup>Destino</Popup>
        </Marker>
        
        <Polyline 
          positions={polylineCoordinates} 
          color="blue" 
          weight={4}
        />
      </MapContainer>
    </div>
  );
};

export default MapPage;