// Task Management Dashboard JavaScript

class TaskManager {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentSection = 'my-tasks';
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.loadTasks();
        this.setupEventListeners();
        this.initializeCalendar();
        this.updateAnalytics();
        this.showWelcomeMessage();
    }

    checkAuthentication() {
        const currentSession = localStorage.getItem('currentSession');
        
        if (!currentSession) {
            window.location.href = 'signup.html';
            return;
        }
        
        try {
            this.currentUser = JSON.parse(currentSession);
        } catch (error) {
            localStorage.removeItem('currentSession');
            window.location.href = 'signup.html';
            return;
        }
    }

    loadUserData() {
        if (!this.currentUser) return;
        
        // Update user name and avatar
        const userNameElements = document.querySelectorAll('#userName, .user-name');
        userNameElements.forEach(element => {
            if (element) {
                element.textContent = this.currentUser.fullName;
            }
        });

        // Set user avatar with initials
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar && this.currentUser.fullName) {
            const initials = this.currentUser.fullName
                .split(' ')
                .map(name => name.charAt(0))
                .join('')
                .toUpperCase();
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.fullName)}&background=4f46e5&color=ffffff&size=40&bold=true`;
            userAvatar.alt = this.currentUser.fullName;
        }
    }

    loadTasks() {
        // Load tasks from localStorage or create sample tasks
        const savedTasks = localStorage.getItem(`tasks_${this.currentUser.userId}`);
        
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        } else {
            // Create sample tasks
            this.tasks = [
                {
                    id: 1,
                    title: 'Complete Project Documentation',
                    description: 'Write comprehensive documentation for the new project',
                    priority: 'high',
                    status: 'pending',
                    dueDate: this.formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Review Code Changes',
                    description: 'Review and approve pending pull requests',
                    priority: 'medium',
                    status: 'completed',
                    dueDate: this.formatDate(new Date()),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: 'Team Meeting Preparation',
                    description: 'Prepare agenda and materials for weekly team meeting',
                    priority: 'low',
                    status: 'pending',
                    dueDate: this.formatDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    title: 'Update Database Schema',
                    description: 'Implement new database schema changes',
                    priority: 'high',
                    status: 'overdue',
                    dueDate: this.formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveTasks();
        }
        
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem(`tasks_${this.currentUser.userId}`, JSON.stringify(this.tasks));
    }

    setupEventListeners() {
        // Sidebar navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Add task button and modal
        const addTaskBtn = document.getElementById('addTaskBtn');
        const addTaskModal = document.getElementById('addTaskModal');
        const closeModal = document.getElementById('closeModal');
        const cancelTask = document.getElementById('cancelTask');
        const taskForm = document.getElementById('taskForm');

        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => this.openAddTaskModal());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeAddTaskModal());
        }

        if (cancelTask) {
            cancelTask.addEventListener('click', () => this.closeAddTaskModal());
        }

        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        }

        // Task filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderTasks();
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Notifications
        const notificationIcon = document.getElementById('notificationIcon');
        const notificationDropdown = document.getElementById('notificationDropdown');
        const clearNotifications = document.getElementById('clearNotifications');

        if (notificationIcon) {
            notificationIcon.addEventListener('click', () => {
                notificationDropdown.classList.toggle('show');
            });
        }

        if (clearNotifications) {
            clearNotifications.addEventListener('click', () => this.clearNotifications());
        }

        // Calendar navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');

        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.navigateMonth(-1));
        }

        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.navigateMonth(1));
        }

        // Settings toggles
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', () => this.toggleDarkMode());
        }

        // Analytics period
        const analyticsPeriod = document.getElementById('analyticsPeriod');
        if (analyticsPeriod) {
            analyticsPeriod.addEventListener('change', () => this.updateAnalytics());
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-section')) {
                notificationDropdown?.classList.remove('show');
            }
        });

        // Toast close button
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }
    }

    switchSection(sectionName) {
        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionName) {
                item.classList.add('active');
            }
        });

        // Update content sections
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        const titles = {
            'my-tasks': 'My Tasks',
            'calendar': 'Calendar',
            'analytics': 'Analytics',
            'settings': 'Settings'
        };

        if (pageTitle) {
            pageTitle.textContent = titles[sectionName] || 'Dashboard';
        }

        this.currentSection = sectionName;

        // Initialize section-specific functionality
        if (sectionName === 'calendar') {
            this.initializeCalendar();
        } else if (sectionName === 'analytics') {
            this.updateAnalytics();
        }
    }

    // Task Management
    renderTasks() {
        const tasksContainer = document.getElementById('tasksContainer');
        if (!tasksContainer) return;

        let filteredTasks = this.tasks;

        // Apply filter
        if (this.currentFilter !== 'all') {
            filteredTasks = this.tasks.filter(task => task.status === this.currentFilter);
        }

        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <h3>No tasks found</h3>
                    <p>Create your first task to get started!</p>
                </div>
            `;
            return;
        }

        tasksContainer.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.status}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-priority ${task.priority}">
                        <span class="priority-dot"></span>
                        ${task.priority.toUpperCase()}
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn" onclick="taskManager.editTask(${task.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn" onclick="taskManager.deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>
                    <p class="task-description">${task.description}</p>
                    <div class="task-meta">
                        <span class="task-due-date">
                            <i class="fas fa-calendar"></i>
                            Due: ${this.formatDisplayDate(task.dueDate)}
                        </span>
                        <span class="task-status ${task.status}">
                            ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                    </div>
                </div>
                <div class="task-footer">
                    <button class="task-complete-btn ${task.status === 'completed' ? 'completed' : ''}" 
                            onclick="taskManager.toggleTaskStatus(${task.id})">
                        <i class="fas ${task.status === 'completed' ? 'fa-check-circle' : 'fa-circle'}"></i>
                        ${task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    openAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        if (modal) {
            modal.classList.add('show');
            // Set default due date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dueDateInput = document.getElementById('taskDueDate');
            if (dueDateInput) {
                dueDateInput.value = this.formatDate(tomorrow);
            }
        }
    }

    closeAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        const form = document.getElementById('taskForm');
        if (modal) {
            modal.classList.remove('show');
        }
        if (form) {
            form.reset();
        }
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title) {
            this.showToast('Please enter a task title', 'error');
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            description,
            priority,
            status: 'pending',
            dueDate,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateAnalytics();
        this.closeAddTaskModal();
        this.showToast('Task added successfully!', 'success');
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            this.saveTasks();
            this.renderTasks();
            this.updateAnalytics();
            this.showToast(`Task ${task.status === 'completed' ? 'completed' : 'reopened'}!`, 'success');
        }
    }

    editTask(taskId) {
        this.showToast('Edit functionality coming soon!', 'info');
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateAnalytics();
            this.showToast('Task deleted successfully!', 'success');
        }
    }

    handleSearch(query) {
        const tasksContainer = document.getElementById('tasksContainer');
        if (!tasksContainer) return;

        if (!query.trim()) {
            this.renderTasks();
            return;
        }

        const filteredTasks = this.tasks.filter(task => 
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No tasks found</h3>
                    <p>No tasks match your search criteria.</p>
                </div>
            `;
            return;
        }

        tasksContainer.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.status}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-priority ${task.priority}">
                        <span class="priority-dot"></span>
                        ${task.priority.toUpperCase()}
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn" onclick="taskManager.editTask(${task.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn" onclick="taskManager.deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>
                    <p class="task-description">${task.description}</p>
                    <div class="task-meta">
                        <span class="task-due-date">
                            <i class="fas fa-calendar"></i>
                            Due: ${this.formatDisplayDate(task.dueDate)}
                        </span>
                        <span class="task-status ${task.status}">
                            ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                    </div>
                </div>
                <div class="task-footer">
                    <button class="task-complete-btn ${task.status === 'completed' ? 'completed' : ''}" 
                            onclick="taskManager.toggleTaskStatus(${task.id})">
                        <i class="fas ${task.status === 'completed' ? 'fa-check-circle' : 'fa-circle'}"></i>
                        ${task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Calendar functionality
    initializeCalendar() {
        this.renderCalendar();
        this.setupCalendarEvents();
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonth = document.getElementById('currentMonth');
        
        if (!calendarGrid || !currentMonth) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        currentMonth.textContent = this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Clear existing content
        calendarGrid.innerHTML = '';

        // Create calendar header
        const calendarHeader = document.createElement('div');
        calendarHeader.className = 'calendar-header';
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(dayName => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = dayName;
            calendarHeader.appendChild(dayHeader);
        });
        
        calendarGrid.appendChild(calendarHeader);

        // Create calendar body
        const calendarBody = document.createElement('div');
        calendarBody.className = 'calendar-body';

        for (let week = 0; week < 6; week++) {
            const weekRow = document.createElement('div');
            weekRow.className = 'calendar-week';

            for (let day = 0; day < 7; day++) {
                const currentDay = new Date(startDate);
                currentDay.setDate(startDate.getDate() + (week * 7) + day);
                
                const isCurrentMonth = currentDay.getMonth() === month;
                const isToday = this.isToday(currentDay);
                const tasksForDay = this.getTasksForDate(currentDay);
                const hasTasks = tasksForDay.length > 0;
                
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.dataset.date = this.formatDate(currentDay);
                
                if (!isCurrentMonth) dayElement.classList.add('other-month');
                if (isToday) dayElement.classList.add('today');
                if (hasTasks) dayElement.classList.add('has-tasks');

                // Day number
                const dayNumber = document.createElement('span');
                dayNumber.className = 'day-number';
                dayNumber.textContent = currentDay.getDate();
                dayElement.appendChild(dayNumber);

                // Task indicators
                if (hasTasks) {
                    const taskContainer = document.createElement('div');
                    taskContainer.className = 'task-indicators';
                    
                    // Show up to 3 task indicators
                    const visibleTasks = tasksForDay.slice(0, 3);
                    visibleTasks.forEach(task => {
                        const indicator = document.createElement('div');
                        indicator.className = `task-dot ${task.priority}`;
                        indicator.title = task.title;
                        taskContainer.appendChild(indicator);
                    });

                    // Show count if more than 3 tasks
                    if (tasksForDay.length > 3) {
                        const moreIndicator = document.createElement('div');
                        moreIndicator.className = 'task-more';
                        moreIndicator.textContent = `+${tasksForDay.length - 3}`;
                        taskContainer.appendChild(moreIndicator);
                    }

                    dayElement.appendChild(taskContainer);
                }

                weekRow.appendChild(dayElement);
            }
            
            calendarBody.appendChild(weekRow);
        }

        calendarGrid.appendChild(calendarBody);
    }

    setupCalendarEvents() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        calendarGrid.addEventListener('click', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (dayElement && !dayElement.classList.contains('other-month')) {
                const date = dayElement.dataset.date;
                this.showDayTasks(date);
            }
        });
    }

    showDayTasks(date) {
        const tasks = this.getTasksForDate(new Date(date));
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        if (tasks.length === 0) {
            this.showToast(`No tasks scheduled for ${formattedDate}`, 'info');
            return;
        }

        // Create a simple modal or tooltip showing tasks for the day
        const taskList = tasks.map(task => 
            `<div class="day-task-item ${task.priority}">
                <span class="task-title">${task.title}</span>
                <span class="task-status ${task.status}">${task.status}</span>
            </div>`
        ).join('');

        // For now, show in a toast - could be enhanced with a proper modal
        this.showToast(`Tasks for ${formattedDate}:\n${tasks.map(t => `• ${t.title}`).join('\n')}`, 'info');
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    getTasksForDate(date) {
        const dateString = this.formatDate(date);
        return this.tasks.filter(task => task.dueDate === dateString);
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // Analytics functionality
    updateAnalytics() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        const pendingTasks = this.tasks.filter(t => t.status === 'pending').length;
        const overdueTasks = this.tasks.filter(t => t.status === 'overdue').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Update analytics cards
        this.animateNumber('totalTasks', totalTasks);
        this.animateNumber('completedTasks', completedTasks);
        this.animateNumber('pendingTasks', pendingTasks);
        this.animateNumber('completionRate', completionRate, '%');

        // Update progress bars
        this.updateProgressBar('completedProgress', 'completedPercentage', completedTasks, totalTasks);
        this.updateProgressBar('pendingProgress', 'pendingPercentage', pendingTasks, totalTasks);
        this.updateProgressBar('overdueProgress', 'overduePercentage', overdueTasks, totalTasks);
    }

    animateNumber(elementId, targetValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);

            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateProgressBar(progressId, percentageId, value, total) {
        const progressBar = document.getElementById(progressId);
        const percentageElement = document.getElementById(percentageId);
        
        if (!progressBar || !percentageElement) return;

        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
        
        setTimeout(() => {
            progressBar.style.width = percentage + '%';
            percentageElement.textContent = percentage + '%';
        }, 100);
    }

    // Notifications
    clearNotifications() {
        const notificationList = document.getElementById('notificationList');
        const notificationBadge = document.getElementById('notificationBadge');
        
        if (notificationList) {
            notificationList.innerHTML = '<div class="no-notifications">No new notifications</div>';
        }
        
        if (notificationBadge) {
            notificationBadge.style.display = 'none';
        }
        
        this.showToast('Notifications cleared', 'success');
    }

    // Settings
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        this.showToast(`${isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'success');
    }

    // Logout functionality
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentSession');
            this.showToast('Logging out...', 'info');
            
            setTimeout(() => {
                window.location.href = 'task3.html';
            }, 1000);
        }
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toastIcon.className = `toast-icon ${icons[type]}`;
        toastMessage.textContent = message;
        
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            this.hideToast();
        }, 4000);
    }

    hideToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('show');
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showToast(`Welcome back, ${this.currentUser.fullName.split(' ')[0]}!`, 'success');
        }, 1000);
    }

    // Utility functions
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    formatDisplayDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Initialize the task manager when DOM is loaded
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
    
    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && taskManager) {
        taskManager.updateAnalytics();
    }
});

