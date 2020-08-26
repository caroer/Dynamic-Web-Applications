const nav = document.querySelector('nav');
const list = nav.querySelector('ul');
const listElements = Array.from(list.children);


const editMenu = (breakPoint) => {
    // If the media query matches the drop down menu shall be created
    if (breakPoint.matches) { 
        list.style.display = 'block';
        
        while (Array.from(list.children).length > 1) {
            list.removeChild(list.lastChild);
        }

        createDropDownIcon();
        const dropDownLink = list.querySelector('.dropDownLink')
        const dropDownMenu = list.querySelector('.dropDownMenu')
        dropDownLink.addEventListener('click', popUpEffect);
        
        dropDownLink.addEventListener('mouseover', popUpEffect);
        dropDownMenu.addEventListener('mouseover', popUpEffect);
        dropDownMenu.addEventListener('mouseout', disappearEffect);
    } 

    // If the window width gets larger than 1000px again
    else {
        if (list.querySelector('.dropDownLink')) {
            var dropDownLink = list.querySelector('.dropDownLink');
            dropDownLink.parentNode.removeChild(dropDownLink);
            
            for (let index = 1; index < listElements.length; index++) {
                list.appendChild(listElements[index]);
            }
            list.style.margin = '0';
            list.style.display = 'block';
            list.style.justifyContent = 'none';
            list.style.display = 'flex';
            list.style.justifyContent = 'space-around';
        } 
    }
}

const appendLinks = () => {
    var listElement = document.createElement('li');

}

const createDropDownIcon = () => {
    const dropDown = document.createElement('li');
    //dropDown.classList.add('dropDownIcon');
    const a = document.createElement('a');
    a.classList.add('dropDownLink');

    // The relative path changes depending on which html site one is at.
    if (document.URL.slice(-10) == 'index.html'){
        a.innerHTML = '<img src="img/hamburgerButton.png">';
    }
    else {
        a.innerHTML = '<img src="../img/hamburgerButton.png">';
    }
    
    dropDown.appendChild(a);

    list.appendChild(dropDown);
    list.style.display = 'flex';
    list.style.justifyContent = 'space-between';
    list.style.margin = '0 1rem';

    const div = createMenu();
    dropDown.appendChild(div);
}

const createMenu = () => {
    const dropDownDiv = document.createElement('div');
    dropDownDiv.style.display = 'none';
    dropDownDiv.classList.add('dropDownMenu');

    const ul = document.createElement('ul');
    ul.classList.add('dropDownList');
    const hrefList = ['historia', 'gasthamn', 'turistmal', 'medlemsinfo', 'kontakt', 'english'];

    for (let index = 1; index < listElements.length; index++) {
        const listElement = document.createElement('li');
        listElement.classList.add('listElement');
        const link = document.createElement('a');
        listElement.classList.add('link');
        link.innerHTML = listElements[index].firstChild.innerHTML;

        // The relative path changes depending on which html site one is at.
        if (document.URL.slice(-10) == 'index.html'){
            link.href = 'html/' + hrefList[index - 1] + '.html';
        }
        else {
            link.href = '../html/' + hrefList[index - 1] + '.html';
        }
    
        listElement.appendChild(link);
        ul.appendChild(listElement);
    }

    dropDownDiv.appendChild(ul);
    return dropDownDiv
}

/* const createButton = (dropDownDiv) => {
    const button = document.createElement('button');
    button.classList.add('closeButton');
    button.style.background = 'url(../img/closeButton.png) no-repeat center';
    //button.style.objectFit = 'cover';
    button.style.position = 'absolute';
    button.style.right = '5px';
    button.style.backgroundSize = 'cover';
    button.style.border = 'none';
    button.style.zIndex = '1';
    button.style.marginTop = '0.4rem';
    button.style.padding = '1rem';
    button.addEventListener('mouseover', e => { 
        button.style.cursor = 'pointer'; 
        button.style.borderBottom = 'white thin solid';
    })
    button.addEventListener('mouseout', e => { 
        button.style.cursor = 'none'; 
        button.style.borderBottom = 'none';
    })

    dropDownDiv.appendChild(button);
    
} */

const popUpEffect = () => {
    const dropDownMenu = document.querySelector('.dropDownMenu');
    const dropDownList = document.querySelector('.dropDownList');
    const listElements = document.querySelectorAll('.listElement');
    const dropDownLink = document.querySelector('.dropDownLink');

    // Style the entire div
    dropDownMenu.style.display = 'block';
    dropDownMenu.style.position = 'absolute';
    dropDownMenu.style.right = '0';
    dropDownMenu.style.top = '0';
    dropDownMenu.style.zIndex = '-1';
    dropDownMenu.style.margin = '0rem';
    dropDownMenu.style.background = 'rgba(128, 128, 128, 0.98)';
    dropDownMenu.style.borderRadius = '0 0 0 10px';

    // Style the un-ordered list
    dropDownList.style.display = 'block';
    dropDownList.style.padding = '2rem';

    // Style the list elements
    listElements.forEach(element => {
        element.style.padding = '1.5rem 1.5rem 1.5rem 0';
        element.style.marginRight = '2rem';
        element.style.borderBottom = 'dotted white thin';
        element.style.textAlign = 'left';
    })
    listElements[listElements.length - 1].style.borderBottom = 'none';
    listElements[0].style.paddingTop = '3rem';
    
    // Remove the border around the hamburger button link
    dropDownLink.style.border = 'none';
}

const disappearEffect = () => {
    const dropDownMenu = document.querySelector('.dropDownMenu');
    dropDownMenu.style.display = 'none';
}


// The breakpoint for when to change the navigation menu
var breakPoint = window.matchMedia("(max-width: 1000px)");

editMenu(breakPoint) // Call listener function at run time
breakPoint.addListener(editMenu) // Attach listener function on state changes



