
// =========================
// SUPABASE CONNECTION
// =========================

const supabaseUrl =
    "https://xrhdbxsawcdwrvcguojy.supabase.co";

const supabaseKey =
    "sb_publishable_2Ev1ejVBz_q-tqkc76sSlA_A7fa4gc-";

const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );


// =========================
// PRODUCTS FALLBACK SYSTEM
// =========================

async function getProducts() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("products")
                .select("*");


        if (!error && data && data.length > 0) {

            console.log(
                "Products loaded from Supabase"
            );

            return data;
        }


        throw new Error(
            "Supabase unavailable"
        );

    }

    catch (error) {

        console.warn(
            "Using backup products JSON"
        );


        const response =
            await fetch(
                "products-backup.json"
            );


        const backupProducts =
            await response.json();


        return backupProducts;
    }
}

// =========================
// CONTACT FORM
// =========================

const form =
    document.getElementById(
        "contact-form"
    );

if (form) {

    const button =
        document.getElementById(
            "submit-button"
        );

    const formMessage =
        document.getElementById(
            "form-message"
        );


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =========================
            // GET VALUES
            // =========================

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            // =========================
            // VALIDATION
            // =========================

            if (name === "") {

                formMessage.textContent =
                    "Please enter your name.";

                return;
            }


            if (email === "") {

                formMessage.textContent =
                    "Please enter your email.";

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                formMessage.textContent =
                    "Please enter a valid email address.";

                return;
            }


            if (message === "") {

                formMessage.textContent =
                    "Please enter your message.";

                return;
            }


            // =========================
            // BUTTON STATE
            // =========================

            button.disabled = true;

            button.textContent =
                "Sending...";

            formMessage.textContent =
                "";


            try {

                // =========================
                // WEB3FORMS DATA
                // =========================

                const formData =
                    new FormData();


                formData.append(
                    "access_key",
                    "0f387ff5-d90f-4636-94c5-0bdcdce5c240"
                );


                formData.append(
                    "name",
                    name
                );


                formData.append(
                    "email",
                    email
                );


                formData.append(
                    "message",
                    message
                );


                formData.append(
                    "subject",
                    `New Contact Message from ${name}`
                );


                formData.append(
                    "from_name",
                    "LUNA Coffee"
                );


                // =========================
                // SEND
                // =========================

                const response =
                    await fetch(
                        "https://api.web3forms.com/submit",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Web3Forms response:",
                    result
                );


                // =========================
                // ERROR
                // =========================

                if (
                    !response.ok ||
                    !result.success
                ) {

                    console.error(
                        "Web3Forms error:",
                        result
                    );


                    formMessage.textContent =
                        result.message ||
                        "Something went wrong. Please try again.";


                    button.disabled = false;

                    button.textContent =
                        "Send Message";

                    return;
                }


                // =========================
                // SUCCESS
                // =========================

                formMessage.textContent =
                    "Your message has been sent successfully!";


                form.reset();


                button.disabled = false;

                button.textContent =
                    "Send Message";
            }


            catch (error) {

                console.error(
                    "Connection error:",
                    error
                );


                formMessage.textContent =
                    "Something went wrong. Please try again.";


                button.disabled = false;

                button.textContent =
                    "Send Message";
            }
        }
    );


    // =========================
    // CLEAR MESSAGE
    // =========================

    document
        .getElementById("name")
        .addEventListener(
            "input",
            function () {

                formMessage.textContent =
                    "";
            }
        );


    document
        .getElementById("email")
        .addEventListener(
            "input",
            function () {

                formMessage.textContent =
                    "";
            }
        );


    document
        .getElementById("message")
        .addEventListener(
            "input",
            function () {

                formMessage.textContent =
                    "";
            }
        );
}




// =========================
// PRODUCT PAGE — JSON BACKUP
// =========================

const productImage =
    document.getElementById(
        "product-image"
    );


