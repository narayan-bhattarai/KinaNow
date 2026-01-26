import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UiAnimationService {

    flyToCart(event: MouseEvent | { clientX: number, clientY: number }, imageUrl: string): void {
        const cartBtn = document.getElementById('navbar-cart-btn');
        if (!cartBtn) {
            console.warn('Cart button not found for animation');
            return;
        }

        const cartPos = cartBtn.getBoundingClientRect();

        // Create floating element
        const img = document.createElement('img');
        img.src = imageUrl || '';
        // If no image, use a placeholder circle
        if (!imageUrl) {
            img.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.width = '20px';
            placeholder.style.height = '20px';
            placeholder.style.borderRadius = '50%';
            placeholder.style.backgroundColor = '#3b82f6';
            // ... same logic
        }

        img.style.position = 'fixed';
        img.style.left = `${event.clientX}px`;
        img.style.top = `${event.clientY}px`;
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '16px';
        img.style.border = '2px solid white';
        img.style.backgroundColor = 'white';
        img.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
        img.style.zIndex = '10000';
        img.style.transition = 'all 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
        img.style.pointerEvents = 'none';

        document.body.appendChild(img);

        // Initial scale-up effect
        img.style.transform = 'scale(1.2) rotate(15deg)';

        // Move to cart
        setTimeout(() => {
            img.style.left = `${cartPos.left + 15}px`;
            img.style.top = `${cartPos.top + 15}px`;
            img.style.width = '20px';
            img.style.height = '20px';
            img.style.opacity = '0.3';
            img.style.transform = 'scale(0.1) rotate(0deg)';
        }, 50);

        // Cleanup and visual pop
        setTimeout(() => {
            if (document.body.contains(img)) {
                document.body.removeChild(img);
            }

            // Visual feedback on the cart button
            cartBtn.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.3)', background: '#eff6ff' },
                { transform: 'scale(1)' }
            ], {
                duration: 400,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });
        }, 950);
    }
}
