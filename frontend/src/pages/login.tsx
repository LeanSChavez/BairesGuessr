import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Center,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { userService } from '../services/userService';

export const Login = () => {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Llamada al servicio (mock o backend real)
      const user = await userService.login({
        emailOrUsername: emailOrUser,
        passwordHash: password,
      });

      console.log('Usuario logueado:', user);

      // 2. Redirección al menú principal
      navigate('/menu'); 
    } catch (error: any) {
      console.error('Error en el login:', error);
      setErrorMessage(error.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center minH="100vh" bg="bg.subtle" px={4}>
      <Card.Root w="full" maxW="md" shadow="md">
        <Card.Header textAlign="center">
          <Heading size="xl" color="teal.600">
            BairesGuessr
          </Heading>
          <Text color="fg.muted" fontSize="sm" mt={1}>
            Ingresá a tu cuenta para jugar
          </Text>
        </Card.Header>

        <Card.Body>
          {errorMessage && (
            <Alert.Root status="error" mb={4} borderRadius="md">
              <Alert.Indicator />
              <Alert.Title fontSize="sm">{errorMessage}</Alert.Title>
            </Alert.Root>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap="4">
              <Field.Root required invalid={!!errorMessage}>
                <Field.Label fontSize="sm">Usuario o Email</Field.Label>
                <Input
                  type="text"
                  placeholder="User Mock = lean"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                />
              </Field.Root>

              <Field.Root required invalid={!!errorMessage}>
                <Field.Label fontSize="sm">Contraseña</Field.Label>
                <Input
                  type="password"
                  placeholder="Pass Mock = 123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field.Root>

              <Button
                type="submit"
                colorPalette="teal"
                size="lg"
                mt={2}
                w="full"
                loading={isLoading}
              >
                Iniciar Sesión
              </Button>
            </Stack>
          </form>

          <Text mt={6} textAlign="center" fontSize="sm" color="fg.muted">
            ¿No tenés una cuenta?{' '}
            <Link color="teal.600" fontWeight="bold" href="/register">
              Crear cuenta
            </Link>
          </Text>
        </Card.Body>
      </Card.Root>
    </Center>
  );
};