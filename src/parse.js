import { v4 as uuidv4 } from 'uuid';

let id = 1;

const setId = () => id++;

const  parseRssFeed = (xmlString, url) => {
  const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml'); 
    const channel = xmlDoc.querySelector('channel');
    const rssItems = xmlDoc.querySelectorAll('item');
    const feedId =  setId();  
    const feed = {
        name: channel.querySelector('title').textContent,
        description: channel.querySelector('description').textContent,
        url : url,
        id: feedId,
    };
    const items = [];
  
    rssItems.forEach((item) => {
      const itemId = uuidv4();
      items.push({
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
        feedId,
      })
    });
    return { feed, items };
  }


  
  export default parseRssFeed;