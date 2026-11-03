// ====================== assets/app.js (limpio) ======================

// ---------- Constantes ----------
const API_BASE_URL = 'https://injuv.onrender.com/api';

// Base de datos de regiones, provincias (ciudades) y comunas de Chile
const ubicacionesChile = {
    "Arica y Parinacota": {
        ciudades: {
            "Arica": ["Arica", "Camarones"],
            "Parinacota": ["Putre", "General Lagos"]
        }
    },
    "Tarapacá": {
        ciudades: {
            "Iquique": ["Iquique", "Alto Hospicio"],
            "El Tamarugal": ["Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
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
            "Elqui": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña"],
            "Limarí": ["Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
            "Choapa": ["Illapel", "Canela", "Los Vilos", "Salamanca"]
        }
    },
    "Valparaíso": {
        ciudades: {
            "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar"],
            "Marga Marga": ["Quilpué", "Limache", "Olmué", "Villa Alemana"],
            "Quillota": ["Quillota", "La Calera", "Hijuelas", "La Cruz", "Nogales"],
            "San Antonio": ["San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo"],
            "San Felipe de Aconcagua": ["San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María"],
            "Los Andes": ["Los Andes", "Calle Larga", "Rinconada", "San Esteban"],
            "Petorca": ["La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar"],
            "Isla de Pascua": ["Isla de Pascua"]
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
            "Cachapoal": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente"],
            "Colchagua": ["San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
            "Cardenal Caro": ["Pichilemu", "La Estrella", "Litueche", "Marchigüe", "Navidad", "Paredones"]
        }
    },
    "Maule": {
        ciudades: {
            "Talca": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael"],
            "Curicó": ["Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén"],
            "Linares": ["Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
            "Cauquenes": ["Cauquenes", "Chanco", "Pelluhue"]
        }
    },
    "Ñuble": {
        ciudades: {
            "Diguillín": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay"],
            "Itata": ["Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Trehuaco"],
            "Punilla": ["San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"]
        }
    },
    "Bío Bío": {
        ciudades: {
            "Concepción": ["Concepción", "Chiguayante", "Coronel", "Florida", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé"],
            "Arauco": ["Arauco", "Cañete", "Contulmo", "Curanilahue", "Lebu", "Los Álamos", "Tirúa"],
            "Bío Bío": ["Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel"]
        }
    },
    "Araucanía": {
        ciudades: {
            "Cautín": ["Temuco", "Carahue", "Cholchol", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica"],
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
            "Llanquihue": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Maullín", "Puerto Varas"],
            "Chiloé": ["Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao"],
            "Osorno": ["Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo"],
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
            "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio"],
            "Tierra del Fuego": ["Porvenir", "Primavera", "Timaukel"],
            "Antártica Chilena": ["Antártica", "Cabo de Hornos"],
            "Última Esperanza": ["Natales", "Torres del Paine"]
        }
    }
};

// ---------- Helpers ----------
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const show = (el) => el?.classList.remove('hidden');
const hide = (el) => el?.classList.add('hidden');
const sanitizePhone = (value = '') => value.replace(/[^\d+\s()-]/g, '').trim();

// Función para obtener el ID del usuario a mostrar (puede ser de la URL o del usuario logueado)
function getUserIdToDisplay() {
  // Primero verificar si hay un parámetro usuario_id en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const usuarioIdParam = urlParams.get('usuario_id');
  
  if (usuarioIdParam) {
    return parseInt(usuarioIdParam);
  }
  
  // Si no hay parámetro, usar el usuario logueado
  const loggedUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  return loggedUserId ? parseInt(loggedUserId) : null;
}

// Función para ocultar opciones de edición cuando se ve el perfil de otro usuario
function hideEditOptions() {
  // Ocultar botón de editar perfil
  const editProfileBtn = $('#editProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.style.display = 'none';
  }
  
  // Ocultar botón de eliminar cuenta
  const deleteAccountBtn = $('#deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.style.display = 'none';
  }
  
  // Ocultar sección de privacidad (que contiene eliminar cuenta)
  const privacySection = document.querySelector('[data-section="privacy"]');
  if (privacySection) {
    privacySection.style.display = 'none';
  }
  
  // Ocultar modal de editar perfil si está abierto
  const editProfileModal = $('#editProfileModal');
  if (editProfileModal) {
    editProfileModal.classList.add('hidden');
  }
  
  // Agregar indicador de que es perfil de otro usuario
  const profileHeader = $('#profileName')?.parentElement;
  if (profileHeader && !profileHeader.querySelector('.profile-view-indicator')) {
    const indicator = document.createElement('div');
    indicator.className = 'profile-view-indicator text-sm text-gray-500 mt-2 italic';
    indicator.textContent = 'Vista de perfil público';
    profileHeader.appendChild(indicator);
  }
}

// Función para mostrar opciones de edición cuando es el propio perfil
function showEditOptions() {
  // Mostrar botón de editar perfil
  const editProfileBtn = $('#editProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.style.display = 'inline-flex';
  }
  
  // Mostrar botón de eliminar cuenta (si existe)
  const deleteAccountBtn = $('#deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.style.display = 'block';
  }
  
  // Mostrar sección de privacidad
  const privacySection = document.querySelector('[data-section="privacy"]');
  if (privacySection) {
    privacySection.style.display = 'block';
  }
  
  // Remover indicador de perfil público
  const indicator = document.querySelector('.profile-view-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// ==========================================================
// ================== Avatar con recorte ====================
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

  // Cargar avatar guardado
  const avatarContainer = $('#avatarContainer');
  (function loadSavedAvatar() {
    const b64 = localStorage.getItem('injuv_avatar_b64');
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

  // Abrir cropper al elegir archivo
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

    const uid = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('No se pudo generar la imagen.');
        return;
      }
      if (!uid) {
        alert('Inicia sesión para guardar la foto de perfil.');
        hide(cropper);
        avatarInput.value = '';
        return;
      }
      const fd = new FormData();
      fd.append('imagen', blob, 'perfil.png');
      try {
        const res = await fetch(`${API_BASE_URL}/usuario/${uid}/foto-perfil`, { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          alert(data.error || 'No se pudo guardar la foto en el servidor.');
          return;
        }
        try { localStorage.removeItem('injuv_avatar_b64'); } catch (_) {}
        if (avatarCard) {
          avatarCard.src = `${API_BASE_URL}/usuario/${uid}/foto-perfil?v=${Date.now()}`;
        }
        if (avatarContainer) avatarContainer.classList.remove('avatar-default');
      } catch (e) {
        console.error(e);
        alert('Error de conexión al guardar la foto.');
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

  // Funcionalidad de arrastrar y soltar para la foto
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
// ============== Cargar datos guardados ===================
// ==========================================================
(() => {
  const setPhoneVisibility = (phoneValue) => {
    const contactPhone = $('#contactPhone');
    if (!contactPhone) return;
    const phoneP = contactPhone.closest('p');
    if (!phoneP) return;
    phoneP.style.display = phoneValue && phoneValue.trim() ? 'block' : 'none';
  };

  // Cargar datos guardados al cargar la página
  (function loadEditableData(){
    // Cargar datos de contacto desde localStorage individual
    const savedEmail = localStorage.getItem('contactEmail');
    const savedPhone = localStorage.getItem('contactPhone');
    const savedLocation = localStorage.getItem('contactLocation');
    
    if (savedEmail) {
      const contactEmail = $('#contactEmail');
      if (contactEmail) contactEmail.textContent = savedEmail;
    }
    if (savedPhone) {
      const contactPhone = $('#contactPhone');
      const sanitizedPhone = sanitizePhone(savedPhone);
      if (contactPhone) contactPhone.textContent = sanitizedPhone;
    }
    setPhoneVisibility(sanitizePhone(savedPhone || ''));
    if (savedLocation) {
      const contactLocation = $('#contactLocation');
      if (contactLocation) {
        contactLocation.textContent = savedLocation;
        // Asegurar que el elemento esté visible
        const locationP = contactLocation.closest('p');
        if (locationP) locationP.style.display = 'block';
      }
    }
    
    // Cargar datos de "Acerca de mí"
    const a = localStorage.getItem('aboutText');
    if (a) $('#aboutText').textContent = a;
  })();
})();

// ==========================================================
// ============== Modal: Subir Certificados =================
// ==========================================================
(() => {
  const monthsDiff = (from, to) => {
    const y = to.getFullYear() - from.getFullYear();
    const m = to.getMonth() - from.getMonth();
    const d = to.getDate() - from.getDate();
    return y * 12 + m + (d >= 0 ? 0 : -1);
  };
  const withinSixMonths = (isoStr) => {
    if (!isoStr) return false;
    const issued = new Date(isoStr);
    const now = new Date();
    const diff = monthsDiff(issued, now);
    return diff >= 0 && diff <= 6;
  };
  const flagDate = (inputEl, flagEl) => {
    const ok = withinSixMonths(inputEl.value);
    if (!flagEl) return ok;
    flagEl.textContent = ok ? '✔ Dentro de 6 meses' : '✖ Fuera de 6 meses';
    flagEl.className = `mt-1 text-xs ${ok ? 'text-green-700' : 'text-red-700'}`;
    return ok;
  };
  const handleFileName = (inputEl, nameEl) => {
    inputEl?.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (f) { nameEl.textContent = `Seleccionado: ${f.name}`; show(nameEl); }
      else   { nameEl.textContent = ''; hide(nameEl); }
    });
  };

  // Botones abrir/cerrar
  $('#openModalBtn')?.addEventListener('click', () => show($('#modal')));
  $('#closeModalBtn')?.addEventListener('click', () => hide($('#modal')));
  $('#cancelBtn')?.addEventListener('click', () => hide($('#modal')));
  $('#modal')?.addEventListener('click', (e) => { if (e.target === $('#modal')) hide($('#modal')); });

  // Referencias del form
  const antecedentesDate = $('#antecedentesDate');
  const inhabilidadesDate = $('#inhabilidadesDate');
  const antecedentesFlag = $('#antecedentesFlag');
  const inhabilidadesFlag = $('#inhabilidadesFlag');
  const antecedentesFile = $('#antecedentesFile');
  const inhabilidadesFile = $('#inhabilidadesFile');
  const antecedentesName = $('#antecedentesName');
  const inhabilidadesName = $('#inhabilidadesName');

  handleFileName(antecedentesFile, antecedentesName);
  handleFileName(inhabilidadesFile, inhabilidadesName);
  antecedentesDate?.addEventListener('input', () => flagDate(antecedentesDate, antecedentesFlag));
  inhabilidadesDate?.addEventListener('input', () => flagDate(inhabilidadesDate, inhabilidadesFlag));

  // Submit
  $('#certForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const errs = [];
    const okA = flagDate(antecedentesDate, antecedentesFlag);
    const okI = flagDate(inhabilidadesDate, inhabilidadesFlag);
    if (!antecedentesFile?.files?.length) errs.push('Adjunta el PDF de Antecedentes.');
    if (!inhabilidadesFile?.files?.length) errs.push('Adjunta el PDF de Inhabilidades.');
    if (!okA) errs.push('La fecha de Antecedentes debe ser de los últimos 6 meses.');
    if (!okI) errs.push('La fecha de Inhabilidades debe ser de los últimos 6 meses.');

    const errorsBox  = $('#errors');
    const errorsList = errorsBox ? errorsBox.querySelector('ul') : null;
    if (errorsList) errorsList.innerHTML = '';

    if (errs.length) {
      errs.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = msg;
        errorsList?.appendChild(li);
      });
      show(errorsBox);
      return;
    }

    hide(errorsBox);
    image.png    
    // Actualizar los recuadros de certificados en el perfil
    updateCertificatesDisplay(antecedentesDate.value, inhabilidadesDate.value);
    
    alert('Certificados guardados correctamente.');
    hide($('#modal'));
    $('#certForm')?.reset();
    if (antecedentesName) antecedentesName.textContent = '';
    if (inhabilidadesName) inhabilidadesName.textContent = '';
    if (antecedentesFlag) antecedentesFlag.textContent = '';
    if (inhabilidadesFlag) inhabilidadesFlag.textContent = '';
    hide(antecedentesName); hide(inhabilidadesName);
  });
  
  // Función para actualizar la visualización de certificados
  function updateCertificatesDisplay(antecedentesDate, inhabilidadesDate) {
    const certAntecedentes = $('#cert-antecedentes');
    const certInhabilidades = $('#cert-inhabilidades');
    
    if (antecedentesDate) {
      const date = new Date(antecedentesDate);
      const formattedDate = date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
      
      if (certAntecedentes) {
        certAntecedentes.style.display = 'block';
        const orgEl = $('#cert-antecedentes-org');
        const dateEl = $('#cert-antecedentes-date');
        const statusEl = $('#cert-antecedentes-status');
        
        if (orgEl) orgEl.textContent = 'Registro Civil';
        if (dateEl) dateEl.textContent = `Emitido: ${formattedDate}`;
        if (statusEl) {
          const monthsDiff = (from, to) => {
            const y = to.getFullYear() - from.getFullYear();
            const m = to.getMonth() - from.getMonth();
            const d = to.getDate() - from.getDate();
            return y * 12 + m + (d >= 0 ? 0 : -1);
          };
          const now = new Date();
          const diff = monthsDiff(date, now);
          const isValid = diff >= 0 && diff <= 6;
          
          statusEl.textContent = isValid ? 'Obtenido' : 'Vencido';
          statusEl.className = isValid 
            ? 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-800'
            : 'text-xs px-2 py-1 rounded-full bg-red-100 text-red-800';
        }
      }
    }
    
    if (inhabilidadesDate) {
      const date = new Date(inhabilidadesDate);
      const formattedDate = date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
      
      if (certInhabilidades) {
        certInhabilidades.style.display = 'block';
        const orgEl = $('#cert-inhabilidades-org');
        const dateEl = $('#cert-inhabilidades-date');
        const statusEl = $('#cert-inhabilidades-status');
        
        if (orgEl) orgEl.textContent = 'Registro Civil';
        if (dateEl) dateEl.textContent = `Emitido: ${formattedDate}`;
        if (statusEl) {
          const monthsDiff = (from, to) => {
            const y = to.getFullYear() - from.getFullYear();
            const m = to.getMonth() - from.getMonth();
            const d = to.getDate() - from.getDate();
            return y * 12 + m + (d >= 0 ? 0 : -1);
          };
          const now = new Date();
          const diff = monthsDiff(date, now);
          const isValid = diff >= 0 && diff <= 6;
          
          statusEl.textContent = isValid ? 'Subido' : 'Vencido';
          statusEl.className = isValid 
            ? 'text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800'
            : 'text-xs px-2 py-1 rounded-full bg-red-100 text-red-800';
        }
      }
    }
  }
})();

// ==========================================================
// ================== Reseñas: Paginación ==================
// ==========================================================
(() => {
  let allReviews = []; // Se llenará con las reseñas del backend
  const itemsPerPage = 2;
  let currentPage = 1;
  let totalPages = 1;

  const container = document.getElementById('reviewsContainer');
  const prevBtn = document.getElementById('prevReviewsBtn');
  const nextBtn = document.getElementById('nextReviewsBtn');
  const currentPageSpan = document.getElementById('currentReviewsPage');
  const totalPagesSpan = document.getElementById('totalReviewsPages');
  const reviewsPagination = nextBtn?.parentElement;

  // Estrellas 0–5 con medias (SVG); una sola función — no usar String.repeat(notaDecimal) que trunca mal.
  function renderStars(rating) {
    const r = Number(rating);
    if (!Number.isFinite(r) || r <= 0) return '';

    const fullStars = Math.floor(r);
    const hasHalfStar = r % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';
    const starClass = 'h-5 w-5 flex-shrink-0 inline-block align-middle';

    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<svg viewBox="0 0 20 20" class="${starClass} text-yellow-400 fill-current" aria-hidden="true"><path d="M10 1.5l2.7 5.46 6.03.88-4.36 4.25 1.03 6.02L10 15.9l-5.4 2.84 1.03-6.02L1.27 7.84l6.03-.88L10 1.5z"/></svg>`;
    }

    if (hasHalfStar) {
      const uniqueId = `half-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      starsHTML += `<svg viewBox="0 0 20 20" class="${starClass} text-yellow-400" aria-hidden="true">
        <defs>
          <linearGradient id="${uniqueId}">
            <stop offset="50%" stop-color="currentColor"/>
            <stop offset="50%" stop-color="transparent" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <path d="M10 1.5l2.7 5.46 6.03.88-4.36 4.25 1.03 6.02L10 15.9l-5.4 2.84 1.03-6.02L1.27 7.84l6.03-.88L10 1.5z" fill="url(#${uniqueId})"/>
        <path d="M10 1.5l2.7 5.46 6.03.88-4.36 4.25 1.03 6.02L10 15.9l-5.4 2.84 1.03-6.02L1.27 7.84l6.03-.88L10 1.5z" fill="none" stroke="currentColor" stroke-width="0.5"/>
      </svg>`;
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHTML += `<svg viewBox="0 0 20 20" class="${starClass} text-gray-300 fill-current" aria-hidden="true"><path d="M10 1.5l2.7 5.46 6.03.88-4.36 4.25 1.03 6.02L10 15.9l-5.4 2.84 1.03-6.02L1.27 7.84l6.03-.88L10 1.5z"/></svg>`;
    }

    return starsHTML;
  }

  function renderReviews() {
    if (!container || allReviews.length === 0) {
      if (container) {
        container.innerHTML = '<p class="text-gray-600 text-center py-4">Aún no tienes reseñas públicas.</p>';
      }
      if (reviewsPagination) reviewsPagination.style.display = 'none';
      return;
    }
    if (reviewsPagination) reviewsPagination.style.display = 'flex';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageReviews = allReviews.slice(startIndex, endIndex);

    container.innerHTML = '';

    pageReviews.forEach(review => {
      const article = document.createElement('article');
      article.className = 'border border-gray-200 rounded-lg px-4 py-3 mb-4';
      
      const fecha = review.created_at ? new Date(review.created_at).toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      }) : review.date || 'Fecha no disponible';
      
      const calificacion = Number(review.calificacion_org ?? review.rating ?? 0) || 0;
      const estrellasHTML = renderStars(calificacion);
      
      article.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900">${review.organizacion_nombre || review.organization || 'Organización'}</p>
            <p class="text-sm text-gray-600">${review.oportunidad_titulo || review.volunteerTitle || 'Voluntariado'}</p>
          </div>
          ${calificacion > 0 ? `
            <div class="flex items-center gap-0.5 flex-nowrap flex-shrink-0">
              ${estrellasHTML}
              <span class="text-sm text-gray-600 whitespace-nowrap tabular-nums">${calificacion.toFixed(1)}</span>
            </div>
          ` : ''}
        </div>
        <p class="mt-3 italic text-gray-800">"${review.resena_org_sobre_voluntario || review.comment || ''}"</p>
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
    if (currentPage < totalPages) {
      currentPage++;
      renderReviews();
    }
  });

  // Función para actualizar las reseñas desde el backend
  window.actualizarResenasPublicas = function(reseñas) {
    allReviews = reseñas || [];
    totalPages = Math.ceil(allReviews.length / itemsPerPage);
    currentPage = 1;
    renderReviews();
  };

  // Renderizar inicialmente (mostrar mensaje si no hay reseñas)
  if (container) {
    container.innerHTML = '<p class="text-gray-600 text-center py-4">Cargando reseñas...</p>';
  }
})();

// ==========================================================
// ===== Habilidades: arrastrar + añadir + eliminar (limpio)
// ==========================================================
(() => {
  const list = $('#skillsBars');
  if (!list) return;
  
  // El botón de agregar habilidades se movió al modal "Editar perfil"
  // Este código solo renderiza las habilidades de forma estática en el perfil

  const LS_KEY = 'injuv_skills_v4';
  let skills = [];

  // Habilidades por defecto - ahora vacío
  const defaultSkills = [];

  const readInitialSkills = () => {
    // Empezar con lista vacía, sin habilidades de relleno
    return [];
  };

  function load() {
    try { 
      const saved = localStorage.getItem(LS_KEY);
      // Si no hay nada guardado, usar lista vacía
      skills = saved ? JSON.parse(saved) : readInitialSkills();
    }
    catch { 
      skills = readInitialSkills(); 
    }
    // Solo guardar si hay habilidades, no forzar habilidades por defecto
    if (skills.length > 0) {
      save();
    }
  }
  const save = () => localStorage.setItem(LS_KEY, JSON.stringify(skills));

  function render() {
    list.innerHTML = '';
    skills.forEach(s => {
      const li = document.createElement('li');
      li.className = 'space-y-2';
      li.dataset.id = s.id;
      li.innerHTML = `
          <div class="flex items-center justify-between">
          <span class="text-sm md:text-base text-gray-900">${s.name}</span>
        </div>
        <div class="bar-track" style="cursor: default; pointer-events: none;"><div class="bar-fill" style="width:${s.level}%"></div></div>
      `;

      // Las habilidades en el perfil son solo de visualización
      // Toda la edición (agregar, editar nombre, cambiar nivel, eliminar) se hace desde el modal "Editar perfil"

      list.appendChild(li);
    });
  }

  // El botón de agregar ya no existe en el perfil, se agregó al modal
  // La edición completa de habilidades se hace desde "Editar perfil"

  // Escuchar actualizaciones desde el modal
  window.addEventListener('skillsUpdated', () => {
    load(); render();
  });

  load(); render();
})();

// ==========================================================
// ========== Modal Editar Perfil (Estilo Facebook) ========
// ==========================================================
(() => {
  const editProfileBtn = $('#editProfileBtn');
  const editProfileModal = $('#editProfileModal');
  const closeEditProfileModal = $('#closeEditProfileModal');
  const cancelEditProfile = $('#cancelEditProfile');
  const saveEditProfile = $('#saveEditProfile');
  const avatarInput = $('#avatarInput');
  
  // Elementos del perfil
  const profileBanner = $('#profileBanner');
  const profileName = $('#profileName');
  const profileAge = $('#profileAge');
  
  // Formularios y elementos de edición
  const bannerColorPicker = $('#bannerColorPicker');
  const bannerColorHex = $('#bannerColorHex');
  const bannerPreview = $('#bannerPreview');
  const bannerColorInput = $('#bannerColorInput');

  // Variables de estado
  let currentSection = 'photo';
  let unsavedChanges = false;

  // Cargar datos guardados
  function loadProfileData() {
    const savedBannerColor = localStorage.getItem('injuv_banner_color') || '#1e40af';
    const savedName = localStorage.getItem('injuv_profile_name');
    const savedAge = localStorage.getItem('injuv_profile_age');

    if (savedBannerColor && profileBanner) {
      profileBanner.style.backgroundColor = savedBannerColor;
      if (bannerColorPicker) bannerColorPicker.value = savedBannerColor;
      if (bannerColorHex) bannerColorHex.value = savedBannerColor;
      if (bannerPreview) bannerPreview.style.backgroundColor = savedBannerColor;
      if (bannerColorInput) bannerColorInput.value = savedBannerColor;
    }
    
    if (savedName && profileName) profileName.textContent = savedName;
    if (savedAge && profileAge) profileAge.textContent = savedAge;
  }

  // Abrir modal
  editProfileBtn?.addEventListener('click', async () => {
    if (editProfileModal) {
      editProfileModal.classList.remove('hidden');
      // Inicializar selectores de ubicación
      inicializarSelectoresUbicacionUsuario();
      showSection('photo');
      // Cargar datos del backend antes de mostrar valores
      await loadUserDataFromBackend();
      loadCurrentValues();
    }
  });

  // Cerrar modal
  function closeModal() {
    if (editProfileModal) {
      editProfileModal.classList.add('hidden');
      unsavedChanges = false;
      // Resetear flag de inicialización para que se pueda reinicializar
      ubicacionInicializada = false;
    }
  }

  closeEditProfileModal?.addEventListener('click', closeModal);
  cancelEditProfile?.addEventListener('click', () => {
    // Restaurar valores de privacidad al cancelar
    restorePrivacyValues();
    closeModal();
  });
  
  // Función para restaurar los valores guardados de privacidad
  function restorePrivacyValues() {
    const privacyKeys = ['location', 'hours', 'age', 'email', 'phone', 'about', 'experience', 'skills', 'reviews'];
    privacyKeys.forEach(key => {
      const checkbox = document.getElementById(`privacy-${key}`);
      if (checkbox) {
        const saved = localStorage.getItem(`injuv_privacy_${key}`);
        if (saved !== null) {
          checkbox.checked = saved === 'true';
        } else {
          checkbox.checked = true; // Por defecto visible
        }
      }
    });
  }

  // Cerrar al hacer clic fuera
  editProfileModal?.addEventListener('click', (e) => {
    if (e.target === editProfileModal) closeModal();
  });

  // Cambiar de sección
  function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.edit-profile-section').forEach(section => {
      section.classList.add('hidden');
      section.style.display = 'none';
      section.style.visibility = 'hidden';
    });

    // Mostrar la sección seleccionada
    const section = document.getElementById(`section-${sectionName}`);
    if (section) {
      section.classList.remove('hidden');
      section.style.display = 'block';
      section.style.visibility = 'visible';
      section.style.opacity = '1';
      console.log(`Sección ${sectionName} mostrada correctamente`, section);
      
      // Si es la sección de contacto, asegurar que los selectores estén inicializados
      if (sectionName === 'contact') {
        setTimeout(() => {
          inicializarSelectoresUbicacionUsuario();
        }, 100);
      }
      
      // Forzar reflow para asegurar que se muestre
      section.offsetHeight;
    } else {
      console.error(`Sección no encontrada: section-${sectionName}`);
    }

    // Actualizar menú activo
    document.querySelectorAll('.edit-profile-menu-item').forEach(item => {
      item.classList.remove('active', 'bg-blue-100', 'text-blue-700');
      item.classList.add('text-gray-700');
    });

    const menuItem = $(`[data-section="${sectionName}"]`);
    if (menuItem) {
      menuItem.classList.add('active', 'bg-blue-100', 'text-blue-700');
      menuItem.classList.remove('text-gray-700');
    }

    // Ocultar/mostrar footer según la sección
    const footer = $('#editProfileFooter');
    if (footer) {
      // Ocultar footer en la sección de foto ya que el cropper tiene sus propios botones
      if (sectionName === 'photo') {
        footer.classList.add('hidden');
      } else {
        footer.classList.remove('hidden');
      }
    }

    currentSection = sectionName;
    
    // Cargar valores específicos de la sección
    if (sectionName === 'privacy') {
      loadPrivacyCheckboxValues();
    }
    
    // Cargar habilidades cuando se muestra la sección de habilidades
    if (sectionName === 'skills') {
      loadSkillsInModal();
    }
    
    // Cargar datos del backend cuando se muestra la sección de contacto
    if (sectionName === 'contact') {
      loadCurrentValues();
    }
    
    // Cargar datos del backend cuando se muestra la sección "Acerca de mí"
    if (sectionName === 'about') {
      loadCurrentValues();
    }
  }
  
  // Cargar valores de los checkboxes de privacidad
  function loadPrivacyCheckboxValues() {
    const privacyKeys = ['name', 'location', 'age', 'email', 'phone', 'about', 'experience', 'skills', 'reviews'];
    privacyKeys.forEach(key => {
      const checkbox = document.getElementById(`privacy-${key}`);
      if (checkbox) {
        const saved = localStorage.getItem(`injuv_privacy_${key}`);
        if (saved !== null) {
          checkbox.checked = saved === 'true';
        } else {
          checkbox.checked = true; // Por defecto visible
        }
      }
    });
  }

  // Event listeners para los botones del menú
  document.querySelectorAll('.edit-profile-menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      if (section) {
        console.log('Cambiando a sección:', section);
        showSection(section);
      }
    });
  });
  
  // También usar event delegation para asegurar que funcione incluso si se agregan dinámicamente
  document.addEventListener('click', (e) => {
    const menuItem = e.target.closest('.edit-profile-menu-item');
    if (menuItem) {
      const section = menuItem.getAttribute('data-section');
      if (section) {
        console.log('Cambiando a sección (delegation):', section);
        showSection(section);
      }
    }
  });

  // Cargar valores actuales al abrir modal
  // Inicializar selectores de ubicación para el perfil de usuario
  let ubicacionInicializada = false;
  function inicializarSelectoresUbicacionUsuario() {
    const regionSelect = document.getElementById('region-usuario');
    const ciudadSelect = document.getElementById('ciudad-usuario');
    const comunaSelect = document.getElementById('comuna-usuario');

    if (!regionSelect || !ciudadSelect || !comunaSelect) {
      console.log('Selectores de ubicación no encontrados');
      return;
    }
    
    // Llenar el selector de regiones si está vacío
    if (regionSelect.options.length <= 1) {
      regionSelect.innerHTML = '<option value="">Seleccione una región</option>';
      Object.keys(ubicacionesChile).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
      });
    }

    // Solo agregar event listeners una vez
    if (!ubicacionInicializada) {
      ubicacionInicializada = true;

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
  }

  async function loadCurrentValues() {
    // Cargar información de contacto desde el backend
    const userId = getUserIdToDisplay();
    if (userId) {
      try {
        const contactResponse = await fetch(`${API_BASE_URL}/usuario/${userId}/contacto`);
        const contactData = await contactResponse.json();
        
        if (contactData.success && contactData.contacto) {
          const contacto = contactData.contacto;
          const contactEmailInput = $('#contactEmailInput');
          const contactPhoneInput = $('#contactPhoneInput');
          const regionSelect = $('#region-usuario');
          const ciudadSelect = $('#ciudad-usuario');
          const comunaSelect = $('#comuna-usuario');
          
          if (contactEmailInput) {
            contactEmailInput.value = contacto.email || '';
          }
          if (contactPhoneInput) {
            contactPhoneInput.value = contacto.telefono || '';
          }
          
          // Cargar valores de ubicación en los selectores
          if (regionSelect && contacto.region) {
            regionSelect.value = contacto.region;
            // Disparar evento change para cargar ciudades
            regionSelect.dispatchEvent(new Event('change'));
            
            // Esperar un momento para que se carguen las ciudades, luego seleccionar ciudad
            setTimeout(() => {
              if (ciudadSelect && contacto.ciudad) {
                ciudadSelect.value = contacto.ciudad;
                // Disparar evento change para cargar comunas
                ciudadSelect.dispatchEvent(new Event('change'));
                
                // Esperar un momento para que se carguen las comunas, luego seleccionar comuna
                setTimeout(() => {
                  if (comunaSelect && contacto.comuna) {
                    comunaSelect.value = contacto.comuna;
                  }
                }, 100);
              }
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos de contacto:', error);
        // Si falla, cargar desde los elementos del DOM como respaldo
        const contactEmailEl = $('#contactEmail');
        const contactPhoneEl = $('#contactPhone');
        const contactLocationEl = $('#contactLocation');
        const contactEmailInput = $('#contactEmailInput');
        const contactPhoneInput = $('#contactPhoneInput');
        const regionSelect = $('#region-usuario');
        const ciudadSelect = $('#ciudad-usuario');
        const comunaSelect = $('#comuna-usuario');
        
        if (contactEmailInput && contactEmailEl) {
          contactEmailInput.value = contactEmailEl.textContent.trim() || '';
        }
        if (contactPhoneInput && contactPhoneEl) {
          contactPhoneInput.value = contactPhoneEl.textContent.trim() || '';
        }
        
        // Intentar parsear ubicación desde el texto
        if (contactLocationEl && contactLocationEl.textContent.trim()) {
          const locationText = contactLocationEl.textContent.trim();
          // Intentar extraer región y comuna del texto
          const parts = locationText.split(',').map(p => p.trim());
          if (parts.length >= 2 && regionSelect) {
            const comuna = parts[0];
            const region = parts.slice(1).join(', ');
            regionSelect.value = region;
            regionSelect.dispatchEvent(new Event('change'));
            setTimeout(() => {
              if (ciudadSelect && ciudadSelect.options.length > 1) {
                ciudadSelect.value = ciudadSelect.options[1].value; // Seleccionar primera ciudad disponible
                ciudadSelect.dispatchEvent(new Event('change'));
                setTimeout(() => {
                  if (comunaSelect) {
                    comunaSelect.value = comuna;
                  }
                }, 100);
              }
            }, 100);
          }
        }
      }
    } else {
      // Si no hay userId, cargar desde elementos del DOM
      const contactEmailEl = $('#contactEmail');
      const contactPhoneEl = $('#contactPhone');
      const contactLocationEl = $('#contactLocation');
      const contactEmailInput = $('#contactEmailInput');
      const contactPhoneInput = $('#contactPhoneInput');
      const regionSelect = $('#region-usuario');
      const ciudadSelect = $('#ciudad-usuario');
      const comunaSelect = $('#comuna-usuario');
      
      if (contactEmailInput && contactEmailEl) {
        contactEmailInput.value = contactEmailEl.textContent.trim() || '';
      }
      if (contactPhoneInput && contactPhoneEl) {
        contactPhoneInput.value = contactPhoneEl.textContent.trim() || '';
      }
      
      // Intentar parsear ubicación desde el texto
      if (contactLocationEl && contactLocationEl.textContent.trim()) {
        const locationText = contactLocationEl.textContent.trim();
        const parts = locationText.split(',').map(p => p.trim());
        if (parts.length >= 2 && regionSelect) {
          const comuna = parts[0];
          const region = parts.slice(1).join(', ');
          regionSelect.value = region;
          regionSelect.dispatchEvent(new Event('change'));
          setTimeout(() => {
            if (ciudadSelect && ciudadSelect.options.length > 1) {
              ciudadSelect.value = ciudadSelect.options[1].value;
              ciudadSelect.dispatchEvent(new Event('change'));
              setTimeout(() => {
                if (comunaSelect) {
                  comunaSelect.value = comuna;
                }
              }, 100);
            }
          }, 100);
        }
      }
    }

    // Cargar "Acerca de mí"
    const aboutTextEl = $('#aboutText');
    const aboutInput = $('#aboutInput');
    if (aboutInput && aboutTextEl) {
      aboutInput.value = aboutTextEl.textContent.trim() || '';
    }

    // Cargar color del banner
    if (profileBanner && bannerColorPicker) {
      const currentColor = getComputedStyle(profileBanner).backgroundColor;
      const hexColor = rgbToHex(currentColor);
      bannerColorPicker.value = hexColor;
      if (bannerColorHex) bannerColorHex.value = hexColor;
      if (bannerPreview) bannerPreview.style.backgroundColor = hexColor;
    }

    // Cargar preferencias de privacidad al abrir la sección
    // Nota: Ya se carga en showSection() cuando se cambia la sección
  }

  // Gestión de habilidades en el modal
  const LS_KEY_SKILLS = 'injuv_skills_v4';
  let modalSkills = []; // Variable para mantener las habilidades en el modal
  
  function loadSkillsInModal() {
    const skillsEditList = $('#skillsEditList');
    if (!skillsEditList) {
      console.error('No se encontró el elemento skillsEditList');
      return;
    }

    // Habilidades por defecto (mismas que en el perfil)
    const defaultSkills = [
      { id: 'team', name: 'Trabajo en Equipo', level: 50 },
      { id: 'comm', name: 'Comunicación Efectiva', level: 50 },
      { id: 'lead', name: 'Liderazgo', level: 50 },
      { id: 'empathy', name: 'Empatía', level: 50 },
      { id: 'solve', name: 'Resolución de Problemas', level: 50 }
    ];

    try {
      const saved = localStorage.getItem(LS_KEY_SKILLS);
      // Si no hay nada guardado o es un array vacío, usar las habilidades por defecto
      if (!saved || saved === '[]' || saved === 'null' || saved.trim() === '') {
        modalSkills = [...defaultSkills]; // Crear copia del array
      } else {
        const parsed = JSON.parse(saved);
        // Si el array parseado está vacío o no es un array válido, usar las habilidades por defecto
        if (Array.isArray(parsed) && parsed.length > 0) {
          modalSkills = parsed;
        } else {
          modalSkills = [...defaultSkills]; // Crear copia del array
        }
      }
    } catch (error) {
      console.error('Error al cargar habilidades:', error);
      modalSkills = [...defaultSkills]; // Crear copia del array
    }

    renderSkillsInModal(modalSkills);
  }

  function renderSkillsInModal(skills) {
    modalSkills = skills; // Actualizar la variable global
    const skillsEditList = $('#skillsEditList');
    if (!skillsEditList) return;

    skillsEditList.innerHTML = '';

    if (skills.length === 0) {
      skillsEditList.innerHTML = '<li class="text-gray-500 text-center py-4">No hay habilidades agregadas aún.</li>';
      return;
    }

    skills.forEach((skill) => {
      const li = document.createElement('li');
      li.className = 'border rounded-lg p-4 space-y-3';
      li.dataset.skillId = skill.id;
      li.innerHTML = `
        <div class="flex items-center justify-between">
          <input type="text" autocomplete="off" 
                 class="skill-name-input flex-1 border rounded-lg px-3 py-2 text-gray-900" 
                 value="${skill.name || ''}" 
                 placeholder="Nombre de la habilidad">
          <button class="delete-skill-btn px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
            Eliminar
          </button>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Nivel</span>
            <span class="skill-level-value font-semibold text-blue-600">${skill.level || 0}%</span>
          </div>
          <div class="bar-track-modal" style="height: 12px; background-color: #e5e7eb; border-radius: 9999px; position: relative; cursor: pointer;">
            <div class="bar-fill-modal" style="height: 100%; background-color: #2563eb; border-radius: 9999px; width: ${skill.level || 0}%; transition: width .2s ease;"></div>
          </div>
        </div>
      `;

      // Event listeners para editar nombre
      const nameInput = li.querySelector('.skill-name-input');
      nameInput.addEventListener('input', () => {
        const skillIndex = modalSkills.findIndex(s => s.id === skill.id);
        if (skillIndex !== -1) {
          modalSkills[skillIndex].name = nameInput.value.trim();
        }
        unsavedChanges = true;
      });

      // Barra arrastrable (click + drag + touch)
      const track = li.querySelector('.bar-track-modal');
      const fill = li.querySelector('.bar-fill-modal');
      const levelValue = li.querySelector('.skill-level-value');

      const setLevelFromX = (rect, clientX) => {
        const pct = Math.round(((clientX - rect.left) / rect.width) * 100);
        const level = Math.max(0, Math.min(100, pct));
        fill.style.width = `${level}%`;
        levelValue.textContent = `${level}%`;
        const skillIndex = modalSkills.findIndex(s => s.id === skill.id);
        if (skillIndex !== -1) {
          modalSkills[skillIndex].level = level;
        }
        unsavedChanges = true;
      };

      track.addEventListener('click', (e) => {
        const rect = track.getBoundingClientRect();
        setLevelFromX(rect, e.clientX);
      });

      let dragging = false, rectCache = null;
      const onMove = (clientX) => { if (!dragging) return; setLevelFromX(rectCache, clientX); };
      const onUp = () => {
        dragging = false;
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('touchmove', touchMove);
        window.removeEventListener('touchend', touchEnd);
      };
      const mouseMove = (e) => onMove(e.clientX);
      const mouseUp = () => onUp();
      const touchMove = (e) => onMove(e.touches[0].clientX);
      const touchEnd = () => onUp();

      track.addEventListener('mousedown', (e) => {
        dragging = true;
        rectCache = track.getBoundingClientRect();
        setLevelFromX(rectCache, e.clientX);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
      });

      track.addEventListener('touchstart', (e) => {
        dragging = true;
        rectCache = track.getBoundingClientRect();
        setLevelFromX(rectCache, e.touches[0].clientX);
        window.addEventListener('touchmove', touchMove, { passive: true });
        window.addEventListener('touchend', touchEnd, { passive: true });
      }, { passive: true });

      // Event listener para eliminar
      const deleteBtn = li.querySelector('.delete-skill-btn');
      deleteBtn.addEventListener('click', () => {
        if (confirm(`¿Eliminar "${skill.name || 'esta habilidad'}"?`)) {
          modalSkills = modalSkills.filter(s => s.id !== skill.id);
          renderSkillsInModal(modalSkills);
          unsavedChanges = true;
        }
      });

      skillsEditList.appendChild(li);
    });
  }

  // Función para obtener habilidades actuales desde localStorage
  function getCurrentSkills() {
    let skills = [];
    try {
      skills = JSON.parse(localStorage.getItem(LS_KEY_SKILLS)) || [];
    } catch {
      skills = [];
    }
    return skills;
  }

  // Función para guardar habilidades desde el modal
  function saveSkillsFromModal() {
    // Leer los valores actuales de los inputs (nombre) y usar modalSkills para los niveles
    const skillsEditList = $('#skillsEditList');
    if (!skillsEditList) return;

    const skillItems = skillsEditList.querySelectorAll('li[data-skill-id]');
    const skills = [];

    skillItems.forEach((li) => {
      const skillId = li.getAttribute('data-skill-id');
      const nameInput = li.querySelector('.skill-name-input');

      if (nameInput) {
        const name = nameInput.value.trim();
        // Buscar el nivel en modalSkills que ya está actualizado por el arrastre
        const skillData = modalSkills.find(s => s.id === skillId);
        const level = skillData ? skillData.level : 0;

        if (name) {
          skills.push({
            id: skillId,
            name: name,
            level: Math.max(0, Math.min(100, level))
          });
        }
      }
    });

    // Guardar en localStorage
    localStorage.setItem(LS_KEY_SKILLS, JSON.stringify(skills));
    
    // Actualizar la variable modalSkills
    modalSkills = skills;

    // Disparar evento personalizado para actualizar el renderizado del perfil
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
  }

  // Botón para agregar nueva habilidad
  $('#addSkillBtn')?.addEventListener('click', () => {
    const name = prompt('Nombre de la nueva habilidad:', 'Nueva habilidad');
    if (!name || name.trim() === '') return;

    let skills = getCurrentSkills();
    const newSkill = {
      id: 'id-' + Math.random().toString(36).slice(2, 9),
      name: name.trim(),
      level: 50
    };
    skills.push(newSkill);
    renderSkillsInModal(skills);
    unsavedChanges = true;
  });

  // Cargar valores de los checkboxes de privacidad
  function loadPrivacyCheckboxValues() {
    const privacyKeys = ['name', 'location', 'age', 'email', 'phone', 'about', 'experience', 'skills', 'reviews'];
    privacyKeys.forEach(key => {
      const checkbox = document.getElementById(`privacy-${key}`);
      if (checkbox) {
        const saved = localStorage.getItem(`injuv_privacy_${key}`);
        if (saved !== null) {
          checkbox.checked = saved === 'true';
        }
      }
    });
  }

  // Actualizar vista previa del color del banner
  bannerColorPicker?.addEventListener('input', (e) => {
    const color = e.target.value;
    if (bannerColorHex) bannerColorHex.value = color;
    if (bannerPreview) bannerPreview.style.backgroundColor = color;
    unsavedChanges = true;
  });

  bannerColorHex?.addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      if (bannerColorPicker) bannerColorPicker.value = color;
      if (bannerPreview) bannerPreview.style.backgroundColor = color;
      unsavedChanges = true;
    }
  });

  // Guardar cambios
  saveEditProfile?.addEventListener('click', async () => {
    // Guardar color del banner
    const bannerColor = bannerColorPicker?.value || '#1e40af';
    if (profileBanner) {
      profileBanner.style.backgroundColor = bannerColor;
      localStorage.setItem('injuv_banner_color', bannerColor);
    }

    // Guardar información de contacto
    const contactEmailInput = $('#contactEmailInput');
    const contactPhoneInput = $('#contactPhoneInput');
    const contactEmailEl = $('#contactEmail');
    const contactPhoneEl = $('#contactPhone');

    let email = '';
    let phone = '';

    if (contactEmailInput && contactEmailEl) {
      email = contactEmailInput.value.trim();
      if (email) {
        contactEmailEl.textContent = email;
        localStorage.setItem('contactEmail', email);
      }
    }
    if (contactPhoneInput && contactPhoneEl) {
      phone = sanitizePhone(contactPhoneInput.value);
      contactPhoneInput.value = phone;
      if (phone) {
        contactPhoneEl.textContent = phone;
        localStorage.setItem('contactPhone', phone);
      } else {
        contactPhoneEl.textContent = '';
        localStorage.removeItem('contactPhone');
      }
      const phoneP = contactPhoneEl.closest('p');
      if (phoneP) phoneP.style.display = phone ? 'block' : 'none';
    }
    // Obtener valores de los selectores de ubicación
    const regionSelect = $('#region-usuario');
    const ciudadSelect = $('#ciudad-usuario');
    const comunaSelect = $('#comuna-usuario');
    
    let region = '';
    let ciudad = '';
    let comuna = '';
    
    if (regionSelect) {
      region = regionSelect.value || '';
    }
    if (ciudadSelect) {
      ciudad = ciudadSelect.value || '';
    }
    if (comunaSelect) {
      comuna = comunaSelect.value || '';
    }
    
    // Actualizar el texto de ubicación en el perfil
    const contactLocationEl = $('#contactLocation');
    if (contactLocationEl) {
      const locationParts = [comuna, ciudad, region].filter(Boolean);
      const locationText = locationParts.length > 0 ? locationParts.join(', ') : '';
      contactLocationEl.textContent = locationText;
      // Mostrar u ocultar el elemento según si hay ubicación
      const locationP = contactLocationEl.closest('p');
      if (locationP) {
        if (locationText) {
          locationP.style.display = 'block';
          localStorage.setItem('contactLocation', locationText);
        } else {
          locationP.style.display = 'none';
        }
      }
    }
    
    try {
      // Enviar siempre, incluso si los valores están vacíos, para permitir limpiar campos
      const success = await updateContactInfoInBackend(email || '', phone || '', region || '', comuna || '', ciudad || '');
      if (success) {
        console.log('Información de contacto actualizada en el backend');
        // Recargar datos del backend para mostrar los cambios actualizados
        await loadUserDataFromBackend();
      } else {
        alert('Error al actualizar la información de contacto. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al actualizar información de contacto en el backend:', error);
      alert('Error al actualizar la información de contacto. Por favor, intenta nuevamente.');
    }

    // Guardar "Acerca de mí"
    const aboutInput = $('#aboutInput');
    const aboutTextEl = $('#aboutText');
    if (aboutInput && aboutTextEl) {
      const aboutText = aboutInput.value.trim();
      if (aboutText) {
        aboutTextEl.textContent = aboutText;
        localStorage.setItem('aboutText', aboutText);
      }
    }

    // Guardar habilidades
    saveSkillsFromModal();

    // Guardar y aplicar cambios de privacidad (solo se aplican cuando se presiona Guardar)
    if (window.savePrivacySettings) {
      window.savePrivacySettings();
    }

    unsavedChanges = false;
    
    // Recargar datos del backend después de guardar
    await loadUserDataFromBackend();
    
    closeModal();
  });

  // Marcar cambios no guardados en información de contacto
  $('#contactEmailInput')?.addEventListener('input', () => { unsavedChanges = true; });
  $('#contactPhoneInput')?.addEventListener('input', (e) => {
    e.target.value = sanitizePhone(e.target.value);
    unsavedChanges = true;
  });
  $('#contactLocationInput')?.addEventListener('input', () => { unsavedChanges = true; });
  
  // Marcar cambios no guardados en "Acerca de mí"
  $('#aboutInput')?.addEventListener('input', () => { unsavedChanges = true; });

  // Función auxiliar para convertir RGB a HEX
  function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return '#1e40af';
    
    const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  }

  // Cargar datos al iniciar
  loadProfileData();
})();

