import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RideCard from "./RideCard";
import CreateRideModal from "./CreateRideModal";
import { Plus, Search, Filter, MapPin, Calendar, Users } from "lucide-react";

interface DashboardProps {
  userEmail: string;
}

const Dashboard = ({ userEmail }: DashboardProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateRide, setShowCreateRide] = useState(false);


  // Mock data para demonstração
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
    },
    {
      id: "3",
      driverName: "Mariana Costa",
      from: "Boa Viagem",
      to: "Madalena",
      time: "07:45",
      date: "19/09",
      availableSeats: 3,
      totalSeats: 4,
      rating: 4.7,
      group: "Estratégia",
      tags: ["Pontual", "Conversa"],
    },
  ];

  const mockGroups = [
    { name: "Tecnologia", members: 234, rides: 45 },
    { name: "Consultoria", members: 189, rides: 32 },
    { name: "Estratégia", members: 156, rides: 28 },
    { name: "Design", members: 98, rides: 18 },
  ];

  const handleJoinRide = (rideId: string) => {
   navigate(`/map/${rideId}`);
    // Aqui seria implementada a lógica para solicitar participação na carona
  };

  const filteredRides = mockRides.filter(
    (ride) =>
      ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Bem-vindo ao Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encontre caronas disponíveis, crie novos grupos e conecte-se com
              sua equipe
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">
                  Caronas Hoje
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">156</div>
                <div className="text-sm text-muted-foreground">
                  Usuários Ativos
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">12</div>
                <div className="text-sm text-muted-foreground">Meus Grupos</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">420</div>
                <div className="text-sm text-muted-foreground">
                  Economia Mensal
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="rides" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rides">Caronas Disponíveis</TabsTrigger>
              <TabsTrigger value="groups">Meus Grupos</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="rides" className="space-y-6">
              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por origem, destino ou motorista..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => setShowCreateRide(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Carona
                </Button>
              </div>

              {/* Rides Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRides.map((ride) => (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    onJoinRide={handleJoinRide}
                  />
                ))}
              </div>

              {filteredRides.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma carona encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar sua busca ou crie uma nova carona
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGroups.map((group, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-card border-0 hover:shadow-card transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{group.name}</span>
                        <Badge variant="secondary">
                          {group.members} membros
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {group.rides} caronas ativas este mês
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Ativo</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Grupo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Histórico de Caronas</span>
                  </CardTitle>
                  <CardDescription>
                    Suas caronas realizadas nos últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Seu histórico aparecerá aqui conforme você participar de
                      caronas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateRideModal
        isOpen={showCreateRide}
        onClose={() => setShowCreateRide(false)}
        onCreateRide={(rideData) => {
          console.log("Creating ride:", rideData);
          setShowCreateRide(false);
        }}
      />
    </div>
  );
};

export default Dashboard;
