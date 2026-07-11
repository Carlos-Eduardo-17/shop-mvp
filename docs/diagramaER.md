## Diagrama Entidad Relación (especificado)
```mermaid

graph LR

U[Usuario]
C[Carrito]
O[Órden]
T[Categoría]
P[Producto]
E[Elemento de Carrito]
D[Detalle de Órden]

    U -->|1 puede tener solo 1| C
    U -->|1 puede tener M| O
    T -->|1 puede agrupar M| P
    C -->|1 puede tener M| E
    O -->|1 se compone de M| D
    P -->|1 puede estar en M| D
    P -->|1 puede estar en M| E

```

#### **1 Usuario : 1 Carrito**
Un usuario solo puede tener un carrito activo a la vez.
#### **1 Usuario : M Órden**
Un usuario puede realizar múltiples compras/órdenes a lo largo del tiempo.

#### **1 Categoría : M Producto**
Una categoría agrupa varios productos.

#### **1 Carrito : M Elemento de Carrito**
Un carrito de compras contiene múltiples líneas (elementos) de productos.

#### **1 Órden : M Detalle de Órden**
Una orden de compra se compone de múltiples líneas de detalle.

#### **1 Producto : M Detalle de Órden**
Un producto puede estar en muchos carritos simultáneamente

#### **1 Producto : M Elemento de Carrito**
Un producto puede formar parte de muchas órdenes históricas.

## Mayor detalle de tablas
![](/docs/img/dbdiagram-01.png)