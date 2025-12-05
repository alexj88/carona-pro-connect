import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Users, Star } from "lucide-react";

interface Ride {
  id: string;
  driverName?: string;
  driverAvatar?: string;
  from?: string;
  to?: string;
  time?: string;
  date?: string;
  availableSeats?: number;
  totalSeats?: number;
  rating?: number;
  price?: number;
  group?: string;
  tags?: string[];
}

interface RideCardProps {
  ride: Ride;
  onJoinRide?: (rideId: string) => void;
}

const RideCard = ({ ride, onJoinRide }: RideCardProps) => {

  // Função de iniciais corrigida
  const getInitials = (name?: string) => {
    const safe = (name || "").trim();
    if (!safe) return "US";
    return safe
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="hover:shadow-card transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          
          {/* Driver */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={ride.driverAvatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(ride.driverName)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold text-foreground">{ride.driverName}</h3>

              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {typeof ride.rating === "number"
                    ? ride.rating.toFixed(1)
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Grupo */}
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {ride.group || "Geral"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Origem */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-success" />
          <span className="text-sm font-medium">{ride.from || "-"}</span>
        </div>

        {/* Destino */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium">{ride.to || "-"}</span>
        </div>

        {/* Horário e vagas */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>
              {ride.time || "--:--"} — {ride.date || "--/--"}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>
              {ride.availableSeats}/{ride.totalSeats} vagas
            </span>
          </div>
        </div>

        {/* Tags */}
        {Array.isArray(ride.tags) && ride.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ride.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Botão */}
        <div className="flex items-center justify-end pt-2">
          <Button
            variant="gradient"
            size="sm"
            onClick={() => onJoinRide?.(ride.id)}
            disabled={ride.availableSeats === 0}
            className={
              ride.availableSeats === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          >
            {ride.availableSeats === 0 ? "Lotado" : "Solicitar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
