# language: es
@ui @cart @critical
Característica: Gestión del Carrito de Compras
  Como cliente de SauceDemo
  Quiero poder gestionar mi carrito de compras
  Para completar mi proceso de compra

  Antecedentes:
    Dado que he iniciado sesión como usuario "standard_user"
    Y estoy en la página de inventario

  @smoke @TC-UI-006 @critical-path @priority-1
  Escenario: Añadir un producto al carrito desde el inventario
    Dado que el carrito está vacío
    Cuando hago clic en "Add to cart" para "Sauce Labs Backpack"
    Entonces el botón debería cambiar a "Remove"
    Y el contador del carrito debería mostrar "1"
    Y el ícono del carrito debería resaltar el nuevo item

 @TC-UI-007 @critical-path @priority-2
  Escenario: Eliminar un producto desde el carrito
    Dado que he añadido "Sauce Labs Backpack" al carrito
    Y el contador del carrito muestra "1"
    Cuando voy al carrito
    Y elimino "Sauce Labs Backpack"
    Entonces el producto debería desaparecer de la lista
    Y el carrito debería estar vacío
    Y el contador del carrito no debería ser visible

  @negative @validation @TC-UI-008 @priority-1 @bug
  Escenario: Validar que no se puede proceder al checkout con carrito vacío
    Dado que el carrito está vacío
    Cuando voy a la página del carrito
    Cuando intento proceder al checkout
    Entonces no debería poder avanzar al checkout y debería permanecer en la página del carrito