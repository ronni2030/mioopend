//exporta todo lo relacionado a el historial de rutas

export interface Route {
  id: string;
  origin: string;
  destination: string;
  date: string;
  distance: string;
  duration: string;
  isFavorite: boolean;
}

