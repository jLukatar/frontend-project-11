import  './styles.scss';
import  'bootstrap';
import * as yup from 'yup';
import { stateWatcher } from './view';



const state = {
    form: {
      url: '',
      error: null,
    },
    feeds: [],
  };

  const elements = {
    formInput : document.querySelector("input"),
  }


  const watchedState = stateWatcher(state, elements);

 
  const validateForm = (data) => {
    const validationSchema = 
    yup.string().notOneOf(watchedState.feeds, 'RSS уже добавлен').url('Ссылка должна быть валидным URL');
    return validationSchema.validate(data).then(() => {
      state.form.error = null;
      return true;
    }).catch((error) => {
      watchedState.form.error = error.message;
      return false;
    });
  };


document.querySelector(".rss-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  watchedState.form.url = data.get("url");
  validateForm(watchedState.form.url)
  .then((isValid) => {
    if (isValid) {
      watchedState.feeds.push(watchedState.form.url);
    }
  })
});
