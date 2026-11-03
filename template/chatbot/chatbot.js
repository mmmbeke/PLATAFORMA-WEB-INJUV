// Base de datos de preguntas frecuentes
const faqDatabase = {
    // Preguntas sobre registro
    registro: {
        keywords: ['registro', 'registrarse', 'crear cuenta', 'inscribirse', 'darse de alta'],
        responses: [
            'Para registrarte en la plataforma, puedes hacer clic en el botón "Iniciar Sesión" en la parte superior de la página y luego seleccionar "Crear cuenta". Necesitarás proporcionar tu información personal básica.',
            'El registro es completamente gratuito. Solo necesitas tener entre 18 y 29 años y ser chileno o residente en Chile.',
            'Puedes registrarte como usuario individual o como organización. Cada tipo de cuenta tiene diferentes funcionalidades.'
        ]
    },
    // Preguntas sobre cómo empezar
    empezar: {
        keywords: ['empezar', 'comenzar', 'iniciar', 'cómo empezar', 'no sé cómo empezar', 'primeros pasos', 'por dónde empezar'],
        responses: [
            '¡Es muy sencillo! En la plataforma encontrarás diversas oportunidades de voluntariado organizadas por temática, territorio y tipo de institución. Solo necesitas crear tu perfil, explorar las iniciativas disponibles y postularte a la que mejor se ajuste a tus intereses, tiempo y habilidades. Si es tu primera vez, te recomendamos también revisar la sección "Formación", donde podrás adquirir conocimientos básicos antes de participar.',
            'Para empezar, crea tu perfil en la plataforma, explora las oportunidades disponibles filtradas por tema o región, y postúlate a la que más te interese. Además, visita la sección de Formación para prepararte mejor si es tu primera experiencia.'
        ]
    },
    // Preguntas sobre voluntariado
    voluntariado: {
        keywords: ['voluntariado', 'oportunidades', 'proyectos', 'participar', 'ayudar'],
        responses: [
            'INJUV ofrece oportunidades de voluntariado en más de 140 comunas de Chile. Puedes buscar por región, temática o fecha en la sección de búsqueda principal.',
            'Las oportunidades de voluntariado incluyen áreas como educación, medio ambiente, salud, emergencias, cultura, deportes y desarrollo comunitario.',
            'Puedes postularte a múltiples oportunidades de voluntariado. Cada una tiene sus propios requisitos y fechas de inicio.',
            'Sí, recibirás un certificado oficial de INJUV que valida tu experiencia de voluntariado al completar un proyecto.'
        ]
    },
    // Preguntas sobre experiencia previa
    experiencia: {
        keywords: ['experiencia', 'experiencia previa', 'sin experiencia', 'no tengo experiencia', 'primer vez', 'principiante'],
        responses: [
            'Sí, absolutamente. Muchas oportunidades no requieren experiencia y están específicamente diseñadas para personas que recién están comenzando. Lo importante es tu compromiso y ganas de ayudar a la comunidad.',
            'No necesitas experiencia previa para la mayoría de las oportunidades. Las organizaciones valoran tu entusiasmo y dedicación. Si es tu primera vez, te recomendamos revisar la sección de Formación para prepararte mejor.'
        ]
    },
    // Preguntas sobre requisitos
    requisitos: {
        keywords: ['requisitos', 'edad', 'necesito', 'documentos', 'requiere'],
        responses: [
            'Para participar en programas de voluntariado de INJUV, necesitas tener entre 18 y 29 años.',
            'No se requieren documentos especiales para la mayoría de las oportunidades. Algunos proyectos específicos pueden tener requisitos adicionales que se indican en la descripción.',
            'No necesitas experiencia previa para la mayoría de las oportunidades. Lo importante es tu compromiso y ganas de ayudar.'
        ]
    },
    // Preguntas sobre postulación y tiempos de respuesta
    postulacion: {
        keywords: ['postular', 'postulación', 'postulé', 'respuesta', 'cuánto esperar', 'tiempo de espera', 'cuándo responden', 'días hábiles'],
        responses: [
            'Los tiempos pueden variar según cada organización. En general, las instituciones suelen responder entre 5 y 15 días hábiles desde la fecha de postulación. Te recomendamos estar atento a tu correo electrónico y a la mensajería interna de la plataforma. Si alguna oportunidad requiere contacto urgente, la organización te lo informará directamente.',
            'Normalmente recibirás una respuesta entre 5 y 15 días hábiles después de postularte. Mantén tu correo y la plataforma al día para no perder ninguna comunicación de las organizaciones.'
        ]
    },
    // Preguntas sobre formación y aprendizaje
    formacion: {
        keywords: ['formación', 'aprender', 'cursos', 'talleres', 'conocimientos', 'capacitación', 'preparación', 'adquirir conocimientos'],
        responses: [
            'Dentro de la plataforma encontrarás una sección "Formación" con cursos, talleres y material descargable sobre diferentes áreas del voluntariado, incluyendo gestión de riesgos de desastres, acción comunitaria, liderazgo, inclusión, medio ambiente y más.',
            'Puedes adquirir nuevos conocimientos visitando la sección "Formación" de la plataforma, donde encontrarás recursos educativos sobre diversas temáticas relacionadas con el voluntariado: liderazgo, trabajo comunitario, medio ambiente, inclusión y gestión de emergencias, entre otros.'
        ]
    },
    // Preguntas sobre beneficios del voluntariado
    beneficios: {
        keywords: ['beneficios', 'de qué me sirve', 'para qué sirve', 'ventajas', 'qué gano', 'qué obtengo'],
        responses: [
            'Participar en voluntariado te permite contribuir a tu comunidad y, al mismo tiempo, desarrollar habilidades personales y profesionales. A través de estas experiencias puedes fortalecer el trabajo en equipo, liderazgo, organización y empatía, además de conocer nuevas realidades y ampliar tus redes. El voluntariado también es una oportunidad para adquirir formación práctica, descubrir intereses, mejorar tu empleabilidad y generar un impacto positivo en temas que te importan. Además, contribuyes a construir comunidades más solidarias, resilientes y participativas.',
            'El voluntariado te beneficia de múltiples formas: desarrollas habilidades como liderazgo y trabajo en equipo, conoces nuevas realidades, amplías tu red de contactos, mejoras tu empleabilidad, y contribuyes positivamente a causas que te importan mientras construyes comunidades más solidarias.'
        ]
    },
    // Preguntas sobre certificados
    certificados: {
        keywords: ['certificado', 'certificación', 'documento', 'comprobante', 'validación'],
        responses: [
            'Sí, recibirás un certificado oficial de INJUV al completar exitosamente un proyecto de voluntariado.',
            'El certificado se emite automáticamente una vez que la organización anfitriona confirma tu participación y cumplimiento.',
            'Los certificados son digitales y se pueden descargar desde tu perfil de usuario.'
        ]
    },
    // Preguntas sobre organizaciones
    organizaciones: {
        keywords: ['organización', 'ong', 'fundación', 'registrar organización', 'ser anfitrión'],
        responses: [
            'Las organizaciones pueden registrarse en la plataforma para publicar oportunidades de voluntariado. Accede a la sección "Formulario de Organización" desde la página principal.',
            'Las organizaciones deben estar legalmente constituidas y cumplir con los requisitos establecidos por INJUV.',
            'Como organización, puedes gestionar tus oportunidades, revisar postulaciones y comunicarte con los voluntarios.'
        ]
    },
    // Preguntas sobre contacto y soporte técnico
    contacto: {
        keywords: ['contacto', 'ayuda', 'soporte', 'pregunta', 'duda', 'información', 'problemas', 'problema técnico', 'consulta', 'consultar'],
        responses: [
            'Si experimentas dificultades técnicas o tienes consultas sobre el funcionamiento de la plataforma, puedes escribir directamente a: voluntariado@injuv.gob.cl. El equipo revisará tu caso y te brindará apoyo lo antes posible. También puedes revisar la sección "Preguntas Frecuentes", que se actualiza periódicamente.',
            'Para problemas técnicos o consultas sobre la plataforma, escríbenos a voluntariado@injuv.gob.cl. Te responderemos a la brevedad posible. También puedes consultar esta sección de preguntas frecuentes para resolver dudas comunes.',
            'El equipo de INJUV está disponible para ayudarte. Para soporte técnico o consultas sobre la plataforma, contáctanos a voluntariado@injuv.gob.cl o revisa las preguntas frecuentes.'
        ]
    },
    // Preguntas sobre búsqueda
    busqueda: {
        keywords: ['buscar', 'encontrar', 'filtrar', 'búsqueda', 'oportunidades disponibles'],
        responses: [
            'Puedes buscar oportunidades usando los filtros en la página principal: región, temática y rango de fechas.',
            'Hay más de 3,000 oportunidades disponibles en la plataforma. Usa los filtros para encontrar la que mejor se adapte a ti.',
            'Puedes ver todas las oportunidades disponibles haciendo clic en "Ver todas las oportunidades" en la sección de oportunidades destacadas.'
        ]
    },
    // Preguntas generales
    general: {
        keywords: ['qué es', 'qué ofrece', 'información', 'sobre injuv', 'plataforma'],
        responses: [
            'INJUV Connect es la plataforma oficial del Instituto Nacional de la Juventud que conecta a jóvenes chilenos con oportunidades de voluntariado.',
            'La plataforma ofrece más de 3,000 oportunidades de voluntariado en diversas áreas: educación, medio ambiente, salud, emergencias, cultura y más.',
            'Más de 12,000 jóvenes ya han participado en programas de voluntariado a través de INJUV Connect.',
            'INJUV es una institución gubernamental que promueve la participación y el desarrollo de los jóvenes chilenos.'
        ]
    }
};

