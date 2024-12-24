// Menu que se usa en pantallas chicas y se hace visible o no
const alternarMenu = document.querySelector('.menu_toggle'); 
const menu = document.querySelector('.menu'); 

alternarMenu.addEventListener('click', () => { 
    menu.classList.toggle('menu_active'); 
}); 

// rotamos imagenes tipo carrusel 
let indiceActual = 0; 
const imagenes = document.querySelectorAll('.contenedor_imagenes img'); 

function mostrarSiguienteImagen() { 
    imagenes[indiceActual].classList.remove('activa'); 
    indiceActual = (indiceActual + 1) % imagenes.length; 
    imagenes[indiceActual].classList.add('activa'); 
} 

setInterval(mostrarSiguienteImagen, 3000); // le doy 3 segundos a cada imagen 
// modales que usamos para las reseñas7 opiniones 
function abrirModal(idModal) { 
    const modal = document.getElementById(idModal); 
    modal.style.display = "block"; 

    if (window.innerWidth <= 768) { 
        const modalContent = modal.querySelector('.modal_content'); 
        modalContent.style.margin = '50% auto'; // centra el modal en en centro de la pantalla (vertical) 
        modalContent.style.transform = 'translateY(-50%)'; 
    } 
} 

function cerrarModal(idModal) { 
    document.getElementById(idModal).style.display = "none"; 
} 

// cierra el Modal  
window.addEventListener('click', (e) => { 
    if (e.target.classList.contains('modal')) { 
        e.target.style.display = 'none'; 
    } 
}); 
// productos y carrito de compras 
document.addEventListener('DOMContentLoaded', () => {
    // Cargar la cantidad actual del carrito desde localStorage
    let cantidadCarrito = localStorage.getItem('cantidadCarrito') || 0;
    document.getElementById('cantidad_carrito').innerText = `(${cantidadCarrito})`;

    if (window.location.pathname.endsWith('carrito.html')) { 
        cargarProductosCarrito();
    } else {
        fetch('data/db.json') // levantamos los datos de los productos
            .then(response => response.json())
            .then(data => {
                mostrarProductosDestacados(data.products);
                mostrarProductosCatalogo(data.products);
                actualizarCantidadCarrito();
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }
});
// se muestra productos destacados  
function mostrarProductosDestacados(productos) { 
    const contenedor = document.getElementById('productos_destacados'); 
    if (contenedor) {  
        contenedor.innerHTML = ''; // limnpiamos mcontenido 
        productos.slice(0, 4).forEach(producto => { // muestro 4 productos destacados 
            const productCard = document.createElement('div'); 
            productCard.classList.add('card_producto'); 
            productCard.innerHTML = ` 
                <img src="${producto.image}" alt="${producto.name}" class="producto_img"> 
                <h3>${producto.name}</h3> 
                <p class="producto_descripcion">${producto.description}</p> 
                <div class="precio"> 
                    <p class="precio_descuento">$${producto.price}</p> 
                </div> 
                <button class="boton_resenia" onclick="abrirModal('modal${producto.id}')">Reseñas</button> 
            `; 
            contenedor.appendChild(productCard); 

            const modal = document.createElement('div'); 
            modal.id = `modal${producto.id}`; 
            modal.classList.add('modal'); 
            modal.innerHTML = ` 
                <div class="modal_content"> 
                    <span class="close" onclick="cerrarModal('modal${producto.id}')">&times;</span> 
                    <div class="review"> 
                        <img src="${producto.reviewImage}" alt="Foto del revisor" class="review_photo"> 
                        <div> 
                            <div class="review_name">${producto.reviewUser}</div> 
                            <div class="review_stars">${'★'.repeat(producto.reviewStars)}</div> 
                            <div class="review_text">${producto.reviewComment}</div> 
                        </div> 
                    </div> 
                </div> 
            `; 
            document.body.appendChild(modal); 
        }); 
    } 
} 
// muestro productos en Catálogo  
function mostrarProductosCatalogo(productos) { 
    const contenedor = document.getElementById('catalogo'); 
    if (contenedor) {  
        contenedor.innerHTML = ''; // Limpio contenido  
        productos.slice(0, 12).forEach((producto, index) => { // mostrar los 12 productos (unicos) 
            const productCard = document.createElement('div'); 
            productCard.classList.add('card_producto'); 
            productCard.innerHTML = ` 
                <img src="${producto.image}" alt="${producto.name}" class="producto_img"> 
                <h3>${producto.name}</h3> 
                <p class="producto_descripcion">${producto.description}</p> 
                <div class="precio"> 
                    <p class="precio_descuento">$${producto.price}</p> 
                </div> 
                <button class="boton_carrito" onclick="añadirAlCarrito('${producto.id}', 1)">Añadir al Carrito</button> 
            `; 
            contenedor.appendChild(productCard); 
        }); 
    } 
} 

// mostro productos en el Carrito  vertical en pantallas chicas
function mostrarProductosCarrito(productos) {
    const contenedor = document.getElementById('carrito_tabla');
    const totalPrecioElemento = document.getElementById('total_precio');
    let totalPrecio = 0;
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (contenedor) {
        contenedor.innerHTML = ''; // limpio contenido

        carrito.forEach(item => {
            const producto = productos.find(p => p.id === item.id);
            if (producto) {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td class="imagen" data-label="Imagen"><img src="${producto.image}" alt="${producto.name}" class="producto_img pequeña"></td>
                    <td class="nombre" data-label="Nombre del Artículo">${producto.name}</td>
                    <td class="precio" data-label="Precio">$${producto.price}</td>
                    <td class="cantidad" data-label="Cantidad">${item.cantidad}</td>
                    <td class="total_parcial" data-label="Total Parcial">$${(producto.price * item.cantidad).toFixed(2)}</td>
                    <td class="accion" data-label="Acción"><button class="boton_eliminar" onclick="eliminarDelCarrito('${item.id}')">Eliminar</button></td>
                `;
                contenedor.appendChild(fila);

                // obtengo precio total
                totalPrecio += producto.price * item.cantidad;
            }
        });

        totalPrecioElemento.textContent = totalPrecio.toFixed(2);
    }
}
// agrego productos al Carrito 
function añadirAlCarrito(productId, cantidad) { 
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []; 
    const productoEnCarrito = carrito.find(producto => producto.id === productId); 
    if (productoEnCarrito) { 
        productoEnCarrito.cantidad += cantidad; 
    } else { 
        carrito.push({ id: productId, cantidad: cantidad }); 
    } 
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    actualizarCantidadCarrito(); 
    
    // mensaje de confirmacion 
    alert('¡Su producto fue agregado con éxito!');
} 

// eliminar producto del carrito
function eliminarDelCarrito(productId) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== productId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // obtengo productos del localStorage
    const productos = JSON.parse(localStorage.getItem('carrito_products')) || [];

    // Actualizamos la vista del carrito
    mostrarProductosCarrito(productos);
    actualizarCantidadCarrito();
}

// actualizo cantidad del Carrito 
function actualizarCantidadCarrito() { 
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []; 
    let totalCantidad = carrito.reduce((total, item) => total + item.cantidad, 0); 
    localStorage.setItem('cantidadCarrito', totalCantidad); // Actualiza la cantidad en localStorage
    document.getElementById('cantidad_carrito').textContent = `(${totalCantidad})`; 
}
