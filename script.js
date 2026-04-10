console.log("Site da Marcenaria carregado com sucesso!");
window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    const logoImg = document.querySelector(".logo img");
    
    // Só executa o efeito de encolher se a tela for de computador
    if (window.innerWidth > 768) {
        if (window.scrollY > 50) {
            header.style.height = "90px";
            logoImg.style.height = "70px";
        } else {
            header.style.height = "160px";
            logoImg.style.height = "130px";
        }
    } else {
        // No celular, removemos as alturas fixas para o CSS trabalhar livre
        header.style.height = "auto";
        logoImg.style.height = "80px";
    }
});