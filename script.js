// Application State
let currentUser = null;
let products = [];
let cart = [];
let orders = [];
let scene3D = null;
let camera3D = null;
let renderer3D = null;
let current3DObject = null;
let rotationAngle = 0;
let currentFilter = 'all';
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
let sortBy = 'name-asc';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeProducts();
    checkAuth();
    updateCartCount();
    // Nav links - prevent default and show section
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const section = this.getAttribute('data-section');
            if (section) showSection(section);
        });
    });
    // Filter pills
    document.querySelectorAll('.filter-pills .pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            filterProducts();
        });
    });
    // Establish modal tabs
    document.querySelectorAll('.establish-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.establish-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tab + 'Tab').classList.add('active');
        });
    });
    // Close modal on outside click
    document.getElementById('establishModal').addEventListener('click', function(e) {
        if (e.target === this) closeEstablishModal();
    });
});

// Data Management
function loadData() {
    const savedUsers = localStorage.getItem('furniswift_users');
    const savedProducts = localStorage.getItem('furniswift_products');
    const savedCart = localStorage.getItem('furniswift_cart');
    const savedOrders = localStorage.getItem('furniswift_orders');
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        initializeProducts();
    }
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

function saveData() {
    localStorage.setItem('furniswift_products', JSON.stringify(products));
    localStorage.setItem('furniswift_cart', JSON.stringify(cart));
    localStorage.setItem('furniswift_orders', JSON.stringify(orders));
    
    const users = JSON.parse(localStorage.getItem('furniswift_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser?.email);
    if (userIndex !== -1 && currentUser) {
        users[userIndex] = currentUser;
        localStorage.setItem('furniswift_users', JSON.stringify(users));
    }
}

// Initialize Products - 50 total (sofa, chair, table, bed, cabinet, lighting)
function initializeProducts() {
    var products21to50 = [
        { id: 21, name: "Table Lamp", category: "lighting", price: 89.99, description: "Elegant table lamp. Perfect for bedside or desk.", image: "💡", color: "White", material: "Ceramic" },
        { id: 22, name: "LED Bulb Pack", category: "lighting", price: 24.99, description: "Set of 4 LED bulbs. Energy efficient, warm white.", image: "💡", color: "White", material: "Plastic" },
        { id: 23, name: "Floor Lamp", category: "lighting", price: 149.99, description: "Modern floor lamp. Adjustable height and angle.", image: "🪔", color: "Black", material: "Metal" },
        { id: 24, name: "Chandelier", category: "lighting", price: 399.99, description: "Crystal chandelier. Adds luxury to dining room.", image: "💡", color: "Gold", material: "Crystal" },
        { id: 25, name: "Pendant Light", category: "lighting", price: 129.99, description: "Industrial pendant light. Perfect over kitchen island.", image: "💡", color: "Black", material: "Metal" },
        { id: 26, name: "Desk Lamp", category: "lighting", price: 49.99, description: "LED desk lamp with USB port. Adjustable arm.", image: "💡", color: "White", material: "Metal" },
        { id: 27, name: "Wall Sconce", category: "lighting", price: 79.99, description: "Pair of wall sconces. Soft ambient light.", image: "🪔", color: "Brown", material: "Wood" },
        { id: 28, name: "Smart Bulb", category: "lighting", price: 34.99, description: "WiFi smart bulb. Control via app, change colors.", image: "💡", color: "White", material: "Plastic" },
        { id: 29, name: "Torchiere Lamp", category: "lighting", price: 119.99, description: "Tall torchiere. Uplights ceiling for ambient glow.", image: "🪔", color: "Silver", material: "Metal" },
        { id: 30, name: "String Lights", category: "lighting", price: 29.99, description: "20ft string lights. Perfect for balcony or bedroom.", image: "✨", color: "Gold", material: "Wire" },
        { id: 31, name: "Chaise Lounge", category: "sofa", price: 749.99, description: "Single chaise lounge. Perfect for reading nook.", image: "🛋️", color: "Gray", material: "Fabric" },
        { id: 32, name: "Bean Bag Chair", category: "chair", price: 129.99, description: "Large bean bag. Comfortable and casual.", image: "🪑", color: "Beige", material: "Fabric" },
        { id: 33, name: "Nesting Tables", category: "table", price: 279.99, description: "Set of 3 nesting tables. Space-saving design.", image: "🪑", color: "Brown", material: "Wood" },
        { id: 34, name: "Bunk Bed", category: "bed", price: 899.99, description: "Sturdy bunk bed. Ideal for kids' room.", image: "🛏️", color: "White", material: "Wood" },
        { id: 35, name: "Display Cabinet", category: "cabinet", price: 549.99, description: "Glass display cabinet. Showcase collectibles.", image: "🗄️", color: "Brown", material: "Wood" },
        { id: 36, name: "Sleeper Sofa", category: "sofa", price: 1099.99, description: "Convertible sleeper sofa. Guest bed when needed.", image: "🛋️", color: "Gray", material: "Fabric" },
        { id: 37, name: "Rocking Chair", category: "chair", price: 379.99, description: "Classic rocking chair. Relaxing motion.", image: "🪑", color: "Brown", material: "Wood" },
        { id: 38, name: "Bar Table", category: "table", price: 249.99, description: "Tall bar table. For kitchen or lounge.", image: "🪑", color: "Black", material: "Metal" },
        { id: 39, name: "Daybed", category: "bed", price: 649.99, description: "Versatile daybed. Sofa by day, bed by night.", image: "🛏️", color: "White", material: "Wood" },
        { id: 40, name: "Shoe Rack", category: "cabinet", price: 89.99, description: "Multi-tier shoe rack. Fits 15+ pairs.", image: "🗄️", color: "Black", material: "Metal" },
        { id: 41, name: "Ceiling Light", category: "lighting", price: 159.99, description: "Flush mount ceiling light. Modern minimalist.", image: "💡", color: "White", material: "Glass" },
        { id: 42, name: "Velvet Sofa", category: "sofa", price: 1399.99, description: "Luxurious velvet sofa. Rich texture and color.", image: "🛋️", color: "Navy Blue", material: "Velvet" },
        { id: 43, name: "Stool Set", category: "chair", price: 159.99, description: "Set of 2 wooden stools. Kitchen or bar.", image: "🪑", color: "Brown", material: "Wood" },
        { id: 44, name: "Laptop Stand", category: "table", price: 59.99, description: "Adjustable laptop stand. Ergonomic desk setup.", image: "🪑", color: "Black", material: "Metal" },
        { id: 45, name: "Trundle Bed", category: "bed", price: 799.99, description: "Trundle bed with pull-out. Saves space.", image: "🛏️", color: "White", material: "Wood" },
        { id: 46, name: "Filing Cabinet", category: "cabinet", price: 189.99, description: "2-drawer filing cabinet. Home office essential.", image: "🗄️", color: "Gray", material: "Metal" },
        { id: 47, name: "Arc Lamp", category: "lighting", price: 199.99, description: "Arch floor lamp. Statement piece for living room.", image: "🪔", color: "Black", material: "Metal" },
        { id: 48, name: "Ottoman", category: "sofa", price: 229.99, description: "Storage ottoman. Extra seating and storage.", image: "🛋️", color: "Gray", material: "Fabric" },
        { id: 49, name: "Gaming Chair", category: "chair", price: 349.99, description: "Ergonomic gaming chair. Lumbar support, recline.", image: "💺", color: "Black", material: "Leather" },
        { id: 50, name: "Nightstand", category: "table", price: 179.99, description: "Bedside nightstand. Drawer and open shelf.", image: "🪑", color: "Brown", material: "Wood" }
    ];
    if (products.length > 0 && products.length < 50) {
        var existingIds = products.map(function(p) { return p.id; });
        products21to50.forEach(function(p) {
            if (existingIds.indexOf(p.id) === -1) { products.push(p); existingIds.push(p.id); }
        });
        saveData();
        return;
    }
    if (products.length >= 50) return;
    
    products = [
        {
            id: 1,
            name: "Modern Sofa Set",
            category: "sofa",
            price: 1299.99,
            description: "Comfortable 3-seater sofa with modern design. Perfect for your living room.",
            image: "🛋️",
            color: "Gray",
            material: "Fabric"
        },
        {
            id: 2,
            name: "Ergonomic Office Chair",
            category: "chair",
            price: 299.99,
            description: "Premium office chair with lumbar support. Ideal for long work sessions.",
            image: "💺",
            color: "Black",
            material: "Leather"
        },
        {
            id: 3,
            name: "Dining Table Set",
            category: "table",
            price: 899.99,
            description: "Elegant dining table with 6 matching chairs. Perfect for family dinners.",
            image: "🪑",
            color: "Brown",
            material: "Wood"
        },
        {
            id: 4,
            name: "King Size Bed",
            category: "bed",
            price: 1599.99,
            description: "Luxurious king-size bed with storage drawers. Includes mattress.",
            image: "🛏️",
            color: "White",
            material: "Wood"
        },
        {
            id: 5,
            name: "Storage Cabinet",
            category: "cabinet",
            price: 499.99,
            description: "Spacious storage cabinet with multiple shelves. Great for organizing.",
            image: "🗄️",
            color: "Brown",
            material: "Wood"
        },
        {
            id: 6,
            name: "Recliner Chair",
            category: "chair",
            price: 599.99,
            description: "Comfortable recliner chair with footrest. Perfect for relaxation.",
            image: "🪑",
            color: "Beige",
            material: "Fabric"
        },
        {
            id: 7,
            name: "Coffee Table",
            category: "table",
            price: 349.99,
            description: "Modern coffee table with glass top. Adds elegance to your living room.",
            image: "🪑",
            color: "Black",
            material: "Glass & Metal"
        },
        {
            id: 8,
            name: "Sectional Sofa",
            category: "sofa",
            price: 1899.99,
            description: "Large sectional sofa with chaise. Perfect for large families.",
            image: "🛋️",
            color: "Navy Blue",
            material: "Fabric"
        },
        {
            id: 9,
            name: "Queen Size Bed",
            category: "bed",
            price: 1199.99,
            description: "Beautiful queen-size bed frame. Modern design with headboard.",
            image: "🛏️",
            color: "Gray",
            material: "Metal"
        },
        {
            id: 10,
            name: "Bookshelf",
            category: "cabinet",
            price: 249.99,
            description: "Tall bookshelf with 5 shelves. Great for organizing books and decor.",
            image: "🗄️",
            color: "White",
            material: "Wood"
        },
        {
            id: 11,
            name: "Bar Stool Set",
            category: "chair",
            price: 199.99,
            description: "Set of 2 modern bar stools. Perfect for kitchen islands.",
            image: "💺",
            color: "Black",
            material: "Metal"
        },
        {
            id: 12,
            name: "Console Table",
            category: "table",
            price: 449.99,
            description: "Elegant console table for entryway. Includes drawer storage.",
            image: "🪑",
            color: "Brown",
            material: "Wood"
        },
        {
            id: 13,
            name: "L-Shaped Sofa",
            category: "sofa",
            price: 1699.99,
            description: "Spacious L-shaped sofa. Perfect for corner placement.",
            image: "🛋️",
            color: "Gray",
            material: "Fabric"
        },
        {
            id: 14,
            name: "Accent Chair",
            category: "chair",
            price: 449.99,
            description: "Stylish accent chair. Adds character to any room.",
            image: "🪑",
            color: "Brown",
            material: "Leather"
        },
        {
            id: 15,
            name: "Side Table",
            category: "table",
            price: 199.99,
            description: "Compact side table. Ideal next to sofa or bed.",
            image: "🪑",
            color: "Black",
            material: "Wood"
        },
        {
            id: 16,
            name: "Single Bed",
            category: "bed",
            price: 699.99,
            description: "Compact single bed. Great for kids or guest room.",
            image: "🛏️",
            color: "White",
            material: "Wood"
        },
        {
            id: 17,
            name: "Wardrobe",
            category: "cabinet",
            price: 799.99,
            description: "Large wardrobe with sliding doors. Ample storage.",
            image: "🗄️",
            color: "Brown",
            material: "Wood"
        },
        {
            id: 18,
            name: "Loveseat",
            category: "sofa",
            price: 899.99,
            description: "Cozy two-seater loveseat. Perfect for small spaces.",
            image: "🛋️",
            color: "Beige",
            material: "Fabric"
        },
        {
            id: 19,
            name: "Dining Chair Set",
            category: "chair",
            price: 549.99,
            description: "Set of 4 dining chairs. Matches dining tables.",
            image: "🪑",
            color: "Brown",
            material: "Wood"
        },
        {
            id: 20,
            name: "Study Desk",
            category: "table",
            price: 399.99,
            description: "Ergonomic study desk. With cable management.",
            image: "🪑",
            color: "White",
            material: "Wood"
        }
    ];
    products = products.concat(products21to50);
    saveData();
}

// Authentication
let users = [];

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;
    const photoFile = document.getElementById('regPhoto').files[0];
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('furniswift_users') || '[]');
    if (existingUsers.find(u => u.email === email)) {
        alert('Email already registered! Please login.');
        document.querySelector('.establish-tabs .tab-btn[data-tab="login"]').click();
        return;
    }
    
    // Convert photo to base64
    let photoBase64 = '';
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoBase64 = e.target.result;
            completeRegistration(name, email, password, phone, address, photoBase64);
        };
        reader.readAsDataURL(photoFile);
    } else {
        completeRegistration(name, email, password, phone, address, photoBase64);
    }
}

