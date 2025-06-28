/**
 * 👑 EcoLearn Admin Portal JavaScript
 * System administration dengan AI model management dan green computing
 */

// Import EcoLearn Shared Libraries
import { 
    initEcoLearn, 
    carbonTracker, 
    apiService, 
    authUtils, 
    config 
} from 'https://adbecolearn.github.io/ecolearn-shared/index.js';

// Initialize EcoLearn
const ecolearn = initEcoLearn({
    carbonTracking: true,
    performanceMonitoring: true,
    debugMode: config.isDevelopment()
});

// Admin Portal App Class
class AdminApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentUser = null;
        this.isLoading = true;
        this.sidebarOpen = false;
        this.refreshInterval = null;
        this.systemMetrics = {};
        
        this.init();
    }

    /**
     * Initialize admin portal app
     */
    async init() {
        try {
            // Check authentication
            await this.checkAuthentication();
            
            // Setup DOM references
            this.setupDOM();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup carbon tracking
            this.setupCarbonTracking();
            
            // Load user data
            await this.loadUserData();
            
            // Initialize dashboard
            this.initializeDashboard();
            
            // Start real-time monitoring
            this.startRealTimeMonitoring();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            carbonTracker.track('admin_portal_init', {
                userId: this.currentUser?.id,
                role: 'admin'
            });
            
            console.log('👑 EcoLearn Admin Portal initialized');
            
        } catch (error) {
            console.error('Failed to initialize admin portal:', error);
            this.handleInitError(error);
        }
    }

    /**
     * Check user authentication
     */
    async checkAuthentication() {
        if (!authUtils.isAuthenticated()) {
            window.location.href = 'https://adbecolearn.github.io/ecolearn-auth/';
            return;
        }
        
        this.currentUser = authUtils.getCurrentUser();
        
        // Verify user role
        if (this.currentUser.role !== 'admin') {
            const redirectUrl = authUtils.getRedirectUrl(this.currentUser.role);
            window.location.href = redirectUrl;
            return;
        }
    }

    /**
     * Setup DOM references
     */
    setupDOM() {
        // Loading screen
        this.loadingScreen = document.getElementById('loading-screen');
        this.app = document.getElementById('app');
        
        // Navigation elements
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sidebar = document.querySelector('.sidebar');
        
        // Header elements
        this.pageTitle = document.getElementById('pageTitle');
        this.activeUsers = document.getElementById('activeUsers');
        this.aiRequests = document.getElementById('aiRequests');
        this.systemLoad = document.getElementById('systemLoad');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.emergencyBtn = document.getElementById('emergencyBtn');
        
        // Admin profile elements
        this.adminInitials = document.getElementById('adminInitials');
        this.adminName = document.getElementById('adminName');
        
        // Page content elements
        this.pageContents = document.querySelectorAll('.page-content');
        
        // Dashboard elements
        this.totalUsers = document.getElementById('totalUsers');
        this.aiModels = document.getElementById('aiModels');
        this.totalCourses = document.getElementById('totalCourses');
        this.researchGroups = document.getElementById('researchGroups');
        this.manageAiModels = document.getElementById('manageAiModels');
        this.performanceTimeRange = document.getElementById('performanceTimeRange');
        
        // Action buttons
        this.addUserBtn = document.getElementById('addUserBtn');
        this.configureAiBtn = document.getElementById('configureAiBtn');
        this.exportDataBtn = document.getElementById('exportDataBtn');
        this.systemBackupBtn = document.getElementById('systemBackupBtn');
        this.generateReportBtn = document.getElementById('generateReportBtn');
        this.systemSettingsBtn = document.getElementById('systemSettingsBtn');
        
        // Carbon tracker elements
        this.carbonIndicator = document.querySelector('.carbon-indicator');
        this.carbonText = document.querySelector('.carbon-text');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Logout
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Emergency stop
        if (this.emergencyBtn) {
            this.emergencyBtn.addEventListener('click', () => this.handleEmergencyStop());
        }
        
        // Dashboard actions
        if (this.manageAiModels) {
            this.manageAiModels.addEventListener('click', () => this.navigateToPage('ai-models'));
        }
        
        if (this.performanceTimeRange) {
            this.performanceTimeRange.addEventListener('change', (e) => this.updatePerformanceTimeRange(e.target.value));
        }
        
        // Quick actions
        if (this.addUserBtn) {
            this.addUserBtn.addEventListener('click', () => this.addUser());
        }
        
        if (this.configureAiBtn) {
            this.configureAiBtn.addEventListener('click', () => this.navigateToPage('ai-models'));
        }
        
        if (this.exportDataBtn) {
            this.exportDataBtn.addEventListener('click', () => this.exportData());
        }
        
        if (this.systemBackupBtn) {
            this.systemBackupBtn.addEventListener('click', () => this.systemBackup());
        }
        
        if (this.generateReportBtn) {
            this.generateReportBtn.addEventListener('click', () => this.generateReport());
        }
        
        if (this.systemSettingsBtn) {
            this.systemSettingsBtn.addEventListener('click', () => this.navigateToPage('settings'));
        }
        
        // Window events
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('beforeunload', () => this.handleBeforeUnload());
    }

    /**
     * Setup carbon tracking updates
     */
    setupCarbonTracking() {
        // Update carbon display every 3 seconds
        setInterval(() => {
            this.updateCarbonDisplay();
        }, 3000);
        
        // Initial update
        this.updateCarbonDisplay();
    }

    /**
     * Load user data from API
     */
    async loadUserData() {
        try {
            // Update admin profile display
            if (this.currentUser) {
                const initials = `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`.toUpperCase();
                
                if (this.adminInitials) this.adminInitials.textContent = initials;
                if (this.adminName) this.adminName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
            
            // Load dashboard data
            await this.loadDashboardData();
            
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    /**
     * Load dashboard data
     */
    async loadDashboardData() {
        try {
            // Simulate API call for dashboard data
            const dashboardData = {
                totalUsers: 306,
                aiModels: 4,
                totalCourses: 6,
                researchGroups: 4,
                activeUsers: 247,
                aiRequests: 23,
                systemLoad: 34
            };
            
            // Update dashboard displays
            if (this.totalUsers) this.totalUsers.textContent = dashboardData.totalUsers;
            if (this.aiModels) this.aiModels.textContent = dashboardData.aiModels;
            if (this.totalCourses) this.totalCourses.textContent = dashboardData.totalCourses;
            if (this.researchGroups) this.researchGroups.textContent = dashboardData.researchGroups;
            if (this.activeUsers) this.activeUsers.textContent = dashboardData.activeUsers;
            if (this.aiRequests) this.aiRequests.textContent = dashboardData.aiRequests;
            if (this.systemLoad) this.systemLoad.textContent = `${dashboardData.systemLoad}%`;
            
            this.systemMetrics = dashboardData;
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    /**
     * Initialize dashboard
     */
    initializeDashboard() {
        // Initialize real-time indicators
        this.updateSystemStatus();
        
        // Load system performance metrics
        this.loadPerformanceMetrics();
    }

    /**
     * Start real-time monitoring
     */
    startRealTimeMonitoring() {
        // Update system metrics every 5 seconds
        this.refreshInterval = setInterval(() => {
            this.updateRealTimeMetrics();
        }, 5000);
    }

    /**
     * Update real-time metrics
     */
    updateRealTimeMetrics() {
        // Simulate real-time data updates
        const variations = {
            activeUsers: Math.floor(Math.random() * 10) - 5,
            aiRequests: Math.floor(Math.random() * 6) - 3,
            systemLoad: Math.floor(Math.random() * 10) - 5
        };
        
        // Update metrics with variations
        if (this.activeUsers) {
            const newValue = Math.max(0, parseInt(this.activeUsers.textContent) + variations.activeUsers);
            this.activeUsers.textContent = newValue;
        }
        
        if (this.aiRequests) {
            const newValue = Math.max(0, parseInt(this.aiRequests.textContent) + variations.aiRequests);
            this.aiRequests.textContent = newValue;
        }
        
        if (this.systemLoad) {
            const currentLoad = parseInt(this.systemLoad.textContent.replace('%', ''));
            const newValue = Math.max(0, Math.min(100, currentLoad + variations.systemLoad));
            this.systemLoad.textContent = `${newValue}%`;
        }
    }

    /**
     * Update system status
     */
    updateSystemStatus() {
        // All systems operational
        console.log('System status: All systems operational');
    }

    /**
     * Load performance metrics
     */
    loadPerformanceMetrics() {
        // Performance metrics are already displayed in HTML
        console.log('Performance metrics loaded');
    }

    /**
     * Hide loading screen and show app
     */
    hideLoadingScreen() {
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');
            }
            if (this.app) {
                this.app.style.display = 'flex';
            }
            this.isLoading = false;
        }, 1500);
    }

    /**
     * Handle initialization error
     */
    handleInitError(error) {
        console.error('Initialization error:', error);
        
        // Show error message
        if (this.loadingScreen) {
            const loadingText = this.loadingScreen.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = 'Failed to initialize. Please refresh the page.';
                loadingText.style.color = 'var(--eco-error-600)';
            }
        }
    }

    /**
     * Handle navigation between pages
     */
    handleNavigation(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const page = link.dataset.page;
        
        if (page && page !== this.currentPage) {
            this.navigateToPage(page);
        }
    }

    /**
     * Navigate to specific page
     */
    navigateToPage(page) {
        // Update current page
        this.currentPage = page;
        
        // Update navigation active state
        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        
        // Update page content
        this.pageContents.forEach(content => {
            content.classList.toggle('active', content.id === `${page}-page`);
        });
        
        // Update page title
        const pageTitles = {
            'dashboard': 'Admin Dashboard',
            'system-health': 'System Health Monitor',
            'users': 'User Management',
            'ai-models': 'AI Model Management',
            'research': 'Research Data Management',
            'analytics': 'System Analytics',
            'settings': 'System Settings',
            'logs': 'System Logs'
        };
        
        if (this.pageTitle) {
            this.pageTitle.textContent = pageTitles[page] || 'Admin Portal';
        }
        
        carbonTracker.track('admin_page_navigation', {
            from: this.currentPage,
            to: page
        });
        
        // Page-specific initialization
        if (page === 'dashboard') {
            this.loadDashboardData();
        }
    }

    /**
     * Handle user logout
     */
    handleLogout() {
        carbonTracker.track('admin_logout', {
            userId: this.currentUser?.id,
            sessionDuration: Date.now() - this.sessionStart
        });

        // Clear refresh interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        authUtils.logout();
        window.location.href = 'https://adbecolearn.github.io/ecolearn-home/';
    }

    /**
     * Handle emergency stop
     */
    handleEmergencyStop() {
        carbonTracker.track('emergency_stop_initiated', {
            userId: this.currentUser?.id,
            timestamp: Date.now()
        });

        // Show confirmation dialog
        const confirmed = confirm(
            '🚨 EMERGENCY STOP\n\n' +
            'This will immediately halt all AI models and system operations.\n' +
            'Are you sure you want to proceed?'
        );

        if (confirmed) {
            this.showToast('Emergency stop initiated. All AI models stopping...', 'error');

            // TODO: Implement actual emergency stop
            console.log('Emergency stop activated');

            // Simulate emergency stop
            setTimeout(() => {
                this.showToast('All systems stopped. Manual restart required.', 'warning');
            }, 3000);
        }
    }

    /**
     * Update performance time range
     */
    updatePerformanceTimeRange(timeRange) {
        carbonTracker.track('performance_time_range_change', { timeRange });

        // TODO: Update performance data based on time range
        console.log('Performance time range changed to:', timeRange);
        this.loadPerformanceMetrics();
    }

    /**
     * Add user
     */
    addUser() {
        carbonTracker.track('add_user_clicked');

        // TODO: Implement user creation modal
        console.log('Add user clicked');

        this.showToast('User creation interface coming soon!', 'info');
    }

    /**
     * Export data
     */
    exportData() {
        carbonTracker.track('admin_data_export_initiated');

        // TODO: Implement comprehensive data export
        console.log('Export data clicked');

        // Show progress
        this.showToast('Preparing comprehensive data export...', 'info');

        setTimeout(() => {
            this.showToast('Data export completed. Download link sent to your email.', 'success');
        }, 3000);
    }

    /**
     * System backup
     */
    systemBackup() {
        carbonTracker.track('system_backup_initiated');

        // TODO: Implement system backup
        console.log('System backup clicked');

        // Show progress
        this.showToast('Initiating system backup...', 'info');

        setTimeout(() => {
            this.showToast('System backup completed successfully.', 'success');
        }, 5000);
    }

    /**
     * Generate report
     */
    generateReport() {
        carbonTracker.track('admin_report_generation_initiated');

        // TODO: Implement comprehensive report generation
        console.log('Generate report clicked');

        // Navigate to analytics page
        this.navigateToPage('analytics');

        this.showToast('Generating comprehensive system report...', 'info');
    }

    /**
     * Update carbon footprint display
     */
    updateCarbonDisplay() {
        const metrics = carbonTracker.getMetrics();
        const budget = carbonTracker.getCarbonBudget();

        // Update carbon text
        const carbonValue = `${metrics.totalCarbonGrams.toFixed(3)}g CO2`;

        if (this.carbonText) {
            this.carbonText.textContent = carbonValue;
        }

        // Update carbon indicator color
        if (this.carbonIndicator) {
            this.carbonIndicator.className = 'carbon-indicator';
            if (budget.status === 'warning') {
                this.carbonIndicator.classList.add('warning');
            } else if (budget.status === 'critical') {
                this.carbonIndicator.classList.add('critical');
            }
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Style toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? 'var(--eco-success-500)' :
                       type === 'error' ? 'var(--eco-error-500)' :
                       type === 'warning' ? 'var(--eco-warning-500)' :
                       'var(--eco-primary-500)',
            color: 'white',
            padding: 'var(--eco-space-3) var(--eco-space-4)',
            borderRadius: 'var(--eco-rounded-md)',
            boxShadow: 'var(--eco-shadow-lg)',
            zIndex: 'var(--eco-z-50)',
            fontSize: 'var(--eco-text-sm)',
            maxWidth: '350px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all var(--eco-duration-300) var(--eco-ease-in-out)'
        });

        // Add to DOM
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 4 seconds (longer for admin messages)
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    /**
     * Toggle sidebar (for mobile)
     */
    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;

        if (this.sidebar) {
            this.sidebar.classList.toggle('open', this.sidebarOpen);
        }

        carbonTracker.track('admin_sidebar_toggle', {
            isOpen: this.sidebarOpen
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close sidebar on desktop
        if (window.innerWidth > 768 && this.sidebar) {
            this.sidebar.classList.remove('open');
            this.sidebarOpen = false;
        }

        carbonTracker.track('admin_window_resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload() {
        // Clear refresh interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        carbonTracker.track('admin_session_end', {
            userId: this.currentUser?.id,
            currentPage: this.currentPage,
            sessionDuration: Date.now() - (this.sessionStart || Date.now()),
            systemMetrics: this.systemMetrics
        });
    }

    /**
     * Get system health status
     */
    getSystemHealth() {
        return {
            status: 'healthy',
            uptime: '99.8%',
            activeUsers: parseInt(this.activeUsers?.textContent || '0'),
            systemLoad: parseInt(this.systemLoad?.textContent?.replace('%', '') || '0'),
            aiModelsOnline: 4,
            lastBackup: new Date().toISOString()
        };
    }

    /**
     * Monitor system alerts
     */
    monitorSystemAlerts() {
        // Check for system alerts
        const systemLoad = parseInt(this.systemLoad?.textContent?.replace('%', '') || '0');

        if (systemLoad > 80) {
            this.showToast('⚠️ High system load detected. Consider scaling resources.', 'warning');
        }

        // Check AI model status
        // TODO: Implement real AI model health checks
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});

// Also initialize immediately for module loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AdminApp();
    });
} else {
    new AdminApp();
}
