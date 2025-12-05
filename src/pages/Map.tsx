import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, MessageCircle, Check } from "lucide-react";

// Mock das caronas (pode ser o mesmo do Dashboard)
const baseMockRides = [
  {
    id: "1",
    driverName: "Ana Silva",
    from: "Recife",
    to: "Cidade Universitária",
    time: "08:00",
    date: "18/09",
    availableSeats: 2,
    totalSeats: 4,
    rating: 4.8,
    group: "Tecnologia",
    tags: ["Regular", "Não fumante"],
    driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    phone: "+55 81 98765-4321",
    matchPercentage: 95,
    sharedInterests: ["Tecnologia", "Sustentabilidade", "Música"],
    coords: {
      from: [-8.0476, -34.8770],
      to: [-8.0561, -34.9500],
    },
  },
  {
    id: "2",
    driverName: "Carlos Santos",
    from: "Caxangá",
    to: "Graças",
    time: "18:30",
    date: "18/09",
    availableSeats: 1,
    totalSeats: 3,
    rating: 4.9,
    group: "Consultoria",
    tags: ["Ar condicionado", "Música"],
    driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    phone: "+55 81 99876-5432",
    matchPercentage: 88,
    sharedInterests: ["Consultoria", "Viagens"],
    coords: {
      from: [-8.0402, -34.9458],
      to: [-8.0372, -34.8970],
    },
  },

];

// (Removido: mockUsers — substituído por chat direto com motorista)

