import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPin, Clock, Users, DollarSign, Calendar } from "lucide-react";
import RideCard from "./RideCard";

interface CreateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRide: (rideData: {
    from: string;
    to: string;
    time: string;
    date: string;
    seats: number;
    description: string;
    group: string;
    isRecurring: boolean;
    allowSmoking: boolean;
    hasAirConditioning: boolean;
    acceptsPets: boolean;
  }) => void;
}

const CreateRideModal = ({
  isOpen,
  onClose,
  onCreateRide,
}: CreateRideModalProps) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    availableSeats: "", // ✅ Corrigido o typo
    price: "",
    description: "",
    group: "",
    isRecurring: false,
    allowSmoking: false,
    hasAirConditioning: true,
    acceptsPets: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rideData = {
      from: formData.from,
      to: formData.to,
      time: formData.time,
      date: formData.date,
      seats: parseInt(formData.availableSeats) || 0, // ✅ Agora com nome correto
  // price removed per request
      description: formData.description,
      group: formData.group,
      isRecurring: formData.isRecurring,
      allowSmoking: formData.allowSmoking,
      hasAirConditioning: formData.hasAirConditioning,
      acceptsPets: formData.acceptsPets,
    };

    onCreateRide(rideData); // ✅ Agora passando rideData convertido
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Criar Nova Carona
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da sua carona para conectar-se com colegas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origem e Destino */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <MapPin className="h-5 w-5" />
                <span>Rota</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">Origem</Label>
                  <Input
                    id="from"
                    placeholder="Ex: Várzea, Recife"
                    value={formData.from}
                    onChange={(e) => handleInputChange("from", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">Destino</Label>
                  <Input
                    id="to"
                    placeholder="Ex: Madalena, Recife"
                    value={formData.to}
                    onChange={(e) => handleInputChange("to", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data e Hora */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Clock className="h-5 w-5" />
                <span>Horário</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    handleInputChange("isRecurring", checked)
                  }
                />
                <Label htmlFor="recurring">
                  Carona recorrente (mesmo horário diariamente)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Vagas e Grupo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5" />
                <span>Detalhes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">Vagas disponíveis</Label>
                  <Select
                    value={formData.availableSeats} // ✅ Agora com nome correto
                    onValueChange={(value) =>
                      handleInputChange("availableSeats", value)
                    } // ✅ Corrigido para "availableSeats"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 vaga</SelectItem>
                      <SelectItem value="2">2 vagas</SelectItem>
                      <SelectItem value="3">3 vagas</SelectItem>
                      <SelectItem value="4">4 vagas</SelectItem>
                      <SelectItem value="5">5+ vagas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group">Grupo/Área</Label>
                  <Select
                    value={formData.group}
                    onValueChange={(value) => handleInputChange("group", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                      <SelectItem value="strategy">Estratégia</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="operations">Operações</SelectItem>
                      <SelectItem value="general">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preço e Preferências */}
          <Card>
            <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                <span>Preferências</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* price removed */}

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aircon"
                    checked={formData.hasAirConditioning}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasAirConditioning", checked)
                    }
                  />
                  <Label htmlFor="aircon">Ar condicionado</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="smoking"
                    checked={formData.allowSmoking}
                    onCheckedChange={(checked) =>
                      handleInputChange("allowSmoking", checked)
                    }
                  />
                  <Label htmlFor="smoking">Permite fumantes</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="pets"
                    checked={formData.acceptsPets}
                    onCheckedChange={(checked) =>
                      handleInputChange("acceptsPets", checked)
                    }
                  />
                  <Label htmlFor="pets">Aceita pets</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição adicional (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione informações extras sobre a carona, pontos de referência, etc."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              Criar Carona
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRideModal;