if (productImage) {

    const productName =
        document.getElementById(
            "product-name"
        );


    const productPrice =
        document.getElementById(
            "product-price"
        );


    const productDescription =
        document.getElementById(
            "product-description"
        );


    async function loadProduct() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const id =
            params.get("id");


        if (!id) {

            console.error(
                "No product ID found."
            );

            return;
        }


        try {

            // =========================
            // LOAD FROM JSON
            // =========================

            const response =
                await fetch(
                    "products-backup.json"
                );


            if (!response.ok) {

                throw new Error(
                    "Could not load backup products."
                );
            }


            const products =
                await response.json();


            const product =
                products.find(
                    product =>
                        String(product.id) ===
                        String(id)
                );


            if (!product) {

                console.error(
                    "Product not found."
                );

                return;
            }


            console.log(
                "Selected product from JSON:",
                product
            );


            // =========================
            // DISPLAY PRODUCT
            // =========================

            productImage.src =
                product.image_url || "";


            productImage.alt =
                product.name || "";


            productName.textContent =
                product.name || "";


            productPrice.textContent =
                product.price || "";


            productDescription.textContent =
                product.description || "";

        }

        catch (error) {

            console.error(
                "Error loading product from JSON:",
                error
            );
        }
    }


    loadProduct();
}


// =========================
// MENU — JSON BACKUP
// DYNAMIC CATEGORIES
// =========================

const menuContainer =
    document.querySelector("main");


const extrasSection =
    document.querySelector(
        ".menu-message"
    );


