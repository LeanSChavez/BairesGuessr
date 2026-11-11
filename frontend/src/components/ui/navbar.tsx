
import { Flex, Box, Heading, Button, HStack, Select } from "@chakra-ui/react"
import { Menu } from "@chakra-ui/react"
interface NavbarProps {
  username: string
  onNavigateToProfile: () => void
  onLogout: () => void
}


export const NavBar = ({username,onNavigateToProfile,onLogout} : NavbarProps) =>{

        return(
<Flex
      as="nav"
      width="100%"
      px={8}
      py={4}
      bg="gray.900"
      color="white"
      align="center"
      justify="space-between"
      borderBottom="1px solid"
      borderColor="gray.800">
    <HStack spaceX={6}>
        <Heading size="md" color="teal.400" letterSpacing="wider">
          BairesGuessr
        </Heading>
        </HStack>
        <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="outline" colorPalette="teal" size="sm">
            👤 {username || "Usuario"}
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content bg="gray.800" borderColor="gray.700">
            <Menu.Item
              value="profile"
              onClick={onNavigateToProfile}
              cursor="pointer"
              _hover={{ bg: "gray.700" }}
            >
              Ver Perfil
            </Menu.Item>
            
            <Menu.Item
              value="logout"
              onClick={onLogout}
              color="red.400"
              cursor="pointer"
              _hover={{ bg: "gray.700" }}
            >
              Cerrar Sesión
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>

        </Flex>




    )
}