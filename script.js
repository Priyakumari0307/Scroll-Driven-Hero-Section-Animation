document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Parallax Layers Animation
    document.querySelectorAll('[data-parallax-layers]').forEach((triggerElement) => {
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "0% 0%",
                end: "100% 0%",
                scrub: 1 // Increased scrub slightly for smoother response
            }
        });

        const layers = [
            { layer: "1", yPercent: 70 },
            { layer: "2", yPercent: 55 },
            { layer: "3", yPercent: 40 },
            { layer: "4", yPercent: 10 }
        ];

        layers.forEach((layerObj, idx) => {
            tl.to(
                triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
                {
                    yPercent: layerObj.yPercent,
                    ease: "none"
                },
                idx === 0 ? 0 : "<"
            );
        });
    });

    // Dynamic Scroll Percentage Display
    const percentageValue = document.querySelector('.percentage-value');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

        if (percentageValue) {
            percentageValue.textContent = scrollPercentage;

            // Dynamic styling based on scroll percentage (inspired by common high-end patterns)
            const opacity = 0.2 + (scrollPercentage / 100) * 0.8;
            const blur = Math.max(0, 10 - (scrollPercentage / 10));

            percentageValue.parentElement.style.opacity = opacity;
            // Optionally add more dynamic effects here
        }
    });

    // Initial Load Animation Sequence
    const loader = document.querySelector('.loader');
    const progressBar = document.querySelector('.loader__progress-bar');
    const percentageText = document.querySelector('.loader__percentage');

    // Disable scrolling during load
    lenis.stop();

    let loadingProgress = 0;
    const loadingInterval = setInterval(() => {
        loadingProgress += Math.floor(Math.random() * 5) + 2;
        if (loadingProgress >= 100) {
            loadingProgress = 100;
            clearInterval(loadingInterval);
            startEntranceAnimation();
        }
        if (progressBar) progressBar.style.width = `${loadingProgress}%`;
        if (percentageText) percentageText.textContent = `${loadingProgress}%`;
    }, 50);

    function startEntranceAnimation() {
        const tl = gsap.timeline({
            onComplete: () => {
                lenis.start(); // Re-enable scrolling
                loader.style.display = 'none';
            }
        });

        tl.to(loader, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            delay: 0.5
        });

        // Hero Entrance
        tl.from(".parallax__layer-img", {
            scale: 1.2,
            opacity: 0,
            duration: 2,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=0.5");

        tl.from(".parallax__title", {
            y: 100,
            opacity: 0,
            duration: 2,
            ease: "expo.out"
        }, "-=1.5");
    }

    // Animate Percentage Data Boxes on Scroll
    const dataBoxes = document.querySelectorAll('.data-box');
    dataBoxes.forEach((box, index) => {
        gsap.fromTo(box,
            {
                opacity: 0,
                y: 50,
                scale: 0.9,
                filter: "blur(10px)"
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: box,
                    start: "top 85%",
                    end: "top 50%",
                    scrub: false,
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
});
