import i18next from 'i18next';

i18next.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        feedback: {
          invalidUrl: 'Ссылка должна быть валидным URL',
          alreadyAdded: 'RSS уже добавлен',
          parsingError: 'Ресурс не содержит валидный RSS',
          networkError: 'Ошибка сети',
          success: 'RSS успешно загружен',
        },
      },
    },
  },
});

export default i18next;