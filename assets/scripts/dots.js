/**
 * ============================================================================
 * Interactive Dot Field
 * ============================================================================
 *
 * This file renders and animates a grid of dots inside a <canvas> element.
 *
 * The dots normally sit in a fixed grid pattern, but when the user's cursor
 * moves over the canvas they are repelled away from the mouse position and
 * gently spring back into place.
 *
 * The effect is intentionally lightweight:
 * - No external libraries
 * - Uses the Canvas API
 * - Uses requestAnimationFrame for smooth animations
 * - Automatically redraws when the canvas size changes
 *
 * Each dot behaves like a tiny physics particle:
 * - It has a position (x, y)
 * - It has a "home" position (ox, oy)
 * - It has velocity (vx, vy)
 *
 * The cursor applies a repelling force.
 * A spring force pulls dots back toward their home position.
 * Friction gradually removes velocity so movement feels natural.
 */

/**
 * Shared state for the entire dot system.
 *
 * dots:
 *   Array containing every particle currently rendered.
 *
 * mouse:
 *   Current cursor position relative to the canvas.
 *   We initialize it far offscreen so no dots are affected
 *   before the user moves their mouse into the canvas.
 *
 * animationFrame:
 *   Stores the requestAnimationFrame ID so we can cancel
 *   an existing animation loop before starting a new one.
 */
const dotField = {
  dots: [],
  mouse: {
    x: -9999,
    y: -9999
  },
  animationFrame: null
};

/**
 * Creates or rebuilds the dot field.
 *
 * This function:
 * 1. Sizes the canvas to match its container.
 * 2. Generates a grid of dot objects.
 * 3. Starts the animation loop.
 *
 * It is safe to call whenever the layout changes because
 * it completely regenerates the particle grid.
 */
