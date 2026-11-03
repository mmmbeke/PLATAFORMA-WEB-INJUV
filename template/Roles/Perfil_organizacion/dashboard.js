// ====================== Dashboard Organización - JavaScript ======================

const API_BASE_URL = 'https://injuv.onrender.com/api';

/** Coincide con backend: null/undefined = pública por defecto */
function reseñaEsPublicaParaMostrar(val) {
    if (val === false || val === 0 || val === '0' || val === 'false' || val === 'FALSE') return false;
    if (val === true || val === 1 || val === '1' || val === 'true' || val === 'TRUE') return true;
    if (val === null || val === undefined) return true;
    return Boolean(val);
}

// Variables globales
let organizacionId = null;
let userId = null;
let organizacionData = null;
let oportunidadesData = [];
let postulacionesData = [];
let seguimientoData = [];
let currentPageHistorial = 1;
let currentPagePostulaciones = 1;
const itemsPerPage = 10;

// Declarar funciones globales para crear oportunidad (se definirán más adelante)
window.mostrarModalCrearOportunidad = null;
window.cerrarModalCrearOportunidad = null;

// Evitar que el botón Academia provoque redirección: mousedown y click en fase captura
function isClickOnBtnSubirDoc(e) {
    var btn = document.getElementById('btnSubirDocumentoEducativo');
    return btn && (e.target === btn || btn.contains(e.target));
}
function isClickOnBtnSubirDocBiblioteca(e) {
    var btn = document.getElementById('btnSubirDocumentoBiblioteca');
    return btn && (e.target === btn || btn.contains(e.target));
}
document.addEventListener('mousedown', function(e) {
    if (isClickOnBtnSubirDoc(e) || isClickOnBtnSubirDocBiblioteca(e)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
}, true);
document.addEventListener('click', function(e) {
    if (isClickOnBtnSubirDoc(e)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (typeof window.mostrarModalSubirDocumentoEducativo === 'function') {
            window.mostrarModalSubirDocumentoEducativo();
        }
        return false;
    }
    if (isClickOnBtnSubirDocBiblioteca(e)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (typeof window.mostrarModalSubirDocumentoBiblioteca === 'function') {
            window.mostrarModalSubirDocumentoBiblioteca();
        }
        return false;
    }
}, true);

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando dashboard...');
    
    try {
        // Cargar header
        loadHeader();
        
        // Configurar navegación
        setupNavigation();
        
        // Inicializar dashboard
        console.log('Llamando a initializeDashboard...');
        initializeDashboard();
        
        console.log('Inicialización completa');
    } catch (error) {
        console.error('Error en la inicialización:', error);
        alert('Error al inicializar el dashboard: ' + error.message);
    }
});

// También intentar inicializar si el DOM ya está cargado
if (document.readyState === 'loading') {
    // El DOM todavía se está cargando
    console.log('DOM en estado loading');
} else {
    // El DOM ya está cargado
    console.log('DOM ya estaba cargado, iniciando inmediatamente...');
    setTimeout(() => {
        loadHeader();
        setupNavigation();
        initializeDashboard();
    }, 100);
}

// Cargar header
async function loadHeader() {
    try {
        console.log('Cargando header...');
        
        // Intentar múltiples rutas posibles
        const possiblePaths = [
            '../../header.html',
            '../header.html',
            '/template/header.html',
            'header.html'
        ];
        
        let headerLoaded = false;
        let lastError = null;
        
        for (const path of possiblePaths) {
            try {
                console.log(`Intentando cargar header desde: ${path}`);
                const response = await fetch(path);
                
                if (response.ok) {
                    const data = await response.text();
                    await insertHeader(data);
                    headerLoaded = true;
                    console.log(`✓ Header cargado exitosamente desde: ${path}`);
                    break;
                } else {
                    console.warn(`✗ Error ${response.status} al cargar desde ${path}`);
                }
            } catch (error) {
                console.warn(`✗ Error al cargar desde ${path}:`, error.message);
                lastError = error;
            }
        }
        
        if (!headerLoaded) {
            console.error('No se pudo cargar el header desde ninguna ruta. Creando header básico...');
            createBasicHeader();
        }
    } catch (error) {
        console.error('Error cargando header:', error);
        createBasicHeader();
    }
}

// Crear header básico si no se puede cargar el archivo
function createBasicHeader() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) {
        console.error('No se encontró el contenedor del header');
        return;
    }
    
    const loggedUser = localStorage.getItem('loggedUser');
    let userRol = localStorage.getItem('userRol');
    let userName = 'Usuario';
    
    if (loggedUser) {
        try {
            const userData = JSON.parse(loggedUser);
            userRol = userData.rol || userRol;
            userName = userData.nombre || userData.email || userName;
        } catch (e) {
            console.error('Error parseando loggedUser:', e);
        }
    }
    
    headerContainer.innerHTML = `
        <header class="header" style="position: fixed; top: 0; left: 0; width: 100%; background: rgba(255,255,255,0.97); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.08); z-index: 1000; padding: 1rem 0;">
            <div style="max-width: 1400px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between;">
                <div class="logo">
                    <a href="../../index.html" style="text-decoration: none;">
                        <img src="../../Kit_Gobierno/Logo_INJUV.png" alt="INJUV" style="height: 60px;">
                    </a>
                </div>
                <nav style="flex: 1; display: flex; justify-content: center; gap: 1rem;">
                    <a href="../../index.html" style="padding: 0.5rem 1rem; color: #333; text-decoration: none; font-weight: 500;">Inicio</a>
                    <a href="../../index.html#how-it-works" style="padding: 0.5rem 1rem; color: #333; text-decoration: none; font-weight: 500;">Cómo funciona</a>
                    <a href="../../index.html#news" style="padding: 0.5rem 1rem; color: #333; text-decoration: none; font-weight: 500;">Noticias</a>
                </nav>
                <div style="position: relative;">
                    <button id="profileBtn" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #f8f9fa; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                        <i class="fas fa-user"></i> ${userName}
                    </button>
                    <div id="profileDropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 8px; min-width: 200px; padding: 0.5rem 0;">
                        <a href="../Perfil_usuario/index.html" style="display: block; padding: 0.75rem 1rem; color: #333; text-decoration: none;">Mi perfil</a>
                        ${userRol === 'organizacion' ? '<a href="dashboard.html" style="display: block; padding: 0.75rem 1rem; color: #333; text-decoration: none;">Mi panel</a>' : ''}
                        <button onclick="localStorage.clear(); sessionStorage.clear(); if (typeof window.redirectTo === 'function') { window.redirectTo('../../inicio de sesion/login.html'); } else { window.location.href='../../inicio de sesion/login.html'; }" style="width: 100%; text-align: left; padding: 0.75rem 1rem; background: none; border: none; color: #dc2626; cursor: pointer;">Cerrar sesión</button>
                    </div>
                </div>
            </div>
        </header>
    `;
    
    // Agregar funcionalidad al dropdown
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        document.addEventListener('click', () => {
            profileDropdown.style.display = 'none';
        });
    }
    
    console.log('Header básico creado');
}

async function insertHeader(htmlContent) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const headerContent = doc.querySelector('header');
        const styles = doc.querySelector('style');
        const scripts = doc.querySelectorAll('script');
        
        if (styles) {
            const styleElement = document.createElement('style');
            styleElement.textContent = styles.textContent;
            document.head.appendChild(styleElement);
        }
        
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            console.error('No se encontró el contenedor del header');
            return;
        }
        
        if (headerContent) {
            headerContainer.innerHTML = headerContent.outerHTML;
        } else {
            // Si no hay header, intentar con body
            const bodyContent = doc.body.innerHTML;
            if (bodyContent) {
                headerContainer.innerHTML = bodyContent;
            } else {
                console.error('No se encontró contenido del header');
            }
        }
        
        // Cargar scripts del header
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
        });
        
        // Esperar a que los scripts se carguen
        setTimeout(() => {
            if (typeof window.initHeaderAuth === 'function') {
                window.initHeaderAuth();
            }
            if (typeof setupHeaderAuth === 'function') {
                setupHeaderAuth();
            }
            if (typeof setupProfileMenu === 'function') {
                setupProfileMenu();
            }
            if (typeof updateHeaderAuth === 'function') {
                updateHeaderAuth();
            }
            
            // Forzar actualización manualmente después de un tiempo adicional
            setTimeout(() => {
                console.log('Actualizando enlaces del header manualmente...');
                const panelLink = document.getElementById('panelLink');
                const organizacionLink = document.getElementById('organizacionLink');
                
                // Obtener rol del usuario
                const loggedUser = localStorage.getItem('loggedUser');
                let userRol = localStorage.getItem('userRol') || localStorage.getItem('userRole');
                
                if (!userRol && loggedUser) {
                    try {
                        const userData = JSON.parse(loggedUser);
                        userRol = userData.rol;
                    } catch (e) {
                        console.error('Error parseando loggedUser:', e);
                    }
                }
                
                if (userRol) {
                    const rol = String(userRol).trim().toLowerCase();
                    console.log('Rol detectado para mostrar enlaces:', rol);
                    
                    if (panelLink) {
                        if (rol === 'admin' || rol === 'organizacion') {
                            panelLink.style.display = 'block';
                            panelLink.style.visibility = 'visible';
                            console.log('✓ Panel link mostrado');
                        } else {
                            panelLink.style.display = 'none';
                            console.log('✗ Panel link ocultado (rol:', rol + ')');
                        }
                    } else {
                        console.warn('⚠ panelLink no encontrado en el DOM');
                    }
                    
                    if (organizacionLink) {
                        if (rol === 'organizacion') {
                            organizacionLink.style.display = 'block';
                            organizacionLink.style.visibility = 'visible';
                            console.log('✓ Organización link mostrado');
                        } else {
                            organizacionLink.style.display = 'none';
                            console.log('✗ Organización link ocultado (rol:', rol + ')');
                        }
                    } else {
                        console.warn('⚠ organizacionLink no encontrado en el DOM');
                    }
                } else {
                    console.warn('⚠ No se encontró rol del usuario');
                }
            }, 300);
            
            console.log('Header cargado');
        }, 100);
    } catch (error) {
        console.error('Error insertando header:', error);
    }
}

// Configurar navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.org-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Cambiar sección
function switchSection(sectionName) {
    const sections = document.querySelectorAll('.org-content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Cargar datos según la sección
        switch(sectionName) {
            case 'historial':
                loadHistorialOportunidades();
                break;
            case 'postulaciones':
                loadPostulaciones();
                break;
            case 'seguimiento':
                loadSeguimiento();
                break;
            case 'reportes':
                loadReportesImpacto();
                break;
            case 'academia':
                loadAcademiaDocumentos();
                break;
            case 'biblioteca':
                loadBibliotecaDocumentos();
                break;
            case 'reseñas':
                loadReseñas();
                break;
        }
    }
}

// Inicializar dashboard
async function initializeDashboard() {
    // Obtener datos del usuario logueado
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
        if (typeof window.redirectTo === 'function') {
            window.redirectTo('../../inicio de sesion/login.html');
        } else {
            window.location.href = '../../inicio de sesion/login.html';
        }
        return;
    }
    
    const userData = JSON.parse(loggedUser);
    userId = userData.id;
    
    // Obtener organización del usuario
    try {
        const response = await fetch(`${API_BASE_URL}/organizaciones/usuario/${userId}`, {
            mode: 'cors'
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                alert('No se encontró una organización asociada a tu cuenta. Por favor, crea una organización primero.');
                if (typeof window.redirectTo === 'function') {
                    window.redirectTo('index.html');
                } else {
                    window.location.href = 'index.html';
                }
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.organizacion) {
            organizacionData = data.organizacion;
            organizacionId = organizacionData.id;
            console.log('Organización cargada:', organizacionId, organizacionData.nombre);
            
            // Cargar datos iniciales - usar setTimeout para asegurar que el DOM esté listo
            setTimeout(async () => {
                console.log('Iniciando carga de datos...');
                
                // Configurar event listeners después de que los elementos existan
                setupHistorialEventListeners();
                setupPostulacionesEventListeners();
                setupAcademiaDocumentos();
                setupBibliotecaDocumentos();
                
                // Cargar datos
                await loadHistorialOportunidades();
                await loadPostulaciones(); // Cargar postulaciones también al iniciar
                
                console.log('Datos cargados exitosamente');
            }, 300);
        } else {
            alert('No se encontró una organización asociada a tu cuenta. Por favor, crea una organización primero.');
            if (typeof window.redirectTo === 'function') {
                window.redirectTo('index.html');
            } else {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        console.error('Error obteniendo organización:', error);
        alert('Error al cargar los datos de la organización. Por favor, intenta nuevamente.');
    }
}

// ==================== HISTORIAL DE OPORTUNIDADES ====================

async function loadHistorialOportunidades() {
    if (!organizacionId) {
        console.warn('No hay organizacionId, no se puede cargar historial');
        const tbody = document.getElementById('tablaHistorialOportunidades');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-orange-500 py-8">Esperando datos de organización...</td></tr>';
        }
        return;
    }
    
    console.log('Cargando historial de oportunidades para organización:', organizacionId);
    
    // Mostrar estado de carga
    const tbody = document.getElementById('tablaHistorialOportunidades');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500 py-8"><i class="fas fa-spinner fa-spin"></i> Cargando oportunidades...</td></tr>';
    }
    
    try {
        const estado = document.getElementById('filtroEstadoHistorial')?.value || 'todas';
        const params = new URLSearchParams({ organizacion_id: organizacionId });
        
        // Solo agregar estado si no es 'todas' - para que el backend devuelva todas las oportunidades
        if (estado && estado !== 'todas' && estado !== 'all') {
            params.append('estado', estado);
        }
        
        const url = `${API_BASE_URL}/oportunidades?${params}`;
        console.log('Fetching oportunidades:', url);
        console.log('Parámetros:', params.toString());
        
        const response = await fetch(url, {
            mode: 'cors'
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en respuesta:', response.status, response.statusText);
            console.error('Error body:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos de oportunidades recibidos:', data);
        console.log('Success:', data.success);
        console.log('Número de oportunidades:', data.oportunidades?.length || 0);
        
        if (data.success) {
            oportunidadesData = data.oportunidades || [];
            console.log('Oportunidades asignadas a oportunidadesData:', oportunidadesData.length);
            
            if (oportunidadesData.length === 0) {
                console.warn('No se encontraron oportunidades para esta organización');
                if (tbody) {
                    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500 py-8">No hay oportunidades registradas. <a href="index.html" style="color: #0066CC; text-decoration: underline;">Crear nueva oportunidad</a></td></tr>';
                }
            } else {
                console.log('Renderizando oportunidades...');
                renderHistorialOportunidades();
            }
        } else {
            console.error('Error en respuesta del servidor:', data.error);
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center text-red-500 py-8">Error: ' + (data.error || 'Error desconocido') + '</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error cargando historial:', error);
        console.error('Error stack:', error.stack);
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-red-500 py-8">Error al cargar oportunidades: ' + error.message + '<br><small>Verifica que el servidor esté corriendo en el puerto 5000</small></td></tr>';
        }
    }
}

function renderHistorialOportunidades() {
    console.log('Renderizando historial de oportunidades...');
    const tbody = document.getElementById('tablaHistorialOportunidades');
    
    if (!tbody) {
        console.error('No se encontró tablaHistorialOportunidades');
        return;
    }
    
    const buscar = document.getElementById('buscarHistorial')?.value.toLowerCase() || '';
    
    if (!oportunidadesData || oportunidadesData.length === 0) {
        console.warn('No hay datos de oportunidades para renderizar');
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500 py-8">No hay oportunidades</td></tr>';
        return;
    }
    
    let filtered = oportunidadesData.filter(op => 
        op.titulo && op.titulo.toLowerCase().includes(buscar)
    );
    
    if (filtered.length === 0) {
        console.log('No hay oportunidades que coincidan con el filtro');
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500 py-8">No hay oportunidades que coincidan con la búsqueda</td></tr>';
        return;
    }
    
    console.log('Renderizando', filtered.length, 'oportunidades');
    
    // Mostrar primero las oportunidades sin postulaciones (carga rápida)
    tbody.innerHTML = filtered.map(op => {
        const estadoNormalizado = (op.estado || '').toLowerCase();
        const esActiva = estadoNormalizado === 'activa' || estadoNormalizado === 'abierta';
        const esCerrada = estadoNormalizado === 'cerrada';
        
        const fechasVol = (op.fecha_inicio_voluntariado || op.fecha_fin_voluntariado)
            ? `${op.fecha_inicio_voluntariado || 'TBD'} - ${op.fecha_fin_voluntariado || 'TBD'}`
            : 'Sin fechas';
        const horasVol = (op.horas_voluntariado !== null && op.horas_voluntariado !== undefined && op.horas_voluntariado !== '')
            ? `${op.horas_voluntariado} hrs`
            : 'N/A';

        return `
        <tr id="row-oportunidad-${op.id}">
            <td><strong>${op.titulo || 'Sin título'}</strong></td>
            <td>
                <span class="badge badge-${esActiva ? 'activa' : 'cerrada'}" id="badge-estado-oportunidad-${op.id}">${op.estado || 'N/A'}</span>
            </td>
            <td>${op.fecha_limite_postulacion || 'Sin fecha límite'}</td>
            <td>${fechasVol}</td>
            <td>${horasVol}</td>
            <td id="postulaciones-${op.id}">-</td>
            <td id="seleccionados-${op.id}">-</td>
            <td>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button class="btn-secondary" onclick="verDetallesOportunidad(${op.id})" style="padding: 6px 12px; font-size: 11px;" title="Ver postulantes">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    ${esActiva ? `
                        <button class="btn-danger" onclick="cambiarEstadoOportunidad(${op.id}, 'cerrada')" style="padding: 6px 12px; font-size: 11px;" title="Cerrar oportunidad">
                            <i class="fas fa-lock"></i> Cerrar
                        </button>
                    ` : ''}
                    ${esCerrada ? `
                        <button class="btn-success" onclick="cambiarEstadoOportunidad(${op.id}, 'activa')" style="padding: 6px 12px; font-size: 11px;" title="Abrir oportunidad">
                            <i class="fas fa-unlock"></i> Abrir
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
    }).join('');
    
    // Luego cargar los conteos de postulaciones de forma asíncrona y actualizar
    filtered.forEach(async (op) => {
        try {
            const res = await fetch(`${API_BASE_URL}/oportunidades/${op.id}/postulaciones`, { mode: 'cors' });
            const data = await res.json();
            const totalPostulaciones = data.postulaciones?.length || 0;
            const seleccionados = data.postulaciones?.filter(p => p.estado === 'Seleccionado').length || 0;
            
            // Actualizar las celdas específicas
            const postulacionesCell = document.getElementById(`postulaciones-${op.id}`);
            const seleccionadosCell = document.getElementById(`seleccionados-${op.id}`);
            
            if (postulacionesCell) {
                postulacionesCell.textContent = totalPostulaciones;
            }
            if (seleccionadosCell) {
                seleccionadosCell.textContent = seleccionados;
            }
        } catch (error) {
            console.error(`Error cargando postulaciones para oportunidad ${op.id}:`, error);
            // Actualizar con 0 si falla
            const postulacionesCell = document.getElementById(`postulaciones-${op.id}`);
            const seleccionadosCell = document.getElementById(`seleccionados-${op.id}`);
            if (postulacionesCell) postulacionesCell.textContent = '0';
            if (seleccionadosCell) seleccionadosCell.textContent = '0';
        }
    });
    
    console.log('Renderizado completado, mostrando', filtered.length, 'oportunidades');
}

// Función para configurar event listeners del historial
function setupHistorialEventListeners() {
    console.log('Configurando event listeners de historial...');
    
    const filtroEstado = document.getElementById('filtroEstadoHistorial');
    const buscarInput = document.getElementById('buscarHistorial');
    const createVolunteerBtn = document.getElementById('createVolunteerBtn');
    
    if (filtroEstado) {
        filtroEstado.removeEventListener('change', loadHistorialOportunidades);
        filtroEstado.addEventListener('change', loadHistorialOportunidades);
        console.log('Event listener agregado a filtroEstadoHistorial');
    } else {
        console.warn('No se encontró filtroEstadoHistorial');
    }
    
    if (buscarInput) {
        buscarInput.removeEventListener('input', renderHistorialOportunidades);
        buscarInput.addEventListener('input', renderHistorialOportunidades);
        console.log('Event listener agregado a buscarHistorial');
    } else {
        console.warn('No se encontró buscarHistorial');
    }
    
    // Configurar botón de crear voluntariado (exactamente igual que en app.js)
    const btnCreateVolunteer = document.getElementById('createVolunteerBtn');
    if (btnCreateVolunteer) {
        // Asegurarse de que type="button" para evitar submit y refresh
        btnCreateVolunteer.type = 'button';
        
        // Remover cualquier listener previo
        const newBtn = btnCreateVolunteer.cloneNode(true);
        btnCreateVolunteer.parentNode.replaceChild(newBtn, btnCreateVolunteer);
        
        // Obtener el nuevo botón y agregar listener
        const btn = document.getElementById('createVolunteerBtn');
        if (btn) {
            btn.type = 'button';
            
            // Usar exactamente el mismo código que en app.js
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('Botón crear voluntariado clickeado - Abriendo modal...');
                
                if (typeof window.mostrarModalCrearOportunidad === 'function') {
                    window.mostrarModalCrearOportunidad();
                } else {
                    console.error('mostrarModalCrearOportunidad no está disponible');
                }
                
                return false;
            });
        }
        
        console.log('Event listener agregado a createVolunteerBtn');
    } else {
        console.warn('No se encontró createVolunteerBtn');
    }
}

