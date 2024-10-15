import onChange from 'on-change';

const stateWatcher = (state, elements) => {
    return onChange(state, (path) => {
      switch (path) {
        case 'form.error':
            renderFormError(elements.formInput);
          break;
        case 'feeds':
            renderFormSuccess(elements.formInput);
          break;
        default:
            //throw new Error(`Unknown path: ${path}`);
          break;
      }
    });
  };

const renderFormError = (element) =>{
    element.classList.add("is-invalid");
    element.focus();
}

const renderFormSuccess = (element) =>{
    element.classList.remove("is-invalid");
    element.value = "";
    element.focus();
}

export { stateWatcher }; 