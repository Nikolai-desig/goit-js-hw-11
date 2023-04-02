import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchGallery } from "./fechGallery";


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

function onSearch(e) {
    page = 1;
    refs.galleryBox.innerHTML = '';
    e.preventDefault();
    totalNumber = 0;
    fetchGallery(refs.searchInput.value, countImages, page)
        .then(response => {
            showSuccessMessage(response.totalHits)
            createGallery(response.hits, response.total, response.totalHits)
            lightbox.refresh();
            console.log(response)
        })
}

function showSuccessMessage(totalhits) {
    if (totalhits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalhits} images.`)
    };   
}

function loadMore() {
    fetchGallery(refs.searchInput.value, countImages, page)
        .then(response => {
            createGallery(response.hits, response.total, response.totalHits)
            lightbox.refresh();
        })
        // .catch(error => {
        // refs.loadMoreButton.classList.add('not-visible-button')
        // Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        // });
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

