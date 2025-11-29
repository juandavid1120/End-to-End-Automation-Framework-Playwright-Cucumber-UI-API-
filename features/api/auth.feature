# language: es
@api @critical @auth
Característica: Autenticación - FakeStore API
  Como QA automatizador
  Quiero validar el endpoint de autenticación
  Para asegurar control de acceso y obtención de token

  @bug
  Escenario: Autenticación de usuario (login) - éxito
    Cuando hago una petición POST a "/auth/login" con usuario "john_doe" y contraseña "pass123"
    Entonces el código HTTP debería ser 200
    Y la respuesta debería contener un token

  Escenario: Autenticación de usuario (login) - credenciales inválidas
    Cuando hago una petición POST a "/auth/login" con usuario "invalid_user" y contraseña "bad"
    Entonces el código HTTP debería ser 401
    Y la respuesta debería contener un mensaje de error
