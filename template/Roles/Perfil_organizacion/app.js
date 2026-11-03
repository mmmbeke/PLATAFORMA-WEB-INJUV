// ====================== Perfil Organización - app.js ======================

// ---------- Helpers ----------
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const show = (el) => el?.classList.remove('hidden');
const hide = (el) => el?.classList.add('hidden');
const sanitizePhone = (value = '') => value.replace(/[^\d+\s()-]/g, '').trim();

/** Alineado con el backend: null/undefined = pública por defecto; 0/"false" = privada */
function reseñaEsPublicaParaMostrar(val) {
  if (val === false || val === 0 || val === '0' || val === 'false' || val === 'FALSE') return false;
  if (val === true || val === 1 || val === '1' || val === 'true' || val === 'TRUE') return true;
  if (val === null || val === undefined) return true;
  return Boolean(val);
}

// ==========================================================
// ================== Configuración API ====================
// ==========================================================
const API_BASE_URL = 'https://injuv.onrender.com/api';

// Variables globales
let organizacionData = null;
let organizacionId = null;
let userId = null;

function togglePaginationByButton(nextButtonId, visible) {
  const nextBtn = document.getElementById(nextButtonId);
  const paginationBar = nextBtn?.parentElement;
  if (paginationBar) {
    paginationBar.style.display = visible ? 'flex' : 'none';
  }
}

function actualizarVisibilidadPaginacionesVacias() {
  // Historias no tiene render dinámico en este archivo: ocultar su paginación si no hay cards
  const storiesContainer = document.getElementById('volunteerStoriesContainer');
  if (storiesContainer) {
    const hasStories = storiesContainer.querySelector('article') !== null;
    togglePaginationByButton('nextStoriesBtn', hasStories);
  }
}

// Función para ocultar botones de edición
function hideEditButtons() {
  const editProfileBtn = $('#editProfileBtn');
  const createVolunteerBtn = $('#createVolunteerBtn');
  
  if (editProfileBtn) {
    editProfileBtn.style.display = 'none';
  }
  if (createVolunteerBtn) {
    createVolunteerBtn.style.display = 'none';
  }
}

// Función para mostrar botones de edición (solo el titular puede crear voluntariados)
function showEditButtons(showCreateVolunteer = true) {
  const editProfileBtn = $('#editProfileBtn');
  const createVolunteerBtn = $('#createVolunteerBtn');
  
  if (editProfileBtn) {
    editProfileBtn.style.display = 'inline-flex';
  }
  if (createVolunteerBtn) {
    createVolunteerBtn.style.display = showCreateVolunteer ? 'inline-flex' : 'none';
  }
}

// Base de datos de regiones, ciudades y comunas de Chile
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

// ==========================================================
// ================== Logo con recorte ====================
// ==========================================================
(() => {
  const avatarInput  = $('#avatarInput');
  const avatarCard   = $('#avatarCard');
  const cropper    = $('#cropper');
  const cropImg    = $('#cropImg');
  const cropZoom   = $('#cropZoom');
  const cropSave   = $('#cropSave');
  const cropCancel = $('#cropCancel');
  const cropReset  = $('#cropReset');
  const cropFrame  = $('#cropFrame');

  // Cargar logo guardado
  const avatarContainer = $('#avatarContainer');
  (function loadSavedAvatar() {
    const b64 = localStorage.getItem('org_avatar_b64');
    if (b64 && avatarCard) {
      avatarCard.src = b64;
      if (avatarContainer) avatarContainer.classList.remove('avatar-default');
    } else if (avatarContainer) {
      avatarContainer.classList.add('avatar-default');
    }
  })();

  let imgNaturalW = 0, imgNaturalH = 0;
  let scale = 1, rotation = 0;
  let pos = { x: 0, y: 0 };
  let dragging = false;
  let dragStart = { x: 0, y: 0 };
  let posStart  = { x: 0, y: 0 };

  // Función reutilizable para procesar un archivo de imagen
  function processImageFile(file) {
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      cropImg.onload = () => {
        imgNaturalW = cropImg.naturalWidth;
        imgNaturalH = cropImg.naturalHeight;
        scale = 1; rotation = 0; pos = { x: 0, y: 0 }; cropZoom.value = '1';
        
        // Cerrar temporalmente el modal de editar perfil si está abierto
        const editProfileModal = $('#editProfileModal');
        let wasEditModalOpen = false;
        if (editProfileModal && !editProfileModal.classList.contains('hidden')) {
          wasEditModalOpen = true;
          editProfileModal.classList.add('hidden');
          // Guardar el estado para reabrirlo después
          cropper.dataset.wasEditModalOpen = 'true';
        }
        
        show(cropper);
        requestAnimationFrame(updateCropTransform);
      };
      cropImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  avatarInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  });

  // Recalcular on resize si está abierto
  window.addEventListener('resize', () => {
    if (cropper && !cropper.classList.contains('hidden')) updateCropTransform();
  });

  function updateCropTransform() {
    if (!cropFrame) return;
    const frameSize = cropFrame.clientWidth || 0;
    if (!frameSize) return;
    const imgRatio  = imgNaturalW / imgNaturalH || 1;
    const base = imgRatio >= 1
      ? { w: frameSize, h: frameSize / imgRatio }
      : { h: frameSize, w: frameSize * imgRatio };
    Object.assign(cropImg.style, {
      width:  `${base.w}px`,
      height: `${base.h}px`,
      transform: `
        translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)
        scale(${scale}) rotate(${rotation}deg)
      `
    });
  }

  cropZoom?.addEventListener('input', () => {
    scale = parseFloat(cropZoom.value || '1');
    updateCropTransform();
  });

  // Zoom (rueda) y rotación (Shift+rueda)
  cropFrame?.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.shiftKey) {
      rotation += e.deltaY * -0.1;
    } else {
      scale += e.deltaY * -0.0015;
      scale = Math.min(Math.max(scale, 0.5), 3);
      cropZoom.value = scale.toFixed(2);
    }
    updateCropTransform();
  }, { passive: false });

  // Drag
  function pointerDown(clientX, clientY) {
    dragging = true;
    dragStart = { x: clientX, y: clientY };
    posStart  = { ...pos };
  }
  function pointerMove(clientX, clientY) {
    if (!dragging) return;
    pos.x = posStart.x + (clientX - dragStart.x);
    pos.y = posStart.y + (clientY - dragStart.y);
    updateCropTransform();
  }
  function pointerUp() { dragging = false; }

  cropFrame?.addEventListener('mousedown', e => pointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => pointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', pointerUp);

  cropFrame?.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; pointerDown(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0]; pointerMove(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchend', pointerUp);

  // Controles
  cropReset?.addEventListener('click', () => {
    scale = 1; rotation = 0; pos = { x: 0, y: 0 }; cropZoom.value = '1';
    updateCropTransform();
  });
  cropCancel?.addEventListener('click', () => {
    hide(cropper);
    avatarInput.value = '';
    
    // Reabrir el modal de editar perfil si estaba abierto
    const editProfileModal = $('#editProfileModal');
    if (cropper.dataset.wasEditModalOpen === 'true' && editProfileModal) {
      editProfileModal.classList.remove('hidden');
      cropper.dataset.wasEditModalOpen = 'false';
    }
  });

  // Guardar recorte (sube al servidor para que persista tras cerrar sesión)
  cropSave?.addEventListener('click', () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Clip circular
    ctx.beginPath(); ctx.arc(size/2, size/2, size/2, 0, Math.PI*2); ctx.closePath(); ctx.clip();

    const frameSize = cropFrame.clientWidth || size;
    const imgRatio  = imgNaturalW / imgNaturalH || 1;
    const base = imgRatio >= 1
      ? { w: frameSize, h: frameSize / imgRatio }
      : { h: frameSize, w: frameSize * imgRatio };
    const drawW = base.w * scale, drawH = base.h * scale;

    ctx.imageSmoothingQuality = 'high';
    ctx.translate(size/2, size/2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      cropImg,
      -drawW/2 + (pos.x * (size/frameSize)),
      -drawH/2 + (pos.y * (size/frameSize)),
      drawW, drawH
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const oid = typeof organizacionId !== 'undefined' && organizacionId ? organizacionId : null;
    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('No se pudo generar la imagen.');
        return;
      }
      if (!oid) {
        alert('No se pudo identificar la organización. Recarga la página e intenta de nuevo.');
        hide(cropper);
        avatarInput.value = '';
        return;
      }
      const fd = new FormData();
      fd.append('imagen', blob, 'logo.png');
      try {
        const res = await fetch(`${API_BASE_URL}/organizaciones/${oid}/logo`, { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          alert(data.error || 'No se pudo guardar el logo en el servidor.');
          return;
        }
        try { localStorage.removeItem('org_avatar_b64'); } catch (_) {}
        if (organizacionData) organizacionData.logo_filename = data.filename || true;
        if (avatarCard) {
          avatarCard.src = `${API_BASE_URL}/organizaciones/${oid}/logo?v=${Date.now()}`;
        }
        if (avatarContainer) avatarContainer.classList.remove('avatar-default');
      } catch (e) {
        console.error(e);
        alert('Error de conexión al guardar el logo.');
      } finally {
        hide(cropper);
        avatarInput.value = '';
        const editProfileModal = $('#editProfileModal');
        if (cropper.dataset.wasEditModalOpen === 'true' && editProfileModal) {
          editProfileModal.classList.remove('hidden');
          cropper.dataset.wasEditModalOpen = 'false';
        }
      }
    }, 'image/png', 0.92);
  });

  // Funcionalidad de arrastrar y soltar para el logo
  const photoDropZone = $('#photoDropZone');
  
  if (photoDropZone) {
    // Hacer clic en la zona también abre el selector de archivos
    photoDropZone.addEventListener('click', () => {
      if (avatarInput) {
        avatarInput.click();
      }
    });

    // Prevenir el comportamiento por defecto del navegador
    photoDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      photoDropZone.classList.add('border-blue-500', 'bg-blue-100');
      photoDropZone.classList.remove('border-gray-300', 'hover:border-blue-400', 'hover:bg-blue-50');
    });

    photoDropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      photoDropZone.classList.remove('border-blue-500', 'bg-blue-100');
      photoDropZone.classList.add('border-gray-300', 'hover:border-blue-400', 'hover:bg-blue-50');
    });

    photoDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      photoDropZone.classList.remove('border-blue-500', 'bg-blue-100');
      photoDropZone.classList.add('border-gray-300', 'hover:border-blue-400', 'hover:bg-blue-50');
      
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        processImageFile(file);
      }
    });
  }
})();

// ==========================================================
// ========== Cargar datos de la organización =============
// ==========================================================
// Función para obtener el ID de la organización a mostrar (puede ser de la URL o del usuario logueado)
function getOrganizacionIdToDisplay() {
  // Primero verificar si hay un parámetro organizacion_id en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const organizacionIdParam = urlParams.get('organizacion_id');
  
  if (organizacionIdParam) {
    return parseInt(organizacionIdParam);
  }
  
  // Si no hay parámetro, intentar obtener la organización del usuario logueado
  return null;
}

