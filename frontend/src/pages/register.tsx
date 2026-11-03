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

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await userService.register({
        username,
        email,
        password,
      });

      // Al registrarse con éxito, podemos redirigir directo al menú o al login
      navigate('/menu');
    } catch (error: any) {
      console.error('Error en el registro:', error);
      setErrorMessage(
        error.response?.data?.message || 'No se pudo crear la cuenta. Intente con otro usuario/email.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center minH="100vh" bg="bg.subtle" px={4}>
      <Card.Root w="full" maxW="md" shadow="md">
        <Card.Header textAlign="center">
          <Heading size="xl" color="teal.600">
            Crear Cuenta
          </Heading>
          <Text color="fg.muted" fontSize="sm" mt={1}>
            Sumate a BairesGuessr
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
                <Field.Label fontSize="sm">Nombre de Usuario</Field.Label>
                <Input
                  type="text"
                  placeholder="ej. Nahuel"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field.Root>

              <Field.Root required invalid={!!errorMessage}>
                <Field.Label fontSize="sm">Email</Field.Label>
                <Input
                  type="email"
                  placeholder="usuario@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field.Root>

              <Field.Root required invalid={!!errorMessage}>
                <Field.Label fontSize="sm">Contraseña</Field.Label>
                <Input
                  type="password"
                  placeholder="••••••••"
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
                Registrarse
              </Button>
            </Stack>
          </form>

          <Text mt={6} textAlign="center" fontSize="sm" color="fg.muted">
            ¿Ya tenés una cuenta?{' '}
            <Link color="teal.600" fontWeight="bold" href="/">
              Iniciar Sesión
            </Link>
          </Text>
        </Card.Body>
      </Card.Root>
    </Center>
  );
};