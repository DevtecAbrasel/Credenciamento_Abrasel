document.addEventListener("DOMContentLoaded", async function () {
  try {
    const events = await fetchEvents();
    console.log("Eventos recebidos:", events);
    updateTable(events);
  } catch (error) {
    console.error("Erro durante a obtenção de eventos:", error.message);
  }
});

async function fetchEvents() {
  const apiUrl = "http://localhost:8080/v1/event";

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro durante a solicitação fetch:", error.message);
    throw error;
  }
}

function updateTable(events) {
  const tableBody = document.getElementById("eventTableBody");
  tableBody.innerHTML = "";

  events.forEach((event) => {
    const newRow = tableBody.insertRow(tableBody.rows.length);

    const nomeEventoCell = newRow.insertCell(0);
    const dataCell = newRow.insertCell(1);
    const startCell = newRow.insertCell(2);
    const originCell = newRow.insertCell(3);
    const localCell = newRow.insertCell(4);
    const price = newRow.insertCell(5);
    const inviteeLimitcell = newRow.insertCell(6);
    
    nomeEventoCell.innerHTML = event.name;

    // Adicionar um ajuste para o fuso horário local
    const eventStartDate = new Date(event.start);
    const localStartDate = new Date(eventStartDate.getTime() - eventStartDate.getTimezoneOffset() * -60000);
    
    dataCell.innerHTML = localStartDate.toLocaleDateString('pt-BR');
    localCell.innerHTML = event.location;
    originCell.innerHTML = event.origin;
    inviteeLimitcell.innerHTML = event.inviteeLimit;
    price.innerHTML = event.price;

    // Formatar a hora no formato de 24 horas sem minutos e segundos
    const localStartTime = localStartDate.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
    startCell.innerHTML = localStartTime;
    
    const addButton1 = document.createElement("button");
    addButton1.className = "overlay__btn overlay__btn--colors";
    addButton1.innerText = "Adicionar Recepcionista";
    addButton1.addEventListener("click", () => {
      window.location.href = 'add-recep.html';
      console.log(
        "Botão de Adicionar Recepcionista clicado para o evento:",
        event
      );
    });

    const addButton2 = document.createElement("button");
    addButton2.className = "overlay__btn overlay__btn--colors";
    addButton2.innerText = "Mapa de mesas";
    addButton2.addEventListener("click", () => {
      window.location.href = 'mapa-de-mesas.html';
      console.log(
        "Botão de abrir o mapa de mesas para o evento:",
        event
      );
    });

    const addButton3 = document.createElement("button");
    addButton3.className = "overlay__btn overlay__btn--colors";
    addButton3.innerText = "lista de convidados";
    addButton3.addEventListener("click", () => {
      window.location.href = 'list-checkin.html';
      console.log(
        "Botão de abrir add recep para o evento:",
        event
      );
    });

    const buttonsCell2 = newRow.insertCell(7);
    buttonsCell2.appendChild(addButton2);
    const buttonsCell1 = newRow.insertCell(8);
    buttonsCell1.appendChild(addButton1);
    const buttonsCell3 = newRow.insertCell(9);
    buttonsCell3.appendChild(addButton3);
  });
}