// ==========================================================
// ========== Gestión de Privacidad ========================
// ==========================================================
(() => {
  const privacyCheckboxes = {
    location: $('#privacy-location'),
    hours: $('#privacy-hours'),
    age: $('#privacy-age'),
    email: $('#privacy-email'),
    phone: $('#privacy-phone'),
    about: $('#privacy-about'),
    experience: $('#privacy-experience'),
    skills: $('#privacy-skills'),
    reviews: $('#privacy-reviews')
  };

  // Aplicar configuración de privacidad
  function applyPrivacySetting(key, isVisible) {
    const displayValue = isVisible ? '' : 'none';
    
    switch(key) {
      case 'location':
        // Ocultar la ubicación en la sección "Información de Contacto"
        const contactLocationEl = $('#contactLocation');
        if (contactLocationEl) {
          // Ocultar el <p> completo que contiene el ícono 📍 y el texto
          // Estructura: <p>📍 <span id="contactLocation">...</span></p>
          const contactLocationP = contactLocationEl.closest('p');
          if (contactLocationP) {
            contactLocationP.style.display = displayValue;
          }
        }
        break;
        
      case 'hours':
        const hoursEl = $('#profileHours');
        if (hoursEl) {
          // Ocultar el span completo que contiene el ícono ⏱ y el texto
          hoursEl.style.display = displayValue;
        }
        break;
        
      case 'age':
        const ageEl = $('#profileAge');
        if (ageEl) {
          // Ocultar el span completo que contiene el ícono 🎂 y el texto
          // Estructura: <span>🎂 <span id="profileAge">27</span> años</span>
          // El parentElement del span con id="profileAge" es el span externo con el ícono
          const ageParent = ageEl.parentElement;
          if (ageParent) {
            ageParent.style.display = displayValue;
          }
        }
        break;
        
      case 'email':
        const emailEl = $('#contactEmail');
        if (emailEl) {
          const emailP = emailEl.closest('p');
          if (emailP) emailP.style.display = displayValue;
        }
        break;
        
      case 'phone':
        const phoneEl = $('#contactPhone');
        if (phoneEl) {
          const phoneP = phoneEl.closest('p');
          if (phoneP) phoneP.style.display = displayValue;
        }
        break;
        
      case 'about':
        const aboutEl = $('#aboutText');
        if (aboutEl) {
          const aboutSection = aboutEl.closest('.section-card');
          if (aboutSection) aboutSection.style.display = displayValue;
        }
        break;
        
      case 'experience':
        // Buscar por el texto del h3
        const allDivs = Array.from(document.querySelectorAll('.bg-white.rounded-xl'));
        const experienceDiv = allDivs.find(div => {
          const h3 = div.querySelector('h3');
          return h3 && h3.textContent.trim() === 'Experiencia de Voluntariados';
        });
        if (experienceDiv) experienceDiv.style.display = displayValue;
        break;
        
      case 'skills':
        const skillsEl = $('#skillsBars');
        if (skillsEl) {
          const skillsSection = skillsEl.closest('.bg-white.rounded-xl');
          if (skillsSection) skillsSection.style.display = displayValue;
        }
        break;
        
      case 'reviews':
        const allSections = Array.from(document.querySelectorAll('section.bg-white.rounded-xl'));
        const reviewsSection = allSections.find(section => {
          const h3 = section.querySelector('h3');
          return h3 && h3.textContent.includes('Reseñas');
        });
        if (reviewsSection) reviewsSection.style.display = displayValue;
        break;
    }
  }

  // Cargar preferencias de privacidad
  function loadPrivacySettings() {
    Object.keys(privacyCheckboxes).forEach(key => {
      const checkbox = privacyCheckboxes[key];
      if (checkbox) {
        const saved = localStorage.getItem(`injuv_privacy_${key}`);
        if (saved !== null) {
          checkbox.checked = saved === 'true';
        } else {
          // Por defecto todo visible
          checkbox.checked = true;
        }
        applyPrivacySetting(key, checkbox.checked);
      }
    });
  }

  // Guardar preferencias de privacidad
  function savePrivacySettings() {
    Object.keys(privacyCheckboxes).forEach(key => {
      const checkbox = privacyCheckboxes[key];
      if (checkbox) {
        localStorage.setItem(`injuv_privacy_${key}`, checkbox.checked.toString());
        applyPrivacySetting(key, checkbox.checked);
      }
    });
  }

  // NO aplicar cambios inmediatamente al cambiar los toggles
  // Los cambios solo se aplicarán cuando se presione el botón "Guardar" del modal
  // Se removieron los event listeners que aplicaban cambios inmediatamente

  // Hacer la función accesible globalmente para que el modal pueda llamarla
  window.savePrivacySettings = savePrivacySettings;

  // Cargar preferencias al iniciar (solo para aplicar la configuración guardada)
  loadPrivacySettings();
})();

