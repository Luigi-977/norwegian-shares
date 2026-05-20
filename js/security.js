// Disable right click
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Disable inspect shortcuts
window.addEventListener('keydown', (e) => {

  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
    (e.ctrlKey && e.shiftKey && e.key === 'J') ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
  }
});
