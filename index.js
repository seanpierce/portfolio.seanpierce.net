const ascii = `
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
  ascii,
  'font-size:32px;font-weight:bold;color:blue;',
  'Hey there, comrade!',
  'font-size:16px;color:blue;',
  'If you have any questions about my portfolio, my work, or just want to chat, feel free to reach out!',
  'font-size:16px;color:blue;',
  '--> sumler.sean@gmail.com',
  'font-size:16px;color:blue;',
  '--> github.com/seanpierce'
);

const goTo = (link) => {
    window.open(link, '_blank');
};

const toggleReaderView = () => {
  const isReaderViewEnabled = document.body.classList.contains('reader-view');

  if (isReaderViewEnabled) {
    document.body.classList.remove('reader-view');
    hideImageAltInDesignView();
  } else {
    document.body.classList.add('reader-view');
    showImageAltInReaderView();
  }
};

const enableReaderView = () => {
  if (!document.body.classList.contains('reader-view')) {
    toggleReaderView();
  }
};

const showImageAltInReaderView = () => {
  document.querySelectorAll('img.show-alt-in-reader-view').forEach(img => {
    const caption = document.createElement('h3');
    caption.classList.add('reader-img-alt-caption');
    caption.textContent = img.alt;
    img.after(caption);
  });
};

const hideImageAltInDesignView = () => {
  document.querySelectorAll('h3.reader-img-alt-caption').forEach(h3 => {
    h3.remove();
  });
};

const initReaderViewFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const readerview = params.get('readerview');
  const isEnabled = readerview?.toLowerCase() === 'true' || readerview === '1';

  if (params.has('readerview') && isEnabled) {
    enableReaderView();
  }
};

initReaderViewFromQuery();