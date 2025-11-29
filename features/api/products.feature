# language: es
@api @critical @products
Característica: Productos - FakeStore API
  Como QA automatizador
  Quiero validar los endpoints de catálogo
  Para asegurar integridad mínima del catálogo

  Escenario: Obtener la lista de productos devuelve resultados válidos
    Cuando hago una petición GET a "/products"
    Entonces el código HTTP debería ser 200
    Y la respuesta debería contener una lista no vacía de productos con campos básicos

  Escenario: Obtener un producto por id devuelve datos correctos
    Dado que existe el producto con id 1
    Cuando hago una petición GET a "/products/1"
    Entonces el código HTTP debería ser 200
    Y la respuesta debería contener los campos "id", "title" y "price"

  Escenario: Obtener categorías y filtrar por categoría
    Cuando hago una petición GET a "/products/categories"
    Entonces el código HTTP debería ser 200
    Y la respuesta debería contener al menos una categoría
    Cuando hago una petición GET a "/products/category/electronics"
    Entonces el código HTTP debería ser 200
    Y todos los productos de la respuesta deberían pertenecer a la categoría "electronics"
