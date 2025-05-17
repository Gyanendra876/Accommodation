document.addEventListener("DOMContentLoaded", function() {
        // Animated Stats
        document.querySelectorAll('.stat-animate').forEach(function(el) {
            const target = +el.getAttribute('data-target');
            let count = 0;
            const increment = Math.ceil(target / 100);
            function update() {
                count += increment;
                if (count > target) count = target;
                el.textContent = count;
                if (count < target) {
                    requestAnimationFrame(update);
                }
            }
            update();
        });

        // Enhanced Slideshow
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        let current = 0;
        let interval = null;

        function showSlide(idx) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === idx);
                dots[i].classList.toggle('active', i === idx);
            });
            current = idx;
        }
        function nextSlide() {
            showSlide((current + 1) % slides.length);
        }
        function prevSlide() {
            showSlide((current - 1 + slides.length) % slides.length);
        }
        document.getElementById('prev-slide').onclick = function() {
            prevSlide();
            resetInterval();
        };
        document.getElementById('next-slide').onclick = function() {
            nextSlide();
            resetInterval();
        };
        dots.forEach((dot, i) => {
            dot.onclick = function() {
                showSlide(i);
                resetInterval();
            };
        });
        function resetInterval() {
            clearInterval(interval);
            interval = setInterval(nextSlide, 4000);
        }
        showSlide(current);
        interval = setInterval(nextSlide, 4000);
    });