function completeRegistration(name, email, password, phone, address, photo) {
    const user = {
        id: Date.now(),
        name,
        email,
        password, // In production, hash this!
        phone,
        address,
        photo,
        preferences: [],
        createdAt: new Date().toISOString()
    };
    
    const existingUsers = JSON.parse(localStorage.getItem('furniswift_users') || '[]');
    existingUsers.push(user);
    localStorage.setItem('furniswift_users', JSON.stringify(existingUsers));
    
    alert('Registration successful! Please login.');
    document.querySelector('.establish-tabs .tab-btn[data-tab="login"]').click();
    document.getElementById('registerForm').reset();
    const prev = document.getElementById('photoPreview');
    prev.innerHTML = '';
    prev.classList.remove('active');
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const existingUsers = JSON.parse(localStorage.getItem('furniswift_users') || '[]');
    const user = existingUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('furniswift_currentUser', JSON.stringify(user));
        checkAuth();
        closeEstablishModal();
        showSection('home');
        document.getElementById('loginForm').reset();
        alert('Welcome back, ' + user.name + '!');
    } else {
        alert('Invalid email or password!');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('furniswift_currentUser');
    checkAuth();
    showSection('home');
    alert('Logged out successfully!');
}

function checkAuth() {
    const savedUser = localStorage.getItem('furniswift_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    const profileNavItem = document.getElementById('profileNavItem');
    const establishBtnWrap = document.getElementById('establishBtnWrap');
    const logoutNavItem = document.getElementById('logoutNavItem');
    
    if (currentUser) {
        if (profileNavItem) profileNavItem.style.display = 'block';
        if (establishBtnWrap) establishBtnWrap.style.display = 'none';
        if (logoutNavItem) logoutNavItem.style.display = 'block';
        loadProfile();
    } else {
        if (profileNavItem) profileNavItem.style.display = 'none';
        if (establishBtnWrap) establishBtnWrap.style.display = 'block';
        if (logoutNavItem) logoutNavItem.style.display = 'none';
    }
}

function showEstablishIdentity() {
    if (currentUser) {
        showSection('profile');
        return;
    }
    document.getElementById('establishModal').classList.add('active');
}

function closeEstablishModal() {
    document.getElementById('establishModal').classList.remove('active');
}

// Photo Preview
function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
}

