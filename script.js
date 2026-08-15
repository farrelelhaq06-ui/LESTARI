document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;
    let isTransitioning = false;

    const progressBar = document.querySelector('.progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Update UI Function
    const updateUI = () => {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlideIndex);
        });

        navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });

        const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;

        // Check if current slide is a light-themed slide
        const currentSlide = slides[currentSlideIndex];
        if (currentSlide) {
            const lightSlides = ['slide-arsitektur', 'slide-1', 'slide-8', 'slide-finansial', 'slide-sintesis', 'slide-bmc'];
            const isLightSlide = lightSlides.includes(currentSlide.id);
            document.body.classList.toggle('light-slide-active', isLightSlide);
        }

        // Trigger sparkles when opening the last slide (index 10)
        if (currentSlideIndex === totalSlides - 1) {
            setTimeout(() => {
                if (typeof triggerLastSlideSparkles === 'function') {
                    triggerLastSlideSparkles();
                }
            }, 650); // Delay slightly to let slide transition complete smoothly
        }
    };

    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlideIndex) return;
        
        isTransitioning = true;
        currentSlideIndex = index;
        updateUI();

        setTimeout(() => {
            isTransitioning = false;
        }, 1200); // Match CSS transition duration
    };

    const nextSlide = () => {
        if (currentSlideIndex < totalSlides - 1) {
            goToSlide(currentSlideIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
        }
    };

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    document.querySelectorAll('.next-slide').forEach(btn => {
        btn.addEventListener('click', nextSlide);
    });

    document.querySelector('.restart-btn').addEventListener('click', () => {
        goToSlide(0);
    });

    // Quick Nav Dots
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Smooth Wheel support
    window.addEventListener('wheel', (e) => {
        if (isTransitioning) return;
        if (e.deltaY > 50) nextSlide();
        else if (e.deltaY < -50) prevSlide();
    }, { passive: true });

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Follower delay
        setTimeout(() => {
            follower.style.left = e.clientX - 20 + 'px';
            follower.style.top = e.clientY - 20 + 'px';
        }, 50);
    });

    // Cursor hover effects
    const interactive = document.querySelectorAll('button, .nav-btn, .premium-card, .nav-dot, .menu-item, .stat-box, .t-content, .penetration-details, .toggle-btn, .bar, .unlock-btn, .roadmap-node, .org-unlock-btn, .org-card, .trigger-spark-btn, .spark-input');
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.transform = 'scale(2)';
            follower.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            follower.style.transform = 'scale(1)';
            follower.style.backgroundColor = 'transparent';
        });
    });

    // Comparison Slider Logic
    const compareContainer = document.querySelector('.swot-compare-container');
    const oppPanel = document.getElementById('opp-panel');
    const compareHandle = document.getElementById('compare-handle');

    if (compareContainer && oppPanel && compareHandle) {
        let isDragging = false;

        const moveSlider = (clientX) => {
            const rect = compareContainer.getBoundingClientRect();
            let x = clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            const percentage = (x / rect.width) * 100;
            oppPanel.style.width = `${percentage}%`;
            compareHandle.style.left = `${percentage}%`;
        };

        const startDrag = (e) => {
            isDragging = true;
            document.body.style.userSelect = 'none';
        };

        const stopDrag = () => {
            isDragging = false;
            document.body.style.userSelect = '';
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            moveSlider(clientX);
        };

        compareHandle.addEventListener('mousedown', startDrag);
        compareHandle.addEventListener('touchstart', startDrag, {passive: true});

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('touchmove', onDrag, {passive: true});

        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
        
        // Resize observer to maintain inner card width exactly same as container width
        const compareCards = document.querySelectorAll('.compare-card');
        if (window.ResizeObserver) {
            new ResizeObserver(entries => {
                for (let entry of entries) {
                    const w = entry.contentRect.width;
                    compareCards.forEach(card => card.style.width = w + 'px');
                }
            }).observe(compareContainer);
        } else {
            // Fallback
            const updateWidth = () => {
                const w = compareContainer.offsetWidth;
                compareCards.forEach(card => card.style.width = w + 'px');
            };
            window.addEventListener('resize', updateWidth);
            updateWidth();
        }
    }

    // Financial slide chart toggle logic
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const bars = document.querySelectorAll('#financial-chart .bar');
    const chartContainer = document.getElementById('financial-chart');

    const detailedQuarterData = {
        pendapatan: {
            Q1: { title: 'Kuartal 1 (Q1)', health: 'Sehat', target: 'Rp 150 Juta', volume: '5,500 cup', growth: 'Base Line', pct: '25%' },
            Q2: { title: 'Kuartal 2 (Q2)', health: 'Sehat', target: 'Rp 280 Juta', volume: '10,200 cup', growth: '+86% vs Q1', pct: '46%' },
            Q3: { title: 'Kuartal 3 (Q3)', health: 'Sangat Sehat', target: 'Rp 420 Juta', volume: '15,500 cup', growth: '+50% vs Q2', pct: '70%' },
            Q4: { title: 'Kuartal 4 (Q4)', health: 'Luar Biasa', target: 'Rp 600 Juta', volume: '22,000 cup', growth: '+42% vs Q3', pct: '100%' }
        },
        laba: {
            Q1: { title: 'Kuartal 1 (Q1)', health: 'Stabil', target: 'Rp 35 Juta', volume: 'Margin 23%', growth: 'Rintisan Awal', pct: '16%' },
            Q2: { title: 'Kuartal 2 (Q2)', health: 'Sangat Baik', target: 'Rp 75 Juta', volume: 'Margin 26%', growth: '+114% vs Q1', pct: '35%' },
            Q3: { title: 'Kuartal 3 (Q3)', health: 'Kuat', target: 'Rp 130 Juta', volume: 'Margin 31%', growth: '+73% vs Q2', pct: '61%' },
            Q4: { title: 'Kuartal 4 (Q4)', health: 'Ekstraordiner', target: 'Rp 210 Juta', volume: 'Margin 35%', growth: '+61% vs Q3', pct: '100%' }
        }
    };

    const updateDetailBox = (qKey, mode) => {
        const info = detailedQuarterData[mode][qKey];
        if (!info) return;
        
        const titleEl = document.getElementById('detail-title-val');
        const healthEl = document.getElementById('detail-health-val');
        const targetEl = document.getElementById('detail-target-val');
        const volumeEl = document.getElementById('detail-volume-val');
        const growthEl = document.getElementById('detail-growth-val');
        const pctEl = document.getElementById('detail-progress-pct');
        const fillEl = document.getElementById('detail-progress-fill');
        
        if (titleEl) titleEl.textContent = info.title;
        if (healthEl) {
            healthEl.textContent = info.health;
            if (info.health === 'Luar Biasa' || info.health === 'Ekstraordiner') {
                healthEl.style.color = '#fff';
                healthEl.style.background = '#27ae60';
            } else if (info.health === 'Stabil' || info.health === 'Sehat' || info.health === 'Sangat Baik' || info.health === 'Kuat') {
                healthEl.style.color = '#2ecc71';
                healthEl.style.background = 'rgba(46, 204, 113, 0.15)';
            } else {
                healthEl.style.color = '#3498db';
                healthEl.style.background = 'rgba(52, 152, 219, 0.15)';
            }
        }
        if (targetEl) targetEl.textContent = info.target;
        if (volumeEl) volumeEl.textContent = info.volume;
        if (growthEl) growthEl.textContent = info.growth;
        if (pctEl) pctEl.textContent = info.pct;
        if (fillEl) fillEl.style.width = info.pct;
    };

    if (toggleBtns.length > 0 && bars.length > 0 && chartContainer) {
        const financialData = {
            pendapatan: [
                { h: '30%', val: 'Q1', tooltip: 'Pendapatan Q1: Rp 150 Juta', label: 'Rp 150 Jt' },
                { h: '55%', val: 'Q2', tooltip: 'Pendapatan Q2: Rp 280 Juta', label: 'Rp 280 Jt' },
                { h: '75%', val: 'Q3', tooltip: 'Pendapatan Q3: Rp 420 Juta', label: 'Rp 420 Jt' },
                { h: '100%', val: 'Q4', tooltip: 'Pendapatan Q4: Rp 600 Juta', label: 'Rp 600 Jt' }
            ],
            laba: [
                { h: '20%', val: 'Q1', tooltip: 'Laba Bersih Q1: Rp 35 Juta', label: 'Rp 35 Jt' },
                { h: '45%', val: 'Q2', tooltip: 'Laba Bersih Q2: Rp 75 Juta', label: 'Rp 75 Jt' },
                { h: '65%', val: 'Q3', tooltip: 'Laba Bersih Q3: Rp 130 Juta', label: 'Rp 130 Jt' },
                { h: '90%', val: 'Q4', tooltip: 'Laba Bersih Q4: Rp 210 Juta', label: 'Rp 210 Jt' }
            ]
        };

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const target = btn.getAttribute('data-target');
                const targetData = financialData[target];
                
                if (target === 'laba') {
                    chartContainer.classList.add('laba-active');
                } else {
                    chartContainer.classList.remove('laba-active');
                }
                
                bars.forEach((bar, idx) => {
                    const item = targetData[idx];
                    bar.style.setProperty('--h', '0%');
                    setTimeout(() => {
                        bar.style.setProperty('--h', item.h);
                        bar.setAttribute('data-val', item.val);
                        bar.setAttribute('data-tooltip', item.tooltip);
                        const valSpan = bar.querySelector('.bar-value');
                        if (valSpan) {
                            valSpan.textContent = item.label;
                        }
                        
                        // If it is the active-bar, update the details panel
                        if (bar.classList.contains('active-bar')) {
                            updateDetailBox(item.val, target);
                        }
                    }, 50);
                });
            });
        });

        // Set up bar mouse interactions
        bars.forEach(bar => {
            const triggerUpdate = () => {
                bars.forEach(b => b.classList.remove('active-bar'));
                bar.classList.add('active-bar');
                
                const qKey = bar.getAttribute('data-val');
                const activeToggleBtn = document.querySelector('.toggle-btn.active');
                const mode = activeToggleBtn ? activeToggleBtn.getAttribute('data-target') : 'pendapatan';
                updateDetailBox(qKey, mode);
            };

            bar.addEventListener('mouseenter', triggerUpdate);
            bar.addEventListener('click', triggerUpdate);
        });
    }

    // Zoom Slider functionality
    const zoomSlider = document.getElementById('chart-zoom-slider');
    const zoomValText = document.getElementById('zoom-val-text');

    if (zoomSlider && zoomValText && chartContainer) {
        zoomSlider.addEventListener('input', (e) => {
            const zoomVal = parseFloat(e.target.value).toFixed(1);
            chartContainer.style.setProperty('--zoom-scale', zoomVal);
            zoomValText.textContent = `${zoomVal}x`;
        });
    }

    // Roadmap Business Slide 9 Interaction Logic
    const progressFill = document.getElementById('roadmap-progress-fill');
    const nodes = document.querySelectorAll('.roadmap-node');
    const cards = document.querySelectorAll('.roadmap-card');
    const unlockBtns = document.querySelectorAll('.unlock-btn');

    // Particle effect emitter
    const createParticles = (x, y) => {
        const emojis = ['🌿', '🍃', '☕', '🫘'];
        for (let i = 0; i < 15; i++) {
            const p = document.createElement('div');
            p.className = 'roadmap-particle';
            p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 40 + Math.random() * 80;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            
            p.style.setProperty('--dx', `${dx}px`);
            p.style.setProperty('--dy', `${dy}px`);
            
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    };

    const unlockPhase = (phaseNum, x, y) => {
        // Update progress line fill width
        // 4 nodes: Phase 1 (0%), Phase 2 (33.3%), Phase 3 (66.6%), Phase 4 (100%)
        const percentage = ((phaseNum - 1) / 3) * 100;
        if (progressFill) progressFill.style.width = `${percentage}%`;

        // Update active nodes
        nodes.forEach(node => {
            const nodePhase = parseInt(node.getAttribute('data-phase'));
            if (nodePhase <= phaseNum) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        // Update active cards
        cards.forEach(card => {
            const cardPhase = parseInt(card.getAttribute('data-phase'));
            if (cardPhase <= phaseNum) {
                card.classList.remove('locked');
                card.classList.add('active');
                
                // Update status indicator text
                const statusIndicator = card.querySelector('.card-status-indicator');
                if (statusIndicator) {
                    statusIndicator.textContent = '✅ Aktif';
                }
            } else {
                card.classList.add('locked');
                card.classList.remove('active');
                const statusIndicator = card.querySelector('.card-status-indicator');
                if (statusIndicator) {
                    statusIndicator.textContent = '⏳ Belum Mulai';
                }
            }
        });

        // Spawn particles
        if (x && y) {
            createParticles(x, y);
        }
    };

    // Unlock button event listeners
    unlockBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const phase = parseInt(btn.getAttribute('data-phase'));
            unlockPhase(phase, e.clientX, e.clientY);
        });
    });

    // Node event listeners
    nodes.forEach(node => {
        node.addEventListener('click', (e) => {
            const phase = parseInt(node.getAttribute('data-phase'));
            const circle = node.querySelector('.node-circle');
            let cx = e.clientX;
            let cy = e.clientY;
            
            if (circle) {
                const rect = circle.getBoundingClientRect();
                cx = rect.left + rect.width / 2;
                cy = rect.top + rect.height / 2;
            }
            unlockPhase(phase, cx, cy);
        });
    });

    // Slide 10: Struktur Organisasi Interactive Redesign Logic
    // ============================================
    const orgCards = document.querySelectorAll('.org-v2-card');
    const orgDetailContents = document.querySelectorAll('.org-detail-content');

    // Glowing particle explosion effect helper
    const createOrgGlowParticles = (x, y) => {
        const colors = ['#D4AF37', '#FFD700', '#FFA500', '#FFEC8B', '#2ecc71', '#fff'];
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'glow-particle';
            const size = 3 + Math.random() * 6;
            p.style.width = size + 'px';
            p.style.height = size + 'px';

            const color = colors[Math.floor(Math.random() * colors.length)];
            p.style.setProperty('--particle-color', color);
            p.style.background = color;

            p.style.left = x + 'px';
            p.style.top = y + 'px';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 40 + Math.random() * 80;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            p.style.setProperty('--dx', `${dx}px`);
            p.style.setProperty('--dy', `${dy}px`);

            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1300);
        }
    };

    if (orgCards && orgCards.length > 0) {
        orgCards.forEach(card => {
            card.addEventListener('click', () => {
                const targetRole = card.getAttribute('data-org-role');

                // Toggle active class on cards
                orgCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Toggle active class on detail panels
                orgDetailContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `org-detail-${targetRole}`) {
                        content.classList.add('active');
                    }
                });

                // Trigger small glow burst effect at card location
                const rect = card.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                createOrgGlowParticles(x, y);
            });
        });
    }

    // ============================================
    // Slide 11: Closing Slide Sparkle Explosion & Slider Logic
    // ============================================
    const sparkInput = document.querySelector('.spark-input');
    const sparkValText = document.querySelector('.spark-val-text');
    const triggerSparkBtn = document.querySelector('.trigger-spark-btn');

    // Sparkle Particle Explosion Emitter
    const createSparkExplosion = (x, y, count) => {
        const colors = ['#D4AF37', '#FFA500', '#2ecc71', '#58d68d', '#ffffff', '#ffec8b', '#27ae60'];
        
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'spark-particle';
            
            const size = 3 + Math.random() * 7;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            p.style.setProperty('--spark-color', color);
            p.style.background = color;
            
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 250;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity - (20 + Math.random() * 50); // slight upward lift
            
            p.style.setProperty('--dx', `${dx}px`);
            p.style.setProperty('--dy', `${dy}px`);
            
            const duration = 0.8 + Math.random() * 0.8;
            p.style.setProperty('--duration', `${duration}s`);
            
            document.body.appendChild(p);
            setTimeout(() => p.remove(), duration * 1000);
        }

        // Concentric ring burst
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: fixed; left: ${x}px; top: ${y}px;
            width: 8px; height: 8px;
            border: 2px solid rgba(46, 204, 113, 0.7);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10004;
            transform: translate(-50%, -50%) scale(1);
            animation: sparkRing 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        `;
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 800);
    };

    let closingSparkTimeout = null;
    const triggerLastSlideSparkles = () => {
        if (closingSparkTimeout) clearTimeout(closingSparkTimeout);
        
        const count = sparkInput ? parseInt(sparkInput.value) : 80;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Sequence of bursts: center, then left, then right
        createSparkExplosion(width / 2, height * 0.45, count);
        
        closingSparkTimeout = setTimeout(() => {
            createSparkExplosion(width * 0.3, height * 0.35, Math.floor(count * 0.6));
        }, 350);

        setTimeout(() => {
            createSparkExplosion(width * 0.7, height * 0.35, Math.floor(count * 0.6));
        }, 700);
    };

    // Range slider event listener
    if (sparkInput && sparkValText) {
        sparkInput.addEventListener('input', (e) => {
            const val = e.target.value;
            sparkValText.textContent = `${val} percikan`;
        });

        // Trigger a preview burst when user finishes dragging
        sparkInput.addEventListener('change', (e) => {
            const rect = sparkInput.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top - 25;
            createSparkExplosion(cx, cy, Math.floor(parseInt(e.target.value) / 3));
        });
    }

    // Manual trigger button event listener
    if (triggerSparkBtn) {
        triggerSparkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = triggerSparkBtn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const count = sparkInput ? parseInt(sparkInput.value) : 80;
            createSparkExplosion(cx, cy, count);
        });
    }

    // Evolusi Slide Card Interaction
    const evolusiCards = document.querySelectorAll('.evolusi-card');
    const slideEvolusi = document.getElementById('slide-evolusi');
    
    if (evolusiCards && evolusiCards.length > 0) {
        evolusiCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                evolusiCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
                
                // Change slide ambient color based on era
                const era = card.getAttribute('data-era');
                if (slideEvolusi) {
                    slideEvolusi.setAttribute('data-active-era', era);
                }
            });
        });
    }

    // Helper function for Arsitektur Slide particles
    const createProductParticles = (card) => {
        const product = card.getAttribute('data-product');
        const visual = card.querySelector('.product-bottle-visual');
        if (!visual) return;

        let particles = ['🌿', '🍃', '🌱'];
        if (product === 'modern') {
            particles = ['✨', '🍃', '🌟', '✨'];
        } else if (product === 'coffee') {
            particles = ['☕', '🫘', '☕', '🫘'];
        }

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('span');
            particle.className = 'product-particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 35 + Math.random() * 45;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 25; // upward bias
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            particle.style.left = '50%';
            particle.style.top = '40%'; // Near bottle neck
            particle.style.position = 'absolute';
            particle.style.fontSize = `${14 + Math.random() * 8}px`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '30';
            
            particle.style.animation = 'productParticleExplode 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards';
            
            visual.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    };

    // Arsitektur Slide Card Interaction
    const arsitekturCards = document.querySelectorAll('.arsitektur-card');
    const slideArsitektur = document.getElementById('slide-arsitektur');
    
    if (arsitekturCards && arsitekturCards.length > 0) {
        // Trigger particle animation on initial active card
        setTimeout(() => {
            const activeCard = document.querySelector('.arsitektur-card.active');
            if (activeCard) createProductParticles(activeCard);
        }, 1500);

        arsitekturCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                arsitekturCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
                
                // Change slide active product
                const product = card.getAttribute('data-product');
                if (slideArsitektur) {
                    slideArsitektur.setAttribute('data-active-product', product);
                }

                // Trigger particle explosion
                createProductParticles(card);
            });
        });
    }

    // Slide 3 Solusi Product Items Interaction
    const solProductItems = document.querySelectorAll('.sol-product-item');
    if (solProductItems && solProductItems.length > 0) {
        solProductItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                solProductItems.forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
            });
        });
    }

    // Slide 7 (STP Slide) Persona Tabs Interaction
    const personaTabBtns = document.querySelectorAll('.persona-tab-btn');
    const personaTabContents = document.querySelectorAll('.persona-tab-content');
    const avatarWrapper = document.querySelector('.persona-avatar-wrapper');
    
    if (personaTabBtns && personaTabBtns.length > 0) {
        personaTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-persona-tab');
                
                // Toggle buttons active class
                personaTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Toggle content panels active class
                personaTabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `content-${targetTab}`) {
                        content.classList.add('active');
                    }
                });
                
                // Animate avatar to make it interactive and satisfying
                if (avatarWrapper) {
                    avatarWrapper.style.transform = 'scale(1.08)';
                    setTimeout(() => {
                        avatarWrapper.style.transform = 'scale(1)';
                    }, 300);
                }
            });
        });
    }

    // Slide 8 (Proyeksi Keuangan) Finance Tabs Interaction
    const financeTabBtns = document.querySelectorAll('.finance-tab-btn');
    const financeTabContents = document.querySelectorAll('.finance-tab-content');
    const slide8El = document.getElementById('slide-8');
    
    if (financeTabBtns && financeTabBtns.length > 0) {
        financeTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-finance-tab');
                
                // Toggle button active states
                financeTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Toggle content panels
                financeTabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `finance-content-${targetTab}`) {
                        content.classList.add('active');
                    }
                });
                
                // Sync data attribute on slide for CSS breakdown mode
                if (slide8El) {
                    slide8El.setAttribute('data-active-finance-tab', targetTab);
                }
            });
        });
    }
    // Slide Finansial: Health Tabs Interaction
    const healthTabBtns = document.querySelectorAll('.health-tab-btn');
    const healthTabContents = document.querySelectorAll('.health-tab-content');
    const healthCards = document.querySelectorAll('.health-metric-card');
    const slideFinansial = document.getElementById('slide-finansial');
    
    function activateHealthTab(targetTab) {
        // Toggle button active states
        healthTabBtns.forEach(b => b.classList.remove('active'));
        healthTabBtns.forEach(b => {
            if (b.getAttribute('data-health-tab') === targetTab) b.classList.add('active');
        });
        
        // Toggle content panels
        healthTabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `health-content-${targetTab}`) {
                content.classList.add('active');
            }
        });
        
        // Toggle card active states
        healthCards.forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('data-health-card') === targetTab) {
                card.classList.add('active');
            }
        });
        
        // Sync data attribute
        if (slideFinansial) {
            slideFinansial.setAttribute('data-active-health-tab', targetTab);
        }
    }
    
    if (healthTabBtns && healthTabBtns.length > 0) {
        healthTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                activateHealthTab(btn.getAttribute('data-health-tab'));
            });
        });
    }
    
    if (healthCards && healthCards.length > 0) {
        healthCards.forEach(card => {
            card.addEventListener('click', () => {
                activateHealthTab(card.getAttribute('data-health-card'));
            });
        });
    }

    // Slide Sintesis: Venn Diagram Interaction
    const vennCircles = document.querySelectorAll('.venn-circle, .venn-center');
    const synthesisCards = document.querySelectorAll('.synthesis-content-card');
    const slideSintesis = document.getElementById('slide-sintesis');

    if (vennCircles && vennCircles.length > 0) {
        vennCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                const targetTab = circle.getAttribute('data-synthesis-tab');

                // Toggle active class on synthesis content cards
                synthesisCards.forEach(card => {
                    card.classList.remove('active');
                    if (card.id === `synthesis-content-${targetTab}`) {
                        card.classList.add('active');
                    }
                });

                // Sync data attribute on slide
                if (slideSintesis) {
                    slideSintesis.setAttribute('data-active-synthesis', targetTab);
                }
            });
        });
    }

    // Business Model Canvas Card & Flow Interactions
    const bmcCards = document.querySelectorAll('.bmc-card');
    const bmcFlowNodes = document.querySelectorAll('.bmc-flow-node');

    const activateBmcCard = (target, clientX, clientY) => {
        // Toggle active class on cards
        bmcCards.forEach(card => {
            if (card.getAttribute('data-bmc') === target) {
                card.classList.toggle('active');
                
                // If it is active, spawn particles at click/card location
                if (card.classList.contains('active')) {
                    let px = clientX;
                    let py = clientY;
                    if (!px || !py) {
                        const rect = card.getBoundingClientRect();
                        px = rect.left + rect.width / 2;
                        py = rect.top + rect.height / 2;
                    }
                    if (typeof createOrgGlowParticles === 'function') {
                        createOrgGlowParticles(px, py);
                    }
                }
            } else {
                card.classList.remove('active');
            }
        });

        // Toggle active-flow class on bottom flow strip
        bmcFlowNodes.forEach(node => {
            if (node.getAttribute('data-flow-target') === target) {
                // If card is active, make flow node active
                const matchingCard = document.querySelector(`.bmc-card[data-bmc="${target}"]`);
                if (matchingCard && matchingCard.classList.contains('active')) {
                    node.classList.add('active-flow');
                } else {
                    node.classList.remove('active-flow');
                }
            } else {
                node.classList.remove('active-flow');
            }
        });
    };

    if (bmcCards && bmcCards.length > 0) {
        bmcCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const target = card.getAttribute('data-bmc');
                activateBmcCard(target, e.clientX, e.clientY);
            });
        });
    }

    if (bmcFlowNodes && bmcFlowNodes.length > 0) {
        bmcFlowNodes.forEach(node => {
            node.addEventListener('click', (e) => {
                const target = node.getAttribute('data-flow-target');
                activateBmcCard(target, e.clientX, e.clientY);
            });
        });
    }

    // NPV & IRR Accordion Toggle
    document.querySelectorAll('.npv-accordion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const contentId = btn.id.replace('-toggle', '-content');
            const content = document.getElementById(contentId);
            if (btn && content) {
                btn.classList.toggle('open');
                content.classList.toggle('open');
            }
        });
    });

    // Init
    updateUI();
});
