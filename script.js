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