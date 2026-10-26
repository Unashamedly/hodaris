(() => {
    const articleMain = document.getElementById('article-page-main');
    const errorSection = document.getElementById('article-load-error');
    const errorMessage = document.getElementById('article-error-message');
    const postSlug = new URLSearchParams(location.search).get('post');

    function makeElement(tagName, className, text) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    function decodeHtmlEntities(value) {
        return new DOMParser().parseFromString(value, 'text/html').documentElement.textContent;
    }

    function formatDate(date) {
        const parsedDate = new Date(`${date.replace(' ', 'T')}Z`);
        return Number.isNaN(parsedDate.getTime())
            ? date
            : parsedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' });
    }

    function sanitizeArticleHtml(html) {
        const parsedContent = new DOMParser().parseFromString(html, 'text/html');
        const allowedTags = new Set(['A', 'B', 'BLOCKQUOTE', 'BR', 'CODE', 'DEL', 'EM', 'FIGCAPTION', 'FIGURE', 'H2', 'H3', 'H4', 'HR', 'I', 'IMG', 'LI', 'OL', 'P', 'PRE', 'S', 'STRONG', 'TABLE', 'TBODY', 'TD', 'TH', 'THEAD', 'TR', 'U', 'UL']);
        const removeWithContent = new Set(['EMBED', 'FORM', 'IFRAME', 'OBJECT', 'SCRIPT', 'STYLE', 'SVG', 'VIDEO', 'AUDIO']);

        function isSafeUrl(value, tagName) {
            try {
                const protocol = new URL(value, location.href).protocol;
                const allowedProtocols = tagName === 'IMG'
                    ? ['http:', 'https:', 'file:']
                    : ['http:', 'https:', 'mailto:', 'tel:', 'file:'];
                return allowedProtocols.includes(protocol);
            } catch {
                return false;
            }
        }

        Array.from(parsedContent.body.querySelectorAll('*')).reverse().forEach((element) => {
            if (removeWithContent.has(element.tagName)) {
                element.remove();
                return;
            }
            if (!allowedTags.has(element.tagName)) {
                element.replaceWith(...element.childNodes);
                return;
            }

            Array.from(element.attributes).forEach((attribute) => {
                const allowedAttributes = element.tagName === 'A' ? ['href', 'title']
                    : element.tagName === 'IMG' ? ['src', 'alt', 'title', 'width', 'height']
                        : ['colspan', 'rowspan'];
                if (!allowedAttributes.includes(attribute.name.toLowerCase())) {
                    element.removeAttribute(attribute.name);
                }
            });

            if (element.tagName === 'A') {
                const href = element.getAttribute('href') || '';
                if (!isSafeUrl(href, element.tagName)) element.removeAttribute('href');
                element.setAttribute('target', '_blank');
                element.setAttribute('rel', 'noopener noreferrer');
            }
            if (element.tagName === 'IMG') {
                const src = element.getAttribute('src') || '';
                if (!isSafeUrl(src, element.tagName)) element.remove();
                else element.setAttribute('loading', 'lazy');
            }
        });

        return parsedContent.body.innerHTML;
    }

    function showError(message) {
        articleMain.hidden = true;
        errorMessage.textContent = message;
        errorSection.hidden = false;
    }

    function renderReaderFeedback(post) {
        const section = makeElement('section', 'reader-engagement');
        section.setAttribute('aria-labelledby', 'reader-engagement-heading');
        const sectionHeading = makeElement('h2', 'reader-engagement-title', 'Join the conversation');
        sectionHeading.id = 'reader-engagement-heading';
        section.append(sectionHeading);
        section.append(makeElement('p', 'reader-engagement-note', 'Your feedback and comments are saved in this browser only. They are not published or visible to other readers.'));

        const storageStatus = makeElement('p', 'reader-storage-status');
        storageStatus.setAttribute('role', 'status');
        let canStore = true;
        try {
            const storageTestKey = 'hodaris-storage-check';
            window.localStorage.setItem(storageTestKey, 'available');
            window.localStorage.removeItem(storageTestKey);
        } catch {
            canStore = false;
            storageStatus.textContent = 'Browser storage is unavailable, so feedback and comments cannot be saved.';
        }
        section.append(storageStatus);

        const feedback = makeElement('div', 'reader-feedback');
        feedback.append(makeElement('p', '', 'Was this article helpful?'));
        const feedbackStatus = makeElement('span', 'reader-feedback-status');
        feedbackStatus.setAttribute('role', 'status');
        const savedFeedbackKey = `hodaris-feedback-${post.slug}`;
        let savedFeedback = null;
        if (canStore) {
            try {
                savedFeedback = window.localStorage.getItem(savedFeedbackKey);
            } catch {
                canStore = false;
                storageStatus.textContent = 'Browser storage is unavailable, so feedback and comments cannot be saved.';
            }
        }

        [
            ['helpful', 'Yes, helpful'],
            ['not-helpful', 'Not quite']
        ].forEach(([value, label]) => {
            const button = makeElement('button', 'reader-feedback-button', label);
            button.type = 'button';
            button.disabled = !canStore;
            button.setAttribute('aria-pressed', String(savedFeedback === value));
            if (savedFeedback === value) button.classList.add('is-selected');
            button.addEventListener('click', () => {
                try {
                    window.localStorage.setItem(savedFeedbackKey, value);
                    feedback.querySelectorAll('.reader-feedback-button').forEach((item) => {
                        const isSelected = item === button;
                        item.classList.toggle('is-selected', isSelected);
                        item.setAttribute('aria-pressed', String(isSelected));
                    });
                    feedbackStatus.textContent = 'Thanks for sharing your feedback.';
                } catch {
                    feedbackStatus.textContent = 'Your feedback could not be saved in this browser.';
                }
            });
            feedback.append(button);
        });
        feedback.append(feedbackStatus);
        section.append(feedback);

        const comments = makeElement('div', 'reader-comments');
        const commentsHeading = makeElement('h3', '', 'Comments');
        commentsHeading.id = 'reader-comments-heading';
        comments.append(commentsHeading);
        const commentsList = makeElement('ol', 'reader-comment-list');
        comments.setAttribute('aria-labelledby', 'reader-comments-heading');
        const commentsStatus = makeElement('p', 'reader-comments-status');
        commentsStatus.setAttribute('role', 'status');
        const commentsKey = `hodaris-comments-${post.slug}`;
        let savedComments = [];

        function readComments() {
            try {
                const storedComments = window.localStorage.getItem(commentsKey);
                savedComments = storedComments ? JSON.parse(storedComments) : [];
                if (!Array.isArray(savedComments)) throw new Error('Stored comments are not a list.');
            } catch {
                savedComments = [];
                commentsStatus.textContent = 'Saved comments could not be read from this browser.';
                canStore = false;
            }
        }

        function renderComments() {
            commentsList.replaceChildren();
            savedComments.forEach((comment) => {
                if (!comment || typeof comment.name !== 'string' || typeof comment.text !== 'string') return;
                const item = makeElement('li', 'reader-comment');
                const meta = makeElement('div', 'reader-comment-meta');
                meta.append(makeElement('strong', '', comment.name));
                if (typeof comment.date === 'string') {
                    const date = new Date(comment.date);
                    if (!Number.isNaN(date.getTime())) {
                        const time = makeElement('time', '', date.toLocaleDateString());
                        time.dateTime = date.toISOString();
                        meta.append(time);
                    }
                }
                item.append(meta);
                item.append(makeElement('p', '', comment.text));
                commentsList.append(item);
            });
            if (commentsList.childElementCount === 0) {
                commentsList.append(makeElement('li', 'reader-no-comments', 'No comments yet. Start the conversation.'));
            }
        }

        readComments();
        renderComments();
        comments.append(commentsList);

        const form = makeElement('form', 'reader-comment-form');
        const nameLabel = makeElement('label', '', 'Name');
        const nameInput = makeElement('input');
        nameInput.name = 'name';
        nameInput.type = 'text';
        nameInput.required = true;
        nameInput.maxLength = 60;
        nameInput.autocomplete = 'name';
        nameInput.placeholder = 'Your name';
        nameLabel.append(nameInput);

        const commentLabel = makeElement('label', '', 'Your comment');
        const commentInput = makeElement('textarea');
        commentInput.name = 'comment';
        commentInput.required = true;
        commentInput.maxLength = 1000;
        commentInput.rows = 4;
        commentInput.placeholder = 'Share a thoughtful response...';
        commentLabel.append(commentInput);

        const submitButton = makeElement('button', 'reader-comment-submit', 'Post comment');
        submitButton.type = 'submit';
        submitButton.disabled = !canStore;
        nameInput.disabled = !canStore;
        commentInput.disabled = !canStore;
        form.append(nameLabel, commentLabel, submitButton);
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = nameInput.value.trim();
            const text = commentInput.value.trim();
            if (!name || !text) {
                commentsStatus.textContent = 'Enter your name and a comment before submitting.';
                return;
            }

            try {
                readComments();
                if (!canStore) return;
                savedComments.push({ name, text, date: new Date().toISOString() });
                window.localStorage.setItem(commentsKey, JSON.stringify(savedComments));
                renderComments();
                form.reset();
                commentsStatus.textContent = 'Your comment was saved in this browser.';
            } catch {
                commentsStatus.textContent = 'Your comment could not be saved in this browser.';
            }
        });
        comments.append(form, commentsStatus);
        section.append(comments);
        return section;
    }

    function renderMorePosts(currentPost) {
        const section = makeElement('section', 'more-posts');
        section.setAttribute('aria-labelledby', 'more-posts-heading');
        const heading = makeElement('h2', 'reader-engagement-title', 'More from the archive');
        heading.id = 'more-posts-heading';
        section.append(heading);

        const otherPosts = window.hodarisPosts
            .filter((post) => post.slug !== currentPost.slug)
            .sort((first, second) => new Date(second.date) - new Date(first.date))
            .slice(0, 3);
        if (otherPosts.length === 0) return null;

        const grid = makeElement('div', 'more-posts-grid');
        otherPosts.forEach((post) => {
            const card = makeElement('article', 'more-post-card');
            if (post.image) {
                const image = makeElement('img');
                image.src = post.image;
                image.alt = post.imageAlt || post.title;
                image.loading = 'lazy';
                card.append(image);
            }
            const category = Array.isArray(post.categories) && post.categories.length
                ? decodeHtmlEntities(post.categories[0])
                : 'Resource';
            card.append(makeElement('p', 'more-post-category', category));
            const link = makeElement('a', 'more-post-title', decodeHtmlEntities(post.title));
            link.href = `article.html?post=${encodeURIComponent(post.slug)}`;
            card.append(link);
            if (post.excerpt) card.append(makeElement('p', 'more-post-excerpt', decodeHtmlEntities(post.excerpt)));
            grid.append(card);
        });
        section.append(grid);
        return section;
    }

    function renderArticle(post) {
        const categories = Array.isArray(post.categories)
            ? post.categories.map(decodeHtmlEntities).filter(Boolean)
            : [];
        const heading = makeElement('header', 'article-page-heading');
        heading.append(makeElement('p', 'article-page-date', formatDate(post.date)));
        heading.append(makeElement('h1', 'article-page-title', decodeHtmlEntities(post.title)));
        heading.append(makeElement('p', 'article-page-author', post.author || 'Hodaris Press'));
        if (categories.length) {
            heading.append(makeElement('p', 'article-page-category', categories.join(' · ')));
        }
        articleMain.append(heading);

        const actions = makeElement('div', 'article-page-actions');
        const printButton = makeElement('button', 'article-print');
        printButton.type = 'button';
        printButton.setAttribute('aria-label', 'Print or save this article as a PDF');
        printButton.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1h8v3H4V1Zm8 8h2v5H2V9h2v3h8V9Zm2-4H2a1 1 0 0 0-1 1v4h3V7h8v3h3V6a1 1 0 0 0-1-1Zm-2 3H4v5h8V8Z"/></svg><span>PRINT / SAVE AS PDF</span>';
        printButton.addEventListener('click', () => window.print());
        actions.append(printButton);
        articleMain.append(actions);

        if (post.image) {
            const hero = makeElement('img', 'article-page-hero');
            hero.src = post.image;
            hero.alt = post.imageAlt || post.title;
            hero.loading = 'eager';
            articleMain.append(hero);
        }

        const contentGrid = makeElement('div', 'article-page-grid');
        const mainColumn = makeElement('div', 'article-page-content');
        const summary = makeElement('section', 'article-summary');
        summary.setAttribute('aria-labelledby', 'article-summary-heading');
        summary.append(makeElement('h2', '', 'Summary'));
        summary.querySelector('h2').id = 'article-summary-heading';
        summary.append(makeElement('p', '', decodeHtmlEntities(post.excerpt || 'Read the full article below.')));
        mainColumn.append(summary);

        const body = makeElement('div', 'article-body');
        body.innerHTML = sanitizeArticleHtml(post.content || '');
        mainColumn.append(body);
        mainColumn.append(renderReaderFeedback(post));
        contentGrid.append(mainColumn);

        const shareRail = makeElement('aside', 'article-share');
        shareRail.setAttribute('aria-label', 'Share this article');
        shareRail.append(makeElement('p', 'article-share-brand', 'HODARIS PRESS'));
        shareRail.append(makeElement('span', 'article-share-label', 'SHARE'));
        const shareUrl = encodeURIComponent(location.href);
        const shareTitle = encodeURIComponent(decodeHtmlEntities(post.title));
        [
            ['f', 'Facebook', `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`],
            ['X', 'X', `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`],
            ['WA', 'WhatsApp', `https://wa.me/?text=${shareTitle}%20${shareUrl}`]
        ].forEach(([icon, accessibleLabel, shareLink]) => {
            const link = makeElement('a', '', icon);
            link.href = shareLink;
            link.setAttribute('aria-label', `Share via ${accessibleLabel}`);
            link.title = accessibleLabel;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            shareRail.append(link);
        });
        contentGrid.append(shareRail);
        articleMain.append(contentGrid);
        const morePosts = renderMorePosts(post);
        if (morePosts) articleMain.append(morePosts);
        document.title = `${decodeHtmlEntities(post.title)} | Hodaris Press`;
    }

    if (!postSlug) {
        showError('No article was specified.');
        return;
    }
    if (!Array.isArray(window.hodarisPosts)) {
        showError('The article archive could not be loaded. Check that wordpress-posts.js is available.');
        return;
    }

    const post = window.hodarisPosts.find((item) => item.slug === postSlug);
    if (!post) {
        showError('This article could not be found in the resource archive.');
        return;
    }

    renderArticle(post);
})();
