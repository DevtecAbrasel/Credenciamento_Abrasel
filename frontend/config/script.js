// script.js

async function submitForm() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://localhost:8080/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.msg; // Certifique-se de pegar o token da resposta correta
  
        // Armazenar o token no LocalStorage
        localStorage.setItem("token", token);
  
        // Redirecionar para a página principal (ou a página que desejar)
        window.location.href = "landing-page.html";
      } else {
        const errorData = await response.json();
        console.error("Erro de autenticação:", errorData.msg);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  }
  
  // Função para verificar se o usuário está logado
  function checkLoggedIn() {
    const token = localStorage.getItem("token");
    return !!token; // Retorna true se houver um token, indicando que o usuário está logado
  }
  
  // Exemplo de uso:
  if (checkLoggedIn()) {
    // O usuário está logado, redirecione-o para a página principal ou faça outras ações necessárias
    window.location.href = "landing-page.html";
  }
  