async function cargarDatosOrganizacion() {
  try {
    // Intentar obtener organizacion_id desde la URL primero
    const organizacionIdFromUrl = getOrganizacionIdToDisplay();
    
    if (organizacionIdFromUrl) {
      // Cargar organización por ID desde la URL
      const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionIdFromUrl}`);
      const data = await response.json();
      
      if (data.success && data.organizacion) {
        organizacionData = data.organizacion;
        organizacionId = data.organizacion.id;
        
        // Verificar permisos
        const loggedUserId = parseInt(localStorage.getItem('userId') || sessionStorage.getItem('userId') || '0');
        const userRole = localStorage.getItem('userRol') || localStorage.getItem('userRole') || 
                         sessionStorage.getItem('userRol') || sessionStorage.getItem('userRole') || 'user';
        const isOwner = data.organizacion.id_usuario_org && parseInt(data.organizacion.id_usuario_org) === loggedUserId;
        const canEdit = isOwner || userRole === 'admin' || userRole === 'organizacion';
        
        if (!canEdit) {
          hideEditButtons();
        } else {
          showEditButtons(isOwner);
        }
        
        // Asegurar que el contenido principal esté visible
        mostrarContenidoPrincipal();
        
        actualizarUIOrganizacion(data.organizacion);
        cargarOportunidades();
        cargarEstadisticas();
        if (typeof window.cargarResenasPublicas === 'function') {
          window.cargarResenasPublicas();
        }
        return;
      } else {
        // Si hay organizacion_id en la URL pero no se encontró la organización
        // Verificar si el usuario logueado tiene rol organizacion pero sin organización asignada
        const userRole = localStorage.getItem('userRol') || sessionStorage.getItem('userRol');
        if (userRole === 'organizacion') {
          mostrarMensajeSinOrganizacion();
          return;
        }
      }
    }
    
    // Si no hay organizacion_id en la URL, intentar cargar la organización del usuario
    userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    
    console.log('Cargando organización para usuario:', {
      userId: userId,
      userEmail: userEmail,
      userRol: localStorage.getItem('userRol') || sessionStorage.getItem('userRol')
    });
    
    if (userId) {
      try {
        const response = await fetch(`${API_BASE_URL}/organizaciones/usuario/${userId}`, {
          method: 'GET',
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.success && data.organizacion) {
          console.log('Organización encontrada:', data.organizacion);
          
          // Verificar que la organización pertenece al usuario logueado
          const loggedUserId = parseInt(userId);
          const organizacionUserId = parseInt(data.organizacion.id_usuario_org);
          
          if (organizacionUserId !== loggedUserId) {
            console.error('ERROR: La organización no pertenece al usuario logueado. Organización userId:', organizacionUserId, 'Usuario logueado:', loggedUserId);
            alert('Error: Esta organización no pertenece a tu cuenta. Por favor, cierra sesión e inicia sesión nuevamente.');
            // Limpiar localStorage para forzar nuevo login
            localStorage.clear();
            sessionStorage.clear();
            if (typeof window.redirectTo === 'function') {
                window.redirectTo('../../inicio de sesion/login.html');
            } else {
                window.location.href = '../../inicio de sesion/login.html';
            }
            return;
          }
          
          organizacionData = data.organizacion;
          organizacionId = data.organizacion.id;
          
          // Verificar si el usuario logueado es el dueño o tiene permisos de edición
          const userRole = localStorage.getItem('userRol') || localStorage.getItem('userRole') || 
                           sessionStorage.getItem('userRol') || sessionStorage.getItem('userRole') || 'user';
          const isOwner = data.organizacion.id_usuario_org && parseInt(data.organizacion.id_usuario_org) === loggedUserId;
          const canEdit = isOwner || userRole === 'admin' || userRole === 'organizacion';
          
          console.log('Permisos:', { isOwner, canEdit, userRole, organizacionUserId, loggedUserId });
          
          // Ocultar botones de edición si el usuario es "usuario" y no es el dueño
          if (!canEdit) {
            hideEditButtons();
          } else {
            showEditButtons(isOwner);
          }
          
          // Asegurar que el contenido principal esté visible
          mostrarContenidoPrincipal();
          
          // Actualizar UI con los datos
          actualizarUIOrganizacion(data.organizacion);
          
          // Cargar oportunidades
          cargarOportunidades();
          
          // Cargar estadísticas
          cargarEstadisticas();
          
          if (typeof window.cargarResenasPublicas === 'function') {
            window.cargarResenasPublicas();
          }
          return;
        } else {
          console.error('No se encontró organización para el usuario:', data.error || 'Error desconocido');
          // Mostrar mensaje de que no hay organización
          mostrarMensajeSinOrganizacion();
          return;
        }
      } catch (error) {
        console.error('Error al cargar organización del usuario:', error);
        mostrarMensajeSinOrganizacion();
        return;
      }
    } else {
      console.warn('No hay userId en localStorage/sessionStorage');
      mostrarMensajeSinOrganizacion();
      return;
    }
    
    // Si llegamos aquí, no se encontró organización
    console.log('No se encontró organización para este usuario o no hay userId');
    mostrarMensajeSinOrganizacion();
  } catch (error) {
    console.error('Error al cargar datos de la organización:', error);
    mostrarMensajeSinOrganizacion();
  }
}

// Función para mostrar mensaje cuando no hay organización
function mostrarMensajeSinOrganizacion() {
  hideEditButtons();
  
  // Ocultar todo el contenido normal
  const mainContent = document.querySelector('main');
  const profileBannerSection = document.querySelector('section.max-w-7xl');
  const contentContainer = document.querySelector('.max-w-7xl.mx-auto.px-4');
  
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  
  if (profileBannerSection) {
    profileBannerSection.style.display = 'none';
  }
  
  // Eliminar mensaje anterior si existe
  const mensajeAnterior = document.getElementById('sinOrganizacionMensaje');
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }
  
  // Crear nuevo mensaje
  const mensajeContainer = document.createElement('div');
  mensajeContainer.id = 'sinOrganizacionMensaje';
  mensajeContainer.className = 'max-w-4xl mx-auto px-4 py-12';
  mensajeContainer.style.paddingTop = '80px'; // Espacio para el header fijo
  
  // Insertar después del header-container
  const headerContainer = document.getElementById('header-container');
  if (headerContainer && headerContainer.nextSibling) {
    headerContainer.parentNode.insertBefore(mensajeContainer, headerContainer.nextSibling);
  } else {
    document.body.appendChild(mensajeContainer);
  }
  
  // Determinar la ruta al formulario según la ubicación actual
  const currentPath = window.location.pathname;
  let formularioUrl = '';
  
  if (currentPath.includes('/Roles/Perfil_organizacion/')) {
    formularioUrl = '../Formulario/index.html';
  } else if (currentPath.includes('/template/')) {
    formularioUrl = 'Roles/Formulario/index.html';
  } else {
    formularioUrl = 'template/Roles/Formulario/index.html';
  }
  
  mensajeContainer.innerHTML = `
    <div class="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-12 text-center">
      <div class="mb-6">
        <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
          <i class="fas fa-building text-6xl text-blue-600"></i>
        </div>
      </div>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4">
        No tienes una organización asociada
      </h2>
      
      <p class="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
        Para acceder al panel de organización y gestionar oportunidades de voluntariado, 
        necesitas tener una organización asociada a tu cuenta.
      </p>
      
      <p class="text-base text-gray-500 mb-8 max-w-2xl mx-auto">
        Si un administrador te asignó el rol de organización, es posible que aún no hayas 
        completado el registro de tu organización. Completa el formulario para crear tu organización.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="${formularioUrl}" 
           class="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg font-semibold text-lg">
          <i class="fas fa-file-alt"></i>
          Rellenar Formulario de Organización
        </a>
        
        <a href="../../index.html" 
           class="inline-flex items-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
          <i class="fas fa-home"></i>
          Volver al Inicio
        </a>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500">
          <i class="fas fa-info-circle mr-2"></i>
          Si ya tienes una organización registrada pero no aparece aquí, contacta al administrador del sistema.
        </p>
      </div>
    </div>
  `;
}

// Función para mostrar el contenido principal cuando hay organización
function mostrarContenidoPrincipal() {
  // Ocultar mensaje de sin organización si existe
  const mensajeContainer = document.getElementById('sinOrganizacionMensaje');
  if (mensajeContainer) {
    mensajeContainer.remove();
  }
  
  // Mostrar contenido normal
  const mainContent = document.querySelector('main');
  const profileBannerSection = document.querySelector('section.max-w-7xl');
  const contentContainer = document.querySelector('.max-w-7xl.mx-auto.px-4');
  
  if (mainContent) {
    mainContent.style.display = '';
  }
  
  if (profileBannerSection) {
    profileBannerSection.style.display = '';
  }
  
  if (contentContainer) {
    contentContainer.style.display = '';
  }
}

function actualizarUIOrganizacion(org) {
  if ($('#profileName')) $('#profileName').textContent = org.nombre || 'Organización';
  if ($('#contactEmail')) $('#contactEmail').textContent = org.email_contacto || '';
  if ($('#contactPhone')) {
    const sanitizedPhone = sanitizePhone(org.telefono_contacto || '');
    $('#contactPhone').textContent = sanitizedPhone;
    const phoneP = $('#contactPhone').closest('p');
    if (phoneP) {
      phoneP.style.display = sanitizedPhone ? 'block' : 'none';
    }
  }
  if ($('#contactLocation')) {
    const location = [org.comuna, org.region].filter(Boolean).join(', ');
    $('#contactLocation').textContent = location || '';
  }
  if ($('#aboutText')) $('#aboutText').textContent = org.descripcion || '';
  
  // Guardar en localStorage para el modal de edición
  localStorage.setItem('org_name', org.nombre || '');
  localStorage.setItem('org_contact_email', org.email_contacto || '');
  localStorage.setItem('org_contact_phone', sanitizePhone(org.telefono_contacto || ''));
  localStorage.setItem('org_contact_location', [org.comuna, org.region].filter(Boolean).join(', '));
  localStorage.setItem('org_about', org.descripcion || '');

  // Logo desde servidor (persiste tras cerrar sesión)
  const avatarCardEl = $('#avatarCard');
  const avatarContEl = $('#avatarContainer');
  const orgIdForLogo = org.id || organizacionId;
  if (avatarCardEl && org.logo_filename && orgIdForLogo) {
    avatarCardEl.src = `${API_BASE_URL}/organizaciones/${orgIdForLogo}/logo?v=${Date.now()}`;
    if (avatarContEl) avatarContEl.classList.remove('avatar-default');
  } else if (avatarCardEl) {
    const b64 = localStorage.getItem('org_avatar_b64');
    if (b64) {
      avatarCardEl.src = b64;
      if (avatarContEl) avatarContEl.classList.remove('avatar-default');
    } else {
      avatarCardEl.src = 'avatar-default-org.png';
      if (avatarContEl) avatarContEl.classList.add('avatar-default');
    }
  }
  
  // Renderizar certificaciones (asegurar que se muestren los nombres)
  const certificaciones = org.certificacion || [];
  console.log('Certificaciones cargadas en actualizarUIOrganizacion:', certificaciones);
  console.log('Tipo de certificaciones:', typeof certificaciones, Array.isArray(certificaciones));
  
  // Si certificaciones es un string, intentar parsearlo
  let certificacionesArray = certificaciones;
  if (typeof certificaciones === 'string') {
    try {
      certificacionesArray = JSON.parse(certificaciones);
      console.log('Certificaciones parseadas desde string:', certificacionesArray);
    } catch (e) {
      console.error('Error al parsear certificaciones:', e);
      certificacionesArray = [];
    }
  }
  
  renderizarCertificaciones(certificacionesArray);
}

// Función para renderizar las certificaciones
function renderizarCertificaciones(certificaciones) {
  const container = $('#certificacionesContainer');
  if (!container) {
    console.error('No se encontró el contenedor de certificaciones');
    return;
  }
  
  console.log('Renderizando certificaciones:', certificaciones);
  
  // Verificar permisos para mostrar botón de eliminar
  const loggedUserId = parseInt(localStorage.getItem('userId') || sessionStorage.getItem('userId') || '0');
  const userRole = localStorage.getItem('userRol') || localStorage.getItem('userRole') || 
                   sessionStorage.getItem('userRol') || sessionStorage.getItem('userRole') || 'user';
  const isOwner = organizacionData && organizacionData.id_usuario_org && parseInt(organizacionData.id_usuario_org) === loggedUserId;
  const canEdit = isOwner || userRole === 'admin' || userRole === 'organizacion';
  
  // Si no hay certificaciones, mostrar mensaje
  if (!certificaciones || certificaciones.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-4">No hay certificaciones registradas.</p>';
    return;
  }
  
  // Renderizar cada certificación
  console.log('Iniciando renderizado de certificaciones, cantidad:', certificaciones.length);
  const htmlCertificaciones = certificaciones.map((cert, index) => {
    console.log(`Procesando certificación ${index}:`, cert);
    // Iconos por defecto según el tipo de certificación
    const iconos = {
      'Registro INJUV': '📄',
      'Sello de Calidad': '🛡️',
      'Certificación ISO': '⭐',
      'Certificación Ambiental': '🌱',
      'Certificación Social': '🤝',
      'default': '🏆'
    };
    
    // Obtener el icono según el nombre o usar el por defecto
    const nombre = cert.nombre || cert.titulo || cert.certificacion || `Certificación ${index + 1}`;
    const descripcion = cert.descripcion || cert.subtitulo || cert.organismo || '';
    const archivo = cert.archivo || null;
    const icono = iconos[nombre] || iconos[Object.keys(iconos).find(key => nombre.includes(key))] || iconos.default;
    
    // Botón de descargar archivo si existe
    const botonDescargar = archivo ? `
      <a 
        href="${API_BASE_URL}/organizaciones/certificacion/${archivo.split('/').pop()}" 
        target="_blank"
        class="text-blue-600 hover:text-blue-800 transition"
        title="Ver/Descargar certificación"
      >
        <i class="fas fa-file-download"></i>
      </a>
    ` : '';
    
    // Botón de eliminar solo si tiene permisos
    const botonEliminar = canEdit ? `
      <button 
        onclick="eliminarCertificacion(${index})" 
        class="ml-auto text-red-600 hover:text-red-800 transition"
        title="Eliminar certificación"
      >
        <i class="fas fa-trash"></i>
      </button>
    ` : '';
    
    // Asegurar que el nombre siempre se muestre
    const nombreMostrar = nombre || `Certificación ${index + 1}`;
    
    return `
      <div class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
        <span class="text-2xl">${icono}</span>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900 text-base">${nombreMostrar}</h4>
          ${descripcion ? `<p class="text-sm text-gray-600 mt-1">${descripcion}</p>` : ''}
          ${archivo ? `<p class="text-xs text-blue-600 mt-1"><i class="fas fa-file"></i> Archivo disponible</p>` : ''}
        </div>
        <div class="flex items-center gap-2">
          ${botonDescargar}
          ${botonEliminar}
        </div>
      </div>
    `;
  }).join('');
  
  console.log('HTML generado para certificaciones:', htmlCertificaciones);
  container.innerHTML = htmlCertificaciones;
  
  if (htmlCertificaciones.trim() === '') {
    console.warn('El HTML de certificaciones está vacío');
    container.innerHTML = '<p class="text-center text-gray-500 py-4">Error al cargar las certificaciones.</p>';
  } else {
    console.log('Certificaciones renderizadas exitosamente');
  }
}

// Función para eliminar una certificación
async function eliminarCertificacion(index) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta certificación?')) {
    return;
  }

  if (!organizacionData || !organizacionId) {
    alert('Error: No se pudo identificar la organización');
    return;
  }

  const certificacionesActuales = organizacionData.certificacion || [];
  const certificacionesActualizadas = certificacionesActuales.filter((_, i) => i !== index);

  try {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_usuario_org: parseInt(userId),
        certificacion: certificacionesActualizadas
      })
    });

    const data = await response.json();

    if (data.success) {
      // Actualizar datos globales
      organizacionData = data.organizacion;
      
      // Recargar certificaciones
      renderizarCertificaciones(data.organizacion.certificacion || []);
    } else {
      alert(data.error || 'Error al eliminar la certificación');
    }
  } catch (error) {
    console.error('Error al eliminar certificación:', error);
    alert(`Error de conexión: ${error.message}`);
  }
}

// Hacer la función disponible globalmente
window.eliminarCertificacion = eliminarCertificacion;

// ==========================================================
// ========== Cargar y mostrar oportunidades ===============
// ==========================================================
let todasLasOportunidades = [];

// Función auxiliar para obtener la ubicación de una oportunidad
function obtenerUbicacionOportunidad(op) {
  const partes = [];
  
  // Usar los campos de ubicación de la oportunidad si existen
  if (op.region_opor) partes.push(op.region_opor);
  if (op.ciudad_opor) partes.push(op.ciudad_opor);
  if (op.comuna_opor) partes.push(op.comuna_opor);
  
  // Si no hay datos de ubicación de la oportunidad, usar los de la organización
  if (partes.length === 0) {
    if (op.organizacion_region) partes.push(op.organizacion_region);
    if (op.organizacion_ciudad) partes.push(op.organizacion_ciudad);
    if (op.organizacion_comuna) partes.push(op.organizacion_comuna);
  }
  
  return partes.length > 0 ? partes.join(' - ') : 'Ubicación no especificada';
}

async function cargarOportunidades() {
  // Si no hay organizacionId, intentar obtenerlo de la primera oportunidad
  // Esto puede pasar cuando un usuario con rol "usuario" ve el perfil de otra organización
  if (!organizacionId) {
    try {
      // Intentar cargar todas las oportunidades activas para obtener el organizacionId
      const response = await fetch(`${API_BASE_URL}/oportunidades?estado=activa`);
      const data = await response.json();
      
      if (data.success && data.oportunidades && data.oportunidades.length > 0) {
        // Obtener el organizacionId de la primera oportunidad
        // Nota: Esto asume que todas las oportunidades son de la misma organización
        // En el futuro, se debería pasar el organizacionId como parámetro en la URL
        const primeraOportunidad = data.oportunidades[0];
        if (primeraOportunidad.organizacion_id) {
          organizacionId = primeraOportunidad.organizacion_id;
          
          // Cargar la información de la organización
          const orgResponse = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}`);
          const orgData = await orgResponse.json();
          
          if (orgData.success && orgData.organizacion) {
            organizacionData = orgData.organizacion;
            actualizarUIOrganizacion(orgData.organizacion);
            
            // Verificar permisos
            const loggedUserId = parseInt(localStorage.getItem('userId') || sessionStorage.getItem('userId') || '0');
            const userRole = localStorage.getItem('userRol') || localStorage.getItem('userRole') || 
                             sessionStorage.getItem('userRol') || sessionStorage.getItem('userRole') || 'user';
            const isOwner = orgData.organizacion.id_usuario_org && parseInt(orgData.organizacion.id_usuario_org) === loggedUserId;
            const canEdit = isOwner || userRole === 'admin' || userRole === 'organizacion';
            
            if (!canEdit) {
              hideEditButtons();
            } else {
              showEditButtons(isOwner);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al intentar obtener organizacionId desde oportunidades:', error);
    }
  }
  
  if (!organizacionId) {
    console.error('No se pudo obtener organizacionId');
    return;
  }
  
  try {
    // Obtener el userId del usuario logueado para verificar postulaciones
    const loggedUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    // Cargar oportunidades
    const response = await fetch(`${API_BASE_URL}/oportunidades?organizacion_id=${organizacionId}&estado=todas`);
    const data = await response.json();

    if (data.success) {
      todasLasOportunidades = data.oportunidades || [];
      
      // Si hay un usuario logueado, verificar sus postulaciones
      if (loggedUserId) {
        await verificarPostulacionesUsuario(loggedUserId);
      }
      
      mostrarOportunidadesActivas();
      mostrarOportunidadesCerradas();
    }
  } catch (error) {
    console.error('Error al cargar oportunidades:', error);
  }
}