// ==========================================================
// ========== Eliminar cuenta ===============================
// ==========================================================
(() => {
  // Función para eliminar cuenta
  async function eliminarCuenta(deleteAccountBtn) {
    // Confirmación múltiple para evitar eliminaciones accidentales
    const confirmacion1 = confirm(
      '⚠️ ADVERTENCIA: Esta acción es PERMANENTE e IRREVERSIBLE.\n\n' +
      'Se eliminará:\n' +
      '• Tu perfil completo\n' +
      '• Todas tus postulaciones\n' +
      '• Si eres administrador, tu organización y todas sus oportunidades\n\n' +
      '¿Estás SEGURO de que deseas eliminar tu cuenta?'
    );
    
    if (!confirmacion1) return;
    
    const confirmacion2 = confirm(
      'Última confirmación:\n\n' +
      'Escribe "ELIMINAR" para confirmar (esta acción no se puede deshacer).\n\n' +
      '¿Deseas continuar?'
    );
    
    if (!confirmacion2) return;
    
    const textoConfirmacion = prompt(
      'Para confirmar, escribe exactamente: ELIMINAR\n\n' +
      '(Si escribes algo diferente, se cancelará la operación)'
    );
    
    if (textoConfirmacion !== 'ELIMINAR') {
      alert('Operación cancelada. El texto no coincide.');
      return;
    }
    
    // Obtener el ID del usuario
    // Solo permitir eliminar cuenta si es el propio perfil
  const userId = getUserIdToDisplay();
  const loggedUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  
  if (!userId || !loggedUserId || parseInt(userId) !== parseInt(loggedUserId)) {
    alert('Solo puedes eliminar tu propia cuenta');
    return;
  }
    
    try {
      // Mostrar indicador de carga
      deleteAccountBtn.disabled = true;
      const originalText = deleteAccountBtn.innerHTML;
      deleteAccountBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Eliminando cuenta...';
      
      const response = await fetch(`https://injuv.onrender.com/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confirmar: true
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Limpiar todos los datos del localStorage y sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        
        // Mostrar mensaje de confirmación
        alert('Tu cuenta ha sido eliminada exitosamente. Serás redirigido a la página principal.');
        
        // Redirigir a la página principal
        if (typeof window.redirectTo === 'function') {
          window.redirectTo('../../index.html');
        } else {
          window.location.href = '../../index.html';
        }
      } else {
        alert('Error al eliminar la cuenta: ' + (data.error || 'Error desconocido'));
        deleteAccountBtn.disabled = false;
        deleteAccountBtn.innerHTML = originalText;
      }
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      alert('Error de conexión con el servidor. Por favor, intenta nuevamente.');
      deleteAccountBtn.disabled = false;
      deleteAccountBtn.innerHTML = '<i class="fas fa-trash-alt mr-2"></i> Eliminar mi cuenta';
    }
  }
  
  // Usar event delegation para asegurar que funcione incluso si el botón se carga después
  document.addEventListener('click', async (e) => {
    const deleteAccountBtn = e.target.closest('#deleteAccountBtn');
    if (!deleteAccountBtn) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    await eliminarCuenta(deleteAccountBtn);
  });
  
  // También agregar listener directo cuando el botón esté disponible
  const deleteAccountBtn = $('#deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await eliminarCuenta(deleteAccountBtn);
    });
  }
})();

// ==========================================================
// ========== Integración con Backend ======================
// ==========================================================

// Cargar datos del usuario desde el backend
async function loadUserDataFromBackend() {
  const userId = getUserIdToDisplay();
  if (!userId) {
    console.log('Usuario no logueado, no se cargan datos del backend');
    return;
  }
  
  // Verificar si estamos viendo el perfil de otro usuario
  const loggedUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  const isViewingOtherProfile = loggedUserId && parseInt(loggedUserId) !== userId;
  
  // Si estamos viendo el perfil de otro usuario, ocultar opciones de edición
  if (isViewingOtherProfile) {
    hideEditOptions();
  } else {
    // Si es el propio perfil, asegurarse de que las opciones estén visibles
    showEditOptions();
  }

  try {
    // Cargar información completa del usuario usando el endpoint que acepta cualquier ID
    const userResponse = await fetch(`${API_BASE_URL}/usuario/${userId}`);
    const userData = await userResponse.json();
    
    if (userData.success && userData.usuario) {
      const usuario = userData.usuario;
      
      // Actualizar nombre en el perfil
      const profileName = $('#profileName');
      if (profileName) {
        if (usuario.nombre && usuario.apellido) {
          profileName.textContent = `${usuario.nombre} ${usuario.apellido}`.trim();
        } else if (usuario.nombre) {
          profileName.textContent = usuario.nombre;
        } else {
          profileName.textContent = '';
        }
      }
      
      // Calcular y mostrar edad desde fecha_nacimiento
      if (usuario.fecha_nacimiento) {
        const fechaNacimiento = new Date(usuario.fecha_nacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
          edad--;
        }
        
        const profileAge = $('#profileAge');
        if (profileAge) {
          profileAge.textContent = `🎂 ${edad} años`;
        }
      }
      
      // Mostrar horas de voluntariado
      const horasVoluntariado = usuario.hora_voluntariado || 0;
      const profileHours = $('#profileHours');
      if (profileHours) {
        if (horasVoluntariado > 0) {
          profileHours.textContent = `⏱ ${horasVoluntariado} horas de voluntariado`;
        } else {
          profileHours.textContent = `⏱ 0 horas de voluntariado`;
        }
      }
      
      // Guardar en localStorage para uso posterior
      if (usuario.nombre) localStorage.setItem('userNombre', usuario.nombre);
      if (usuario.apellido) localStorage.setItem('userApellido', usuario.apellido);

      // Foto de perfil desde el servidor (persiste tras cerrar sesión)
      const avatarCard = $('#avatarCard');
      const avatarContainer = $('#avatarContainer');
      if (avatarCard) {
        if (usuario.foto_perfil) {
          avatarCard.src = `${API_BASE_URL}/usuario/${userId}/foto-perfil?v=${Date.now()}`;
          if (avatarContainer) avatarContainer.classList.remove('avatar-default');
        } else if (!isViewingOtherProfile) {
          const b64 = localStorage.getItem('injuv_avatar_b64');
          if (b64) {
            avatarCard.src = b64;
            if (avatarContainer) avatarContainer.classList.remove('avatar-default');
          } else {
            avatarCard.src = 'avatar-default.png';
            if (avatarContainer) avatarContainer.classList.add('avatar-default');
          }
        } else {
          avatarCard.src = 'avatar-default.png';
          if (avatarContainer) avatarContainer.classList.add('avatar-default');
        }
      }
    }

    // Cargar información de contacto
    const contactResponse = await fetch(`${API_BASE_URL}/usuario/${userId}/contacto`);
    const contactData = await contactResponse.json();
    
    if (contactData.success && contactData.contacto) {
      const contacto = contactData.contacto;
      
      // Actualizar información de contacto en el perfil
      const contactEmail = $('#contactEmail');
      const contactPhone = $('#contactPhone');
      const contactLocation = $('#contactLocation');
      
      if (contactEmail) {
        contactEmail.textContent = contacto.email || '';
        if (contacto.email) {
          localStorage.setItem('contactEmail', contacto.email);
        }
      }
      
      if (contactPhone) {
        const sanitizedPhone = sanitizePhone(contacto.telefono || '');
        contactPhone.textContent = sanitizedPhone;
        const phoneP = contactPhone.closest('p');
        if (phoneP) {
          phoneP.style.display = sanitizedPhone ? 'block' : 'none';
        }
        if (sanitizedPhone) {
          localStorage.setItem('contactPhone', sanitizedPhone);
        } else {
          localStorage.removeItem('contactPhone');
        }
      }
      
      if (contactLocation) {
        const locationParts = [contacto.comuna, contacto.ciudad, contacto.region].filter(Boolean);
        const locationText = locationParts.length > 0 ? locationParts.join(', ') : '';
        contactLocation.textContent = locationText;
        if (locationText) {
          localStorage.setItem('contactLocation', locationText);
        } else {
          // Si no hay ubicación, ocultar el elemento
          const locationP = contactLocation.closest('p');
          if (locationP) locationP.style.display = 'none';
        }
      }
    }

    // Cargar postulaciones del usuario
    await loadUserPostulations(userId);
    
    // Actualizar estadísticas
    updateStatistics(userId);
    
  } catch (error) {
    console.error('Error al cargar datos del usuario desde el backend:', error);
  }
}

// Función para actualizar estadísticas
async function updateStatistics(userId) {
  try {
    // Cargar postulaciones para calcular estadísticas
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/postulaciones`, { mode: 'cors' });
    const data = await response.json();
    
    let totalHours = 0;
    let totalProjects = 0;
    let totalCertificates = 0;
    
    if (data.success && data.postulaciones) {
      totalProjects = data.postulaciones.length;
      
      // Sumar las horas de todas las postulaciones (cada postulación tiene sus propias horas)
      totalHours = data.postulaciones.reduce((suma, post) => {
        const horas = post.horas_voluntariado || 0;
        return suma + (typeof horas === 'number' ? horas : parseInt(horas) || 0);
      }, 0);
      
      // Contar certificados disponibles
      totalCertificates = data.postulaciones.filter(post => 
        post.tiene_certificado && post.ruta_certificado_pdf
      ).length;
    }
    
    // Si no hay postulaciones, intentar obtener horas del usuario directamente (fallback)
    if (totalHours === 0) {
      const userResponse = await fetch(`${API_BASE_URL}/usuario/${userId}`, { mode: 'cors' });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success && userData.usuario) {
          totalHours = userData.usuario.hora_voluntariado || 0;
        }
      }
    }
    
    // Actualizar estadísticas en el DOM
    const statsHours = $('#statsHours');
    const statsProjects = $('#statsProjects');
    const statsCertificates = $('#statsCertificates');
    
    if (statsHours) statsHours.textContent = totalHours;
    if (statsProjects) statsProjects.textContent = totalProjects;
    if (statsCertificates) statsCertificates.textContent = totalCertificates;
    
    // Actualizar horas en el header del perfil
    const profileHours = $('#profileHours');
    if (profileHours) {
      if (totalHours > 0) {
        profileHours.textContent = `⏱ ${totalHours} horas de voluntariado`;
      } else {
        profileHours.textContent = `⏱ 0 horas de voluntariado`;
      }
    }
    
  } catch (error) {
    console.error('Error al actualizar estadísticas:', error);
  }
}