// Preguntas recomendadas por categoría
const recommendedQuestions = {
    registro: [
        { question: 'No tengo experiencia previa, ¿puedo postular?', short: '¿Puedo postular sin experiencia?' },
        { question: 'Quiero hacer un voluntariado pero no sé cómo empezar', short: '¿Cómo empezar?' },
        { question: '¿Cuáles son los requisitos?', short: 'Requisitos' }
    ],
    empezar: [
        { question: 'No tengo experiencia previa, ¿puedo postular?', short: '¿Puedo postular sin experiencia?' },
        { question: '¿Dónde puedo aprender sobre voluntariado?', short: 'Formación y cursos' },
        { question: '¿Qué oportunidades de voluntariado hay?', short: 'Oportunidades disponibles' }
    ],
    voluntariado: [
        { question: '¿De qué me sirve realizar voluntariado?', short: 'Beneficios' },
        { question: '¿Cuánto tengo que esperar para recibir una respuesta?', short: 'Tiempo de respuesta' },
        { question: '¿Recibo un certificado?', short: 'Certificados' }
    ],
    experiencia: [
        { question: 'Quiero hacer un voluntariado pero no sé cómo empezar', short: '¿Cómo empezar?' },
        { question: '¿Dónde puedo aprender sobre voluntariado?', short: 'Formación y cursos' },
        { question: '¿Cuáles son los requisitos?', short: 'Requisitos' }
    ],
    requisitos: [
        { question: 'No tengo experiencia previa, ¿puedo postular?', short: '¿Puedo postular sin experiencia?' },
        { question: '¿Cómo me registro?', short: 'Registro' },
        { question: 'Quiero hacer un voluntariado pero no sé cómo empezar', short: '¿Cómo empezar?' }
    ],
    postulacion: [
        { question: '¿Qué oportunidades de voluntariado hay?', short: 'Oportunidades' },
        { question: '¿Recibo un certificado?', short: 'Certificados' },
        { question: 'No tengo experiencia previa, ¿puedo postular?', short: '¿Puedo postular sin experiencia?' }
    ],
    formacion: [
        { question: 'Quiero hacer un voluntariado pero no sé cómo empezar', short: '¿Cómo empezar?' },
        { question: '¿De qué me sirve realizar voluntariado?', short: 'Beneficios' },
        { question: '¿Qué oportunidades de voluntariado hay?', short: 'Oportunidades' }
    ],
    beneficios: [
        { question: '¿Recibo un certificado?', short: 'Certificados' },
        { question: 'Quiero hacer un voluntariado pero no sé cómo empezar', short: '¿Cómo empezar?' },
        { question: '¿Dónde puedo aprender sobre voluntariado?', short: 'Formación' }
    ],
    certificados: [
        { question: '¿Cuánto tengo que esperar para recibir una respuesta?', short: 'Tiempo de respuesta' },
        { question: '¿De qué me sirve realizar voluntariado?', short: 'Beneficios' },
        { question: '¿Qué oportunidades de voluntariado hay?', short: 'Oportunidades' }
    ],
    organizaciones: [
        { question: '¿Cómo me registro?', short: 'Registro' },
        { question: 'Tengo problemas con la plataforma', short: 'Soporte técnico' },
        { question: '¿Qué oportunidades de voluntariado hay?', short: 'Oportunidades' }
    ],
    contacto: [
        { question: 'Quiero hacer un voluntariado pero no sé cómo empezar', short: '¿Cómo empezar?' },
        { question: '¿Cuáles son los requisitos?', short: 'Requisitos' },
        { question: '¿Qué oportunidades de voluntariado hay?', short: 'Oportunidades' }
    ],
    busqueda: [
        { question: 'Quiero hacer un voluntariado pero no sé cómo empezar', short: '¿Cómo empezar?' },
        { question: 'No tengo experiencia previa, ¿puedo postular?', short: '¿Puedo postular sin experiencia?' },
        { question: '¿Cuáles son los requisitos?', short: 'Requisitos' }
    ],
    general: [
        { question: 'Quiero hacer un voluntariado pero no sé cómo empezar', short: '¿Cómo empezar?' },
        { question: 'No tengo experiencia previa, ¿puedo postular?', short: '¿Puedo postular sin experiencia?' },
        { question: '¿Qué oportunidades de voluntariado hay?', short: 'Oportunidades' }
    ]
};