// ==================== POSTULACIONES RECIBIDAS ====================

// Configurar event listeners para postulaciones
function setupPostulacionesEventListeners() {
    console.log('Configurando event listeners de postulaciones...');
    
    const filtroOportunidad = document.getElementById('filtroOportunidadPostulaciones');
    const filtroEstado = document.getElementById('filtroEstadoPostulaciones');
    const buscarInput = document.getElementById('buscarPostulaciones');
    
    if (filtroOportunidad) {
        filtroOportunidad.addEventListener('change', () => {
            console.log('Filtro de oportunidad cambiado');
            renderPostulaciones();
        });
    }
    
    if (filtroEstado) {
        filtroEstado.addEventListener('change', () => {
            console.log('Filtro de estado cambiado');
            renderPostulaciones();
        });
    }
    
    if (buscarInput) {
        buscarInput.addEventListener('input', () => {
            console.log('Búsqueda de postulaciones cambiada');
            renderPostulaciones();
        });
    }
}

// Ejecutar después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', setupPostulacionesEventListeners);
setTimeout(setupPostulacionesEventListeners, 500);

async function loadPostulaciones() {
    if (!organizacionId) {
        console.warn('No hay organizacionId, no se puede cargar postulaciones');
        return;
    }
    
    console.log('Cargando postulaciones para organización:', organizacionId);
    
    try {
        // Primero cargar todas las oportunidades para el filtro
        const opUrl = `${API_BASE_URL}/oportunidades?organizacion_id=${organizacionId}`;
        console.log('Fetching oportunidades:', opUrl);
        
        const opResponse = await fetch(opUrl, {
            mode: 'cors'
        });
        
        if (!opResponse.ok) {
            console.error('Error cargando oportunidades:', opResponse.status);
            throw new Error(`Error ${opResponse.status}: ${opResponse.statusText}`);
        }
        
        const opData = await opResponse.json();
        console.log('Oportunidades recibidas:', opData);
        
        // Configurar event listeners después de cargar las oportunidades
        setupPostulacionesEventListeners();
        
        if (opData.success) {
            const selectOportunidad = document.getElementById('filtroOportunidadPostulaciones');
            if (selectOportunidad) {
                selectOportunidad.innerHTML = '<option value="todas">Todas las oportunidades</option>' +
                    opData.oportunidades.map(op => 
                        `<option value="${op.id}">${op.titulo}</option>`
                    ).join('');
            }
        }
        
        // Cargar todas las postulaciones de todas las oportunidades (incluidas cerradas)
        const allPostulaciones = [];
        for (const op of opData.oportunidades || []) {
            try {
                // Cargar postulaciones sin filtrar por estado de oportunidad
                const postResponse = await fetch(`${API_BASE_URL}/oportunidades/${op.id}/postulaciones`, {
                    mode: 'cors'
                });
                const postData = await postResponse.json();
                if (postData.success && postData.postulaciones) {
                    postData.postulaciones.forEach(post => {
                        allPostulaciones.push({
                            ...post,
                            oportunidad_titulo: op.titulo,
                            oportunidad_id: op.id,
                            oportunidad_estado: op.estado  // Incluir estado de la oportunidad
                        });
                    });
                }
            } catch (error) {
                console.error(`Error cargando postulaciones de oportunidad ${op.id}:`, error);
            }
        }
        
        postulacionesData = allPostulaciones;
        renderPostulaciones();
    } catch (error) {
        console.error('Error cargando postulaciones:', error);
        document.getElementById('tablaPostulaciones').innerHTML = 
            '<tr><td colspan="5" class="text-center text-red-500 py-8">Error al cargar postulaciones</td></tr>';
    }
}

function renderPostulaciones() {
    const tbody = document.getElementById('tablaPostulaciones');
    const filtroOportunidad = document.getElementById('filtroOportunidadPostulaciones')?.value || 'todas';
    const filtroEstado = document.getElementById('filtroEstadoPostulaciones')?.value || 'todas';
    const buscar = document.getElementById('buscarPostulaciones')?.value.toLowerCase() || '';
    
    let filtered = postulacionesData.filter(post => {
        if (filtroOportunidad !== 'todas' && post.oportunidad_id != filtroOportunidad) return false;
        if (filtroEstado !== 'todas') {
            // Normalizar comparación de estados (incluye "Rechazado" como "No seleccionado")
            const estadoPost = post.estado || '';
            const estadoNormalizado = estadoPost.toLowerCase();
            if (filtroEstado === 'No seleccionado') {
                if (!estadoNormalizado.includes('no seleccionado') && !estadoNormalizado.includes('rechazado')) {
                    return false;
                }
            } else if (estadoPost !== filtroEstado) {
                return false;
            }
        }
        const nombreCompleto = `${post.usuario_nombre_completo || ''}`.toLowerCase();
        if (buscar && !nombreCompleto.includes(buscar)) return false;
        return true;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">No hay postulaciones</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(post => {
        const estadoNormalizado = (post.estado || '').toLowerCase();
        const esPendiente = estadoNormalizado.includes('pendiente');
        const esSeleccionado = estadoNormalizado.includes('seleccionado') && !estadoNormalizado.includes('no seleccionado') && !estadoNormalizado.includes('pre-seleccionado');
        const esNoSeleccionado = estadoNormalizado.includes('no seleccionado') || estadoNormalizado.includes('rechazado');
        
        return `
        <tr>
            <td><strong>${post.usuario_nombre_completo || 'N/A'}</strong><br>
                <small class="text-gray-500">${post.usuario_email || ''}</small>
            </td>
            <td>
                ${post.oportunidad_titulo || 'N/A'}
                ${post.oportunidad_estado === 'cerrada' ? '<br><small class="text-gray-500">(Oportunidad cerrada)</small>' : ''}
            </td>
            <td><span class="badge badge-${estadoNormalizado}">${post.estado}</span></td>
            <td>${post.created_at ? new Date(post.created_at).toLocaleDateString('es-CL') : 'N/A'}</td>
            <td>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button class="btn-secondary" onclick="verDetallesPostulacion(${post.id})" style="padding: 6px 12px; font-size: 11px;">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    ${esPendiente ? `
                        <button class="btn-success" onclick="cambiarEstadoPostulacionRapido(${post.id}, 'Seleccionado')" style="padding: 6px 12px; font-size: 11px;" title="Aprobar postulación">
                            <i class="fas fa-check"></i> Aprobar
                        </button>
                        <button class="btn-danger" onclick="mostrarModalJustificacion(${post.id}, ${post.oportunidad_id || 'null'})" style="padding: 6px 12px; font-size: 11px;" title="Rechazar postulación">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    ` : ''}
                    ${esSeleccionado ? `
                        <button class="btn-secondary" onclick="abrirModalSeguimiento(${post.id}, ${post.usuario_id || post.id})" style="padding: 6px 12px; font-size: 11px;" title="Gestionar seguimiento">
                            <i class="fas fa-edit"></i> Gestionar
                        </button>
                        <button class="btn-danger" onclick="mostrarModalJustificacion(${post.id}, ${post.oportunidad_id || 'null'})" style="padding: 6px 12px; font-size: 11px;" title="Rechazar postulación">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    ` : ''}
                    ${esNoSeleccionado ? `
                        <button class="btn-success" onclick="cambiarEstadoPostulacionRapido(${post.id}, 'Seleccionado')" style="padding: 6px 12px; font-size: 11px;" title="Aprobar postulación">
                            <i class="fas fa-check"></i> Aprobar
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

// Event listeners para filtros de postulaciones
document.addEventListener('DOMContentLoaded', function() {
    const filtroOportunidad = document.getElementById('filtroOportunidadPostulaciones');
    const filtroEstado = document.getElementById('filtroEstadoPostulaciones');
    const buscarInput = document.getElementById('buscarPostulaciones');
    
    if (filtroOportunidad) {
        filtroOportunidad.addEventListener('change', renderPostulaciones);
    }
    
    if (filtroEstado) {
        filtroEstado.addEventListener('change', renderPostulaciones);
    }
    
    if (buscarInput) {
        buscarInput.addEventListener('input', renderPostulaciones);
    }
});

// ==================== SEGUIMIENTO DE VOLUNTARIOS ====================

async function loadSeguimiento() {
    if (!organizacionId) return;
    
    try {
        // Cargar oportunidades para el filtro
        const opResponse = await fetch(`${API_BASE_URL}/oportunidades?organizacion_id=${organizacionId}`, {
            mode: 'cors'
        });
        const opData = await opResponse.json();
        
        if (opData.success) {
            const selectOportunidad = document.getElementById('filtroOportunidadSeguimiento');
            if (selectOportunidad) {
                selectOportunidad.innerHTML = '<option value="todas">Todas las oportunidades</option>' +
                    opData.oportunidades.map(op => 
                        `<option value="${op.id}">${op.titulo}</option>`
                    ).join('');
            }
        }
        
        // Cargar postulaciones seleccionadas
        const allSeguimiento = [];
        for (const op of opData.oportunidades || []) {
            try {
                const postResponse = await fetch(`${API_BASE_URL}/oportunidades/${op.id}/postulaciones?solo_seleccionados=true`, {
                    mode: 'cors'
                });
                const postData = await postResponse.json();
                if (postData.success && postData.postulaciones) {
                    postData.postulaciones.forEach(post => {
                        allSeguimiento.push({
                            ...post,
                            oportunidad_titulo: op.titulo,
                            oportunidad_id: op.id
                        });
                    });
                }
            } catch (error) {
                console.error(`Error cargando seguimiento de oportunidad ${op.id}:`, error);
            }
        }
        
        seguimientoData = allSeguimiento;
        renderSeguimiento();
    } catch (error) {
        console.error('Error cargando seguimiento:', error);
        document.getElementById('tablaSeguimiento').innerHTML = 
            '<tr><td colspan="7" class="text-center text-red-500 py-8">Error al cargar seguimiento</td></tr>';
    }
}

function renderSeguimiento() {
    const tbody = document.getElementById('tablaSeguimiento');
    const filtroOportunidad = document.getElementById('filtroOportunidadSeguimiento')?.value || 'todas';
    const filtroEstado = document.getElementById('filtroEstadoSeguimiento')?.value || 'todas';
    
    let filtered = seguimientoData.filter(seg => {
        if (filtroOportunidad !== 'todas' && seg.oportunidad_id != filtroOportunidad) return false;
        const estadoConfirmacion = seg.estado_confirmacion || 'Pendiente';
        if (filtroEstado !== 'todas' && estadoConfirmacion !== filtroEstado) return false;
        return true;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center text-gray-500 py-8">No hay voluntarios en seguimiento</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(seg => {
        const estadoConfirmacion = seg.estado_confirmacion || 'Pendiente';
        const asistenciaCap = seg.asistencia_capacitacion || 'No aplica';
        const asistenciaAct = seg.asistencia_actividad || 'No aplica';
        
        return `
        <tr>
            <td>
                <strong>${seg.usuario_nombre_completo || 'N/A'}</strong>
                <br><small class="text-gray-500" style="font-size: 11px;">${seg.usuario_region || 'N/A'}, ${seg.usuario_comuna || 'N/A'}</small>
                <br><small class="text-gray-500" style="font-size: 11px;">${seg.usuario_sexo || 'N/A'}, ${seg.usuario_edad || 'N/A'} años</small>
            </td>
            <td>${seg.oportunidad_titulo || 'N/A'}</td>
            <td>
                <select id="confirmacion-${seg.id}" onchange="actualizarConfirmacion(${seg.id}, this.value)" 
                        style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; width: 100%;">
                    <option value="Pendiente" ${estadoConfirmacion === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Confirmado" ${estadoConfirmacion === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                    <option value="No confirmado" ${estadoConfirmacion === 'No confirmado' ? 'selected' : ''}>No confirmado</option>
                </select>
            </td>
            <td>
                <select id="asist-cap-${seg.id}" onchange="actualizarAsistenciaCapacitacion(${seg.id}, this.value)" 
                        style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; width: 100%;">
                    <option value="Sí" ${asistenciaCap === true || asistenciaCap === 'Sí' || asistenciaCap === 'Si' || asistenciaCap === 'SI' ? 'selected' : ''}>Sí</option>
                    <option value="No" ${asistenciaCap === false || asistenciaCap === 'No' || asistenciaCap === 'NO' ? 'selected' : ''}>No</option>
                    <option value="No aplica" ${asistenciaCap === 'No aplica' || asistenciaCap === 'No aplica' || !asistenciaCap ? 'selected' : ''}>No aplica</option>
                </select>
            </td>
            <td>
                <select id="asist-act-${seg.id}" onchange="actualizarAsistenciaActividad(${seg.id}, this.value)" 
                        style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; width: 100%;">
                    <option value="Sí" ${asistenciaAct === true || asistenciaAct === 'Sí' || asistenciaAct === 'Si' || asistenciaAct === 'SI' ? 'selected' : ''}>Sí</option>
                    <option value="No" ${asistenciaAct === false || asistenciaAct === 'No' || asistenciaAct === 'NO' ? 'selected' : ''}>No</option>
                    <option value="No aplica" ${asistenciaAct === 'No aplica' || asistenciaAct === 'No aplica' || !asistenciaAct ? 'selected' : ''}>No aplica</option>
                </select>
            </td>
            <td>${seg.horas_voluntariado || 0} hrs</td>
            <td>${seg.calificacion_org ? `${seg.calificacion_org}/5` : 'Sin calificar'}</td>
            <td>${seg.tiene_certificado ? '✓ Emitido' : 'Pendiente'}</td>
            <td>
                <button class="btn-secondary" onclick="abrirModalSeguimiento(${seg.id}, ${seg.usuario_id || seg.id})" style="padding: 6px 12px; font-size: 12px;">
                    <i class="fas fa-edit"></i> Gestionar
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

// Event listeners para filtros de seguimiento
document.addEventListener('DOMContentLoaded', function() {
    const filtroOportunidad = document.getElementById('filtroOportunidadSeguimiento');
    const filtroEstado = document.getElementById('filtroEstadoSeguimiento');
    
    if (filtroOportunidad) {
        filtroOportunidad.addEventListener('change', renderSeguimiento);
    }
    
    if (filtroEstado) {
        filtroEstado.addEventListener('change', renderSeguimiento);
    }
});

// ==================== REPORTES DE IMPACTO ====================

async function loadReportesImpacto() {
    if (!organizacionId) return;
    
    try {
        // Cargar oportunidades para el filtro
        const opResponse = await fetch(`${API_BASE_URL}/oportunidades?organizacion_id=${organizacionId}`, {
            mode: 'cors'
        });
        const opData = await opResponse.json();
        
        if (opData.success) {
            const selectOportunidad = document.getElementById('filtroOportunidadReporte');
            if (selectOportunidad) {
                selectOportunidad.innerHTML = '<option value="todas">Todas las oportunidades</option>' +
                    opData.oportunidades.map(op => 
                        `<option value="${op.id}">${op.titulo}</option>`
                    ).join('');
            }
        }
        
        // Calcular estadísticas
        let totalVoluntarios = 0;
        let totalHoras = 0;
        let totalActividades = 0;
        let totalCertificados = 0;
        
        for (const op of opData.oportunidades || []) {
            try {
                const postResponse = await fetch(`${API_BASE_URL}/oportunidades/${op.id}/postulaciones`, {
                    mode: 'cors'
                });
                const postData = await postResponse.json();
                if (postData.success && postData.postulaciones) {
                    const seleccionados = postData.postulaciones.filter(p => p.estado === 'Seleccionado');
                    totalVoluntarios += seleccionados.length;
                    totalActividades += seleccionados.filter(p => p.asistencia_actividad).length;
                    totalCertificados += seleccionados.filter(p => p.tiene_certificado).length;
                    // Estimación de horas (puedes ajustar según tu lógica)
                    totalHoras += seleccionados.length * 8; // Ejemplo: 8 horas por voluntario
                }
            } catch (error) {
                console.error(`Error calculando estadísticas de oportunidad ${op.id}:`, error);
            }
        }
        
        document.getElementById('totalVoluntarios').textContent = totalVoluntarios;
        document.getElementById('totalHoras').textContent = totalHoras;
        document.getElementById('totalActividades').textContent = totalActividades;
        document.getElementById('totalCertificados').textContent = totalCertificados;
        
        // Generar gráfico
        generarGraficoImpacto(opData.oportunidades || []);
    } catch (error) {
        console.error('Error cargando reportes:', error);
    }
}

function generarGraficoImpacto(oportunidades) {
    const ctx = document.getElementById('graficoImpacto');
    if (!ctx) return;
    
    // Obtener datos para el gráfico
    const labels = oportunidades.map(op => op.titulo.substring(0, 20) + '...');
    const voluntarios = [];
    
    Promise.all(oportunidades.map(async (op) => {
        try {
            const res = await fetch(`${API_BASE_URL}/oportunidades/${op.id}/postulaciones`, { mode: 'cors' });
            const data = await res.json();
            return data.postulaciones?.filter(p => p.estado === 'Seleccionado').length || 0;
        } catch (error) {
            return 0;
        }
    })).then(datos => {
        if (window.impactChart) {
            window.impactChart.destroy();
        }
        
        window.impactChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Voluntarios Seleccionados',
                    data: datos,
                    backgroundColor: 'rgba(37, 99, 235, 0.5)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}

// ==================== ACADEMIA (documentos educativos) ====================
// Guardar última lista de documentos para poder editar por id
let documentosAcademiaActuales = [];

async function loadAcademiaDocumentos() {
    const container = document.getElementById('academiaDocumentosContainer');
    if (!container) return;
    if (!organizacionId) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">No hay organización cargada.</div>';
        return;
    }
    container.innerHTML = '<div class="text-center text-gray-500 py-8"><i class="fas fa-spinner fa-spin"></i> Cargando documentos...</div>';
    try {
        const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}/academia/documentos`, { mode: 'cors' });
        const data = await response.json();
        if (!data.success) {
            container.innerHTML = '<div class="text-center text-red-600 py-8">Error: ' + (data.error || 'No se pudieron cargar los documentos') + '</div>';
            return;
        }
        const docs = data.documentos || [];
        documentosAcademiaActuales = docs;
        if (docs.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8"><i class="fas fa-folder-open" style="font-size:2rem;opacity:0.4;"></i><p class="mt-2">No hay documentos educativos.</p><p class="text-sm">Haz clic en "Subir documento educativo" para agregar uno.</p></div>';
            return;
        }
        const formatDate = (iso) => {
            if (!iso) return '—';
            try {
                return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
            } catch (e) { return iso; }
        };
        const escapeHtml = (t) => {
            if (!t) return '';
            const d = document.createElement('div');
            d.textContent = t;
            return d.innerHTML;
        };
        const estadoLabel = (est) => (est === 'aprobado' ? 'Aprobado (público)' : est === 'rechazado' ? 'Rechazado' : 'Pendiente (en revisión)');
        const estadoBadge = (est) => {
            const c = est === 'aprobado' ? 'background:#d1fae5;color:#065f46' : est === 'rechazado' ? 'background:#fee2e2;color:#b91c1c' : 'background:#fef3c7;color:#92400e';
            return '<span style="font-size:0.8rem;padding:0.2rem 0.5rem;border-radius:4px;' + c + '">' + estadoLabel(est || 'pendiente') + '</span>';
        };
        const puedeEditar = (est) => (est || '').toLowerCase() !== 'aprobado';
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre del archivo</th>
                        <th>Estado</th>
                        <th>Fecha de creación</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${docs.map(d => `
                        <tr>
                            <td>${escapeHtml(d.nombre_archivo || d.archivo_filename)}</td>
                            <td>${estadoBadge(d.estado)}</td>
                            <td>${formatDate(d.fecha_edicion || d.created_at)}</td>
                            <td>${escapeHtml((d.descripcion || '').substring(0, 80))}${(d.descripcion && d.descripcion.length > 80) ? '...' : ''}</td>
                            <td>
                                <a href="${API_BASE_URL}/repositorio/documento/academia/${d.id}/descargar" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.25rem 0.5rem;font-size:0.875rem;"><i class="fas fa-download"></i> Descargar</a>
                                ${puedeEditar(d.estado) ? '<button type="button" class="btn-secondary" style="padding:0.25rem 0.5rem;font-size:0.875rem;margin-left:4px;" data-doc-id="' + d.id + '" data-academia-editar><i class="fas fa-edit"></i> Editar</button>' : ''}
                                <button type="button" class="btn-danger" style="padding:0.25rem 0.5rem;font-size:0.875rem;" data-doc-id="${d.id}" data-academia-eliminar><i class="fas fa-trash"></i> Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        container.querySelectorAll('[data-academia-editar]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = btn.getAttribute('data-doc-id');
                const doc = documentosAcademiaActuales.find(function(d) { return String(d.id) === String(id); });
                if (doc && typeof window.mostrarModalEditarDocumentoEducativo === 'function') {
                    window.mostrarModalEditarDocumentoEducativo(doc);
                }
            });
        });
        container.querySelectorAll('[data-academia-eliminar]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-doc-id');
                if (!confirm('¿Eliminar este documento?')) return;
                try {
                    const res = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}/academia/documentos/${id}`, { method: 'DELETE', mode: 'cors' });
                    const r = await res.json();
                    if (r.success) loadAcademiaDocumentos();
                    else alert(r.error || 'Error al eliminar');
                } catch (e) {
                    alert('Error de conexión');
                }
            });
        });
    } catch (err) {
        console.error('Error cargando documentos Academia:', err);
        container.innerHTML = '<div class="text-center text-red-600 py-8">Error de conexión. Vuelve a intentar.</div>';
    }
}

