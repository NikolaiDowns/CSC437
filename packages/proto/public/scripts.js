const btn = document.getElementById('theme-toggle');
const themedImages = document.querySelectorAll('[data-light]');

btn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  btn.textContent = isDark ? 'Light mode' : 'Dark mode';
  btn.setAttribute('aria-label',
    isDark ? 'Toggle light mode' : 'Toggle dark mode'
  );

  // swap each image
  themedImages.forEach(img => {
    img.src = isDark
      ? img.dataset.dark
      : img.dataset.light;
  });
});