// Profile Management
function loadProfile() {
    if (!currentUser) return;
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    const photoEl = document.getElementById('profilePhoto');
    photoEl.src = currentUser.photo || 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect fill="#252538" width="120" height="120"/><text x="50%" y="55%" fill="#a0a0b0" font-size="36" text-anchor="middle" dominant-baseline="middle">?</text></svg>');
    
    document.getElementById('profileNameInput').value = currentUser.name;
    document.getElementById('profileEmailInput').value = currentUser.email;
    document.getElementById('profilePhoneInput').value = currentUser.phone;
    document.getElementById('profileAddressInput').value = currentUser.address;
}

function updateProfilePhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.photo = e.target.result;
            document.getElementById('profilePhoto').src = e.target.result;
            saveData();
            alert('Profile photo updated!');
        };
        reader.readAsDataURL(file);
    }
}

function updateProfile(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login first!');
        showEstablishIdentity();
        return;
    }
    
    currentUser.name = document.getElementById('profileNameInput').value;
    currentUser.email = document.getElementById('profileEmailInput').value;
    currentUser.phone = document.getElementById('profilePhoneInput').value;
    currentUser.address = document.getElementById('profileAddressInput').value;
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    saveData();
    alert('Profile updated successfully!');
}

// Navigation
function showSection(sectionId) {
    // Check if login required
    const protectedSections = ['profile', 'cart', 'orders'];
    if (protectedSections.includes(sectionId) && !currentUser) {
        alert('Please login to access this section!');
        showEstablishIdentity();
        return;
    }
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const el = document.getElementById(sectionId);
    if (el) el.classList.add('active');
    
    // Update nav active state
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
    });
    
    if (sectionId === 'products') {
        displayProducts();
        if (currentUser) {
            displayRecommendations();
        }
    } else if (sectionId === 'cart') {
        displayCart();
    } else if (sectionId === 'orders') {
        displayOrders();
    } else if (sectionId === 'profile') {
        loadProfile();
    }
}