// Cargar postulaciones del usuario y mostrarlas como experiencias
async function loadUserPostulations(userId) {
  try {
    // Asegurar que userId sea un número
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      console.error('❌ userId no es un número válido:', userId);
      return;
    }
    
    console.log('🔍 Cargando postulaciones para usuario:', userIdNum, '(tipo:', typeof userIdNum, ')');
    const url = `${API_BASE_URL}/usuarios/${userIdNum}/postulaciones`;
    console.log('📍 URL:', url);
    
    const response = await fetch(url, {
      mode: 'cors'
    });
    
    console.log('📡 Respuesta recibida:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error en respuesta:', response.status, response.statusText);
      console.error('📄 Contenido del error:', errorText);
      
      // Intentar parsear como JSON si es posible
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error('📋 Datos del error:', errorData);
      } catch (e) {
        console.error('⚠️ No se pudo parsear el error como JSON');
      }
      
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Datos recibidos:', data);
    
    if (data.success && Array.isArray(data.postulaciones)) {
      console.log('📊 Total de postulaciones recibidas:', data.postulaciones.length);
      if (data.postulaciones.length > 0) {
        console.log('📝 Primera postulación completa:', JSON.stringify(data.postulaciones[0], null, 2));
        console.log('📝 Todas las postulaciones:', data.postulaciones.map(p => ({
          id: p.id,
          oportunidad_titulo: p.oportunidad_titulo,
          estado: p.estado,
          organizacion_nombre: p.organizacion_nombre
        })));
      } else {
        console.warn('⚠️ No se recibieron postulaciones en el array');
      }
      displayPostulationsAsExperiences(data.postulaciones);
      // Cargar reseñas públicas de las organizaciones
      cargarResenasPublicas(data.postulaciones);
    } else if (data.success && !data.postulaciones) {
      console.warn('⚠️ Respuesta exitosa pero sin postulaciones:', data);
      const experiencesList = $('#experiencesList');
      if (experiencesList) {
        experiencesList.innerHTML = '<p class="text-gray-600 text-center py-4">No tienes experiencias de voluntariado registradas aún.</p>';
      }
    } else {
      console.error('❌ Error en respuesta:', data.error || 'Error desconocido');
      console.error('📋 Datos completos:', data);
      const experiencesList = $('#experiencesList');
      if (experiencesList) {
        experiencesList.innerHTML = `<p class="text-gray-600 text-center py-4">Error al cargar las experiencias: ${data.error || 'Error desconocido'}. Por favor, recarga la página.</p>`;
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar postulaciones:', error);
    console.error('🔍 Stack trace:', error.stack);
    const experiencesList = $('#experiencesList');
    if (experiencesList) {
      experiencesList.innerHTML = `<p class="text-red-600 text-center py-4">Error de conexión al cargar las experiencias: ${error.message}. Verifica tu conexión a internet y que el servidor esté funcionando.</p>`;
    }
  }
}

