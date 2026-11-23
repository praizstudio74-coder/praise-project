/**
 * Praise Restaurant - Slider Revolution Engine
 * Luxurious cinematic hero slider with staggered animations, Ken Burns zooms,
 * floating badge physics, progress timer bar, touch swipe, and keyboard controls.
 */

class RevSlider {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.slides = this.container.querySelectorAll('.rev-slide');
    if (!this.slides.length) return;

    this.options = Object.assign({
      autoplay: true,
      duration: 6500, // 6.5s per slide
      pauseOnHover: true,
      touchSwipe: true
    }, options);

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.timer = null;
    this.progressInterval = null;
    this.progressStartTime = 0;
    this.isPaused = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    // Controls
    this.prevBtn = this.container.querySelector('.rev-prev-btn');
    this.nextBtn = this.container.querySelector('.rev-next-btn');
    this.dots = this.container.querySelectorAll('.rev-dot');
    this.progressBar = this.container.querySelector('.rev-progress-bar');

    this.init();
  }

  init() {
    this.goToSlide(0);

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.resetAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.resetAutoplay();
      });
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        this.resetAutoplay();
      });
    });

    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => this.resume());
    }

    if (this.options.touchSwipe) {
      this.container.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.container.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
      // Only navigate if hero is visible in viewport
      const rect = this.container.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        if (e.key === 'ArrowRight') {
          this.next();
          this.resetAutoplay();
        } else if (e.key === 'ArrowLeft') {
          this.prev();
          this.resetAutoplay();
        }
      }
    });

    if (this.options.autoplay) {
      this.startProgress();
    }
  }

  goToSlide(index) {
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;

    this.slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        this.triggerLayerAnimations(slide);
      } else {
        slide.classList.remove('active');
      }
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    this.currentIndex = index;
  }

  next() {
    this.goToSlide(this.currentIndex + 1);
  }

  prev() {
    this.goToSlide(this.currentIndex - 1);
  }

  triggerLayerAnimations(slide) {
    // Reset and trigger staggered CSS animations
    const animatedElements = slide.querySelectorAll('.rev-badge, .rev-headline, .rev-subheading, .rev-cta-group, .floating-hero-badge');
    animatedElements.forEach((el) => {
      el.style.animation = 'none';
      void el.offsetHeight; // trigger reflow
      el.style.animation = null;
    });
  }

  startProgress() {
    this.clearTimers();
    this.progressStartTime = Date.now();
    const duration = this.options.duration;

    this.progressInterval = setInterval(() => {
      if (this.isPaused) return;

      const elapsed = Date.now() - this.progressStartTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);

      if (this.progressBar) {
        this.progressBar.style.width = `${progressPercent}%`;
      }

      if (elapsed >= duration) {
        this.next();
        this.progressStartTime = Date.now();
        if (this.progressBar) {
          this.progressBar.style.width = '0%';
        }
      }
    }, 40);
  }

  clearTimers() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  resetAutoplay() {
    if (this.options.autoplay) {
      if (this.progressBar) {
        this.progressBar.style.width = '0%';
      }
      this.startProgress();
    }
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
      this.resetAutoplay();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.hero-slider-section')) {
    window.praiseSlider = new RevSlider('.hero-slider-section');
  }
});
