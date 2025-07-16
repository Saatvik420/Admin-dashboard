document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const recentOrdersTableBody = document.querySelector('.recent-orders tbody');
    const customersTableBody = document.querySelector('#customers tbody');
    const galleryGrid = document.querySelector('.gallery-grid');
    const newTaskInput = document.getElementById('newTaskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const completedTasksCount = document.getElementById('completedTasksCount');
    const uncompletedTasksCount = document.getElementById('uncompletedTasksCount');
    const completedTasksList = document.getElementById('completedTasksList');
    const uncompletedTasksList = document.getElementById('uncompletedTasksList');
    const editTaskModal = document.getElementById('editTaskModal');
    const editTaskInput = document.getElementById('editTaskInput');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const confirmDeleteOkBtn = document.getElementById('confirmDeleteOkBtn');
    const confirmDeleteCancelBtn = document.getElementById('confirmDeleteCancelBtn');
    const generalAlertModal = document.getElementById('generalAlertModal');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkBtn = document.getElementById('alertOkBtn');
    const addProductForm = document.getElementById('addProductForm');
    const productNameInput = document.getElementById('productName');
    const productDescriptionInput = document.getElementById('productDescription');
    const productAddMessage = document.getElementById('productAddMessage');

    // Chart related elements
    const salesChartCanvas = document.getElementById('salesChart');
    let salesChartInstance = null;

    // Theme Toggle Elements
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.theme-toggle .fa-sun');
    const moonIcon = document.querySelector('.theme-toggle .fa-moon');
    const body = document.body;

    // Date & Time Elements
    const currentDateSpan = document.getElementById('currentDate');
    const currentTimeSpan = document.getElementById('currentTime');

    let tasks = [];
    let editingTaskIndex = -1;
    let deletingTaskIndex = -1;

    // --- Static Data (Customers & Initial Tasks) ---
    const customersData = [
        { id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz", phone: "1-770-736-8031 x56442" },
        { id: 2, name: "Ervin Howell", username: "Antonette", email: "Shanna@melissa.tv", phone: "010-692-6593 x09125" },
        { id: 3, name: "Clementine Bauch", username: "Samantha", email: "Nathan@yesenia.net", phone: "1-463-123-4447" },
        { id: 4, name: "Patricia Lebsack", username: "Karianne", email: "Julianne.OConner@kory.org", phone: "493-170-9623 x156" },
        { id: 5, name: "Chelsey Dietrich", username: "Kamren", email: "Lucio_Hettinger@annie.ca", phone: "(254)954-1289" },
        { id: 6, name: "Mrs. Dennis Schulist", username: "Leopoldo_Corkery", email: "Karley_Dach@jasper.info", phone: "1-477-935-8478 x6430" },
        { id: 7, name: "Kurtis Weissnat", username: "Elwyn.Skiles", email: "Telly.Hoeger@billy.biz", phone: "210.067.6132" },
        { id: 8, name: "Nicholas Runolfsdottir V", username: "Maxime_Nienow", email: "Sherwood@rosamond.me", phone: "586.493.6943 x140" },
        { id: 9, name: "Glenna Reichert", username: "Delphine", email: "Chaim_McDermott@dana.io", phone: "(775)976-6794 x4120" },
        { id: 10, name: "Clementina DuBuque", username: "Moriah.Stanton", email: "Rey.Padberg@karina.biz", phone: "024-648-3804" },
    ];

    // --- Utility Functions ---
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    }

    function showAlert(title, message, type = 'alert') {
        alertTitle.textContent = title;
        alertMessage.textContent = message;
        generalAlertModal.style.display = 'flex';
    }

    function hideAlert() {
        generalAlertModal.style.display = 'none';
    }

    // --- Populate Data from DummyJSON ---

    async function populateRecentOrders() {
        recentOrdersTableBody.innerHTML = '<tr><td colspan="5">Loading recent orders...</td></tr>';
        try {
            const response = await fetch('https://dummyjson.com/products?limit=5');
            const data = await response.json();
            const products = data.products;

            recentOrdersTableBody.innerHTML = '';
            if (products && products.length > 0) {
                products.forEach(product => {
                    const row = recentOrdersTableBody.insertRow();
                    row.insertCell().textContent = product.title;
                    row.insertCell().textContent = Math.floor(Math.random() * 90000) + 10000;
                    row.insertCell().textContent = Math.random() > 0.5 ? 'Paid' : 'Due';
                    row.insertCell().textContent = Math.random() > 0.5 ? 'Pending' : 'Delivered';
                    const detailsCell = row.insertCell();
                    detailsCell.textContent = 'Details';
                    detailsCell.style.color = 'var(--secondary-color)';
                    detailsCell.style.cursor = 'pointer';
                    detailsCell.addEventListener('click', () => showAlert('Product Details', `Name: ${product.title}\nPrice: $${product.price.toFixed(2)}\nCategory: ${product.category}`));
                });
            } else {
                recentOrdersTableBody.innerHTML = '<tr><td colspan="5">No recent orders found.</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
            recentOrdersTableBody.innerHTML = '<tr><td colspan="5" style="color: red;">Failed to load recent orders. Please try again.</td></tr>';
        }
    }

    function populateCustomers() {
        customersTableBody.innerHTML = '';
        customersData.forEach(customer => {
            const row = customersTableBody.insertRow();
            row.insertCell().textContent = customer.id;
            row.insertCell().textContent = customer.name;
            row.insertCell().textContent = customer.username;
            row.insertCell().textContent = customer.email;
            row.insertCell().textContent = customer.phone;
        });
    }

    async function populateGallery() {
        galleryGrid.innerHTML = '<div>Loading gallery items...</div>';
        try {
            const response = await fetch('https://dummyjson.com/products?limit=12');
            const data = await response.json();
            const products = data.products;

            galleryGrid.innerHTML = '';
            if (products && products.length > 0) {
                products.forEach(product => {
                    const galleryItemDiv = document.createElement('div');
                    galleryItemDiv.classList.add('gallery-item');
                    galleryItemDiv.innerHTML = `
                        <img src="${product.thumbnail}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>${product.category}</p>
                        <p class="price">$${product.price.toFixed(2)}</p>
                    `;
                    galleryGrid.appendChild(galleryItemDiv);
                });
            } else {
                galleryGrid.innerHTML = '<div>No gallery items found.</div>';
            }
        } catch (error) {
            console.error('Error fetching gallery items:', error);
            galleryGrid.innerHTML = '<div style="color: red;">Failed to load gallery items. Please try again.</div>';
        }
    }

    // --- Chart.js Integration ---
    function renderSalesChart() {
        if (salesChartInstance) {
            salesChartInstance.destroy();
        }

        const ctx = salesChartCanvas.getContext('2d');
        const isDarkMode = body.classList.contains('dark-mode');

        // Adjust chart colors based on theme
        const textColor = isDarkMode ? getComputedStyle(document.documentElement).getPropertyValue('--dark-text-color-light') : getComputedStyle(document.documentElement).getPropertyValue('--text-color-light');
        const gridColor = isDarkMode ? getComputedStyle(document.documentElement).getPropertyValue('--dark-border-color') : getComputedStyle(document.documentElement).getPropertyValue('--border-color');


        salesChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Sales ($)',
                        data: [18000, 22000, 20000, 25000, 23000, 28000, 25024],
                        borderColor: 'var(--primary-color)',
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: 'var(--primary-color)',
                        pointBorderColor: isDarkMode ? 'var(--dark-bg-white)' : 'var(--bg-white)',
                        pointHoverBackgroundColor: 'var(--primary-color)',
                        pointHoverBorderColor: 'var(--primary-color)'
                    },
                    {
                        label: 'Expenses ($)',
                        data: [35000, 38000, 40000, 41000, 39000, 42000, 41160],
                        borderColor: 'var(--tertiary-color)',
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: 'var(--tertiary-color)',
                        pointBorderColor: isDarkMode ? 'var(--dark-bg-white)' : 'var(--bg-white)',
                        pointHoverBackgroundColor: 'var(--tertiary-color)',
                        pointHoverBorderColor: 'var(--tertiary-color)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Circular Progress Bar Functionality ---
    function updateCircularProgress() {
        document.querySelectorAll('.circle-progress').forEach(progressDiv => {
            const percentage = parseInt(progressDiv.dataset.percentage);
            const circle = progressDiv.querySelector('.progress');
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;

            const percentText = progressDiv.querySelector('.percent');
            if (percentText) {
                percentText.textContent = `${percentage}%`;
            }
        });
    }

    // --- Theme Toggle Functionality ---
    function toggleTheme() {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        sunIcon.classList.toggle('active', !body.classList.contains('dark-mode'));
        moonIcon.classList.toggle('active', body.classList.contains('dark-mode'));

        renderSalesChart();
    }

    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            moonIcon.classList.add('active');
            sunIcon.classList.remove('active');
        } else {
            sunIcon.classList.add('active');
            moonIcon.classList.remove('active');
        }
    }

    // --- Live Date and Time Functionality ---
    function updateDateTime() {
        const now = new Date();
        const optionsDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

        currentDateSpan.textContent = now.toLocaleDateString('en-US', optionsDate);
        currentTimeSpan.textContent = now.toLocaleTimeString('en-US', optionsTime);
    }


    // --- To-Do List Functions ---
    function renderTasks() {
        completedTasksList.innerHTML = '';
        uncompletedTasksList.innerHTML = '';

        let completedCount = 0;
        let uncompletedCount = 0;

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            if (task.completed) {
                completedTasksList.appendChild(li);
                completedCount++;
            } else {
                uncompletedTasksList.appendChild(li);
                uncompletedCount++;
            }
        });

        completedTasksCount.textContent = completedCount;
        uncompletedTasksCount.textContent = uncompletedCount;

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.onclick = (e) => openEditModal(parseInt(e.target.dataset.index));
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (e) => openConfirmDeleteModal(parseInt(e.target.dataset.index));
        });
    }

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') {
            showAlert('Input Error', 'Please write down a task!');
            return;
        }
        tasks.push({ text: taskText, completed: false });
        newTaskInput.value = '';
        renderTasks();
    }

    function openEditModal(index) {
        editingTaskIndex = index;
        editTaskInput.value = tasks[index].text;
        editTaskModal.style.display = 'flex';
    }

    function closeEditModal() {
        editTaskModal.style.display = 'none';
        editingTaskIndex = -1;
    }

    function saveEditedTask() {
        if (editingTaskIndex !== -1) {
            const newText = editTaskInput.value.trim();
            if (newText === '') {
                showAlert('Input Error', 'Task cannot be empty!');
                return;
            }
            tasks[editingTaskIndex].text = newText;
            renderTasks();
            closeEditModal();
        }
    }

    function openConfirmDeleteModal(index) {
        deletingTaskIndex = index;
        confirmDeleteModal.style.display = 'flex';
    }

    function closeConfirmDeleteModal() {
        confirmDeleteModal.style.display = 'none';
        deletingTaskIndex = -1;
    }

    function deleteTask() {
        if (deletingTaskIndex !== -1) {
            tasks.splice(deletingTaskIndex, 1);
            renderTasks();
            closeConfirmDeleteModal();
        }
    }

    // --- Event Listeners ---

    // Sidebar navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            if (sectionId) {
                showSection(sectionId);
                if (sectionId === 'dashboard') {
                    populateRecentOrders();
                    renderSalesChart();
                    updateCircularProgress();
                } else if (sectionId === 'customers') {
                    populateCustomers();
                } else if (sectionId === 'gallery') {
                    populateGallery();
                }
            }
            if (item.classList.contains('logout')) {
                showAlert('Logout', 'Logging out...');
            }
        });
    });

    // To-Do List
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    modalOkBtn.addEventListener('click', saveEditedTask);
    modalCancelBtn.addEventListener('click', closeEditModal);

    confirmDeleteOkBtn.addEventListener('click', deleteTask);
    confirmDeleteCancelBtn.addEventListener('click', closeConfirmDeleteModal);

    alertOkBtn.addEventListener('click', hideAlert);

    // Add Product Form
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productName = productNameInput.value.trim();
        const productDescription = productDescriptionInput.value.trim();

        if (productName === '' || productDescription === '') {
            showAlert('Input Error', 'Please fill out all fields!');
            return;
        }

        productAddMessage.textContent = 'Product added successfully!';
        productAddMessage.style.display = 'block';
        productAddMessage.style.color = 'var(--primary-color)';
        productNameInput.value = '';
        productDescriptionInput.value = '';

        setTimeout(() => {
            productAddMessage.style.display = 'none';
            productAddMessage.textContent = '';
        }, 3000);
    });

    // Theme Toggle Listener
    themeToggle.addEventListener('click', toggleTheme);


    // --- Initial Load ---
    applySavedTheme();
    populateRecentOrders();
    populateCustomers();
    renderTasks();
    showSection('dashboard');
    renderSalesChart();
    updateCircularProgress();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});