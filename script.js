$('.lightMode').css('display', 'none');

$(document).ready(() => {
    $('.darkMode').click(() => {
        $('body').addClass('mode-color');
        $('.lightMode').css('display', 'grid');
        $(this).css('display', 'none');
    });
    $('.lightMode').click(() => {
        $('.lightMode').css('display', 'none');
        $('body').removeClass('mode-color');
    });
    
    $('.darkModeApp').on('click', function(e) {
        e.preventDefault();
        $('body').addClass('mode-color');
        $('#sidebar').addClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content').addClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content .modal-header button').addClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content .modal-header .modal-title').addClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content form .modal-body input').addClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content form .modal-body textarea').addClass('mode-color');
        $('.header-container .col div .display-2').addClass('mode-color');
        $('.navbar .container-md .navbar-collapse').addClass('mode-color');
        $(this).removeClass('d-flex');
        $(this).addClass('d-none');
        $(this).next().removeClass('d-none');
        $(this).next().addClass('d-flex');
    });
    $('.lightModeApp').on('click', function(e) {
        e.preventDefault();
        $('body').removeClass('mode-color');
        $('#sidebar').removeClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content').removeClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content .modal-header button').removeClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content .modal-header .modal-title').removeClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content form .modal-body input').removeClass('mode-color');
        $('#project_section #main #top .modal .modal-dialog .modal-content form .modal-body textarea').removeClass('mode-color');
        $('.header-container .col div .display-2').removeClass('mode-color');
        $('.navbar .container-md .navbar-collapse').removeClass('mode-color');
        $(this).removeClass('d-flex');
        $(this).addClass('d-none');
        $(this).prev().removeClass('d-none');
        $(this).prev().addClass('d-flex');
    });
});


$(document).ready(function() {
    $(document).on('click', '.nav-link', function(e) {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });

    $('.navbar-toggler').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('collapsed')) {
            $('.navbar-collapse').css({
                'top': '50%',
                'height': '100%'
            });
        } else {
            $('.navbar-collapse').css({
                'top': '-50%'
            });
        }
    });
});

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const forms = document.forms;
const tagsAndList = {}

const createTag = forms[1];
createTag.addEventListener('submit', event => {
    event.preventDefault();
    
    const title = createTag['title'];
    const category = createTag['category'];
    const desc = createTag['description'];
    
    if (title.value.trim() != '') {
        
        const rand = generateString(5);
        tagsAndList[rand] = [title.value, category.value, desc.value, []];
        createTagSidebar(rand)
        createRecentTag(rand)

        const listContainer = document.getElementById('list_container');
        const completeListContainer = document.getElementById('complete_list_container');
        const listChild = listContainer.querySelectorAll('.list');
        const completeListChild = completeListContainer.querySelectorAll('.list');
        listChild.forEach(child => {
            listContainer.removeChild(child);
        });
        completeListChild.forEach(child => {
            completeListContainer.removeChild(child);
        });

        title.value = '';
        category.value = '';
        desc.value = '';
        
        const insertForm = document.getElementById('insert');
        insertForm.style.display = 'block';
    } else {
        return false;
    }
});

function editTag(event) {
    const parent_modal = document.querySelector('#editTagModal .modal-body');

    const tag = event.getAttribute('data-tag');
    const title = tagsAndList[tag][0];
    const category = tagsAndList[tag][1];
    const description = tagsAndList[tag][2];

    const modal_title = parent_modal.children[0].querySelector('input');
    const modal_category = parent_modal.children[1].querySelector('input');
    const modal_description = parent_modal.children[2].querySelector('textarea');
    modal_title.value = title;
    modal_category.value = category;
    modal_description.value = description;
}

const formEditTag = forms[0];
formEditTag.addEventListener('submit', event => {
    event.preventDefault();
    
    const title = formEditTag['title'];
    const category = formEditTag['category'];
    const description = formEditTag['description'];
    
    const tag = document.getElementById('recent_tag').getAttribute('data-tag');
    tagsAndList[tag][0] = title.value;
    tagsAndList[tag][1] = category.value;
    tagsAndList[tag][2] = description.value;

    createRecentTag(tag);
    updateSidebarTag(tag);

    $(event.currentTarget).parent().closest('.modal').modal('hide');
});