// Estrellas 0–5 con medias (Font Awesome; evita emojis + overflow que rompen el layout)
function generarEstrellas(calificacion) {
  if (calificacion === undefined || calificacion === null || calificacion === '') return '';
  const cal = Math.max(0, Math.min(5, Number(calificacion)));
  if (Number.isNaN(cal)) return '';
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

// Función para cargar reseñas públicas de las organizaciones
function cargarResenasPublicas(postulaciones) {
  console.log('Cargando reseñas públicas de', postulaciones.length, 'postulaciones');
  const reviewsPagination = $('#nextReviewsBtn')?.parentElement;
  
  // Filtrar solo las postulaciones con reseñas públicas
  // IMPORTANTE: Mostrar solo reseñas marcadas como públicas (resena_org_publica === true)
  const reseñasPublicas = postulaciones.filter(post => {
    const tieneResena = post.resena_org_sobre_voluntario && post.resena_org_sobre_voluntario.trim() !== '';
    const esPublica = post.resena_org_publica === true || post.resena_org_publica === 'true' || post.resena_org_publica === 1;
    console.log('Postulación', post.id, '- Tiene reseña:', tieneResena, '- Es pública:', esPublica, '- Reseña:', post.resena_org_sobre_voluntario?.substring(0, 50));
    return tieneResena && esPublica;
  });
  
  console.log('Reseñas públicas encontradas:', reseñasPublicas.length);
  
  if (reseñasPublicas.length === 0) {
    const reviewsContainer = $('#reviewsContainer');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = '<p class="text-gray-600 text-center py-4">Aún no tienes reseñas públicas de organizaciones.</p>';
    }
    if (reviewsPagination) reviewsPagination.style.display = 'none';
    return;
  }
  
  // Mostrar las reseñas en el contenedor
  mostrarResenasEnPerfil(reseñasPublicas);
}

