import { Box, Button, Center,VStack,Heading, Text, HStack} from "@chakra-ui/react";
import { NavBar} from "../components/ui/navbar";
import { userService } from '../services/userService';
import { useOnInit } from "../services/hooks/commons";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
export const Menu = () => {

const currentUser = userService.getCurrentUser()

 const navigate = useNavigate();



const IMAGENES_FONDO = [
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
];

const [bgIndex, setBgIndex] = useState(0);

const MOCK_RECORDS = [
  { id: 1, usuario: "Lean", score: 9500 },
  { id: 2, usuario: "Manu", score: 8900 },
  { id: 3, usuario: "Mena", score: 8600 },
];
useOnInit (()=>{
const carga = setInterval(() =>{
    const max = IMAGENES_FONDO.length;
    setBgIndex((prev) => (prev + 1) % max) 
    },5000);
   
    return () => clearInterval(carga)

})

return (
<Box
    minH="100vh"
    bgImg={`url(${IMAGENES_FONDO[bgIndex]})`}
    bgPos="center"
    backgroundSize="cover"
    transition="background-image 1s ease-in-out"
  >
    <NavBar
    username={currentUser?.username || "Usuario"}
    onNavigateToProfile={() =>{console.log("Ir a perfil"); navigate('/profile')}}
    onLogout={() =>{userService.logout()  ; navigate ('/register');}}
    >
    </NavBar>


    <Center minH="calc(100vh - 70px)">
        <Box bg="rgba(15, 23, 42, 0.75)"
    backdropFilter="blur(12px)"
    p={{ base: 6, md: 10 }}
    borderRadius="2xl"
    border="1px solid"
    borderColor="rgba(255, 255, 255, 0.1)"
    boxShadow="0 20px 50px rgba(0, 0, 0, 0.6)"
    maxW="xl"
    w="full">
        <VStack spaceY={6} textAlign="center" px={4}>
            <Heading size="4xl" color="gray.500" textShadow="0 4px 25px rgba(0,0,0,0.9)" letterSpacing="wider">
            BAIRES <Text as="span" color="teal.400">GUESSR</Text>
            </Heading>
            <Text color="gray.500" fontSize="lg" maxW="md" textShadow="0 2px 10px rgba(0,0,0,0.8)">
            Explorá el campus y los espacios culturales. ¿Qué tan rápido podés adivinar la ubicación?
            </Text>
            <Button
            colorPalette="teal"
            size="2xl"
            px={12}
            py={7}
            fontSize="xl"
            fontWeight="bold"
            boxShadow="0 0 25px rgba(13, 148, 136, 0.6)"
            _hover={{
                transform: "scale(1.08)",
                boxShadow: "0 0 35px rgba(13, 148, 136, 0.9)",
            }}
                onClick={() =>navigate('/partida')}
            >
                JUGAR
            </Button>
      </VStack>
      </Box>
    </Center>


   <Box
  position="absolute"
  bottom={0}
  left={0}
  w="100%"
  bg="rgba(15, 23, 42, 0.85)"
  backdropFilter="blur(10px)"
  px={6}
  py={3}
  display="flex"
  alignItems="center"
  gap={4}
>
  <Text color="teal.400" fontWeight="bold" whiteSpace="nowrap">
    🏆 Récords Históricos:
  </Text>

  <HStack spaceX={4} overflowX="auto">
    {MOCK_RECORDS.map((game) => (
      <Box
        key={game.id}
        bg="gray.800"
        px={3}
        py={1}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.700"
      >
        <Text fontSize="sm" color="gray.200">
          {game.usuario} - Partida #{game.id}:{" "}
          <Text as="span" color="teal.400" fontWeight="bold">
            {game.score} pts
          </Text>
        </Text>
      </Box>
    ))}
  </HStack>
</Box>

</Box>

)

}