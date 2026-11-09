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