// Función para mostrar las reseñas en el perfil
function mostrarResenasEnPerfil(reseñas) {
  const reviewsContainer = $('#reviewsContainer');
  const reviewsPagination = $('#nextReviewsBtn')?.parentElement;
  if (!reviewsContainer) {
    console.warn('No se encontró el contenedor de reseñas');
    return;
  }
  
  if (reseñas.length === 0) {
    reviewsContainer.innerHTML = '<p class="text-gray-600 text-center py-4">Aún no tienes reseñas públicas de organizaciones.</p>';
    if (reviewsPagination) reviewsPagination.style.display = 'none';
    return;
  }
  if (reviewsPagination) reviewsPagination.style.display = 'flex';
  
  console.log('Mostrando', reseñas.length, 'reseñas en el perfil');
  reviewsContainer.innerHTML = '';
  
  // Ordenar reseñas por fecha (más recientes primero)
  const reseñasOrdenadas = [...reseñas].sort((a, b) => {
    const fechaA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const fechaB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return fechaB - fechaA;
  });
  
  reseñasOrdenadas.forEach((reseña, index) => {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'border border-gray-200 rounded-lg p-4 mb-4 bg-white hover:shadow-md transition-shadow';
    
    const fecha = reseña.created_at ? new Date(reseña.created_at).toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    }) : 'Fecha no disponible';
    
    // Agregar calificación si existe
    let calificacionHtml = '';
    if (reseña.calificacion_org !== null && reseña.calificacion_org !== undefined && !isNaN(reseña.calificacion_org)) {
      const calificacion = parseFloat(reseña.calificacion_org);
      const estrellasHtml = generarEstrellas(calificacion);
      calificacionHtml = `
        <div class="flex items-center gap-2 mb-3 flex-nowrap">
          <span class="inline-flex items-center gap-0.5 text-lg leading-none">${estrellasHtml}</span>
          <span class="text-sm text-gray-600 font-medium whitespace-nowrap tabular-nums">${calificacion.toFixed(1)}/5.0</span>
        </div>
      `;
    }
    
    reviewCard.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900 text-lg">${reseña.oportunidad_titulo || 'Voluntariado'}</h4>
          <p class="text-blue-600 font-medium text-sm mt-1">${reseña.organizacion_nombre || 'Organización'}</p>
          <p class="text-xs text-gray-500 mt-1">${fecha}</p>
        </div>
      </div>
      ${calificacionHtml}
      <div class="mt-3 pt-3 border-t border-gray-200">
        <p class="text-gray-700 leading-relaxed italic">"${reseña.resena_org_sobre_voluntario || 'Sin comentario'}"</p>
      </div>
    `;
    
    reviewsContainer.appendChild(reviewCard);
  });
  
  // Actualizar paginación si es necesario
  const currentPageSpan = $('#currentReviewsPage');
  const totalPagesSpan = $('#totalReviewsPages');
  if (currentPageSpan) currentPageSpan.textContent = '1';
  if (totalPagesSpan) totalPagesSpan.textContent = '1';
  
  // Deshabilitar botones de paginación si solo hay una página
  const prevBtn = $('#prevReviewsBtn');
  const nextBtn = $('#nextReviewsBtn');
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = reseñas.length <= 1;
}

// Función para descargar certificado
window.descargarCertificado = async function(postulacionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/certificado/descargar`);
    
    if (!response.ok) {
      const errorData = await response.json();
      alert('Error: ' + (errorData.error || 'No se pudo descargar el certificado'));
      return;
    }
    
    // Obtener el nombre del archivo del header o usar uno por defecto
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'certificado_voluntariado.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Crear un blob y descargarlo
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
  } catch (error) {
    console.error('Error al descargar certificado:', error);
    alert('Error de conexión al descargar el certificado');
  }
};