if (
    menuContainer &&
    extrasSection
) {

    // =========================
    // CATEGORY EMOJI MAP
    // =========================

    const emojiMap = {

        coffee: "☕",

        espresso: "☕",

        tea: "🍵",

        matcha: "🍵",

        chai: "🍵",

        "hot-chocolate": "🍫",

        chocolate: "🍫",

        pastries: "🥐",

        bread: "🍞",

        croissants: "🥐",

        muffins: "🧁",

        donuts: "🍩",

        bagels: "🥯",

        cookies: "🍪",

        cakes: "🍰",

        cake: "🍰",

        desserts: "🍨",

        cheesecake: "🍰",

        brownies: "🍫",

        cupcakes: "🧁",

        waffles: "🧇",

        pancakes: "🥞",

        "cold-drinks": "🧊",

        "iced-coffee": "🧊",

        "iced-tea": "🧋",

        lemonade: "🍋",

        juice: "🧃",

        smoothies: "🥤",

        shakes: "🥤",

        milkshakes: "🥤",

        soda: "🥤",

        sandwiches: "🥪",

        sandwich: "🥪",

        breakfast: "🍳",

        brunch: "🥞",

        salads: "🥗",

        salad: "🥗",

        soups: "🍲",

        soup: "🍲",

        pasta: "🍝",

        pizza: "🍕",

        burgers: "🍔",

        burger: "🍔",

        wraps: "🌯",

        toast: "🍞",

        snacks: "🍿",

        chips: "🍟",

        fries: "🍟",

        popcorn: "🍿",

        nuts: "🥜",

        fruits: "🍓",

        fruit: "🍓",

        yogurt: "🥛",

        granola: "🥣",

        "ice-cream": "🍦",

        icecream: "🍦",

        gelato: "🍨",

        milk: "🥛",

        "milk-drinks": "🥛",

        cocktails: "🍹",

        mocktails: "🍹",

        "special-drinks": "✨",

        specials: "⭐",

        seasonal: "🌿"

    };


    // =========================
    // SCROLL ANIMATION
    // =========================

    function setupMenuScrollAnimation() {

        const animatedElements =
            document.querySelectorAll(
                ".menu-scroll-item"
            );


        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "menu-visible"
                                );


                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        animatedElements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );
    }


    // =========================
    // LOAD MENU FROM JSON
    // =========================

    async function loadMenu() {

        console.log(
            "Loading menu from JSON backup..."
        );


        try {

            // =========================
            // LOAD BOTH JSON FILES
            // =========================

            const [
                categoriesResponse,
                productsResponse
            ] =
                await Promise.all([

                    fetch(
                        "categories.json"
                    ),

                    fetch(
                        "products-backup.json"
                    )

                ]);


            if (
                !categoriesResponse.ok ||
                !productsResponse.ok
            ) {

                throw new Error(
                    "Could not load menu JSON files."
                );
            }


            const categories =
                await categoriesResponse.json();


            const products =
                await productsResponse.json();


            console.log(
                "Categories from JSON:",
                categories
            );


            console.log(
                "Products from JSON:",
                products
            );


            // =========================
            // REMOVE OLD SECTIONS
            // =========================

            const oldSections =
                menuContainer.querySelectorAll(
                    ".full-menu-section"
                );


            oldSections.forEach(
                section => {

                    section.remove();

                }
            );


            // =========================
            // CREATE CATEGORIES
            // FROM categories.json
            // =========================

            categories.forEach(
                category => {

                    const categorySlug =
                        String(
                            category.slug || ""
                        ).trim();


                    if (!categorySlug) {
                        return;
                    }


                    // =========================
                    // FIND PRODUCTS
                    // =========================

                    const categoryProducts =
                        products
                            .filter(
                                product =>
                                    product.category &&
                                    String(
                                        product.category
                                    ).trim() ===
                                    categorySlug
                            )
                            .sort(
                                (a, b) =>
                                    String(
                                        a.name || ""
                                    ).localeCompare(
                                        String(
                                            b.name || ""
                                        ),
                                        undefined,
                                        {
                                            sensitivity:
                                                "base"
                                        }
                                    )
                            );


                    // =========================
                    // CREATE SECTION
                    // =========================

                    const section =
                        document.createElement(
                            "section"
                        );


                    section.className =
                        "full-menu-section menu-scroll-item";


                    // =========================
                    // TITLE
                    // =========================

                    const title =
                        document.createElement(
                            "h2"
                        );


                    const icon =
                        emojiMap[
                            categorySlug
                        ] || "✨";


                    title.textContent =
                        `${icon} ${category.name || categorySlug}`;


                    section.appendChild(
                        title
                    );


                    // =========================
                    // PRODUCTS GRID
                    // =========================

                    const productsContainer =
                        document.createElement(
                            "div"
                        );


                    productsContainer.className =
                        "full-menu-grid";


                    productsContainer.id =
                        `${categorySlug}-products`;


                    // =========================
                    // CREATE PRODUCTS
                    // =========================

                    categoryProducts.forEach(
                        (product, index) => {

                            const link =
                                document.createElement(
                                    "a"
                                );


                            link.href =
                                `product.html?id=${product.id}`;


                            // =========================
                            // PRODUCT ANIMATION
                            // =========================

                            link.classList.add(
                                "menu-product-scroll"
                            );


                            link.style.transitionDelay =
                                `${index * 0.12}s`;


                            const article =
                                document.createElement(
                                    "article"
                                );


                            article.className =
                                "full-menu-item";


                            article.innerHTML = `

                                <div>

                                    <h3>
                                        ${product.name || ""}
                                    </h3>

                                    <p>
                                        ${product.description || ""}
                                    </p>

                                </div>

                                <span>
                                    ${product.price || ""}
                                </span>

                            `;


                            link.appendChild(
                                article
                            );


                            productsContainer.appendChild(
                                link
                            );

                        }
                    );


                    section.appendChild(
                        productsContainer
                    );


                    // =========================
                    // INSERT BEFORE EXTRAS
                    // =========================

                    menuContainer.insertBefore(
                        section,
                        extrasSection
                    );

                }
            );


            // =========================
            // START ANIMATION
            // =========================

            setupMenuScrollAnimation();


            console.log(
                "Menu loaded successfully from JSON!"
            );

        }

        catch (error) {

            console.error(
                "Error loading menu from JSON:",
                error
            );

        }
    }


    loadMenu();
}


// =========================
// DELETE PRODUCT
// =========================

const deleteProductSelect =
    document.getElementById(
        "delete-product"
    );


const deleteCategorySelect =
    document.getElementById(
        "delete-category"
    );


const deleteProductButton =
    document.getElementById(
        "delete-product-button"
    );


const status =
    document.getElementById(
        "status"
    );