function setupAcademiaDocumentos() {
    const btnSubir = document.getElementById('btnSubirDocumentoEducativo');
    if (btnSubir) {
        btnSubir.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.mostrarModalSubirDocumentoEducativo === 'function') {
                window.mostrarModalSubirDocumentoEducativo();
            }
            return false;
        });
    }
}

// Modal estilo "Editar perfil": sidebar + panel con zona de arrastre + nombre + fecha + Cancelar/Guardar
window.mostrarModalSubirDocumentoEducativo = function() {
    const existente = document.getElementById('modalSubirDocumentoEducativo');
    if (existente) existente.remove();
    // Cerrar el dropdown del header para que no intercepte clics al cerrar el modal
    var profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown && profileDropdown.classList) profileDropdown.classList.remove('active');
    if (!organizacionId) {
        alert('Error: No se encontró la organización. Por favor, recarga la página.');
        return;
    }
    const modal = document.createElement('div');
    modal.id = 'modalSubirDocumentoEducativo';
    modal.className = 'modal-academia-doc';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;min-height:100vh;z-index:99999;margin:0;padding:80px 16px 16px;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;box-sizing:border-box;';
    modal.innerHTML = '<div class="modal-academia-doc-inner" style="max-width:1024px;width:100%;max-height:calc(100vh - 100px);background:#fff;border-radius:12px;box-shadow:0 25px 50px rgba(0,0,0,0.25);display:flex;flex-direction:column;overflow:hidden;">' +
        '<div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">' +
            '<h2 class="text-2xl font-bold text-gray-900">Subir documento educativo</h2>' +
            '<button type="button" id="closeModalDocEducativo" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>' +
        '</div>' +
        '<div class="flex flex-1 overflow-hidden">' +
            '<div class="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">' +
                '<div class="p-4">' +
                    '<h3 class="text-sm font-semibold text-gray-500 uppercase mb-2 px-3">Documento</h3>' +
                    '<nav class="space-y-1">' +
                        '<button type="button" class="w-full text-left px-3 py-2 rounded-lg bg-blue-100 text-blue-800 font-medium flex items-center gap-2">' +
                            '<span>📄</span> Subir documento' +
                        '</button>' +
                    '</nav>' +
                '</div>' +
            '</div>' +
            '<div class="flex-1 overflow-y-auto bg-white">' +
                '<div class="p-6">' +
                    '<h3 class="text-xl font-semibold mb-4">Subir documento educativo</h3>' +
                    '<p class="text-gray-600 mb-6">Sube un documento o video educativo para que los voluntarios puedan descargarlo. Indica el nombre del archivo y la fecha de creación.</p>' +
                    '<div id="academiaDocDropZone" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">' +
                        '<div class="flex flex-col items-center gap-3">' +
                            '<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>' +
                            '<p class="text-sm text-gray-600"><span class="font-semibold text-blue-600">Haz clic para seleccionar</span> o arrastra un archivo aquí</p>' +
                            '<p class="text-xs text-gray-500">Documentos (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT) o Videos (MP4, AVI, MOV, WEBM) hasta 500MB</p>' +
                            '<p id="academiaDocFileName" class="text-sm text-green-600 font-medium hidden"></p>' +
                        '</div>' +
                    '</div>' +
                    '<input type="file" id="academiaDocArchivo" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.odt,.ods,.odp,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.m4v" class="hidden">' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Nombre del documento *</label>' +
                        '<input type="text" id="academiaDocNombre" required maxlength="255" placeholder="Ej: Guía de voluntariado 2024" class="w-full border border-gray-300 rounded-lg p-2">' +
                    '</div>' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Descripción breve *</label>' +
                        '<textarea id="academiaDocDescripcion" required maxlength="500" rows="3" placeholder="Describe brevemente el contenido del documento (máx. 500 caracteres)" class="w-full border border-gray-300 rounded-lg p-2 resize-y"></textarea>' +
                        '<p class="text-xs text-gray-500 mt-1">Obligatoria. Será visible para los voluntarios en la sección Academia.</p>' +
                    '</div>' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Categoría *</label>' +
                        '<select id="academiaDocCategoria" required class="w-full border border-gray-300 rounded-lg p-2">' +
                            '<option value="">Selecciona una categoría</option>' +
                            '<option value="guias_manuales">Guías y Manuales</option>' +
                            '<option value="plantillas_formatos">Plantillas y Formatos</option>' +
                            '<option value="videos_tutoriales">Videos Tutoriales</option>' +
                        '</select>' +
                        '<p class="text-xs text-gray-500 mt-1">Clasificación del documento en Academia.</p>' +
                    '</div>' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Fecha de creación</label>' +
                        '<input type="date" id="academiaDocFecha" class="w-full border border-gray-300 rounded-lg p-2">' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">' +
            '<button type="button" id="cancelDocEducativo" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancelar</button>' +
            '<button type="button" id="btnGuardarDocumentoEducativo" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>' +
        '</div>' +
    '</div>';
    var innerBox = modal.querySelector('.modal-academia-doc-inner');
    if (innerBox) {
        innerBox.style.position = 'relative';
        innerBox.style.zIndex = '1';
        innerBox.onclick = function(e) { e.stopPropagation(); };
    }
    modal.onclick = function(e) {
        if (e.target === modal) cerrarModalSubirDocumentoEducativo();
    };

    var appendTarget = document.fullscreenElement || document.body;
    appendTarget.appendChild(modal);

    const fechaEl = document.getElementById('academiaDocFecha');
    if (fechaEl) fechaEl.value = new Date().toISOString().slice(0, 10);

    document.getElementById('closeModalDocEducativo').onclick = cerrarModalSubirDocumentoEducativo;
    document.getElementById('cancelDocEducativo').onclick = cerrarModalSubirDocumentoEducativo;

    const dropZone = document.getElementById('academiaDocDropZone');
    const fileInput = document.getElementById('academiaDocArchivo');
    const fileNameEl = document.getElementById('academiaDocFileName');
    if (dropZone && fileInput) {
        dropZone.onclick = function() { fileInput.click(); };
        dropZone.ondragover = function(e) { e.preventDefault(); dropZone.classList.add('border-blue-400', 'bg-blue-50'); };
        dropZone.ondragleave = function() { dropZone.classList.remove('border-blue-400', 'bg-blue-50'); };
        dropZone.ondrop = function(e) {
            e.preventDefault();
            dropZone.classList.remove('border-blue-400', 'bg-blue-50');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                if (fileNameEl) { fileNameEl.textContent = e.dataTransfer.files[0].name; fileNameEl.classList.remove('hidden'); }
            }
        };
        fileInput.onchange = function() {
            if (fileInput.files.length && fileNameEl) {
                fileNameEl.textContent = fileInput.files[0].name;
                fileNameEl.classList.remove('hidden');
            }
        };
    }

    document.getElementById('btnGuardarDocumentoEducativo').onclick = async function() {
        const nombre = document.getElementById('academiaDocNombre');
        const descripcionEl = document.getElementById('academiaDocDescripcion');
        const archivo = document.getElementById('academiaDocArchivo');
        if (!nombre || !nombre.value.trim()) {
            alert('Escribe el nombre del documento.');
            return;
        }
        if (!descripcionEl || !descripcionEl.value.trim()) {
            alert('Escribe una descripción breve del documento. Es obligatoria para publicar.');
            return;
        }
        const categoriaEl = document.getElementById('academiaDocCategoria');
        if (!categoriaEl || !categoriaEl.value) {
            alert('Selecciona una categoría: Guías y Manuales, Plantillas y Formatos o Videos Tutoriales.');
            return;
        }
        if (!archivo || !archivo.files.length) {
            alert('Selecciona un archivo. Haz clic en la zona de arrastre o arrastra un archivo.');
            return;
        }
        const fd = new FormData();
        fd.append('nombre_archivo', nombre.value.trim());
        fd.append('descripcion', descripcionEl.value.trim().substring(0, 500));
        fd.append('categoria', categoriaEl.value);
        fd.append('fecha_creacion', document.getElementById('academiaDocFecha').value || '');
        fd.append('archivo', archivo.files[0]);
        const btnGuardar = document.getElementById('btnGuardarDocumentoEducativo');
        if (btnGuardar) { btnGuardar.disabled = true; btnGuardar.textContent = 'Guardando...'; }
        try {
            const res = await fetch(API_BASE_URL + '/organizaciones/' + organizacionId + '/academia/documentos', { method: 'POST', body: fd, mode: 'cors' });
            const data = await res.json();
            if (data.success) {
                cerrarModalSubirDocumentoEducativo();
                loadAcademiaDocumentos();
            } else {
                alert(data.error || 'Error al subir');
            }
        } catch (err) {
            alert('Error de conexión');
        } finally {
            if (btnGuardar) { btnGuardar.disabled = false; btnGuardar.textContent = 'Guardar'; }
        }
    };
};

window.cerrarModalSubirDocumentoEducativo = function() {
    const modal = document.getElementById('modalSubirDocumentoEducativo');
    if (modal) modal.remove();
};

window.mostrarModalEditarDocumentoEducativo = function(doc) {
    var existente = document.getElementById('modalEditarDocumentoEducativo');
    if (existente) existente.remove();
    var profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown && profileDropdown.classList) profileDropdown.classList.remove('active');
    if (!organizacionId || !doc) return;
    var fechaStr = '';
    if (doc.fecha_edicion) {
        try {
            var d = new Date(doc.fecha_edicion);
            if (!isNaN(d.getTime())) fechaStr = d.toISOString().slice(0, 10);
        } catch (e) {}
    }
    var modal = document.createElement('div');
    modal.id = 'modalEditarDocumentoEducativo';
    modal.className = 'modal-academia-doc';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;min-height:100vh;z-index:99999;margin:0;padding:80px 16px 16px;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;box-sizing:border-box;';
    modal.innerHTML = '<div class="modal-academia-doc-inner" style="max-width:1024px;width:100%;max-height:calc(100vh - 100px);background:#fff;border-radius:12px;box-shadow:0 25px 50px rgba(0,0,0,0.25);display:flex;flex-direction:column;overflow:hidden;">' +
        '<div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">' +
            '<h2 class="text-2xl font-bold text-gray-900">Editar documento educativo</h2>' +
            '<button type="button" id="closeModalEditarDocEducativo" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>' +
        '</div>' +
        '<div class="flex-1 overflow-y-auto p-6">' +
            '<p class="text-gray-600 mb-4">Solo puedes editar documentos en estado Pendiente o Rechazado. Los campos opcionales se mantienen si no los cambias.</p>' +
            '<div class="mt-4">' +
                '<label class="block text-sm font-medium mb-1">Nombre del documento *</label>' +
                '<input type="text" id="academiaDocEditNombre" required maxlength="255" class="w-full border border-gray-300 rounded-lg p-2" placeholder="Nombre del documento">' +
            '</div>' +
            '<div class="mt-4">' +
                '<label class="block text-sm font-medium mb-1">Descripción breve *</label>' +
                '<textarea id="academiaDocEditDescripcion" required maxlength="500" rows="3" class="w-full border border-gray-300 rounded-lg p-2 resize-y" placeholder="Descripción"></textarea>' +
            '</div>' +
            '<div class="mt-4">' +
                '<label class="block text-sm font-medium mb-1">Categoría *</label>' +
                '<select id="academiaDocEditCategoria" required class="w-full border border-gray-300 rounded-lg p-2">' +
                    '<option value="">Selecciona una categoría</option>' +
                    '<option value="guias_manuales"' + (doc.categoria === 'guias_manuales' ? ' selected' : '') + '>Guías y Manuales</option>' +
                    '<option value="plantillas_formatos"' + (doc.categoria === 'plantillas_formatos' ? ' selected' : '') + '>Plantillas y Formatos</option>' +
                    '<option value="videos_tutoriales"' + (doc.categoria === 'videos_tutoriales' ? ' selected' : '') + '>Videos Tutoriales</option>' +
                '</select>' +
            '</div>' +
            '<div class="mt-4">' +
                '<label class="block text-sm font-medium mb-1">Fecha de creación</label>' +
                '<input type="date" id="academiaDocEditFecha" class="w-full border border-gray-300 rounded-lg p-2" value="' + fechaStr + '">' +
            '</div>' +
            '<div class="mt-4">' +
                '<label class="block text-sm font-medium mb-1">Reemplazar archivo (opcional)</label>' +
                '<p class="text-xs text-gray-500 mb-1">Archivo actual: ' + (doc.archivo_filename || doc.nombre_archivo || '—') + '</p>' +
                '<input type="file" id="academiaDocEditArchivo" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.odt,.ods,.odp,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.m4v" class="w-full border border-gray-300 rounded-lg p-2">' +
            '</div>' +
        '</div>' +
        '<div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">' +
            '<button type="button" id="cancelEditarDocEducativo" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancelar</button>' +
            '<button type="button" id="btnGuardarEditarDocumentoEducativo" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar cambios</button>' +
        '</div>' +
    '</div>';
    var innerBox = modal.querySelector('.modal-academia-doc-inner');
    if (innerBox) {
        innerBox.style.position = 'relative';
        innerBox.style.zIndex = '1';
        innerBox.onclick = function(e) { e.stopPropagation(); };
    }
    modal.onclick = function(e) {
        if (e.target === modal) window.cerrarModalEditarDocumentoEducativo();
    };
    (document.fullscreenElement || document.body).appendChild(modal);

    document.getElementById('academiaDocEditNombre').value = doc.nombre_archivo || doc.archivo_filename || '';
    document.getElementById('academiaDocEditDescripcion').value = doc.descripcion || '';
    if (fechaStr && document.getElementById('academiaDocEditFecha')) document.getElementById('academiaDocEditFecha').value = fechaStr;

    document.getElementById('closeModalEditarDocEducativo').onclick = window.cerrarModalEditarDocumentoEducativo;
    document.getElementById('cancelEditarDocEducativo').onclick = window.cerrarModalEditarDocumentoEducativo;

    document.getElementById('btnGuardarEditarDocumentoEducativo').onclick = async function() {
        var nombreEl = document.getElementById('academiaDocEditNombre');
        var descripcionEl = document.getElementById('academiaDocEditDescripcion');
        var categoriaEl = document.getElementById('academiaDocEditCategoria');
        var fechaEl = document.getElementById('academiaDocEditFecha');
        var archivoEl = document.getElementById('academiaDocEditArchivo');
        if (!nombreEl || !nombreEl.value.trim()) { alert('El nombre del documento es obligatorio.'); return; }
        if (!descripcionEl || !descripcionEl.value.trim()) { alert('La descripción breve es obligatoria.'); return; }
        if (!categoriaEl || !categoriaEl.value) { alert('Selecciona una categoría.'); return; }
        var fd = new FormData();
        fd.append('nombre_archivo', nombreEl.value.trim());
        fd.append('descripcion', descripcionEl.value.trim().substring(0, 500));
        fd.append('categoria', categoriaEl.value);
        fd.append('fecha_creacion', fechaEl ? fechaEl.value : '');
        if (archivoEl && archivoEl.files && archivoEl.files.length > 0) fd.append('archivo', archivoEl.files[0]);
        var btn = document.getElementById('btnGuardarEditarDocumentoEducativo');
        if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
        try {
            var res = await fetch(API_BASE_URL + '/organizaciones/' + organizacionId + '/academia/documentos/' + doc.id, { method: 'PATCH', body: fd, mode: 'cors' });
            var data = await res.json();
            if (data.success) {
                window.cerrarModalEditarDocumentoEducativo();
                loadAcademiaDocumentos();
            } else {
                alert(data.error || 'Error al guardar');
            }
        } catch (err) {
            alert('Error de conexión');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Guardar cambios'; }
        }
    };
};