// Products Display - 10 per page, bigger images
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    const filtered = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    
    const paginated = getPaginatedProducts(filtered);
    
    grid.innerHTML = paginated.map(product => `
        <div class="product-card product-card-large" onclick="showProductDetail(${product.id})">
            <div class="product-image product-image-large">${product.image}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button type="button" class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id});">Add to Cart</button>
                    <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); show3DPreview(${product.id});">3D View</button>
                </div>
            </div>
        </div>
    `).join('');
    
    renderPagination(filtered.length, totalPages);
}

function getFilteredProducts() {
    const category = currentFilter || 'all';
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    let list = products.filter(product => {
        const matchCategory = category === 'all' || product.category === category;
        const matchSearch = product.name.toLowerCase().includes(search) || 
                          product.description.toLowerCase().includes(search);
        return matchCategory && matchSearch;
    });
    
    // Sort
    const sortSelect = document.getElementById('sortSelect');
    sortBy = sortSelect ? sortSelect.value : sortBy;
    
    if (sortBy === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);
    
    return list;
}

function getPaginatedProducts(list) {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
}

function renderPagination(totalItems, totalPages) {
    const wrap = document.getElementById('paginationWrap');
    if (!wrap) return;
    
    if (totalPages <= 1 && totalItems <= ITEMS_PER_PAGE) {
        wrap.innerHTML = '<p class="pagination-info">Showing ' + totalItems + ' items</p>';
        return;
    }
    
    let html = '<p class="pagination-info">Page ' + currentPage + ' of ' + totalPages + ' (10 per page)</p>';
    html += '<div class="pagination-btns">';
    html += '<button type="button" class="pagination-btn" onclick="goToPage(' + (currentPage - 1) + ');" ' + (currentPage <= 1 ? 'disabled' : '') + '>← Prev</button>';
    html += '<span class="pagination-current">' + currentPage + ' / ' + totalPages + '</span>';
    html += '<button type="button" class="pagination-btn" onclick="goToPage(' + (currentPage + 1) + ');" ' + (currentPage >= totalPages ? 'disabled' : '') + '>Next →</button>';
    html += '</div>';
    wrap.innerHTML = html;
}

