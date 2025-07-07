// Projekt-Filterfunktion für die Projekte-Seite

document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Active-Klasse setzen
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || (category && category.includes(filter))) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}); 