window.cerrarModalEditarDocumentoEducativo = function() {
    var modal = document.getElementById('modalEditarDocumentoEducativo');
    if (modal) modal.remove();
};

// ==================== BIBLIOTECA (mismo formato que Academia) ====================
let documentosBibliotecaActuales = [];

async function loadBibliotecaDocumentos() {
    const container = document.getElementById('bibliotecaDocumentosContainer');
    if (!container) return;
    if (!organizacionId) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">No hay organización cargada.</div>';
        return;
    }
    container.innerHTML = '<div class="text-center text-gray-500 py-8"><i class="fas fa-spinner fa-spin"></i> Cargando documentos...</div>';
    try {
        const response = await fetch(`${API_BASE_URL}/biblioteca/documentos?organizacion_id=${organizacionId}`, { mode: 'cors' });
        const data = await response.json();
        if (!data.success) {
            container.innerHTML = '<div class="text-center text-red-600 py-8">Error: ' + (data.error || 'No se pudieron cargar los documentos') + '</div>';
            return;
        }
        const docs = data.documentos || [];
        documentosBibliotecaActuales = docs;
        if (docs.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8"><i class="fas fa-book" style="font-size:2rem;opacity:0.4;"></i><p class="mt-2">No hay documentos en la biblioteca.</p><p class="text-sm">Haz clic en "Subir documento" para agregar uno.</p></div>';
            return;
        }
        const formatDate = (iso) => {
            if (!iso) return '—';
            try {
                return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
            } catch (e) { return iso; }
        };
        const escapeHtml = (t) => {
            if (!t) return '';
            const d = document.createElement('div');
            d.textContent = t;
            return d.innerHTML;
        };
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre del archivo</th>
                        <th>Temática</th>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${docs.map(d => `
                        <tr>
                            <td>${escapeHtml(d.nombre_archivo || d.archivo_filename)}</td>
                            <td>${escapeHtml(d.tematica_nombre || '—')}</td>
                            <td>${formatDate(d.fecha_edicion || d.created_at)}</td>
                            <td>${escapeHtml((d.descripcion || '').substring(0, 80))}${(d.descripcion && d.descripcion.length > 80) ? '...' : ''}</td>
                            <td>
                                <a href="${API_BASE_URL}/biblioteca/documentos/${d.id}/descargar" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.25rem 0.5rem;font-size:0.875rem;"><i class="fas fa-download"></i> Descargar</a>
                                <button type="button" class="btn-danger" style="padding:0.25rem 0.5rem;font-size:0.875rem;" data-doc-id="${d.id}" data-biblioteca-eliminar><i class="fas fa-trash"></i> Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        container.querySelectorAll('[data-biblioteca-eliminar]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-doc-id');
                if (!confirm('¿Eliminar este documento?')) return;
                try {
                    const res = await fetch(`${API_BASE_URL}/biblioteca/documentos/${id}`, { method: 'DELETE', mode: 'cors' });
                    const r = await res.json();
                    if (r.success) loadBibliotecaDocumentos();
                    else alert(r.error || 'Error al eliminar');
                } catch (e) {
                    alert('Error de conexión');
                }
            });
        });
    } catch (err) {
        console.error('Error cargando documentos Biblioteca:', err);
        container.innerHTML = '<div class="text-center text-red-600 py-8">Error de conexión. Vuelve a intentar.</div>';
    }
}

function setupBibliotecaDocumentos() {
    const btnSubir = document.getElementById('btnSubirDocumentoBiblioteca');
    if (btnSubir) {
        btnSubir.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.mostrarModalSubirDocumentoBiblioteca === 'function') {
                window.mostrarModalSubirDocumentoBiblioteca();
            }
            return false;
        });
    }
}

window.mostrarModalSubirDocumentoBiblioteca = function() {
    const existente = document.getElementById('modalSubirDocumentoBiblioteca');
    if (existente) existente.remove();
    var profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown && profileDropdown.classList) profileDropdown.classList.remove('active');
    if (!organizacionId) {
        alert('Error: No se encontró la organización. Por favor, recarga la página.');
        return;
    }
    const modal = document.createElement('div');
    modal.id = 'modalSubirDocumentoBiblioteca';
    modal.className = 'modal-biblioteca-doc';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;min-height:100vh;z-index:99999;margin:0;padding:80px 16px 16px;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;box-sizing:border-box;';
    modal.innerHTML = '<div class="modal-biblioteca-doc-inner" style="max-width:1024px;width:100%;max-height:calc(100vh - 100px);background:#fff;border-radius:12px;box-shadow:0 25px 50px rgba(0,0,0,0.25);display:flex;flex-direction:column;overflow:hidden;">' +
        '<div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">' +
            '<h2 class="text-2xl font-bold text-gray-900">Subir documento a Biblioteca</h2>' +
            '<button type="button" id="closeModalDocBiblioteca" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>' +
        '</div>' +
        '<div class="flex flex-1 overflow-hidden">' +
            '<div class="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">' +
                '<div class="p-4">' +
                    '<h3 class="text-sm font-semibold text-gray-500 uppercase mb-2 px-3">Documento</h3>' +
                    '<nav class="space-y-1">' +
                        '<button type="button" class="w-full text-left px-3 py-2 rounded-lg bg-blue-100 text-blue-800 font-medium flex items-center gap-2">' +
                            '<span>📄</span> Subir documento' +
                        '</button>' +
                    '</nav>' +
                '</div>' +
            '</div>' +
            '<div class="flex-1 overflow-y-auto bg-white">' +
                '<div class="p-6">' +
                    '<h3 class="text-xl font-semibold mb-4">Subir documento a Biblioteca</h3>' +
                    '<p class="text-gray-600 mb-6">Sube un documento para que los voluntarios puedan consultarlo en la Biblioteca. Indica nombre, descripción y temática.</p>' +
                    '<div id="bibliotecaDocDropZone" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">' +
                        '<div class="flex flex-col items-center gap-3">' +
                            '<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>' +
                            '<p class="text-sm text-gray-600"><span class="font-semibold text-blue-600">Haz clic para seleccionar</span> o arrastra un archivo aquí</p>' +
                            '<p class="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX, etc.</p>' +
                            '<p id="bibliotecaDocFileName" class="text-sm text-green-600 font-medium hidden"></p>' +
                        '</div>' +
                    '</div>' +
                    '<input type="file" id="bibliotecaDocArchivo" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.odt,.ods,.odp" class="hidden">' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Nombre del documento *</label>' +
                        '<input type="text" id="bibliotecaDocNombre" required maxlength="255" placeholder="Ej: Manual de voluntariado 2024" class="w-full border border-gray-300 rounded-lg p-2">' +
                    '</div>' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Descripción breve</label>' +
                        '<textarea id="bibliotecaDocDescripcion" maxlength="500" rows="3" placeholder="Describe el contenido (máx. 500 caracteres)" class="w-full border border-gray-300 rounded-lg p-2 resize-y"></textarea>' +
                    '</div>' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Temática</label>' +
                        '<select id="bibliotecaDocTematica" class="w-full border border-gray-300 rounded-lg p-2">' +
                            '<option value="">Sin temática</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Autor</label>' +
                        '<input type="text" id="bibliotecaDocAutor" maxlength="150" placeholder="Nombre del autor" class="w-full border border-gray-300 rounded-lg p-2">' +
                    '</div>' +
                    '<div class="mt-4">' +
                        '<label class="block text-sm font-medium mb-1">Fecha de edición</label>' +
                        '<input type="date" id="bibliotecaDocFecha" class="w-full border border-gray-300 rounded-lg p-2">' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">' +
            '<button type="button" id="cancelDocBiblioteca" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancelar</button>' +
            '<button type="button" id="btnGuardarDocumentoBiblioteca" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>' +
        '</div>' +
    '</div>';
    var innerBox = modal.querySelector('.modal-biblioteca-doc-inner');
    if (innerBox) {
        innerBox.style.position = 'relative';
        innerBox.style.zIndex = '1';
        innerBox.onclick = function(e) { e.stopPropagation(); };
    }
    modal.onclick = function(e) {
        if (e.target === modal) window.cerrarModalSubirDocumentoBiblioteca();
    };
    (document.fullscreenElement || document.body).appendChild(modal);

    const fechaEl = document.getElementById('bibliotecaDocFecha');
    if (fechaEl) fechaEl.value = new Date().toISOString().slice(0, 10);

    document.getElementById('closeModalDocBiblioteca').onclick = window.cerrarModalSubirDocumentoBiblioteca;
    document.getElementById('cancelDocBiblioteca').onclick = window.cerrarModalSubirDocumentoBiblioteca;

    // Cargar temáticas
    (async function() {
        try {
            const res = await fetch(API_BASE_URL + '/biblioteca/tematicas', { mode: 'cors' });
            const data = await res.json();
            const sel = document.getElementById('bibliotecaDocTematica');
            if (sel && data.success && data.tematicas && data.tematicas.length) {
                data.tematicas.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.id;
                    opt.textContent = t.nombre;
                    sel.appendChild(opt);
                });
            }
        } catch (e) { console.warn('No se pudieron cargar temáticas:', e); }
    })();

    const dropZone = document.getElementById('bibliotecaDocDropZone');
    const fileInput = document.getElementById('bibliotecaDocArchivo');
    const fileNameEl = document.getElementById('bibliotecaDocFileName');
    if (dropZone && fileInput) {
        dropZone.onclick = function() { fileInput.click(); };
        dropZone.ondragover = function(e) { e.preventDefault(); dropZone.classList.add('border-blue-400', 'bg-blue-50'); };
        dropZone.ondragleave = function() { dropZone.classList.remove('border-blue-400', 'bg-blue-50'); };
        dropZone.ondrop = function(e) {
            e.preventDefault();
            dropZone.classList.remove('border-blue-400', 'bg-blue-50');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                if (fileNameEl) { fileNameEl.textContent = e.dataTransfer.files[0].name; fileNameEl.classList.remove('hidden'); }
            }
        };
        fileInput.onchange = function() {
            if (fileInput.files.length && fileNameEl) {
                fileNameEl.textContent = fileInput.files[0].name;
                fileNameEl.classList.remove('hidden');
            }
        };
    }

    document.getElementById('btnGuardarDocumentoBiblioteca').onclick = async function() {
        const nombre = document.getElementById('bibliotecaDocNombre');
        const archivo = document.getElementById('bibliotecaDocArchivo');
        if (!nombre || !nombre.value.trim()) {
            alert('Escribe el nombre del documento.');
            return;
        }
        if (!archivo || !archivo.files.length) {
            alert('Selecciona un archivo. Haz clic en la zona de arrastre o arrastra un archivo.');
            return;
        }
        const fd = new FormData();
        fd.append('nombre_archivo', nombre.value.trim());
        fd.append('descripcion', (document.getElementById('bibliotecaDocDescripcion') && document.getElementById('bibliotecaDocDescripcion').value) ? document.getElementById('bibliotecaDocDescripcion').value.trim().substring(0, 500) : '');
        fd.append('autor', (document.getElementById('bibliotecaDocAutor') && document.getElementById('bibliotecaDocAutor').value) ? document.getElementById('bibliotecaDocAutor').value.trim().substring(0, 150) : '');
        const tematicaId = document.getElementById('bibliotecaDocTematica');
        if (tematicaId && tematicaId.value) fd.append('tematica_id', tematicaId.value);
        fd.append('organizacion_id', organizacionId);
        fd.append('fecha_edicion', document.getElementById('bibliotecaDocFecha').value || '');
        fd.append('archivo', archivo.files[0]);
        const btnGuardar = document.getElementById('btnGuardarDocumentoBiblioteca');
        if (btnGuardar) { btnGuardar.disabled = true; btnGuardar.textContent = 'Guardando...'; }
        try {
            const res = await fetch(API_BASE_URL + '/biblioteca/documentos', { method: 'POST', body: fd, mode: 'cors' });
            const data = await res.json();
            if (data.success) {
                window.cerrarModalSubirDocumentoBiblioteca();
                loadBibliotecaDocumentos();
            } else {
                alert(data.error || 'Error al subir');
            }
        } catch (err) {
            alert('Error de conexión');
        } finally {
            if (btnGuardar) { btnGuardar.disabled = false; btnGuardar.textContent = 'Guardar'; }
        }
    };
};

window.cerrarModalSubirDocumentoBiblioteca = function() {
    const modal = document.getElementById('modalSubirDocumentoBiblioteca');
    if (modal) modal.remove();
};

// Cargar reseñas de usuarios sobre la organización
async function loadReseñas() {
    if (!organizacionId) {
        console.warn('No hay organizacionId, no se puede cargar reseñas');
        return;
    }
    
    const container = document.getElementById('reseñasContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="text-center text-gray-500 py-8">Cargando reseñas...</div>';
    
    try {
        // Cargar oportunidades para el filtro
        const opResponse = await fetch(`${API_BASE_URL}/oportunidades?organizacion_id=${organizacionId}`, {
            mode: 'cors'
        });
        const opData = await opResponse.json();
        
        if (opData.success) {
            const selectOportunidad = document.getElementById('filtroOportunidadReseñas');
            if (selectOportunidad) {
                selectOportunidad.innerHTML = '<option value="todas">Todas las oportunidades</option>' +
                    opData.oportunidades.map(op => 
                        `<option value="${op.id}">${op.titulo}</option>`
                    ).join('');
            }
        }
        
        // Cargar reseñas (todas para el dashboard interno)
        const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}/reseñas?solo_publicas=false`, {
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            mostrarReseñas(data.reseñas_por_voluntariado || []);
        } else {
            container.innerHTML = `<div class="text-center text-red-600 py-8">Error al cargar reseñas: ${data.error || 'Error desconocido'}</div>`;
        }
    } catch (error) {
        console.error('Error cargando reseñas:', error);
        container.innerHTML = `<div class="text-center text-red-600 py-8">Error de conexión al cargar las reseñas. Verifica tu conexión a internet.</div>`;
    }
}

// Estrellas con Font Awesome (evita emojis + recorte 0.5em que desalinea medias)
function generarEstrellasReseñas(calificacion) {
    const cal = Math.max(0, Math.min(5, Number(calificacion)));
    if (Number.isNaN(cal) || cal <= 0) return '';
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (cal >= i) {
            html += '<i class="fas fa-star" style="color:#fbbf24;flex-shrink:0" aria-hidden="true"></i>';
        } else if (cal >= i - 0.5) {
            html += '<i class="fas fa-star-half-stroke" style="color:#fbbf24;flex-shrink:0" aria-hidden="true"></i>';
        } else {
            html += '<i class="far fa-star" style="color:#d1d5db;flex-shrink:0" aria-hidden="true"></i>';
        }
    }
    return html;
}

// Mostrar reseñas organizadas por voluntariado
function mostrarReseñas(reseñasPorVoluntariado) {
    const container = document.getElementById('reseñasContainer');
    if (!container) return;
    
    if (reseñasPorVoluntariado.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">Aún no tienes reseñas de voluntarios.</div>';
        return;
    }
    
    // Filtrar según los filtros seleccionados
    const filtroOportunidad = document.getElementById('filtroOportunidadReseñas')?.value || 'todas';
    const filtroCalificacion = document.getElementById('filtroCalificacionReseñas')?.value || 'todas';
    
    let reseñasFiltradas = reseñasPorVoluntariado;
    
    if (filtroOportunidad !== 'todas') {
        const oportunidadId = parseInt(filtroOportunidad);
        reseñasFiltradas = reseñasFiltradas.filter(item => item.oportunidad_id === oportunidadId);
    }
    
    // Aplicar filtro de calificación
    if (filtroCalificacion !== 'todas') {
        const calificacionMinima = parseInt(filtroCalificacion);
        reseñasFiltradas = reseñasFiltradas.map(item => ({
            ...item,
            reseñas: item.reseñas.filter(reseña => 
                reseña.calificacion !== null && reseña.calificacion !== undefined &&
                Math.floor(reseña.calificacion) === calificacionMinima
            )
        })).filter(item => item.reseñas.length > 0);
    }
    
    if (reseñasFiltradas.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">No hay reseñas que coincidan con los filtros seleccionados.</div>';
        return;
    }
    
    // Generar HTML
    container.innerHTML = reseñasFiltradas.map(voluntariado => {
        const reseñasHTML = voluntariado.reseñas.map(reseña => {
            const fechaReseña = reseña.fecha_postulacion 
                ? new Date(reseña.fecha_postulacion).toLocaleDateString('es-CL', { 
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                }) 
                : 'Fecha no disponible';
            
            const estrellasHtml = reseña.calificacion !== null && reseña.calificacion !== undefined 
                ? generarEstrellasReseñas(reseña.calificacion) 
                : '';
            
            const esPublica = reseñaEsPublicaParaMostrar(reseña.es_publica);
            return `
                <div class="reseña-item" style="border-left: 3px solid #3b82f6; padding: 16px; margin-bottom: 16px; background: #f9fafb; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <h4 style="font-weight: 600; color: #1f2937; margin: 0;">${reseña.usuario_nombre}</h4>
                                <span class="badge-visibilidad" style="font-size: 11px; padding: 2px 8px; border-radius: 12px; ${esPublica ? 'background: #dbeafe; color: #1e40af;' : 'background: #f3f4f6; color: #4b5563;'}">
                                    ${esPublica ? '🌐 Pública' : '🔒 Privada'}
                                </span>
                            </div>
                            <p style="font-size: 12px; color: #6b7280; margin: 0;">${fechaReseña}</p>
                        </div>
                        ${estrellasHtml ? `
                            <div style="text-align: right; margin-left: 16px; flex-shrink: 0;">
                                <div style="font-size: 18px; line-height: 1; display: flex; align-items: center; justify-content: flex-end; gap: 2px; flex-wrap: nowrap;">${estrellasHtml}</div>
                                <span style="font-size: 14px; color: #6b7280; font-weight: 500;">${reseña.calificacion.toFixed(1)}/5.0</span>
                            </div>
                        ` : ''}
                    </div>
                    ${reseña.reseña ? `
                        <p style="color: #374151; line-height: 1.6; font-style: italic; margin-bottom: 12px;">"${reseña.reseña}"</p>
                    ` : ''}
                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        <button onclick="cambiarVisibilidadResenaOrg(${reseña.postulacion_id}, ${!esPublica})" 
                                class="btn-toggle-visibilidad" 
                                style="padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; ${esPublica ? 'background: #fee2e2; color: #991b1b;' : 'background: #dbeafe; color: #1e40af;'}"
                                title="${esPublica ? 'Hacer privada' : 'Hacer pública'}">
                            ${esPublica ? '🔒 Hacer Privada' : '🌐 Hacer Pública'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Calcular promedio de calificaciones
        const calificaciones = voluntariado.reseñas
            .map(r => r.calificacion)
            .filter(c => c !== null && c !== undefined);
        const promedio = calificaciones.length > 0 
            ? (calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length).toFixed(1)
            : null;
        
        return `
            <div class="voluntariado-reseñas-card" style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb;">
                    <div>
                        <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 4px;">${voluntariado.oportunidad_titulo}</h3>
                        <p style="font-size: 14px; color: #6b7280;">${voluntariado.reseñas.length} ${voluntariado.reseñas.length === 1 ? 'reseña' : 'reseñas'}</p>
                    </div>
                    ${promedio ? `
                        <div style="text-align: center; padding: 12px 20px; background: #eff6ff; border-radius: 8px;">
                            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Promedio</div>
                            <div style="font-size: 24px; font-weight: 700; color: #2563eb;">${promedio}</div>
                            <div style="font-size: 12px; color: #6b7280;">/ 5.0</div>
                        </div>
                    ` : ''}
                </div>
                <div class="reseñas-list">
                    ${reseñasHTML}
                </div>
            </div>
        `;
    }).join('');
    
    // Agregar event listeners a los filtros
    const selectOportunidad = document.getElementById('filtroOportunidadReseñas');
    const selectCalificacion = document.getElementById('filtroCalificacionReseñas');
    
    if (selectOportunidad) {
        selectOportunidad.removeEventListener('change', loadReseñas);
        selectOportunidad.addEventListener('change', loadReseñas);
    }
    
    if (selectCalificacion) {
        selectCalificacion.removeEventListener('change', () => {
            mostrarReseñas(window.reseñasDataActual || []);
        });
        selectCalificacion.addEventListener('change', () => {
            mostrarReseñas(window.reseñasDataActual || []);
        });
    }
    
    // Guardar datos actuales para el filtro
    window.reseñasDataActual = reseñasPorVoluntariado;
}

// Función para cambiar la visibilidad de una reseña (pública/privada)
window.cambiarVisibilidadResenaOrg = async function(postulacionId, nuevaVisibilidad) {
    if (!organizacionId) {
        alert('Error: No se pudo identificar la organización');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/resena-visibilidad`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                es_publica: nuevaVisibilidad,
                organizacion_id: organizacionId
            }),
            mode: 'cors'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Recargar las reseñas para actualizar la vista
            await loadReseñas();
        } else {
            alert('Error al cambiar la visibilidad: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error cambiando visibilidad de reseña:', error);
        alert('Error de conexión al cambiar la visibilidad de la reseña');
    }
};

// Generar reporte Excel
document.addEventListener('DOMContentLoaded', function() {
    const btnGenerar = document.getElementById('btnGenerarReporte');
    if (btnGenerar) {
        btnGenerar.addEventListener('click', async () => {
            const fechaInicio = document.getElementById('fechaInicioReporte')?.value;
            const fechaFin = document.getElementById('fechaFinReporte')?.value;
            const oportunidadId = document.getElementById('filtroOportunidadReporte')?.value;
            
            try {
                const params = new URLSearchParams({
                    organizacion_id: organizacionId
                });
                if (fechaInicio) params.append('fecha_inicio', fechaInicio);
                if (fechaFin) params.append('fecha_fin', fechaFin);
                if (oportunidadId && oportunidadId !== 'todas') {
                    params.append('oportunidad_id', oportunidadId);
                }
                
                const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}/reporte-impacto?${params}`, {
                    mode: 'cors'
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `reporte-impacto-${new Date().toISOString().split('T')[0]}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } else {
                    alert('Error al generar el reporte. El endpoint puede no estar implementado aún.');
                }
            } catch (error) {
                console.error('Error generando reporte:', error);
                alert('Error al generar el reporte');
            }
        });
    }
});

