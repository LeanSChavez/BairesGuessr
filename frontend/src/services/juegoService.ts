import axios from 'axios';

const API_URL = 'http://localhost:8080/api/partidas';

export interface PartidaResponse {
  idPartida: number;
  idUsuario: number;
  estado: string;
  puntajeTotal: number;
  fechaInicio: string;
  rondasTotalesPermitidas: number;
}

export interface RondaNuevaResponse {
  idRonda: number;
  idPartida: number;
  numeroRonda: number;
  idLugar: string;
  mapillaryId: string | null;
  pistaFuncionPrincipal: string;
}

export interface RondaResultadoResponse {
  idRonda: number;
  numeroRonda: number;
  distanciaMetros: number;
  puntajeObtenido: number;
  latitudReal: number;
  longitudReal: number;
  latitudAdivinada: number;
  longitudAdivinada: number;
  nombreEstablecimiento: string;
  barrio: string;
  partidaFinalizada: boolean;
  puntajeTotalAcumulado: number;
}

export const juegoService = {
  iniciarPartida: async (idUsuario: number): Promise<PartidaResponse> => {
    const response = await axios.post<PartidaResponse>(API_URL, {
      idUsuario,
    });
    return response.data;
  },

  generarNuevaRonda: async (idPartida: number): Promise<RondaNuevaResponse> => {
    const response = await axios.post<RondaNuevaResponse>(
      `${API_URL}/${idPartida}/rondas/nueva`
    );
    return response.data;
  },

  obtenerPartida: async (idPartida: number): Promise<PartidaResponse> => {
    const response = await axios.get<PartidaResponse>(`${API_URL}/${idPartida}`);
    return response.data;
  },

    enviarAdivinanza: async (
        idPartida: number,
        idRonda: number,
        latitud: number,
        longitud: number
    ): Promise<RondaResultadoResponse> => {
        const response = await axios.post<RondaResultadoResponse>(
        `${API_URL}/${idPartida}/rondas/${idRonda}/adivinar`,
        {
            latitudAdivinada: latitud,
            longitudAdivinada: longitud,
        }
        );
        return response.data;
    }
}