function createTagSidebar(rand) {
    const tags_container = document.getElementById('tags');
    const tag = document.getElementById('tag');
    const clone_tag = tag.cloneNode(true);

    const top = document.getElementById('recent_tag').parentElement;
    top.classList.remove('justify-content-md-end');
    top.classList.add('justify-content-between');

    const dataTag = tagsAndList[rand];

    $(createTag).parent().closest('.modal').modal('hide');
    $(clone_tag).removeClass('d-none');

    const tags = document.querySelectorAll('#tag');
    tags.forEach(tag => {
        tag.classList.remove('border-success');
    });

    clone_tag.querySelector('#title').textContent = dataTag[0];
    clone_tag.querySelector('#category').textContent = dataTag[1]
    clone_tag.setAttribute('data-tag', rand);
    clone_tag.setAttribute('onclick', 'chooseTag(this)');
    clone_tag.classList.add('border-success');

    tags_container.children[1].style.display = 'none';
    tags_container.append(clone_tag);
}

function createRecentTag(rand) {
    const recent = document.getElementById('recent_tag');
    recent.classList.remove('d-none');

    const dataTag = tagsAndList[rand];
    
    recent.setAttribute('data-tag', rand);
    
    const recent_title = recent.children[0].querySelector('#title');
    const recent_category = recent.children[0].querySelector('#category');
    
    recent_title.innerHTML = dataTag[0];
    recent_category.innerHTML = dataTag[1];
}

function updateSidebarTag(rand) {
    const dataTag = tagsAndList[rand];

    const tag = document.querySelector(`[data-tag='${rand}']`);
    const tag_title = tag.children[0].children[1].querySelector('#title');
    const tag_category = tag.children[0].children[1].querySelector('#category');
    
    tag_title.innerHTML = dataTag[0] ;
    tag_category.innerHTML = dataTag[1];
}


function chooseTag(event) {
    const tags = document.querySelectorAll('#tag');
    tags.forEach(tag => {
        tag.classList.remove('border-success');
    });
    
    event.classList.add('border-success');
    
    const recent = document.getElementById('recent_tag');
    recent.classList.remove('d-none');
    
    const title = event.children[0].children[1].querySelector('#title');
    const category = event.children[0].children[1].querySelector('#category');
    
    const recent_title = recent.children[0].querySelector('#title');
    const recent_category = recent.children[0].querySelector('#category');
    recent_title.innerHTML = title.textContent;
    recent_category.innerHTML = category.textContent;
    const rand = event.getAttribute("data-tag");
    recent.setAttribute('data-tag', rand);
    
    changeTag(rand)
}

const listContainer = document.getElementById('list_container');
const completeListContainer = document.getElementById('complete_list_container');
const listElement = listContainer.querySelector('.list');

function changeTag(tag) {
    const childLists = listContainer.querySelectorAll('.list');
    childLists.forEach(child => {
        listContainer.removeChild(child);
    });
    
    const childCompletedLists = completeListContainer.querySelectorAll('.list');
    childCompletedLists.forEach(child => {
        completeListContainer.removeChild(child);
    });
    
    const dataTag = tagsAndList[tag][3];
    const uncheckedLists = dataTag.filter(list => {
        return list.status === false;
    });

    uncheckedLists.forEach(cList => {
        const cloneList = listElement.cloneNode(true);
        cloneList.classList.remove('d-none');
        cloneList.children[1].querySelector('input').value = cList.list;
        checkList(cloneList)
        listContainer.append(cloneList);
    });
    
    const checkedLists = dataTag.filter(list => {
        return list.status === true;
    });

    checkedLists.forEach(cList => {
        const cloneList = listElement.cloneNode(true);
        cloneList.classList.remove('d-none');
        cloneList.children[1].querySelector('input').value = cList.list;
        checkList(cloneList)
        cloneList.children[0].querySelector('input').setAttribute('disabled', true);
        cloneList.style.backgroundColor = 'gainsboro';
        cloneList.children[0].querySelector('.checkmark').style.cursor = 'unset';
        
        const parentChild = cloneList.children[2];
        parentChild.className += ' flex-row-reverse';
        parentChild.removeChild(parentChild.children[0]);

        const checkmark = cloneList.children[0].children[0].children[1];
        checkmark.style.backgroundColor = 'rgb(77, 184, 148)';
        checkmark.className += ' active';

        const time = moment().format('MMMM Do YYYY, h:mm:ss a');
        const infoIcon = document.createElement('i');
        infoIcon.className = 'mdi mdi-information-outline fs-5';
        infoIcon.setAttribute('data-bs-target', 'tooltip');
        infoIcon.setAttribute('title', time);

        parentChild.append(infoIcon);
        completeListContainer.append(cloneList);
    });
}

