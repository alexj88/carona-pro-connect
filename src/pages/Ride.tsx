import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MapView from "@/components/MapView";

interface RideData {
  currentLocation: string;
  destination: string;
  currentCoords?: [number, number];
  destinationCoords?: [number, number];
}

export default function Ride() {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [rideData, setRideData] = useState<RideData | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para converter endereço em coordenadas (geocoding)
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error("Erro ao fazer geocoding:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Faz o geocoding de ambos os endereços
      const currentCoords = await geocodeAddress(currentLocation);
      const destinationCoords = await geocodeAddress(destination);

      if (currentCoords && destinationCoords) {
        setRideData({
          currentLocation,
          destination,
          currentCoords,
          destinationCoords,
        });
        console.log("Dados da carona:", {
          currentLocation,
          destination,
          currentCoords,
          destinationCoords,
        });
      } else {
        alert("Não foi possível encontrar um ou ambos os endereços. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao buscar carona:", error);
      alert("Erro ao buscar caronas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-6">Crie sua Carona</h1>
            <Card className="p-6">
              <h4>Preencha os detalhes da sua carona para conectar-se com colegas</h4>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo de Local Atual */}
                <div className="space-y-2">
                  <Label htmlFor="current-location">Local Atual</Label>
                  <Input
                    id="current-location"
                    placeholder="Onde você está? (ex: Recife, PE)"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    required
                  />
                </div>

                {/* Campo de Destino */}
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    placeholder="Para onde você quer ir? (ex: São Paulo, SP)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                {/* Botão de Busca */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Criar Carona"}
                </Button>
              </form>

              {/* Exibe dados da carona criada */}
              {rideData && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Carona Criada!</h3>
                  <p className="text-sm text-blue-800">
                    <strong>De:</strong> {rideData.currentLocation}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Para:</strong> {rideData.destination}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Mapa */}
        <div className="lg:col-span-2">
          <MapView rideData={rideData} />
        </div>
      </div>
    </div>
  );
}