// ==================== MODALES ====================

function verDetallesPostulacion(postulacionId) {
    const postulacion = postulacionesData.find(p => p.id === postulacionId);
    if (!postulacion) return;
    
    const modal = document.getElementById('modalPostulacion');
    const body = document.getElementById('modalPostulacionBody');
    const btnAprobar = document.getElementById('btnAprobarPostulacion');
    const btnRechazar = document.getElementById('btnRechazarPostulacion');
    
    body.innerHTML = `
        <div class="postulacion-details">
            <h3>Información del Voluntario</h3>
            <p><strong>Nombre:</strong> ${postulacion.usuario_nombre_completo || 'N/A'}</p>
            <p><strong>Email:</strong> ${postulacion.usuario_email || 'N/A'}</p>
            <p><strong>Teléfono:</strong> ${postulacion.usuario_telefono || 'N/A'}</p>
            <p><strong>Región:</strong> ${postulacion.usuario_region || 'N/A'}</p>
            <p><strong>Comuna:</strong> ${postulacion.usuario_comuna || 'N/A'}</p>
            
            <h3 style="margin-top: 20px;">Información de la Postulación</h3>
            <p><strong>Oportunidad:</strong> ${postulacion.oportunidad_titulo || 'N/A'}</p>
            <p><strong>Estado:</strong> <span class="badge badge-${postulacion.estado.toLowerCase()}">${postulacion.estado}</span></p>
            <p><strong>Fecha de Postulación:</strong> ${postulacion.created_at ? new Date(postulacion.created_at).toLocaleString('es-CL') : 'N/A'}</p>
            
            ${postulacion.estado === 'Seleccionado' ? `
                <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                    <h4 style="margin-bottom: 10px; font-size: 16px; font-weight: 600;">Seguimiento</h4>
                    <p><strong>Asistencia Capacitación:</strong> ${postulacion.asistencia_capacitacion === true || postulacion.asistencia_capacitacion === 'Sí' || postulacion.asistencia_capacitacion === 'Si' ? 'Sí' : 'No'}</p>
                    <p><strong>Asistencia Actividad:</strong> ${postulacion.asistencia_actividad === true || postulacion.asistencia_actividad === 'Sí' || postulacion.asistencia_actividad === 'Si' ? 'Sí' : 'No'}</p>
                    <p><strong>Horas de Voluntariado:</strong> ${postulacion.horas_voluntariado || 0} horas</p>
                    <p><strong>Calificación:</strong> ${postulacion.calificacion_org ? `${postulacion.calificacion_org}/5` : 'Sin calificar'}</p>
                    <p><strong>Certificado:</strong> ${postulacion.tiene_certificado ? '✓ Emitido' : 'Pendiente'}</p>
                    ${postulacion.resena_org_sobre_voluntario ? `
                        <div style="margin-top: 10px;">
                            <strong>Reseña:</strong>
                            <p style="margin-top: 5px; font-style: italic;">${postulacion.resena_org_sobre_voluntario}</p>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `;
    
    // Normalizar el estado para comparación
    const estadoNormalizado = (postulacion.estado || '').toLowerCase();
    const esPendiente = estadoNormalizado.includes('pendiente');
    const esSeleccionado = estadoNormalizado.includes('seleccionado');
    const esRechazado = estadoNormalizado.includes('rechazado');
    
    // Limpiar botones anteriores si existen
    const footer = modal.querySelector('.modal-footer');
    const botonesExistentes = footer.querySelectorAll('button[data-action]');
    botonesExistentes.forEach(btn => btn.remove());
    
    if (esPendiente) {
        // Postulación pendiente: mostrar botones aprobar y rechazar
        btnAprobar.style.display = 'inline-flex';
        btnRechazar.style.display = 'inline-flex';
        
        btnAprobar.onclick = () => {
            actualizarEstadoPostulacion(postulacionId, 'Seleccionado');
        };
        btnRechazar.onclick = () => {
            actualizarEstadoPostulacion(postulacionId, 'Rechazado');
        };
    } else if (esSeleccionado) {
        // Postulación seleccionada: mostrar botón gestionar y opción de rechazar
        btnAprobar.style.display = 'none';
        btnRechazar.style.display = 'inline-flex';
        btnRechazar.onclick = () => {
            actualizarEstadoPostulacion(postulacionId, 'Rechazado');
        };
        
        // Agregar botón para gestionar seguimiento
        const btnGestionar = document.createElement('button');
        btnGestionar.className = 'btn-primary';
        btnGestionar.setAttribute('data-action', 'gestionar');
        btnGestionar.innerHTML = '<i class="fas fa-edit"></i> Gestionar Seguimiento';
        btnGestionar.onclick = () => {
            cerrarModal('modalPostulacion');
            abrirModalSeguimiento(postulacionId, postulacion.usuario_id);
        };
        btnGestionar.style.marginLeft = '10px';
        footer.insertBefore(btnGestionar, footer.querySelector('.btn-secondary'));
    } else if (esRechazado) {
        // Postulación rechazada: mostrar opción de aprobar
        btnAprobar.style.display = 'inline-flex';
        btnRechazar.style.display = 'none';
        
        btnAprobar.onclick = () => {
            actualizarEstadoPostulacion(postulacionId, 'Seleccionado');
        };
    } else {
        // Estado desconocido: ocultar botones
        btnAprobar.style.display = 'none';
        btnRechazar.style.display = 'none';
    }
    
    modal.style.display = 'block';
}

async function abrirModalSeguimiento(postulacionId, usuarioIdParam = null) {
    let seguimiento = seguimientoData.find(s => s.id === postulacionId);
    if (!seguimiento) {
        // Si no está en seguimientoData, buscar en postulacionesData
        let postulacion = postulacionesData.find(p => p.id === postulacionId);
        
        // Si no está en postulacionesData, intentar cargarlo desde la API
        if (!postulacion) {
            try {
                const response = await fetch(`${API_BASE_URL}/oportunidades/${postulacionId}/postulaciones`, {
                    mode: 'cors'
                });
                const data = await response.json();
                if (data.success && data.postulaciones) {
                    postulacion = data.postulaciones.find(p => p.id === postulacionId);
                }
            } catch (error) {
                console.error('Error cargando postulación:', error);
            }
        }
        
        if (!postulacion) {
            alert('No se encontró la postulación');
            return;
        }
        
        if (postulacion.estado !== 'Seleccionado') {
            alert('Solo se puede gestionar el seguimiento de postulaciones seleccionadas');
            return;
        }
        
        // Crear objeto seguimiento desde postulacion
        seguimiento = {
            ...postulacion,
            oportunidad_titulo: postulacion.oportunidad_titulo || 'N/A',
            horas_voluntariado: postulacion.horas_voluntariado || 0,
            usuario_id: usuarioIdParam || postulacion.usuario_id
        };
    } else {
        // Asegurar que usuario_id esté presente
        if (usuarioIdParam) {
            seguimiento.usuario_id = usuarioIdParam;
        }
    }
    
    const modal = document.getElementById('modalSeguimiento');
    const body = document.getElementById('modalSeguimientoBody');
    
    // Obtener horas de esta postulación específica (no las horas totales del usuario)
    // Las horas están en seguimiento.horas_voluntariado si ya fueron guardadas
    let horasPostulacionActuales = seguimiento.horas_voluntariado || 0;
    const usuarioId = usuarioIdParam || seguimiento.usuario_id;
    
    // Si no hay horas en seguimiento, intentar obtenerlas de la API
    if (horasPostulacionActuales === 0 && postulacionId) {
        try {
            // Buscar en postulacionesData o seguimientoData primero
            const postEnData = postulacionesData.find(p => p.id === postulacionId) || 
                              seguimientoData.find(s => s.id === postulacionId);
            if (postEnData && postEnData.horas_voluntariado) {
                horasPostulacionActuales = postEnData.horas_voluntariado;
            }
        } catch (error) {
            console.error('Error obteniendo horas de la postulación:', error);
        }
    }
    
    console.log('Horas de esta postulación específica:', horasPostulacionActuales);
    
    body.innerHTML = `
        <div class="seguimiento-form">
            <h3>${seguimiento.usuario_nombre_completo || 'N/A'}</h3>
            <p><strong>Oportunidad:</strong> ${seguimiento.oportunidad_titulo || 'N/A'}</p>
            <p><strong>Email:</strong> ${seguimiento.usuario_email || 'N/A'}</p>
            
            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <h4 style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Confirmación de Participación</h4>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Estado de confirmación:</label>
                    <select id="estadoConfirmacion" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%;">
                        <option value="Pendiente" ${(seguimiento.estado_confirmacion || 'Pendiente') === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Confirmado" ${seguimiento.estado_confirmacion === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                        <option value="No confirmado" ${seguimiento.estado_confirmacion === 'No confirmado' ? 'selected' : ''}>No confirmado</option>
                    </select>
                    <p style="font-size: 12px; color: #6b7280; margin-top: 5px; margin: 0;">
                        <i class="fas fa-info-circle"></i> El estado se actualiza automáticamente cuando el voluntario confirma vía enlace, o puede marcarse manualmente aquí.
                    </p>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <h4 style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Asistencia</h4>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Asistencia a Capacitación:</label>
                    <select id="asistenciaCapacitacion" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%;">
                        <option value="Sí" ${seguimiento.asistencia_capacitacion === true || seguimiento.asistencia_capacitacion === 'Sí' || seguimiento.asistencia_capacitacion === 'Si' ? 'selected' : ''}>Sí</option>
                        <option value="No" ${seguimiento.asistencia_capacitacion === false || seguimiento.asistencia_capacitacion === 'No' ? 'selected' : ''}>No</option>
                        <option value="No aplica" ${!seguimiento.asistencia_capacitacion || seguimiento.asistencia_capacitacion === 'No aplica' ? 'selected' : ''}>No aplica</option>
                    </select>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Asistencia a Actividad:</label>
                    <select id="asistenciaActividad" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%;">
                        <option value="Sí" ${seguimiento.asistencia_actividad === true || seguimiento.asistencia_actividad === 'Sí' || seguimiento.asistencia_actividad === 'Si' ? 'selected' : ''}>Sí</option>
                        <option value="No" ${seguimiento.asistencia_actividad === false || seguimiento.asistencia_actividad === 'No' ? 'selected' : ''}>No</option>
                        <option value="No aplica" ${!seguimiento.asistencia_actividad || seguimiento.asistencia_actividad === 'No aplica' ? 'selected' : ''}>No aplica</option>
                    </select>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <h4 style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Horas de Voluntariado</h4>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <label style="flex: 1;">Horas completadas en esta oportunidad:</label>
                    <input type="number" id="horasVoluntariado" min="0" step="0.5" value="${horasPostulacionActuales}" style="width: 120px; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">
                    <span style="color: #6b7280; font-size: 14px;">horas</span>
                </div>
                <p style="font-size: 12px; color: #6b7280; margin: 0;">
                    <i class="fas fa-info-circle"></i> Ingresa las horas que el voluntario completó en esta oportunidad específica. Se guardarán en esta postulación y se sumarán automáticamente a sus horas totales.
                </p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <h4 style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Evaluación</h4>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Calificación (1-5):</label>
                    <input type="number" id="calificacionOrg" min="1" max="5" step="0.1" value="${seguimiento.calificacion_org || ''}" style="width: 120px; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">¿Desea dejar una reseña sobre el voluntario?</label>
                    <select id="tieneResena" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%; margin-bottom: 10px;">
                        <option value="no" ${!seguimiento.resena_org_sobre_voluntario ? 'selected' : ''}>No</option>
                        <option value="si" ${seguimiento.resena_org_sobre_voluntario ? 'selected' : ''}>Sí</option>
                    </select>
                    
                    <div id="resenaFields" style="display: ${seguimiento.resena_org_sobre_voluntario ? 'block' : 'none'};">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Reseña sobre el voluntario:</label>
                        <textarea id="resenaOrg" rows="4" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-family: inherit; resize: vertical;">${seguimiento.resena_org_sobre_voluntario || ''}</textarea>
                        
                        <div style="margin-top: 10px;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="resenaPublica" ${seguimiento.resena_org_publica ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                                <span>Marcar reseña como pública (visible en el perfil del voluntario)</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <h4 style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Certificado</h4>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="tieneCertificado" ${seguimiento.tiene_certificado ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;" onchange="toggleCertificadoUpload()">
                        <span>Emitir certificado de participación</span>
                    </label>
                </div>
                
                <!-- Sección para subir certificado (se muestra cuando el checkbox está marcado) -->
                <div id="certificadoUploadSection" style="margin-top: 15px; ${seguimiento.tiene_certificado ? '' : 'display: none;'}">
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px;">Subir certificado (PDF):</label>
                        <input type="file" id="certificadoFile" accept=".pdf" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        <p style="font-size: 12px; color: #6b7280; margin-top: 5px; margin: 0;">
                            <i class="fas fa-info-circle"></i> Selecciona un archivo PDF del certificado.
                        </p>
                    </div>
                    <button type="button" onclick="subirCertificado(${postulacionId})" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px;">
                        <i class="fas fa-upload"></i> Subir Certificado
                    </button>
                </div>
                
                ${seguimiento.tiene_certificado && seguimiento.ruta_certificado_pdf ? `
                    <div style="margin-top: 15px; padding: 10px; background: #dbeafe; border-radius: 6px;">
                        <p style="margin: 0; font-size: 14px; color: #1e40af; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-check-circle"></i> Certificado subido exitosamente
                        </p>
                        <a href="${API_BASE_URL}/postulaciones/${postulacionId}/certificado/descargar" target="_blank" style="display: inline-block; margin-top: 8px; color: #2563eb; text-decoration: underline; font-size: 14px;">
                            <i class="fas fa-download"></i> Descargar certificado
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Capturar usuario_id para usar en el onclick
    const userIdFinal = seguimiento.usuario_id || usuarioIdParam;
    
    // Configurar evento del select de reseña
    const tieneResenaSelect = document.getElementById('tieneResena');
    if (tieneResenaSelect) {
        tieneResenaSelect.onchange = function() {
            const tieneResena = this.value;
            const resenaFields = document.getElementById('resenaFields');
            if (resenaFields) {
                resenaFields.style.display = tieneResena === 'si' ? 'block' : 'none';
                if (tieneResena === 'no') {
                    const resenaOrg = document.getElementById('resenaOrg');
                    const resenaPublica = document.getElementById('resenaPublica');
                    if (resenaOrg) resenaOrg.value = '';
                    if (resenaPublica) resenaPublica.checked = false;
                }
            }
        };
    }
    
    const btnGuardar = document.getElementById('btnGuardarSeguimiento');
    if (btnGuardar) {
        btnGuardar.onclick = () => {
            guardarSeguimiento(postulacionId, userIdFinal);
        };
    }
    
    modal.style.display = 'block';
}

async function actualizarEstadoPostulacion(postulacionId, nuevoEstado) {
    const estado = (nuevoEstado || '').trim();
    const esAprobar = estado === 'Seleccionado';
    const esRechazar = estado === 'Rechazado' || estado === 'No seleccionado';

    // Solo confirmar en acciones críticas (aprobar / rechazar)
    if (esAprobar) {
        if (!confirm('¿Estás seguro de que deseas aprobar esta postulación?')) return;
    } else if (esRechazar) {
        if (!confirm('¿Estás seguro de que deseas rechazar esta postulación?')) return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado }),
            mode: 'cors'
        });
        
        const data = await response.json();
        if (data.success) {
            // Actualizar en postulacionesData
            const postulacionIndex = postulacionesData.findIndex(p => p.id === postulacionId);
            if (postulacionIndex !== -1) {
                postulacionesData[postulacionIndex].estado = nuevoEstado;
            }
            
            // Si se seleccionó, agregarlo a seguimientoData si no existe
            if (nuevoEstado === 'Seleccionado') {
                const postulacion = postulacionesData.find(p => p.id === postulacionId);
                if (postulacion) {
                    const postulacionExistente = seguimientoData.find(s => s.id === postulacionId);
                    if (!postulacionExistente) {
                        // Buscar la oportunidad para obtener su título
                        const oportunidad = oportunidadesData.find(op => op.id === postulacion.oportunidad_id);
                        seguimientoData.push({
                            ...postulacion,
                            oportunidad_titulo: oportunidad?.titulo || 'N/A',
                            oportunidad_id: postulacion.oportunidad_id
                        });
                    }
                }
            } else {
                // Si se rechazó, remover de seguimientoData
                const seguimientoIndex = seguimientoData.findIndex(s => s.id === postulacionId);
                if (seguimientoIndex !== -1) {
                    seguimientoData.splice(seguimientoIndex, 1);
                }
            }
            
            if (esAprobar) {
                alert('Postulación aprobada exitosamente');
            } else if (esRechazar) {
                alert('Postulación rechazada exitosamente');
            } else {
                alert(`Estado actualizado a "${estado}"`);
            }
            cerrarModal('modalPostulacion');
            
            // Recargar las secciones afectadas
            if (typeof loadPostulaciones === 'function') {
                loadPostulaciones();
            }
            if (typeof loadSeguimiento === 'function') {
                loadSeguimiento();
            }
            if (typeof renderHistorialOportunidades === 'function') {
                renderHistorialOportunidades();
            }
        } else {
            alert('Error al actualizar el estado: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error actualizando estado:', error);
        alert('Error al actualizar el estado');
    }
}

