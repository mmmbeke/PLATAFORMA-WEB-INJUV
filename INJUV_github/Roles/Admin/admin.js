// Panel de Administración - INJUV
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Configurar navegación del sidebar
    setupSidebarNavigation();
    
    // Configurar modales
    setupModals();
    
    // Configurar formularios
    setupForms();
    
    // Configurar acciones de botones
    setupButtonActions();
    
    // Cargar datos iniciales
    loadInitialData();
}

// Navegación del Sidebar
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const currentSectionSpan = document.getElementById('current-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remover clase active de todos los elementos
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Agregar clase active al elemento seleccionado
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            // Actualizar breadcrumb
            currentSectionSpan.textContent = this.querySelector('span').textContent;
            
            // Cargar datos específicos de la sección
            loadSectionData(targetSection);
        });
    });
}

// Configuración de Modales
function setupModals() {
    // Cerrar modales al hacer clic en el botón de cerrar
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Cerrar modales al hacer clic fuera del contenido
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Cerrar modales con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

// Configuración de Formularios
function setupForms() {
    const forms = document.querySelectorAll('.modal-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

// Configuración de Acciones de Botones
function setupButtonActions() {
    // Botones de acción en tablas
    setupTableActions();
    
    // Botones de acción en tarjetas
    setupCardActions();
    
    // Botones de reportes
    setupReportButtons();
    
    // Botones de configuración de plataforma
    setupPlatformButtons();
}

// Configurar acciones de tablas
function setupTableActions() {
    // Botones de editar
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-icon[title="Editar"]')) {
            const row = e.target.closest('tr');
            const userData = extractUserDataFromRow(row);
            showEditUserModal(userData);
        }
        
        // Botones de eliminar
        if (e.target.closest('.btn-icon[title="Eliminar"]')) {
            const row = e.target.closest('tr');
            const userData = extractUserDataFromRow(row);
            if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                deleteUser(userData);
            }
        }
    });
}

// Configurar acciones de tarjetas
function setupCardActions() {
    // Botones de aprobar/rechazar noticias
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-success') && e.target.textContent === 'Aprobar') {
            const card = e.target.closest('.news-card, .opportunity-card, .document-card');
            approveItem(card);
        }
        
        if (e.target.classList.contains('btn-danger') && e.target.textContent === 'Rechazar') {
            const card = e.target.closest('.news-card, .opportunity-card, .document-card');
            rejectItem(card);
        }
        
        if (e.target.classList.contains('btn-danger') && e.target.textContent === 'Eliminar') {
            const card = e.target.closest('.news-card, .opportunity-card, .document-card');
            if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
                deleteItem(card);
            }
        }
    });
}

// Configurar botones de reportes
function setupReportButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Generar Reporte') {
            const reportCard = e.target.closest('.report-card');
            generateReport(reportCard);
        }
    });
}

// Configurar botones de plataforma
function setupPlatformButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Guardar Cambios') {
            savePlatformSettings();
        }
    });
}

// Funciones de Modal
function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function showEditUserModal(userData) {
    // Llenar el modal con los datos del usuario
    const modal = document.getElementById('addUserModal');
    const form = modal.querySelector('.modal-form');
    
    // Cambiar título del modal
    modal.querySelector('.modal-header h3').textContent = 'Editar Usuario';
    
    // Llenar campos del formulario
    form.querySelector('input[type="text"]').value = userData.username || '';
    form.querySelector('input[type="email"]').value = userData.email || '';
    form.querySelector('input[type="tel"]').value = userData.phone || '';
    form.querySelector('select').value = userData.role || '';
    
    // Cambiar texto del botón
    form.querySelector('button[type="submit"]').textContent = 'Actualizar Usuario';
    
    // Mostrar modal
    modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // Resetear formulario si existe
        const form = modal.querySelector('.modal-form');
        if (form) {
            form.reset();
            modal.querySelector('.modal-header h3').textContent = 'Agregar Nuevo Usuario';
            form.querySelector('button[type="submit"]').textContent = 'Guardar Usuario';
        }
    }
}

// Manejo de Formularios
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const userData = {
        username: formData.get('username') || form.querySelector('input[type="text"]').value,
        password: formData.get('password') || form.querySelector('input[type="password"]').value,
        organization: formData.get('organization') || form.querySelector('input[placeholder*="Organización"]').value,
        email: formData.get('email') || form.querySelector('input[type="email"]').value,
        phone: formData.get('phone') || form.querySelector('input[type="tel"]').value,
        role: formData.get('role') || form.querySelector('select').value
    };
    
    // Validar datos
    if (validateUserData(userData)) {
        // Simular envío de datos
        saveUser(userData);
        
        // Cerrar modal
        const modal = form.closest('.modal');
        closeModal(modal.id);
        
        // Recargar datos de usuarios
        loadSectionData('users');
        
        // Mostrar mensaje de éxito
        showNotification('Usuario guardado exitosamente', 'success');
    }
}

