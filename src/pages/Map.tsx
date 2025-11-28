import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, MessageCircle, Check } from "lucide-react";

// Mock das caronas (pode ser o mesmo do Dashboard)
const mockRides = [
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

const Map = () => {
  const { rideId } = useParams();
  const ride = mockRides.find((r) => r.id === rideId);
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

    // Inicializa o mapa
    const map = L.map("map").setView([ride.coords.from[0], ride.coords.from[1]], 13);

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
    const fromMarker = L.marker([ride.coords.from[0], ride.coords.from[1]], { icon: driverIcon })
      .addTo(map)
      .bindPopup(`<b>Motorista: ${ride.driverName}</b><br>Origem: ${ride.from}`)
      .openPopup();

    const toMarker = L.marker([ride.coords.to[0], ride.coords.to[1]], { icon: destinationIcon })
      .addTo(map)
      .bindPopup(`<b>Destino:</b> ${ride.to}`);

    // Linha entre os pontos
    const routeLine = L.polyline([[ride.coords.from[0], ride.coords.from[1]], [ride.coords.to[0], ride.coords.to[1]]], {
      color: "#007bff",
      weight: 4,
      opacity: 0.7,
      dashArray: "10,6",
    }).addTo(map);

    // guarda referência ao mapa e à linha do motorista
    mapRef.current = map;
    driverLineRef.current = routeLine;

    // Ajusta o zoom para caber tudo (apenas rota do motorista por enquanto)
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    return () => {
      map.remove();
    };
  }, [ride]);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  // Chat will be opened via button (see UI below)

  if (!ride) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Carona não encontrada 🚗
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
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

          {/* Chat com o motorista (abre quando o usuário clica em "Enviar Mensagem") */}
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
                    // simula resposta do motorista
                    setTimeout(() => {
                      const reply = { from: 'driver', text: 'Recebi sua mensagem, vou verificar.', time: new Date().toLocaleTimeString() };
                      setChatMessages((s) => [...s, reply]);
                      // scroll to bottom
                      const el = document.getElementById('chat-scroll');
                      if (el) el.scrollTop = el.scrollHeight;
                    }, 1200);
                    // scroll to bottom
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
  );
};

export default Map;