async function guardarSeguimiento(postulacionId, usuarioId) {
    const asistenciaCapacitacion = document.getElementById('asistenciaCapacitacion').value || 'No aplica';
    const asistenciaActividad = document.getElementById('asistenciaActividad').value || 'No aplica';
    const estadoConfirmacion = document.getElementById('estadoConfirmacion').value || 'Pendiente';
    const calificacion = document.getElementById('calificacionOrg').value;
    
    // Manejar reseña con opción pública/privada
    const tieneResenaSelect = document.getElementById('tieneResena');
    const tieneResena = tieneResenaSelect ? tieneResenaSelect.value === 'si' : false;
    const resena = tieneResena ? (document.getElementById('resenaOrg').value || '') : '';
    const resenaPublica = tieneResena ? (document.getElementById('resenaPublica').checked || false) : false;
    
    const horasVoluntariado = parseInt(document.getElementById('horasVoluntariado').value) || 0;
    const tieneCertificado = document.getElementById('tieneCertificado').checked;
    
    try {
        // Actualizar confirmación
        try {
            await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/confirmacion`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado_confirmacion: estadoConfirmacion }),
                mode: 'cors'
            });
        } catch (error) {
            console.error('Error actualizando confirmación:', error);
        }
        
        // Actualizar asistencia
        console.log('Actualizando asistencia:', {
            postulacionId,
            asistencia_capacitacion: asistenciaCapacitacion,
            asistencia_actividad: asistenciaActividad
        });
        
        const asistenciaResponse = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/asistencia`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                asistencia_capacitacion: asistenciaCapacitacion,
                asistencia_actividad: asistenciaActividad,
                horas_voluntariado: horasVoluntariado  // Guardar horas en la postulación
            }),
            mode: 'cors'
        });
        
        if (!asistenciaResponse.ok) {
            const errorData = await asistenciaResponse.json().catch(() => ({ error: 'Error desconocido' }));
            console.error('Error en respuesta de asistencia:', errorData);
            throw new Error(errorData.error || `Error al actualizar asistencia: ${asistenciaResponse.status}`);
        }
        
        const asistenciaData = await asistenciaResponse.json();
        console.log('Asistencia actualizada exitosamente:', asistenciaData);
        
        // Actualizar calificación y reseña
        const resenaResponse = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/resena`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                calificacion_org: calificacion ? parseFloat(calificacion) : null,
                resena: tieneResena ? resena : '',
                resena_org_sobre_voluntario: tieneResena ? resena : '',
                es_publica: resenaPublica,
                resena_org_publica: resenaPublica
            }),
            mode: 'cors'
        });
        
        if (!resenaResponse.ok) {
            throw new Error('Error al actualizar reseña');
        }
        
        // Actualizar certificado
        const certificadoResponse = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/certificado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                generar: tieneCertificado
            }),
            mode: 'cors'
        });
        
        if (!certificadoResponse.ok) {
            throw new Error('Error al actualizar certificado');
        }
        
        // Las horas ya se guardaron en la postulación mediante el endpoint de asistencia
        // El backend calculará automáticamente la suma total de todas las postulaciones
        // y actualizará el total en el usuario
        
        alert('Seguimiento guardado exitosamente');
        cerrarModal('modalSeguimiento');
        loadSeguimiento();
        loadPostulaciones(); // Recargar también postulaciones para actualizar datos
    } catch (error) {
        console.error('Error guardando seguimiento:', error);
        alert('Error al guardar el seguimiento: ' + error.message);
    }
}

// Función para mostrar/ocultar el apartado de subida de certificado
window.toggleCertificadoUpload = function() {
    const checkbox = document.getElementById('tieneCertificado');
    const uploadSection = document.getElementById('certificadoUploadSection');
    
    if (checkbox && uploadSection) {
        if (checkbox.checked) {
            uploadSection.style.display = 'block';
        } else {
            uploadSection.style.display = 'none';
        }
    }
}

// Función para subir el certificado
window.subirCertificado = async function(postulacionId) {
    const fileInput = document.getElementById('certificadoFile');
    
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('Por favor, selecciona un archivo PDF para subir.');
        return;
    }
    
    const file = fileInput.files[0];
    
    // Validar que sea PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('El archivo debe ser un PDF.');
        return;
    }
    
    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
        return;
    }
    
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('certificado', file);
    
    // Obtener el botón de subir
    const uploadBtn = document.querySelector(`button[onclick*="subirCertificado(${postulacionId})"]`);
    const originalText = uploadBtn ? uploadBtn.innerHTML : '';
    
    try {
        // Mostrar indicador de carga
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';
        }
        
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/certificado`, {
            method: 'POST',
            body: formData,
            mode: 'cors'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Certificado subido exitosamente');
            
            // Marcar el checkbox como seleccionado
            const checkbox = document.getElementById('tieneCertificado');
            if (checkbox) {
                checkbox.checked = true;
            }
            
            // Recargar el modal para mostrar el certificado subido
            const modal = document.getElementById('modalSeguimiento');
            const usuarioId = modal ? modal.dataset.usuarioId : null;
            if (usuarioId) {
                await abrirModalSeguimiento(postulacionId, usuarioId);
            }
            
            // Recargar datos
            loadSeguimiento();
            loadPostulaciones();
        } else {
            alert('Error al subir el certificado: ' + (data.error || 'Error desconocido'));
            if (uploadBtn) {
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = originalText;
            }
        }
    } catch (error) {
        console.error('Error subiendo certificado:', error);
        alert('Error de conexión al subir el certificado');
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Subir Certificado';
        }
    }
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Cerrar modales con botón X
document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// Hacer funciones globales para que funcionen desde onclick en HTML
// Función rápida para cambiar estado desde la tabla de postulaciones
async function cambiarEstadoPostulacionRapido(postulacionId, nuevoEstado) {
    const estado = (nuevoEstado || '').trim();
    const esAprobar = estado === 'Seleccionado';
    const esRechazar = estado === 'Rechazado' || estado === 'No seleccionado';

    // Solo confirmar en acciones críticas (aprobar / rechazar)
    if (esAprobar) {
        if (!confirm('¿Estás seguro de que deseas aprobar esta postulación?')) return;
    } else if (esRechazar) {
        if (!confirm('¿Estás seguro de que deseas rechazar esta postulación?')) return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado }),
            mode: 'cors'
        });
        
        const data = await response.json();
        if (data.success) {
            // Actualizar en postulacionesData
            const postulacionIndex = postulacionesData.findIndex(p => p.id === postulacionId);
            if (postulacionIndex !== -1) {
                postulacionesData[postulacionIndex].estado = nuevoEstado;
            }
            
            // Si se seleccionó, agregarlo a seguimientoData si no existe
            if (nuevoEstado === 'Seleccionado') {
                const postulacion = postulacionesData.find(p => p.id === postulacionId);
                if (postulacion) {
                    const postulacionExistente = seguimientoData.find(s => s.id === postulacionId);
                    if (!postulacionExistente) {
                        // Buscar la oportunidad para obtener su título
                        const oportunidad = oportunidadesData.find(op => op.id === postulacion.oportunidad_id);
                        seguimientoData.push({
                            ...postulacion,
                            oportunidad_titulo: oportunidad?.titulo || 'N/A',
                            oportunidad_id: postulacion.oportunidad_id
                        });
                    }
                }
            } else {
                // Si se rechazó, remover de seguimientoData
                const seguimientoIndex = seguimientoData.findIndex(s => s.id === postulacionId);
                if (seguimientoIndex !== -1) {
                    seguimientoData.splice(seguimientoIndex, 1);
                }
            }
            
            if (esAprobar) {
                alert('Postulación aprobada exitosamente');
            } else if (esRechazar) {
                alert('Postulación rechazada exitosamente');
            } else {
                alert(`Estado actualizado a "${estado}"`);
            }
            
            // Recargar las secciones afectadas
            if (typeof renderPostulaciones === 'function') {
                renderPostulaciones();
            }
            if (typeof loadSeguimiento === 'function') {
                loadSeguimiento();
            }
            if (typeof renderHistorialOportunidades === 'function') {
                renderHistorialOportunidades();
            }
        } else {
            alert('Error al actualizar el estado: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error actualizando estado:', error);
        alert('Error al actualizar el estado');
    }
}

// Función para cambiar el estado de una oportunidad (abierta/cerrada)
async function cambiarEstadoOportunidad(oportunidadId, nuevoEstado) {
    const estadoTexto = nuevoEstado === 'activa' || nuevoEstado === 'abierta' ? 'abrir' : 'cerrar';
    
    if (!confirm(`¿Estás seguro de que deseas ${estadoTexto} esta oportunidad?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/oportunidades/${oportunidadId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado }),
            mode: 'cors'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Actualizar en oportunidadesData
            const oportunidadIndex = oportunidadesData.findIndex(op => op.id === oportunidadId);
            if (oportunidadIndex !== -1) {
                oportunidadesData[oportunidadIndex].estado = nuevoEstado;
            }
            
            // Actualizar el badge en la tabla
            const badge = document.getElementById(`badge-estado-oportunidad-${oportunidadId}`);
            if (badge) {
                badge.textContent = nuevoEstado;
                badge.className = `badge badge-${nuevoEstado === 'activa' || nuevoEstado === 'abierta' ? 'activa' : 'cerrada'}`;
            }
            
            // Actualizar también en las postulaciones si están cargadas
            postulacionesData.forEach(post => {
                if (post.oportunidad_id === oportunidadId) {
                    post.oportunidad_estado = nuevoEstado;
                }
            });
            
            alert(`Oportunidad ${estadoTexto === 'abrir' ? 'abierta' : 'cerrada'} exitosamente`);
            
            // Recargar el historial para reflejar los cambios
            if (typeof renderHistorialOportunidades === 'function') {
                renderHistorialOportunidades();
            }
            if (typeof loadPostulaciones === 'function') {
                loadPostulaciones();
            }
        } else {
            alert('Error al actualizar el estado: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error actualizando estado de oportunidad:', error);
        alert('Error al actualizar el estado de la oportunidad');
    }
}

// Hacer funciones globales para que funcionen desde onclick en HTML
window.verDetallesPostulacion = verDetallesPostulacion;
window.abrirModalSeguimiento = abrirModalSeguimiento;
window.cerrarModal = cerrarModal;
window.verDetallesOportunidad = verDetallesOportunidad;
window.actualizarEstadoPostulacion = actualizarEstadoPostulacion;
window.guardarSeguimiento = guardarSeguimiento;
window.gestionarPostulanteDesdeOportunidad = gestionarPostulanteDesdeOportunidad;
window.cambiarEstadoPostulacionDesdeOportunidad = cambiarEstadoPostulacionDesdeOportunidad;
// Función para mostrar/ocultar campos de reseña (debe estar definida antes de usarse)
window.toggleResenaFields = function() {
    const tieneResenaSelect = document.getElementById('tieneResena');
    if (!tieneResenaSelect) return;
    
    const tieneResena = tieneResenaSelect.value;
    const resenaFields = document.getElementById('resenaFields');
    if (resenaFields) {
        resenaFields.style.display = tieneResena === 'si' ? 'block' : 'none';
        if (tieneResena === 'no') {
            const resenaOrg = document.getElementById('resenaOrg');
            const resenaPublica = document.getElementById('resenaPublica');
            if (resenaOrg) resenaOrg.value = '';
            if (resenaPublica) resenaPublica.checked = false;
        }
    }
};

window.cambiarEstadoPostulacionRapido = cambiarEstadoPostulacionRapido;
window.cambiarEstadoOportunidad = cambiarEstadoOportunidad;
window.actualizarConfirmacion = actualizarConfirmacion;
window.actualizarAsistenciaCapacitacion = actualizarAsistenciaCapacitacion;
window.actualizarAsistenciaActividad = actualizarAsistenciaActividad;
window.abrirModalSeguimiento = abrirModalSeguimiento;
window.cerrarModal = cerrarModal;
window.verDetallesOportunidad = verDetallesOportunidad;
window.filtrarPostulantesModal = filtrarPostulantesModal;
window.actualizarEstadoConJustificacion = actualizarEstadoConJustificacion;
window.mostrarModalJustificacion = mostrarModalJustificacion;
window.abrirModalCorreoMasivo = abrirModalCorreoMasivo;

// Función para actualizar confirmación manualmente
async function actualizarConfirmacion(postulacionId, nuevoEstado) {
    try {
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/confirmacion`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado_confirmacion: nuevoEstado }),
            mode: 'cors'
        });
        
        const data = await response.json();
        if (data.success) {
            // Actualizar en seguimientoData
            const seguimientoIndex = seguimientoData.findIndex(s => s.id === postulacionId);
            if (seguimientoIndex !== -1) {
                seguimientoData[seguimientoIndex].estado_confirmacion = nuevoEstado;
            }
        } else {
            alert('Error al actualizar la confirmación');
            // Revertir el select
            const select = document.getElementById(`confirmacion-${postulacionId}`);
            if (select) {
                const seguimiento = seguimientoData.find(s => s.id === postulacionId);
                if (seguimiento) {
                    select.value = seguimiento.estado_confirmacion || 'Pendiente';
                }
            }
        }
    } catch (error) {
        console.error('Error actualizando confirmación:', error);
        alert('Error al actualizar la confirmación');
    }
}

// Función para actualizar asistencia a capacitación
async function actualizarAsistenciaCapacitacion(postulacionId, nuevoEstado) {
    try {
        const asistenciaActividad = document.getElementById(`asist-act-${postulacionId}`)?.value || 'No aplica';
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/asistencia`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                asistencia_capacitacion: nuevoEstado,
                asistencia_actividad: asistenciaActividad
            }),
            mode: 'cors'
        });
        
        const data = await response.json();
        if (data.success) {
            const seguimientoIndex = seguimientoData.findIndex(s => s.id === postulacionId);
            if (seguimientoIndex !== -1) {
                seguimientoData[seguimientoIndex].asistencia_capacitacion = nuevoEstado;
            }
        }
    } catch (error) {
        console.error('Error actualizando asistencia:', error);
        alert('Error al actualizar la asistencia');
    }
}

// Función para actualizar asistencia a actividad
async function actualizarAsistenciaActividad(postulacionId, nuevoEstado) {
    try {
        const asistenciaCapacitacion = document.getElementById(`asist-cap-${postulacionId}`)?.value || 'No aplica';
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/asistencia`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                asistencia_capacitacion: asistenciaCapacitacion,
                asistencia_actividad: nuevoEstado
            }),
            mode: 'cors'
        });
        
        const data = await response.json();
        if (data.success) {
            const seguimientoIndex = seguimientoData.findIndex(s => s.id === postulacionId);
            if (seguimientoIndex !== -1) {
                seguimientoData[seguimientoIndex].asistencia_actividad = nuevoEstado;
            }
        }
    } catch (error) {
        console.error('Error actualizando asistencia:', error);
        alert('Error al actualizar la asistencia');
    }
}

