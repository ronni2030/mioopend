//exporta todo lo relacionado a la tarjeta de identificacion
export interface IdentificationCard {
  id: number;
  nombreCompleto: string;
  cedula: string;
  tipoSangre: string;
  alergias: string;
  medicamentos: string;
  condicionesMedicas: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
}