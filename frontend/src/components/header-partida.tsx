import { Flex, HStack, Text, Badge, Button, Box } from "@chakra-ui/react"

interface HeaderPartidaProps {
  rondaActual: number
  totalRondas?: number
  puntajeTotal: number
  onRendirse?: () => void
}

export const HeaderPartida = ({
  rondaActual = 1,
  totalRondas = 5,
  puntajeTotal = 0,
  onRendirse
}: HeaderPartidaProps) => {
  return (
    <Flex
      position="absolute"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      w="90%"
      maxW="4xl"
      bg="rgba(15, 23, 42, 0.85)"
      backdropFilter="blur(12px)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      borderRadius="xl"
      px={6}
      py={3}
      align="center"
      justify="space-between"
      boxShadow="0 10px 25px rgba(0, 0, 0, 0.5)"
    ><Text fontWeight="bold" fontSize="lg" color="white" letterSpacing="wider">
        BAIRES <Text as="span" color="teal.400">GUESSR</Text>
      </Text>

      <HStack spaceX={8}>
        <VStackSpace>
          <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider">
            Ronda
          </Text>
          <Badge colorPalette="teal" size="lg" px={3} py={1} fontSize="md" fontWeight="bold">
            {rondaActual} / {totalRondas}
          </Badge>
        </VStackSpace>

        <Box w="1px" h="8" bg="gray.700" />

        <VStackSpace>
          <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider">
            Puntaje
          </Text>
          <Text color="teal.300" fontWeight="extrabold" fontSize="xl">
            {puntajeTotal.toLocaleString()} <Text as="span" fontSize="xs" color="gray.300">pts</Text>
          </Text>
        </VStackSpace>
      </HStack>

      <Button
        variant="ghost"
        colorPalette="red"
        size="sm"
        _hover={{ bg: "rgba(255, 0, 0,0)" }}
        onClick={onRendirse}
      >
        Salir
      </Button>
    </Flex>
  )
}

const VStackSpace = ({ children }: { children: React.ReactNode }) => (
  <Flex direction="column" align="center" justify="center">
    {children}
  </Flex>
)