# language: es
@ui @purchase @e2e @critical
Característica: Flujo de Compra Completo en SauceDemo
  Como cliente de SauceDemo
  Quiero poder completar una compra de principio a fin

  Antecedentes:
    Dado que estoy en la página de login de SauceDemo
    Y he iniciado sesión como "standard_user" con contraseña "secret_sauce"
    Y estoy en la página de inventario

  @smoke @happy-path @TC-UI-003
  Escenario: Compra exitosa de un solo producto y validación de pago
    Cuando añado el producto "Sauce Labs Backpack" al carrito
    Y hago clic en el botón "Checkout"
    Y ingreso la siguiente información de envío:
      | Campo       | Valor  |
      | First Name  | John   |
      | Last Name   | Doe    |
      | Postal Code | 12345  |
    Y hago clic en "Continue"

    Entonces debería ver el resumen de mi compra
    Y el subtotal debería ser "$29.99"
    Y el total debería ser la suma del subtotal más impuestos

    Cuando hago clic en "Finish"
    Entonces debería ver el mensaje "Thank you for your order!"
    Y el carrito debería estar vacío