if (
    deleteProductSelect &&
    deleteCategorySelect &&
    deleteProductButton
) {

    // =========================
    // LOAD DELETE PRODUCTS
    // =========================

    async function loadDeleteProducts() {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("products")
                .select("*");


        if (error) {

            console.error(
                "Error loading delete products:",
                error
            );

            return;
        }


        deleteProductSelect.innerHTML = `

            <option value="">
                Select a product
            </option>

        `;


        data.forEach(
            product => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    product.id;


                option.textContent =
                    product.name;


                deleteProductSelect
                    .appendChild(option);

            }
        );
    }


    loadDeleteProducts();


    // =========================
    // SELECT PRODUCT
    // =========================

    deleteProductSelect.addEventListener(
        "change",
        async function () {

            const id =
                this.value;


            if (!id) {

                deleteCategorySelect.value =
                    "";

                return;
            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .from("products")
                    .select("category")
                    .eq("id", id)
                    .single();


            if (error) {

                console.error(
                    error
                );

                return;
            }


            deleteCategorySelect.value =
                data.category.trim();

        }
    );


    // =========================
    // DELETE PRODUCT
    // =========================

    deleteProductButton.addEventListener(
        "click",
        async function () {

            const id =
                deleteProductSelect.value;


            if (!id) {

                status.textContent =
                    "Please select a product.";

                return;
            }


            const productName =
                deleteProductSelect
                    .selectedOptions[0]
                    .textContent;


            const confirmed =
                confirm(
                    `Are you sure you want to delete "${productName}"?`
                );


            if (!confirmed) {
                return;
            }


            status.textContent =
                "Deleting product...";


            // =========================
            // GET PRODUCT
            // =========================

            const {
                data: product,
                error: fetchError
            } =
                await supabaseClient
                    .from("products")
                    .select("*")
                    .eq("id", id)
                    .single();


            if (fetchError) {

                console.error(
                    fetchError
                );


                status.textContent =
                    "Could not find product.";

                return;
            }


            // =========================
            // DELETE DATABASE
            // =========================

            const {
                error: deleteError
            } =
                await supabaseClient
                    .from("products")
                    .delete()
                    .eq("id", id);


            if (deleteError) {

                console.error(
                    deleteError
                );


                status.textContent =
                    "Product could not be deleted.";

                return;
            }


            // =========================
            // DELETE IMAGE
            // =========================

            if (product.image_url) {

                const marker =
                    "/storage/v1/object/public/products/";


                if (
                    product.image_url
                        .includes(marker)
                ) {

                    const fileName =
                        decodeURIComponent(
                            product.image_url
                                .split(marker)[1]
                        );


                    const {
                        error: imageError
                    } =
                        await supabaseClient
                            .storage
                            .from("products")
                            .remove([
                                fileName
                            ]);


                    if (imageError) {

                        console.warn(
                            "Product deleted, but image could not be removed:",
                            imageError
                        );

                    }
                }
            }


            // =========================
            // REFRESH
            // =========================

            await loadDeleteProducts();


            deleteProductSelect.value =
                "";


            deleteCategorySelect.value =
                "";


            status.textContent =
                "Product deleted successfully!";

        }
    );
}


// =========================
// STAFF LOGIN
// =========================

const loginForm =
    document.getElementById(
        "login-form"
    );


if (loginForm) {

    const loginMessage =
        document.getElementById(
            "login-message"
        );


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            loginMessage.textContent =
                "Signing in...";


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({

                        email: email,

                        password: password

                    });


            if (error) {

                console.error(
                    "Login error:",
                    error
                );


                loginMessage.textContent =
                    "Invalid email or password.";

                return;
            }


            console.log(
                "Login successful:",
                data
            );


            loginMessage.textContent =
                "Login successful.";


            window.location.href =
                "admin.html";

        }
    );
}


// =========================
// HOME PAGE — MENU PREVIEW
// JSON BACKUP
// =========================

const menuPreviewGrid =
    document.querySelector(
        ".menu-preview .menu-grid"
    );


