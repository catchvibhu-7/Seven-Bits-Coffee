import { menuData } from './brand-data.js';
import { CartSystem } from './cart-logic.js';
import { renderCheckoutModal } from './checkout-modal.js';

// --- System State ---
const root = document.getElementById('menu-root');
const cartCount = document.getElementById('cart-count');
let cart = [];
let serviceChargeActive = true;

// --- Render Engine ---
function renderMenu() {
    // Clear root before rendering to prevent duplicates
    root.innerHTML = '';

    menuData.sections.forEach(section => {
        const sectionEl = document.createElement('section');
        sectionEl.className = `section-container section-${section.id}`;
        sectionEl.innerHTML = `<h2 class="section-title">${section.title}</h2>`;

        const items = menuData.items.filter(item => item.section === section.id);
        
        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'menu-item';
            itemEl.innerHTML = `
                <div class="icon icon-${item.icon}"></div>
                <div class="info">
                    <div class="name">${item.name}</div>
                    <div class="story">${item.story}</div>
                </div>
                <div class="price">₹${item.price}</div>
                <button class="btn-order" onclick="addToCart(${item.id})">ADD BIT</button>
            `;
            sectionEl.appendChild(itemEl);
        });

        root.appendChild(sectionEl);
    });
}

// --- Global System Functions (window-scoped for HTML buttons) ---

/**
 * Adds an item object to the cart buffer
 */
window.addToCart = (id) => {
    const item = menuData.items.find(i => i.id === id);
    if (item) {
        cart.push({...item}); // Push a copy of the item
        cartCount.innerText = cart.length;
        console.log(`System Update: [${item.name}] added to buffer.`);
    }
};

/**
 * Toggles the visibility of the transaction summary
 */
document.getElementById('cart-status').addEventListener('click', () => {
    if (cart.length > 0) {
        refreshModal();
    } else {
        alert("Buffer Empty: No bits selected for checkout.");
    }
});

/**
 * Re-renders the modal to reflect math changes (like removing service charge)
 */
function refreshModal() {
    const existingModal = document.getElementById('modal-overlay');
    if (existingModal) existingModal.remove();
    
    // Pass the current state to the modal renderer
    renderCheckoutModal(cart, serviceChargeActive);
}

window.closeModal = () => {
    const modal = document.getElementById('modal-overlay');
    if (modal) modal.remove();
};

/**
 * Logic to remove the optional 2% service charge
 */
window.removeServiceCharge = () => {
    serviceChargeActive = false;
    console.log("System Update: Service Charge protocol disabled.");
    refreshModal(); // Re-calculate and re-draw
};

/**
 * Finalizes the order and resets the system state
 */
window.processPayment = (method) => {
    const finalData = CartSystem.calculateBreakdown(cart, serviceChargeActive);
    
    alert(`
        TRANSACTION INITIALIZED
        -----------------------
        Method: ${method}
        Total Bits: ₹${finalData.total.toFixed(2)}
        
        Please proceed to ${method === 'COUNTER' ? 'the billing desk' : 'secure gateway'}.
    `);
    
    // Reset System
    cart = [];
    serviceChargeActive = true;
    cartCount.innerText = "0";
    window.closeModal();
};

// --- Initial Boot ---
renderMenu();