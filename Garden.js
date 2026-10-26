(() => {
    const filterButtons = document.querySelectorAll('.garden-filter');
    const gardenCards = document.querySelectorAll('.garden-card');
    const emptyState = document.getElementById('garden-empty-state');

    function filterGardenNotes(filter) {
        let visibleCount = 0;
        gardenCards.forEach((card) => {
            const isVisible = filter === 'all' || card.dataset.gardenType === filter;
            card.hidden = !isVisible;
            if (isVisible) visibleCount += 1;
        });
        emptyState.hidden = visibleCount > 0;
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedFilter = button.dataset.gardenFilter;
            filterButtons.forEach((item) => {
                const isSelected = item === button;
                item.classList.toggle('is-active', isSelected);
                item.setAttribute('aria-pressed', String(isSelected));
            });
            filterGardenNotes(selectedFilter);
        });
    });
})();