const createList = forms[2];
const postIcon = createList.childNodes[1].querySelector('i');
const loader = createList.childNodes[1].querySelector('.custom-loader');

const input = document.getElementById('create_list_bar');
createList.addEventListener('submit', event => {
    event.preventDefault();

    const inputFilled = createList['create'];
    $(inputFilled).attr('disabled', true);
    
    if (inputFilled.value.trim() != '') {
        $(inputFilled).removeAttr('disabled');
        $(inputFilled).siblings().attr('disabled', true);
        $(postIcon).hide();
        $(loader).removeClass('d-none');
        setTimeout(() => {
            $(loader).addClass('d-none');
            const cloneList = listElement.cloneNode(true);
            cloneList.classList.remove('d-none');
            cloneList.querySelector('.col-lg-10').children[0].value = inputFilled.value;

            checkList(cloneList)

            listContainer.append(cloneList);
            input.value = '';

            $(postIcon).show();
            $(inputFilled).focus();
        }, 1000);

        const data = {
            list: inputFilled.value,
            status: false
        }
        
        const recent = document.getElementById('recent_tag').getAttribute('data-tag');
        tagsAndList[recent][3].push(data);
    } else {
        return false;
    }

});


function checkList(element) {
    const checkbox = element.children[0].querySelector('input');
    checkbox.addEventListener('click', event => {
        if (event.target.checked) {
            const element = $(event.target).closest('.list')[0];
            const audio = new Audio();
            audio.src = 'checked.mp3';
            audio.play();
            
            createCompleteList(element)

            const dataTag = document.getElementById('recent_tag').getAttribute('data-tag');
            const valueToChecked = $(event.currentTarget).closest('.col-2').next().children('input').val();
            const lists = tagsAndList[dataTag][3];

            let index = lists.indexOf(lists.find(item => item.list === valueToChecked));
            
            if (index !== -1) {
                const dataValue = lists.find(item => item.list === valueToChecked);
                dataValue.status = true;
            }

            element.remove();
        }
    });
}

function createCompleteList(element) {
    const completeContainer = document.getElementById("complete_list_container");

    const cloneElement = element.cloneNode(true);
    cloneElement.children[0].querySelector('input').setAttribute('disabled', true);
    cloneElement.style.backgroundColor = 'gainsboro';
    cloneElement.children[0].querySelector('.checkmark').style.cursor = 'unset';
    
    const parentChild = cloneElement.children[2];
    parentChild.className += ' flex-row-reverse';
    parentChild.removeChild(parentChild.children[0]);
    
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const infoIcon = document.createElement('i');
    infoIcon.className = 'mdi mdi-information-outline fs-5';
    infoIcon.setAttribute('data-bs-target', 'tooltip');
    infoIcon.setAttribute('title', time);

    parentChild.append(infoIcon);
    completeContainer.append(cloneElement);
}

function createListInput(event) {
    if (event.value.trim() != '') {
        $(event).siblings().removeAttr('disabled');
    } else {
        $(event).siblings().attr('disabled', true);
    }
}

let inputValue;

function editList(event) {
    const input = $(event).parent().prev().children('input');
    const valueToEdit = $(input).val();
    inputValue = valueToEdit;
    $(input).removeAttr('readonly', true);
    $(input).focus();

    $(event).addClass('d-none');
    $(event).next().removeClass('d-none');
}

function saveList(event) {
    const recent_tag = document.getElementById('recent_tag').getAttribute('data-tag');
    const valueToUpdate = $(event).parent().prev().children().val();
    const lists = tagsAndList[recent_tag][3];

    let index = lists.indexOf(lists.find(item => item.list === inputValue));
     
    if (index !== -1) {
        const dataValue = lists.find(item => item.list === inputValue);
        dataValue.list = valueToUpdate;
    }

    const input = $(event).parent().prev().children('input');
    $(input).attr('readonly', true);
    
    $(event).addClass('d-none');
    $(event).prev().removeClass('d-none');
}

function delList(event) {
    const recent_tag = document.getElementById('recent_tag').getAttribute('data-tag');
    const valueToDelete = $(event).parent().prev().children().val();
    const lists = tagsAndList[recent_tag][3];

    let index = lists.indexOf(lists.find(item => item.list === valueToDelete));
     
    if (index !== -1) {
        lists.pop(valueToDelete);
    }

    const container = $(event).closest('.list');
    $(container).remove();
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.left = '0px';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.left = '-800px';
}