// Función para encontrar la mejor respuesta
function findBestResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Buscar coincidencias por categoría
    for (const [category, data] of Object.entries(faqDatabase)) {
        for (const keyword of data.keywords) {
            if (message.includes(keyword)) {
                // Devolver una respuesta aleatoria de la categoría
                const randomIndex = Math.floor(Math.random() * data.responses.length);
                return {
                    response: data.responses[randomIndex],
                    category: category
                };
            }
        }
    }
    
    // Si no hay coincidencia, devolver respuesta genérica
    return {
        response: 'Gracias por tu pregunta. Puedo ayudarte con información sobre cómo empezar, registro, oportunidades de voluntariado, requisitos, experiencia previa, tiempos de respuesta, formación, beneficios del voluntariado, certificados y soporte técnico. ¿Sobre qué te gustaría saber?',
        category: 'general'
    };
}

// Inicializar chatbot
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotClose = document.getElementById('chatbot-close');
    
    // Verificar que los elementos existan
    if (!chatbotMessages || !chatbotSend) {
        console.error('Error: No se encontraron los elementos del chatbot');
        return;
    }
    
    let isOpen = false;
    
    // Mensaje de bienvenida
    function addWelcomeMessage() {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'chatbot-message chatbot-bot';
        welcomeMsg.innerHTML = `
            <div class="message-content">
                <p>¡Hola! 👋 Soy el asistente virtual de INJUV. ¿En qué puedo ayudarte hoy?</p>
                <div class="quick-questions">
                    <button type="button" class="quick-question-btn" data-question="Quiero hacer un voluntariado pero no sé cómo empezar">¿Cómo empezar?</button>
                    <button type="button" class="quick-question-btn" data-question="No tengo experiencia previa, ¿puedo postular?">¿Puedo postular sin experiencia?</button>
                    <button type="button" class="quick-question-btn" data-question="¿Cuánto tengo que esperar para recibir una respuesta?">Tiempo de respuesta</button>
                    <button type="button" class="quick-question-btn" data-question="¿Dónde puedo aprender sobre voluntariado?">Formación y cursos</button>
                    <button type="button" class="quick-question-btn" data-question="¿De qué me sirve realizar voluntariado?">Beneficios del voluntariado</button>
                    <button type="button" class="quick-question-btn" data-question="Tengo problemas con la plataforma">Soporte técnico</button>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(welcomeMsg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Agregar mensaje al chat
    function addMessage(text, isUser = false, recommendedQs = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'chatbot-user' : 'chatbot-bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = text;
        
        messageDiv.appendChild(messageContent);
        
        // Agregar preguntas recomendadas si existen y es mensaje del bot
        if (!isUser && recommendedQs && recommendedQs.length > 0) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'recommended-questions';
            
            const title = document.createElement('p');
            title.textContent = '💡 También te puede interesar:';
            recommendedDiv.appendChild(title);
            
            const questionsList = document.createElement('div');
            questionsList.className = 'quick-questions';
            
            recommendedQs.forEach(q => {
                const btn = document.createElement('button');
                btn.className = 'quick-question-btn';
                btn.setAttribute('data-question', q.question);
                btn.setAttribute('type', 'button'); // Prevenir submit
                btn.textContent = q.short;
                questionsList.appendChild(btn);
            });
            
            // Agregar opción para volver a las preguntas iniciales
            const resetBtn = document.createElement('button');
            resetBtn.className = 'quick-question-btn reset-questions-btn';
            resetBtn.setAttribute('data-action', 'reset');
            resetBtn.setAttribute('type', 'button'); // Prevenir submit
            resetBtn.textContent = 'Volver a las preguntas iniciales ↻';
            questionsList.appendChild(resetBtn);
            
            recommendedDiv.appendChild(questionsList);
            messageContent.appendChild(recommendedDiv);
        }
        
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll automático
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        return messageDiv;
    }
    
    // Simular respuesta del bot con delay
    function botResponse(userMessage) {
        // Aquí NO mostramos el spinner, eso ya lo hace sendMessage()
        setTimeout(() => {
            const result = findBestResponse(userMessage);
            const recommended = recommendedQuestions[result.category] || [];
            const recommendedToShow = recommended.slice(0, 3);
            
            // Primero ocultamos el spinner
            hideLoadingSpinner();
            
            // Luego mostramos la respuesta
            addMessage(result.response, false, recommendedToShow);
        }, 1500); // 1.5 segundos de delay
    }
    
    function showLoadingSpinner() {
        hideLoadingSpinner();
    
        if (!chatbotMessages) {
            console.error('chatbotMessages no está disponible');
            return;
        }
        
        // Deshabilitar input y botón mientras carga
        if (chatbotInput) {
            chatbotInput.disabled = true;
            chatbotInput.placeholder = 'Espera la respuesta del bot...';
        }
        if (chatbotSend) {
            chatbotSend.disabled = true;
        }
        
        // Deshabilitar todos los botones de preguntas rápidas
        const quickButtons = document.querySelectorAll('.quick-question-btn');
        quickButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    
        const spinnerDiv = document.createElement('div');
        spinnerDiv.className = 'chatbot-message chatbot-bot';
        spinnerDiv.id = 'loading-spinner-message';
    
        // 👇 OJO: ya NO usamos "message-content"
        const spinnerContent = document.createElement('div');
        spinnerContent.className = 'loading-spinner-wrapper';
    
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
    
        spinnerContent.appendChild(spinner);
        spinnerDiv.appendChild(spinnerContent);
        chatbotMessages.appendChild(spinnerDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
        return spinnerDiv;
    }
    
    
    // Ocultar spinner
    function hideLoadingSpinner() {
        const spinnerMessage = document.getElementById('loading-spinner-message');
        if (spinnerMessage) {
            spinnerMessage.remove();
        }
        
        // Habilitar input y botón cuando termina de cargar
        if (chatbotInput) {
            chatbotInput.disabled = false;
            chatbotInput.placeholder = 'Escribe tu pregunta aquí...';
        }
        if (chatbotSend) {
            chatbotSend.disabled = false;
        }
        
        // Habilitar todos los botones de preguntas rápidas
        const quickButtons = document.querySelectorAll('.quick-question-btn');
        quickButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
        
        // Habilitar input y botón cuando termina de cargar
        if (chatbotInput) {
            chatbotInput.disabled = false;
            chatbotInput.placeholder = 'Escribe tu pregunta aquí...';
        }
        if (chatbotSend) {
            chatbotSend.disabled = false;
        }
    }
    
    // Enviar mensaje
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // No permitir enviar si ya hay un spinner activo (cargando)
        if (chatbotInput.disabled || chatbotSend.disabled) {
            return;
        }
        
        addMessage(message, true);
        chatbotInput.value = '';
        
        // Mostrar spinner inmediatamente después de enviar
        showLoadingSpinner();
        
        // Lanzar respuesta del bot
        botResponse(message);
    }
    
    // Toggle chatbot
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                chatbotContainer.classList.add('chatbot-open');
                if (chatbotMessages.children.length === 0) {
                    addWelcomeMessage();
                }
            } else {
                chatbotContainer.classList.remove('chatbot-open');
            }
        });
    }
    
    // Función para volver a las preguntas iniciales
    function resetToInitialQuestions() {
        // Limpiar todos los mensajes
        chatbotMessages.innerHTML = '';
        addWelcomeMessage();
    }
    
    // Cerrar chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            isOpen = false;
            chatbotContainer.classList.remove('chatbot-open');
        });
    }
    
    // Enviar con botón
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }
    
    // Enviar con Enter
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Preguntas rápidas
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-question-btn')) {
            // No permitir clics si el botón está deshabilitado o si el bot está cargando
            if (e.target.disabled || chatbotInput.disabled) {
                return;
            }
            
            // Verificar si es el botón de reset
            if (e.target.getAttribute('data-action') === 'reset') {
                resetToInitialQuestions();
            } else {
                // Es una pregunta normal
                const question = e.target.getAttribute('data-question');
                if (question) {
                    chatbotInput.value = question;
                    sendMessage();
                }
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}

