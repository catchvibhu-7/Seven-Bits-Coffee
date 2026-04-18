import { CartSystem } from './cart-logic.js';

export function renderCheckoutModal(cartItems, onRemoveServiceCharge) {
    const breakdown = CartSystem.calculateBreakdown(cartItems);
    
    const modalHtml = `
    <div id="modal-overlay" class="modal-overlay">
        <div class="modal-content">
            <h2>07 // TRANSACTION SUMMARY</h2>
            <div class="cart-items-list">
                ${cartItems.map(item => `
                    <div class="cart-row">
                        <span>${item.name}</span>
                        <span>₹${item.price}</span>
                    </div>
                `).join('')}
            </div>

            <hr>

            <div class="breakdown-window">
                <div class="calc-row">Subtotal: <span>₹${breakdown.subtotal.toFixed(2)}</span></div>
                <div class="calc-row">CGST (9.5%): <span>₹${breakdown.cgst.toFixed(2)}</span></div>
                <div class="calc-row">SGST (9.5%): <span>₹${breakdown.sgst.toFixed(2)}</span></div>
                <div class="calc-row service-charge-row">
                    Service Charge (2%): <span>₹${breakdown.serviceCharge.toFixed(2)}</span>
                    <button class="btn-remove" onclick="window.removeServiceCharge()">[REMOVE]</button>
                </div>
                <div class="calc-row total-row">TOTAL BITS: <span>₹${breakdown.total.toFixed(2)}</span></div>
            </div>

            <div class="payment-options">
                <button class="btn-pay" onclick="window.processPayment('COUNTER')">PAY AT COUNTER</button>
                <button class="btn-pay" onclick="window.processPayment('ONLINE')">PAY ONLINE</button>
            </div>
            
            <button class="btn-close" onclick="window.closeModal()">CLOSE SYSTEM</button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}