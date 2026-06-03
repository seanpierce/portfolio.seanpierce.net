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
  if (shouldEnableFromQuery() || shouldEnableFromReferrer()) {
    setReaderView(true);
  }

  if (localStorage.getItem(DARK_MODE) && !isDarkModeEnabled()) {
    toggleDarkMode();
  }
};

init();