(() => {
    const projects = {
        'timber-shelf': {
            title: 'Build a simple display shelf',
            difficulty: 'Beginner',
            time: 'One afternoon',
            location: 'Indoor',
            materials: ['A straight, sound board sized for the space', 'Shelf brackets and fixings suited to the wall type', 'Measuring tape, pencil and level', 'Sandpaper and a chosen finish'],
            safety: 'Wear eye protection when sanding or drilling, secure the work before using tools, and check for hidden wiring or plumbing before drilling into a wall. Choose fixings rated for the wall and intended load.',
            steps: [
                ['Plan the shelf', 'Measure the available wall space and decide what the shelf will hold. Keep the design light-duty; heavy loads need a suitable design and correctly rated supports.'],
                ['Prepare the board', 'Choose a straight board without splits or loose knots. Ask the timber supplier to make any cuts if you do not have the right setup. Smooth the edges and apply a compatible finish in a ventilated space.'],
                ['Mark and mount supports', 'Use a level to mark the shelf position. Identify the wall construction and select matching anchors or fixings; get advice if you are unsure. Check the drilling area for hidden services before making holes.'],
                ['Fit and check', 'Place the board on the supports and secure it using the bracket maker’s guidance. Check that it sits level and does not shift, then add only light items at first.']
            ],
            note: 'This guide is for a small decorative shelf, not a structural or heavy-load installation.'
        },
        'paint-refresh': {
            title: 'Refresh a tired room',
            difficulty: 'Beginner',
            time: 'A weekend',
            location: 'Indoor',
            materials: ['Drop cloths and painter’s tape', 'Mild cleaner and lint-free cloths', 'Filler suitable for the surface', 'Primer and interior paint suitable for the room', 'Brush, roller and tray'],
            safety: 'Ventilate the room and follow product labels. In older buildings, do not sand or disturb paint that may contain lead; use a qualified professional to assess it.',
            steps: [
                ['Walk the room', 'List the surfaces that need attention and note stains, loose paint, damp patches or cracks. Resolve leaks and moisture problems before painting.'],
                ['Protect and prepare', 'Move or cover furniture, protect floors, remove loose dust and clean the surfaces. Let everything dry fully before applying products.'],
                ['Repair and coat', 'Use surface-appropriate filler for small cosmetic defects and allow it to cure as directed. Apply primer where the paint maker recommends, then apply paint in manageable sections.'],
                ['Finish carefully', 'Respect the stated drying and recoat times. Remove tape while the final coat is ready according to its instructions, clean tools safely and return furniture only after the finish has cured.']
            ],
            note: 'If you find significant mould, persistent damp, damaged plaster or unknown coatings, pause and arrange an appropriate inspection.'
        },
        'tool-station': {
            title: 'Set up a small project station',
            difficulty: 'Beginner',
            time: 'One to two hours',
            location: 'Indoor',
            materials: ['A stable table or bench', 'Bright task lighting', 'Storage trays or labelled boxes', 'Eye protection and suitable dust mask', 'A clear, dry area with safe access'],
            safety: 'Keep the workspace dry, well lit and uncluttered. Store sharp tools with guards or covers in place, keep chemicals in their original labelled containers and keep them away from children.',
            steps: [
                ['Choose a safe spot', 'Pick a level area with enough room to move around the work. Keep exits clear and make sure the surface can support the work you plan to do.'],
                ['Group the essentials', 'Sort hand tools, measuring items, fasteners and protective equipment into separate labelled spaces. Keep frequently used basics easy to reach.'],
                ['Set a clean workflow', 'Make one area for measuring and assembly, and a separate place for sanding or messy tasks. Use task lighting and plan how dust and offcuts will be contained.'],
                ['Inspect and reset', 'Before each project, check tools for visible damage and follow their manuals. Put tools away clean and dry, and remove waste so the next task starts safely.']
            ],
            note: 'Add power tools only when you have read their manuals and have a safe, suitable work area.'
        },
        'crate-planter': {
            title: 'Give a sturdy crate a second life',
            difficulty: 'Beginner',
            time: 'Two to three hours',
            location: 'Indoor or covered outdoor',
            materials: ['A clean, sturdy crate with known history', 'Fine sandpaper and a hand brush', 'Water-based finish suitable for the intended use', 'Optional fabric liner and soft floor protectors'],
            safety: 'Do not reuse a crate if its previous contents or treatment are unknown, if it smells of chemicals, or if it has rot, mould or pest damage. Avoid cutting into treated or painted material of unknown origin.',
            steps: [
                ['Inspect the item', 'Check corners, joints and base for looseness, splinters, stains or a chemical smell. Decide whether it will hold dry household items or be used outdoors.'],
                ['Clean and smooth', 'Brush away loose dirt and wipe with a suitable cleaner. Let the crate dry, then lightly smooth rough areas by hand while wearing eye protection and a dust mask.'],
                ['Stabilize and finish', 'Tighten or replace only simple, accessible loose fasteners using suitable hardware. Apply a finish compatible with the material and intended setting, following its label.'],
                ['Put it to use', 'Add floor protectors if it will sit indoors. For outdoor use, choose a sheltered spot and inspect it periodically for moisture damage and stability.']
            ],
            note: 'This project is for a light-duty storage crate, not seating, climbing, food contact or a load-bearing item.'
        },
        'electrical-check': {
            title: 'Know when to call an electrician',
            difficulty: 'Safety guide',
            time: 'Read before work',
            location: 'Home safety',
            materials: ['A phone or notebook to record symptoms and locations', 'Access to the property’s emergency contact details', 'A licensed electrician for inspection and repair'],
            safety: 'Do not open electrical panels, remove outlet or switch covers, touch exposed conductors, or attempt wiring repairs. If there is smoke, fire, sparking or immediate danger, move away and contact local emergency services. Electrical work can be lethal and may be regulated.',
            steps: [
                ['Recognize warning signs', 'Take buzzing, burning smells, scorch marks, hot outlets, repeated breaker trips, shocks or visible damage seriously. Do not keep using equipment or outlets showing warning signs.'],
                ['Keep people clear', 'Do not touch damaged equipment, exposed parts or anything wet near a suspected electrical fault. Keep children and others away from the area.'],
                ['Contact a professional', 'Arrange an inspection with a licensed electrician authorized to work in your area. Describe what happened, where it happened and whether it has happened before.'],
                ['Follow the professional’s advice', 'Do not restore or test equipment unless the electrician or emergency responders tell you it is safe. Keep notes on the inspection and any recommended follow-up.']
            ],
            note: 'This is hazard-awareness information, not an electrical repair guide. Do not attempt DIY wiring or electrical installation.'
        },
        'outdoor-bench': {
            title: 'Plan a simple outdoor bench',
            difficulty: 'Beginner planning guide',
            time: 'A weekend',
            location: 'Outdoor',
            materials: ['A level, well-drained location', 'Weather-suitable materials and exterior-rated hardware', 'Measuring tape and paper for a cut list', 'Appropriate protective equipment and finish'],
            safety: 'A bench must be stable and suitable for the people and loads it will support. Use a proven plan or seek advice for structural details; wear eye protection and secure materials before cutting or drilling.',
            steps: [
                ['Choose the location', 'Look for a level, drained spot with the shade and access you want. Consider how rain, sun and ground contact will affect the materials.'],
                ['Plan size and materials', 'Measure the space and sketch the overall shape. Choose outdoor-suitable stock and hardware, and make a cut list from a reliable plan appropriate to the intended use.'],
                ['Prepare the work', 'Set up on a stable, clear surface. Inspect materials, sort components and confirm that tools are appropriate and in good condition before assembly.'],
                ['Assemble and inspect', 'Follow the chosen plan in order, keep joints square and check stability as you go. Before use, inspect for movement, sharp edges and protruding fasteners; maintain the finish over time.']
            ],
            note: 'For a bench intended for public use, children, or heavy loads, use a professionally reviewed design and suitable materials.'
        }
    };

    const filterButtons = document.querySelectorAll('.howto-filter');
    const projectCards = document.querySelectorAll('.howto-project-card');
    const projectButtons = document.querySelectorAll('.howto-project-select');
    const emptyState = document.getElementById('howto-empty-state');
    const processHeading = document.getElementById('process-heading');
    const processMeta = document.getElementById('process-meta');
    const materialsList = document.getElementById('process-materials');
    const safetyPanel = document.getElementById('process-safety');
    const safetyCopy = document.getElementById('process-safety-copy');
    const stepsList = document.getElementById('process-steps');
    const processNote = document.getElementById('process-note');

    function makeElement(tagName, className, text) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    function renderProcess(projectId) {
        const project = projects[projectId];
        if (!project) return;

        processHeading.textContent = project.title;
        processMeta.replaceChildren(
            makeElement('span', '', project.difficulty),
            makeElement('span', '', project.time),
            makeElement('span', '', project.location)
        );
        materialsList.replaceChildren(...project.materials.map((material) => makeElement('li', '', material)));
        safetyCopy.textContent = project.safety;
        safetyPanel.classList.toggle('is-critical', projectId === 'electrical-check');
        stepsList.replaceChildren(...project.steps.map(([title, description]) => {
            const item = document.createElement('li');
            const content = document.createElement('div');
            content.append(makeElement('h3', '', title));
            content.append(makeElement('p', '', description));
            item.append(content);
            return item;
        }));
        processNote.textContent = project.note;
        document.querySelectorAll('.howto-project-select').forEach((button) => {
            const isSelected = button.dataset.projectId === projectId;
            button.setAttribute('aria-pressed', String(isSelected));
            button.closest('.howto-project-card').classList.toggle('is-selected', isSelected);
        });
    }

    function filterProjects(category) {
        let visibleCount = 0;
        projectCards.forEach((card) => {
            const isVisible = category === 'all' || card.dataset.projectCategory === category;
            card.hidden = !isVisible;
            if (isVisible) visibleCount += 1;
        });
        emptyState.hidden = visibleCount > 0;

        const selectedButton = document.querySelector('.howto-project-select[aria-pressed="true"]');
        if (selectedButton?.closest('.howto-project-card').hidden) {
            const firstVisibleButton = Array.from(projectButtons).find((button) => !button.closest('.howto-project-card').hidden);
            if (firstVisibleButton) renderProcess(firstVisibleButton.dataset.projectId);
        }
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const category = button.dataset.projectFilter;
            filterButtons.forEach((item) => {
                const isSelected = item === button;
                item.classList.toggle('is-active', isSelected);
                item.setAttribute('aria-pressed', String(isSelected));
            });
            filterProjects(category);
        });
    });

    projectButtons.forEach((button) => {
        button.addEventListener('click', () => {
            renderProcess(button.dataset.projectId);
            if (window.matchMedia('(max-width: 820px)').matches) {
                document.getElementById('process-guide').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    renderProcess('timber-shelf');
})();