function goToPage(page) {
    const filtered = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displayProducts();
}

function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortBy = sortSelect.value;
    currentPage = 1;
}

function filterProducts() {
    currentPage = 1;
    displayProducts();
}

// Product Detail Modal
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div class="product-image" style="height: 400px;">${product.image}</div>
            <div>
                <h2 style="color: var(--primary); margin-bottom: 1rem;">${product.name}</h2>
                <p style="color: var(--gray); margin-bottom: 1rem; text-transform: capitalize;">Category: ${product.category}</p>
                <p style="margin-bottom: 1.5rem; line-height: 1.6;">${product.description}</p>
                <div style="margin-bottom: 1rem;">
                    <strong>Color:</strong> ${product.color}<br>
                    <strong>Material:</strong> ${product.material}
                </div>
                <div class="product-price" style="font-size: 2rem; margin-bottom: 1.5rem;">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button type="button" class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();">Add to Cart</button>
                    <button type="button" class="btn btn-secondary" onclick="show3DPreview(${product.id}); closeModal();">3D Preview</button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

// 3D product shapes - sofa, chair, table, bed, cabinet, bulb (not just a box)
function createProductShape(category, material, materialDark) {
    var group = new THREE.Group();
    var g, m, mesh;
    
    function addBox(w, h, d, x, y, z, mat) {
        g = new THREE.BoxGeometry(w, h, d);
        m = mat || material;
        mesh = new THREE.Mesh(g, m);
        mesh.position.set(x, y, z);
        group.add(mesh);
    }
    
    function addCylinder(rTop, rBottom, height, x, y, z, mat) {
        g = new THREE.CylinderGeometry(rTop, rBottom, height, 12);
        m = mat || material;
        mesh = new THREE.Mesh(g, m);
        mesh.position.set(x, y, z);
        group.add(mesh);
    }
    
    function addSphere(radius, x, y, z, mat) {
        g = new THREE.SphereGeometry(radius, 16, 12);
        m = mat || material;
        mesh = new THREE.Mesh(g, m);
        mesh.position.set(x, y, z);
        group.add(mesh);
    }
    
    if (category === 'sofa') {
        addBox(2.2, 0.35, 1.0, 0, 0.175, 0);
        addBox(2.2, 0.7, 0.12, 0, 0.7, -0.44);
        addBox(0.12, 0.5, 1.0, -1.1, 0.5, 0);
        addBox(0.12, 0.5, 1.0, 1.1, 0.5, 0);
    } else if (category === 'chair') {
        addBox(0.55, 0.08, 0.55, 0, 0.04, 0);
        addBox(0.55, 0.6, 0.06, 0, 0.38, -0.245);
        addBox(0.04, 0.4, 0.04, -0.24, 0.24, -0.24, materialDark);
        addBox(0.04, 0.4, 0.04, 0.24, 0.24, -0.24, materialDark);
        addBox(0.04, 0.4, 0.04, -0.24, 0.24, 0.24, materialDark);
        addBox(0.04, 0.4, 0.04, 0.24, 0.24, 0.24, materialDark);
    } else if (category === 'table') {
        addBox(1.6, 0.06, 1.0, 0, 0.23, 0);
        addBox(0.06, 0.2, 0.06, -0.72, 0.1, -0.42, materialDark);
        addBox(0.06, 0.2, 0.06, 0.72, 0.1, -0.42, materialDark);
        addBox(0.06, 0.2, 0.06, -0.72, 0.1, 0.42, materialDark);
        addBox(0.06, 0.2, 0.06, 0.72, 0.1, 0.42, materialDark);
    } else if (category === 'bed') {
        addBox(2.0, 0.2, 1.7, 0, 0.1, 0);
        addBox(2.0, 0.75, 0.08, 0, 0.575, -0.81);
    } else if (category === 'cabinet') {
        addBox(1.0, 1.5, 0.45, 0, 0.75, 0);
        addBox(0.42, 1.35, 0.02, -0.25, 0.675, 0.235, materialDark);
        addBox(0.42, 1.35, 0.02, 0.25, 0.675, 0.235, materialDark);
    } else if (category === 'lighting') {
        addSphere(0.22, 0, 0.65, 0);
        addCylinder(0.03, 0.05, 0.5, 0, 0.25, 0, materialDark);
        addCylinder(0.08, 0.08, 0.03, 0, 0, 0, materialDark);
    } else {
        addBox(1, 1, 1, 0, 0.5, 0);
    }
    
    return group;
}

