import  './styles.scss';
import  'bootstrap';
import * as yup from 'yup';
import { stateWatcher } from './view';
import i18next from './i18n';
import axios from 'axios';

import parseRssFeed from './parse';

const state = {
  form: {
    url: '',
    feedback: null,
    status: 'inputting',
  },
  feedsUrl: [],
};

const elements = {
  formInput : document.querySelector("input"),
  feedback : document.querySelector(".feedback"),
  posts : document.querySelector(".posts"),
  feeds : document.querySelector(".feeds"),
}

yup.setLocale({
  mixed: {
    default: () => ({ key: 'invalidUrl' }),
  },
  string: {
    url: () => ({ key: 'invalidUrl' }),
  },
  number: {
    min: () => ({ key: 'alreadyAdded' }),
  },
});

const watchedState = stateWatcher(state, elements);

const parseRssFeedData = (xmlString) => {
  watchedState.form.status = 'Parsing';
  try {
    const parsedData = parseRssFeed(xmlString);
    return parsedData;
  } catch (error) {
    watchedState.form.feedback = i18next.t('feedback.parsingError');
    throw error;
  }
};

const fetchRssFeed = (url) => {
  watchedState.form.status = 'Fetching';
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
    .then((response) => {
      return response.data.contents;
    })
    .catch((error) => {
      watchedState.form.feedback = i18next.t('feedback.networkError');
      throw error;
    });
};

 
  const validateForm = (data) => {
    watchedState.form.status = 'Validating';
    console.log(watchedState.form.status);
    const validationSchema = 
    yup.string().notOneOf(watchedState.feedsUrl, () => ({ key: 'alreadyAdded' })).url();
    return validationSchema.validate(data).then(() => {
      watchedState.form.feedback = null;
      return true;
    }).catch((error) => {
      watchedState.form.feedback = i18next.t(`feedback.${error.errors[0].key}`);
      return false;
    });
  };


document.querySelector(".rss-form").addEventListener("submit", (event) => {
  event.preventDefault();
  watchedState.form.status = 'Submit';
  console.log(watchedState.form.status);
  const data = new FormData(event.target);
  watchedState.form.url = data.get("url");
  validateForm(watchedState.form.url)
  .then((isValid) => {
    if (isValid) {
      fetchRssFeed(watchedState.form.url)
      .then((xmlString) => {
        console.log(watchedState.form.status);
        const parsedData = parseRssFeedData(xmlString);
        console.log(watchedState.form.status);
        watchedState.feeds = {
          ...state.feeds,
          ...parsedData.feeds,
        };
        watchedState.items = {
          ...state.items,
          ...parsedData.items,
        };
        watchedState.form.status = 'Success';
        console.log(watchedState.form.status);
        watchedState.form.feedback = i18next.t('feedback.success');
        watchedState.feedsUrl.push(watchedState.form.url);
        console.log(watchedState.target);
      })
      .catch((error) => {
      });

    }
  })
});
