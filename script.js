document.addEventListener('DOMContentLoaded', () => {

    // Matrix Background Effect
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
    const fontSize = 16;
    let columns;
    let drops;

    // This function sets up or resets the canvas dimensions and drops
    function initializeMatrix() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    }
    
    // Initial setup
    initializeMatrix();

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00f7ff'; // Neon Blue
        ctx.font = `${fontSize}px arial`;

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 33);

    // FIX: Add a resize event listener to re-initialize the matrix on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        // Debounce the resize event to avoid performance issues
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initializeMatrix, 150);
    });

    // Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    const texts = ["B.Tech CSE (Cybersecurity)", "Full-Stack Developer", "Cybersecurity Enthusiast"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        let displayText = '';

        if (isDeleting) {
            displayText = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            displayText = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        typewriterElement.innerHTML = displayText;
        
        let typingSpeed = isDeleting ? 75 : 150;

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before new text
        }

        setTimeout(type, typingSpeed);
    }
    type();


    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        burger.classList.toggle('toggle');
    });
    
    // Close mobile nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                 navLinks.forEach(link => link.style.animation = '');
            }
        });
    });

    // Smooth Scroll & Active Nav Link
    const sections = document.querySelectorAll('main section');
    const navA = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 85) { // 85 is approx header height + a little buffer
                current = section.getAttribute('id');
            }
        });

        navA.forEach(a => {
            a.classList.remove('active');
            const href = a.getAttribute('href');
            if (href && href.substring(1) === current) {
                a.classList.add('active');
            }
        });
    });
    
    // Fade-in sections on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                           card.style.opacity = '1';
                           card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // Contact Form Validation
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if(name.trim() === '' || email.trim() === '' || message.trim() === '') {
            formStatus.textContent = "Please fill out all fields.";
            formStatus.style.color = "red";
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            formStatus.textContent = "Please enter a valid email address.";
            formStatus.style.color = "red";
            return;
        }

        // On successful validation (no backend, so we simulate success)
        formStatus.textContent = "Thank you for your message!";
        formStatus.style.color = "var(--secondary-color)";
        form.reset();

        setTimeout(() => {
            formStatus.textContent = "";
        }, 5000);
    });
});
