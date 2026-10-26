(() => {
    const filters = Array.from(document.querySelectorAll('[data-review-filter]'));
    const cards = Array.from(document.querySelectorAll('[data-review-category]'));
    const searchInput = document.getElementById('review-search');
    const emptyState = document.getElementById('review-empty-state');
    const resultCount = document.getElementById('review-result-count');
    let activeCategory = 'all';

    function filterReviews() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        let visibleCount = 0;

        cards.forEach((card) => {
            const matchesCategory = activeCategory === 'all' || card.dataset.reviewCategory === activeCategory;
            const searchableText = `${card.dataset.reviewSearch} ${card.textContent}`.toLocaleLowerCase();
            const matchesSearch = !query || searchableText.includes(query);
            const isVisible = matchesCategory && matchesSearch;

            card.hidden = !isVisible;
            if (isVisible) visibleCount += 1;
        });

        emptyState.hidden = visibleCount > 0;
        resultCount.textContent = query || activeCategory !== 'all'
            ? `Showing ${visibleCount} ${visibleCount === 1 ? 'review topic' : 'review topics'}`
            : 'Showing all review topics';
    }

    filters.forEach((button) => {
        button.addEventListener('click', () => {
            activeCategory = button.dataset.reviewFilter;
            filters.forEach((filter) => {
                const isSelected = filter === button;
                filter.classList.toggle('is-active', isSelected);
                filter.setAttribute('aria-pressed', String(isSelected));
            });
            filterReviews();
        });
    });

    searchInput.addEventListener('input', filterReviews);
})();