// Función para verificar si el usuario ya postuló a las oportunidades
async function verificarPostulacionesUsuario(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/postulaciones`);
    const data = await response.json();
    
    if (data.success && data.postulaciones) {
      // Crear un mapa de oportunidades a las que ya postuló
      const postulacionesMap = {};
      data.postulaciones.forEach(post => {
        postulacionesMap[post.oportunidad_id] = true;
      });
      
      // Agregar información de postulación a cada oportunidad
      todasLasOportunidades.forEach(op => {
        op.ya_postulo = postulacionesMap[op.id] || false;
      });
    }
  } catch (error) {
    console.error('Error al verificar postulaciones:', error);
  }
}

function mostrarOportunidadesActivas() {
  const activas = todasLasOportunidades.filter(op => op.estado === 'activa');
  const container = $('#volunteerOpportunitiesContainer');
  if (!container) return;

  if (activas.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay voluntariados disponibles en este momento.</p>';
    togglePaginationByButton('nextPageBtn', false);
    return;
  }
  togglePaginationByButton('nextPageBtn', true);

  const itemsPerPage = 2;
  let currentPage = 1;
  const totalPages = Math.ceil(activas.length / itemsPerPage);

  function renderOpportunities() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageOpportunities = activas.slice(startIndex, endIndex);

    container.innerHTML = '';

    pageOpportunities.forEach(op => {
      const article = document.createElement('article');
      article.className = 'border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-sm transition';
      
      // Verificar si el usuario puede editar (es dueño o admin)
      const loggedUserId = parseInt(localStorage.getItem('userId') || sessionStorage.getItem('userId') || '0');
      const userRole = localStorage.getItem('userRol') || localStorage.getItem('userRole') || 
                       sessionStorage.getItem('userRol') || sessionStorage.getItem('userRole') || 'user';
      const isOwner = organizacionData && organizacionData.id_usuario_org && parseInt(organizacionData.id_usuario_org) === loggedUserId;
      const canEdit = isOwner || userRole === 'admin' || userRole === 'organizacion';
      
      // Mostrar indicador de postulación si el usuario ya postuló
      const postulacionBadge = op.ya_postulo 
        ? '<span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">✓ Postulación lista</span>'
        : '';
      
      // Botones de administración (solo para dueños/admins)
      const adminButtons = canEdit ? `
        <button onclick="verPostulaciones(${op.id})" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
          Ver postulaciones
        </button>
        <button onclick="editarOportunidad(${op.id})" class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
          Editar
        </button>
        <button onclick="cerrarOportunidad(${op.id})" class="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700">
          Cerrar
        </button>
      ` : '';

      article.innerHTML = `
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-semibold text-gray-900">${op.titulo}</h4>
          <div class="flex items-center gap-2">
            ${postulacionBadge}
            <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">ACTIVA</span>
        </div>
        </div>
        <p class="text-sm text-gray-600 mb-2">📍 ${obtenerUbicacionOportunidad(op)}</p>
        <p class="text-gray-700 mb-2">${op.descripcion.substring(0, 150)}${op.descripcion.length > 150 ? '...' : ''}</p>
        ${op.fecha_inicio_voluntariado || op.fecha_fin_voluntariado ? `
        <div class="flex items-center gap-2 mt-2 mb-2">
          ${op.fecha_inicio_voluntariado ? `<span class="text-xs text-gray-600">📅 Inicio: ${new Date(op.fecha_inicio_voluntariado).toLocaleDateString('es-CL')}</span>` : ''}
          ${op.fecha_fin_voluntariado ? `<span class="text-xs text-gray-600">📅 Fin: ${new Date(op.fecha_fin_voluntariado).toLocaleDateString('es-CL')}</span>` : ''}
        </div>
        ` : ''}
        ${op.horas_voluntariado !== null && op.horas_voluntariado !== undefined && op.horas_voluntariado !== '' ? `
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-gray-600">⏱ Horas: ${op.horas_voluntariado}</span>
        </div>
        ` : ''}
        <div class="flex items-center gap-2 mt-3">
          <span class="text-xs text-gray-600">📊 ${op.num_postulaciones || 0} postulaciones</span>
          <span class="text-xs text-gray-600">👥 ${op.cupo_maximo || 'N/A'} cupos</span>
        </div>
        ${adminButtons ? `<div class="flex items-center gap-2 mt-3">${adminButtons}</div>` : ''}
      `;

      container.appendChild(article);
    });

    // Actualizar paginación
    if ($('#currentPage')) $('#currentPage').textContent = currentPage;
    if ($('#totalPages')) $('#totalPages').textContent = totalPages;
    if ($('#prevPageBtn')) $('#prevPageBtn').disabled = currentPage === 1;
    if ($('#nextPageBtn')) $('#nextPageBtn').disabled = currentPage === totalPages;
  }

  $('#prevPageBtn')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderOpportunities();
    }
  });

  $('#nextPageBtn')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderOpportunities();
    }
  });

  renderOpportunities();
}

function mostrarOportunidadesCerradas() {
  const cerradas = todasLasOportunidades.filter(op => op.estado === 'cerrada');
  const container = $('#closedOpportunitiesContainer');
  if (!container) return;

  if (cerradas.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay voluntariados cerrados.</p>';
    togglePaginationByButton('nextClosedBtn', false);
    return;
  }
  togglePaginationByButton('nextClosedBtn', true);

  const itemsPerPage = 2;
  let currentPage = 1;
  const totalPages = Math.ceil(cerradas.length / itemsPerPage);

  function renderClosed() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageClosed = cerradas.slice(startIndex, endIndex);

    container.innerHTML = '';

    pageClosed.forEach(op => {
      const article = document.createElement('article');
      article.className = 'border border-gray-200 rounded-lg p-4 mb-4 opacity-75 hover:shadow-sm transition';

      article.innerHTML = `
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-semibold text-gray-900">${op.titulo}</h4>
          <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">CERRADA</span>
        </div>
        <p class="text-sm text-gray-600 mb-2">📍 ${obtenerUbicacionOportunidad(op)}</p>
        <div class="flex items-center gap-2 mt-3">
          <span class="text-xs text-gray-600">📊 ${op.num_postulaciones || 0} postulaciones</span>
        </div>
      `;

      container.appendChild(article);
    });

    // Actualizar paginación
    if ($('#currentClosedPage')) $('#currentClosedPage').textContent = currentPage;
    if ($('#totalClosedPages')) $('#totalClosedPages').textContent = totalPages;
    if ($('#prevClosedBtn')) $('#prevClosedBtn').disabled = currentPage === 1;
    if ($('#nextClosedBtn')) $('#nextClosedBtn').disabled = currentPage === totalPages;
  }

  $('#prevClosedBtn')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderClosed();
    }
  });

  $('#nextClosedBtn')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderClosed();
    }
  });

  renderClosed();
}

// ==========================================================
// ========== Crear nueva oportunidad ======================
// ==========================================================
$('#createVolunteerBtn')?.addEventListener('click', () => {
  mostrarModalCrearOportunidad();
});

function mostrarModalCrearOportunidad() {
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
            <label class="block text-sm font-medium mb-1">Descripción * (Máximo 500 caracteres)</label>
            <textarea id="descripcionOportunidad" required rows="4" maxlength="500" class="w-full border rounded-lg p-2"></textarea>
            <div class="text-xs text-gray-500 mt-1">
              <span id="descripcionContador">0</span>/500 caracteres
            </div>
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
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Fecha límite de postulación</label>
              <input type="date" id="fechaLimite" class="w-full border rounded-lg p-2">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Fecha de inicio del voluntariado</label>
              <input type="date" id="fechaInicioVol" class="w-full border rounded-lg p-2">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Fecha de fin del voluntariado</label>
            <input type="date" id="fechaFinVol" class="w-full border rounded-lg p-2">
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
    
    // Contador de caracteres para descripción
    const descripcionTextarea = $('#descripcionOportunidad');
    const descripcionContador = $('#descripcionContador');
    if (descripcionTextarea && descripcionContador) {
      descripcionTextarea.addEventListener('input', function() {
        const length = this.value.length;
        descripcionContador.textContent = length;
        if (length > 500) {
          descripcionContador.classList.add('text-red-600');
          descripcionContador.classList.remove('text-gray-500');
        } else {
          descripcionContador.classList.remove('text-red-600');
          descripcionContador.classList.add('text-gray-500');
        }
      });
    }
  }, 100);

  $('#formCrearOportunidad')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await crearOportunidad();
  });
}

// Función para inicializar los selectores de ubicación en el modal de oportunidad
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
    
    // Limpiar y deshabilitar ciudades y comunas
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

window.cerrarModalCrearOportunidad = function() {
  const modal = $('#modalCrearOportunidad');
  if (modal) modal.remove();
};

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
  
  // Validar longitud de descripción
  if (descripcion && descripcion.length > 500) {
    alert('La descripción no puede exceder 500 caracteres');
    return;
  }

  // Validar horas del voluntariado (si viene)
  if (horasVoluntariado !== undefined && horasVoluntariado !== null && horasVoluntariado !== '') {
    const horasInt = parseInt(horasVoluntariado);
    if (isNaN(horasInt) || horasInt < 0) {
      alert('Horas del voluntariado inválidas (debe ser un número mayor o igual a 0)');
      return;
    }
  }
  
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
      cargarOportunidades();
    } else {
      alert('Error: ' + (data.error || 'No se pudo crear la oportunidad'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión con el servidor');
  }
}

// ==========================================================
// ========== Gestión de postulaciones =======================
// ==========================================================
window.verPostulaciones = async function(oportunidadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/oportunidades/${oportunidadId}/postulaciones`);
    const data = await response.json();

    if (data.success) {
      mostrarModalPostulaciones(data.postulaciones, oportunidadId);
    } else {
      alert('Error al cargar postulaciones');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
};