if (menuPreviewGrid) {

    async function loadMenuPreview() {

        console.log(
            "Loading menu preview from JSON..."
        );


        try {

            // =========================
            // LOAD BOTH JSON FILES
            // =========================

            const [
                previewResponse,
                productsResponse
            ] =
                await Promise.all([

                    fetch(
                        "menu-preview.json"
                    ),

                    fetch(
                        "products-backup.json"
                    )

                ]);


            if (
                !previewResponse.ok ||
                !productsResponse.ok
            ) {

                throw new Error(
                    "Could not load menu preview JSON files."
                );
            }


            const previewData =
                await previewResponse.json();


            const products =
                await productsResponse.json();


            console.log(
                "Menu preview settings:",
                previewData
            );


            console.log(
                "Products for preview:",
                products
            );


            // =========================
            // SORT PREVIEW POSITIONS
            // =========================

            const selectedProducts =
                previewData
                    .filter(
                        item =>
                            item.product_id !== null &&
                            item.product_id !== undefined
                    )
                    .sort(
                        (a, b) =>
                            Number(a.position) -
                            Number(b.position)
                    );


            if (
                selectedProducts.length === 0
            ) {

                console.log(
                    "No menu preview selected. Keeping default cards."
                );

                return;
            }


            // =========================
            // MATCH PRODUCTS
            // =========================

            const orderedProducts =
                selectedProducts
                    .map(
                        preview =>

                            products.find(
                                product =>
                                    String(
                                        product.id
                                    ) ===
                                    String(
                                        preview.product_id
                                    )
                            )
                    )
                    .filter(
                        product =>
                            product
                    );


            if (
                orderedProducts.length === 0
            ) {

                console.log(
                    "No valid preview products found."
                );

                return;
            }


            // =========================
            // REPLACE MENU CARDS
            // =========================

            menuPreviewGrid.innerHTML =
                "";


            orderedProducts.forEach(
                product => {

                    const article =
                        document.createElement(
                            "article"
                        );


                    article.className =
                        "menu-card";


                    const imageUrl =
                        product.image_url
                            ? product.image_url
                            : "";


                    article.innerHTML = `

                        <div
                            class="menu-image"
                            style="
                                background-image:
                                url('${imageUrl}');
                            "
                        ></div>

                        <div
                            class="menu-card-content"
                        >

                            <h3>
                                ${product.name || ""}
                            </h3>

                            <p>
                                ${product.description || ""}
                            </p>

                            <span>
                                ${product.price || ""}
                            </span>

                        </div>

                    `;


                    article.style.cursor =
                        "pointer";


                    article.addEventListener(
                        "click",
                        function () {

                            window.location.href =
                                `product.html?id=${product.id}`;

                        }
                    );


                    menuPreviewGrid.appendChild(
                        article
                    );

                }
            );


            console.log(
                "Menu preview loaded successfully from JSON!"
            );

        }

        catch (error) {

            console.error(
                "Error loading menu preview from JSON:",
                error
            );

        }
    }


    loadMenuPreview();
}

// =========================
// SETTINGS — JSON BACKUP
// HOME + CONTACT PAGE
// =========================

