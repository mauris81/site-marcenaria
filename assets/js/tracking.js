/* Rastreamento e Analytics */

// Inicializar dataLayer se não existir
window.dataLayer = window.dataLayer || [];

// Função para enviar eventos ao GTM
function sendGTMEvent(eventName, eventData = {}) {
    window.dataLayer.push({
        event: eventName,
        ...eventData
    });
}

// Rastreamento de cliques no WhatsApp
document.addEventListener('click', function(e) {
    const whatsappLink = e.target.closest('.js-whatsapp-link');
    if (whatsappLink) {
        sendGTMEvent('whatsapp_click', {
            link_url: whatsappLink.href,
            page_path: window.location.pathname,
            link_text: whatsappLink.textContent.trim()
        });
    }
});

// Rastreamento de submissão de formulário
function trackFormSubmit(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(e) {
            // Se o formulário for enviado com sucesso (validação passa)
            if (form.checkValidity()) {
                sendGTMEvent('quote_form_submit', {
                    form_id: formId,
                    page_path: window.location.pathname,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
}

// Rastreamento de visualização de página
sendGTMEvent('page_view', {
    page_path: window.location.pathname,
    page_title: document.title
});

// Rastreamento de cliques nos CTAs
document.addEventListener('click', function(e) {
    const ctaButton = e.target.closest('.cta-button');
    if (ctaButton) {
        sendGTMEvent('cta_click', {
            cta_text: ctaButton.textContent.trim(),
            page_path: window.location.pathname,
            button_class: ctaButton.className
        });
    }
});

// Funções auxiliares para o site
console.log('Rastreamento carregado com sucesso');
