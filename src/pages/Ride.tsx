import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MapView from "@/components/MapView";
import Header from "@/components/Header";

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
  const navigate = useNavigate(); // Added useNavigate hook
  const [geoLoading, setGeoLoading] = useState(false);
  const [currentCoordsState, setCurrentCoordsState] = useState<[number, number] | null>(null);
  const [createdRideId, setCreatedRideId] = useState<string | null>(null);
  const [createdSaved, setCreatedSaved] = useState(false);

  // Função para converter endereço em coordenadas (geocoding)
  const geocodeAddress = async (
    address: string
  ): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
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
      const currentCoords = currentCoordsState ?? (await geocodeAddress(currentLocation));
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
        // Persist created ride to localStorage so Map page can load it
        try {
          const newRideId = Date.now().toString();
          const now = new Date();
          const newRide = {
            id: newRideId,
            driverName: "Você",
            from: currentLocation,
            to: destination,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: now.toLocaleDateString(),
            availableSeats: 1,
            totalSeats: 1,
            rating: 5,
            group: "Pessoal",
            tags: [],
            driverAvatar: "",
            phone: "",
            matchPercentage: 100,
            sharedInterests: [],
            coords: {
              from: currentCoords,
              to: destinationCoords,
            },
          } as any;

          const existing = JSON.parse(localStorage.getItem("createdRides") || "[]");
          existing.push(newRide);
          localStorage.setItem("createdRides", JSON.stringify(existing));

          // show visual confirmation and display route in the embedded map
          setCreatedRideId(newRideId);
          setCreatedSaved(true);
          // scroll to map view
          setTimeout(() => {
            const el = document.getElementById("map-section");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);
        } catch (e) {
          console.error("Erro ao salvar carona criada:", e);
        }
      } else {
        alert(
          "Não foi possível encontrar um ou ambos os endereços. Tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar carona:", error);
      alert("Erro ao buscar caronas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não disponível no seu navegador.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoordsState([latitude, longitude]);

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const json = await resp.json();
          if (json && json.display_name) setCurrentLocation(json.display_name);
          else setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } catch (e) {
          setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        alert("Não foi possível obter a localização: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-6">Crie sua Carona</h1>
            <Card className="p-6">
              <h4>
                Preencha os detalhes da sua carona para conectar-se com colegas
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo de Local Atual */}
                <div className="space-y-2">
                  <Label htmlFor="current-location">Local Atual</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="current-location"
                      placeholder="Onde você está? (ex: Recife, PE)"
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      required
                    />
                    <Button type="button" variant="outline" onClick={useCurrentLocation} disabled={geoLoading}>
                      {geoLoading ? "Buscando..." : "Usar localização atual"}
                    </Button>
                  </div>
                </div>

                {/* Campo de Destino */}
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    placeholder="Para onde você quer ir? (ex: Camaragibe, PE)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                {/* Botão de Busca */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Carregando..." : "Criar Carona"}
                </Button>
              </form>

              {/* Exibe dados da carona criada */}
              {rideData && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Dados da Carona
                  </h3>
                  <p className="text-sm text-blue-800">
                    <strong>De:</strong> {rideData.currentLocation}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Para:</strong> {rideData.destination}
                  </p>
                  {createdSaved && createdRideId && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="gradient"
                        onClick={() => navigate(`/map/${createdRideId}`)}
                      >
                        Abrir mapa completo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const url = `${window.location.origin}/map/${createdRideId}`;
                          navigator.clipboard?.writeText(url);
                          alert("Link copiado: " + url);
                        }}
                      >
                        Copiar link
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Mapa */}
        <div id="map-section" className={`lg:col-span-2 h-[60vh] ${createdSaved ? 'ring-4 ring-emerald-200' : ''}`}>
          <MapView rideData={rideData} />
        </div>
      </div>
    </div>
  );
}
