import { useState, useEffect } from "react";
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

interface Driver {
  id: number;
  nome: string; // Adapte os campos conforme o retorno real do seu GET /api/motoristas
  email: string;
  veiculo?: string;
  placa?: string;
  avaliacao?: number; 
  localizacao_atual?: string; 
  // Propriedades do MOCK que o RideCard ainda espera (e que precisam ser corrigidas no backend):
  driverName: string; // Vai ser mapeado para 'nome'
  driverAvatar: string;
  from: string; // Vai ser mapeado para 'localizacao_atual'
  to: string;
  time: string;
  date: string;
  availableSeats: number;
  totalSeats: number;
  rating: number; // Vai ser mapeado para 'avaliacao'
  price: number;
  group: string;
  tags: string[];
}


interface Group {
  name: string;
  members: number;
  rides: number;
}

const Dashboard = ({ userEmail }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateRide, setShowCreateRide] = useState(false);

  const [rides, setRides] = useState<Driver[]>([]); 
  const [groups, setGroups] = useState<Group[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const handleJoinRide = (rideId: string) => {
    console.log("Joining ride:", rideId);
    // Aqui seria implementada a lógica para solicitar participação na carona
  };

  const fetchAvailableRides = async () => {
    setLoading(true); // Ativa o estado de carregamento
    setError(null);
    try {
      // Faz a requisição para a rota do backend que lista os motoristas
      // Assumindo que o backend está rodando em http://localhost:3001
      const response = await fetch('http://localhost:3001/api/motoristas'); 
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar motoristas. Status: ${response.status}`);
      }
      
      // Converte a resposta para JSON
      const data = await response.json(); 
      
      // Preenche o estado 'rides' com os motoristas reais
      setRides(data); 
      
      // *Se você tiver uma rota para grupos, faria a busca aqui*
      
    } catch (err) {
      console.error("Erro na API ao buscar motoristas:", err);
      // Trata e armazena a mensagem de erro no estado 'error'
      setError((err instanceof Error) ? err.message : 'Ocorreu um erro desconhecido na busca.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    // Importante: O useEffect precisa importar o hook 'useEffect' do 'react'
    fetchAvailableRides();
  }, []); // O array vazio [] garante que a função é chamada apenas UMA VEZ.

  const filteredRides = rides.filter(
    (ride) =>{
      const term = searchTerm.toLowerCase();
      return ride.nome.toLowerCase().includes(term) ||
             // Filtra pelo 'email' ou 'veiculo', se quiser adicionar mais opções de busca
             ride.email.toLowerCase().includes(term); 
             // Se você tivesse um campo 'localizacao', usaria: || ride.localizacao.toLowerCase().includes(term);
    }
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
    <div className="text-center py-12 text-lg text-red-500">
      Erro ao buscar caronas: {error}. Verifique se o backend está rodando.
    </div>
  

  {/* 2. MOSTRA MENSAGEM DE CARREGAMENTO (Tratamento do estado 'loading') */}
  {!error && loading && (
    <div className="text-center py-12 text-lg text-muted-foreground">
      Carregando caronas disponíveis... 🚗💨
    </div>
  )}

  {/* 3. CONTEÚDO PRINCIPAL (Mostra a lista se a busca terminou sem erro) */}
  {!error && !loading && (
    <>
      {/* Verifica se encontrou resultados após o filtro */}
      {filteredRides.length > 0 ? (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRides.map((backendDriver) => {
              // BLOCO DE MAPEAMENTO CORRIGIDO (Onde você adapta os dados do backend para o RideCard)
              const mappedRide = {
 // ID: Garante que o ID existe e é uma string
        id: String(backendDriver.id ?? Date.now()), 

        // NOME DO MOTORISTA: Usa 'Nome Indefinido' se o campo 'nome' estiver nulo
        driverName: backendDriver.nome ?? "Motorista Indefinido", 
        
        // DADOS DO VEÍCULO (Se você estiver buscando estes dados na API de Motoristas):
        // Se backendDriver.veiculo fosse o nome do veículo, você o usaria aqui.
        // Já que você está usando o Motorista como Carona, vou manter o resto como mock,
        // mas tratando os campos que vieram do backend:
        
        driverAvatar: "AS", // Mock
        from: backendDriver.localizacao_atual ?? "Origem não informada", 
        to: "Destino Padrão", // Mock
        time: "08:00", // Mock
        date: "18/09", // Mock
        availableSeats: 3, // Mock
        totalSeats: 4, // Mock
        // AVALIAÇÃO: Usa 4.5 como padrão se o campo 'avaliacao' estiver nulo
        rating: backendDriver.avaliacao ?? 4.5, 
        price: 10, // Mock
        group: "Tecnologia", // Mock
        tags: ["Regular", "Não fumante"], // Mock
    };

              return (
                  <RideCard 
                      key={mappedRide.id} 
                      ride={mappedRide} 
                      onJoinRide={handleJoinRide} 
                  />
              );
          })}
        </div>
        
      ) : (
        // 4. MENSAGEM DE LISTA VAZIA (Se a busca terminou, mas o filtro não encontrou nada)
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma carona encontrada
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar sua busca ou crie uma nova carona.
          </p>
        </div>
      )}
    </>
  )}
</TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group, index) => (
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
        onCreateRide={async (rideData) => {
          console.log("Creating ride:", rideData);
          setShowCreateRide(false);
          await fetchAvailableRides(); // Recarrega as caronas após criar uma nova
        }}
      />
    </div>
  );
};

export default Dashboard;
