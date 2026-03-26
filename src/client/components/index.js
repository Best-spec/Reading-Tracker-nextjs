/**
 * ReadFlow Shared Components
 * Reusable UI components using Tailwind CSS
 */

const Components = {
    /**
     * Button Component
     * @param {Object} options
     * @param {string} options.text - Button text
     * @param {string} options.variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
     * @param {string} options.size - 'sm' | 'md' | 'lg'
     * @param {string} options.icon - Lucide icon name
     * @param {Function} options.onClick - Click handler
     * @param {string} options.className - Additional classes
     * @param {boolean} options.disabled - Disabled state
     * @param {string} options.type - Button type attribute
     * @param {string} options.id - Button id
     */
    Button(options = {}) {
        const {
            text = '',
            variant = 'primary',
            size = 'md',
            icon = null,
            onClick = null,
            className = '',
            disabled = false,
            type = 'button',
            id = ''
        } = options;

        const variantClasses = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
            secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
            outline: 'border-2 border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
            ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
            danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
        };

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg'
        };

        const btn = document.createElement('button');
        btn.type = type;
        btn.id = id;
        btn.disabled = disabled;
        btn.className = `
            inline-flex items-center justify-center gap-2
            font-medium rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variantClasses[variant] || variantClasses.primary}
            ${sizeClasses[size] || sizeClasses.md}
            ${className}
        `;

        if (icon) {
            const iconEl = document.createElement('i');
            iconEl.setAttribute('data-lucide', icon);
            iconEl.className = 'w-4 h-4';
            btn.appendChild(iconEl);
        }

        if (text) {
            const span = document.createElement('span');
            span.textContent = text;
            btn.appendChild(span);
        }

        if (onClick) {
            btn.addEventListener('click', onClick);
        }

        return btn;
    },

    /**
     * Card Component
     * @param {Object} options
     * @param {string} options.title - Card title
     * @param {string} options.subtitle - Card subtitle
     * @param {HTMLElement|Array} options.content - Card content
     * @param {Array} options.actions - Array of button configurations
     * @param {string} options.className - Additional classes
     * @param {string} options.headerClass - Header section classes
     * @param {string} options.bodyClass - Body section classes
     * @param {HTMLElement} options.image - Card image element
     */
    Card(options = {}) {
        const {
            title = '',
            subtitle = '',
            content = null,
            actions = [],
            className = '',
            headerClass = '',
            bodyClass = '',
            image = null,
            hover = false,
            shadow = 'md'
        } = options;

        const card = document.createElement('div');
        const shadowClasses = {
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            none: ''
        };

        card.className = `
            bg-white rounded-xl overflow-hidden
            border border-gray-200
            ${shadowClasses[shadow] || shadowClasses.md}
            ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
            ${className}
        `;

        // Image section
        if (image) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'w-full h-48 overflow-hidden';
            imgContainer.appendChild(image);
            card.appendChild(imgContainer);
        }

        // Header section
        if (title || subtitle) {
            const header = document.createElement('div');
            header.className = `p-4 border-b border-gray-100 ${headerClass}`;
            
            if (title) {
                const titleEl = document.createElement('h3');
                titleEl.className = 'text-lg font-semibold text-gray-900';
                titleEl.textContent = title;
                header.appendChild(titleEl);
            }

            if (subtitle) {
                const subtitleEl = document.createElement('p');
                subtitleEl.className = 'text-sm text-gray-500 mt-1';
                subtitleEl.textContent = subtitle;
                header.appendChild(subtitleEl);
            }

            card.appendChild(header);
        }

        // Body section
        if (content) {
            const body = document.createElement('div');
            body.className = `p-4 ${bodyClass}`;
            
            if (Array.isArray(content)) {
                content.forEach(el => body.appendChild(el));
            } else {
                body.appendChild(content);
            }

            card.appendChild(body);
        }

        // Actions section
        if (actions && actions.length > 0) {
            const footer = document.createElement('div');
            footer.className = 'p-4 border-t border-gray-100 flex gap-2 justify-end';
            
            actions.forEach(action => {
                footer.appendChild(this.Button(action));
            });

            card.appendChild(footer);
        }

        return card;
    },

    /**
     * Modal Component
     * @param {Object} options
     * @param {string} options.id - Modal ID
     * @param {string} options.title - Modal title
     * @param {HTMLElement|Array} options.content - Modal content
     * @param {Array} options.actions - Array of button configurations
     * @param {string} options.size - 'sm' | 'md' | 'lg' | 'xl'
     * @param {boolean} options.closable - Show close button
     * @param {Function} options.onClose - Close callback
     * @param {Function} options.onOpen - Open callback
     */
    Modal(options = {}) {
        const {
            id = 'modal',
            title = '',
            content = null,
            actions = [],
            size = 'md',
            closable = true,
            onClose = null,
            onOpen = null
        } = options;

        const sizeClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            full: 'max-w-full mx-4'
        };

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = `
            fixed inset-0 z-50 hidden
            bg-black/50 backdrop-blur-sm
            flex items-center justify-center
            transition-opacity duration-200
        `;

        // Create modal container
        const modal = document.createElement('div');
        modal.className = `
            bg-white rounded-xl shadow-2xl
            w-full ${sizeClasses[size] || sizeClasses.md}
            transform transition-transform duration-200 scale-95 opacity-0
        `;

        // Header
        if (title || closable) {
            const header = document.createElement('div');
            header.className = `
                flex items-center justify-between
                px-6 py-4 border-b border-gray-200
            `;

            if (title) {
                const titleEl = document.createElement('h3');
                titleEl.className = 'text-lg font-semibold text-gray-900';
                titleEl.textContent = title;
                header.appendChild(titleEl);
            } else {
                header.appendChild(document.createElement('div'));
            }

            if (closable) {
                const closeBtn = document.createElement('button');
                closeBtn.className = `
                    text-gray-400 hover:text-gray-600
                    transition-colors duration-200
                `;
                closeBtn.innerHTML = '<i data-lucide="x" class="w-5 h-5"></i>';
                closeBtn.onclick = () => this.closeModal(id);
                header.appendChild(closeBtn);
            }

            modal.appendChild(header);
        }

        // Body
        if (content) {
            const body = document.createElement('div');
            body.className = 'px-6 py-4';
            
            if (Array.isArray(content)) {
                content.forEach(el => body.appendChild(el));
            } else {
                body.appendChild(content);
            }

            modal.appendChild(body);
        }

        // Footer with actions
        if (actions && actions.length > 0) {
            const footer = document.createElement('div');
            footer.className = `
                flex justify-end gap-3
                px-6 py-4 border-t border-gray-200
            `;

            actions.forEach(action => {
                footer.appendChild(this.Button(action));
            });

            modal.appendChild(footer);
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal(id);
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(id);
            }
        };

        overlay.dataset.escapeHandler = escapeHandler;

        return overlay;
    },

    openModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.remove('hidden');
        document.addEventListener('keydown', modal.dataset.escapeHandler);
        
        // Trigger animation
        requestAnimationFrame(() => {
            const modalContainer = modal.querySelector('div');
            modalContainer.classList.remove('scale-95', 'opacity-0');
            modalContainer.classList.add('scale-100', 'opacity-100');
        });

        // Initialize icons
        if (window.lucide) {
            lucide.createIcons();
        }
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        const modalContainer = modal.querySelector('div');
        modalContainer.classList.remove('scale-100', 'opacity-100');
        modalContainer.classList.add('scale-95', 'opacity-0');

        document.removeEventListener('keydown', modal.dataset.escapeHandler);

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    },

    /**
     * Alert/Toast Component
     * @param {Object} options
     * @param {string} options.message - Alert message
     * @param {string} options.type - 'success' | 'error' | 'warning' | 'info'
     * @param {number} options.duration - Duration in ms (0 for persistent)
     * @param {string} options.position - 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'
     */
    Toast(options = {}) {
        const {
            message = '',
            type = 'info',
            duration = 3000,
            position = 'top-right'
        } = options;

        const typeClasses = {
            success: 'bg-green-50 border-green-200 text-green-800',
            error: 'bg-red-50 border-red-200 text-red-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            info: 'bg-blue-50 border-blue-200 text-blue-800'
        };

        const iconMap = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const positionClasses = {
            'top-right': 'top-4 right-4',
            'top-center': 'top-4 left-1/2 -translate-x-1/2',
            'bottom-right': 'bottom-4 right-4',
            'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
        };

        const toast = document.createElement('div');
        toast.className = `
            fixed z-50 flex items-center gap-3 px-4 py-3
            rounded-lg border shadow-lg
            transform transition-all duration-300
            translate-y-2 opacity-0
            ${typeClasses[type] || typeClasses.info}
            ${positionClasses[position] || positionClasses['top-right']}
        `;
        toast.innerHTML = `
            <i data-lucide="${iconMap[type]}" class="w-5 h-5"></i>
            <span class="font-medium">${message}</span>
        `;

        document.body.appendChild(toast);

        if (window.lucide) {
            lucide.createIcons();
        }

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('translate-y-2', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    },

    /**
     * Progress Bar Component
     * @param {Object} options
     * @param {number} options.value - Current value (0-100 or absolute)
     * @param {number} options.max - Maximum value
     * @param {string} options.size - 'sm' | 'md' | 'lg'
     * @param {string} options.color - Color variant
     * @param {boolean} options.showLabel - Show percentage label
     */
    ProgressBar(options = {}) {
        const {
            value = 0,
            max = 100,
            size = 'md',
            color = 'blue',
            showLabel = true
        } = options;

        const percentage = Math.min(100, Math.max(0, (value / max) * 100));

        const sizeClasses = {
            sm: 'h-1.5',
            md: 'h-2.5',
            lg: 'h-4'
        };

        const colorClasses = {
            blue: 'bg-blue-600',
            green: 'bg-green-600',
            yellow: 'bg-yellow-500',
            red: 'bg-red-600',
            purple: 'bg-purple-600'
        };

        const container = document.createElement('div');
        container.className = 'w-full';

        if (showLabel) {
            const label = document.createElement('div');
            label.className = 'flex justify-between text-sm text-gray-600 mb-1';
            label.innerHTML = `
                <span>${value}/${max}</span>
                <span>${Math.round(percentage)}%</span>
            `;
            container.appendChild(label);
        }

        const barContainer = document.createElement('div');
        barContainer.className = `
            w-full bg-gray-200 rounded-full overflow-hidden
            ${sizeClasses[size] || sizeClasses.md}
        `;

        const bar = document.createElement('div');
        bar.className = `
            ${colorClasses[color] || colorClasses.blue}
            rounded-full transition-all duration-500
            ${sizeClasses[size] || sizeClasses.md}
        `;
        bar.style.width = `${percentage}%`;

        barContainer.appendChild(bar);
        container.appendChild(barContainer);

        return container;
    },

    /**
     * Badge Component
     * @param {Object} options
     * @param {string} options.text - Badge text
     * @param {string} options.variant - 'default' | 'success' | 'warning' | 'danger' | 'info'
     * @param {string} options.size - 'sm' | 'md'
     */
    Badge(options = {}) {
        const {
            text = '',
            variant = 'default',
            size = 'md'
        } = options;

        const variantClasses = {
            default: 'bg-gray-100 text-gray-800',
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            danger: 'bg-red-100 text-red-800',
            info: 'bg-blue-100 text-blue-800'
        };

        const sizeClasses = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-2.5 py-1 text-sm'
        };

        const badge = document.createElement('span');
        badge.className = `
            inline-flex items-center font-medium rounded-full
            ${variantClasses[variant] || variantClasses.default}
            ${sizeClasses[size] || sizeClasses.md}
        `;
        badge.textContent = text;

        return badge;
    },

    /**
     * Input Component
     * @param {Object} options
     * @param {string} options.type - Input type
     * @param {string} options.label - Input label
     * @param {string} options.placeholder - Placeholder text
     * @param {string} options.value - Initial value
     * @param {boolean} options.required - Required attribute
     * @param {string} options.error - Error message
     * @param {Function} options.onChange - Change handler
     * @param {string} options.className - Additional classes
     */
    Input(options = {}) {
        const {
            type = 'text',
            label = '',
            placeholder = '',
            value = '',
            required = false,
            error = '',
            onChange = null,
            className = '',
            id = '',
            name = ''
        } = options;

        const container = document.createElement('div');
        container.className = 'w-full';

        if (label) {
            const labelEl = document.createElement('label');
            labelEl.className = 'block text-sm font-medium text-gray-700 mb-1';
            labelEl.textContent = label;
            if (id || name) {
                labelEl.htmlFor = id || name;
            }
            container.appendChild(labelEl);
        }

        const input = document.createElement('input');
        input.type = type;
        input.id = id || '';
        input.name = name || '';
        input.placeholder = placeholder;
        input.value = value;
        input.required = required;
        input.className = `
            w-full px-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${className}
        `;

        if (onChange) {
            input.addEventListener('input', onChange);
        }

        container.appendChild(input);

        if (error) {
            const errorEl = document.createElement('p');
            errorEl.className = 'mt-1 text-sm text-red-600';
            errorEl.textContent = error;
            container.appendChild(errorEl);
        }

        return container;
    },

    /**
     * Avatar Component
     * @param {Object} options
     * @param {string} options.src - Image URL
     * @param {string} options.alt - Alt text
     * @param {string} options.size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
     * @param {boolean} options.online - Show online indicator
     */
    Avatar(options = {}) {
        const {
            src = '',
            alt = 'Avatar',
            size = 'md',
            online = false
        } = options;

        const sizeClasses = {
            xs: 'w-6 h-6',
            sm: 'w-8 h-8',
            md: 'w-10 h-10',
            lg: 'w-12 h-12',
            xl: 'w-16 h-16'
        };

        const container = document.createElement('div');
        container.className = 'relative inline-block';

        const img = document.createElement('img');
        img.src = src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + alt;
        img.alt = alt;
        img.className = `
            ${sizeClasses[size] || sizeClasses.md}
            rounded-full object-cover border-2 border-white shadow-sm
        `;

        container.appendChild(img);

        if (online) {
            const indicator = document.createElement('span');
            indicator.className = `
                absolute bottom-0 right-0 
                w-3 h-3 bg-green-500 border-2 border-white
                rounded-full
            `;
            container.appendChild(indicator);
        }

        return container;
    }
};

// Export for global use
window.ReadFlowComponents = Components;