// Función para actualizar asistencia a actividad
async function actualizarAsistenciaActividad(postulacionId, nuevoEstado) {
    try {
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/asistencia`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                asistencia_capacitacion: document.getElementById(`asistencia-cap-${postulacionId}`)?.value || 'No aplica',
                asistencia_actividad: nuevoEstado
            }),
            mode: 'cors'
        });
        
        const data = await response.json();
        if (data.success) {
            const seguimientoIndex = seguimientoData.findIndex(s => s.id === postulacionId);
            if (seguimientoIndex !== -1) {
                seguimientoData[seguimientoIndex].asistencia_actividad = nuevoEstado;
            }
        }
    } catch (error) {
        console.error('Error actualizando asistencia:', error);
    }
}

window.actualizarConfirmacion = actualizarConfirmacion;
window.actualizarAsistenciaCapacitacion = actualizarAsistenciaCapacitacion;
window.actualizarAsistenciaActividad = actualizarAsistenciaActividad;

// Variables globales para el modal de oportunidad
let modalOportunidadActual = null;
let postulacionesOportunidadActual = [];

async function verDetallesOportunidad(oportunidadId) {
    // Buscar la oportunidad en los datos cargados
    const oportunidad = oportunidadesData.find(op => op.id === oportunidadId);
    if (!oportunidad) {
        alert('No se encontró la oportunidad');
        return;
    }
    
    // Guardar referencia para uso posterior
    modalOportunidadActual = oportunidadId;
    
    // Crear o obtener el modal
    let modal = document.getElementById('modalOportunidadDetalles');
    if (!modal) {
        // Crear el modal si no existe
        modal = document.createElement('div');
        modal.id = 'modalOportunidadDetalles';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-large" style="max-width: 900px;">
                <div class="modal-header">
                    <h2 id="modalOportunidadTitulo">Postulantes de la Oportunidad</h2>
                    <span class="close-modal" onclick="cerrarModal('modalOportunidadDetalles')">&times;</span>
                </div>
                <div class="modal-body" id="modalOportunidadBody" style="max-height: 600px; overflow-y: auto;">
                    <!-- Se llenará dinámicamente -->
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="cerrarModal('modalOportunidadDetalles')">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Agregar evento para cerrar al hacer clic fuera
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                cerrarModal('modalOportunidadDetalles');
            }
        });
    }
    
    // Actualizar título
    const titulo = document.getElementById('modalOportunidadTitulo');
    if (titulo) {
        titulo.textContent = `Postulantes - ${oportunidad.titulo}`;
    }
    
    // Mostrar loading
    const body = document.getElementById('modalOportunidadBody');
    body.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Cargando postulantes...</p></div>';
    modal.style.display = 'block';
    
    try {
        // Cargar postulaciones de esta oportunidad
        const response = await fetch(`${API_BASE_URL}/oportunidades/${oportunidadId}/postulaciones`, {
            mode: 'cors'
        });
        const data = await response.json();
        
        if (!data.success || !data.postulaciones) {
            body.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;"><p>No se pudieron cargar las postulaciones</p></div>';
            return;
        }
        
        const postulaciones = data.postulaciones;
        
        // Guardar referencia a las postulaciones
        postulacionesOportunidadActual = postulaciones;
        
        if (postulaciones.length === 0) {
            body.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-users fa-3x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                    <p>No hay postulaciones para esta oportunidad</p>
                </div>
            `;
            return;
        }
        
        // Calcular estadísticas
        const totalPostulantes = postulaciones.length;
        const metaPostulantes = oportunidad.meta_postulantes || 0;
        const cupoMaximo = oportunidad.cupo_maximo || 0;
        const porcentajeMeta = metaPostulantes > 0 ? Math.round((totalPostulantes / metaPostulantes) * 100) : 0;
        const porcentajeCupos = cupoMaximo > 0 ? Math.round((totalPostulantes / cupoMaximo) * 100) : 0;
        
        // Renderizar tabla de postulantes con todos los datos requeridos
        body.innerHTML = `
            <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
                <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">${oportunidad.titulo}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div>
                        <p style="margin: 0; font-size: 12px; opacity: 0.9;">Estado de la Oportunidad</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">
                            <span class="badge badge-${oportunidad.estado === 'activa' ? 'activa' : 'cerrada'}" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3);">
                                ${oportunidad.estado || 'N/A'}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 12px; opacity: 0.9;">Total de Postulantes</p>
                        <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: 700;">${totalPostulantes}</p>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 12px; opacity: 0.9;">Meta de Postulantes</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">
                            ${metaPostulantes > 0 ? `${totalPostulantes}/${metaPostulantes} (${porcentajeMeta}%)` : 'Sin meta definida'}
                        </p>
                        ${metaPostulantes > 0 ? `
                            <div style="margin-top: 5px; width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${Math.min(porcentajeMeta, 100)}%; height: 100%; background: ${porcentajeMeta >= 100 ? '#10b981' : porcentajeMeta >= 75 ? '#f59e0b' : '#3b82f6'}; transition: width 0.3s;"></div>
                            </div>
                        ` : ''}
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 12px; opacity: 0.9;">Cupos Disponibles</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">
                            ${cupoMaximo > 0 ? `${totalPostulantes}/${cupoMaximo} (${porcentajeCupos}%)` : 'Sin límite'}
                        </p>
                        ${cupoMaximo > 0 ? `
                            <div style="margin-top: 5px; width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${Math.min(porcentajeCupos, 100)}%; height: 100%; background: ${porcentajeCupos >= 100 ? '#ef4444' : porcentajeCupos >= 75 ? '#f59e0b' : '#3b82f6'}; transition: width 0.3s;"></div>
                            </div>
                        ` : ''}
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 12px; opacity: 0.9;">Fechas del Voluntariado</p>
                        <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: 600;">
                            ${(oportunidad.fecha_inicio_voluntariado || 'TBD')} - ${(oportunidad.fecha_fin_voluntariado || 'TBD')}
                        </p>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 12px; opacity: 0.9;">Horas del Voluntariado</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 700;">
                            ${(oportunidad.horas_voluntariado !== null && oportunidad.horas_voluntariado !== undefined && oportunidad.horas_voluntariado !== '' ? `${oportunidad.horas_voluntariado} hrs` : 'N/A')}
                        </p>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <button class="btn-secondary" onclick="abrirModalCorreoMasivo(${oportunidadId})" style="padding: 8px 16px; font-size: 13px;">
                    <i class="fas fa-envelope"></i> Enviar Correo Masivo
                </button>
                <select id="filtroEstadoModal" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;" onchange="filtrarPostulantesModal()">
                    <option value="todos">Todos los estados</option>
                    <option value="Pendiente de revisión">Pendiente de revisión</option>
                    <option value="Pre-seleccionado">Pre-seleccionado</option>
                    <option value="Etapa de entrevista">Etapa de entrevista</option>
                    <option value="En lista de espera">En lista de espera</option>
                    <option value="Seleccionado">Seleccionado</option>
                    <option value="No seleccionado">No seleccionado</option>
                </select>
            </div>
            
            <div class="table-container" style="margin-top: 20px; overflow-x: auto;">
                <table class="data-table" style="min-width: 1200px;">
                    <thead>
                        <tr>
                            <th>Nombre y Apellido</th>
                            <th>Región</th>
                            <th>Comuna</th>
                            <th>Sexo</th>
                            <th>Edad</th>
                            <th>Estado</th>
                            <th>Fecha Postulación</th>
                            <th>Contacto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tablaPostulantesOportunidad">
                        ${postulaciones.map(post => {
                            const estado = post.estado || 'Pendiente de revisión';
                            const estadoNormalizado = estado.toLowerCase();
                            const esPendiente = estadoNormalizado.includes('pendiente');
                            const esSeleccionado = estadoNormalizado.includes('seleccionado');
                            const esNoSeleccionado = estadoNormalizado.includes('no seleccionado') || estadoNormalizado.includes('rechazado');
                            
                            // Formatear teléfono para WhatsApp
                            const telefonoFormateado = post.usuario_telefono ? post.usuario_telefono.replace(/[^0-9]/g, '') : '';
                            const whatsappUrl = telefonoFormateado ? `https://wa.me/56${telefonoFormateado}` : '#';
                            
                            // URL de correo
                            const emailSubject = encodeURIComponent(`Actualización estado de postulación: ${oportunidad.titulo}`);
                            const emailUrl = post.usuario_email ? `mailto:${post.usuario_email}?subject=${emailSubject}` : '#';
                            
                            return `
                            <tr id="fila-postulacion-${post.id}" class="fila-postulante" data-estado="${estado}">
                                <td>
                                    <strong>${post.usuario_nombre_completo || 'N/A'}</strong>
                                </td>
                                <td>${post.usuario_region || 'N/A'}</td>
                                <td>${post.usuario_comuna || 'N/A'}</td>
                                <td>${post.usuario_sexo || 'N/A'}</td>
                                <td>${post.usuario_edad || 'N/A'}</td>
                                <td>
                                    <select id="select-estado-${post.id}" onchange="actualizarEstadoConJustificacion(${post.id}, ${oportunidadId}, this.value)" 
                                            style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; width: 100%;">
                                        <option value="Pendiente de revisión" ${estado === 'Pendiente de revisión' ? 'selected' : ''}>Pendiente de revisión</option>
                                        <option value="Pre-seleccionado" ${estado === 'Pre-seleccionado' ? 'selected' : ''}>Pre-seleccionado</option>
                                        <option value="Etapa de entrevista" ${estado === 'Etapa de entrevista' ? 'selected' : ''}>Etapa de entrevista</option>
                                        <option value="En lista de espera" ${estado === 'En lista de espera' ? 'selected' : ''}>En lista de espera</option>
                                        <option value="Seleccionado" ${estado === 'Seleccionado' ? 'selected' : ''}>Seleccionado</option>
                                        <option value="No seleccionado" ${esNoSeleccionado ? 'selected' : ''}>No seleccionado</option>
                                    </select>
                                    ${esNoSeleccionado && post.motivo_no_seleccion ? `
                                        <small style="display: block; margin-top: 4px; color: #6b7280; font-size: 11px;">
                                            Motivo: ${post.motivo_no_seleccion}
                                        </small>
                                    ` : ''}
                                </td>
                                <td>${post.created_at ? new Date(post.created_at).toLocaleDateString('es-CL') : 'N/A'}</td>
                                <td>
                                    <div style="display: flex; gap: 5px; flex-direction: column;">
                                        ${post.usuario_email ? `
                                            <a href="${emailUrl}" class="btn-secondary" style="padding: 4px 8px; font-size: 11px; text-decoration: none; display: inline-block; text-align: center;">
                                                <i class="fas fa-envelope"></i> Email
                                            </a>
                                        ` : '<span style="font-size: 11px; color: #9ca3af;">Sin email</span>'}
                                        ${post.usuario_telefono ? `
                                            <a href="${whatsappUrl}" target="_blank" class="btn-secondary" style="padding: 4px 8px; font-size: 11px; text-decoration: none; display: inline-block; text-align: center; background: #25D366; color: white;">
                                                <i class="fab fa-whatsapp"></i> WhatsApp
                                            </a>
                                        ` : '<span style="font-size: 11px; color: #9ca3af;">Sin teléfono</span>'}
                                    </div>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                                        ${esSeleccionado ? `
                                            <button class="btn-secondary" onclick="gestionarPostulanteDesdeOportunidad(${post.id}, ${post.usuario_id})" style="padding: 6px 12px; font-size: 11px;" title="Gestionar seguimiento">
                                                <i class="fas fa-edit"></i> Gestionar
                                            </button>
                                        ` : ''}
                                        <button class="btn-secondary" onclick="verDetallesPostulacion(${post.id})" style="padding: 6px 12px; font-size: 11px;" title="Ver detalles">
                                            <i class="fas fa-eye"></i> Ver
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        // Guardar referencia para el filtro
        window.postulacionesModalActual = postulaciones;
        
    } catch (error) {
        console.error('Error cargando postulantes:', error);
        body.innerHTML = '<div style="text-align: center; padding: 40px; color: #dc2626;"><p>Error al cargar los postulantes</p></div>';
    }
}

// Función para filtrar postulantes en el modal
function filtrarPostulantesModal() {
    const filtro = document.getElementById('filtroEstadoModal')?.value || 'todos';
    const filas = document.querySelectorAll('.fila-postulante');
    
    filas.forEach(fila => {
        if (filtro === 'todos') {
            fila.style.display = '';
        } else {
            const estadoFila = fila.getAttribute('data-estado');
            if (estadoFila === filtro) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        }
    });
}

// Función para actualizar estado con justificación (si es necesario)
async function actualizarEstadoConJustificacion(postulacionId, oportunidadId, nuevoEstado) {
    // Si el estado es "No seleccionado", mostrar modal para justificación
    if (nuevoEstado === 'No seleccionado') {
        mostrarModalJustificacion(postulacionId, oportunidadId);
        return;
    }
    
    // Para otros estados, cambiar directamente
    await cambiarEstadoPostulacionDesdeOportunidad(postulacionId, oportunidadId, nuevoEstado);
}

// Función para mostrar modal de justificación
function mostrarModalJustificacion(postulacionId, oportunidadIdParam = null) {
    // Si no se proporciona oportunidadId, intentar obtenerlo de los datos
    let oportunidadId = oportunidadIdParam;
    if (!oportunidadId) {
        const postulacion = postulacionesData.find(p => p.id === postulacionId) || 
                           postulacionesOportunidadActual.find(p => p.id === postulacionId);
        if (postulacion) {
            oportunidadId = postulacion.oportunidad_id || modalOportunidadActual;
        } else {
            oportunidadId = modalOportunidadActual;
        }
    }
    
    // Crear modal de justificación
    let modal = document.getElementById('modalJustificacion');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalJustificacion';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>Justificación de No Selección</h2>
                    <span class="close-modal" onclick="cerrarModal('modalJustificacion')">&times;</span>
                </div>
                <div class="modal-body" id="modalJustificacionBody">
                    <p>Seleccione el motivo por el cual el postulante no fue seleccionado:</p>
                    <select id="selectMotivo" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #d1d5db; border-radius: 6px;">
                        <option value="">Seleccione un motivo</option>
                        <option value="No cumple con el perfil requerido para la oportunidad">No cumple con el perfil requerido para la oportunidad</option>
                        <option value="No postula en tiempo y/o forma">No postula en tiempo y/o forma</option>
                        <option value="No cumple con los requisitos mínimos de postulación">No cumple con los requisitos mínimos de postulación</option>
                        <option value="No cuenta con la experiencia suficiente">No cuenta con la experiencia suficiente</option>
                        <option value="Otro">Otro</option>
                    </select>
                    <div id="otroMotivoContainer" style="display: none; margin-top: 10px;">
                        <label>Especifique el motivo:</label>
                        <textarea id="otroMotivo" rows="3" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #d1d5db; border-radius: 6px;"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="cerrarModal('modalJustificacion')">Cancelar</button>
                    <button class="btn-danger" id="btnConfirmarJustificacion">Confirmar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listener para mostrar campo "Otro"
        document.getElementById('selectMotivo').addEventListener('change', function() {
            const otroContainer = document.getElementById('otroMotivoContainer');
            otroContainer.style.display = this.value === 'Otro' ? 'block' : 'none';
        });
    }
    
    // Limpiar campos
    document.getElementById('selectMotivo').value = '';
    document.getElementById('otroMotivo').value = '';
    document.getElementById('otroMotivoContainer').style.display = 'none';
    
    // Guardar oportunidadId para usar en el onclick
    const oportunidadIdFinal = oportunidadId;
    
    // Configurar botón de confirmar
    const btnConfirmar = document.getElementById('btnConfirmarJustificacion');
    btnConfirmar.onclick = async () => {
        const motivo = document.getElementById('selectMotivo').value;
        const otroMotivo = document.getElementById('otroMotivo').value;
        
        if (!motivo) {
            alert('Por favor, seleccione un motivo');
            return;
        }
        
        if (motivo === 'Otro' && !otroMotivo.trim()) {
            alert('Por favor, especifique el motivo');
            return;
        }
        
        await cambiarEstadoPostulacionConJustificacion(postulacionId, oportunidadIdFinal, motivo, otroMotivo);
        cerrarModal('modalJustificacion');
    };
    
    modal.style.display = 'block';
}

// Función para cambiar estado con justificación
async function cambiarEstadoPostulacionConJustificacion(postulacionId, oportunidadId, motivo, otroMotivo) {
    try {
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                estado: 'No seleccionado',
                motivo_no_seleccion: motivo,
                motivo_no_seleccion_otro: otroMotivo || null
            }),
            mode: 'cors'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Recargar el modal de oportunidad
            await verDetallesOportunidad(oportunidadId);
            alert('Estado actualizado y correo enviado al postulante');
        } else {
            alert('Error al actualizar el estado: ' + (data.error || 'Error desconocido'));
            // Revertir el select
            const select = document.getElementById(`select-estado-${postulacionId}`);
            if (select) {
                const postulacion = postulacionesOportunidadActual.find(p => p.id === postulacionId);
                if (postulacion) {
                    select.value = postulacion.estado || 'Pendiente de revisión';
                }
            }
        }
    } catch (error) {
        console.error('Error actualizando estado:', error);
        alert('Error al actualizar el estado');
    }
}

// Función para abrir modal de correo masivo
function abrirModalCorreoMasivo(oportunidadId) {
    const oportunidad = oportunidadesData.find(op => op.id === oportunidadId);
    const postulaciones = postulacionesOportunidadActual || [];
    
    let modal = document.getElementById('modalCorreoMasivo');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalCorreoMasivo';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>Enviar Correo Masivo</h2>
                    <span class="close-modal" onclick="cerrarModal('modalCorreoMasivo')">&times;</span>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Filtrar por estado:</label>
                        <select id="filtroEstadoCorreo" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
                            <option value="todos">Todos los postulantes</option>
                            <option value="Pendiente de revisión">Pendiente de revisión</option>
                            <option value="Pre-seleccionado">Pre-seleccionado</option>
                            <option value="Etapa de entrevista">Etapa de entrevista</option>
                            <option value="En lista de espera">En lista de espera</option>
                            <option value="Seleccionado">Seleccionado</option>
                            <option value="No seleccionado">No seleccionado</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Asunto:</label>
                        <input type="text" id="asuntoCorreo" placeholder="Asunto del correo" 
                               style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;"
                               value="Actualización sobre tu postulación - ${oportunidad?.titulo || ''}">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Mensaje:</label>
                        <textarea id="mensajeCorreo" rows="8" placeholder="Escribe el mensaje aquí..."
                                  style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical;"></textarea>
                    </div>
                    <div id="destinatariosInfo" style="padding: 10px; background: #f3f4f6; border-radius: 6px; font-size: 13px;">
                        <strong>Destinatarios:</strong> <span id="contadorDestinatarios">0</span> postulante(s)
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="cerrarModal('modalCorreoMasivo')">Cancelar</button>
                    <button class="btn-primary" id="btnEnviarCorreoMasivo">Enviar Correos</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Actualizar contador al cambiar filtro
        document.getElementById('filtroEstadoCorreo').addEventListener('change', actualizarContadorDestinatarios);
        
        // Configurar botón de enviar
        document.getElementById('btnEnviarCorreoMasivo').onclick = () => enviarCorreoMasivo(oportunidadId);
    }
    
    // Actualizar contador inicial
    actualizarContadorDestinatarios();
    modal.style.display = 'block';
}

function actualizarContadorDestinatarios() {
    const filtro = document.getElementById('filtroEstadoCorreo')?.value || 'todos';
    const postulaciones = postulacionesOportunidadActual || [];
    
    let contador = 0;
    if (filtro === 'todos') {
        contador = postulaciones.length;
    } else {
        contador = postulaciones.filter(p => p.estado === filtro).length;
    }
    
    const contadorElement = document.getElementById('contadorDestinatarios');
    if (contadorElement) {
        contadorElement.textContent = contador;
    }
}

async function enviarCorreoMasivo(oportunidadId) {
    const filtro = document.getElementById('filtroEstadoCorreo')?.value || 'todos';
    const asunto = document.getElementById('asuntoCorreo')?.value || '';
    const mensaje = document.getElementById('mensajeCorreo')?.value || '';
    
    if (!asunto.trim() || !mensaje.trim()) {
        alert('Por favor, complete el asunto y el mensaje');
        return;
    }
    
    const postulaciones = postulacionesOportunidadActual || [];
    let destinatarios = [];
    
    if (filtro === 'todos') {
        destinatarios = postulaciones.map(p => p.usuario_email).filter(e => e);
    } else {
        destinatarios = postulaciones
            .filter(p => p.estado === filtro)
            .map(p => p.usuario_email)
            .filter(e => e);
    }
    
    if (destinatarios.length === 0) {
        alert('No hay destinatarios para enviar el correo');
        return;
    }
    
    if (!confirm(`¿Está seguro de enviar este correo a ${destinatarios.length} postulante(s)?`)) {
        return;
    }
    
    try {
        // Enviar correo masivo vía backend
        const response = await fetch(`${API_BASE_URL}/oportunidades/${oportunidadId}/correo-masivo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                asunto: asunto,
                mensaje: mensaje,
                filtro_estado: filtro
            }),
            mode: 'cors'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`Correo masivo enviado exitosamente a ${data.emails_enviados} postulante(s).${data.emails_fallidos && data.emails_fallidos.length > 0 ? `\n${data.emails_fallidos.length} correo(s) no se pudieron enviar.` : ''}`);
            cerrarModal('modalCorreoMasivo');
        } else {
            alert('Error al enviar el correo masivo: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error enviando correo masivo:', error);
        
        // Fallback a mailto si el backend falla
        try {
            const emailSubject = encodeURIComponent(asunto);
            const emailBody = encodeURIComponent(mensaje);
            const primerEmail = destinatarios[0];
            const otrosEmails = destinatarios.slice(1).join(',');
            const mailtoUrl = `mailto:${primerEmail}?subject=${emailSubject}&body=${emailBody}${otrosEmails ? `&bcc=${encodeURIComponent(otrosEmails)}` : ''}`;
            
            window.location.href = mailtoUrl;
            alert(`No se pudo enviar automáticamente. Se abrirá tu cliente de correo con ${destinatarios.length} destinatario(s).`);
            cerrarModal('modalCorreoMasivo');
        } catch (fallbackError) {
            console.error('Error en fallback:', fallbackError);
            alert('Error al enviar el correo. Por favor, intente de nuevo.');
        }
    }
}

