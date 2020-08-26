const track = document.querySelector('.carousel_track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel_button--right');
const prevButton = document.querySelector('.carousel_button--left');
const dotsNav = document.querySelector('.carousel_nav');
const dots = Array.from(dotsNav.children);
const transpArea = document.querySelector('.transparentArea');

// To get the width of the slides
const slideWidth = slides[0].getBoundingClientRect().width;

// Arrange the slides next to one another
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
};

slides.forEach(setSlidePosition);


// Move to a specific slide
const moveToSlide = (currentSlide, targetSlide) => {
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('currentSlide');
    targetSlide.classList.add('currentSlide');
}

const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('currentSlide');
    targetDot.classList.add('currentSlide');
}

const hideShowArrows = (prevButton, nextButton, targetIndex) => {
    if (targetIndex === 0) {
        prevButton.classList.add('isHidden');
        nextButton.classList.remove('isHidden');

        transpArea.classList.remove('transparentLeft');
        transpArea.classList.remove('transparentBoth');
        transpArea.classList.add('transparentRight');
    } else if (targetIndex === slides.length - 1) {
        prevButton.classList.remove('isHidden');
        nextButton.classList.add('isHidden');

        transpArea.classList.add('transparentLeft');
        transpArea.classList.remove('transparentBoth');
        transpArea.classList.remove('transparentRight');
    } else {
        prevButton.classList.remove('isHidden');
        nextButton.classList.remove('isHidden');

        transpArea.classList.remove('transparentLeft');
        transpArea.classList.add('transparentBoth');
        transpArea.classList.remove('transparentRight');
    }
}

// Move slides to the left
prevButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.currentSlide');
    const prevSlide = currentSlide.previousElementSibling;
    const currentDot = dotsNav.querySelector('.currentSlide');
    const prevDot = currentDot.previousElementSibling;
    const prevIndex = slides.findIndex(slide => slide === prevSlide);

    moveToSlide(currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
    hideShowArrows(prevButton, nextButton, prevIndex);
})

// Move slides to the right
nextButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.currentSlide');
    const nextSlide = currentSlide.nextElementSibling;
    const currentDot = dotsNav.querySelector('.currentSlide');
    const nextDot = currentDot.nextElementSibling;
    const nextIndex = slides.findIndex(slide => slide === nextSlide);

    moveToSlide(currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
    hideShowArrows(prevButton, nextButton, nextIndex);
})

dotsNav.addEventListener('click', e => {
    // What indicator was clicked on?
    const targetDot = e.target.closest('button');
    
    // targetDot is 'null' when the user does not click directly on a button
    if (!targetDot) return;

    const currentSlide = track.querySelector('.currentSlide');
    const currentDot = dotsNav.querySelector('.currentSlide');
    // Finding the index of the target dot in the 'dots'-array
    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];

    moveToSlide(currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
    hideShowArrows(prevButton, nextButton, targetIndex);
})

