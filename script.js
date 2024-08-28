document.addEventListener("DOMContentLoaded", () => {
  const cardTemplate = document.getElementById("card-template").content;
  const smallCardTemplate = document.getElementById(
    "small-card-template"
  ).content;
  const todoCards = document.getElementById("todo-cards");
  const inProgressCards = document.getElementById("in-progress-cards");
  const doneCards = document.getElementById("done-cards");

  loadBoard();

  document
    .getElementById("add-todo-card")
    .addEventListener("click", () => addCard(todoCards));
  document
    .getElementById("add-in-progress-card")
    .addEventListener("click", () => addCard(inProgressCards));
  document
    .getElementById("add-done-card")
    .addEventListener("click", () => addCard(doneCards));

  [todoCards, inProgressCards, doneCards].forEach((column) => {
    column.addEventListener("dragover", (e) => e.preventDefault());
    column.addEventListener("drop", (e) => {
      const card = document.querySelector(".dragging");
      column.appendChild(card);
      saveBoard();
    });
  });

  function addCard(column) {
    const card = cardTemplate.cloneNode(true);
    addCardEventListeners(card);
    column.appendChild(card);
  }

  function addCardEventListeners(card) {
    const cardElement = card.querySelector(".card");
    cardElement.addEventListener("dragstart", () =>
      cardElement.classList.add("dragging")
    );
    cardElement.addEventListener("dragend", () => {
      cardElement.classList.remove("dragging");
      saveBoard();
    });

    card
      .querySelector(".create-small-card-btn")
      .addEventListener("click", () => createSmallCard(cardElement));

    card.querySelector(".delete-card-btn").addEventListener("click", () => {
      cardElement.remove();
      saveBoard();
    });

    card.querySelectorAll("input, textarea, select").forEach((input) => {
      input.addEventListener("input", saveBoard);
    });
  }

  function createSmallCard(cardElement) {
    const title = cardElement.querySelector(".card-title").value;
    const description = cardElement.querySelector(".card-description").value;
    const tag = cardElement.querySelector(".card-tag").value;

    if (!title || !description) {
      alert("Please fill in both the title and description.");
      return;
    }

    const smallCard = smallCardTemplate.cloneNode(true);
    smallCard.querySelector(".small-card-title").textContent = title;
    smallCard.querySelector(".small-card-description").textContent =
      description;
    smallCard.querySelector(".small-card-tag").textContent = tag;

    addSmallCardEventListeners(smallCard);

    cardElement.parentElement.appendChild(smallCard);
    cardElement.remove(); // Remove the larger card after creating the smaller one

    saveBoard();
  }

  function addSmallCardEventListeners(smallCard) {
    const smallCardElement = smallCard.querySelector(".small-card");
    smallCardElement.addEventListener("dragstart", () =>
      smallCardElement.classList.add("dragging")
    );
    smallCardElement.addEventListener("dragend", () => {
      smallCardElement.classList.remove("dragging");
      saveBoard();
    });

    smallCard
      .querySelector(".delete-small-card-btn")
      .addEventListener("click", () => {
        smallCardElement.remove();
        saveBoard();
      });
  }

  function saveBoard() {
    const boardData = {
      todo: getSmallCardData(todoCards),
      inProgress: getSmallCardData(inProgressCards),
      done: getSmallCardData(doneCards),
    };
    localStorage.setItem("kanbanBoard", JSON.stringify(boardData));
  }

  function getSmallCardData(column) {
    return Array.from(column.querySelectorAll(".small-card")).map((card) => ({
      title: card.querySelector(".small-card-title").textContent,
      description: card.querySelector(".small-card-description").textContent,
      tag: card.querySelector(".small-card-tag").textContent,
    }));
  }

  function loadBoard() {
    const savedBoard = JSON.parse(localStorage.getItem("kanbanBoard"));
    if (!savedBoard) return;

    Object.entries(savedBoard).forEach(([status, cards]) => {
      const column =
        status === "todo"
          ? todoCards
          : status === "inProgress"
          ? inProgressCards
          : doneCards;
      cards.forEach((cardData) => {
        const smallCard = smallCardTemplate.cloneNode(true);
        smallCard.querySelector(".small-card-title").textContent =
          cardData.title;
        smallCard.querySelector(".small-card-description").textContent =
          cardData.description;
        smallCard.querySelector(".small-card-tag").textContent = cardData.tag;
        addSmallCardEventListeners(smallCard);
        column.appendChild(smallCard);
      });
    });
  }
});
