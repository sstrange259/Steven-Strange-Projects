const reveals = document.querySelectorAll('[data-reveal]');
const pdfTriggers = document.querySelectorAll('.pdf-trigger');
const pdfModal = document.getElementById('pdf-modal');
const pdfFrame = pdfModal ? pdfModal.querySelector('.modal-frame') : null;
const pdfOpenLink = document.getElementById('pdf-open-link');
const modalClosers = pdfModal ? pdfModal.querySelectorAll('[data-modal-close]') : [];

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  reveals.forEach((el) => el.classList.add('in-view'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach((el) => observer.observe(el));
}

const openPdfModal = (src) => {
  if (!pdfModal || !pdfFrame) return;
  const safeSrc = encodeURI(src);
  if (pdfOpenLink) {
    pdfOpenLink.href = safeSrc;
  }
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    window.open(safeSrc, '_blank', 'noopener');
    return;
  }
  pdfFrame.src = safeSrc;
  pdfModal.classList.add('is-open');
  pdfModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

const closePdfModal = () => {
  if (!pdfModal || !pdfFrame) return;
  pdfModal.classList.remove('is-open');
  pdfModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  pdfFrame.src = '';
  if (pdfOpenLink) {
    pdfOpenLink.removeAttribute('href');
  }
};

pdfTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const src = trigger.getAttribute('data-pdf');
    if (src) {
      openPdfModal(src);
    }
  });
});

modalClosers.forEach((closer) => {
  closer.addEventListener('click', closePdfModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && pdfModal && pdfModal.classList.contains('is-open')) {
    closePdfModal();
  }
});