function mostrarModalPostulaciones(postulaciones, oportunidadId) {
  const modal = document.createElement('div');
  modal.id = 'modalPostulaciones';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4';
  modal.style.paddingTop = '80px';
  
  const postulacionesHTML = postulaciones.map(post => {
    const nombreCompleto = post.usuario_nombre_completo || `${post.usuario_nombre || ''} ${post.usuario_apellido || ''}`.trim() || 'Sin nombre';
    const email = post.usuario_email || '';
    const telefono = post.usuario_telefono || '';
    const rut = post.usuario_rut || 'No especificado';
    const edad = post.usuario_edad ? `${post.usuario_edad} años` : 'No especificada';
    
    // Preparar enlaces
    const gmailLink = email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}` : '#';
    const whatsappLink = telefono ? `https://wa.me/${telefono.replace(/[^0-9]/g, '')}` : '#';
    const perfilLink = post.usuario_id ? `../../Roles/Perfil_usuario/index.html?usuario_id=${post.usuario_id}` : '#';
    
    return `
    <div class="border-2 border-gray-200 rounded-lg p-5 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h4 class="text-lg font-bold text-gray-900 mb-3">${nombreCompleto}</h4>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <span class="text-xs font-semibold text-gray-500 uppercase">RUT</span>
              <p class="text-sm text-gray-800 font-medium">${rut}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500 uppercase">Edad</span>
              <p class="text-sm text-gray-800 font-medium">${edad}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <span class="text-xs font-semibold text-gray-500 uppercase">Email</span>
              <p class="text-sm text-gray-800 break-all">${email || 'No especificado'}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500 uppercase">Teléfono</span>
              <p class="text-sm text-gray-800">${telefono || 'No especificado'}</p>
            </div>
          </div>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(post.estado)} ml-4">${post.estado}</span>
      </div>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <a href="${gmailLink}" target="_blank" ${!email ? 'onclick="return false;"' : ''} 
           class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${!email ? 'opacity-50 cursor-not-allowed' : ''}">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
          </svg>
          Enviar Email
        </a>
        <a href="${whatsappLink}" target="_blank" ${!telefono ? 'onclick="return false;"' : ''} 
           class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ${!telefono ? 'opacity-50 cursor-not-allowed' : ''}">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </a>
        <a href="${perfilLink}" target="_blank" ${!post.usuario_id ? 'onclick="return false;"' : ''} 
           class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${!post.usuario_id ? 'opacity-50 cursor-not-allowed' : ''}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Ver Perfil
        </a>
      </div>
      
      <div class="border-t pt-3">
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Cambiar Estado</label>
        <select onchange="actualizarEstadoPostulacion(${post.id}, this.value, ${oportunidadId})" 
                class="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="Pendiente de revisión" ${post.estado === 'Pendiente de revisión' ? 'selected' : ''}>Pendiente de revisión</option>
          <option value="Pre-seleccionado" ${post.estado === 'Pre-seleccionado' ? 'selected' : ''}>Pre-seleccionado</option>
          <option value="Etapa de entrevista" ${post.estado === 'Etapa de entrevista' ? 'selected' : ''}>Etapa de entrevista</option>
          <option value="Seleccionado" ${post.estado === 'Seleccionado' ? 'selected' : ''}>Seleccionado</option>
          <option value="No seleccionado" ${post.estado === 'No seleccionado' ? 'selected' : ''}>No seleccionado</option>
        </select>
      </div>
    </div>
    `;
      }).join('');

  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold">Postulaciones (${postulaciones.length})</h3>
          <button onclick="cerrarModalPostulaciones()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div>
          ${postulaciones.length === 0 ? '<p class="text-gray-500 text-center py-8 text-lg">No hay postulaciones aún</p>' : postulacionesHTML}
        </div>
      </div>
        </div>
      `;
  document.body.appendChild(modal);
}

window.cerrarModalPostulaciones = function() {
  const modal = $('#modalPostulaciones');
  if (modal) modal.remove();
};

function getEstadoColor(estado) {
  const colores = {
    'Pendiente de revisión': 'bg-yellow-100 text-yellow-800',
    'Pre-seleccionado': 'bg-blue-100 text-blue-800',
    'Etapa de entrevista': 'bg-purple-100 text-purple-800',
    'Seleccionado': 'bg-green-100 text-green-800',
    'No seleccionado': 'bg-red-100 text-red-800'
  };
  return colores[estado] || 'bg-gray-100 text-gray-800';
}

window.actualizarEstadoPostulacion = async function(postulacionId, nuevoEstado, oportunidadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    const data = await response.json();

    if (data.success) {
      // Recargar postulaciones
      verPostulaciones(oportunidadId);
      // Recargar oportunidades para actualizar contadores
      cargarOportunidades();
    } else {
      alert('Error: ' + (data.error || 'No se pudo actualizar'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
};

// ==========================================================
// ========== Cerrar oportunidad ===========================
// ==========================================================
window.cerrarOportunidad = async function(oportunidadId) {
  if (!confirm('¿Estás seguro de que deseas cerrar esta oportunidad? Después podrás agregar reseñas y certificados a los voluntarios.')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/oportunidades/${oportunidadId}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'cerrada' })
    });

    const data = await response.json();

    if (data.success) {
      // Cerrar la oportunidad exitosamente, ahora mostrar el modal de reseñas y certificados
      await mostrarModalResenasCertificados(oportunidadId);
      cargarOportunidades();
    } else {
      alert('Error: ' + (data.error || 'No se pudo cerrar'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
};

// Función para mostrar el modal de reseñas y certificados
async function mostrarModalResenasCertificados(oportunidadId) {
  const modal = $('#modalResenasCertificados');
  if (!modal) return;

  // Guardar el oportunidadId en el modal para poder recargar después
  modal.dataset.oportunidadId = oportunidadId;

  // Mostrar el modal
  modal.classList.remove('hidden');

  // Cargar los voluntarios de la oportunidad
  await cargarVoluntariosParaResenas(oportunidadId);

  // Event listeners para cerrar el modal
  const closeBtn = $('#closeModalResenas');
  const cancelBtn = $('#cancelarResenas');
  
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.add('hidden');
  }
  if (cancelBtn) {
    cancelBtn.onclick = () => modal.classList.add('hidden');
  }
  
  // Cerrar al hacer clic fuera del modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  };
}

// Función para cargar los voluntarios de una oportunidad cerrada
async function cargarVoluntariosParaResenas(oportunidadId) {
  const voluntariosList = $('#voluntariosList');
  if (!voluntariosList) return;

  try {
    // Cargar todas las postulaciones de la oportunidad (aceptadas o seleccionadas)
    const response = await fetch(`${API_BASE_URL}/oportunidades/${oportunidadId}/postulaciones`);
    const data = await response.json();

    if (data.success && data.postulaciones) {
      const postulaciones = data.postulaciones;
      
      if (postulaciones.length === 0) {
        voluntariosList.innerHTML = `
          <div class="text-center py-8">
            <p class="text-gray-500">No hay voluntarios registrados para esta oportunidad.</p>
          </div>
        `;
        return;
      }

      voluntariosList.innerHTML = '';

      postulaciones.forEach(post => {
        const voluntarioCard = crearCardVoluntarioResena(post);
        voluntariosList.appendChild(voluntarioCard);
      });
    } else {
      voluntariosList.innerHTML = `
        <div class="text-center py-8">
          <p class="text-red-500">Error al cargar los voluntarios: ${data.error || 'Error desconocido'}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al cargar voluntarios:', error);
    voluntariosList.innerHTML = `
      <div class="text-center py-8">
        <p class="text-red-500">Error de conexión al cargar los voluntarios.</p>
      </div>
    `;
  }
}