// Función para gestionar un postulante desde el modal de oportunidad
function gestionarPostulanteDesdeOportunidad(postulacionId, usuarioId) {
    // Cerrar el modal de oportunidad
    cerrarModal('modalOportunidadDetalles');
    
    // Abrir el modal de seguimiento
    abrirModalSeguimiento(postulacionId, usuarioId);
}

// Función para cambiar el estado de una postulación desde el modal de oportunidad
async function cambiarEstadoPostulacionDesdeOportunidad(postulacionId, oportunidadId, nuevoEstado) {
    const estado = (nuevoEstado || '').trim();
    const esAprobar = estado === 'Seleccionado';
    const esRechazar = estado === 'Rechazado' || estado === 'No seleccionado';

    // Solo confirmar en acciones críticas (aprobar / rechazar)
    if (esAprobar) {
        if (!confirm('¿Estás seguro de que deseas aprobar esta postulación?')) return;
    } else if (esRechazar) {
        if (!confirm('¿Estás seguro de que deseas rechazar esta postulación?')) return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado }),
            mode: 'cors'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Buscar la postulación en los datos locales
            const postulacionActual = postulacionesOportunidadActual.find(p => p.id === postulacionId);
            const usuarioId = postulacionActual?.usuario_id || null;
            
            // Obtener información de la oportunidad
            const oportunidad = oportunidadesData.find(op => op.id === oportunidadId);
            
            // Actualizar la postulación en el array local
            const postulacionIndex = postulacionesOportunidadActual.findIndex(p => p.id === postulacionId);
            if (postulacionIndex !== -1) {
                postulacionesOportunidadActual[postulacionIndex].estado = nuevoEstado;
            }
            
            // Actualizar también en postulacionesData
            const postulacionIndexGlobal = postulacionesData.findIndex(p => p.id === postulacionId);
            if (postulacionIndexGlobal !== -1) {
                postulacionesData[postulacionIndexGlobal].estado = nuevoEstado;
            }
            
            // Si se seleccionó, agregarlo a seguimientoData si no existe
            if (nuevoEstado === 'Seleccionado') {
                const postulacionExistente = seguimientoData.find(s => s.id === postulacionId);
                if (!postulacionExistente && postulacionActual) {
                    seguimientoData.push({
                        ...postulacionActual,
                        estado: nuevoEstado,
                        oportunidad_titulo: oportunidad?.titulo || 'N/A',
                        oportunidad_id: oportunidadId
                    });
                } else if (postulacionExistente) {
                    // Actualizar el existente
                    postulacionExistente.estado = nuevoEstado;
                }
            } else {
                // Si se rechazó, remover de seguimientoData
                const seguimientoIndex = seguimientoData.findIndex(s => s.id === postulacionId);
                if (seguimientoIndex !== -1) {
                    seguimientoData.splice(seguimientoIndex, 1);
                }
            }
            
            // Recargar el modal de oportunidad para reflejar los cambios
            await verDetallesOportunidad(oportunidadId);
            
            if (esAprobar) {
                alert('Postulación aprobada exitosamente');
            } else if (esRechazar) {
                alert('Postulación rechazada exitosamente');
            } else {
                alert(`Estado actualizado a "${estado}"`);
            }
            
            // Recargar las secciones afectadas
            if (typeof loadSeguimiento === 'function') {
                loadSeguimiento();
            }
            if (typeof loadPostulaciones === 'function') {
                loadPostulaciones();
            }
            if (typeof renderHistorialOportunidades === 'function') {
                renderHistorialOportunidades();
            }
            
        } else {
            alert('Error al actualizar el estado: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error actualizando estado:', error);
        alert('Error al actualizar el estado de la postulación');
    }
}

function cambiarContrasena() {
    alert('Funcionalidad de cambio de contraseña pendiente de implementar');
}

// ==========================================================
// ========== Funcionalidad de Crear Oportunidad ===========
// ==========================================================

// Helper function para obtener elementos (compatible con app.js)
function $(selector) {
    return document.getElementById(selector) || document.querySelector(selector);
}

// Asegurar que las funciones estén disponibles globalmente desde el inicio
// Declarar las funciones globales primero
window.mostrarModalCrearOportunidad = null;
window.cerrarModalCrearOportunidad = null;

// Objeto de ubicaciones de Chile (igual que app.js)
const ubicacionesChile = {
    "Arica y Parinacota": {
        ciudades: {
            "Arica": ["Arica", "Camarones"],
            "Parinacota": ["Putre", "General Lagos"]
        }
    },
    "Tarapacá": {
        ciudades: {
            "Iquique": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
            "Tamarugal": ["Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
        }
    },
    "Antofagasta": {
        ciudades: {
            "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal"],
            "El Loa": ["Calama", "Ollagüe", "San Pedro de Atacama"],
            "Tocopilla": ["Tocopilla", "María Elena"]
        }
    },
    "Atacama": {
        ciudades: {
            "Copiapó": ["Copiapó", "Caldera", "Tierra Amarilla"],
            "Chañaral": ["Chañaral", "Diego de Almagro"],
            "Huasco": ["Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
        }
    },
    "Coquimbo": {
        ciudades: {
            "La Serena": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña"],
            "Elqui": ["La Serena", "Vicuña", "Paihuano", "La Higuera"],
            "Limarí": ["Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
            "Choapa": ["Illapel", "Canela", "Los Vilos", "Salamanca"]
        }
    },
    "Valparaíso": {
        ciudades: {
            "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Casablanca", "Juan Fernández"],
            "Isla de Pascua": ["Isla de Pascua"],
            "Los Andes": ["Los Andes", "Calle Larga", "Rinconada", "San Esteban"],
            "Petorca": ["La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar"],
            "Quillota": ["Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales"],
            "San Antonio": ["San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo"],
            "San Felipe": ["San Felipe", "Catemu", "Llay Llay", "Panquehue", "Putaendo", "Santa María"],
            "Marga Marga": ["Quilpué", "Limache", "Olmué", "Villa Alemana"]
        }
    },
    "Región Metropolitana de Santiago": {
        ciudades: {
            "Santiago": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura"],
            "Cordillera": ["Puente Alto", "Pirque", "San José de Maipo"],
            "Chacabuco": ["Colina", "Lampa", "Tiltil"],
            "Maipo": ["San Bernardo", "Buin", "Calera de Tango", "Paine"],
            "Melipilla": ["Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro"],
            "Talagante": ["Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
        }
    },
    "O'Higgins": {
        ciudades: {
            "Rancagua": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente"],
            "Cachapoal": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente"],
            "Colchagua": ["San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
            "Cardenal Caro": ["Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones"]
        }
    },
    "Maule": {
        ciudades: {
            "Talca": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael"],
            "Cauquenes": ["Cauquenes", "Chanco", "Pelluhue"],
            "Curicó": ["Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén"],
            "Linares": ["Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
        }
    },
    "Ñuble": {
        ciudades: {
            "Chillán": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay"],
            "Diguillín": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay"],
            "Itata": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco"],
            "Punilla": ["Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"]
        }
    },
    "Bío Bío": {
        ciudades: {
            "Concepción": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé"],
            "Arauco": ["Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa"],
            "Bío Bío": ["Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel"],
            "Ñuble": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay"]
        }
    },
    "Araucanía": {
        ciudades: {
            "Temuco": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol"],
            "Cautín": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol"],
            "Malleco": ["Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
        }
    },
    "Los Ríos": {
        ciudades: {
            "Valdivia": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli"],
            "Ranco": ["La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
        }
    },
    "Los Lagos": {
        ciudades: {
            "Puerto Montt": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas"],
            "Osorno": ["Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo"],
            "Llanquihue": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas"],
            "Chiloé": ["Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao"],
            "Palena": ["Chaitén", "Futaleufú", "Hualaihué", "Palena"]
        }
    },
    "Aysén": {
        ciudades: {
            "Coyhaique": ["Coyhaique", "Lago Verde"],
            "Aysén": ["Aysén", "Cisnes", "Guaitecas"],
            "Capitán Prat": ["Cochrane", "O'Higgins", "Tortel"],
            "General Carrera": ["Chile Chico", "Río Ibáñez"]
        }
    },
    "Magallanes y de la Antártica Chilena": {
        ciudades: {
            "Punta Arenas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio"],
            "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio"],
            "Tierra del Fuego": ["Porvenir", "Primavera", "Timaukel"],
            "Antártica": ["Antártica", "Cabo de Hornos"],
            "Última Esperanza": ["Natales", "Torres del Paine"]
        }
    }
};

// Función para mostrar modal de crear oportunidad (igual que app.js)
window.mostrarModalCrearOportunidad = function() {
    // Verificar que hay organizacionId
    if (!organizacionId) {
        alert('Error: No se encontró la organización. Por favor, recarga la página.');
        return;
    }

    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.id = 'modalCrearOportunidad';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4';
    modal.style.paddingTop = '80px'; // Agregar padding superior para evitar que se corte con el header
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold">Crear Nueva Oportunidad</h3>
                    <button onclick="cerrarModalCrearOportunidad()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <form id="formCrearOportunidad" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Título *</label>
                        <input type="text" id="tituloOportunidad" required autocomplete="off" class="w-full border rounded-lg p-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Descripción *</label>
                        <textarea id="descripcionOportunidad" required rows="4" class="w-full border rounded-lg p-2"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Meta de postulantes</label>
                            <input type="number" id="metaPostulantes" min="1" autocomplete="off" class="w-full border rounded-lg p-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Cupo máximo</label>
                            <input type="number" id="cupoMaximo" min="1" autocomplete="off" class="w-full border rounded-lg p-2">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Fecha límite de postulación</label>
                        <input type="date" id="fechaLimite" class="w-full border rounded-lg p-2">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Fecha de inicio del voluntariado</label>
                            <input type="date" id="fechaInicioVol" class="w-full border rounded-lg p-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Fecha de fin del voluntariado</label>
                            <input type="date" id="fechaFinVol" class="w-full border rounded-lg p-2">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Horas del voluntariado (estimadas)</label>
                        <input type="number" id="horasVoluntariado" min="0" step="1" autocomplete="off" class="w-full border rounded-lg p-2" placeholder="Ej: 20">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-1">Área de Voluntariado</label>
                        <select id="areaVoluntariado" class="w-full border rounded-lg p-2" autocomplete="off">
                            <option value="">Seleccione un área</option>
                            <option value="Educación">Educación</option>
                            <option value="Medio Ambiente">Medio Ambiente</option>
                            <option value="Salud">Salud</option>
                            <option value="Comunidad">Comunidad</option>
                            <option value="Deporte">Deporte</option>
                            <option value="Cultura">Cultura</option>
                            <option value="Emergencia">Emergencia</option>
                            <option value="Desarrollo Social">Desarrollo Social</option>
                            <option value="Tecnología">Tecnología</option>
                            <option value="Arte">Arte</option>
                            <option value="Animales">Animales</option>
                            <option value="Adultos Mayores">Adultos Mayores</option>
                            <option value="Niños y Jóvenes">Niños y Jóvenes</option>
                            <option value="Discapacidad">Discapacidad</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    
                    <div id="areaOtroContainer" class="hidden">
                        <label class="block text-sm font-medium mb-1">Especificar área</label>
                        <input type="text" id="areaOtro" autocomplete="off" placeholder="Escriba el área de voluntariado" class="w-full border rounded-lg p-2">
                    </div>
                    
                    <div class="border-t pt-4 mt-4">
                        <h4 class="text-lg font-semibold mb-3">Información del Responsable</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Nombre del responsable</label>
                                <input type="text" id="responsableNombre" autocomplete="off" class="w-full border rounded-lg p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Apellido del responsable</label>
                                <input type="text" id="responsableApellido" autocomplete="off" class="w-full border rounded-lg p-2">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Email del responsable</label>
                                <input type="email" id="responsableEmail" autocomplete="off" class="w-full border rounded-lg p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Email institucional</label>
                                <input type="email" id="responsableEmailInstitucional" autocomplete="off" class="w-full border rounded-lg p-2">
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-sm font-medium mb-1">Teléfono del responsable</label>
                            <input type="tel" id="responsableTelefono" autocomplete="off" class="w-full border rounded-lg p-2">
                        </div>
                    </div>
                    
                    <div class="border-t pt-4 mt-4">
                        <h4 class="text-lg font-semibold mb-3">Ubicación de la Oportunidad</h4>
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Región</label>
                                <select id="regionOportunidad" class="w-full border rounded-lg p-2">
                                    <option value="">Seleccione una región</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Ciudad</label>
                                <select id="ciudadOportunidad" disabled class="w-full border rounded-lg p-2">
                                    <option value="">Primero seleccione una región</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Comuna</label>
                                <select id="comunaOportunidad" disabled class="w-full border rounded-lg p-2">
                                    <option value="">Primero seleccione una ciudad</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="cerrarModalCrearOportunidad()" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Crear Oportunidad
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Inicializar selectores de ubicación
    inicializarSelectoresUbicacionOportunidad();
    
    // Manejar cambio en área de voluntariado
    setTimeout(() => {
        const areaSelect = $('#areaVoluntariado');
        const areaOtroContainer = $('#areaOtroContainer');
        const areaOtroInput = $('#areaOtro');
        
        if (areaSelect) {
            areaSelect.addEventListener('change', function() {
                if (this.value === 'Otro') {
                    if (areaOtroContainer) areaOtroContainer.classList.remove('hidden');
                    if (areaOtroInput) areaOtroInput.required = true;
                } else {
                    if (areaOtroContainer) areaOtroContainer.classList.add('hidden');
                    if (areaOtroInput) {
                        areaOtroInput.required = false;
                        areaOtroInput.value = '';
                    }
                }
            });
        }
    }, 100);

    $('#formCrearOportunidad')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await crearOportunidad();
    });
};

// Función para inicializar los selectores de ubicación
function inicializarSelectoresUbicacionOportunidad() {
    const regionSelect = $('#regionOportunidad');
    const ciudadSelect = $('#ciudadOportunidad');
    const comunaSelect = $('#comunaOportunidad');

    if (!regionSelect || !ciudadSelect || !comunaSelect) return;

    // Llenar el selector de regiones
    Object.keys(ubicacionesChile).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    // Cuando se selecciona una región, actualizar ciudades
    regionSelect.addEventListener('change', function() {
        const regionSeleccionada = this.value;
        
        ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
        comunaSelect.innerHTML = '<option value="">Primero seleccione una ciudad</option>';
        
        if (regionSeleccionada && ubicacionesChile[regionSeleccionada]) {
            ciudadSelect.disabled = false;
            const ciudades = Object.keys(ubicacionesChile[regionSeleccionada].ciudades);
            
            ciudades.forEach(ciudad => {
                const option = document.createElement('option');
                option.value = ciudad;
                option.textContent = ciudad;
                ciudadSelect.appendChild(option);
            });
        } else {
            ciudadSelect.disabled = true;
            comunaSelect.disabled = true;
        }
    });

    // Cuando se selecciona una ciudad, actualizar comunas
    ciudadSelect.addEventListener('change', function() {
        const regionSeleccionada = regionSelect.value;
        const ciudadSeleccionada = this.value;
        
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        
        if (regionSeleccionada && ciudadSeleccionada && 
            ubicacionesChile[regionSeleccionada] && 
            ubicacionesChile[regionSeleccionada].ciudades[ciudadSeleccionada]) {
            comunaSelect.disabled = false;
            const comunas = ubicacionesChile[regionSeleccionada].ciudades[ciudadSeleccionada];
            
            comunas.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        } else {
            comunaSelect.disabled = true;
        }
    });
}

// Función para crear oportunidad (igual que app.js)
async function crearOportunidad() {
    if (!organizacionId) {
        alert('Error: No se encontró la organización');
        return;
    }

    const titulo = $('#tituloOportunidad')?.value;
    const descripcion = $('#descripcionOportunidad')?.value;
    const metaPostulantes = $('#metaPostulantes')?.value;
    const cupoMaximo = $('#cupoMaximo')?.value;
    const fechaLimite = $('#fechaLimite')?.value;
    const fechaInicioVol = $('#fechaInicioVol')?.value;
    const fechaFinVol = $('#fechaFinVol')?.value;
    const horasVoluntariado = $('#horasVoluntariado')?.value;
    
    // Campos del responsable
    const responsableNombre = $('#responsableNombre')?.value;
    const responsableApellido = $('#responsableApellido')?.value;
    const responsableEmail = $('#responsableEmail')?.value;
    const responsableEmailInstitucional = $('#responsableEmailInstitucional')?.value;
    const responsableTelefono = $('#responsableTelefono')?.value;
    
    // Campos de ubicación
    const regionOpor = $('#regionOportunidad')?.value;
    const ciudadOpor = $('#ciudadOportunidad')?.value;
    const comunaOpor = $('#comunaOportunidad')?.value;
    
    // Campo de área de voluntariado
    const areaVoluntariado = $('#areaVoluntariado')?.value;
    const areaOtro = $('#areaOtro')?.value;
    const areaFinal = areaVoluntariado === 'Otro' ? (areaOtro?.trim() || null) : (areaVoluntariado || null);

    if (!titulo || !descripcion) {
        alert('Título y descripción son requeridos');
        return;
    }
    
    if (areaVoluntariado === 'Otro' && !areaOtro?.trim()) {
        alert('Por favor, especifique el área de voluntariado');
        return;
    }

    if (horasVoluntariado !== undefined && horasVoluntariado !== null && horasVoluntariado !== '') {
        const horasInt = parseInt(horasVoluntariado);
        if (isNaN(horasInt) || horasInt < 0) {
            alert('Horas del voluntariado inválidas (debe ser un número mayor o igual a 0)');
            return;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/oportunidades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                organizacion_id: organizacionId,
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
                meta_postulantes: metaPostulantes ? parseInt(metaPostulantes) : null,
                cupo_maximo: cupoMaximo ? parseInt(cupoMaximo) : null,
                fecha_limite_postulacion: fechaLimite || null,
                fecha_inicio_voluntariado: fechaInicioVol || null,
                fecha_fin_voluntariado: fechaFinVol || null,
                horas_voluntariado: horasVoluntariado !== undefined && horasVoluntariado !== null && horasVoluntariado !== '' ? parseInt(horasVoluntariado) : null,
                responsable_nombre: responsableNombre?.trim() || null,
                responsable_apellido: responsableApellido?.trim() || null,
                responsable_email: responsableEmail?.trim() || null,
                responsable_email_institucional: responsableEmailInstitucional?.trim() || null,
                responsable_telefono: responsableTelefono?.trim() || null,
                region_opor: regionOpor || null,
                ciudad_opor: ciudadOpor || null,
                comuna_opor: comunaOpor || null,
                area_voluntariado: areaFinal,
                tipo_de_voluntariado: areaFinal
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Oportunidad creada exitosamente');
            cerrarModalCrearOportunidad();
            loadHistorialOportunidades(); // Recargar el historial de oportunidades
        } else {
            alert('Error: ' + (data.error || 'No se pudo crear la oportunidad'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Función para cerrar el modal
window.cerrarModalCrearOportunidad = function() {
    const modal = $('#modalCrearOportunidad');
    if (modal) modal.remove();
};


