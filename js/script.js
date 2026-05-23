document.addEventListener('DOMContentLoaded', function () {
    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const fadeUpElements = document.querySelectorAll('.fade-up-element');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(element => {
        observer.observe(element);
    });

    // --- CountUp Animation ---
    function animateCountUp(el) {
        const raw = el.dataset.target || '0';
        const target = parseFloat(raw);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2200;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            let display;
            if (!Number.isInteger(target)) {
                display = current.toFixed(1);
            } else if (target >= 1000) {
                display = Math.floor(current).toLocaleString();
            } else {
                display = Math.floor(current).toString();
            }
            el.textContent = prefix + display + suffix;

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const statEls = document.querySelectorAll('.stat-number[data-target]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCountUp(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statEls.forEach(el => statsObserver.observe(el));

    // --- Typed Text Animation ---
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = [
            'Autonomous AI Agents',
            'Multi-Modal Intelligence',
            'Enterprise LLM Platforms',
            'Agentic RAG Pipelines',
            'AI Governance Frameworks',
            'Computer Vision Systems',
            'Precision Data Labeling',
            'Responsible AI Solutions'
        ];
        let phraseIdx = 0, charIdx = 0, deleting = false;

        function typeLoop() {
            const phrase = phrases[phraseIdx];
            if (deleting) {
                typedEl.textContent = phrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typedEl.textContent = phrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let delay = deleting ? 45 : 75;
            if (!deleting && charIdx === phrase.length) {
                delay = 2200;
                deleting = true;
            } else if (deleting && charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                delay = 400;
            }
            setTimeout(typeLoop, delay);
        }
        setTimeout(typeLoop, 1200);
    }

    // --- Industry Tab Switching ---
    const tabBtns = document.querySelectorAll('.industry-tab-btn');
    const tabPanels = document.querySelectorAll('.industry-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById(btn.dataset.target);
            if (panel) panel.classList.add('active');
        });
    });

    // --- Three.js Hero Background (Particles) ---
    initThreeJS();
});

function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles setup
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // Spread particles across a wide area
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material setup
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x3b82f6, // Neon blue
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    // Create Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add some subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Slowly rotate the particle system
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Subtle movement based on mouse
        particlesMesh.position.x += (mouseX * 5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY * 5 - particlesMesh.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}