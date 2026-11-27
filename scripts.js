// ============================================================
// DATOS DE PARTIDA
// No los modifiques: son los datos de partida.
// ============================================================
const productos = [
  {
    id: 1,
    nombre: "auriculares inalámbricos pro",
    precio: 79.99,
    descuento: 15, // porcentaje
    fechaFinOferta: "2026-08-25",
    descripcion: "Auriculares con cancelación de ruido activa, autonomía de 30 horas y estuche de carga rápida compatible con USB-C."
  },
  {
    id: 2,
    nombre: "teclado mecánico compacto",
    precio: 54.50,
    descuento: 0,
    fechaFinOferta: null,
    descripcion: "Teclado mecánico de formato 75%, switches intercambiables en caliente y retroiluminación RGB personalizable."
  },
  {
    id: 3,
    nombre: "monitor 27 pulgadas 4K",
    precio: 329.00,
    descuento: 10,
    fechaFinOferta: "2026-08-18",
    descripcion: "Monitor 4K de 27 pulgadas con panel IPS, 99% sRGB y soporte ajustable en altura e inclinación."
  },
  {
    id: 4,
    nombre: "cargador rápido 65w",
    precio: 24.99,
    descuento: 0,
    fechaFinOferta: null,
    descripcion: "Cargador USB-C de 65W con GaN, compatible con portátiles, tablets y móviles."
  },
  {
    id: 5,
    nombre: "webcam full hd",
    precio: 39.95,
    descuento: 20,
    fechaFinOferta: "2026-08-30",
    descripcion: "Webcam 1080p con enfoque automático, micrófono integrado con reducción de ruido y clip universal."
  }
];

// ============================================================
// EJERCICIO 1 — Catálogo (Math, String + DOM)
// Pinta en #contenedorProductos una tarjeta por producto.
// Requisitos:
//   - Nombre con la primera letra en mayúscula (el resto tal cual).
//   - Precio final redondeado a 2 decimales si el producto tiene
//     descuento (precio - precio*descuento/100), si no, precio normal.
//   - Descripción truncada a 60 caracteres + "..." si la supera.
//   - Si tiene descuento, mostrar una etiqueta "-X% dto".
// ============================================================
function pintarCatalogo(listaProductos) {
  const contenedor = document.getElementById("contenedorProductos");
  contenedor.innerHTML = "";

  listaProductos.forEach((producto) => {
    // 1. Nombre con la primera letra en mayúscula y el resto tal cual
    const nombreFormateado =
      producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1);

    // 2. Cálculo de precio final redondeado a 2 decimales si tiene descuento
    const tieneDescuento = producto.descuento > 0;
    const precioFinal = tieneDescuento
      ? Math.round((producto.precio - (producto.precio * producto.descuento) / 100) * 100) / 100
      : producto.precio;

    // 3. Descripción truncada a 60 caracteres + "..." si la supera
    const descripcionFormateada =
      producto.descripcion.length > 60
        ? producto.descripcion.slice(0, 60) + "..."
        : producto.descripcion;

    // 4. Etiqueta de descuento si corresponde
    const etiquetaDescuento = tieneDescuento
      ? `<span class="badge-descuento">-${producto.descuento}% dto</span>`
      : "";

    // Creación e inserción de la tarjeta en el DOM
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-producto");

    tarjeta.innerHTML = `
      ${etiquetaDescuento}
      <h3>${nombreFormateado}</h3>
      <p class="descripcion">${descripcionFormateada}</p>
      <p class="precio">${precioFinal.toFixed(2)} €</p>
      <button onclick="anadirAlCarrito(${producto.id})">Añadir al carrito</button>
    `;

    contenedor.appendChild(tarjeta);
  });
}

function mostrarTodosLosProductos() {
  pintarCatalogo(productos);
}

// ============================================================
// EJERCICIO 2 — Buscador y código promocional (RegExp)
// ============================================================
function buscarProductos() {
  const texto = document.getElementById("inputBusqueda").value.trim();
  const busqueda = texto.toLowerCase();

  // Cadena vacía: se muestra todo el catálogo
  pintarCatalogo(productos.filter((p) => p.nombre.toLowerCase().includes(busqueda)));

  guardarBusquedaEnHistorial(texto);
}

function validarCodigoPromocional() {
  const codigo = document.getElementById("inputPromo").value;
  const mensaje = document.getElementById("mensajePromo");
  const valido = /^[A-Z]{3}[0-9]{4}$/.test(codigo);

  mensaje.textContent = valido
    ? "Código válido. Descuento aplicado en el siguiente paso de compra."
    : "Código no válido. Formato esperado: 3 letras mayúsculas + 4 dígitos (ej. ABC1234).";
  mensaje.style.color = valido ? "green" : "red";
}

// ============================================================
// EJERCICIO 3 — Carrito de compra (localStorage)
// ============================================================
const CLAVE_CARRITO = "carritoTienda";

/**
 * Lee el carrito del localStorage.
 * @returns {Array<{id:number,nombre:string,precio:number,cantidad:number}>}
 */
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

/**
 * Guarda el carrito en el localStorage.
 * @param {Array} carrito
 */
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

/**
 * Añade un producto al carrito (o incrementa su cantidad en 1).
 * @param {number} idProducto
 */
function anadirAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.id === idProducto);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  pintarCarrito();
}

/**
 * Elimina por completo un producto del carrito.
 * @param {number} idProducto
 */
function eliminarDelCarrito(idProducto) {
  guardarCarrito(obtenerCarrito().filter((i) => i.id !== idProducto));
  pintarCarrito();
}

/**
 * Vacía el carrito y refresca la pantalla.
 */
function vaciarCarrito() {
  localStorage.removeItem(CLAVE_CARRITO);
  pintarCarrito();
}

/**
 * Pinta el contenido del carrito en #cuerpoCarrito y el total en #totalCarrito.
 */
function pintarCarrito() {
  const cuerpo = document.getElementById("cuerpoCarrito");
  cuerpo.innerHTML = "";
  let total = 0;

  obtenerCarrito().forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.precio.toFixed(2)} €</td>
      <td>${item.cantidad}</td>
      <td>${subtotal.toFixed(2)} €</td>
      <td><button onclick="eliminarDelCarrito(${item.id})">Eliminar</button></td>
    `;
    cuerpo.appendChild(fila);
  });

  document.getElementById("totalCarrito").textContent = `Total: ${total.toFixed(2)} €`;
}

// ============================================================
// EJERCICIO 4 — Historial de búsquedas (sessionStorage)
// ============================================================
function guardarBusquedaEnHistorial(textoBuscado) {
  // TODO
}

function pintarHistorial() {
  // TODO
}

// ============================================================
// EJERCICIO 5 — Fechas de oferta (Date)
// (Se integrará dentro de pintarCatalogo)
// ============================================================

// ============================================================
// Carga inicial de la página
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  mostrarTodosLosProductos();
  pintarCarrito();
  pintarHistorial();
});