// Función para crear la tarjeta de un voluntario con opciones de reseña y certificado
function crearCardVoluntarioResena(post) {
  const card = document.createElement('div');
  card.className = 'border border-gray-200 rounded-lg p-4 bg-white';
  card.id = `voluntario-card-${post.id}`;

  const nombreCompleto = post.usuario_nombre_completo || `${post.usuario_nombre || ''} ${post.usuario_apellido || ''}`.trim() || 'Voluntario';
  const email = post.usuario_email || 'No disponible';
  const tieneResena = post.resena_org_sobre_voluntario ? true : false;
  const tieneCertificado = post.ruta_certificado_pdf ? true : false;

  card.innerHTML = `
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-1">${nombreCompleto}</h3>
      <p class="text-sm text-gray-600">📧 ${email}</p>
      ${post.usuario_rut ? `<p class="text-sm text-gray-600">🆔 RUT: ${post.usuario_rut}</p>` : ''}
      ${post.usuario_edad ? `<p class="text-sm text-gray-600">🎂 Edad: ${post.usuario_edad} años</p>` : ''}
    </div>

    <!-- Calificación con estrellas -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Calificación (0-5 estrellas) ${post.calificacion_org ? `<span class="text-green-600">✓ ${parseFloat(post.calificacion_org).toFixed(1)}</span>` : ''}
      </label>
      <div class="flex items-center gap-2 mb-2">
        <div id="star-rating-${post.id}" class="flex items-center gap-1" data-rating="${post.calificacion_org || 0}">
          ${[1, 2, 3, 4, 5].map(i => `
            <button 
              type="button"
              data-star="${i}"
              class="star-btn text-2xl transition-all cursor-pointer ${post.calificacion_org && i <= post.calificacion_org ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}"
              onclick="setStarRating(${post.id}, ${i})"
              onmouseover="hoverStarRating(${post.id}, ${i})"
              onmouseout="resetStarRating(${post.id})"
            >
              ★
            </button>
          `).join('')}
        </div>
        <input 
          type="number" 
          id="calificacion-input-${post.id}" 
          min="0" 
          max="5" 
          step="0.5" 
          value="${post.calificacion_org || 0}"
          class="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
          onchange="updateStarRatingFromInput(${post.id}, this.value)"
          placeholder="0-5"
        >
        <span class="text-sm text-gray-600">estrellas</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">Puedes usar valores decimales como 3.5, 4.5, etc.</p>
    </div>

    <!-- Reseña -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Reseña sobre el voluntario ${tieneResena ? '<span class="text-green-600">✓</span>' : ''}
      </label>
      <textarea 
        id="resena-${post.id}" 
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows="4"
        placeholder="Escribe una reseña sobre el desempeño del voluntario..."
      >${post.resena_org_sobre_voluntario || ''}</textarea>
      <div class="mt-2 flex items-center gap-4">
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" id="resena-publica-${post.id}" ${post.resena_org_publica ? 'checked' : ''} class="rounded">
          <span>Hacer reseña pública</span>
        </label>
        <button 
          onclick="guardarResena(${post.id})" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Guardar reseña
        </button>
      </div>
    </div>

    <!-- Certificado -->
    <div class="border-t border-gray-200 pt-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Certificado ${tieneCertificado ? '<span class="text-green-600">✓ Subido</span>' : ''}
      </label>
      <div class="flex items-center gap-3">
        <input 
          type="file" 
          id="certificado-${post.id}" 
          accept=".pdf" 
          class="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        >
        <button 
          onclick="subirCertificado(${post.id})" 
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
        >
          Subir certificado
        </button>
        ${tieneCertificado ? `
          <button 
            onclick="enviarCertificadoPorCorreo(${post.id}, '${email}')" 
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
          >
            📧 Enviar por correo
          </button>
        ` : ''}
      </div>
    </div>
  `;

  // Inicializar la visualización de estrellas después de crear la tarjeta
  setTimeout(() => {
    const currentRating = (post.calificacion_org !== undefined && post.calificacion_org !== null) ? parseFloat(post.calificacion_org) : 0;
    updateStarDisplay(post.id, currentRating);
  }, 100);

  return card;
}

// Funciones para manejar el rating de estrellas
window.setStarRating = function(postulacionId, rating) {
  const input = $(`#calificacion-input-${postulacionId}`);
  if (input) {
    input.value = rating;
  }
  updateStarDisplay(postulacionId, rating);
};

window.hoverStarRating = function(postulacionId, rating) {
  updateStarDisplay(postulacionId, rating, true);
};

window.resetStarRating = function(postulacionId) {
  const input = $(`#calificacion-input-${postulacionId}`);
  const currentRating = input ? parseFloat(input.value) || 0 : 0;
  updateStarDisplay(postulacionId, currentRating);
};

window.updateStarRatingFromInput = function(postulacionId, value) {
  const rating = parseFloat(value) || 0;
  if (rating < 0) value = 0;
  if (rating > 5) value = 5;
  const input = $(`#calificacion-input-${postulacionId}`);
  if (input) input.value = value;
  updateStarDisplay(postulacionId, parseFloat(value) || 0);
};

function updateStarDisplay(postulacionId, rating, isHover = false) {
  const starContainer = $(`#star-rating-${postulacionId}`);
  if (!starContainer) return;
  
  const stars = starContainer.querySelectorAll('.star-btn');
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  stars.forEach((star, index) => {
    const starValue = index + 1;
    if (isHover) {
      // Durante hover, mostrar hasta la estrella sobre la que está el mouse
      star.classList.toggle('text-yellow-400', starValue <= rating);
      star.classList.toggle('text-gray-300', starValue > rating);
    } else {
      // Estado normal: mostrar estrellas llenas hasta el rating
      if (starValue <= fullStars) {
        // Estrella completamente llena
        star.classList.add('text-yellow-400');
        star.classList.remove('text-gray-300');
      } else if (starValue === fullStars + 1 && hasHalfStar) {
        // Media estrella - usar un estilo especial
        star.classList.add('text-yellow-400');
        star.classList.remove('text-gray-300');
        star.style.opacity = '0.6'; // Hacerla un poco más transparente para simular media estrella
      } else {
        // Estrella vacía
        star.classList.remove('text-yellow-400');
        star.classList.add('text-gray-300');
        star.style.opacity = '1';
      }
    }
  });
}

// Función para guardar la reseña
window.guardarResena = async function(postulacionId) {
  const resenaText = $(`#resena-${postulacionId}`)?.value || '';
  const esPublica = $(`#resena-publica-${postulacionId}`)?.checked || false;
  const calificacionInput = $(`#calificacion-input-${postulacionId}`);
  const calificacion = calificacionInput ? parseFloat(calificacionInput.value) || null : null;

  if (!resenaText.trim()) {
    alert('Por favor, escribe una reseña antes de guardar.');
    return;
  }

  if (calificacion !== null && (calificacion < 0 || calificacion > 5)) {
    alert('La calificación debe estar entre 0 y 5 estrellas.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/resena`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resena: resenaText,
        es_publica: esPublica,
        calificacion: calificacion
      })
    });

    const data = await response.json();

    if (data.success) {
      alert('Reseña guardada exitosamente');
    } else {
      alert('Error: ' + (data.error || 'No se pudo guardar la reseña'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
};

// Función para subir certificado
window.subirCertificado = async function(postulacionId) {
  const fileInput = $(`#certificado-${postulacionId}`);
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert('Por favor, selecciona un archivo PDF.');
    return;
  }

  const file = fileInput.files[0];
  
  // Validar que sea PDF
  if (file.type !== 'application/pdf') {
    alert('Por favor, selecciona un archivo PDF.');
    return;
  }

  // Validar tamaño (máximo 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
    return;
  }

  const formData = new FormData();
  formData.append('certificado', file);

  try {
    const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/certificado`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      alert('Certificado subido exitosamente');
      // Recargar la lista de voluntarios para actualizar el estado
      const modal = $('#modalResenasCertificados');
      if (modal && !modal.classList.contains('hidden')) {
        // Obtener el oportunidadId del modal (necesitamos guardarlo)
        const oportunidadId = modal.dataset.oportunidadId;
        if (oportunidadId) {
          await cargarVoluntariosParaResenas(parseInt(oportunidadId));
        }
      }
    } else {
      alert('Error: ' + (data.error || 'No se pudo subir el certificado'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
};

// Función para enviar certificado por correo
window.enviarCertificadoPorCorreo = async function(postulacionId, email) {
  if (!confirm(`¿Deseas enviar el certificado por correo a ${email}?`)) return;

  try {
    const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/enviar-certificado`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });

    const data = await response.json();

    if (data.success) {
      alert('Certificado enviado por correo exitosamente');
    } else {
      alert('Error: ' + (data.error || 'No se pudo enviar el certificado'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
};

window.editarOportunidad = async function(oportunidadId) {
  try {
    // Cargar datos de la oportunidad
    const response = await fetch(`${API_BASE_URL}/oportunidades/${oportunidadId}`);
    const data = await response.json();
    
    if (!data.success || !data.oportunidad) {
      alert('Error al cargar los datos de la oportunidad');
      return;
    }
    
    const op = data.oportunidad;
    
    // Crear modal de edición
    const modal = document.createElement('div');
    modal.id = 'modalEditarOportunidad';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4';
    modal.style.paddingTop = '80px';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">Editar Oportunidad</h3>
            <button onclick="cerrarModalEditarOportunidad()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          <form id="formEditarOportunidad" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Título *</label>
              <input type="text" id="editTituloOportunidad" required autocomplete="off" value="${op.titulo || ''}" class="w-full border rounded-lg p-2">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Descripción *</label>
              <textarea id="editDescripcionOportunidad" required rows="4" class="w-full border rounded-lg p-2">${op.descripcion || ''}</textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Meta de postulantes</label>
                <input type="number" id="editMetaPostulantes" min="1" autocomplete="off" value="${op.meta_postulantes || ''}" class="w-full border rounded-lg p-2">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Cupo máximo</label>
                <input type="number" id="editCupoMaximo" min="1" autocomplete="off" value="${op.cupo_maximo || ''}" class="w-full border rounded-lg p-2">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Fecha límite de postulación</label>
              <input type="date" id="editFechaLimite" value="${op.fecha_limite_postulacion || ''}" class="w-full border rounded-lg p-2">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Fecha de inicio del voluntariado</label>
                <input type="date" id="editFechaInicioVol" value="${op.fecha_inicio_voluntariado || ''}" class="w-full border rounded-lg p-2">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Fecha de fin del voluntariado</label>
                <input type="date" id="editFechaFinVol" value="${op.fecha_fin_voluntariado || ''}" class="w-full border rounded-lg p-2">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Horas del voluntariado (estimadas)</label>
              <input type="number" id="editHorasVoluntariado" min="0" step="1" autocomplete="off" value="${op.horas_voluntariado ?? ''}" class="w-full border rounded-lg p-2" placeholder="Ej: 20">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Tipo de Voluntariado</label>
              <select id="editTipoVoluntariado" class="w-full border rounded-lg p-2" autocomplete="off">
                <option value="">Seleccione un tipo</option>
                <option value="Educación" ${op.tipo_de_voluntariado === 'Educación' ? 'selected' : ''}>Educación</option>
                <option value="Medio Ambiente" ${op.tipo_de_voluntariado === 'Medio Ambiente' ? 'selected' : ''}>Medio Ambiente</option>
                <option value="Salud" ${op.tipo_de_voluntariado === 'Salud' ? 'selected' : ''}>Salud</option>
                <option value="Comunidad" ${op.tipo_de_voluntariado === 'Comunidad' ? 'selected' : ''}>Comunidad</option>
                <option value="Deporte" ${op.tipo_de_voluntariado === 'Deporte' ? 'selected' : ''}>Deporte</option>
                <option value="Cultura" ${op.tipo_de_voluntariado === 'Cultura' ? 'selected' : ''}>Cultura</option>
                <option value="Emergencia" ${op.tipo_de_voluntariado === 'Emergencia' ? 'selected' : ''}>Emergencia</option>
                <option value="Desarrollo Social" ${op.tipo_de_voluntariado === 'Desarrollo Social' ? 'selected' : ''}>Desarrollo Social</option>
                <option value="Tecnología" ${op.tipo_de_voluntariado === 'Tecnología' ? 'selected' : ''}>Tecnología</option>
                <option value="Arte" ${op.tipo_de_voluntariado === 'Arte' ? 'selected' : ''}>Arte</option>
                <option value="Animales" ${op.tipo_de_voluntariado === 'Animales' ? 'selected' : ''}>Animales</option>
                <option value="Adultos Mayores" ${op.tipo_de_voluntariado === 'Adultos Mayores' ? 'selected' : ''}>Adultos Mayores</option>
                <option value="Niños y Jóvenes" ${op.tipo_de_voluntariado === 'Niños y Jóvenes' ? 'selected' : ''}>Niños y Jóvenes</option>
                <option value="Discapacidad" ${op.tipo_de_voluntariado === 'Discapacidad' ? 'selected' : ''}>Discapacidad</option>
                <option value="Otro" ${op.tipo_de_voluntariado && !['Educación', 'Medio Ambiente', 'Salud', 'Comunidad', 'Deporte', 'Cultura', 'Emergencia', 'Desarrollo Social', 'Tecnología', 'Arte', 'Animales', 'Adultos Mayores', 'Niños y Jóvenes', 'Discapacidad'].includes(op.tipo_de_voluntariado) ? 'selected' : ''}>Otro</option>
              </select>
            </div>
            
            <div id="editTipoOtroContainer" class="hidden">
              <label class="block text-sm font-medium mb-1">Especificar tipo</label>
              <input type="text" id="editTipoOtro" autocomplete="off" placeholder="Escriba el tipo de voluntariado" value="${op.tipo_de_voluntariado && !['Educación', 'Medio Ambiente', 'Salud', 'Comunidad', 'Deporte', 'Cultura', 'Emergencia', 'Desarrollo Social', 'Tecnología', 'Arte', 'Animales', 'Adultos Mayores', 'Niños y Jóvenes', 'Discapacidad'].includes(op.tipo_de_voluntariado) ? op.tipo_de_voluntariado : ''}" class="w-full border rounded-lg p-2">
            </div>
            
            <div class="border-t pt-4 mt-4">
              <h4 class="text-lg font-semibold mb-3">Ubicación de la Oportunidad</h4>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Región</label>
                  <select id="editRegionOportunidad" class="w-full border rounded-lg p-2">
                    <option value="">Seleccione una región</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Ciudad</label>
                  <select id="editCiudadOportunidad" class="w-full border rounded-lg p-2">
                    <option value="">Seleccione una ciudad</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Comuna</label>
                  <select id="editComunaOportunidad" class="w-full border rounded-lg p-2">
                    <option value="">Seleccione una comuna</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="button" onclick="cerrarModalEditarOportunidad()" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Inicializar selectores de ubicación
    inicializarSelectoresUbicacionEdicion(op);
    
    // Manejar cambio en tipo de voluntariado
    setTimeout(() => {
      const tipoSelect = $('#editTipoVoluntariado');
      const tipoOtroContainer = $('#editTipoOtroContainer');
      const tipoOtroInput = $('#editTipoOtro');
      
      if (tipoSelect) {
        tipoSelect.addEventListener('change', function() {
          if (this.value === 'Otro') {
            if (tipoOtroContainer) tipoOtroContainer.classList.remove('hidden');
            if (tipoOtroInput) tipoOtroInput.required = true;
          } else {
            if (tipoOtroContainer) tipoOtroContainer.classList.add('hidden');
            if (tipoOtroInput) {
              tipoOtroInput.required = false;
              tipoOtroInput.value = '';
            }
          }
        });
        
        // Mostrar campo "Otro" si está seleccionado
        if (tipoSelect.value === 'Otro' && tipoOtroContainer) {
          tipoOtroContainer.classList.remove('hidden');
        }
      }
    }, 100);
    
    // Manejar envío del formulario
    $('#formEditarOportunidad')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await guardarEdicionOportunidad(oportunidadId);
    });
    
  } catch (error) {
    console.error('Error al cargar oportunidad para editar:', error);
    alert('Error al cargar los datos de la oportunidad');
  }
};

