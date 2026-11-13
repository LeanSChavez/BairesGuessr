import { useState } from "react"
import {
  Box,
  Button,
  Card,
  Center,
  Heading,
  HStack,
  Stack,
  Text,
  Badge,
  Table,
  Flex
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { userService } from "../services/userService"
import { juegoService, type PartidaResponse } from "../services/juegoService"
import { useOnInit } from "../services/hooks/commons"

export const Profile = () => {
  const navigate = useNavigate()
  const currentUser = userService.getCurrentUser()
  const [historial, setHistorial] = useState<PartidaResponse[]>([])

  useOnInit(() => {
    const cargarHistorial = async () => {
      if (!currentUser?.idUsuario) return
      try {
        const data = await juegoService.obtenerPartidasUsuario(currentUser.idUsuario)
        setHistorial(data)
      } catch (error) {
        console.error("Error al cargar el historial de partidas:", error)
      }
    }

    cargarHistorial()
  })

  // Estadísticas calculadas en base a las partidas reales
  const partidasJugadas = historial.length
  const maximoPuntaje = historial.length > 0
    ? Math.max(...historial.map((p) => p.puntajeTotal))
    : 0

  // Helper para formatear la fecha ISO que viene de Postgres
  const formatearFecha = (fechaIso: string) => {
    if (!fechaIso) return "-"
    return new Date(fechaIso).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  // Helper para determinar W / E / L según el puntaje obtenido (ajustable a tus reglas)
  const obtenerBadgeResultado = (puntaje: number) => {
    if (puntaje >= 9000) return <Badge colorPalette="green">W</Badge>
    if (puntaje >= 5000) return <Badge colorPalette="yellow">E</Badge>
    return <Badge colorPalette="red">L</Badge>
  }

  return (
    <Center minH="100vh" bg="bg.subtle" px={4} py={8}>
      <Card.Root w="full" maxW="2xl" shadow="lg" bg="gray.900" borderColor="gray.800">
        <Card.Header textAlign="center" pb={2}>
          <HStack justify="center" mb={2}>
            <Box
              w="16"
              h="16"
              borderRadius="full"
              bg="teal.600"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
              fontWeight="bold"
              color="white"
            >
              {currentUser?.username?.substring(0, 2).toUpperCase() || "US"}
            </Box>
          </HStack>

          <Heading size="xl" color="white">
            {currentUser?.username || "Usuario"}
          </Heading>
          <Text color="fg.muted" fontSize="sm" mt={1}>
            {currentUser?.email || "usuario@mail.com"}
          </Text>
        </Card.Header>

        <Card.Body gap={6}>
          <HStack gap={4} justify="space-around">
            <Box textStyle="sm" textAlign="center" p={3} bg="gray.800" borderRadius="md" flex={1}>
              <Text color="fg.muted" fontSize="xs">Partidas Jugadas</Text>
              <Text fontWeight="bold" fontSize="xl" color="teal.400">
                {partidasJugadas}
              </Text>
            </Box>

            <Box textStyle="sm" textAlign="center" p={3} bg="gray.800" borderRadius="md" flex={1}>
              <Text color="fg.muted" fontSize="xs">Máximo Puntaje</Text>
              <Text fontWeight="bold" fontSize="xl" color="teal.400">
                {maximoPuntaje.toLocaleString("es-AR")} pts
              </Text>
            </Box>
          </HStack>

          <Stack gap={2}>
            <Text fontWeight="bold" color="gray.300">
              Historial de Partidas
            </Text>

            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row bg="gray.800">
                  <Table.ColumnHeader color="gray.300">Estado</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.300">Partida</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.300">Fecha</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.300">Puntaje</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {historial.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={4} textAlign="center" color="gray.400" py={4}>
                      Todavía no jugaste ninguna partida.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  historial.map((partida) => (
                    <Table.Row key={partida.idPartida} _hover={{ bg: "gray.800" }}>
                      <Table.Cell>
                        {obtenerBadgeResultado(partida.puntajeTotal)}
                      </Table.Cell>
                      <Table.Cell color="gray.300">#{partida.idPartida}</Table.Cell>
                      <Table.Cell color="gray.400">{formatearFecha(partida.fechaInicio)}</Table.Cell>
                      <Table.Cell color="teal.300" fontWeight="bold">
                        {partida.puntajeTotal.toLocaleString("es-AR")} pts
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Stack>

          <Flex gap={4} mt={4} w="full">
            <Button
              variant="outline"
              colorPalette="gray"
              flex={1}
              onClick={() => navigate('/menu')}
            >
              Volver al Menú
            </Button>
            <Button
              colorPalette="red"
              variant="subtle"
              flex={1}
              onClick={() => {
                userService.logout()
                navigate('/login')
              }}
            >
              Cerrar Sesión
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Center>
  )
}