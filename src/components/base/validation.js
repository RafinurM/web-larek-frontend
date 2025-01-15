function showInputError(formElement, inputElement, message, configuration) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(configuration.inputErrorClass);
  errorElement.textContent = message;
}

function hideInputError(formElement, inputElement, configuration) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(configuration.inputErrorClass);
  errorElement.textContent = "";
}

function isValid(formElement, inputElement, configuration) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      configuration
    );
  } else {
    hideInputError(formElement, inputElement, configuration);
  }
}

function setEventListeners(formElement, configuration) {
  const inputList = Array.from(
    formElement.querySelectorAll(configuration.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    configuration.submitButtonSelector
  ); // choose btn
  toggleButtonState(inputList, buttonElement, configuration);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isValid(formElement, inputElement, configuration);
      toggleButtonState(inputList, buttonElement, configuration);
    });
  });
}

export function enableValidation(configuration) {
  // configuration - объект который мы передаём
  const formList = Array.from(
    document.querySelectorAll(configuration.formSelector)
  );
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    setEventListeners(formElement, configuration);
  });
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function toggleButtonState(inputList, buttonElement, configuration) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(configuration.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(configuration.inactiveButtonClass);
  }
}

export function clearValidation(form, configuration) {
  const inputList = Array.from(
    form.querySelectorAll(configuration.inputSelector)
  );
  const button = form.querySelector(configuration.submitButtonSelector);
  console.log(button)
  inputList.forEach((input) => {
    const errorElement = form.querySelector(`.${input.id}-error`);
    input.classList.remove(configuration.inputErrorClass);
    errorElement.textContent = "";
  });
  toggleButtonState(inputList, button, configuration);
}