const MapPage = () => {
  const { rideId } = useParams();
  const [rides, setRides] = useState<typeof baseMockRides>(baseMockRides as any);

  // debug logs to help diagnose blank screen
  useEffect(() => {
    console.log("Map component mounted", { rideId });
  }, [rideId]);

  useEffect(() => {
    const loadCreatedRides = () => {
      try {
        const created = JSON.parse(localStorage.getItem("createdRides") || "[]");
        if (Array.isArray(created)) return created;
      } catch (e) {
        // ignore
      }
      return [];
    };

    const created = loadCreatedRides();
    setRides([...baseMockRides, ...created]);
  }, []);

  const ride = rides.find((r: any) => r.id === rideId);
  const [hasRequested, setHasRequested] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const driverLineRef = useRef<L.Polyline | null>(null);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ from: string; text: string; time: string }>>([
    { from: "driver", text: "Olá! Sou o motorista, em que posso ajudar?", time: new Date().toLocaleTimeString() },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!ride) return;

    // Se não houver coords, não inicializa o mapa aqui
    if (!ride.coords || !ride.coords.from || !ride.coords.to) return;

    const fromTuple = ride.coords.from as [number, number];
    const toTuple = ride.coords.to as [number, number];

    // Inicializa o mapa
    const map = L.map("map").setView(fromTuple, 13);

    // Camada base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Ícones personalizados
    const driverIcon = L.icon({
      iconUrl:
        "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    const destinationIcon = L.icon({
      iconUrl:
        "https://cdn-icons-png.flaticon.com/512/854/854894.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Marcadores de origem e destino (motorista)
    

    const fromMarker = L.marker(fromTuple, { icon: driverIcon })
      .addTo(map)
      .bindPopup('<b>Motorista: ' + String(ride.driverName) + '</b><br>Origem: ' + String(ride.from))
      .openPopup();

    const toMarker = L.marker(toTuple, { icon: destinationIcon })
      .addTo(map)
      .bindPopup('<b>Destino:</b> ' + String(ride.to));

    // Rota real usando leaflet-routing-machine (mais precisa que uma linha reta)
    let routingControl: any = null;
    try {
      routingControl = (L as any).Routing.control({
        waypoints: [
          L.latLng(fromTuple[0], fromTuple[1]),
          L.latLng(toTuple[0], toTuple[1]),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        language: "pt-BR",
        units: "metric",
        show: false,
        lineOptions: {
          styles: [{ color: "#007bff", weight: 5 }],
        },
      }).addTo(map);
      } catch (e) {
      // fallback: linha reta se routing-machine não funcionar
      L.polyline([fromTuple, toTuple], { color: "#007bff", weight: 4, opacity: 0.7, dashArray: "10,6" }).addTo(map);
    }

    // guarda referência ao mapa e à linha do motorista
    mapRef.current = map;
    driverLineRef.current = null;
    // guarda controle para remoção
    (driverLineRef as any).currentRouting = routingControl;

    // Ajusta o zoom para caber tudo (apenas rota do motorista por enquanto)
    try {
      // se routingControl existir, fit nos waypoints; caso contrário usa bounds simples entre origem/destino
      if ((driverLineRef as any).currentRouting && (driverLineRef as any).currentRouting.getPlan) {
        const plan = (driverLineRef as any).currentRouting.getPlan();
        const waypoints = plan.getWaypoints ? plan.getWaypoints() : null;
          if (waypoints && waypoints.length > 0) {
          const latlngs = waypoints.map((w: any) => L.latLng(w.latLng.lat, w.latLng.lng));
          map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50] });
        } else {
          map.fitBounds(L.latLngBounds([fromTuple, toTuple]), { padding: [50, 50] });
        }
      } else {
        map.fitBounds(L.latLngBounds([fromTuple, toTuple]), { padding: [50, 50] });
      }
    } catch (e) {
      map.fitBounds(L.latLngBounds([fromTuple, toTuple]), { padding: [50, 50] });
    }

    return () => {
      if ((driverLineRef as any).currentRouting) {
        try { (driverLineRef as any).currentRouting.remove(); } catch (e) {}
      }
      map.remove();
    };
  }, [ride]);

  // geocode helper to attempt resolving addresses when coords are missing
  const geocodeAddress = async (address: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  const tryGeocodeRide = async () => {
    if (!ride) return;
    const fromCoords = ride.from ? await geocodeAddress(ride.from) : null;
    const toCoords = ride.to ? await geocodeAddress(ride.to) : null;

    const updated = { ...ride, coords: { from: fromCoords ? [fromCoords.lat, fromCoords.lon] : null, to: toCoords ? [toCoords.lat, toCoords.lon] : null } };

    // update localStorage createdRides if this ride is part of createdRides
    try {
      const created = JSON.parse(localStorage.getItem("createdRides") || "[]");
      const idx = created.findIndex((r: any) => r.id === ride.id);
      if (idx >= 0) {
        created[idx] = updated;
        localStorage.setItem("createdRides", JSON.stringify(created));
      }
    } catch (e) {
      // ignore
    }

    // refresh rides state so map can initialize
    setRides((prev: any) => prev.map((r: any) => (r.id === updated.id ? updated : r)));
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  // Chat will be opened via button (see UI below)

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)] text-lg font-semibold">
          Carona não encontrada 🚗
        </div>
      </div>
    );
  }

  const coordsMissing = !ride.coords || !ride.coords.from || !ride.coords.to;

  if (coordsMissing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        <div className="w-full md:w-2/3 h-1/2 md:h-full flex items-center justify-center bg-muted">
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Endereços sem coordenadas</h3>
            <p className="mb-4">Não foi possível obter coordenadas para os endereços informados.</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={tryGeocodeRide}>Tentar geocodificar novamente</Button>
              <Button variant="outline" onClick={() => window.history.back()}>Voltar</Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Origem: {ride.from}</p>
            <p className="text-sm text-muted-foreground">Destino: {ride.to}</p>
          </div>
        </div>

        {/* Painel de Match com Motorista (mostra informações mesmo sem mapa) */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto bg-background md:border-l border-t md:border-t-0">
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Match com Motorista</h2>
            </div>
            <Card className="border-0 bg-gradient-card">
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={ride.driverAvatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">{getInitials(ride.driverName)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{ride.driverName}</h3>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{ride.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Compatibilidade</span>
                    <span className="text-lg font-bold text-success">{ride.matchPercentage}%</span>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-success" />
                    <span>{ride.from}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-destructive" />
                    <span>{ride.to}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Mapa */}
        <div id="map" className="w-full md:w-2/3 h-1/2 md:h-full" />

        {/* Painel de Match com Motorista */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto bg-background md:border-l border-t md:border-t-0">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Match com Motorista
              </h2>
            </div>

            {/* Card do Motorista */}
            <Card className="border-0 bg-gradient-card">
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={ride.driverAvatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(ride.driverName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{ride.driverName}</h3>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{ride.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Match Percentage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Compatibilidade</span>
                    <span className="text-lg font-bold text-success">{ride.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${ride.matchPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Informações da Carona */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-success" />
                    <span>{ride.from}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-destructive" />
                    <span>{ride.to}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{ride.time} - {ride.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{ride.availableSeats} de {ride.totalSeats} vagas disponíveis</span>
                  </div>
                </div>

                {/* Interesses em Comum */}
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-semibold">Interesses em Comum:</p>
                  <div className="flex flex-wrap gap-2">
                    {ride.sharedInterests.map((interest, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary">
                        <Check className="h-3 w-3 mr-1" />
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-semibold">Características:</p>
                  <div className="flex flex-wrap gap-2">
                    {ride.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="space-y-3 pt-4">
              {!hasRequested ? (
                <>
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={() => setHasRequested(true)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Solicitar Carona
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowChat(true)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </>
              ) : (
                <div className="bg-success/10 border border-success rounded-lg p-4 text-center space-y-2">
                  <div className="flex justify-center">
                    <Check className="h-6 w-6 text-success" />
                  </div>
                  <p className="font-semibold text-sm">Solicitação Enviada!</p>
                  <p className="text-xs text-muted-foreground">
                    Aguardando resposta do motorista
                  </p>
                </div>
              )}
            </div>

            {/* Chat */}
            {showChat && (
              <div className="pt-4 border-t space-y-3">
                <h4 className="text-sm font-semibold">Chat com {ride.driverName.split(" ")[0]}</h4>

                <div className="h-48 md:h-64 overflow-y-auto p-2 bg-card rounded-md space-y-2" id="chat-scroll">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-lg ${m.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <div className="text-xs text-muted-foreground mb-1">{m.time}</div>
                        <div className="text-sm">{m.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 border rounded-md"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                  />

                  <Button
                    onClick={() => {
                      if (!newMessage.trim()) return;

                      const msg = { from: 'me', text: newMessage.trim(), time: new Date().toLocaleTimeString() };
                      setChatMessages((s) => [...s, msg]);
                      setNewMessage('');

                      setTimeout(() => {
                        const reply = { from: 'driver', text: 'Recebi sua mensagem, vou verificar.', time: new Date().toLocaleTimeString() };
                        setChatMessages((s) => [...s, reply]);
                        const el = document.getElementById('chat-scroll');
                        if (el) el.scrollTop = el.scrollHeight;
                      }, 1200);

                      const el = document.getElementById('chat-scroll');
                      setTimeout(() => { if (el) el.scrollTop = el.scrollHeight; }, 50);
                    }}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
