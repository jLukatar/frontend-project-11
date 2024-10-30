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
  },
  status: 'inputting',
  feedsUrl: [],
  feeds: [],
  items: [],
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

const parseRssFeedData = (xmlString, url) => {
  try {
    const parsedData = parseRssFeed(xmlString, url);
    return parsedData;
  } catch (error) {
    console.log(watchedState.status);
    watchedState.form.feedback = i18next.t('feedback.parsingError');
    watchedState.status = 'Error';
    throw error;
  }
};

const fetchRssFeed = (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
    .then((response) => {
      return response.data.contents;
    })
    .catch((error) => {
      throw i18next.t('feedback.networkError');
    });
};

 
  const validateForm = (data) => {
    const feedsUrls = state.feeds.map((feed) => feed.url);
    const validationSchema = 
    yup.string().notOneOf(feedsUrls, () => ({ key: 'alreadyAdded' })).url();
    return validationSchema.validate(data).then(() => {
      watchedState.form.feedback = null;
    }).catch((error) => {
      throw i18next.t(`feedback.${error.errors[0].key}`);
    });
  };

const checkNewItems = () => {
  setTimeout(() => {
  const feedsUrls = state.feeds.map((feed) => feed.url);
  feedsUrls.forEach((url) => {
    fetchRssFeed(url).then((xmlString) => {
      const newParsedData = parseRssFeedData(xmlString, url);
      const feedId = newParsedData.feed.id;
      const newItems = newParsedData.items;
      const addedItems = [];
      newItems.forEach((item) => {
        if (!state.items.some((obj)=> item.title === obj.title)) {
          item.feedId = feedId;
          addedItems.push(item);
        }
      })
      if (addedItems.length > 0) {
        watchedState.items = [ ...addedItems,...state.items, ];
      }
    })
  })
  checkNewItems()
  }, 5000)
}

document.querySelector(".rss-form").addEventListener("submit", (event) => {
  event.preventDefault();
  watchedState.status = 'Submit';
  console.log(watchedState.status);
  const data = new FormData(event.target);
  watchedState.form.url = data.get("url");

  watchedState.status = 'Validating';
  console.log(watchedState.status);

  validateForm(watchedState.form.url)
  .then(() => {
      watchedState.status = 'Fetching';
      console.log(watchedState.status);
      return fetchRssFeed(watchedState.form.url)
  })
  .then((xmlString) => {
    
    watchedState.status = 'Parsing';
    console.log(watchedState.status);

    const parsedData = parseRssFeedData(xmlString, watchedState.form.url);
    watchedState.feeds.push(parsedData.feed);
    watchedState.items = [...parsedData.items, ...state.items];
    watchedState.form.feedback = i18next.t('feedback.success');

    if (watchedState.feeds.length === 1) {
      checkNewItems();
    }

    watchedState.status = 'Success';
    console.log(watchedState.status);
  })
  .catch((error) => {
    watchedState.form.feedback = error;
    watchedState.status = 'Error';
    console.log(watchedState.status);
  });
});