window.cerrarModalEditarOportunidad = function() {
  const modal = $('#modalEditarOportunidad');
  if (modal) modal.remove();
};

async function guardarEdicionOportunidad(oportunidadId) {
  const titulo = $('#editTituloOportunidad')?.value;
  const descripcion = $('#editDescripcionOportunidad')?.value;
  const metaPostulantes = $('#editMetaPostulantes')?.value;
  const cupoMaximo = $('#editCupoMaximo')?.value;
  const fechaLimite = $('#editFechaLimite')?.value;
  const fechaInicioVol = $('#editFechaInicioVol')?.value;
  const fechaFinVol = $('#editFechaFinVol')?.value;
  const horasVoluntariado = $('#editHorasVoluntariado')?.value;
  const regionOpor = $('#editRegionOportunidad')?.value;
  const ciudadOpor = $('#editCiudadOportunidad')?.value;
  const comunaOpor = $('#editComunaOportunidad')?.value;
  
  // Campo de tipo de voluntariado
  const tipoVoluntariado = $('#editTipoVoluntariado')?.value;
  const tipoOtro = $('#editTipoOtro')?.value;
  const tipoFinal = tipoVoluntariado === 'Otro' ? (tipoOtro?.trim() || null) : (tipoVoluntariado || null);

  if (!titulo || !descripcion) {
    alert('Título y descripción son requeridos');
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
    const response = await fetch(`${API_BASE_URL}/oportunidades/${oportunidadId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        meta_postulantes: metaPostulantes ? parseInt(metaPostulantes) : null,
        cupo_maximo: cupoMaximo ? parseInt(cupoMaximo) : null,
        fecha_limite_postulacion: fechaLimite || null,
        fecha_inicio_voluntariado: fechaInicioVol || null,
        fecha_fin_voluntariado: fechaFinVol || null,
        horas_voluntariado: horasVoluntariado !== undefined && horasVoluntariado !== null && horasVoluntariado !== '' ? parseInt(horasVoluntariado) : null,
        region_opor: regionOpor || null,
        ciudad_opor: ciudadOpor || null,
        comuna_opor: comunaOpor || null,
        tipo_de_voluntariado: tipoFinal
      })
    });

    const data = await response.json();

    if (data.success) {
      alert('Oportunidad actualizada exitosamente');
      cerrarModalEditarOportunidad();
      cargarOportunidades();
    } else {
      alert('Error: ' + (data.error || 'No se pudo actualizar la oportunidad'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión con el servidor');
  }
}

function inicializarSelectoresUbicacionEdicion(op) {
  const regionSelect = $('#editRegionOportunidad');
  const ciudadSelect = $('#editCiudadOportunidad');
  const comunaSelect = $('#editComunaOportunidad');

  if (!regionSelect || !ciudadSelect || !comunaSelect) return;

  // Llenar el selector de regiones
  Object.keys(ubicacionesChile).forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    if (op.region_opor === region) {
      option.selected = true;
    }
    regionSelect.appendChild(option);
  });

  // Si hay región seleccionada, cargar ciudades
  if (op.region_opor && ubicacionesChile[op.region_opor]) {
    ciudadSelect.disabled = false;
    const ciudades = Object.keys(ubicacionesChile[op.region_opor].ciudades);
    
    ciudades.forEach(ciudad => {
      const option = document.createElement('option');
      option.value = ciudad;
      option.textContent = ciudad;
      if (op.ciudad_opor === ciudad) {
        option.selected = true;
      }
      ciudadSelect.appendChild(option);
    });
    
    // Si hay ciudad seleccionada, cargar comunas
    if (op.ciudad_opor && ubicacionesChile[op.region_opor].ciudades[op.ciudad_opor]) {
      comunaSelect.disabled = false;
      const comunas = ubicacionesChile[op.region_opor].ciudades[op.ciudad_opor];
      
      comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        if (op.comuna_opor === comuna) {
          option.selected = true;
        }
        comunaSelect.appendChild(option);
      });
    }
  }

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

// ==========================================================
// ========== Cargar estadísticas ===========================
// ==========================================================
async function cargarEstadisticas() {
  if (!organizacionId) return;

  try {
    const response = await fetch(`${API_BASE_URL}/oportunidades?organizacion_id=${organizacionId}&estado=todas`);
    const data = await response.json();

    if (data.success) {
      const oportunidades = data.oportunidades || [];
      const activas = oportunidades.filter(op => op.estado === 'activa').length;
      const totalPostulaciones = oportunidades.reduce((sum, op) => sum + (op.num_postulaciones || 0), 0);
      
      // Actualizar estadísticas en la UI
      const statsContainer = $('#statsContainer');
      if (statsContainer) {
        statsContainer.innerHTML = `
          <div class="rounded-lg bg-blue-50 p-4 text-center">
            <div class="text-3xl font-bold text-blue-700">${activas}</div>
            <div class="text-xs text-blue-800 mt-1">Voluntariados Activos</div>
          </div>
          <div class="rounded-lg bg-green-50 p-4 text-center">
            <div class="text-3xl font-bold text-green-700">${totalPostulaciones}</div>
            <div class="text-xs text-green-800 mt-1">Total Postulaciones</div>
          </div>
          <div class="rounded-lg bg-yellow-50 p-4 text-center">
            <div class="text-3xl font-bold text-yellow-700">${oportunidades.length}</div>
            <div class="text-xs text-yellow-800 mt-1">Total Oportunidades</div>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}

// ==========================================================
// ========== Modal Editar Perfil ===========================
// ==========================================================
(() => {
  const editProfileBtn = $('#editProfileBtn');
  const editProfileModal = $('#editProfileModal');
  const closeEditProfileModal = $('#closeEditProfileModal');
  const cancelEditProfile = $('#cancelEditProfile');
  const saveEditProfile = $('#saveEditProfile');
  
  // Elementos del perfil
  const profileBanner = $('#profileBanner');
  const profileName = $('#profileName');
  const organizationType = $('#organizationType');
  const activeSince = $('#activeSince');
  const aboutText = $('#aboutText');
  const contactEmail = $('#contactEmail');
  const contactPhone = $('#contactPhone');
  const contactLocation = $('#contactLocation');
  
  // Formularios y elementos de edición
  const bannerColorPicker = $('#bannerColorPicker');
  const bannerColorHex = $('#bannerColorHex');
  const bannerPreview = $('#bannerPreview');
  const bannerColorInput = $('#bannerColorInput');
  const organizationNameInput = $('#organizationNameInput');
  const organizationTypeInput = $('#organizationTypeInput');
  const activeSinceInput = $('#activeSinceInput');
  const contactEmailInput = $('#contactEmailInput');
  const contactPhoneInput = $('#contactPhoneInput');
  const contactLocationInput = $('#contactLocationInput');
  const aboutInput = $('#aboutInput');

  // Variables de estado
  let currentSection = 'photo';
  let unsavedChanges = false;

  // Cargar datos guardados
  function loadProfileData() {
    const savedBannerColor = localStorage.getItem('org_banner_color') || '#262c5f';
    const savedName = localStorage.getItem('org_name');
    const savedType = localStorage.getItem('org_type');
    const savedActiveSince = localStorage.getItem('org_active_since');
    const savedAbout = localStorage.getItem('org_about');
    const savedEmail = localStorage.getItem('org_contact_email');
    const savedPhone = localStorage.getItem('org_contact_phone');
    const savedLocation = localStorage.getItem('org_contact_location');
    const savedAvatar = localStorage.getItem('org_avatar_b64');

    if (savedBannerColor && profileBanner) {
      profileBanner.style.backgroundColor = savedBannerColor;
      if (bannerColorPicker) bannerColorPicker.value = savedBannerColor;
      if (bannerColorHex) bannerColorHex.value = savedBannerColor;
      if (bannerPreview) bannerPreview.style.backgroundColor = savedBannerColor;
      if (bannerColorInput) bannerColorInput.value = savedBannerColor;
    }
    
    if (savedName && profileName) profileName.textContent = savedName;
    if (savedType && organizationType) organizationType.textContent = savedType;
    if (savedActiveSince && activeSince) activeSince.textContent = savedActiveSince;
    if (savedAbout && aboutText) aboutText.textContent = savedAbout;
    if (savedEmail && contactEmail) contactEmail.textContent = savedEmail;
    if (savedPhone && contactPhone) contactPhone.textContent = sanitizePhone(savedPhone);
    if (contactPhone) {
      const phoneP = contactPhone.closest('p');
      if (phoneP) {
        phoneP.style.display = sanitizePhone(savedPhone || '') ? 'block' : 'none';
      }
    }
    if (savedLocation && contactLocation) contactLocation.textContent = savedLocation;
    if (savedAvatar) {
      const avatarCard = $('#avatarCard');
      if (avatarCard) {
        avatarCard.src = savedAvatar;
        const avatarContainer = $('#avatarContainer');
        if (avatarContainer) avatarContainer.classList.remove('avatar-default');
      }
    }
  }

  // Cargar valores actuales en el modal
  function loadCurrentValues() {
    if (organizationNameInput && profileName) {
      organizationNameInput.value = profileName.textContent || '';
    }
    if (organizationTypeInput && organizationType) {
      organizationTypeInput.value = organizationType.textContent || '';
    }
    if (activeSinceInput && activeSince) {
      activeSinceInput.value = activeSince.textContent || '';
    }
    if (aboutInput && aboutText) {
      aboutInput.value = aboutText.textContent || '';
    }
    if (contactEmailInput && contactEmail) {
      contactEmailInput.value = contactEmail.textContent || '';
    }
    if (contactPhoneInput && contactPhone) {
      contactPhoneInput.value = contactPhone.textContent || '';
    }
    if (contactLocationInput && contactLocation) {
      contactLocationInput.value = contactLocation.textContent || '';
    }
  }

  // Mostrar sección específica
  function showSection(sectionId) {
    currentSection = sectionId;
    const sections = $$('.edit-profile-section');
    const menuItems = $$('.edit-profile-menu-item');
    
    sections.forEach(section => {
      if (section.id === `section-${sectionId}`) {
        show(section);
      } else {
        hide(section);
      }
    });

    menuItems.forEach(item => {
      if (item.dataset.section === sectionId) {
        item.classList.add('active');
        item.classList.add('bg-blue-50');
        item.classList.add('text-blue-700');
      } else {
        item.classList.remove('active');
        item.classList.remove('bg-blue-50');
        item.classList.remove('text-blue-700');
      }
    });
  }

  // Abrir modal
  editProfileBtn?.addEventListener('click', () => {
    if (editProfileModal) {
      editProfileModal.classList.remove('hidden');
      showSection('photo');
      loadCurrentValues();
    }
  });

  // Cerrar modal
  function closeModal() {
    if (editProfileModal) {
      editProfileModal.classList.add('hidden');
      unsavedChanges = false;
    }
  }

  closeEditProfileModal?.addEventListener('click', closeModal);
  cancelEditProfile?.addEventListener('click', () => {
    if (unsavedChanges && !confirm('¿Descartar los cambios no guardados?')) {
      return;
    }
    closeModal();
  });

  // Navegación del menú
  $$('.edit-profile-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      if (section) {
        showSection(section);
      }
    });
  });

  // Guardar cambios
  saveEditProfile?.addEventListener('click', async () => {
    if (!organizacionId) {
      alert('Error: No se encontró la organización');
      return;
    }

    // Guardar color del banner
    const bannerColor = bannerColorPicker?.value || '#262c5f';
    if (profileBanner) {
      profileBanner.style.backgroundColor = bannerColor;
      localStorage.setItem('org_banner_color', bannerColor);
    }
    if (bannerColorInput) bannerColorInput.value = bannerColor;

    // Preparar datos para actualizar
    const updateData = {
      id_usuario_org: parseInt(userId)
    };

    const orgName = organizationNameInput?.value.trim();
    const orgType = organizationTypeInput?.value.trim();
    const activeSinceValue = activeSinceInput?.value.trim();
    const email = contactEmailInput?.value.trim();
    const phone = sanitizePhone(contactPhoneInput?.value || '');
    if (contactPhoneInput) {
      contactPhoneInput.value = phone;
    }
    const location = contactLocationInput?.value.trim();
    const about = aboutInput?.value.trim();

    if (orgName) updateData.nombre = orgName;
    updateData.email_contacto = email || null;
    updateData.telefono_contacto = phone || null;
    if (location) {
      const parts = location.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        updateData.comuna = parts[0];
        updateData.region = parts.slice(1).join(', ');
      } else {
        updateData.comuna = location;
      }
    }
    if (about) updateData.descripcion = about;

    // Actualizar en el backend
    try {
      const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar UI local
        if (orgName && profileName) profileName.textContent = orgName;
        if (orgType && organizationType) organizationType.textContent = orgType;
        if (activeSinceValue && activeSince) activeSince.textContent = activeSinceValue;
        if (contactEmail) contactEmail.textContent = email || '';
        if (contactPhone) {
          contactPhone.textContent = phone || '';
          const phoneP = contactPhone.closest('p');
          if (phoneP) phoneP.style.display = phone ? 'block' : 'none';
        }
        if (location && contactLocation) contactLocation.textContent = location;
        if (about && aboutText) aboutText.textContent = about;

        // Guardar en localStorage
        if (orgName) localStorage.setItem('org_name', orgName);
        if (orgType) localStorage.setItem('org_type', orgType);
        if (activeSinceValue) localStorage.setItem('org_active_since', activeSinceValue);
        if (email) localStorage.setItem('org_contact_email', email);
        else localStorage.removeItem('org_contact_email');
        if (phone) localStorage.setItem('org_contact_phone', phone);
        else localStorage.removeItem('org_contact_phone');
        if (location) localStorage.setItem('org_contact_location', location);
        if (about) localStorage.setItem('org_about', about);

        // Recargar datos desde el backend
        await cargarDatosOrganizacion();

    unsavedChanges = false;
    closeModal();
        alert('Perfil actualizado exitosamente');
      } else {
        alert('Error: ' + (data.error || 'No se pudo actualizar el perfil'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  });

  // Actualizar vista previa del color del banner
  bannerColorPicker?.addEventListener('input', (e) => {
    const color = e.target.value;
    if (bannerColorHex) bannerColorHex.value = color;
    if (bannerPreview) bannerPreview.style.backgroundColor = color;
    unsavedChanges = true;
  });

  bannerColorHex?.addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      if (bannerColorPicker) bannerColorPicker.value = color;
      if (bannerPreview) bannerPreview.style.backgroundColor = color;
      unsavedChanges = true;
    }
  });

  // Marcar cambios no guardados
  organizationNameInput?.addEventListener('input', () => { unsavedChanges = true; });
  organizationTypeInput?.addEventListener('input', () => { unsavedChanges = true; });
  activeSinceInput?.addEventListener('input', () => { unsavedChanges = true; });
  contactEmailInput?.addEventListener('input', () => { unsavedChanges = true; });
  contactPhoneInput?.addEventListener('input', (e) => {
    e.target.value = sanitizePhone(e.target.value);
    unsavedChanges = true;
  });
  contactLocationInput?.addEventListener('input', () => { unsavedChanges = true; });
  aboutInput?.addEventListener('input', () => { unsavedChanges = true; });

  // Cargar datos al iniciar
  loadProfileData();
})();