// Mostrar postulaciones como experiencias de voluntariado
function displayPostulationsAsExperiences(postulaciones) {
  console.log('🎯 displayPostulationsAsExperiences llamado con', postulaciones.length, 'postulaciones');
  const experiencesList = $('#experiencesList');
  
  if (!experiencesList) {
    console.error('❌ No se encontró el elemento experiencesList');
    return;
  }
  
  // Limpiar contenido existente
  experiencesList.innerHTML = '';
  
  if (!postulaciones || postulaciones.length === 0) {
    console.warn('⚠️ No hay postulaciones para mostrar');
    experiencesList.innerHTML = `
      <p class="text-gray-600 text-center py-4">No tienes experiencias de voluntariado registradas aún.</p>
    `;
    return;
  }
  
  console.log('✅ Procesando', postulaciones.length, 'postulaciones para mostrar');
  
  // Crear artículos para cada postulación
  postulaciones.forEach(post => {
    const estado = (post.estado || 'Pendiente de revisión').toLowerCase();
    
    // Mapear estados del backend a texto y colores para el frontend
    let estadoClass, estadoText;
    switch(estado) {
      case 'seleccionado':
        estadoClass = 'bg-green-100 text-green-800';
        estadoText = 'Seleccionado';
        break;
      case 'pre-seleccionado':
      case 'preseleccionado':
        estadoClass = 'bg-blue-100 text-blue-800';
        estadoText = 'Pre-seleccionado';
        break;
      case 'etapa de entrevista':
      case 'entrevista':
        estadoClass = 'bg-purple-100 text-purple-800';
        estadoText = 'Etapa de entrevista';
        break;
      case 'en lista de espera':
      case 'lista de espera':
        estadoClass = 'bg-orange-100 text-orange-800';
        estadoText = 'En lista de espera';
        break;
      case 'no seleccionado':
      case 'no_seleccionado':
        estadoClass = 'bg-red-100 text-red-800';
        estadoText = 'No seleccionado';
        break;
      case 'pendiente de revisión':
      case 'pendiente':
      default:
        estadoClass = 'bg-yellow-100 text-yellow-800';
        estadoText = 'Pendiente de revisión';
        break;
    }
    
    const fecha = post.created_at ? new Date(post.created_at).toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long' 
    }) : 'Fecha no disponible';
    
    // Obtener organizacion_id desde la postulación (viene del backend)
    const organizacionId = post.organizacion_id || null;
    // Usar data attribute y event listener en lugar de onclick para evitar problemas
    const verPerfilBtn = organizacionId 
      ? `<button data-org-id="${organizacionId}" class="ver-perfil-org-btn px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
          Ver perfil de organización
        </button>`
      : '';
    
    // Botón para descargar certificado (solo si el voluntariado está cerrado y tiene certificado)
    const descargarCertificadoBtn = (post.oportunidad_cerrada && post.tiene_certificado && post.ruta_certificado_pdf)
      ? `<button onclick="descargarCertificado(${post.id})" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Descargar certificado
        </button>`
      : '';
    
    // Mostrar valoración de la organización si existe (solo si es pública)
    let valoracionHtml = '';
    const esResenaPublica = post.resena_org_publica === true || post.resena_org_publica === 'true' || post.resena_org_publica === 1;
    const tieneResena = post.resena_org_sobre_voluntario && post.resena_org_sobre_voluntario.trim() !== '';
    
    // Solo mostrar si la reseña es pública
    if (esResenaPublica && tieneResena) {
      if (post.calificacion_org !== null && post.calificacion_org !== undefined && !isNaN(post.calificacion_org)) {
        const calificacion = parseFloat(post.calificacion_org);
        const estrellasHtml = generarEstrellas(calificacion);
        valoracionHtml = `
          <div class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="text-sm font-semibold text-blue-900">Valoración de la organización:</span>
              <span class="inline-flex items-center gap-0.5 text-lg leading-none">${estrellasHtml}</span>
              <span class="text-sm text-blue-700 font-medium whitespace-nowrap">${calificacion.toFixed(1)}/5.0</span>
            </div>
            <p class="text-sm text-gray-700 italic mt-2">"${post.resena_org_sobre_voluntario}"</p>
          </div>
        `;
      } else {
        // Si no hay calificación pero hay reseña pública, mostrarla
        valoracionHtml = `
          <div class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-semibold text-blue-900">Comentario de la organización:</span>
            </div>
            <p class="text-sm text-gray-700 italic">"${post.resena_org_sobre_voluntario}"</p>
          </div>
        `;
      }
    }
    
    // Mostrar motivo de no selección si existe
    let motivoHtml = '';
    if (estado === 'no seleccionado' || estado === 'no_seleccionado') {
      if (post.motivo_no_seleccion) {
        const motivos = {
          'no_cumple_perfil': 'No cumple con el perfil requerido',
          'no_aplico_tiempo': 'No aplicó a tiempo o en el formato correcto',
          'no_cumple_requisitos': 'No cumple con los requisitos mínimos',
          'falta_experiencia': 'Falta de experiencia suficiente',
          'otro': post.motivo_no_seleccion_otro || 'Otro motivo'
        };
        const motivoTexto = motivos[post.motivo_no_seleccion] || post.motivo_no_seleccion;
        motivoHtml = `
          <div class="mt-2 p-2 bg-red-50 rounded border border-red-200">
            <p class="text-xs text-red-700"><strong>Motivo:</strong> ${motivoTexto}</p>
          </div>
        `;
      }
    }
    
    const article = document.createElement('article');
    article.className = 'border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition cursor-pointer bg-white';
    article.setAttribute('data-postulacion-id', post.id);
    article.setAttribute('data-oportunidad-titulo', post.oportunidad_titulo || 'Oportunidad de voluntariado');
    article.setAttribute('data-organizacion-nombre', post.organizacion_nombre || 'Organización');
    article.setAttribute('data-fecha', fecha);
    article.setAttribute('data-estado', post.estado || 'Pendiente');
    article.addEventListener('click', function(e) {
      // Evitar que se abra el modal si se hace clic en los botones
      if (e.target.closest('button')) {
        return;
      }
      abrirModalDetallesVoluntariado(post);
    });
    article.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-900 mb-1">${post.oportunidad_titulo || 'Oportunidad de voluntariado'}</h4>
            <span class="text-xs text-gray-500">👆 Click para ver detalles</span>
          </div>
          <p class="text-blue-600 font-medium mb-1">${post.organizacion_nombre || 'Organización'}</p>
          <p class="text-sm text-gray-600 mb-3">${fecha}</p>
          <div class="flex items-center gap-4 mb-3">
            <span class="text-xs px-2 py-1 rounded-full ${estadoClass}">${estadoText}</span>
            ${post.oportunidad_cerrada ? '<span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">Voluntariado terminado</span>' : ''}
            ${post.tiene_certificado ? '<span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Certificado disponible</span>' : ''}
            ${post.horas_voluntariado ? `<span class="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">⏱ ${post.horas_voluntariado} horas</span>` : ''}
          </div>
          ${motivoHtml}
          ${valoracionHtml}
          <div class="flex flex-wrap gap-2 mt-3">
            ${verPerfilBtn || ''}
            ${descargarCertificadoBtn || ''}
          </div>
        </div>
      </div>
    `;
    
    // Agregar event listener al botón de ver perfil después de insertar el HTML
    if (organizacionId) {
      const verPerfilButton = article.querySelector('.ver-perfil-org-btn');
      if (verPerfilButton) {
        verPerfilButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.verPerfilOrganizacion(organizacionId);
        });
      }
    }
    
    experiencesList.appendChild(article);
  });
}

// Función para ver el perfil de una organización
window.verPerfilOrganizacion = function(organizacionId) {
  if (!organizacionId) {
    alert('No se pudo obtener la información de la organización');
    return;
  }
  
  // Convertir a número para asegurar que sea válido
  const orgId = parseInt(organizacionId);
  if (isNaN(orgId)) {
    alert('ID de organización inválido');
    return;
  }
  
  // Construir la ruta de manera absoluta y directa
  // Siempre usar la ruta completa desde la raíz para evitar problemas
  const baseUrl = window.location.origin;
  
  // Construir la URL de manera explícita y segura
  const profileUrl = baseUrl + '/template/Roles/Perfil_organizacion/index.html?organizacion_id=' + orgId;
  
  console.log('=== Redirección a Perfil de Organización ===');
  console.log('Ruta actual:', window.location.pathname);
  console.log('Base URL:', baseUrl);
  console.log('Organización ID:', orgId);
  console.log('URL final:', profileUrl);
  console.log('==========================================');
  
  // Redirigir directamente usando href
  try {
    window.location.href = profileUrl;
  } catch (error) {
    console.error('Error al redirigir:', error);
    alert('Error al redirigir. Por favor, intenta nuevamente.');
  }
};

// Función para abrir el modal con detalles del voluntariado
window.abrirModalDetallesVoluntariado = function(post) {
  const modal = $('#modalDetallesVoluntariado');
  if (!modal) return;
  
  // Mostrar información básica
  const modalTitulo = $('#modalTitulo');
  const modalOrganizacion = $('#modalOrganizacion');
  const modalFecha = $('#modalFecha');
  const modalHoras = $('#modalHoras');
  const modalResena = $('#modalResena');
  const modalCertificado = $('#modalCertificado');
  
  if (modalTitulo) modalTitulo.textContent = post.oportunidad_titulo || 'Oportunidad de voluntariado';
  if (modalOrganizacion) modalOrganizacion.textContent = post.organizacion_nombre || 'Organización';
  
  // Fecha
  if (modalFecha && post.created_at) {
    const fecha = new Date(post.created_at);
    modalFecha.textContent = fecha.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  } else if (modalFecha) {
    modalFecha.textContent = 'Fecha no disponible';
  }
  
  // Horas de voluntariado - mostrar las horas específicas de esta postulación y las totales
  if (modalHoras) {
    const horasPostulacion = post.horas_voluntariado || 0;
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    // Mostrar primero las horas de esta postulación
    let horasHtml = `
      <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl font-bold text-blue-700">${horasPostulacion}</span>
          <span class="text-gray-700 font-medium">horas en este voluntariado</span>
        </div>
        <p class="text-sm text-gray-600">Horas completadas específicamente en esta oportunidad.</p>
      </div>
    `;
    
    // Intentar obtener las horas totales del usuario
    if (userId) {
      fetch(`${API_BASE_URL}/usuario/${userId}`, { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
          if (data.success && data.usuario) {
            const horasTotales = data.usuario.hora_voluntariado || 0;
            horasHtml += `
              <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl font-bold text-purple-700">${horasTotales}</span>
                  <span class="text-gray-700 font-medium">horas totales acumuladas</span>
                </div>
                <p class="text-sm text-gray-600">Suma de todas tus horas de voluntariado en todas las oportunidades.</p>
              </div>
            `;
          }
          modalHoras.innerHTML = horasHtml;
        })
        .catch(error => {
          console.error('Error al cargar horas totales:', error);
          modalHoras.innerHTML = horasHtml + '<p class="text-sm text-gray-500 mt-2">No se pudieron cargar las horas totales.</p>';
        });
    } else {
      modalHoras.innerHTML = horasHtml;
    }
  }
  
  // Reseña de la organización
  if (modalResena) {
    const esResenaPublica = post.resena_org_publica === true || post.resena_org_publica === 'true' || post.resena_org_publica === 1;
    const tieneResena = post.resena_org_sobre_voluntario && post.resena_org_sobre_voluntario.trim() !== '';
    
    if (esResenaPublica && tieneResena) {
      let resenaHtml = '';
      
      // Calificación si existe
      if (post.calificacion_org !== null && post.calificacion_org !== undefined && !isNaN(post.calificacion_org)) {
        const calificacion = parseFloat(post.calificacion_org);
        const estrellasHtml = generarEstrellas(calificacion);
        resenaHtml += `
          <div class="mb-3 p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center gap-2 mb-2 flex-nowrap">
              <span class="inline-flex items-center gap-0.5 text-lg leading-none">${estrellasHtml}</span>
              <span class="text-sm text-gray-700 font-medium whitespace-nowrap">${calificacion.toFixed(1)}/5.0</span>
            </div>
            <p class="text-gray-800 italic leading-relaxed">"${post.resena_org_sobre_voluntario}"</p>
          </div>
        `;
      } else {
        resenaHtml += `
          <div class="mb-3 p-3 bg-blue-50 rounded-lg">
            <p class="text-gray-800 italic leading-relaxed">"${post.resena_org_sobre_voluntario}"</p>
          </div>
        `;
      }
      
      modalResena.innerHTML = resenaHtml;
    } else {
      modalResena.innerHTML = '<p class="text-gray-600 italic">La organización aún no ha dejado una reseña pública.</p>';
    }
  }
  
  // Mi reseña sobre la organización
  const modalMiResena = $('#modalMiResena');
  if (modalMiResena) {
    // Usar reseña_org (nuevo), reseña_organizacion o resena_usuario_sobre_org (retrocompatibilidad)
    const resenaTexto = post.reseña_org || post.reseña_organizacion || post.resena_usuario_sobre_org || '';
    const tieneResenaUsuario = resenaTexto && resenaTexto.trim() !== '';
    const tieneCalificacionUsuario = post.calificacion_usuario_org !== null && post.calificacion_usuario_org !== undefined && !isNaN(post.calificacion_usuario_org);
    
    if (tieneResenaUsuario || tieneCalificacionUsuario) {
      // Ya hay reseña, mostrarla con opción de editar y cambiar visibilidad
      console.log('📋 Datos de la postulación:', post);
      console.log('🔍 resena_usuario_publica:', post.resena_usuario_publica, 'tipo:', typeof post.resena_usuario_publica);
      
      // Determinar si es pública: por defecto es true si no está definido o es null
      let esPublica = true; // Por defecto es pública
      if (post.resena_usuario_publica !== undefined && post.resena_usuario_publica !== null) {
        // Si el campo existe y no es null/undefined, usar su valor
        esPublica = post.resena_usuario_publica === true || post.resena_usuario_publica === 1 || post.resena_usuario_publica === 'true';
      }
      
      console.log('🌐 Es pública (calculado):', esPublica);
      let resenaHtml = '';
      if (tieneCalificacionUsuario) {
        const calificacion = parseFloat(post.calificacion_usuario_org);
        const estrellasHtml = generarEstrellas(calificacion);
        resenaHtml += `
          <div class="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2 flex-nowrap min-w-0">
                <span class="inline-flex items-center gap-0.5 text-lg leading-none">${estrellasHtml}</span>
                <span class="text-sm text-gray-700 font-medium whitespace-nowrap">${calificacion.toFixed(1)}/5.0</span>
              </div>
              <span class="text-xs px-2 py-1 rounded-full ${esPublica ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                ${esPublica ? '🌐 Pública' : '🔒 Privada'}
              </span>
            </div>
            ${tieneResenaUsuario ? `<p class="text-gray-800 italic leading-relaxed">"${resenaTexto}"</p>` : ''}
          </div>
          <div class="flex gap-2">
            <button onclick="editarResenaUsuario(${post.id})" 
                    class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
              ✏️ Editar reseña
            </button>
          </div>
        `;
      } else if (tieneResenaUsuario) {
        resenaHtml += `
          <div class="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs px-2 py-1 rounded-full ${esPublica ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                ${esPublica ? '🌐 Pública' : '🔒 Privada'}
              </span>
            </div>
            <p class="text-gray-800 italic leading-relaxed">"${resenaTexto}"</p>
          </div>
          <div class="flex gap-2">
            <button onclick="editarResenaUsuario(${post.id})" 
                    class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
              ✏️ Editar reseña
            </button>
          </div>
        `;
      }
      modalMiResena.innerHTML = resenaHtml;
    } else {
      // No hay reseña, mostrar formulario para dejar una
      // Solo permitir dejar reseña si el voluntariado está cerrado o si fue seleccionado
      const puedeDejarResena = post.oportunidad_cerrada || post.estado === 'Seleccionado' || post.estado === 'seleccionado';
      
      if (puedeDejarResena) {
        modalMiResena.innerHTML = `
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-700 mb-4">Deja tu opinión sobre esta organización y tu experiencia en este voluntariado.</p>
            <form id="formResenaUsuario" onsubmit="guardarResenaUsuario(event, ${post.id})">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Calificación *</label>
                <div class="flex items-center gap-2 mb-2">
                  <input type="range" id="calificacionUsuario" min="0" max="5" step="0.5" value="5" 
                         class="flex-1" oninput="actualizarEstrellasUsuario(this.value)">
                  <span id="valorCalificacionUsuario" class="text-lg font-semibold text-blue-700 w-12">5.0</span>
                </div>
                <div id="estrellasUsuarioPreview" class="text-2xl text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <div class="mb-4">
                <label for="resenaUsuario" class="block text-sm font-medium text-gray-700 mb-2">Tu reseña *</label>
                <textarea id="resenaUsuario" rows="4" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Comparte tu experiencia con esta organización..." required></textarea>
              </div>
              <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-sm text-gray-700">
                  <span class="font-medium text-blue-800">ℹ️ Información:</span>
                  <span class="text-gray-600 block mt-1">La visibilidad de tu reseña (pública o privada) será determinada por la organización.</span>
                </p>
              </div>
              <button type="submit" 
                      class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Guardar Reseña
              </button>
            </form>
          </div>
        `;
        // Configurar el event listener para el slider
        setTimeout(() => {
          const slider = document.getElementById('calificacionUsuario');
          if (slider) {
            slider.addEventListener('input', function() {
              actualizarEstrellasUsuario(this.value);
            });
          }
        }, 100);
      } else {
        modalMiResena.innerHTML = '<p class="text-gray-600 italic">Podrás dejar una reseña una vez que el voluntariado haya terminado o hayas sido seleccionado.</p>';
      }
    }
  }
  
  // Certificado
  if (modalCertificado) {
    if (post.tiene_certificado && post.ruta_certificado_pdf) {
      modalCertificado.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <p class="text-gray-700 mb-2">Tu certificado está disponible para descargar.</p>
            <button onclick="descargarCertificado(${post.id}); event.stopPropagation();" 
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Descargar Certificado
            </button>
          </div>
        </div>
      `;
    } else if (post.oportunidad_cerrada) {
      modalCertificado.innerHTML = '<p class="text-gray-600">El voluntariado ha terminado, pero aún no hay certificado disponible.</p>';
    } else {
      modalCertificado.innerHTML = '<p class="text-gray-600">El certificado estará disponible una vez que el voluntariado haya terminado y la organización lo haya generado.</p>';
    }
  }
  
  // Mostrar el modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