// 3D Preview - Visible, scrollable, perfect
function show3DPreview(productId) {
    var product = products.find(function(p) { return p.id === productId; });
    if (!product) return;
    
    var previewEl = document.getElementById('preview3D');
    previewEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    var titleEl = document.getElementById('preview3DTitle');
    if (titleEl) titleEl.textContent = product.name + ' – 3D Preview';
    
    var container = document.getElementById('previewCanvas');
    container.innerHTML = '';
    
    // Wait for container to have dimensions (so 3D view is visible)
    function init3D() {
        var w = container.offsetWidth || container.clientWidth || 800;
        var h = container.offsetHeight || container.clientHeight || 480;
        if (w < 100) w = 800;
        if (h < 100) h = 480;
        
        scene3D = new THREE.Scene();
        scene3D.background = new THREE.Color(0x0d0d14);
        
        camera3D = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
        camera3D.position.set(0, 1.2, 4.5);
        camera3D.lookAt(0, 0, 0);
        
        renderer3D = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer3D.setSize(w, h);
        renderer3D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        try {
            renderer3D.shadowMap.enabled = true;
            renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;
        } catch (e) {}
        
        renderer3D.domElement.style.width = '100%';
        renderer3D.domElement.style.height = '100%';
        renderer3D.domElement.style.display = 'block';
        container.appendChild(renderer3D.domElement);
        
        var ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene3D.add(ambient);
        var keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
        keyLight.position.set(4, 6, 5);
        scene3D.add(keyLight);
        var fillLight = new THREE.DirectionalLight(0x9d6cf7, 0.3);
        fillLight.position.set(-3, 2, 3);
        scene3D.add(fillLight);
        var backLight = new THREE.DirectionalLight(0xffffff, 0.35);
        backLight.position.set(0, 2, -4);
        scene3D.add(backLight);
        
        var colorMap = { 'Gray': 0x808080, 'Black': 0x1a1a1a, 'Brown': 0x6b4423, 'White': 0xf5f5f5, 'Beige': 0xdebe9a, 'Navy Blue': 0x1e3a5f, 'Gold': 0xd4af37 };
        var color = colorMap[product.color] || 0x7F38EC;
        var mat = new THREE.MeshPhongMaterial({ color: color, shininess: 35, specular: 0x444444 });
        var matDark = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 20, specular: 0x222222 });
        
        current3DObject = createProductShape(product.category, mat, matDark);
        scene3D.add(current3DObject);
        
        var gridHelper = new THREE.GridHelper(8, 8, 0x2a2a3a, 0x1a1a2a);
        gridHelper.position.y = -0.5;
        scene3D.add(gridHelper);
        
        rotationAngle = 0;
        animate3D();
    }
    
    if (container.offsetParent === null) {
        setTimeout(init3D, 50);
    } else {
        requestAnimationFrame(init3D);
    }
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    if (current3DObject) {
        current3DObject.rotation.y = rotationAngle;
    }
    
    if (renderer3D && scene3D && camera3D) {
        renderer3D.render(scene3D, camera3D);
    }
}

