import { useParams } from "react-router-dom";
import MapView, { Marker, Polyline } from "react-native-maps";

const MapPage = () => {
  const { id } = useParams();

  // Aqui você vai buscar a carona pelo ID se quiser no futuro
  // Por agora apenas mostra o mapa
  const exampleCoordinates = [
    { latitude: -8.0476, longitude: -34.8770 },
    { latitude: -8.0550, longitude: -34.9515 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Rota da Carona {id}</h1>

      <MapView
        style={{ width: "100%", height: 400 }}
        initialRegion={{
          latitude: exampleCoordinates[0].latitude,
          longitude: exampleCoordinates[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={exampleCoordinates[0]} title="Origem" />
        <Marker coordinate={exampleCoordinates[1]} title="Destino" />
        <Polyline coordinates={exampleCoordinates} strokeWidth={4} />
      </MapView>
    </div>
  );
};

export default MapPage;
