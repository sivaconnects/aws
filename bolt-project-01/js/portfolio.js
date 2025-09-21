// ===== PORTFOLIO FUNCTIONALITY =====

class PortfolioManager {
    constructor() {
        this.currentFilter = 'all';
        this.portfolioItems = [];
        this.init();
    }

    init() {
        this.setupFilterTabs();
        this.setupPortfolioItems();
        this.setupLightbox();
        this.setupLoadMore();
    }

    // ===== FILTER FUNCTIONALITY =====
    setupFilterTabs() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Get filter value
                const filter = tab.dataset.filter;
                this.filterPortfolio(filter);
            });
        });
    }

    filterPortfolio(filter) {
        this.currentFilter = filter;
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach((item, index) => {
            const categories = item.dataset.category ? item.dataset.category.split(' ') : [];
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                item.style.display = 'block';
                // Stagger animation
                setTimeout(() => {
                    item.classList.add('aos-animate');
                }, index * 100);
            } else {
                item.style.display = 'none';
                item.classList.remove('aos-animate');
            }
        });
        
        // Update URL without page reload
        const url = new URL(window.location);
        if (filter === 'all') {
            url.searchParams.delete('filter');
        } else {
            url.searchParams.set('filter', filter);
        }
        window.history.replaceState({}, '', url);
    }

    // ===== PORTFOLIO ITEMS SETUP =====
    setupPortfolioItems() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            // Add hover effects
            item.addEventListener('mouseenter', () => {
                this.animatePortfolioItem(item, 'enter');
            });
            
            item.addEventListener('mouseleave', () => {
                this.animatePortfolioItem(item, 'leave');
            });
            
            // Setup portfolio buttons
            const viewBtn = item.querySelector('.portfolio-btn:not(.secondary)');
            const demoBtn = item.querySelector('.portfolio-btn.secondary');
            
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openCaseStudy(item);
                });
            }
            
            if (demoBtn) {
                demoBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openDemo(item);
                });
            }
        });
        
        // Store portfolio items
        this.portfolioItems = Array.from(portfolioItems);
    }

    animatePortfolioItem(item, type) {
        const image = item.querySelector('.portfolio-image img');
        const overlay = item.querySelector('.portfolio-overlay');
        
        if (type === 'enter') {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            if (overlay) {
                overlay.style.opacity = '1';
            }
        } else {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (overlay) {
                overlay.style.opacity = '0';
            }
        }
    }

    // ===== CASE STUDY MODAL =====
    openCaseStudy(item) {
        const title = item.querySelector('.portfolio-title').textContent;
        const description = item.querySelector('.portfolio-description').textContent;
        const image = item.querySelector('.portfolio-image img').src;
        const category = item.querySelector('.portfolio-category').textContent;
        const stats = Array.from(item.querySelectorAll('.stat')).map(stat => ({
            number: stat.querySelector('.stat-number').textContent,
            label: stat.querySelector('.stat-label').textContent
        }));
        const tech = Array.from(item.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
        
        this.createModal({
            title,
            description,
            image,
            category,
            stats,
            tech,
            type: 'case-study'
        });
    }

    openDemo(item) {
        const title = item.querySelector('.portfolio-title').textContent;
        
        // Create demo modal with interactive elements
        this.createModal({
            title: `${title} - Live Demo`,
            type: 'demo',
            content: this.generateDemoContent(item)
        });
    }

    createModal(data) {
        // Remove existing modal
        const existingModal = document.querySelector('.portfolio-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'portfolio-modal';
        modal.innerHTML = this.generateModalContent(data);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Setup close functionality
        this.setupModalClose(modal);
    }

    generateModalContent(data) {
        if (data.type === 'case-study') {
            return `
                <div class="modal-backdrop">
                    <div class="modal-content">
                        <button class="modal-close">&times;</button>
                        <div class="modal-header">
                            <img src="${data.image}" alt="${data.title}" class="modal-image">
                            <div class="modal-info">
                                <span class="modal-category">${data.category}</span>
                                <h2 class="modal-title">${data.title}</h2>
                                <p class="modal-description">${data.description}</p>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div class="modal-stats">
                                <h3>Key Results</h3>
                                <div class="stats-grid">
                                    ${data.stats.map(stat => `
                                        <div class="stat-item">
                                            <div class="stat-number">${stat.number}</div>
                                            <div class="stat-label">${stat.label}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="modal-tech">
                                <h3>Technologies Used</h3>
                                <div class="tech-list">
                                    ${data.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                            </div>
                            <div class="modal-details">
                                <h3>Project Details</h3>
                                <p>This project showcases our expertise in delivering cutting-edge AI solutions that drive real business results. Through careful analysis and innovative implementation, we were able to exceed all project goals and deliver exceptional value to our client.</p>
                                <ul>
                                    <li>Comprehensive requirements analysis and solution design</li>
                                    <li>Agile development methodology with regular client feedback</li>
                                    <li>Rigorous testing and quality assurance processes</li>
                                    <li>Seamless deployment and ongoing support</li>
                                </ul>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary">Contact Us About This Project</button>
                            <button class="btn btn-outline modal-close-btn">Close</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (data.type === 'demo') {
            return `
                <div class="modal-backdrop">
                    <div class="modal-content demo-modal">
                        <button class="modal-close">&times;</button>
                        <div class="modal-header">
                            <h2 class="modal-title">${data.title}</h2>
                        </div>
                        <div class="modal-body">
                            ${data.content}
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-outline modal-close-btn">Close Demo</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    generateDemoContent(item) {
        const category = item.querySelector('.portfolio-category').textContent.toLowerCase();
        
        switch (category) {
            case 'analytics':
                return this.generateAnalyticsDemo();
            case 'automation':
                return this.generateAutomationDemo();
            case 'custom ai':
                return this.generateAIDemo();
            default:
                return this.generateGenericDemo();
        }
    }

    generateAnalyticsDemo() {
        return `
            <div class="demo-container">
                <div class="demo-dashboard">
                    <div class="dashboard-header">
                        <h3>Analytics Dashboard Demo</h3>
                        <div class="dashboard-controls">
                            <button class="demo-btn active" data-view="overview">Overview</button>
                            <button class="demo-btn" data-view="detailed">Detailed</button>
                            <button class="demo-btn" data-view="realtime">Real-time</button>
                        </div>
                    </div>
                    <div class="dashboard-content">
                        <div class="demo-metrics">
                            <div class="demo-metric">
                                <div class="metric-value" data-count="94.2">0</div>
                                <div class="metric-label">Accuracy Rate</div>
                            </div>
                            <div class="demo-metric">
                                <div class="metric-value" data-count="2.3">0</div>
                                <div class="metric-label">Response Time (s)</div>
                            </div>
                            <div class="demo-metric">
                                <div class="metric-value" data-count="10547">0</div>
                                <div class="metric-label">Processed Today</div>
                            </div>
                        </div>
                        <div class="demo-chart">
                            <canvas id="demoChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateAutomationDemo() {
        return `
            <div class="demo-container">
                <div class="automation-demo">
                    <h3>Process Automation Demo</h3>
                    <div class="workflow-visualization">
                        <div class="workflow-step active" data-step="1">
                            <div class="step-icon">📄</div>
                            <div class="step-label">Document Input</div>
                        </div>
                        <div class="workflow-arrow">→</div>
                        <div class="workflow-step" data-step="2">
                            <div class="step-icon">🤖</div>
                            <div class="step-label">AI Processing</div>
                        </div>
                        <div class="workflow-arrow">→</div>
                        <div class="workflow-step" data-step="3">
                            <div class="step-icon">✅</div>
                            <div class="step-label">Validation</div>
                        </div>
                        <div class="workflow-arrow">→</div>
                        <div class="workflow-step" data-step="4">
                            <div class="step-icon">📊</div>
                            <div class="step-label">Output</div>
                        </div>
                    </div>
                    <div class="demo-controls">
                        <button class="btn btn-primary" id="startAutomation">Start Process</button>
                        <button class="btn btn-outline" id="resetAutomation">Reset</button>
                    </div>
                    <div class="process-log">
                        <h4>Process Log</h4>
                        <div class="log-entries" id="processLog">
                            <div class="log-entry">System ready for processing...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateAIDemo() {
        return `
            <div class="demo-container">
                <div class="ai-demo">
                    <h3>AI Assistant Demo</h3>
                    <div class="chat-interface">
                        <div class="chat-messages" id="chatMessages">
                            <div class="message ai-message">
                                <div class="message-avatar">🤖</div>
                                <div class="message-content">
                                    Hello! I'm your AI assistant. I can help you with data analysis, process automation, and answering questions about your business operations. What would you like to know?
                                </div>
                            </div>
                        </div>
                        <div class="chat-input">
                            <input type="text" id="chatInput" placeholder="Type your message..." />
                            <button class="btn btn-primary" id="sendMessage">Send</button>
                        </div>
                    </div>
                    <div class="demo-suggestions">
                        <h4>Try asking:</h4>
                        <button class="suggestion-btn" data-message="What's our current performance?">What's our current performance?</button>
                        <button class="suggestion-btn" data-message="How can we improve efficiency?">How can we improve efficiency?</button>
                        <button class="suggestion-btn" data-message="Show me the latest analytics">Show me the latest analytics</button>
                    </div>
                </div>
            </div>
        `;
    }

    generateGenericDemo() {
        return `
            <div class="demo-container">
                <div class="generic-demo">
                    <h3>Interactive Demo</h3>
                    <p>This is a sample demonstration of our AI capabilities. In a real implementation, this would showcase the specific features and functionality of the deployed solution.</p>
                    <div class="demo-features">
                        <div class="feature-demo">
                            <h4>Real-time Processing</h4>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 85%;"></div>
                            </div>
                            <span>85% Complete</span>
                        </div>
                        <div class="feature-demo">
                            <h4>Accuracy Rate</h4>
                            <div class="circular-progress" data-percentage="94">
                                <span>94%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupModalClose(modal) {
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        };
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
        
        // Setup demo interactions
        this.setupDemoInteractions(modal);
    }

    setupDemoInteractions(modal) {
        // Analytics demo
        const demoButtons = modal.querySelectorAll('.demo-btn');
        demoButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                demoButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Automation demo
        const startBtn = modal.querySelector('#startAutomation');
        const resetBtn = modal.querySelector('#resetAutomation');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.runAutomationDemo(modal);
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAutomationDemo(modal);
            });
        }
        
        // AI Chat demo
        const chatInput = modal.querySelector('#chatInput');
        const sendBtn = modal.querySelector('#sendMessage');
        const suggestions = modal.querySelectorAll('.suggestion-btn');
        
        if (chatInput && sendBtn) {
            const sendMessage = () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.addChatMessage(modal, message, 'user');
                    chatInput.value = '';
                    
                    // Simulate AI response
                    setTimeout(() => {
                        this.addChatMessage(modal, this.generateAIResponse(message), 'ai');
                    }, 1000);
                }
            };
            
            sendBtn.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        suggestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                if (chatInput) {
                    chatInput.value = message;
                    chatInput.focus();
                }
            });
        });
        
        // Initialize counters in demo
        const counters = modal.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            this.animateCounter(counter);
        });
    }

    runAutomationDemo(modal) {
        const steps = modal.querySelectorAll('.workflow-step');
        const log = modal.querySelector('#processLog');
        let currentStep = 0;
        
        const messages = [
            'Document received and validated...',
            'AI processing initiated...',
            'Data extraction completed...',
            'Validation checks passed...',
            'Output generated successfully!'
        ];
        
        const processStep = () => {
            if (currentStep < steps.length) {
                // Activate current step
                steps[currentStep].classList.add('active');
                
                // Add log entry
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                logEntry.textContent = messages[currentStep];
                log.appendChild(logEntry);
                
                // Scroll to bottom
                log.scrollTop = log.scrollHeight;
                
                currentStep++;
                setTimeout(processStep, 1500);
            }
        };
        
        // Reset first
        this.resetAutomationDemo(modal);
        setTimeout(processStep, 500);
    }

    resetAutomationDemo(modal) {
        const steps = modal.querySelectorAll('.workflow-step');
        const log = modal.querySelector('#processLog');
        
        steps.forEach(step => step.classList.remove('active'));
        log.innerHTML = '<div class="log-entry">System ready for processing...</div>';
    }

    addChatMessage(modal, message, type) {
        const chatMessages = modal.querySelector('#chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${type === 'ai' ? '🤖' : '👤'}</div>
            <div class="message-content">${message}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(message) {
        const responses = {
            'performance': 'Based on current data, your system is performing at 94.2% accuracy with an average response time of 2.3 seconds. Performance has improved 15% over the last month.',
            'efficiency': 'I recommend implementing automated data preprocessing and optimizing your neural network architecture. This could improve efficiency by up to 25%.',
            'analytics': 'Here are your key metrics: 10,547 processes completed today, 94.2% success rate, and 2.3s average processing time. Would you like me to dive deeper into any specific area?',
            'default': 'I understand you\'re asking about our AI capabilities. Our system can process complex data patterns, automate workflows, and provide real-time insights. What specific area would you like to explore?'
        };
        
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('performance')) return responses.performance;
        if (lowerMessage.includes('efficiency') || lowerMessage.includes('improve')) return responses.efficiency;
        if (lowerMessage.includes('analytics') || lowerMessage.includes('data')) return responses.analytics;
        
        return responses.default;
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }

    // ===== LIGHTBOX =====
    setupLightbox() {
        const portfolioImages = document.querySelectorAll('.portfolio-image img');
        
        portfolioImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLightbox(img.src, img.alt);
            });
        });
    }

    openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop">
                <button class="lightbox-close">&times;</button>
                <img src="${src}" alt="${alt}" class="lightbox-image">
                <div class="lightbox-caption">${alt}</div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
        
        // Close functionality
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }

    // ===== LOAD MORE =====
    setupLoadMore() {
        const loadMoreBtn = document.querySelector('#loadMoreBtn');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', () => {
            this.loadMoreItems();
        });
    }

    loadMoreItems() {
        // Simulate loading more items
        const portfolioContainer = document.querySelector('.portfolio-items');
        const loadMoreBtn = document.querySelector('#loadMoreBtn');
        
        // Show loading state
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // Add new items (in a real app, this would fetch from API)
            const newItems = this.generateMoreItems(3);
            newItems.forEach(item => {
                portfolioContainer.appendChild(item);
            });
            
            // Reset button
            loadMoreBtn.textContent = 'Load More Articles';
            loadMoreBtn.disabled = false;
            
            // Setup new items
            this.setupPortfolioItems();
        }, 1500);
    }

    generateMoreItems(count) {
        const items = [];
        const sampleData = [
            {
                title: 'E-commerce AI Optimization',
                category: 'analytics',
                description: 'Advanced recommendation engine that increased sales by 40% through personalized product suggestions.',
                image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
            },
            {
                title: 'Smart Manufacturing System',
                category: 'automation',
                description: 'IoT-powered manufacturing optimization that reduced downtime by 60% and improved quality control.',
                image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
            },
            {
                title: 'Legal Document AI',
                category: 'custom',
                description: 'Natural language processing system for legal document analysis and contract review automation.',
                image: 'https://images.pexels.com/photos/3184283/pexels-photo-3184283.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
            }
        ];
        
        for (let i = 0; i < count && i < sampleData.length; i++) {
            const data = sampleData[i];
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.dataset.category = data.category;
            item.innerHTML = `
                <div class="portfolio-image">
                    <img src="${data.image}" alt="${data.title}">
                    <div class="portfolio-overlay">
                        <div class="portfolio-actions">
                            <button class="portfolio-btn">View Case Study</button>
                            <button class="portfolio-btn secondary">Live Demo</button>
                        </div>
                    </div>
                </div>
                <div class="portfolio-content">
                    <div class="portfolio-meta">
                        <span class="portfolio-category">${data.category}</span>
                        <span class="portfolio-date">2024</span>
                    </div>
                    <h3 class="portfolio-title">${data.title}</h3>
                    <p class="portfolio-description">${data.description}</p>
                    <div class="portfolio-stats">
                        <div class="stat">
                            <span class="stat-number">${Math.floor(Math.random() * 500) + 100}</span>
                            <span class="stat-label">% Improvement</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${Math.floor(Math.random() * 99) + 90}</span>
                            <span class="stat-label">% Accuracy</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">$${Math.floor(Math.random() * 5) + 1}M</span>
                            <span class="stat-label">Value Created</span>
                        </div>
                    </div>
                    <div class="portfolio-tech">
                        <span class="tech-tag">Machine Learning</span>
                        <span class="tech-tag">Python</span>
                        <span class="tech-tag">TensorFlow</span>
                    </div>
                </div>
            `;
            items.push(item);
        }
        
        return items;
    }

    // ===== INITIALIZATION FROM URL =====
    initFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        
        if (filter && filter !== 'all') {
            // Update active tab
            const filterTab = document.querySelector(`[data-filter="${filter}"]`);
            if (filterTab) {
                document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
                filterTab.classList.add('active');
                this.filterPortfolio(filter);
            }
        }
    }
}

// Add modal styles
const modalStyles = `
    .portfolio-modal {
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
    
    .portfolio-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .modal-content {
        background: var(--surface-elevated);
        border-radius: var(--radius-2xl);
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .portfolio-modal.active .modal-content {
        transform: scale(1);
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--text-secondary);
        cursor: pointer;
        z-index: 10;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .modal-close:hover {
        background: var(--surface);
        color: var(--text-primary);
    }
    
    .lightbox {
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
    
    .lightbox.active {
        opacity: 1;
        visibility: visible;
    }
    
    .lightbox-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 2rem;
    }
    
    .lightbox-image {
        max-width: 90%;
        max-height: 80%;
        object-fit: contain;
        border-radius: var(--radius-lg);
    }
    
    .lightbox-caption {
        color: white;
        margin-top: 1rem;
        text-align: center;
    }
    
    .lightbox-close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
    }
    
    .lightbox-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

// Inject modal styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// Initialize portfolio manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
    window.portfolioManager.initFromURL();
});

// Export for use in other files
window.PortfolioManager = PortfolioManager;