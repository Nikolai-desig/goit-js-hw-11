export function fetchGallery(name, count, page) {
    const URL = `https://pixabay.com/api/?key=34748521-ef54e554dfa85bd6668b4c463&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${count}&page=${page}`;
    
    return fetch(URL)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}