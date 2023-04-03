import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import axios from 'axios';


const refs = {
    searchFieald: document.querySelector('.search-form'),
    galleryBox: document.querySelector('.gallery-box'),
    searchButton: document.querySelector('.search-button'),
    searchInput: document.querySelector('.search-input'),
    loadMoreButton: document.querySelector('.load-more-button')
};
let countImages = 40;
let page = 1;
let totalNumber = 0;

refs.searchButton.addEventListener('click', onSearch);
refs.loadMoreButton.addEventListener('click', loadMore);
refs.searchInput.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        onSearch(e);
    }
});

async function renderGallery(name, count, page) {
    const URL = `https://pixabay.com/api/?key=34748521-ef54e554dfa85bd6668b4c463&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${count}&page=${page}`;
    
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function onSearch(evt) {
    page = 1;
    refs.galleryBox.innerHTML = '';
    evt.preventDefault();
    totalNumber = 0;
    try {
        const response = await renderGallery(refs.searchInput.value, countImages, page);
        showSuccessMessage(response.data.totalHits);
        createGallery(response.data.hits, response.data.total, response.data.totalHits);
        lightbox.refresh();
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

function showSuccessMessage(totalhits) {
    if (totalhits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalhits} images.`)
    };   
}

function loadMore() {
    renderGallery(refs.searchInput.value, countImages, page)
        .then(response => {
            createGallery(response.data.hits, response.data.total, response.data.totalHits)
            lightbox.refresh();
        })
        .catch(error => {
            console.error(error);
        });
};

function createGallery(images, total, totalhits) {
    if (images.length) {
        refs.loadMoreButton.classList.remove('not-visible-button');
        page += 1;
        totalNumber += images.length;
    } else {
        refs.loadMoreButton.classList.add('not-visible-button')
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };
    
    if (totalNumber === total && totalNumber > 0) {
        refs.loadMoreButton.classList.add('not-visible-button')
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    }
    const containers = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <li class="image-item"><a class="gallery__item" href="${largeImageURL}"><img class="gallery__image" loading="lazy" srcset="${webformatURL}" alt="${tags}"/></a>
        <div class="info">
            <div class="info-item">
                <b>Likes</b>
                <p>${likes}</p>
            </div>
            <div class="info-item">
                <b>Views</b>
                <p>${views}</p>
            </div>
            <div class="info-item">
                <b>Comments</b>
                <p>${comments}</p>
            </div>
            <div class="info-item">
                <b>Downloads</b>
                <p>${downloads}</p>
            </div>
    </div>
    </li>
    `;
    })
    .join('');
    refs.galleryBox.insertAdjacentHTML('beforeend', containers)    
}

const lightbox = new SimpleLightbox('.gallery__item', {captionsData: 'alt', captionDelay: 250 });

// function onSearch(e) {
//     page = 1;
//     refs.galleryBox.innerHTML = '';
//     e.preventDefault();
//     totalNumber = 0;
//     fetchGallery(refs.searchInput.value, countImages, page)
//         .then(response => {
//             showSuccessMessage(response.totalHits)
//             createGallery(response.hits, response.total, response.totalHits)
//             lightbox.refresh();
//             console.log(response)
//         })
// }

// function showSuccessMessage(totalhits) {
//     if (totalhits > 0) {
//         Notiflix.Notify.success(`Hooray! We found ${totalhits} images.`)
//     };   
// }

// function loadMore() {
//     fetchGallery(refs.searchInput.value, countImages, page)
//         .then(response => {
//             createGallery(response.hits, response.total, response.totalHits)
//             lightbox.refresh();
//         })
// };
