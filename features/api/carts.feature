# language: es
@api @critical @carts
Característica: Carritos - FakeStore API
  Como QA automatizador
  Quiero validar la creación y actualización de carritos
  Para asegurar que las órdenes se materializan correctamente

  Escenario: Crear un carrito válido mediante POST y verificar respuesta
    Cuando creo un carrito con payload válido
    Entonces el código HTTP debería ser 201
    Y la respuesta debería contener un id de carrito y los productos enviados

  Escenario: Actualizar un carrito existente mediante PUT
    Dado que creo un carrito con payload válido
    Cuando actualizo el carrito con el id devuelto por la creación con un nuevo payload
    Entonces el código HTTP debería ser 200
    Y la respuesta debería reflejar los cambios en los productos del carrito
