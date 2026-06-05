const ASCII = `
 ███████╗███████╗ █████╗ ███╗   ██╗
 ██╔════╝██╔════╝██╔══██╗████╗  ██║
 ███████╗█████╗  ███████║██╔██╗ ██║
 ╚════██║██╔══╝  ██╔══██║██║╚██╗██║
 ███████║███████╗██║  ██║██║ ╚████║
 ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝

 ██████╗ ██╗███████╗██████╗  ██████╗███████╗
 ██╔══██╗██║██╔════╝██╔══██╗██╔════╝██╔════╝
 ██████╔╝██║█████╗  ██████╔╝██║     █████╗
 ██╔═══╝ ██║██╔══╝  ██╔══██╗██║     ██╔══╝
 ██║     ██║███████╗██║  ██║╚██████╗███████╗
 ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝

 ███████╗██╗   ██╗███╗   ███╗██╗     ███████╗██████╗
 ██╔════╝██║   ██║████╗ ████║██║     ██╔════╝██╔══██╗
 ███████╗██║   ██║██╔████╔██║██║     █████╗  ██████╔╝
 ╚════██║██║   ██║██║╚██╔╝██║██║     ██╔══╝  ██╔══██╗
 ███████║╚██████╔╝██║ ╚═╝ ██║███████╗███████╗██║  ██║
 ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
`;

console.log(
  '%c%s\n\n%c%s\n\n%c%s\n%c%s\n%c%s',
  'font-family:monospace;color:blue;',
  ASCII,
  'font-size:32px;font-weight:bold;color:blue;',
  'Hey there, comrade!',
  'font-size:16px;color:blue;',
  'If you have any questions about my portfolio, my work, or just want to chat, feel free to reach out!',
  'font-size:16px;color:blue;',
  '--> sumler.sean@gmail.com',
  'font-size:16px;color:blue;',
  '--> github.com/seanpierce'
);

// --------------------
// Navigation helper
// --------------------
const goTo = (link) => window.open(link, '_blank');

// --------------------
// Reader View State
// --------------------
const READER_CLASS = 'reader-view';
const ALT_CLASS = 'reader-img-alt-caption';
const PARAM = 'readerview';
const DARK_MODE = 'dark-mode';

// --------------------
// Core toggle logic
// --------------------
const isReaderViewEnabled = () =>
  document.body.classList.contains(READER_CLASS);

const isDarkModeEnabled = () =>
  document.body.classList.contains(DARK_MODE);

const setReaderView = (enabled) => {
  document.body.classList.toggle(READER_CLASS, enabled);

  if (enabled) {
    renderAltCaptions();
    setUrlParam(true);
    setRVTButtonTitle(true);
  } else {
    removeAltCaptions();
    setUrlParam(false);
    setRVTButtonTitle(false);
  }
};

const toggleDarkMode = () => {
  document.body.classList.toggle(DARK_MODE);
  if (isDarkModeEnabled()) localStorage.setItem(DARK_MODE, 'true')
  else localStorage.removeItem(DARK_MODE);
}

const toggleReaderView = () => {
  setReaderView(!isReaderViewEnabled());
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const enableReaderView = () => {
  if (!isReaderViewEnabled()) setReaderView(true);
};

// --------------------
// Alt caption handling
// --------------------
const renderAltCaptions = () => {
  document.querySelectorAll('img.show-alt-in-reader-view')
    .forEach(img => {
      const caption = document.createElement('h3');
      caption.className = ALT_CLASS;
      caption.textContent = img.alt;
      img.after(caption);
    });
};

const removeAltCaptions = () => {
  document.querySelectorAll(`.${ALT_CLASS}`)
    .forEach(el => el.remove());
};

// --------------------
// Interactive Dot Field
// --------------------
const dotField = {
  dots: [],
  mouse: {
    x: -9999,
    y: -9999
  },
  animationFrame: null
};

const drawDotCanvas = () => {
  const canvas = document.getElementById('dot-block-canvas');
  if (!canvas) return;

  const wrapper = canvas.parentElement;
  if (!wrapper) return;

  const widthPx = wrapper.clientWidth;
  const heightPx = wrapper.clientHeight;

  if (!widthPx || !heightPx) return;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = widthPx * dpr;
  canvas.height = heightPx * dpr;

  canvas.style.width = `${widthPx}px`;
  canvas.style.height = `${heightPx}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const style = getComputedStyle(canvas);
  const color = style.color || '#333';

  const gap = 18;
  const radius = 1.25;

  dotField.dots = [];

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

  const animate = () => {
    ctx.clearRect(0, 0, widthPx, heightPx);
    ctx.fillStyle = color;

    const mx = dotField.mouse.x;
    const my = dotField.mouse.y;

    for (const dot of dotField.dots) {
      const dx = dot.x - mx;
      const dy = dot.y - my;

      const distance = Math.hypot(dx, dy);

      const influenceRadius = 80;
      const maxPush = 2;

      if (distance > 0 && distance < influenceRadius) {
        const force = (1 - distance / influenceRadius) ** 2;

        const nx = dx / distance;
        const ny = dy / distance;

        dot.vx += nx * force * maxPush;
        dot.vy += ny * force * maxPush;

        // rotational component
        dot.vx += -ny * force * 0.5;
        dot.vy += nx * force * 0.5;
      }

      // Spring force back to original position
      dot.vx += (dot.ox - dot.x) * 0.02;
      dot.vy += (dot.oy - dot.y) * 0.02;

      // Friction
      dot.vx *= 0.9;
      dot.vy *= 0.9;

      dot.x += dot.vx;
      dot.y += dot.vy;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    dotField.animationFrame = requestAnimationFrame(animate);
  };

  if (dotField.animationFrame) {
    cancelAnimationFrame(dotField.animationFrame);
  }

  animate();
};

const dotResizeObserver = new ResizeObserver(() => drawDotCanvas());

const setRVTButtonTitle = (enabled) => {
  const rvtButton = document.getElementById('reader-toggle');
  enabled ?
    rvtButton.title = 'Exit Reader View' :
    rvtButton.title = 'Enable Reader View'
}

// --------------------
// URL param handling
// --------------------
const getUrl = () => new URL(window.location);

const setUrlParam = (enabled) => {
  const url = getUrl();
  enabled
    ? url.searchParams.set(PARAM, 'true')
    : url.searchParams.delete(PARAM);

  window.history.replaceState({}, '', url);
};

// --------------------
// Init logic
// --------------------
const shouldEnableFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get(PARAM)?.toLowerCase() === 'true';
};

const shouldEnableFromReferrer = () => {
  try {
    return document.referrer
      ? new URL(document.referrer).hostname.includes('linkedin.com')
      : false;
  } catch {
    return false;
  }
};

const init = () => {
  drawDotCanvas();
  window.addEventListener('resize', drawDotCanvas);

  const canvas = document.getElementById('dot-block-canvas');

  if (canvas) {
    dotResizeObserver.observe(canvas);

    if (canvas.parentElement) {
      dotResizeObserver.observe(canvas.parentElement);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();

      dotField.mouse.x = e.clientX - rect.left;
      dotField.mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      dotField.mouse.x = -9999;
      dotField.mouse.y = -9999;
    });
  }

  if (shouldEnableFromQuery() || shouldEnableFromReferrer()) {
    setReaderView(true);
  }

  if (localStorage.getItem(DARK_MODE) && !isDarkModeEnabled()) {
    toggleDarkMode();
  }
};

init();