async function loadSettings() {

    try {

        // =========================
        // LOAD SETTINGS JSON
        // =========================

        const response =
            await fetch(
                "settings.json"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load settings.json"
            );

        }


        const data =
            await response.json();


        console.log(
            "Settings loaded from JSON:",
            data
        );


        // =========================
        // ADDRESS
        // CONTACT PAGE
        // =========================

        const address =
            document.getElementById(
                "contact-address"
            );


        if (address) {

            address.innerHTML =
                String(
                    data.address || ""
                ).replace(
                    /\n/g,
                    "<br>"
                );

        }


        // =========================
        // PHONE
        // CONTACT PAGE
        // =========================

        const phone =
            document.getElementById(
                "contact-phone"
            );


        if (phone) {

            phone.textContent =
                data.phone || "";

        }


        // =========================
        // EMAIL
        // CONTACT PAGE
        // =========================

        const contactEmail =
            document.getElementById(
                "contact-email"
            );


        if (contactEmail) {

            contactEmail.textContent =
                data.email || "";

        }


        // =========================
        // WEEKDAY HOURS
        // HOME + CONTACT
        // =========================

        const weekdayHours =
            document.getElementById(
                "weekday-hours"
            );


        if (weekdayHours) {

            const timeSpan =
                weekdayHours.querySelector(
                    "span:last-child"
                );


            if (timeSpan) {

                timeSpan.textContent =
                    `${data.weekday_open || ""} – ${data.weekday_close || ""}`;

            }

        }


        // =========================
        // WEEKEND HOURS
        // HOME + CONTACT
        // =========================

        const weekendHours =
            document.getElementById(
                "weekend-hours"
            );


        if (weekendHours) {

            const timeSpan =
                weekendHours.querySelector(
                    "span:last-child"
                );


            if (timeSpan) {

                timeSpan.textContent =
                    `${data.weekend_open || ""} – ${data.weekend_close || ""}`;

            }

        }


        // =========================
        // WEBSITE
        // CONTACT PAGE
        // =========================

        const website =
            document.getElementById(
                "contact-website"
            );


        if (website) {

            website.textContent =
                data.website || "";

        }


        // =========================
        // INSTAGRAM
        // CONTACT PAGE
        // =========================

        const instagram =
            document.getElementById(
                "contact-instagram"
            );


        if (instagram) {

            const instagramUsername =
                String(
                    data.instagram || ""
                ).replace(
                    "@",
                    ""
                );


            instagram.href =
                `https://www.instagram.com/${instagramUsername}/`;


            instagram.textContent =
                data.instagram || "";

        }

    }

    catch (error) {

        console.error(
            "Error loading settings from JSON:",
            error
        );

    }

}


// =========================
// LOAD SETTINGS
// HOME + CONTACT
// =========================

if (

    document.getElementById(
        "contact-address"
    ) ||

    document.getElementById(
        "contact-phone"
    ) ||

    document.getElementById(
        "contact-email"
    ) ||

    document.getElementById(
        "weekday-hours"
    ) ||

    document.getElementById(
        "weekend-hours"
    ) ||

    document.getElementById(
        "contact-website"
    ) ||

    document.getElementById(
        "contact-instagram"
    )

) {

    loadSettings();

}


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPasswordLink =
    document.getElementById("forgot-password");

const resetSection =
    document.getElementById("reset-section");

const resetButton =
    document.getElementById("reset-button");

const resetEmail =
    document.getElementById("reset-email");

const resetMessage =
    document.getElementById("login-message");


// =====================================================
// SHOW RESET PASSWORD SECTION
// =====================================================

if (
    forgotPasswordLink &&
    resetSection &&
    resetButton &&
    resetEmail
) {

    forgotPasswordLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            resetSection.style.display = "block";

            resetEmail.value = "";

            resetEmail.focus();

            if (resetMessage) {
                resetMessage.textContent = "";
            }

        }
    );


    // =================================================
    // SEND PASSWORD RESET LINK
    // =================================================

    resetButton.addEventListener(
        "click",
        async function () {

            const email =
                resetEmail.value.trim();


            // Check email
            if (!email) {

                if (resetMessage) {
                    resetMessage.textContent =
                        "Please enter your email address.";
                }

                return;
            }


            // Disable button while sending
            resetButton.disabled = true;

            if (resetMessage) {
                resetMessage.textContent =
                    "Sending reset link...";
            }


            try {

                const { error } =
                    await supabaseClient.auth.resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                window.location.origin +
                                "/update-password.html"
                        }
                    );


                // Handle Supabase error
                if (error) {

                    console.error(
                        "Password reset error:",
                        error
                    );

                    if (resetMessage) {
                        resetMessage.textContent =
                            "Could not send reset link.";
                    }

                    resetButton.disabled = false;

                    return;
                }


                // Success message
                if (resetMessage) {
                    resetMessage.textContent =
                        "Reset link sent. Please check your email.";
                }


            } catch (error) {

                console.error(
                    "Unexpected password reset error:",
                    error
                );

                if (resetMessage) {
                    resetMessage.textContent =
                        "Something went wrong. Please try again.";
                }

            }


            // Enable button again
            resetButton.disabled = false;

        }
    );

}