// ==========================================================
// ========== Paginación de Reseñas ========================
// ==========================================================
(() => {
  let allReviews = []; // Se llenará con las reseñas del backend
  const itemsPerPage = 2;
  let currentPage = 1;

  const container = document.getElementById('reviewsContainer');
  const prevBtn = document.getElementById('prevReviewsBtn');
  const nextBtn = document.getElementById('nextReviewsBtn');
  const currentPageSpan = document.getElementById('currentReviewsPage');
  const totalPagesSpan = document.getElementById('totalReviewsPages');
  const reviewsPagination = nextBtn?.parentElement;

  // Font Awesome 6: una fila estable (sin emojis ni recortes con overflow)
  function generarEstrellasReseñas(calificacion) {
    const cal = Math.max(0, Math.min(5, Number(calificacion)));
    if (Number.isNaN(cal) || cal <= 0) return '';
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (cal >= i) {
        html += '<i class="fas fa-star text-amber-400 flex-shrink-0" aria-hidden="true"></i>';
      } else if (cal >= i - 0.5) {
        html += '<i class="fas fa-star-half-stroke text-amber-400 flex-shrink-0" aria-hidden="true"></i>';
      } else {
        html += '<i class="far fa-star text-gray-300 flex-shrink-0" aria-hidden="true"></i>';
      }
    }
    return html;
  }

  function actualizarResumenCalificacionPerfil() {
    const ratingElement = document.getElementById('profileRating');
    if (!ratingElement) return;

    const calificacionesValidas = allReviews
      .map(review => Number(review.rating))
      .filter(rating => !Number.isNaN(rating) && rating > 0);

    if (calificacionesValidas.length === 0) {
      ratingElement.textContent = '⭐ Sin calificaciones aún';
      return;
    }

    const promedio = calificacionesValidas.reduce((acc, rating) => acc + rating, 0) / calificacionesValidas.length;
    const textoResenas = calificacionesValidas.length === 1 ? 'reseña' : 'reseñas';
    ratingElement.textContent = `⭐ ${promedio.toFixed(1)}/5 (${calificacionesValidas.length} ${textoResenas})`;
  }

  // Cargar reseñas desde el backend
  async function cargarResenasPublicas() {
    if (!organizacionId) {
      if (container) {
        container.innerHTML = '<p class="text-gray-600 text-center py-4">No se pudo cargar las reseñas.</p>';
      }
      return;
    }

    try {
      // Cargar solo reseñas públicas para el perfil público
      const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}/reseñas?solo_publicas=true`, {
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.reseñas_por_voluntariado) {
        // Aplanar todas las reseñas de todos los voluntariados
        allReviews = [];
        data.reseñas_por_voluntariado.forEach(voluntariado => {
          voluntariado.reseñas.forEach(reseña => {
            // Solo incluir reseñas públicas
            // es_publica es true por defecto si no existe el campo o es null
                       const esPublica = reseñaEsPublicaParaMostrar(reseña.es_publica);
            if (esPublica) {
              allReviews.push({
                userName: reseña.usuario_nombre,
                volunteerTitle: voluntariado.oportunidad_titulo,
                rating: reseña.calificacion || 0,
                comment: reseña.reseña || '',
                date: reseña.fecha_postulacion || new Date().toISOString().split('T')[0]
              });
            }
          });
        });
        
        console.log('Total reseñas públicas encontradas:', allReviews.length);

        // Ordenar por fecha (más recientes primero)
        allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        actualizarResumenCalificacionPerfil();
        currentPage = 1;
        renderReviews();
      } else {
        if (container) {
          container.innerHTML = '<p class="text-gray-600 text-center py-4">Aún no hay reseñas públicas disponibles.</p>';
        }
        allReviews = [];
        actualizarResumenCalificacionPerfil();
        renderReviews();
      }
    } catch (error) {
      console.error('Error cargando reseñas:', error);
      if (container) {
        container.innerHTML = '<p class="text-gray-600 text-center py-4">Error al cargar las reseñas.</p>';
      }
      allReviews = [];
      actualizarResumenCalificacionPerfil();
      renderReviews();
    }
  }

  function renderReviews() {
    if (!container) return;

    if (allReviews.length === 0) {
      container.innerHTML = '<p class="text-gray-600 text-center py-4">Aún no hay reseñas públicas disponibles.</p>';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      if (currentPageSpan) currentPageSpan.textContent = '1';
      if (totalPagesSpan) totalPagesSpan.textContent = '1';
      if (reviewsPagination) reviewsPagination.style.display = 'none';
      return;
    }
    if (reviewsPagination) reviewsPagination.style.display = 'flex';

    const totalPages = Math.ceil(allReviews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageReviews = allReviews.slice(startIndex, endIndex);

    container.innerHTML = '';

    pageReviews.forEach(review => {
      const article = document.createElement('article');
      article.className = 'border border-gray-200 rounded-lg px-4 py-3 mb-4';
      
      const fecha = review.date ? new Date(review.date).toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      }) : 'Fecha no disponible';
      
      const estrellasHtml = generarEstrellasReseñas(review.rating);
      
      article.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-gray-900">${review.userName}</p>
            <p class="text-sm text-gray-600">${review.volunteerTitle}</p>
          </div>
          <div class="flex items-center gap-0.5 flex-nowrap flex-shrink-0 text-lg leading-none">
            ${estrellasHtml}
            ${review.rating > 0 ? `<span class="text-sm text-gray-600 whitespace-nowrap tabular-nums pl-1">${Number(review.rating).toFixed(1)}</span>` : ''}
          </div>
        </div>
        ${review.comment ? `<p class="mt-3 italic text-gray-800">"${review.comment}"</p>` : ''}
        <p class="mt-3 text-xs text-gray-500">${fecha}</p>
      `;

      container.appendChild(article);
    });

    // Actualizar información de página
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;

    // Actualizar estado de botones
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderReviews();
    }
  });

  nextBtn?.addEventListener('click', () => {
    const totalPages = Math.ceil(allReviews.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderReviews();
    }
  });

  // Hacer la función accesible globalmente
  window.cargarResenasPublicas = cargarResenasPublicas;

  // No renderizar inicialmente, esperar a que se carguen los datos
  // renderReviews();
})();

