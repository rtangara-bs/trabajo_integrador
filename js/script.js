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

// cierra el Modal  
function cerrarModal(idModal) { 
    document.getElementById(idModal).style.display = "none"; 
} 

window.addEventListener('click', (e) => { 
    if (e.target.classList.contains('modal')) { 
        e.target.style.display = 'none'; 
    } 
}); 

// productos y carrito de compras 
document.addEventListener('DOMContentLoaded', () => {
    // cargar la cantidad actual del carrito desde localStorage
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
// funcion para cargar y mostrar los productos del carrito
function cargarProductosCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    fetch('data/db.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('carrito_products', JSON.stringify(data.products));
            mostrarProductosCarrito(data.products);
            actualizarCantidadCarrito();
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

// funcion para mostrar los productos en el carrito
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

// funcion para añadir y eliminar productos y actualizar cantidad
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

function eliminarDelCarrito(productId) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== productId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // obtengo productos del localStorage
    const productos = JSON.parse(localStorage.getItem('carrito_products')) || [];

    // actualizamos la vista del carrito
    mostrarProductosCarrito(productos);
    actualizarCantidadCarrito();
}

function actualizarCantidadCarrito() { 
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []; 
    let totalCantidad = carrito.reduce((total, item) => total + item.cantidad, 0); 
    localStorage.setItem('cantidadCarrito', totalCantidad); // actualiza la cantidad en localStorage
    document.getElementById('cantidad_carrito').textContent = `(${totalCantidad})`; 
}
// funcion para mostrar productos destacados
function mostrarProductosDestacados(productos) { 
    const contenedor = document.getElementById('productos_destacados'); 
    if (contenedor) {  
        contenedor.innerHTML = ''; // Limpio contenido 
        productos.slice(0, 4).forEach(producto => { // Muestro 4 productos destacados 
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

// funcion para mostrar productos en el catálogo
function mostrarProductosCatalogo(productos) { 
    const contenedor = document.getElementById('catalogo'); 
    if (contenedor) {  
        contenedor.innerHTML = ''; // Limpio contenido  
        productos.slice(0, 12).forEach((producto, index) => { // Muestro los 12 productos (unicos) 
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
function realizarCompra(event) {
    event.preventDefault();  // para que no nos dirija al saludo de formspree

    // mensajito al usuario
    const mensajeUsuario = 'Gracias, a la brevedad nos comunicaremos.';

    // creamos objeto con los datos del formulario
    const form = document.getElementById('formulario_compra');
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // agreamos mensaje al formulario
    formObject['mensaje'] = mensajeUsuario;
    
    // convertir el objeto a JSON
    const body = JSON.stringify(formObject);

    // enviar el formulario a Formspree
    fetch('https://formspree.io/f/mnnqpbwq', {
        method: 'POST',
        body: body,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // limpiar tabla y contador de carrito
            localStorage.removeItem('carrito');
            localStorage.setItem('cantidadCarrito', 0);

            // actualizamos
            cargarProductosCarrito();
            actualizarCantidadCarrito();

            // mensaje 
            alert('¡Muchas Gracias, su compra fue realizada con exito!');

            // después de un retraso redireccionamos a inicio
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            alert('Hubo un problema con su compra. Por favor intente nuevamente.');
        }
    })
    .catch(error => {
        alert('Hubo un problema con su compra. Por favor intente nuevamente.');
    });

    // Previene que el formulario recargue la página inmediatamente
    return false;
}



