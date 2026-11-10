document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("ecoDropCurrentUser"));

    const isPostPage = window.location.pathname.includes("post.html");
    if (isPostPage && !currentUser) {
        alert("Please create an account or log in first to list a product.");
        window.location.href = "auth.html";
        return;
    }

    const navRight = document.querySelector(".nav-right");
    if (navRight) {
        if (currentUser) {
            navRight.innerHTML = `
                <a href="post.html" class="btn-green" style="text-decoration: none; padding: 8px 16px; font-size: 13px; white-space: nowrap;">+ Post Item</a>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                    <button id="logout-btn" class="btn-white" style="padding: 6px 12px; font-size: 12px; cursor: pointer;">Logout</button>
                    <span style="font-size: 11px; color: #1f7a4c; font-weight: 500; white-space: nowrap;">👤 ${currentUser.email}</span>
                </div>
            `;
            document.getElementById("logout-btn").addEventListener("click", () => {
                localStorage.removeItem("ecoDropCurrentUser");
                alert("Logged out successfully.");
                window.location.href = "index.html";
            });
        } else {
            navRight.innerHTML = `<a href="auth.html" class="btn-green" style="text-decoration: none; padding: 8px 16px;">+ Post Item</a>`;
        }
    }

    const authForm = document.getElementById("auth-form");
    if (authForm) {
        let isLoginMode = false;
        const authTitle = document.getElementById("auth-title");
        const authSubmitBtn = document.getElementById("auth-submit-btn");
        const toggleAuthMode = document.getElementById("toggle-auth-mode");
        const toggleText = document.getElementById("toggle-text");

        toggleAuthMode.addEventListener("click", (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            authTitle.textContent = isLoginMode ? "Login to Account" : "Sign Up to Post";
            authSubmitBtn.textContent = isLoginMode ? "Login" : "Create Account";
            toggleText.textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
            toggleAuthMode.textContent = isLoginMode ? "Sign up here" : "Login here";
        });

        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("auth-email").value;
            const pass = document.getElementById("auth-pass").value;

            let users = JSON.parse(localStorage.getItem("ecoDropUsers")) || [];

            if (isLoginMode) {
                const found = users.find(u => u.email === email && u.pass === pass);
                if (found) {
                    localStorage.setItem("ecoDropCurrentUser", JSON.stringify(found));
                    alert("Login successful!");
                    window.location.href = "post.html";
                } else {
                    alert("Invalid email or password!");
                }
            } else {
                const exists = users.find(u => u.email === email);
                if (exists) {
                    alert("Account already exists! Please login.");
                    return;
                }
                const newUser = { email, pass };
                users.push(newUser);
                localStorage.setItem("ecoDropUsers", JSON.stringify(users));
                localStorage.setItem("ecoDropCurrentUser", JSON.stringify(newUser));
                alert("Account created successfully!");
                window.location.href = "post.html";
            }
        });
    }





    const itemForm = document.getElementById("item-form");
    if (itemForm) {
        const editingId = localStorage.getItem("ecoDropEditingId");
        if (editingId) {
            document.querySelector(".form-container h2").textContent = "EDIT ITEM FORM";
            document.getElementById("add-btn").textContent = "Update Item";
            
            let items = JSON.parse(localStorage.getItem("ecoDropItems")) || [];
            const itemToEdit = items.find(i => i.id == editingId);
            if (itemToEdit) {
                document.getElementById("item-title").value = itemToEdit.title;
                document.getElementById("item-cat").value = itemToEdit.category;
                document.getElementById("item-phone").value = itemToEdit.phone;
                document.getElementById("item-email").value = itemToEdit.email;
                document.getElementById("item-desc").value = itemToEdit.desc;
                document.getElementById("item-location").value = itemToEdit.location;
            }
        }

        itemForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const title = document.getElementById("item-title").value;
            const category = document.getElementById("item-cat").value;
            const phone = document.getElementById("item-phone").value;
            const email = document.getElementById("item-email").value;
            const desc = document.getElementById("item-desc").value;
            const location = document.getElementById("item-location").value;
            const imageInput = document.getElementById("item-img");

            let defaultImg = "https://images.unsplash.com/photo-1584467735811-628b5843424d?auto=format&fit=crop&w=600&q=80";

            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(uploadEvent) {
                    saveOrUpdateItem(title, category, phone, email, desc, location, uploadEvent.target.result);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                let existingImg = defaultImg;
                const editingId = localStorage.getItem("ecoDropEditingId");
                if (editingId) {
                    let items = JSON.parse(localStorage.getItem("ecoDropItems")) || [];
                    const found = items.find(i => i.id == editingId);
                    if (found) existingImg = found.image;
                }
                saveOrUpdateItem(title, category, phone, email, desc, location, existingImg);
            }
        });
    }

    function saveOrUpdateItem(title, category, phone, email, desc, location, imageSrc) {
        let items = JSON.parse(localStorage.getItem("ecoDropItems")) || [];
        const editingId = localStorage.getItem("ecoDropEditingId");

        if (editingId) {
            items = items.map(item => {
                if (item.id == editingId) {
                    return { ...item, title, category, phone, email, desc, location, image: imageSrc };
                }
                return item;
            });
            localStorage.removeItem("ecoDropEditingId");
            alert("Item updated successfully!");
        } else {
            const newItem = {
                id: Date.now(),
                title,
                category,
                phone,
                email,
                desc,
                location,
                image: imageSrc,
                owner: currentUser ? currentUser.email : "Anonymous"
            };
            items.unshift(newItem);
            alert("Item posted successfully!");
        }

        localStorage.setItem("ecoDropItems", JSON.stringify(items));
        window.location.href = "browse.html";
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