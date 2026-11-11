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

const MOCK_HISTORY = [
  { id: 104, fecha: "08/11/2026", puntaje: 9200, rondas: 5, resultado: "W" },
  { id: 101, fecha: "05/11/2026", puntaje: 6400, rondas: 5, resultado: "E" },
  { id: 98, fecha: "01/11/2026", puntaje: 2800, rondas: 3, resultado: "L" },
]

export const Profile = () => {
  const navigate = useNavigate()
  const currentUser = userService.getCurrentUser()

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
              <Text fontWeight="bold" fontSize="xl" color="teal.400">12</Text> 
            </Box>

            <Box textStyle="sm" textAlign="center" p={3} bg="gray.800" borderRadius="md" flex={1}>
              <Text color="fg.muted" fontSize="xs">Máximo Puntaje</Text>
              <Text fontWeight="bold" fontSize="xl" color="teal.400">9,200 pts</Text>
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
                {MOCK_HISTORY.map((partida) => (
                  <Table.Row key={partida.id} _hover={{ bg: "gray.800" }}>
                    <Table.Cell>
                      {partida.resultado === "W" && (
                        <Badge colorPalette="green">W</Badge>
                      )}
                      {partida.resultado === "E" && (
                        <Badge colorPalette="yellow">E</Badge>
                      )}
                      {partida.resultado === "L" && (
                        <Badge colorPalette="red">L</Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell color="gray.300">#{partida.id}</Table.Cell>
                    <Table.Cell color="gray.400">{partida.fecha}</Table.Cell>
                    <Table.Cell color="teal.300" fontWeight="bold">
                      {partida.puntaje} pts
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Stack>

            <Flex gap={4} mt={4} w="full">
            <Button
                variant="outline"
                colorPalette="gray"
                flex={1}
                onClick={() => navigate('/menu')} >
                Volver al Menú
            </Button>
            <Button
                colorPalette="red"
                variant="subtle"
                flex={1}
                onClick={() => {
                userService.logout()
                navigate('/register')
                }}>
                Cerrar Sesión
            </Button>
            </Flex>
        </Card.Body>
      </Card.Root>
    </Center>
  )
}