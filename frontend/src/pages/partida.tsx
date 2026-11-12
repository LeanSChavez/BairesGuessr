import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  juegoService,
  type PartidaResponse,
  type RondaNuevaResponse,
  type RondaResultadoResponse,
} from "../services/juegoService";
import { MapillaryViewer } from "../components/mapillaryViewer";
import { GuessMap } from "../components/guessMap";

const TIEMPO_POR_RONDA = 50;

export const Partida = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    partida?: PartidaResponse;
    rondaActual?: RondaNuevaResponse;
  } | null;

  const [partida] = useState<PartidaResponse | null>(state?.partida || null);
  const [rondaActual, setRondaActual] = useState<RondaNuevaResponse | null>(
    state?.rondaActual || null
  );

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [resultadoRonda, setResultadoRonda] = useState<RondaResultadoResponse | null>(null);
  const [puntajeAcumulado, setPuntajeAcumulado] = useState<number>(
    state?.partida?.puntajeTotal || 0
  );
  const [tiempoRestante, setTiempoRestante] = useState<number>(TIEMPO_POR_RONDA);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partidaFinalizada, setPartidaFinalizada] = useState(false);

  useEffect(() => {
    if (!partida || !rondaActual) {
      navigate("/menu");
    }
  }, [partida, rondaActual, navigate]);

  const enviarUbicacion = useCallback(
    async (coords: { lat: number; lng: number }, porTiempo = false) => {
      if (!partida || !rondaActual) return;

      setIsLoading(true);
      if (porTiempo) setTiempoAgotado(true);

      try {
        const resultado = await juegoService.enviarAdivinanza(
          partida.idPartida,
          rondaActual.idRonda,
          coords.lat,
          coords.lng
        );

        setResultadoRonda(resultado);
        setPuntajeAcumulado(resultado.puntajeTotalAcumulado);
      } catch (error) {
        console.error("Error al enviar la adivinanza:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [partida, rondaActual]
  );

  // Cronómetro por ronda
  useEffect(() => {
    if (!partida || !rondaActual || resultadoRonda || partidaFinalizada || isLoading) {
      return;
    }

    if (tiempoRestante <= 0) {
      const coordsAEnviar = selectedCoords ?? { lat: 0, lng: 0 };
      setSelectedCoords(coordsAEnviar);
      enviarUbicacion(coordsAEnviar, true);
      return;
    }

    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [
    tiempoRestante,
    partida,
    rondaActual,
    resultadoRonda,
    partidaFinalizada,
    isLoading,
    selectedCoords,
    enviarUbicacion,
  ]);

  if (!partida || !rondaActual) return null;

  const totalRondas = partida.rondasTotalesPermitidas || 5;

  const handleConfirmarAdivinanza = async () => {
    if (!selectedCoords) return;
    await enviarUbicacion(selectedCoords, false);
  };

  const handleSiguienteRonda = async () => {
    if (resultadoRonda?.partidaFinalizada) {
      setPartidaFinalizada(true);
      return;
    }

    setIsLoading(true);
    try {
      const siguienteRonda = await juegoService.generarNuevaRonda(
        partida.idPartida
      );
      setRondaActual(siguienteRonda);
      setResultadoRonda(null);
      setSelectedCoords(null);
      setTiempoAgotado(false);
      setTiempoRestante(TIEMPO_POR_RONDA);
    } catch (error) {
      console.error("Error al generar la siguiente ronda:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (partidaFinalizada) {
    return (
      <Center minH="100vh" bg="gray.950" px={4}>
        <Card.Root maxW="md" w="full" bg="gray.900" borderColor="gray.800" p={6}>
          <Card.Body>
            <VStack spaceY={5} textAlign="center">
              <Heading size="2xl" color="teal.400">
                ¡Partida Finalizada!
              </Heading>
              <Box
                bg="gray.800"
                px={8}
                py={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="teal.700"
              >
                <Text fontSize="sm" color="gray.400">
                  Puntaje Total Final
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="teal.300">
                  {puntajeAcumulado} pts
                </Text>
              </Box>
              <Button
                colorPalette="teal"
                size="lg"
                w="full"
                onClick={() => navigate("/menu")}
              >
                Volver al Menú Principal
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Center>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bg="gray.950" color="white">
      {/* Barra superior HUD */}
      <Flex
        justify="space-between"
        align="center"
        px={6}
        py={3}
        bg="gray.900"
        borderBottom="1px solid"
        borderColor="gray.800"
      >
        <HStack spaceX={3}>
          <Heading size="md" color="teal.400">
            BAIRES GUESSR
          </Heading>
  

        </HStack>

        <HStack spaceX={6}>
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.400">
              TIEMPO
            </Text>
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={tiempoRestante <= 5 ? "red.400" : "yellow.300"}
            >
              00:{tiempoRestante.toString().padStart(2, "0")}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.400">
              RONDA
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {rondaActual.numeroRonda} / {totalRondas}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.400">
              PUNTAJE
            </Text>
            <Text fontWeight="bold" fontSize="lg" color="teal.400">
              {puntajeAcumulado} pts
            </Text>
          </Box>
          <Button
            size="sm"
            variant="outline"
            colorPalette="gray"
            onClick={() => navigate("/menu")}
          >
            Abandonar
          </Button>
        </HStack>
      </Flex>

      {/* Área principal del visor + Mapa */}
      <Flex flex={1} direction={{ base: "column", lg: "row" }} p={4} gap={4}>
        {/* Visor de Street View / Mapillary */}
        <Box
          flex={2}
          bg="gray.900"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.800"
          minH="400px"
          position="relative"
          overflow="hidden"
        >
          <MapillaryViewer imageId={rondaActual.mapillaryId} />
        </Box>

        <Card.Root
          flex={1}
          bg="gray.900"
          borderColor="gray.800"
          justifyContent="space-between"
        >
          <Card.Body>
            <Stack spaceY={4}>
              <HStack justify="space-between">
                <Heading size="md" color="teal.300">
                  {resultadoRonda
                    ? `Resultado Ronda ${resultadoRonda.numeroRonda}`
                    : "¿Dónde estamos?"}
                </Heading>
                {tiempoAgotado && resultadoRonda && (
                  <Badge colorPalette="red" variant="subtle">
                    ¡Tiempo agotado!
                  </Badge>
                )}
              </HStack>

              <GuessMap
                selectedCoords={selectedCoords}
                onSelectCoords={(lat, lng) => setSelectedCoords({ lat, lng })}
                realCoords={
                  resultadoRonda
                    ? { lat: resultadoRonda.latitudReal, lng: resultadoRonda.longitudReal }
                    : null
                }
                disabled={Boolean(resultadoRonda)}
              />

              {!resultadoRonda ? (
                <>
                  <Text fontSize="xs" color="gray.400" textAlign="center">
                    {selectedCoords
                      ? `Pin marcado: ${selectedCoords.lat.toFixed(5)}, ${selectedCoords.lng.toFixed(5)}`
                      : "Hacé clic en el mapa para marcar tu ubicación"}
                  </Text>

                  <Button
                    colorPalette="teal"
                    size="lg"
                    w="full"
                    disabled={!selectedCoords}
                    loading={isLoading}
                    onClick={handleConfirmarAdivinanza}
                  >
                    Confirmar Ubicación
                  </Button>
                </>
              ) : (
                <VStack spaceY={3} align="stretch">
                  <Box bg="gray.800" p={3} borderRadius="md">
                    <Text fontSize="xs" color="gray.400">
                      Lugar real
                    </Text>
                    <Text fontWeight="bold" fontSize="md">
                      {resultadoRonda.nombreEstablecimiento}
                    </Text>
                    <Text fontSize="sm" color="teal.300">
                      Barrio: {resultadoRonda.barrio}
                    </Text>
                  </Box>

                  <HStack justify="space-between" bg="gray.800" p={3} borderRadius="md">
                    <Box>
                      <Text fontSize="xs" color="gray.400">
                        Distancia
                      </Text>
                      <Text fontWeight="bold">
                        {Math.round(resultadoRonda.distanciaMetros)} m
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="xs" color="gray.400">
                        Puntos ganados
                      </Text>
                      <Text fontWeight="bold" color="teal.400" fontSize="lg">
                        +{resultadoRonda.puntajeObtenido} pts
                      </Text>
                    </Box>
                  </HStack>

                  <Button
                    colorPalette="teal"
                    size="lg"
                    w="full"
                    loading={isLoading}
                    onClick={handleSiguienteRonda}
                  >
                    {resultadoRonda.partidaFinalizada
                      ? "Ver Resumen Final"
                      : "Siguiente Ronda"}
                  </Button>
                </VStack>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Flex>
  );
};