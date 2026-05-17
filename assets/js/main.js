// Comportamento do header ao fazer scroll
window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    const logoImg = document.querySelector(".logo img");

    if (window.innerWidth > 768) {
        if (window.scrollY > 50) {
            header.style.height = "90px";
            logoImg.style.height = "70px";
        } else {
            header.style.height = "160px";
            logoImg.style.height = "130px";
        }
    } else {
        header.style.height = "auto";
        logoImg.style.height = "80px";
    }
});

const WHATSAPP_NUMBER = '5511958522265';
const DEFAULT_WHATSAPP_MESSAGE = 'Olá, gostaria de solicitar um orçamento para móveis sob medida.';

function buildWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initWhatsappLinks() {
    document.querySelectorAll('.js-whatsapp-link').forEach((link) => {
        link.href = buildWhatsAppUrl();
    });
}

// Validação e envio do formulário de orçamento
function initQuoteForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validação simples
        if (!data.nome || !data.telefone || !data.tipo) {
            showFormMessage('Por favor, preencha os campos obrigatórios.', 'error');
            return;
        }

        // Validar telefone básico
        if (!/^\d{10,}$/.test(data.telefone.replace(/\D/g, ''))) {
            showFormMessage('Por favor, insira um telefone válido.', 'error');
            return;
        }

        // Validar email se fornecido
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showFormMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }

        // Se chegou aqui, formulário é válido
        handleFormSubmit(data);
    });
}

function showFormMessage(message, type) {
    const messageEl = document.querySelector('.form-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = 'form-message ' + type;
    }
}

function handleFormSubmit(data) {
    // Opção 1: Enviar via WhatsApp com mensagem pré-preenchida
    const message = `Olá! Gostaria de solicitar um orçamento.

Nome: ${data.nome}
Telefone: ${data.telefone}
Bairro: ${data.bairro || 'Não informado'}
Tipo de Projeto: ${data.tipo}

Mensagem: ${data.mensagem || 'Sem mensagem adicional'}`;

    const whatsappUrl = buildWhatsAppUrl(message);

    // Disparar evento de conversão antes de redirecionar
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'quote_form_submit',
        form_data: {
            type: data.tipo,
            region: data.bairro
        }
    });

    const opened = window.open(whatsappUrl, '_blank');
    if (opened) {
        opened.opener = null;
    } else {
        window.location.href = whatsappUrl;
    }

    showFormMessage('Abrindo WhatsApp com sua mensagem preenchida...', 'success');
}

// Formatar telefone enquanto digita
function formatPhone(input) {
    const value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        input.value = value
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initWhatsappLinks();
    initQuoteForm();

    // Adicionar formatação de telefone
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhone(this);
        });
    }
});

console.log("Site carregado com sucesso!");
