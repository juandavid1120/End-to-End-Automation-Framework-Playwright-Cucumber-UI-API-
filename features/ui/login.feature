# language: es
@ui @login @critical
Característica: Autenticación en SauceDemo
  Como usuario de la plataforma SauceDemo
  Quiero poder iniciar sesión
  Para acceder a mi panel de compras

  Antecedentes:
    Dado que estoy en la página de login de SauceDemo

  @smoke @happy-path @TC-UI-002
  Escenario: Login exitoso con credenciales estándar
    Cuando ingreso el usuario "standard_user" y la contraseña "secret_sauce"
    Entonces debería ser redirigido a la página de inventario

  @negative @security @TC-UI-004
  Escenario: Login fallido con credenciales inválidas
    Cuando ingreso el usuario "invalid_user" y la contraseña "wrong_password"
    Entonces debería ver un mensaje de error de credenciales incorrectas

  @negative @security @TC-UI-003
  Escenario: Login bloqueado con usuario bloqueado
    Cuando ingreso el usuario "locked_out_user" y la contraseña "secret_sauce"
    Entonces debería ver un mensaje de error de usuario bloqueado

  @security @access-control @TC-UI-005
  Escenario: Acceso directo a página protegida sin autenticación
    Dado que NO he iniciado sesión en SauceDemo
     Cuando intento acceder directamente a la página de inventario
     Entonces debería ser redirigido a la página de login
     Y debería ver un mensaje indicando que debo iniciar sesión