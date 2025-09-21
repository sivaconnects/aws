// ===== BLOG FUNCTIONALITY =====

class BlogManager {
    constructor() {
        this.currentCategory = 'all';
        this.blogPosts = [];
        this.loadedPosts = 6; // Initial number of posts shown
        this.postsPerLoad = 3; // Number of posts to load each time
        this.init();
    }

    init() {
        this.setupCategoryFilter();
        this.setupLoadMore();
        this.setupNewsletterForm();
        this.setupBlogPosts();
        this.setupSearch();
    }

    // ===== CATEGORY FILTER =====
    setupCategoryFilter() {
        const categoryTabs = document.querySelectorAll('.category-tab');
        
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Get category value
                const category = tab.dataset.category;
                this.filterBlogPosts(category);
            });
        });
    }

    filterBlogPosts(category) {
        this.currentCategory = category;
        const blogPosts = document.querySelectorAll('.blog-post');
        
        blogPosts.forEach((post, index) => {
            const postCategory = post.dataset.category;
            const shouldShow = category === 'all' || postCategory === category;
            
            if (shouldShow) {
                post.style.display = 'block';
                // Stagger animation
                setTimeout(() => {
                    post.classList.add('aos-animate');
                }, index * 100);
            } else {
                post.style.display = 'none';
                post.classList.remove('aos-animate');
            }
        });
        
        // Update URL
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.replaceState({}, '', url);
        
        // Reset load more if needed
        this.updateLoadMoreButton();
    }

    // ===== BLOG POSTS SETUP =====
    setupBlogPosts() {
        const blogPosts = document.querySelectorAll('.blog-post');
        
        blogPosts.forEach(post => {
            // Add click handler for full post
            post.addEventListener('click', (e) => {
                // Don't trigger if clicking on interactive elements
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    return;
                }
                
                this.openBlogPost(post);
            });
            
            // Add hover effects
            post.addEventListener('mouseenter', () => {
                this.animateBlogPost(post, 'enter');
            });
            
            post.addEventListener('mouseleave', () => {
                this.animateBlogPost(post, 'leave');
            });
        });
        
        // Store blog posts
        this.blogPosts = Array.from(blogPosts);
    }

    animateBlogPost(post, type) {
        const image = post.querySelector('.post-image img');
        
        if (type === 'enter') {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            post.style.transform = 'translateY(-8px)';
        } else {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            post.style.transform = 'translateY(0)';
        }
    }

    // ===== BLOG POST MODAL =====
    openBlogPost(post) {
        const title = post.querySelector('.post-title').textContent;
        const excerpt = post.querySelector('.post-excerpt').textContent;
        const image = post.querySelector('.post-image img').src;
        const category = post.querySelector('.post-category').textContent;
        const date = post.querySelector('.post-date').textContent;
        const author = post.querySelector('.post-author span').textContent;
        const readTime = post.querySelector('.post-read-time').textContent;
        
        this.createBlogModal({
            title,
            excerpt,
            image,
            category,
            date,
            author,
            readTime,
            content: this.generateBlogContent(category, title)
        });
    }

    createBlogModal(data) {
        // Remove existing modal
        const existingModal = document.querySelector('.blog-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = this.generateBlogModalContent(data);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Setup close functionality
        this.setupBlogModalClose(modal);
        
        // Setup reading progress
        this.setupReadingProgress(modal);
    }

    generateBlogModalContent(data) {
        return `
            <div class="modal-backdrop">
                <div class="modal-content blog-content">
                    <button class="modal-close">&times;</button>
                    <div class="blog-header">
                        <img src="${data.image}" alt="${data.title}" class="blog-image">
                        <div class="blog-meta">
                            <span class="blog-category">${data.category}</span>
                            <span class="blog-date">${data.date}</span>
                            <span class="blog-read-time">${data.readTime}</span>
                        </div>
                        <h1 class="blog-title">${data.title}</h1>
                        <div class="blog-author-info">
                            <div class="author-details">
                                <span class="author-name">${data.author}</span>
                                <span class="author-title">AI Research Lead</span>
                            </div>
                        </div>
                    </div>
                    <div class="blog-body">
                        <div class="reading-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="readingProgress"></div>
                            </div>
                        </div>
                        <div class="blog-content-text">
                            ${data.content}
                        </div>
                        <div class="blog-actions">
                            <div class="social-share">
                                <h4>Share this article</h4>
                                <div class="share-buttons">
                                    <button class="share-btn twitter" data-platform="twitter">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                                        </svg>
                                        Twitter
                                    </button>
                                    <button class="share-btn linkedin" data-platform="linkedin">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                            <rect x="2" y="9" width="4" height="12"/>
                                            <circle cx="4" cy="4" r="2"/>
                                        </svg>
                                        LinkedIn
                                    </button>
                                    <button class="share-btn copy" data-platform="copy">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                        </svg>
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="blog-footer">
                        <div class="related-posts">
                            <h3>Related Articles</h3>
                            <div class="related-grid">
                                ${this.generateRelatedPosts(data.category)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateBlogContent(category, title) {
        const contentTemplates = {
            'ai-trends': `
                <p>The landscape of artificial intelligence is evolving at an unprecedented pace, with new breakthroughs emerging almost daily. As we navigate through 2024, several key trends are reshaping how businesses approach AI implementation and strategy.</p>
                
                <h2>The Rise of Multimodal AI</h2>
                <p>One of the most significant developments in AI is the emergence of multimodal systems that can process and understand multiple types of data simultaneously. These systems can analyze text, images, audio, and video in a unified manner, opening up new possibilities for comprehensive data analysis.</p>
                
                <blockquote>
                    "The future of AI lies not in specialized models, but in systems that can understand and process the world as humans do - through multiple senses and modalities." - Dr. Sarah Chen, AI Research Lead
                </blockquote>
                
                <h2>Edge AI and Distributed Computing</h2>
                <p>As privacy concerns grow and the need for real-time processing increases, edge AI is becoming increasingly important. By processing data locally on devices rather than in the cloud, businesses can achieve faster response times while maintaining data privacy.</p>
                
                <h2>Autonomous Decision-Making Systems</h2>
                <p>We're seeing a shift towards AI systems that can make complex decisions with minimal human intervention. These systems are being deployed in everything from supply chain management to financial trading, where speed and accuracy are paramount.</p>
                
                <h2>The Democratization of AI</h2>
                <p>Perhaps most importantly, AI is becoming more accessible to businesses of all sizes. No-code and low-code AI platforms are enabling companies without extensive technical resources to implement sophisticated AI solutions.</p>
                
                <p>As these trends continue to evolve, businesses that adapt quickly will gain significant competitive advantages. The key is to start experimenting with these technologies now, rather than waiting for them to become mainstream.</p>
            `,
            'case-studies': `
                <p>In this comprehensive case study, we'll explore how our AI implementation transformed a Fortune 500 company's operations, delivering measurable results that exceeded all expectations.</p>
                
                <h2>The Challenge</h2>
                <p>Our client was facing significant challenges with their data processing workflows. Manual processes were taking hours to complete, error rates were high, and the team was struggling to keep up with increasing data volumes.</p>
                
                <ul>
                    <li>Processing time: 6-8 hours per batch</li>
                    <li>Error rate: 15-20%</li>
                    <li>Manual intervention required: 80% of cases</li>
                    <li>Scalability issues with growing data volumes</li>
                </ul>
                
                <h2>Our Solution</h2>
                <p>We developed a comprehensive AI-powered automation system that addressed each of these pain points through intelligent process optimization and machine learning algorithms.</p>
                
                <h3>Key Components:</h3>
                <ol>
                    <li><strong>Intelligent Data Processing Engine:</strong> Custom neural networks trained on historical data patterns</li>
                    <li><strong>Real-time Validation System:</strong> Automated quality checks with 99.8% accuracy</li>
                    <li><strong>Adaptive Learning Module:</strong> Continuous improvement through feedback loops</li>
                    <li><strong>Scalable Infrastructure:</strong> Cloud-native architecture supporting unlimited growth</li>
                </ol>
                
                <h2>Implementation Process</h2>
                <p>The implementation was completed in three phases over 12 weeks, with careful attention to minimizing disruption to existing operations.</p>
                
                <h2>Results</h2>
                <p>The results exceeded all expectations:</p>
                
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-number">500%</div>
                        <div class="result-label">Faster Processing</div>
                    </div>
                    <div class="result-item">
                        <div class="result-number">95%</div>
                        <div class="result-label">Accuracy Rate</div>
                    </div>
                    <div class="result-item">
                        <div class="result-number">$2M</div>
                        <div class="result-label">Annual Savings</div>
                    </div>
                </div>
                
                <p>This case study demonstrates the transformative power of well-implemented AI solutions. The key to success was understanding the specific business needs and designing a solution that addressed them directly.</p>
            `,
            'tutorials': `
                <p>In this comprehensive tutorial, we'll walk you through integrating NeuralFlow's powerful API into your applications. By the end of this guide, you'll have a fully functional AI-powered feature running in your app.</p>
                
                <h2>Prerequisites</h2>
                <p>Before we begin, make sure you have:</p>
                <ul>
                    <li>A NeuralFlow account with API access</li>
                    <li>Basic knowledge of JavaScript/Python</li>
                    <li>A development environment set up</li>
                </ul>
                
                <h2>Step 1: Authentication</h2>
                <p>First, you'll need to authenticate with our API using your API key:</p>
                
                <pre><code>const apiKey = 'your-api-key-here';
const headers = {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
};</code></pre>
                
                <h2>Step 2: Making Your First Request</h2>
                <p>Let's start with a simple data processing request:</p>
                
                <pre><code>async function processData(inputData) {
    const response = await fetch('https://api.neuralflow.ai/v1/process', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            data: inputData,
            model: 'neural-processor-v2'
        })
    });
    
    return await response.json();
}</code></pre>
                
                <h2>Step 3: Handling Responses</h2>
                <p>The API returns structured responses that you can easily integrate into your application:</p>
                
                <pre><code>const result = await processData(myData);