// Validación de Datos
function validateUserData(userData) {
    if (!userData.username || userData.username.trim().length < 3) {
        showNotification('El nombre de usuario debe tener al menos 3 caracteres', 'error');
        return false;
    }
    
    if (!userData.password || userData.password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    
    if (!userData.organization || userData.organization.trim().length < 2) {
        showNotification('El nombre de la organización es requerido', 'error');
        return false;
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
        showNotification('Ingrese un correo electrónico válido', 'error');
        return false;
    }
    
    if (!userData.phone || userData.phone.trim().length < 8) {
        showNotification('Ingrese un número de teléfono válido', 'error');
        return false;
    }
    
    if (!userData.role) {
        showNotification('Seleccione un rol para el usuario', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Funciones de Datos
function loadInitialData() {
    // Cargar estadísticas del dashboard
    loadDashboardStats();
    
    // Cargar datos de usuarios
    loadUsersData();
    
    // Cargar datos de noticias
    loadNewsData();
    
    // Cargar datos de oportunidades
    loadOpportunitiesData();
    
    // Cargar datos del repositorio
    loadRepositoryData();
}

function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'reports':
            // Los reportes se generan bajo demanda
            break;
        case 'platform':
            loadPlatformSettings();
            break;
        case 'news':
            loadNewsData();
            break;
        case 'opportunities':
            loadOpportunitiesData();
            break;
        case 'repository':
            loadRepositoryData();
            break;
    }
}

// Cargar estadísticas del dashboard
function loadDashboardStats() {
    // Simular carga de datos desde API
    const stats = [
        { id: 'users', value: '1,247', label: 'Usuarios Activos' },
        { id: 'opportunities', value: '89', label: 'Oportunidades Activas' },
        { id: 'news', value: '156', label: 'Noticias Publicadas' },
        { id: 'documents', value: '234', label: 'Documentos en Repositorio' }
    ];
    
    stats.forEach(stat => {
        const statElement = document.querySelector(`#${stat.id}`);
        if (statElement) {
            statElement.querySelector('h3').textContent = stat.value;
        }
    });
}

// Cargar datos de usuarios
function loadUsersData() {
    // Simular carga de datos desde API
    console.log('Cargando datos de usuarios...');
}

// Cargar datos de noticias
function loadNewsData() {
    // Simular carga de datos desde API
    console.log('Cargando datos de noticias...');
}

// Cargar datos de oportunidades
function loadOpportunitiesData() {
    // Simular carga de datos desde API
    console.log('Cargando datos de oportunidades...');
}

// Cargar datos del repositorio
function loadRepositoryData() {
    // Simular carga de datos desde API
    console.log('Cargando datos del repositorio...');
}

// Cargar configuración de la plataforma
function loadPlatformSettings() {
    // Simular carga de configuración desde API
    console.log('Cargando configuración de la plataforma...');
}

// Funciones de Acción
function saveUser(userData) {
    // Simular guardado en API
    console.log('Guardando usuario:', userData);
    
    // Aquí se haría la llamada real a la API
    // fetch('/api/users', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(userData)
    // });
}

function deleteUser(userData) {
    // Simular eliminación en API
    console.log('Eliminando usuario:', userData);
    
    // Remover fila de la tabla
    const row = document.querySelector(`tr[data-username="${userData.username}"]`);
    if (row) {
        row.remove();
        showNotification('Usuario eliminado exitosamente', 'success');
    }
}

function approveItem(card) {
    // Simular aprobación en API
    console.log('Aprobando elemento:', card);
    
    // Cambiar estado visual
    const statusElement = card.querySelector('.status');
    if (statusElement) {
        statusElement.textContent = 'Aprobado';
        statusElement.className = 'status approved';
        card.classList.remove('pending');
        card.classList.add('approved');
    }
    
    showNotification('Elemento aprobado exitosamente', 'success');
}

function rejectItem(card) {
    // Simular rechazo en API
    console.log('Rechazando elemento:', card);
    
    // Cambiar estado visual
    const statusElement = card.querySelector('.status');
    if (statusElement) {
        statusElement.textContent = 'Rechazado';
        statusElement.className = 'status rejected';
        card.classList.remove('pending');
        card.classList.add('rejected');
    }
    
    showNotification('Elemento rechazado exitosamente', 'success');
}

function deleteItem(card) {
    // Simular eliminación en API
    console.log('Eliminando elemento:', card);
    
    // Remover tarjeta
    card.remove();
    showNotification('Elemento eliminado exitosamente', 'success');
}

function generateReport(reportCard) {
    // Simular generación de reporte
    const reportType = reportCard.querySelector('h3').textContent;
    console.log('Generando reporte:', reportType);
    
    // Mostrar indicador de carga
    const button = reportCard.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Generando...';
    button.disabled = true;
    
    // Simular proceso de generación
    setTimeout(() => {
        button.textContent = 'Descargar Reporte';
        button.disabled = false;
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        
        showNotification('Reporte generado exitosamente', 'success');
    }, 2000);
}

function savePlatformSettings() {
    // Simular guardado de configuración
    console.log('Guardando configuración de la plataforma...');
    
    // Mostrar indicador de carga
    const button = document.querySelector('#platform .btn-primary');
    const originalText = button.textContent;
    button.textContent = 'Guardando...';
    button.disabled = true;
    
    // Simular proceso de guardado
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        showNotification('Configuración guardada exitosamente', 'success');
    }, 1500);
}

// Funciones de Utilidad
function extractUserDataFromRow(row) {
    const cells = row.querySelectorAll('td');
    return {
        username: cells[0]?.textContent || '',
        organization: cells[1]?.textContent || '',
        email: cells[2]?.textContent || '',
        phone: cells[3]?.textContent || '',
        role: cells[4]?.querySelector('.role')?.textContent || '',
        status: cells[5]?.querySelector('.status')?.textContent || ''
    };
}

function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Configurar botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Agregar estilos CSS para las notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Exportar funciones para uso global
window.showAddUserModal = showAddUserModal;
window.closeModal = closeModal; 