function rotate3D(direction) {
    if (current3DObject) {
        rotationAngle += direction === 'left' ? 0.1 : -0.1;
    }
}

function zoom3D(direction) {
    if (camera3D) {
        camera3D.position.z += direction === 'in' ? -0.5 : 0.5;
        camera3D.position.z = Math.max(2, Math.min(10, camera3D.position.z));
    }
}

function close3DPreview() {
    document.body.style.overflow = '';
    document.getElementById('preview3D').style.display = 'none';
    if (renderer3D) {
        if (renderer3D.domElement && renderer3D.domElement.parentNode) {
            renderer3D.domElement.parentNode.removeChild(renderer3D.domElement);
        }
        renderer3D.dispose();
        renderer3D = null;
    }
    scene3D = null;
    camera3D = null;
    current3DObject = null;
}

// AI Recommendations
function displayRecommendations() {
    if (!currentUser) return;
    
    const recommendations = getAIRecommendations();
    
    if (recommendations.length > 0) {
        document.getElementById('recommendations').style.display = 'block';
        const grid = document.getElementById('recommendationsGrid');
        
        grid.innerHTML = recommendations.map(product => `
            <div class="product-card product-card-large" onclick="showProductDetail(${product.id})">
                <div class="product-image product-image-large">${product.image}</div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button type="button" class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id});">Add to Cart</button>
                        <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); show3DPreview(${product.id});">3D View</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function getAIRecommendations() {
    if (!currentUser || cart.length === 0) {
        // If no cart items, recommend popular items
        return products.slice(0, 3);
    }
    
    // Analyze cart preferences
    const cartCategories = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.category : null;
    }).filter(c => c !== null);
    
    const categoryCounts = {};
    cartCategories.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    const favoriteCategory = Object.keys(categoryCounts).reduce((a, b) => 
        categoryCounts[a] > categoryCounts[b] ? a : b
    );
    
    // Recommend items from favorite category that aren't in cart
    const cartProductIds = cart.map(item => item.productId);
    const recommendations = products.filter(p => 
        p.category === favoriteCategory && !cartProductIds.includes(p.id)
    ).slice(0, 3);
    
    // If not enough recommendations, add popular items
    if (recommendations.length < 3) {
        const popular = products.filter(p => !cartProductIds.includes(p.id)).slice(0, 3 - recommendations.length);
        recommendations.push(...popular);
    }
    
    return recommendations;
}

// Shopping Cart
function addToCart(productId) {
    if (!currentUser) {
        alert('Please login to add items to cart!');
        showEstablishIdentity();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            productId: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    saveData();
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Start shopping to add items to your cart!</p>
                <button type="button" class="btn btn-primary" onclick="showSection('products');" style="margin-top: 1rem;">Browse Products</button>
            </div>
        `;
        document.getElementById('cartSummary').style.display = 'none';
        return;
    }
    
    document.getElementById('cartSummary').style.display = 'block';
    
    cartItemsDiv.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">${product.image}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button type="button" class="quantity-btn" onclick="updateQuantity(${item.id}, -1);">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button type="button" class="quantity-btn" onclick="updateQuantity(${item.id}, 1);">+</button>
                </div>
                <button type="button" class="remove-btn" onclick="removeFromCart(${item.id});">Remove</button>
            </div>
        `;
    }).join('');
    
    updateCartSummary();
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveData();
            displayCart();
            updateCartCount();
        }
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveData();
    displayCart();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const shipping = 50.00;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        alert('Please login to checkout!');
        showEstablishIdentity();
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const shipping = 50.00;
    const total = subtotal + shipping;
    
    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                productName: product ? product.name : 'Unknown',
                quantity: item.quantity,
                price: product ? product.price : 0
            };
        }),
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        address: currentUser.address
    };
    
    orders.push(order);
    cart = [];
    
    saveData();
    updateCartCount();
    displayCart();
    
    alert(`Order placed successfully! Order ID: #${order.id}\nTotal: $${total.toFixed(2)}`);
    showSection('orders');
}

// Orders Display
function displayOrders() {
    if (!currentUser) return;
    
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    const ordersListDiv = document.getElementById('ordersList');
    
    if (userOrders.length === 0) {
        ordersListDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here!</p>
                <button type="button" class="btn btn-primary" onclick="showSection('products');" style="margin-top: 1rem;">Browse Products</button>
            </div>
        `;
        return;
    }
    
    ordersListDiv.innerHTML = userOrders.reverse().map(order => {
        const statusClass = order.status === 'delivered' ? 'status-delivered' : 
                          order.status === 'processing' ? 'status-processing' : 'status-pending';
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">Order #${order.id}</span>
                        <div class="order-date">${new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span class="order-status ${statusClass}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.productName} x${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <span>Total</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
}
