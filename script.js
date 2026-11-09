    const itemForm = document.getElementById("item-form");
    if (itemForm) {
        itemForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const title = document.getElementById("item-title").value;
            const category = document.getElementById("item-cat").value;
            const phone = document.getElementById("item-phone").value;
            const email = document.getElementById("item-email").value;
            const desc = document.getElementById("item-desc").value;
            const location = document.getElementById("item-location").value;
            const imageInput = document.getElementById("item-img");

            let imageSrc = "";
        
            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(uploadEvent) {
                    saveItemAndRedirect(title, category, phone, email, desc, location, uploadEvent.target.result);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                saveItemAndRedirect(title, category, phone, email, desc, location, imageSrc);
            }
        });
    }

    function saveItemAndRedirect(title, category, phone, email, desc, location, imageSrc) {
        const newItem = {
            id: Date.now(),
            title,
            category,
            phone,
            email,
            desc,
            location,
            image: imageSrc
        };

        let items = JSON.parse(localStorage.getItem("ecoDropItems")) || [];
        items.unshift(newItem);
        localStorage.setItem("ecoDropItems", JSON.stringify(items));

        alert("Item posted successfully!");
        window.location.href = "browse.html";
    }

    const featuredGrid = document.getElementById("featured-grid");
    if (featuredGrid) {
        const items = JSON.parse(localStorage.getItem("ecoDropItems")) || [];
        const topThree = items.slice(0, 3);
        
        if (topThree.length === 0) {
            featuredGrid.innerHTML = `<p style="grid-column: span 3; color: #666;">No neighborhood drops yet. Be the first to post!</p>`;
        } else {
            featuredGrid.innerHTML = "";
            topThree.forEach(item => {
                featuredGrid.appendChild(createItemCard(item, false));
            });
        }
    }

    const itemGrid = document.getElementById("item-grid");
    const searchInput = document.getElementById("search-input");
    const filterSelect = document.getElementById("filter-select");

    if (itemGrid) {
        renderBrowseItems();

        if (searchInput) searchInput.addEventListener("input", renderBrowseItems);
        if (filterSelect) filterSelect.addEventListener("change", renderBrowseItems);
    }

    function renderBrowseItems() {
        const items = JSON.parse(localStorage.getItem("ecoDropItems")) || [];
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedCat = filterSelect ? filterSelect.value : "All";

        const filtered = items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || item.location.toLowerCase().includes(searchTerm);
            const matchesCat = (selectedCat === "All" || item.category === selectedCat);
            return matchesSearch && matchesCat;
        });

        itemGrid.innerHTML = "";
        if (filtered.length === 0) {
            itemGrid.innerHTML = `<p style="grid-column: span 3; color: #666;">No matching items found.</p>`;
            return;
        }

        filtered.forEach(item => {
            itemGrid.appendChild(createItemCard(item, true));
        });
    }