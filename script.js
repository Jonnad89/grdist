// CONFIGURACIÓN: Cambia este número por el de la distribuidora (Código de país + número)
// Ejemplo para Argentina: 54911XXXXXXXX
const TELEFONO_DISTRIBUIDORA = "5491112345678"; 

let cart = [];

// Alternar la visibilidad del carrito lateral
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('active');
}

// Añadir un producto al carrito
function addToCart(productId) {
    // Buscamos la tarjeta del producto en el HTML para sacar los datos actualizados
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    const name = productCard.getAttribute('data-name');
    const price = parseFloat(productCard.getAttribute('data-price'));

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCartUI();
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Actualizar la interfaz del carrito
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // Actualizar contador del navbar
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Limpiar contenedor de items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        cartTotalPrice.innerText = "$0";
        return;
    }

    let total = 0;

    // Renderizar cada producto en el carrito
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        total += itemSubtotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.quantity} x $${item.price.toLocaleString('es-AR')} = $${itemSubtotal.toLocaleString('es-AR')}</p>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">Quitar</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // Actualizar el precio total en pantalla
    cartTotalPrice.innerText = `$${total.toLocaleString('es-AR')}`;
}

// Construir el mensaje y redirigir a WhatsApp
function sendWhatsApp() {
    if (cart.length === 0) {
        alert("¡Tu carrito está vacío! Añade productos antes de finalizar.");
        return;
    }

    // Encabezado del mensaje pedido por el usuario
    let mensaje = "Hola, te quiero pedir estos productos:\n\n";

    // Recorrer el carrito para listar los productos
    cart.forEach(item => {
        mensaje += `• (${item.quantity}) un. - ${item.name}\n`;
    });

    // Calcular el total general
    const totalGeneral = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    mensaje += `\n*Total estimado: $${totalGeneral.toLocaleString('es-AR')}*`;

    // Codificar el texto para que sea válido en una URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Crear el enlace directo a la API de WhatsApp
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${TELEFONO_DISTRIBUIDORA}&text=${mensajeCodificado}`;

    // Abrir en una nueva pestaña
    window.open(urlWhatsApp, '_blank');
}