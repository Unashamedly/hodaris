(() => {
    const menuToggle = document.getElementById('menu-toggle');
    const navigation = document.getElementById('primary-navigation');
    const searchToggle = document.getElementById('search-toggle');
    const searchPanel = document.getElementById('site-search');
    const searchClose = document.getElementById('search-close');
    const searchForm = document.getElementById('site-search-form');
    const searchInput = document.getElementById('site-search-input');
    const searchResults = document.getElementById('search-results');
    const latestTicker = document.getElementById('latest-ticker');
    const featuredPosts = document.getElementById('featured-posts');
    const hero = document.querySelector('.hero');
    const heroImages = hero ? Array.from(hero.querySelectorAll('.hero-image')) : [];
    const heroDots = hero ? Array.from(hero.querySelectorAll('.hero-dot')) : [];
    const heroStatus = document.getElementById('hero-slide-status');
    const heroPrevious = document.getElementById('hero-previous');
    const heroNext = document.getElementById('hero-next');
    const heroPause = document.getElementById('hero-pause');
    const posts = Array.isArray(window.hodarisPosts) ? window.hodarisPosts : [];

    function decodeHtmlEntities(value) {
        return new DOMParser().parseFromString(value || '', 'text/html').documentElement.textContent;
    }

    function makeElement(tagName, className, text) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    function getSortedPosts() {
        return posts.slice().sort((first, second) => {
            const firstDate = new Date(first.date).getTime();
            const secondDate = new Date(second.date).getTime();
            return (Number.isNaN(secondDate) ? 0 : secondDate) - (Number.isNaN(firstDate) ? 0 : firstDate);
        });
    }

    function formatDate(date) {
        const parsedDate = new Date(`${date.replace(' ', 'T')}Z`);
        return Number.isNaN(parsedDate.getTime())
            ? date
            : parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    }

    function postUrl(post) {
        return `article.html?post=${encodeURIComponent(post.slug)}`;
    }

    function closeMenu() {
        navigation.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    function openSearch() {
        searchPanel.hidden = false;
        searchToggle.setAttribute('aria-expanded', 'true');
        searchInput.focus();
    }

    function closeSearch() {
        searchPanel.hidden = true;
        searchToggle.setAttribute('aria-expanded', 'false');
        searchToggle.focus();
    }

    if (heroImages.length > 1 && heroDots.length === heroImages.length) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let activeSlide = heroImages.findIndex((image) => image.classList.contains('is-active'));
        let rotationTimer;
        let isPaused = reducedMotion.matches;

        function showSlide(index) {
            activeSlide = (index + heroImages.length) % heroImages.length;
            heroImages.forEach((image, imageIndex) => {
                const isActive = imageIndex === activeSlide;
                image.classList.toggle('is-active', isActive);
                image.setAttribute('aria-hidden', String(!isActive));
            });
            heroDots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === activeSlide;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-pressed', String(isActive));
            });
            const activeImage = heroImages[activeSlide];
            if (heroStatus) heroStatus.textContent = `Image ${activeSlide + 1} of ${heroImages.length}: ${activeImage.alt}`;
        }

        function stopRotation() {
            window.clearInterval(rotationTimer);
            rotationTimer = undefined;
        }

        function startRotation() {
            stopRotation();
            if (!isPaused) {
                rotationTimer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
            }
        }

        function setPaused(paused) {
            isPaused = paused;
            if (heroPause) {
                heroPause.textContent = paused ? 'Play' : 'Pause';
                heroPause.setAttribute('aria-label', `${paused ? 'Start' : 'Pause'} automatic slide rotation`);
                heroPause.setAttribute('aria-pressed', String(paused));
            }
            startRotation();
        }

        heroPrevious.addEventListener('click', () => {
            showSlide(activeSlide - 1);
            startRotation();
        });
        heroNext.addEventListener('click', () => {
            showSlide(activeSlide + 1);
            startRotation();
        });
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startRotation();
            });
        });
        heroPause.addEventListener('click', () => setPaused(!isPaused));
        hero.addEventListener('mouseenter', stopRotation);
        hero.addEventListener('mouseleave', startRotation);
        hero.addEventListener('focusin', stopRotation);
        hero.addEventListener('focusout', (event) => {
            if (!hero.contains(event.relatedTarget)) startRotation();
        });
        reducedMotion.addEventListener('change', (event) => setPaused(event.matches));

        showSlide(activeSlide < 0 ? 0 : activeSlide);
        startRotation();
    }

    function renderLatestTicker(sortedPosts) {
        if (!latestTicker || sortedPosts.length === 0) return;
        const tickerLinks = sortedPosts.slice(0, 8).map((post) => {
            const link = makeElement('a', '', decodeHtmlEntities(post.title));
            link.href = postUrl(post);
            return link;
        });
        const repeatedLinks = tickerLinks.map((link) => {
            const duplicate = link.cloneNode(true);
            duplicate.setAttribute('aria-hidden', 'true');
            duplicate.tabIndex = -1;
            return duplicate;
        });
        latestTicker.replaceChildren(...tickerLinks, ...repeatedLinks);
    }

    function renderFeaturedPosts(sortedPosts) {
        if (!featuredPosts || sortedPosts.length === 0) return;
        const fallbackImages = ['blue.jpg', 'birds.jpg', 'leaf.jpg'];
        const cards = sortedPosts.slice(0, 3).map((post, index) => {
            const card = makeElement('article', 'featured-card');
            const imageLink = makeElement('a', 'featured-image-link');
            imageLink.href = postUrl(post);
            if (post.image) {
                const image = makeElement('img');
                image.src = post.image;
                image.alt = post.imageAlt || decodeHtmlEntities(post.title);
                image.loading = 'lazy';
                image.addEventListener('error', () => {
                    image.src = fallbackImages[index];
                    image.alt = `Illustration for ${decodeHtmlEntities(post.title)}`;
                }, { once: true });
                imageLink.append(image);
            } else {
                const image = makeElement('img');
                image.src = fallbackImages[index];
                image.alt = `Illustration for ${decodeHtmlEntities(post.title)}`;
                image.loading = 'lazy';
                imageLink.append(image);
                imageLink.classList.add('featured-image-empty');
            }

            const copy = makeElement('div', 'featured-copy');
            const categories = Array.isArray(post.categories)
                ? post.categories.map(decodeHtmlEntities).filter(Boolean)
                : [];
            const metadata = [categories[0] || 'Hodaris Press', formatDate(post.date)].join(' · ');
            copy.append(makeElement('p', 'featured-meta', metadata));
            const titleLink = makeElement('a', 'featured-title', decodeHtmlEntities(post.title));
            titleLink.href = postUrl(post);
            copy.append(titleLink);
            if (post.excerpt) {
                copy.append(makeElement('p', 'featured-excerpt', decodeHtmlEntities(post.excerpt)));
            }
            card.append(imageLink, copy);
            return card;
        });
        featuredPosts.replaceChildren(...cards);
    }

    function renderSearchResults(query) {
        searchResults.replaceChildren();
        const normalizedQuery = query.trim().toLocaleLowerCase();
        if (!normalizedQuery) return;

        const matches = getSortedPosts().filter((post) => {
            const categories = Array.isArray(post.categories) ? post.categories.join(' ') : '';
            const searchableText = `${post.title} ${post.excerpt || ''} ${post.author || ''} ${categories}`;
            return decodeHtmlEntities(searchableText).toLocaleLowerCase().includes(normalizedQuery);
        }).slice(0, 8);

        if (matches.length === 0) {
            searchResults.append(makeElement('p', 'search-empty', 'No matching resources found. Try another search.'));
            return;
        }

        matches.forEach((post) => {
            const link = makeElement('a', 'search-result');
            link.href = postUrl(post);
            const category = Array.isArray(post.categories) && post.categories.length
                ? decodeHtmlEntities(post.categories[0])
                : 'Resource';
            link.append(makeElement('small', '', `${category} · ${formatDate(post.date)}`));
            link.append(makeElement('strong', '', decodeHtmlEntities(post.title)));
            searchResults.append(link);
        });
    }

    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });

    searchToggle.addEventListener('click', () => {
        if (searchPanel.hidden) openSearch();
        else closeSearch();
    });
    searchClose.addEventListener('click', closeSearch);
    searchPanel.addEventListener('click', (event) => {
        if (event.target === searchPanel) closeSearch();
    });
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        renderSearchResults(searchInput.value);
    });
    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !searchPanel.hidden) closeSearch();
    });

    const currentYear = document.getElementById('current-year');
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());

    if (posts.length > 0) {
        const sortedPosts = getSortedPosts();
        renderLatestTicker(sortedPosts);
        renderFeaturedPosts(sortedPosts);
    } else if (featuredPosts) {
        featuredPosts.setAttribute('aria-label', 'Featured resources');
    }
})();