console.log('Processed result:', result.output);
console.log('Confidence score:', result.confidence);
console.log('Processing time:', result.processingTime);</code></pre>
                
                <h2>Step 4: Error Handling</h2>
                <p>Always implement proper error handling for production applications:</p>
                
                <pre><code>try {
    const result = await processData(myData);
    // Handle success
} catch (error) {
    console.error('API Error:', error.message);
    // Handle error appropriately
}</code></pre>
                
                <h2>Advanced Features</h2>
                <p>Once you're comfortable with basic integration, explore our advanced features like batch processing, real-time streaming, and custom model training.</p>
                
                <h2>Best Practices</h2>
                <ul>
                    <li>Always validate input data before sending to the API</li>
                    <li>Implement proper rate limiting to avoid hitting API limits</li>
                    <li>Cache results when appropriate to improve performance</li>
                    <li>Monitor API usage and performance metrics</li>
                </ul>
                
                <p>With these fundamentals in place, you're ready to build powerful AI-enhanced applications. Check out our documentation for more advanced use cases and examples.</p>
            `,
            'industry-news': `
                <p>The AI industry is experiencing rapid regulatory changes as governments worldwide grapple with the implications of artificial intelligence. Understanding these regulations is crucial for any business implementing AI solutions.</p>
                
                <h2>Current Regulatory Landscape</h2>
                <p>As of 2024, several major jurisdictions have introduced or are developing comprehensive AI regulations:</p>
                
                <h3>European Union - AI Act</h3>
                <p>The EU's AI Act, which came into effect in 2024, establishes a risk-based approach to AI regulation. It categorizes AI systems into four risk levels:</p>
                <ul>
                    <li><strong>Minimal Risk:</strong> Most AI applications with minimal regulatory requirements</li>
                    <li><strong>Limited Risk:</strong> AI systems with specific transparency obligations</li>
                    <li><strong>High Risk:</strong> AI systems requiring strict compliance and oversight</li>
                    <li><strong>Unacceptable Risk:</strong> Prohibited AI applications</li>
                </ul>
                
                <h3>United States - Sectoral Approach</h3>
                <p>The US is taking a more sectoral approach, with different agencies regulating AI in their respective domains. Key developments include:</p>
                <ul>
                    <li>FDA guidelines for AI in medical devices</li>
                    <li>NIST AI Risk Management Framework</li>
                    <li>FTC guidance on AI and algorithms</li>
                </ul>
                
                <h2>Key Compliance Requirements</h2>
                <p>Regardless of jurisdiction, most AI regulations focus on several key areas:</p>
                
                <h3>Transparency and Explainability</h3>
                <p>Businesses must be able to explain how their AI systems make decisions, particularly in high-risk applications like hiring, lending, or healthcare.</p>
                
                <h3>Data Protection and Privacy</h3>
                <p>AI systems must comply with existing data protection laws like GDPR, with additional requirements for AI-specific data processing.</p>
                
                <h3>Bias and Fairness</h3>
                <p>Organizations must actively monitor and mitigate bias in their AI systems, ensuring fair treatment across different demographic groups.</p>
                
                <h3>Human Oversight</h3>
                <p>High-risk AI systems must maintain meaningful human oversight, with humans able to intervene in automated decision-making processes.</p>
                
                <h2>Practical Steps for Compliance</h2>
                <ol>
                    <li><strong>Conduct AI Risk Assessments:</strong> Evaluate your AI systems against regulatory frameworks</li>
                    <li><strong>Implement Governance Frameworks:</strong> Establish clear policies and procedures for AI development and deployment</li>
                    <li><strong>Maintain Documentation:</strong> Keep detailed records of AI system development, testing, and performance</li>
                    <li><strong>Regular Auditing:</strong> Implement ongoing monitoring and auditing processes</li>
                    <li><strong>Staff Training:</strong> Ensure your team understands regulatory requirements and compliance procedures</li>
                </ol>
                
                <h2>Looking Ahead</h2>
                <p>The regulatory landscape will continue to evolve rapidly. Businesses should stay informed about developments in their jurisdictions and consider working with legal experts specializing in AI regulation.</p>
                
                <p>By taking a proactive approach to compliance, businesses can not only avoid regulatory issues but also build trust with customers and stakeholders while maintaining competitive advantages in the AI-driven economy.</p>
            `
        };
        
        return contentTemplates[category] || contentTemplates['ai-trends'];
    }

    generateRelatedPosts(category) {
        const relatedPosts = [
            {
                title: 'Machine Learning Best Practices for 2024',
                category: 'AI Trends',
                readTime: '5 min read'
            },
            {
                title: 'Building Scalable AI Infrastructure',
                category: 'Tutorial',
                readTime: '8 min read'
            },
            {
                title: 'ROI Analysis: AI Implementation Success Stories',
                category: 'Case Study',
                readTime: '6 min read'
            }
        ];
        
        return relatedPosts.map(post => `
            <div class="related-post">
                <h4>${post.title}</h4>
                <div class="related-meta">
                    <span class="related-category">${post.category}</span>
                    <span class="related-time">${post.readTime}</span>
                </div>
            </div>
        `).join('');
    }

    setupBlogModalClose(modal) {
        const closeButtons = modal.querySelectorAll('.modal-close');
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
        
        // Setup share buttons
        this.setupShareButtons(modal);
    }

    setupReadingProgress(modal) {
        const progressBar = modal.querySelector('#readingProgress');
        const content = modal.querySelector('.blog-content-text');
        
        if (!progressBar || !content) return;
        
        modal.addEventListener('scroll', () => {
            const scrollTop = modal.scrollTop;
            const scrollHeight = modal.scrollHeight - modal.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        });
    }

    setupShareButtons(modal) {
        const shareButtons = modal.querySelectorAll('.share-btn');
        const title = modal.querySelector('.blog-title').textContent;
        const url = window.location.href;
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                this.shareArticle(platform, title, url);
            });
        });
    }

    shareArticle(platform, title, url) {
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(url);
        
        let shareUrl = '';
        
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('Link copied to clipboard!', 'success');
                });
                return;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // ===== LOAD MORE FUNCTIONALITY =====
    setupLoadMore() {
        const loadMoreBtn = document.querySelector('#loadMoreBtn');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', () => {
            this.loadMorePosts();
        });
    }

    loadMorePosts() {
        const blogContainer = document.querySelector('.blog-posts');
        const loadMoreBtn = document.querySelector('#loadMoreBtn');
        
        // Show loading state
        loadMoreBtn.innerHTML = `
            <div class="spinner"></div>
            Loading...
        `;
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // Generate new posts
            const newPosts = this.generateMorePosts(this.postsPerLoad);
            newPosts.forEach(post => {
                blogContainer.appendChild(post);
            });
            
            this.loadedPosts += this.postsPerLoad;
            
            // Reset button
            loadMoreBtn.innerHTML = `
                Load More Articles
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            `;
            loadMoreBtn.disabled = false;
            
            // Setup new posts
            this.setupBlogPosts();
            
            // Hide button if we've loaded enough posts
            if (this.loadedPosts >= 15) {
                loadMoreBtn.style.display = 'none';
            }
        }, 1500);
    }

    generateMorePosts(count) {
        const samplePosts = [
            {
                title: 'Advanced Neural Network Architectures',
                category: 'ai-trends',
                excerpt: 'Exploring the latest developments in neural network design and their practical applications in business.',
                author: 'Dr. Alex Thompson',
                date: 'December 20, 2023',
                readTime: '7 min read',
                image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
            },
            {
                title: 'Implementing AI Ethics in Practice',
                category: 'industry-news',
                excerpt: 'A comprehensive guide to building ethical AI systems that respect privacy and promote fairness.',
                author: 'Sarah Chen',
                date: 'December 18, 2023',
                readTime: '9 min read',
                image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
            },
            {
                title: 'Real-time Data Processing with AI',
                category: 'tutorials',
                excerpt: 'Learn how to build systems that can process and analyze data streams in real-time using modern AI techniques.',
                author: 'Marcus Rodriguez',
                date: 'December 15, 2023',
                readTime: '11 min read',
                image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
            }
        ];
        
        const posts = [];
        for (let i = 0; i < count && i < samplePosts.length; i++) {
            const data = samplePosts[i];
            const post = document.createElement('article');
            post.className = 'blog-post';
            post.dataset.category = data.category;
            post.innerHTML = `
                <div class="post-image">
                    <img src="${data.image}" alt="${data.title}">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-category">${data.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span class="post-date">${data.date}</span>
                    </div>
                    <h3 class="post-title">${data.title}</h3>
                    <p class="post-excerpt">${data.excerpt}</p>
                    <div class="post-footer">
                        <div class="post-author">
                            <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" alt="${data.author}">
                            <span>${data.author}</span>
                        </div>
                        <span class="post-read-time">${data.readTime}</span>
                    </div>
                </div>
            `;
            posts.push(post);
        }
        
        return posts;
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.querySelector('#loadMoreBtn');
        const visiblePosts = document.querySelectorAll('.blog-post[style*="block"], .blog-post:not([style*="none"])').length;
        
        if (loadMoreBtn) {
            loadMoreBtn.style.display = visiblePosts >= this.loadedPosts ? 'none' : 'block';
        }
    }

    // ===== NEWSLETTER FORM =====
    setupNewsletterForm() {
        const newsletterForm = document.querySelector('#newsletterForm');
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (this.isValidEmail(email)) {
                this.subscribeToNewsletter(email);
                emailInput.value = '';
            } else {
                this.showNotification('Please enter a valid email address', 'error');
            }
        });
    }

    subscribeToNewsletter(email) {
        // Simulate API call
        this.showNotification('Subscribing...', 'info');
        
        setTimeout(() => {
            this.showNotification('Successfully subscribed to our newsletter!', 'success');
        }, 1500);
    }

    // ===== SEARCH FUNCTIONALITY =====
    setupSearch() {
        const searchInput = document.querySelector('#blogSearch');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchBlogPosts(e.target.value);
            }, 300);
        });
    }

    searchBlogPosts(query) {
        const blogPosts = document.querySelectorAll('.blog-post');
        const searchQuery = query.toLowerCase().trim();
        
        if (!searchQuery) {
            // Show all posts if search is empty
            blogPosts.forEach(post => {
                post.style.display = 'block';
            });
            return;
        }
        
        blogPosts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
            const category = post.querySelector('.post-category').textContent.toLowerCase();
            
            const matches = title.includes(searchQuery) || 
                          excerpt.includes(searchQuery) || 
                          category.includes(searchQuery);
            
            post.style.display = matches ? 'block' : 'none';
        });
    }

    // ===== UTILITY FUNCTIONS =====
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#6366f1'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ===== INITIALIZATION FROM URL =====
    initFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category && category !== 'all') {
            const categoryTab = document.querySelector(`[data-category="${category}"]`);
            if (categoryTab) {
                document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
                categoryTab.classList.add('active');
                this.filterBlogPosts(category);
            }
        }
    }
}

// Add blog modal styles
const blogModalStyles = `
    .blog-modal {
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
    
    .blog-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .blog-modal .modal-content {
        max-width: 900px;
        max-height: 95vh;
        overflow-y: auto;
    }
    
    .blog-header {
        padding: 2rem;
        border-bottom: 1px solid var(--border);
    }
    
    .blog-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: var(--radius-lg);
        margin-bottom: 1.5rem;
    }
    
    .blog-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
    }
    
    .blog-category {
        color: var(--brand-primary);
        font-weight: var(--font-weight-medium);
    }
    
    .blog-title {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin-bottom: 1rem;
        line-height: var(--line-height-tight);
    }
    
    .blog-author-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .author-name {
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
    }
    
    .author-title {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
    }
    
    .blog-body {
        padding: 2rem;
    }
    
    .reading-progress {
        position: sticky;
        top: 0;
        background: var(--surface-elevated);
        padding: 1rem 0;
        margin-bottom: 2rem;
        z-index: 10;
    }
    
    .blog-content-text {
        line-height: var(--line-height-relaxed);
        color: var(--text-primary);
    }
    
    .blog-content-text h2 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .blog-content-text h3 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
    }
    
    .blog-content-text blockquote {
        border-left: 4px solid var(--brand-primary);
        padding-left: 1.5rem;
        margin: 2rem 0;
        font-style: italic;
        color: var(--text-secondary);
    }
    
    .blog-content-text pre {
        background: var(--surface);
        padding: 1rem;
        border-radius: var(--radius-lg);
        overflow-x: auto;
        margin: 1.5rem 0;
    }
    
    .blog-content-text code {
        font-family: var(--font-family-mono);
        font-size: var(--font-size-sm);
    }
    
    .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
    }
    
    .result-item {
        text-align: center;
        padding: 1rem;
        background: var(--surface);
        border-radius: var(--radius-lg);
    }
    
    .result-number {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--brand-primary);
    }
    
    .result-label {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin-top: 0.5rem;
    }
    
    .blog-actions {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border);
    }
    
    .social-share h4 {
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .share-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .share-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text-secondary);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-size: var(--font-size-sm);
    }
    
    .share-btn:hover {
        background: var(--brand-primary);
        border-color: var(--brand-primary);
        color: var(--text-inverse);
    }
    
    .share-btn svg {
        width: 16px;
        height: 16px;
    }
    
    .blog-footer {
        padding: 2rem;
        border-top: 1px solid var(--border);
    }
    
    .related-posts h3 {
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }
    
    .related-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .related-post {
        padding: 1rem;
        background: var(--surface);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .related-post:hover {
        background: var(--surface-elevated);
        transform: translateY(-2px);
    }
    
    .related-post h4 {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .related-meta {
        display: flex;
        gap: 1rem;
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
    }
    
    .related-category {
        color: var(--brand-primary);
        font-weight: var(--font-weight-medium);
    }
`;

// Inject blog modal styles
const blogStyleSheet = document.createElement('style');
blogStyleSheet.textContent = blogModalStyles;
document.head.appendChild(blogStyleSheet);

// Initialize blog manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
    window.blogManager.initFromURL();
});

// Export for use in other files
window.BlogManager = BlogManager;