const drawDotCanvas = () => {
  const canvas = document.getElementById('dot-block-canvas');
  if (!canvas) return;

  const wrapper = canvas.parentElement;
  if (!wrapper) return;

  /**
   * Measure the visible size of the canvas container.
   */
  const widthPx = wrapper.clientWidth;
  const heightPx = wrapper.clientHeight;

  if (!widthPx || !heightPx) return;

  /**
   * Device Pixel Ratio (DPR)
   *
   * Modern displays often have more physical pixels than CSS pixels.
   *
   * Example:
   *   CSS width: 500px
   *   DPR: 2
   *   Actual canvas width: 1000px
   *
   * This keeps dots crisp on Retina / HiDPI displays.
   */
  const dpr = window.devicePixelRatio || 1;

  canvas.width = widthPx * dpr;
  canvas.height = heightPx * dpr;

  canvas.style.width = `${widthPx}px`;
  canvas.style.height = `${heightPx}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  /**
   * Scale the drawing context so that all coordinates can continue
   * to be written in CSS pixels rather than physical pixels.
   */
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const style = getComputedStyle(canvas);
  const color = style.color || '#333';

  /**
   * gap
   *   Distance between dots.
   *
   * radius
   *   Size of each rendered dot.
   */
  const gap = 18;
  const radius = 1.25;

  /**
   * Clear any previously generated particles.
   *
   * We rebuild the entire particle field whenever
   * the canvas dimensions change.
   */
  dotField.dots = [];

  /**
   * Generate a simple grid of particles.
   *
   * Each particle stores:
   *
   * ox, oy
   *   Original position ("home")
   *
   * x, y
   *   Current position
   *
   * vx, vy
   *   Current velocity
   */
  for (let y = gap / 2; y < heightPx; y += gap) {
    for (let x = gap / 2; x < widthPx; x += gap) {
      dotField.dots.push({
        ox: x,
        oy: y,
        x,
        y,
        vx: 0,
        vy: 0
      });
    }
  }

  /**
   * Main animation loop.
   *
   * Runs once per frame (~60fps).
   */
  const animate = () => {
    ctx.clearRect(0, 0, widthPx, heightPx);
    ctx.fillStyle = color;

    const mx = dotField.mouse.x;
    const my = dotField.mouse.y;

    for (const dot of dotField.dots) {

      /**
       * Vector from mouse -> dot.
       *
       * dx/dy represent both direction and distance.
       */
      const dx = dot.x - mx;
      const dy = dot.y - my;

      /**
       * Distance between cursor and current dot.
       */
      const distance = Math.hypot(dx, dy);

      /**
       * influenceRadius
       *   How close the cursor must be before a dot reacts.
       *
       * maxPush
       *   Maximum repulsion strength.
       */
      const influenceRadius = 80;
      const maxPush = 2;

      /**
       * Only apply forces when the cursor is near the dot.
       */
      if (distance > 0 && distance < influenceRadius) {

        /**
         * Force falls off quadratically.
         *
         * Dots near the cursor move strongly.
         * Dots near the edge barely move.
         */
        const force = (1 - distance / influenceRadius) ** 2;

        /**
         * Normalize the direction vector.
         *
         * Normalization converts the vector length to 1
         * while preserving its direction.
         */
        const nx = dx / distance;
        const ny = dy / distance;

        /**
         * Repulsion force.
         *
         * Pushes dots directly away from the cursor.
         */
        dot.vx += nx * force * maxPush;
        dot.vy += ny * force * maxPush;

        /**
         * Rotational force.
         *
         * This is purely aesthetic.
         *
         * Without it:
         *   Dots move straight away from the cursor.
         *
         * With it:
         *   Dots swirl slightly around the cursor,
         *   creating a more organic "magnetic field"
         *   appearance.
         */
        dot.vx += -ny * force * 0.5;
        dot.vy += nx * force * 0.5;
      }

      /**
       * Spring force.
       *
       * Pull the dot back toward its original position.
       *
       * Think of every particle as attached to its
       * starting location by a tiny invisible spring.
       */
      dot.vx += (dot.ox - dot.x) * 0.02;
      dot.vy += (dot.oy - dot.y) * 0.02;

      /**
       * Friction / damping.
       *
       * Prevents particles from oscillating forever.
       */
      dot.vx *= 0.9;
      dot.vy *= 0.9;

      /**
       * Apply velocity to position.
       */
      dot.x += dot.vx;
      dot.y += dot.vy;

      /**
       * Draw the particle.
       */
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    /**
     * Schedule the next frame.
     */
    dotField.animationFrame = requestAnimationFrame(animate);
  };

  /**
   * If an animation loop already exists, stop it.
   *
   * This prevents multiple loops from running after
   * a resize or redraw.
   */
  if (dotField.animationFrame) {
    cancelAnimationFrame(dotField.animationFrame);
  }

  animate();
};

/**
 * ResizeObserver watches for size changes.
 *
 * This catches situations where:
 * - The browser resizes
 * - A flex/grid layout changes
 * - Parent content changes dimensions
 *
 * When a resize occurs, we rebuild the particle grid.
 */
const dotResizeObserver = new ResizeObserver(() => drawDotCanvas());

/**
 * Initializes the dot field.
 *
 * Responsibilities:
 * - Draw the initial grid
 * - Watch for resize events
 * - Track mouse movement
 * - Update cursor position state
 */
const initDots = () => {
  drawDotCanvas();

  /**
   * Redraw when the browser window changes size.
   */
  window.addEventListener('resize', drawDotCanvas);

  const canvas = document.getElementById('dot-block-canvas');

  if (canvas) {

    /**
     * Watch both the canvas and its parent.
     *
     * Depending on layout changes, either one
     * may change size first.
     */
    dotResizeObserver.observe(canvas);

    if (canvas.parentElement) {
      dotResizeObserver.observe(canvas.parentElement);
    }

    /**
     * Track mouse position relative to the canvas.
     *
     * clientX/clientY are viewport coordinates.
     *
     * Subtracting the canvas bounds converts them
     * into local canvas coordinates.
     */
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();

      dotField.mouse.x = e.clientX - rect.left;
      dotField.mouse.y = e.clientY - rect.top;
    });

    /**
     * Move the virtual cursor far away when the
     * user leaves the canvas.
     *
     * This allows dots to smoothly return home.
     */
    canvas.addEventListener('mouseleave', () => {
      dotField.mouse.x = -9999;
      dotField.mouse.y = -9999;
    });
  }
};

/**
 * Start everything.
 */
initDots();