// ==========================================================
// ========== Inicialización ===============================
// ==========================================================
// ==========================================================
// ========== Funcionalidad de Certificaciones =============
// ==========================================================

// Abrir modal de agregar certificación
function abrirModalCertificacion() {
  const modal = $('#modalAgregarCertificacion');
  if (modal) {
    modal.classList.remove('hidden');
    // Limpiar formulario
    const form = $('#formAgregarCertificacion');
    if (form) form.reset();
    // Ocultar mensajes
    const successMsg = $('#successMessageCertificacion');
    const errorMsg = $('#errorMessageCertificacion');
    if (successMsg) successMsg.classList.add('hidden');
    if (errorMsg) errorMsg.classList.add('hidden');
  }
}

// Cerrar modal de certificación
function cerrarModalCertificacion() {
  const modal = $('#modalAgregarCertificacion');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Event listeners para el modal de certificaciones
document.addEventListener('DOMContentLoaded', () => {
  // Botón para abrir modal
  const btnAgregar = $('#btnAgregarCertificacion');
  if (btnAgregar) {
    btnAgregar.addEventListener('click', () => {
      // Verificar que el usuario tenga permisos
      const loggedUserId = parseInt(localStorage.getItem('userId') || sessionStorage.getItem('userId') || '0');
      const userRole = localStorage.getItem('userRol') || localStorage.getItem('userRole') || 
                       sessionStorage.getItem('userRol') || sessionStorage.getItem('userRole') || 'user';
      const isOwner = organizacionData && organizacionData.id_usuario_org && parseInt(organizacionData.id_usuario_org) === loggedUserId;
      const canEdit = isOwner || userRole === 'admin' || userRole === 'organizacion';
      
      if (!canEdit) {
        alert('No tienes permisos para agregar certificaciones');
        return;
      }
      
      abrirModalCertificacion();
    });
  }

  // Botones para cerrar modal
  const closeBtn = $('#closeModalCertificacion');
  const cancelBtn = $('#cancelarCertificacion');
  if (closeBtn) closeBtn.addEventListener('click', cerrarModalCertificacion);
  if (cancelBtn) cancelBtn.addEventListener('click', cerrarModalCertificacion);

  // Cerrar modal al hacer clic fuera
  const modal = $('#modalAgregarCertificacion');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModalCertificacion();
      }
    });
  }

  // Manejar envío del formulario
  const form = $('#formAgregarCertificacion');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!organizacionData || !organizacionId) {
        alert('Error: No se pudo identificar la organización');
        return;
      }

      const nombre = $('#nombreCertificacion').value.trim();
      const descripcion = $('#descripcionCertificacion').value.trim();

      if (!nombre) {
        const errorMsg = $('#errorMessageCertificacion');
        if (errorMsg) {
          errorMsg.textContent = 'Por favor, ingresa el nombre de la certificación';
          errorMsg.classList.remove('hidden');
        }
        return;
      }

      // Obtener archivo si existe
      const archivoInput = $('#archivoCertificacion');
      const archivo = archivoInput ? archivoInput.files[0] : null;
      
      // Validar tamaño del archivo (máx 10MB)
      if (archivo && archivo.size > 10 * 1024 * 1024) {
        const errorMsg = $('#errorMessageCertificacion');
        if (errorMsg) {
          errorMsg.textContent = 'El archivo es demasiado grande. Tamaño máximo: 10MB';
          errorMsg.classList.remove('hidden');
        }
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        return;
      }
      
      let rutaArchivo = null;
      
      // Si hay archivo, subirlo primero
      if (archivo) {
        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('id_usuario_org', userId);
        
        const uploadResponse = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}/certificacion/upload`, {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadResponse.json();
        
        if (!uploadData.success) {
          if (errorMsg) {
            errorMsg.textContent = uploadData.error || 'Error al subir el archivo';
            errorMsg.classList.remove('hidden');
          }
          btnGuardar.disabled = false;
          btnGuardar.innerHTML = textoOriginal;
          return;
        }
        
        rutaArchivo = uploadData.ruta;
      }
      
      // Obtener certificaciones actuales
      const certificacionesActuales = organizacionData.certificacion || [];
      
      // Agregar nueva certificación
      const nuevaCertificacion = {
        nombre: nombre,
        descripcion: descripcion || '',
        archivo: rutaArchivo || null
      };
      
      const certificacionesActualizadas = [...certificacionesActuales, nuevaCertificacion];

      // Mostrar estado de carga
      const btnGuardar = $('#guardarCertificacion');
      const textoOriginal = btnGuardar.innerHTML;
      btnGuardar.disabled = true;
      btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

      // Ocultar mensajes anteriores
      const successMsg = $('#successMessageCertificacion');
      const errorMsg = $('#errorMessageCertificacion');
      if (successMsg) successMsg.classList.add('hidden');
      if (errorMsg) errorMsg.classList.add('hidden');

      try {
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario_org: parseInt(userId),
            certificacion: certificacionesActualizadas
          })
        });

        const data = await response.json();

        if (data.success) {
          // Mostrar mensaje de éxito
          if (successMsg) {
            successMsg.textContent = 'Certificación agregada exitosamente';
            successMsg.classList.remove('hidden');
          }

          // Actualizar datos globales
          organizacionData = data.organizacion;
          
          // Recargar certificaciones
          renderizarCertificaciones(data.organizacion.certificacion || []);

          // Cerrar modal después de 1.5 segundos
          setTimeout(() => {
            cerrarModalCertificacion();
          }, 1500);
        } else {
          if (errorMsg) {
            errorMsg.textContent = data.error || 'Error al agregar la certificación';
            errorMsg.classList.remove('hidden');
          }
          btnGuardar.disabled = false;
          btnGuardar.innerHTML = textoOriginal;
        }
      } catch (error) {
        console.error('Error al agregar certificación:', error);
        if (errorMsg) {
          errorMsg.textContent = `Error de conexión: ${error.message}`;
          errorMsg.classList.remove('hidden');
        }
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
      }
    });
  }

  actualizarVisibilidadPaginacionesVacias();
});

// ==========================================================
// ========== Funcionalidad de Certificaciones =============
// ==========================================================

// Abrir modal de agregar certificación
function abrirModalCertificacion() {
  const modal = $('#modalAgregarCertificacion');
  if (modal) {
    modal.classList.remove('hidden');
    // Limpiar formulario
    const form = $('#formAgregarCertificacion');
    if (form) form.reset();
    // Ocultar mensajes
    const successMsg = $('#successMessageCertificacion');
    const errorMsg = $('#errorMessageCertificacion');
    if (successMsg) successMsg.classList.add('hidden');
    if (errorMsg) errorMsg.classList.add('hidden');
  }
}

// Cerrar modal de certificación
function cerrarModalCertificacion() {
  const modal = $('#modalAgregarCertificacion');
  if (modal) {
    modal.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Cargando perfil de organización...');
  
  // Verificar permisos antes de cargar datos
  const loggedUserId = parseInt(localStorage.getItem('userId') || sessionStorage.getItem('userId') || '0');
  const userRole = localStorage.getItem('userRol') || localStorage.getItem('userRole') || 
                   sessionStorage.getItem('userRol') || sessionStorage.getItem('userRole') || 'user';
  
  // Si el usuario tiene rol "usuario" y no hay userId, ocultar botones inmediatamente
  if (userRole === 'user' && !loggedUserId) {
    hideEditButtons();
  }
  
  // Event listeners para el modal de certificaciones
  // Botón para abrir modal
  const btnAgregar = $('#btnAgregarCertificacion');
  if (btnAgregar) {
    btnAgregar.addEventListener('click', () => {
      // Verificar que el usuario tenga permisos
      const isOwner = organizacionData && organizacionData.id_usuario_org && parseInt(organizacionData.id_usuario_org) === loggedUserId;
      const canEdit = isOwner || userRole === 'admin' || userRole === 'organizacion';
      
      if (!canEdit) {
        alert('No tienes permisos para agregar certificaciones');
        return;
      }
      
      abrirModalCertificacion();
    });
  }

  // Botones para cerrar modal
  const closeBtn = $('#closeModalCertificacion');
  const cancelBtn = $('#cancelarCertificacion');
  if (closeBtn) closeBtn.addEventListener('click', cerrarModalCertificacion);
  if (cancelBtn) cancelBtn.addEventListener('click', cerrarModalCertificacion);

  // Cerrar modal al hacer clic fuera
  const modal = $('#modalAgregarCertificacion');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModalCertificacion();
      }
    });
  }

  actualizarVisibilidadPaginacionesVacias();

  // Manejar envío del formulario
  const form = $('#formAgregarCertificacion');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!organizacionData || !organizacionId) {
        alert('Error: No se pudo identificar la organización');
        return;
      }

      const nombre = $('#nombreCertificacion').value.trim();
      const descripcion = $('#descripcionCertificacion').value.trim();

      if (!nombre) {
        const errorMsg = $('#errorMessageCertificacion');
        if (errorMsg) {
          errorMsg.textContent = 'Por favor, ingresa el nombre de la certificación';
          errorMsg.classList.remove('hidden');
        }
        return;
      }

      // Obtener archivo si existe
      const archivoInput = $('#archivoCertificacion');
      const archivo = archivoInput ? archivoInput.files[0] : null;
      
      // Validar tamaño del archivo (máx 10MB)
      if (archivo && archivo.size > 10 * 1024 * 1024) {
        const errorMsg = $('#errorMessageCertificacion');
        if (errorMsg) {
          errorMsg.textContent = 'El archivo es demasiado grande. Tamaño máximo: 10MB';
          errorMsg.classList.remove('hidden');
        }
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        return;
      }
      
      let rutaArchivo = null;
      
      // Si hay archivo, subirlo primero
      if (archivo) {
        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('id_usuario_org', userId);
        
        const uploadResponse = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}/certificacion/upload`, {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadResponse.json();
        
        if (!uploadData.success) {
          if (errorMsg) {
            errorMsg.textContent = uploadData.error || 'Error al subir el archivo';
            errorMsg.classList.remove('hidden');
          }
          btnGuardar.disabled = false;
          btnGuardar.innerHTML = textoOriginal;
          return;
        }
        
        rutaArchivo = uploadData.ruta;
      }
      
      // Obtener certificaciones actuales
      const certificacionesActuales = organizacionData.certificacion || [];
      
      // Agregar nueva certificación
      const nuevaCertificacion = {
        nombre: nombre,
        descripcion: descripcion || '',
        archivo: rutaArchivo || null
      };
      
      const certificacionesActualizadas = [...certificacionesActuales, nuevaCertificacion];

      // Mostrar estado de carga
      const btnGuardar = $('#guardarCertificacion');
      const textoOriginal = btnGuardar.innerHTML;
      btnGuardar.disabled = true;
      btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

      // Ocultar mensajes anteriores
      const successMsg = $('#successMessageCertificacion');
      const errorMsg = $('#errorMessageCertificacion');
      if (successMsg) successMsg.classList.add('hidden');
      if (errorMsg) errorMsg.classList.add('hidden');

      try {
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        const response = await fetch(`${API_BASE_URL}/organizaciones/${organizacionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario_org: parseInt(userId),
            certificacion: certificacionesActualizadas
          })
        });

        const data = await response.json();

        if (data.success) {
          // Mostrar mensaje de éxito
          if (successMsg) {
            successMsg.textContent = 'Certificación agregada exitosamente';
            successMsg.classList.remove('hidden');
          }

          // Actualizar datos globales
          organizacionData = data.organizacion;
          
          // Recargar certificaciones
          renderizarCertificaciones(data.organizacion.certificacion || []);

          // Cerrar modal después de 1.5 segundos
          setTimeout(() => {
            cerrarModalCertificacion();
          }, 1500);
        } else {
          if (errorMsg) {
            errorMsg.textContent = data.error || 'Error al agregar la certificación';
            errorMsg.classList.remove('hidden');
          }
          btnGuardar.disabled = false;
          btnGuardar.innerHTML = textoOriginal;
        }
      } catch (error) {
        console.error('Error al agregar certificación:', error);
        if (errorMsg) {
          errorMsg.textContent = `Error de conexión: ${error.message}`;
          errorMsg.classList.remove('hidden');
        }
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
      }
    });
  }
  
  cargarDatosOrganizacion();
});
