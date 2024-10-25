import onChange from 'on-change';

const stateWatcher = (state, elements) => {
    return onChange(state, (path) => {
      switch (path) {
        case 'form.feedback':
            renderFormError(elements, state);
          break;
        case 'feedsUrl':
            renderFormSuccess(elements, state);
          break;
        case 'items': renderNewItems(elements, state);
          break;
          case 'feeds': renderFeeds(elements, state);
          break;
        default:
            //throw new Error(`Unknown path: ${path}`);
          break;
      }
    });
  };

const renderFormError = (elements, state) =>{
  elements.feedback.textContent = state.form.feedback;
  elements.feedback.classList.add("text-danger");
  elements.formInput.classList.add("is-invalid");
  elements.formInput.focus();
}

const renderFormSuccess = (elements, state) =>{
  elements.formInput.classList.remove("is-invalid");
  elements.formInput.value = "";
  elements.formInput.focus();
  elements.feedback.textContent = state.form.feedback;
  elements.feedback.classList.remove("text-danger");
  elements.feedback.classList.add("text-success");

}

const renderNewItems = (elements, state) => {
  console.log('renderNewItems');
  elements.posts.innerHTML = '';
  const cardBorder = document.createElement("div");
  cardBorder.classList.add("card", "border-0");
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("card-title", "h4");
  cardTitle.textContent = 'Посты';
  const itemsList = document.createElement("ul");
  itemsList.classList.add("list-group", "border-0", "rounded-0");
  console.log(state.items);
  Object.values(state.items).reverse().forEach((item) => {
    console.log(item);
   const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start", "border-0", "border-end-0");
    const link = document.createElement("a");
    link.setAttribute("href", item.link);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.classList.add("fw-bold");
    link.dataset.id = item.itemId;
    link.textContent = item.title;
    const button = document.createElement("button");
    button.classList.add("btn", "btn-outline-primary", "btn-sm");
    button.dataset.id = item.itemId;
    button.dataset.bsToggle = "modal";
    button.dataset.bsTarget = "#modal";
    button.textContent = "Просмотр";
    listItem.append(link, button);
    itemsList.append(listItem);

    button.addEventListener("click", () => {
      const modalTitle = document.querySelector(".modal-title");
      const modalBody = document.querySelector(".modal-body");

      modalTitle.textContent = item.title;
      modalBody.textContent = item.description;
      document.querySelector(".full-article").setAttribute("href", item.link);
    });
  });
  cardBody.append(cardTitle, itemsList);
  cardBorder.append(cardBody);
  elements.posts.append(cardBorder);
  };


  const renderFeeds = (elements, state) => {
    console.log('renderFeeds');
    elements.feeds.innerHTML = '';
    const cardBorder = document.createElement("div");
    cardBorder.classList.add("card", "border-0");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const cardTitle = document.createElement("h2");
    cardTitle.classList.add("card-title", "h4");
    cardTitle.textContent = 'Фиды';
    const feedsList = document.createElement("ul");
    feedsList.classList.add("list-group", "border-0", "rounded-0");
    Object.values(state.feeds).reverse().forEach((feed) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "border-0", "border-end-0");
      const feedName = document.createElement('h3');
      feedName.classList.add("h6", "m-0");
      feedName.textContent = feed.name;
      const description = document.createElement('p');
      description.classList.add("m-0", "small", "text-black-50");
      description.textContent = feed.description;

      listItem.append(feedName, description);
      feedsList.append(listItem);
  })

  cardBody.append(cardTitle, feedsList);
  cardBorder.append(cardBody);
  elements.feeds.append(cardBorder);
}

export { stateWatcher }; 