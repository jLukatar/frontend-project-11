import { v4 as uuidv4 } from 'uuid';


const  parseRssFeed = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const channel = xmlDoc.querySelector('channel');
    const items = xmlDoc.querySelectorAll('item');
    const feedId = uuidv4();
    const feeds = {
      [feedId]: {
        name: channel.querySelector('title').textContent,
        description: channel.querySelector('description').textContent,
        url: channel.querySelector('link').textContent,
        id: feedId,
      }
    };
    const itemsObj = {};
  
    items.forEach((item) => {
      const itemId = uuidv4();
      itemsObj[itemId] = {
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
        feedId,
        itemId
      }
    });
  
    return { feeds, items: itemsObj };
  }


  
  export default parseRssFeed;