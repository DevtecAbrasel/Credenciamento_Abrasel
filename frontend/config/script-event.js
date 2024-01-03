// document.addEventListener("DOMContentLoaded", async function () {
//   try {
//     const events = await fetchEvents();
//     // Manipule os eventos recebidos aqui, por exemplo, atualizando a tabela na página
//     console.log("Eventos recebidos:", events);

//     // Atualiza a tabela com os eventos recebidos
//     updateTable(events);
//   } catch (error) {
//     // Trate o erro conforme necessário
//     console.error("Erro durante a obtenção de eventos:", error.message);
//   }
// });

// // Função para buscar eventos na API
// async function fetchEvents() {
//   const apiUrl = "http://localhost:8080/v1/event"; // Atualize a porta conforme necessário

//   try {
//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         // Adicione outros cabeçalhos conforme necessário
//         Authorization: `Bearer ${localStorage.getItem("token")}`, // Adiciona o token de autenticação ao cabeçalho
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Erro na requisição: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Erro durante a solicitação fetch:", error.message);
//     throw error; // Propaga o erro para que possa ser tratado no local de chamada
//   }
// }

// // Função para atualizar a tabela com os eventos
// function updateTable(events) {
//   const tableBody = document.getElementById("eventTableBody");
//   tableBody.innerHTML = ""; // Limpa o conteúdo atual da tabela

//   events.forEach((event) => {
//     const newRow = tableBody.insertRow(tableBody.rows.length);

//     // Adiciona as células da linha com os dados do evento
//     const nomeEventoCell = newRow.insertCell(0);
//     const dataCell = newRow.insertCell(1);
//     const localCell = newRow.insertCell(2);
//     const localCell1 = newRow.insertCell(3);
//     const localCell2 = newRow.insertCell(4);
//     const localCell3 = newRow.insertCell(5);
//     const localCell4 = newRow.insertCell(6);
//     const localCell5 = newRow.insertCell(7);
//     const localCell6 = newRow.insertCell(8);
//     const localCell7 = newRow.insertCell(9);
//     const localCell8 = newRow.insertCell(10);

//     const buttonsCell = newRow.insertCell(11); // Célula para os botões

//     // Preenche as células com os dados do evento
//     nomeEventoCell.innerHTML = event.name;
//     dataCell.innerHTML = new Date(event.start).toLocaleDateString();
//     localCell.innerHTML = event.location;
//     locationCell.innerHTML = event.location


//     // Adiciona botões na célula apropriada
//     const addButton = document.createElement("button");
//     addButton.className = "overlay__btn overlay__btn--colors";
//     addButton.innerText = "Adicionar Recepcionista";
//     addButton.addEventListener("click", () => {
//       // Lógica para adicionar um recepcionista ao evento
//       console.log(
//         "Botão de Adicionar Recepcionista clicado para o evento:",
//         event
//       );
//     });

//     buttonsCell.appendChild(addButton);
//   });
// }
// Aguarda o evento de carregamento do DOM antes de executar o código

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Obtém eventos da API ao carregar a página
    const events = await fetchEvents();
    console.log("Eventos recebidos:", events);
    updateTable(events); // Atualiza a tabela com os eventos obtidos
  } catch (error) {
    console.error("Erro durante a obtenção de eventos:", error.message);
  }

  // Adiciona um listener ao formulário para capturar o evento de envio
  const inviteeForm = document.getElementById("inviteeForm");
  inviteeForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    try {
      // Coleta dados do formulário
      const formData = new FormData(event.target);
      const inviteeData = {};
      formData.forEach((value, key) => {
        inviteeData[key] = value;
      });

      // Envia os dados do invitee para a API
      await addInvitee(inviteeData);

      // Atualiza a tabela com os eventos após adicionar o invitee
      const updatedEvents = await fetchEvents();
      updateTable(updatedEvents);
    } catch (error) {
      console.error("Erro ao enviar dados do invitee:", error.message);
    }
  });
});

// Função para buscar eventos na API
async function fetchEvents() {
  const apiUrl = "http://localhost:8080/v1/event"; // Atualize a porta conforme necessário

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Adiciona o token de autenticação ao cabeçalho
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro durante a solicitação fetch:", error.message);
    throw error; // Propaga o erro para que possa ser tratado no local de chamada
  }
}

// Função para adicionar um invitee à API
async function addInvitee(inviteeData) {
  const apiUrl = "http://localhost:8080/v1/invitee"; // Atualize conforme necessário

  try {
    // Envia a requisição POST para a API com os dados do invitee
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(inviteeData),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    console.log("Invitee adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar dados do invitee:", error.message);
    throw error;
  }
}

// Função para atualizar a tabela com os eventos
function updateTable(events) {
  const tableBody = document.getElementById("eventTableBody");
  tableBody.innerHTML = ""; // Limpa o conteúdo atual da tabela

  events.forEach((event) => {
    const newRow = tableBody.insertRow(tableBody.rows.length);

    // Adiciona as células da linha com os dados do evento
    const nomeEventoCell = newRow.insertCell(0);
    const dataCell = newRow.insertCell(1);
    const localCell = newRow.insertCell(2);
    const localCell1 = newRow.insertCell(3);
    const localCell2 = newRow.insertCell(4);
    const localCell3 = newRow.insertCell(5);
    const localCell4 = newRow.insertCell(6);
    const localCell5 = newRow.insertCell(7);
    const localCell6 = newRow.insertCell(8);
    const localCell7 = newRow.insertCell(9);
    const localCell8 = newRow.insertCell(10);

    const buttonsCell = newRow.insertCell(11); // Célula para os botões

    // Preenche as células com os dados do evento
    nomeEventoCell.innerHTML = event.name;
    dataCell.innerHTML = new Date(event.start).toLocaleDateString();
    localCell.innerHTML = event.location;
    locationCell.innerHTML = event.location;

    // Adiciona botões na célula apropriada
    const addButton = document.createElement("button");
    addButton.className = "overlay__btn overlay__btn--colors";
    addButton.innerText = "Adicionar Recepcionista";
    addButton.addEventListener("click", () => {
      // Lógica para adicionar um recepcionista ao evento
      console.log(
        "Botão de Adicionar Recepcionista clicado para o evento:",
        event
      );
    });

    buttonsCell.appendChild(addButton);
  });
}