// Función para actualizar la vista previa de estrellas en el formulario de reseña
window.actualizarEstrellasUsuario = function(valor) {
  const calificacion = parseFloat(valor);
  const valorSpan = document.getElementById('valorCalificacionUsuario');
  const estrellasPreview = document.getElementById('estrellasUsuarioPreview');
  
  if (valorSpan) {
    valorSpan.textContent = calificacion.toFixed(1);
  }
  
  if (estrellasPreview) {
    const estrellasHtml = generarEstrellas(calificacion);
    estrellasPreview.innerHTML = estrellasHtml;
  }
};

// Función para editar la reseña del usuario

window.editarResenaUsuario = function(postulacionId) {
  // Obtener los datos actuales de la postulación
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  if (!userId) return;
  
  fetch(`${API_BASE_URL}/usuarios/${userId}/postulaciones`, { mode: 'cors' })
    .then(response => response.json())
    .then(data => {
      if (data.success && data.postulaciones) {
        const post = data.postulaciones.find(p => p.id === postulacionId);
        if (post) {
          // Mostrar formulario con valores actuales
          const modalMiResena = $('#modalMiResena');
          if (modalMiResena) {
            const resenaTexto = post.reseña_org || post.reseña_organizacion || post.resena_usuario_sobre_org || '';
            const calificacion = post.calificacion_usuario_org || 5;
            const esPublica = post.resena_usuario_publica !== false;
            
            modalMiResena.innerHTML = `
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-700 mb-4">Edita tu opinión sobre esta organización y tu experiencia en este voluntariado.</p>
                <form id="formResenaUsuario" onsubmit="guardarResenaUsuario(event, ${post.id})">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Calificación *</label>
                    <div class="flex items-center gap-2 mb-2">
                      <input type="range" id="calificacionUsuario" min="0" max="5" step="0.5" value="${calificacion}" 
                             class="flex-1" oninput="actualizarEstrellasUsuario(this.value)">
                      <span id="valorCalificacionUsuario" class="text-lg font-semibold text-blue-700 w-12">${calificacion.toFixed(1)}</span>
                    </div>
                    <div id="estrellasUsuarioPreview" class="text-2xl inline-flex items-center gap-0.5 flex-nowrap">${generarEstrellas(calificacion)}</div>
                  </div>
                  <div class="mb-4">
                    <label for="resenaUsuario" class="block text-sm font-medium text-gray-700 mb-2">Tu reseña *</label>
                    <textarea id="resenaUsuario" rows="4" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Comparte tu experiencia con esta organización..." required>${resenaTexto}</textarea>
                  </div>
                  <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p class="text-sm text-gray-700">
                      <span class="font-medium text-blue-800">ℹ️ Información:</span>
                      <span class="text-gray-600 block mt-1">La visibilidad de tu reseña (pública o privada) será determinada por la organización.</span>
                      ${esPublica ? '<span class="text-blue-700 block mt-1">Estado actual: 🌐 Pública</span>' : '<span class="text-gray-600 block mt-1">Estado actual: 🔒 Privada</span>'}
                    </p>
                  </div>
                  <button type="submit" 
                          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Guardar Cambios
                  </button>
                </form>
              </div>
            `;
            // Configurar el event listener para el slider
            setTimeout(() => {
              const slider = document.getElementById('calificacionUsuario');
              if (slider) {
                slider.addEventListener('input', function() {
                  actualizarEstrellasUsuario(this.value);
                });
              }
            }, 100);
          }
        }
      }
    })
    .catch(error => {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos de la reseña');
    });
};

// Función para guardar la reseña del usuario sobre la organización
window.guardarResenaUsuario = async function(event, postulacionId) {
  event.preventDefault();
  
  const resena = document.getElementById('resenaUsuario').value.trim();
  const calificacion = document.getElementById('calificacionUsuario').value;
  // La visibilidad la decide la organización, no el usuario
  
  if (!resena) {
    alert('Por favor, completa la reseña.');
    return;
  }
  
  if (!calificacion) {
    alert('Por favor, selecciona una calificación.');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/postulaciones/${postulacionId}/resena-usuario`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resena: resena,
        calificacion: parseFloat(calificacion)
        // La visibilidad (es_publica) será determinada por la organización
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('¡Reseña guardada exitosamente!');
      // Recargar los datos de la postulación para actualizar el modal
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (userId) {
        loadUserPostulations(parseInt(userId));
        // Cerrar el modal y volver a abrirlo con los datos actualizados
        cerrarModalDetallesVoluntariado();
        // Esperar un momento y buscar la postulación actualizada
        setTimeout(() => {
          fetch(`${API_BASE_URL}/usuarios/${userId}/postulaciones`, { mode: 'cors' })
            .then(response => response.json())
            .then(data => {
              if (data.success && data.postulaciones) {
                const postActualizada = data.postulaciones.find(p => p.id === postulacionId);
                if (postActualizada) {
                  abrirModalDetallesVoluntariado(postActualizada);
                }
              }
            })
            .catch(error => console.error('Error al recargar:', error));
        }, 500);
      }
    } else {
      alert('Error: ' + (data.error || 'No se pudo guardar la reseña'));
    }
  } catch (error) {
    console.error('Error al guardar reseña:', error);
    alert('Error de conexión al guardar la reseña');
  }
};

// Función para cerrar el modal de detalles
function cerrarModalDetallesVoluntariado() {
  const modal = $('#modalDetallesVoluntariado');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Configurar event listeners para cerrar el modal cuando se carga la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupModalDetallesListeners);
} else {
  setupModalDetallesListeners();
}

function setupModalDetallesListeners() {
  const cerrarBtn = $('#cerrarModalDetalles');
  const cerrarBtnFooter = $('#cerrarModalDetallesBtn');
  const modal = $('#modalDetallesVoluntariado');
  
  if (cerrarBtn) {
    cerrarBtn.addEventListener('click', cerrarModalDetallesVoluntariado);
  }
  
  if (cerrarBtnFooter) {
    cerrarBtnFooter.addEventListener('click', cerrarModalDetallesVoluntariado);
  }
  
  // Cerrar al hacer clic fuera del modal
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        cerrarModalDetallesVoluntariado();
      }
    });
  }
}

// Actualizar información de contacto en el backend
async function updateContactInfoInBackend(email, telefono, region, comuna, ciudad) {
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  if (!userId) {
    console.error('Usuario no logueado');
    return false;
  }

  try {
    const sanitizedPhone = sanitizePhone(telefono || '');
    const response = await fetch(`${API_BASE_URL}/usuario/contacto`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: parseInt(userId),  // El backend espera 'user_id', no 'usuario_id'
        email: email || null,
        telefono: sanitizedPhone || null,  // Asegurar que se envíe el teléfono incluso si está vacío
        region: region || null,
        ciudad: ciudad || null,
        comuna: comuna || null
      })
    });

    const data = await response.json();
    if (data.success) {
      console.log('Información de contacto actualizada correctamente:', data.contacto);
    } else {
      console.error('Error al actualizar contacto:', data.error);
    }
    return data.success;
  } catch (error) {
    console.error('Error al actualizar información de contacto:', error);
    return false;
  }
}


// Cargar datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
  console.log('INJUV listo ✅ (recorte, edición, certificados, reseñas, habilidades, menú editar perfil, eliminar cuenta).');
  
  // Cargar datos del backend
  loadUserDataFromBackend();
  
  // Recargar postulaciones cada 30 segundos para mantener actualizados los estados
  // Esto asegura que cuando una organización cambie el estado, el usuario lo vea actualizado
  const userId = getUserIdToDisplay();
  if (userId) {
    setInterval(() => {
      const loggedUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      // Solo recargar si estamos viendo nuestro propio perfil
      if (loggedUserId && parseInt(loggedUserId) === userId) {
        console.log('Actualizando postulaciones automáticamente...');
        loadUserPostulations(userId);
      }
    }, 30000); // 30 segundos
    
    // También recargar cuando la ventana vuelve a tener foco (usuario vuelve a la pestaña)
    window.addEventListener('focus', () => {
      const loggedUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (loggedUserId && parseInt(loggedUserId) === userId) {
        console.log('Ventana enfocada, recargando postulaciones...');
        loadUserPostulations(userId);
      }
    });
  }
});
