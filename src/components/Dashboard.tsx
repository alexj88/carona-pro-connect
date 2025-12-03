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

//  1. O tipo exato que VEM DO BACKEND (o que você vê no Postman)
interface DriverDB {
    id: number;
    nome: string;
    email: string;
    veiculo: string;
    placa: string;
    // Campos que podem ser NULL no BD devem ter '| null'
    avaliacao: number | null; 
    localizacao_atual: string | null;
    data_criacao: string;
    // Adicione qualquer outro campo que o seu SELECT * FROM motoristas retorne
}
// O tipo para o estado 'rides' no Dashboard
// Vamos usar o tipo DriverDB para o estado:
type Driver = DriverDB;

interface Group {
  name: string;
  members: number;
  rides: number;
}

const Dashboard = ({ userEmail }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateRide, setShowCreateRide] = useState<boolean>(false);

  const [rides, setRides] = useState<DriverDB[]>([]); 
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
      const sanitizedRides: DriverDB[] = data.map((driver: any) => ({
        // Use ?? para garantir que o campo não seja null se o tipo for string/number
        id: driver.id || 0, // Se o ID for o único campo que pode ser 0, ajuste
        nome: driver.nome || 'Sem Nome', 
        email: driver.email || '',
        veiculo: driver.veiculo || 'Não Informado',
        placa: driver.placa || '0000',
        
        // Se seus motoristas não têm esses campos, mas você os exige na interface Driver,
        // você deve fornecer um valor padrão aqui para evitar a quebra:
        avaliacao: driver.avaliacao || 4.5,
        localizacao_atual: driver.localizacao_atual || null,
        data_criacao: driver.data_criacao || ''
      
        // Se houver campos que vêm do banco que a interface Driver NÃO tem, 
        // eles são descartados aqui, limpando o objeto.
        }));
      // Preenche o estado 'rides' com os motoristas reais
      setRides(sanitizedRides); 
      
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
 //    Importante: O useEffect precisa importar o hook 'useEffect' do 'react'
    fetchAvailableRides();
  }, []); // O array vazio [] garante que a função é chamada apenas UMA VEZ.

  const filteredRides = rides.filter(
    (ride) =>{
      const term = searchTerm.toLowerCase();
      // Filtra pelo NOME (Substituindo o antigo ride.driverName)
      const nomeMatch = ride.nome?.toLowerCase().includes(term); 
      
      // Filtra pela LOCALIZAÇÃO (Substituindo os antigos ride.from/ride.to)
      const locationMatch = ride.localizacao_atual?.toLowerCase().includes(term);

      // Filtra pelo VEÍCULO 
      const vehicleMatch = ride.veiculo?.toLowerCase().includes(term);
      
      return nomeMatch || locationMatch || vehicleMatch;
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
     const driver = backendDriver || {}; // Garante que é um objeto, mesmo que vazio

    // VERIFICAÇÃO 2: MAPEAMENTO ULTRASSEGURO
    // Use o operador de coalescência nula (??) em CADA CAMPO que vem do backend.
    const mappedRide = {
        // PROPRIEDADES DO BACKEND (DriverDB) - Conversão e Proteção
        id: String(backendDriver.id ?? Date.now()), // Protege o ID, garantindo string
        driverName: backendDriver.nome ?? 'Motorista Desconhecido',
        
        // PROPRIEDADES HÍBRIDAS/MOCKADAS (Que usam dados do backend, mas têm fallback)
        from: backendDriver.localizacao_atual ?? "Origem Não Definida",
        rating: Number(backendDriver.avaliacao) ?? 4.5, // Garante um número (ou o que o RideCard espera)

        // PROPRIEDADES MOCKADAS (Que o RideCard espera, mas NÃO EXISTEM no backend)
        driverAvatar: "AS", 
        to: "Destino Padrão (Sem Destino no BD)", 
        time: "08:00", 
        date: "18/09", 
        availableSeats: 3, 
        totalSeats: 4, 
        price: 10, 
        group: "Tecnologia", 
        tags: ["Regular", "Não fumante"], 
        // CERTIFIQUE-SE DE QUE ESTA LISTA DE PROPRIEDADES É IDÊNTICA À PROPS DO SEU RideCard
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
  isOpen={!!showCreateRide}
  onClose={() => setShowCreateRide(false)}  
  // Torne a função async
  onCreateRide={async (rideData) => { 
    // ** LÓGICA DE CRIAÇÃO DA API ** (Assumindo que está em outro arquivo/função)
    // Ex: const newRide = await api.createRide(rideData); 
    
    // Fechar o modal
    setShowCreateRide(false); 
    
    // RECARRERGAR A LISTA DE CARONAS (atualiza o dashboard)
    await fetchAvailableRides(); 
  }}
      />
    </div>
  );
};

export default Dashboard;
