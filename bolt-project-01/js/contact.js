// ===== CONTACT FORM FUNCTIONALITY =====

class ContactManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupFAQ();
        this.setupFormValidation();
        this.setupInteractiveElements();
    }

    // ===== CONTACT FORM =====
    setupContactForm() {
        const contactForm = document.querySelector('#contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });

        // Custom select styling
        this.setupCustomSelects();
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate all fields
        if (!this.validateForm(form)) {
            this.showNotification('Please correct the errors below', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <div class="spinner"></div>
            Sending...
        `;
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.processFormSubmission(data, form, submitBtn, originalText);
        }, 2000);
    }

    processFormSubmission(data, form, submitBtn, originalText) {
        // Simulate success/error
        const isSuccess = Math.random() > 0.1; // 90% success rate

        if (isSuccess) {
            this.showSuccessMessage(data);
            form.reset();
            this.showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
        } else {
            this.showNotification('There was an error sending your message. Please try again.', 'error');
        }

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }

    showSuccessMessage(data) {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content success-content">
                    <div class="success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22,4 12,14.01 9,11.01"/>
                        </svg>
                    </div>
                    <h2>Thank You, ${data.firstName}!</h2>
                    <p>Your message has been received. Our team will review your inquiry and get back to you within 24 hours.</p>
                    <div class="next-steps">
                        <h3>What happens next?</h3>
                        <ul>
                            <li>We'll review your project requirements</li>
                            <li>A specialist will be assigned to your case</li>
                            <li>You'll receive a detailed proposal within 48 hours</li>
                        </ul>
                    </div>
                    <div class="success-actions">
                        <button class="btn btn-primary" onclick="this.closest('.success-modal').remove()">Continue</button>
                        <a href="portfolio.html" class="btn btn-outline">View Our Work</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 10000);
    }

    // ===== FORM VALIDATION =====
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (fieldType === 'email' && value) {
            if (!this.isValidEmail(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (fieldName === 'phone' && value) {
            if (!this.isValidPhone(value)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        // Name validation
        if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
            if (value.length < 2) {
                this.showFieldError(field, 'Name must be at least 2 characters long');
                return false;
            }
        }

        // Company validation
        if (fieldName === 'company' && value) {
            if (value.length < 2) {
                this.showFieldError(field, 'Company name must be at least 2 characters long');
                return false;
            }
        }

        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                this.showFieldError(field, 'Message must be at least 10 characters long');
                return false;
            }
        }

        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--error-500);
            font-size: var(--font-size-sm);
            margin-top: var(--space-1);
            display: block;
        `;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    // ===== CUSTOM SELECTS =====
    setupCustomSelects() {
        const selects = document.querySelectorAll('.form-select');
        
        selects.forEach(select => {
            select.addEventListener('change', () => {
                if (select.value) {
                    select.classList.add('has-value');
                } else {
                    select.classList.remove('has-value');
                }
            });
        });
    }

    // ===== FAQ FUNCTIONALITY =====
    setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ===== INTERACTIVE ELEMENTS =====
    setupInteractiveElements() {
        // Contact method hover effects
        const contactMethods = document.querySelectorAll('.contact-method');
        
        contactMethods.forEach(method => {
            method.addEventListener('mouseenter', () => {
                method.style.transform = 'translateY(-4px)';
                method.style.boxShadow = 'var(--shadow-lg)';
            });
            
            method.addEventListener('mouseleave', () => {
                method.style.transform = 'translateY(0)';
                method.style.boxShadow = 'none';
            });
            
            // Click to copy functionality for email and phone
            const methodText = method.querySelector('.method-text');
            if (methodText && (methodText.textContent.includes('@') || methodText.textContent.includes('+'))) {
                method.style.cursor = 'pointer';
                method.addEventListener('click', () => {
                    navigator.clipboard.writeText(methodText.textContent).then(() => {
                        this.showNotification('Copied to clipboard!', 'success');
                    });
                });
            }
        });

        // Form field focus effects
        const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        // Character counter for textarea
        const messageTextarea = document.querySelector('#message');
        if (messageTextarea) {
            this.setupCharacterCounter(messageTextarea);
        }
    }

    setupCharacterCounter(textarea) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
            text-align: right;
            margin-top: var(--space-1);
        `;
        
        textarea.parentElement.appendChild(counter);
        
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.style.color = 'var(--warning-500)';
            } else if (remaining < 0) {
                counter.style.color = 'var(--error-500)';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    // ===== FORM ANALYTICS =====
    trackFormInteraction(action, field = null) {
        // In a real application, you would send this data to your analytics service
        console.log('Form interaction:', { action, field, timestamp: new Date().toISOString() });
    }

    // ===== PROGRESSIVE ENHANCEMENT =====
    setupProgressiveEnhancement() {
        // Auto-save form data to localStorage
        const form = document.querySelector('#contactForm');
        if (!form) return;

        const formId = 'contactForm';
        
        // Load saved data
        this.loadFormData(form, formId);
        
        // Save data on input
        form.addEventListener('input', () => {
            this.saveFormData(form, formId);
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', () => {
            setTimeout(() => {
                localStorage.removeItem(formId);
            }, 3000);
        });
    }

    saveFormData(form, formId) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem(formId, JSON.stringify(data));
    }

    loadFormData(form, formId) {
        const savedData = localStorage.getItem(formId);
        if (!savedData) return;

        try {
            const data = JSON.parse(savedData);
            Object.entries(data).forEach(([key, value]) => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && value) {
                    field.value = value;
                    if (field.classList.contains('form-select')) {
                        field.classList.add('has-value');
                    }
                }
            });
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    }

    // ===== UTILITY FUNCTIONS =====
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? 'var(--success-500)' : 
                           type === 'error' ? 'var(--error-500)' : 
                           'var(--brand-primary)',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: '400px'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Setup close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                this.closeNotification(notification);
            }
        }, 5000);
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    setupAccessibility() {
        // Add ARIA labels and descriptions
        const form = document.querySelector('#contactForm');
        if (!form) return;

        // Form sections
        const formSections = form.querySelectorAll('.form-row, .form-group');
        formSections.forEach((section, index) => {
            section.setAttribute('role', 'group');
            section.setAttribute('aria-labelledby', `section-${index}`);
        });

        // Required field indicators
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const label = form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.textContent.includes('*')) {
                label.innerHTML += ' <span aria-label="required">*</span>';
            }
        });

        // Error announcements
        const errorContainer = document.createElement('div');
        errorContainer.setAttribute('aria-live', 'polite');
        errorContainer.setAttribute('aria-atomic', 'true');
        errorContainer.className = 'sr-only';
        errorContainer.id = 'form-errors';
        form.appendChild(errorContainer);
    }
}

// Add contact-specific styles
const contactStyles = `
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: var(--error-500);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .form-group.focused .form-label {
        color: var(--brand-primary);
    }
    
    .form-select.has-value {
        color: var(--text-primary);
    }
    
    .success-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .success-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .success-content {
        text-align: center;
        padding: 3rem;
        max-width: 500px;
    }
    
    .success-icon {
        width: 80px;
        height: 80px;
        background: var(--success-500);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 2rem;
        color: white;
    }
    
    .success-icon svg {
        width: 40px;
        height: 40px;
    }
    
    .success-content h2 {
        color: var(--text-primary);
        margin-bottom: 1rem;
    }
    
    .success-content p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }
    
    .next-steps {
        text-align: left;
        background: var(--surface);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        margin-bottom: 2rem;
    }
    
    .next-steps h3 {
        color: var(--text-primary);
        margin-bottom: 1rem;
    }
    
    .next-steps ul {
        list-style: none;
        padding: 0;
    }
    
    .next-steps li {
        padding: 0.5rem 0;
        color: var(--text-secondary);
        position: relative;
        padding-left: 1.5rem;
    }
    
    .next-steps li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--success-500);
        font-weight: bold;
    }
    
    .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .character-counter {
        transition: color 0.2s ease;
    }
    
    @media (max-width: 768px) {
        .success-actions {
            flex-direction: column;
        }
        
        .notification {
            left: 20px;
            right: 20px;
            transform: translateY(-100%);
        }
        
        .notification.active {
            transform: translateY(0);
        }
    }
`;

// Inject contact styles
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = contactStyles;
document.head.appendChild(contactStyleSheet);

// Initialize contact manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
    window.contactManager.setupProgressiveEnhancement();
    window.contactManager.setupAccessibility();
});

// Export for use in other files
window.ContactManager = ContactManager;