document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("ecoDropCurrentUser"));

    const isPostPage = window.location.pathname.includes("post.html");
    if (isPostPage && !currentUser) {
        alert("Please create an account or log in first to list a product.");
        window.location.href = "auth.html";
        return;
    }


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
                reader.onload = function (uploadEvent) {
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

    function createItemCard(item, showClaimBtn) {
        const card = document.createElement("div");
        card.className = "item-card";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="item-card-img">
            <span class="badge-cat">${item.category}</span>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <div class="item-location"> ${item.location}</div>
            <div class="item-contact"> ${item.phone} |  ${item.email}</div>
            ${showClaimBtn ? `<button class="claim-btn" data-id="${item.id}">Mark as Claimed</button>` : ''}
        `;

        if (showClaimBtn) {
            const btn = card.querySelector(".claim-btn");
            btn.addEventListener("click", () => {
                claimItem(item.id);
            });
        }

        return card;
    }

    function claimItem(id) {
        let items = JSON.parse(localStorage.getItem("ecoDropItems")) || [];
        let history = JSON.parse(localStorage.getItem("ecoDropHistory")) || [];

        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            const claimedItem = items.splice(index, 1)[0];
            history.unshift(claimedItem);

            localStorage.setItem("ecoDropItems", JSON.stringify(items));
            localStorage.setItem("ecoDropHistory", JSON.stringify(history));

            alert("Item marked as claimed and archived to History record!");
            renderBrowseItems();
        }
    }

    const historyGrid = document.getElementById("history-grid");
    if (historyGrid) {
        const history = JSON.parse(localStorage.getItem("ecoDropHistory")) || [];

        if (history.length === 0) {
            historyGrid.innerHTML = `<p style="grid-column: span 3; color: #666;">No claimed items in history yet.</p>`;
        } else {
            historyGrid.innerHTML = "";
            history.forEach(item => {
                const card = document.createElement("div");
                card.className = "item-card";
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="item-card-img">
                    <span class="badge-cat" style="background: #e2eee7; color: #16382b;">Claimed & Recycled</span>
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    <div class="item-location">${item.location}</div>
                    <div class="item-contact">${item.phone} |${item.email}</div>
                `;
                historyGrid.appendChild(card);
            });
        }
    }
});   