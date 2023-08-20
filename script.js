
$(document).ready(() => {
    $('.darkModeApp').on('click', function(e) {
        e.preventDefault();
        $('body').addClass('mode-color');
        $(this).removeClass('d-flex');
        $(this).addClass('d-none');
        $(this).next().removeClass('d-none');
        $(this).next().addClass('d-flex');
    });
    $('.lightModeApp').on('click', function(e) {
        e.preventDefault();
        $('body').removeClass('mode-color');
        $(this).removeClass('d-flex');
        $(this).addClass('d-none');
        $(this).prev().removeClass('d-none');
        $(this).prev().addClass('d-flex');
    });
});


$(document).ready(function() {
    $(document).on('click', '.nav-link.ok', function(e) {
        $('.nav-link.ok').removeClass('active');
        $(this).addClass('active');
        $('.navbar-collapse').css({
            'top': '-50%'
        });
    });

    $('.navbar-toggler').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('collapsed')) {
            $('.navbar-collapse').css({
                'top': '50%',
                'height': '100%'
            });
            $(this).css('transform', 'rotate(180deg)');
        } else {
            $('.navbar-collapse').css({
                'top': '-50%'
            });
            $(this).css('transform', 'rotate(0deg)');
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
const tagAndList = {}
const tags_container = document.getElementById('tags');
 
const createTag = forms[1];

if (createTag != null) {
    createTag.addEventListener('submit', event => {
        event.preventDefault();

        tags_container.style.overflowY = 'scroll';
        
        const title = createTag['title'];
        const category = createTag['category'];
        const desc = createTag['description'];
        
        if (title.value.trim() != '') {
            
            const rand = generateString(5);
            tagAndList[rand] = [title.value, category.value, desc.value, []];
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
}

function editTag(event) {
    const parent_modal = document.querySelector('#editTagModal .modal-body');

    const tag = $(event).closest('#tag').data('tag');
    const title = tagAndList[tag][0];
    const category = tagAndList[tag][1];
    const description = tagAndList[tag][2];

    const modal_title = parent_modal.children[0].querySelector('input');
    const modal_category = parent_modal.children[1].querySelector('select');
    const modal_description = parent_modal.children[2].querySelector('textarea');
    modal_title.value = title;
    modal_category.value = category;
    modal_description.value = description;
}

const formEditTag = forms[0];
if (formEditTag != null) {
    formEditTag.addEventListener('submit', event => {
        event.preventDefault();
        
        const title = formEditTag['title'];
        const category = formEditTag['category'];
        const description = formEditTag['description'];
        
        const tag = document.getElementById('recent_tag').getAttribute('data-tag');
        tagAndList[tag][0] = title.value;
        tagAndList[tag][1] = category.value;
        tagAndList[tag][2] = description.value;
    
        createRecentTag(tag);
        updateSidebarTag(tag);
    
        $(event.currentTarget).parent().closest('.modal').modal('hide');
    });
}

function createTagSidebar(rand) {
    const tags_container = document.getElementById('tags');
    $(tags_container).children('#icon').remove();
    tags_container.style.overflowY = 'scroll';
    const tag = document.getElementById('tag');
    const clone_tag = tag.cloneNode(true);
    
    const dataTag = tagAndList[rand];

    $(createTag).parent().closest('.modal').modal('hide');
    $(clone_tag).removeClass('d-none');

    const tags = document.querySelectorAll('#tag');
    tags.forEach(tag => {
        tag.classList.remove('active');
    });

    clone_tag.querySelector('#title').textContent = dataTag[0];
    clone_tag.querySelector('#category').textContent = dataTag[1]
    clone_tag.setAttribute('data-tag', rand);
    clone_tag.classList.add('active');

    tags_container.prepend(clone_tag);
}


function createRecentTag(rand) {
    const recent = document.getElementById('recent_tag');
    recent.classList.remove('d-none');
    $(recent).prev('#notag').remove();

    const dataTag = tagAndList[rand];    

    recent.setAttribute('data-tag', rand);
    
    const recent_title = recent.querySelector('#title');
    const recent_category = recent.querySelector('#category');
    
    recent_title.innerHTML = dataTag[0];
    recent_category.innerHTML = dataTag[1];
}

function updateSidebarTag(rand) {
    const dataTag = tagAndList[rand];

    const tag = document.querySelector(`[data-tag='${rand}']`);
    const tag_title = tag.querySelector('#title');
    const tag_category = tag.querySelector('#category');
    
    tag_title.innerHTML = dataTag[0] ;
    tag_category.innerHTML = dataTag[1];
}

let latestTag;
function chooseTag(event) {
    document.getElementById('sidebar').classList.remove('active');
    const tags = document.querySelectorAll('#tag');
    const recent = document.getElementById('recent_tag');
    tags.forEach(tag => {
        tag.classList.remove('active');
    });

    $('#top').removeClass('justify-content-end');
    $('#top').addClass('justify-content-between');
    
    event.classList.add('active');
    
    recent.classList.remove('d-none');
    
    const title = event.querySelector('#title');
    const category = event.querySelector('#category');
    
    const recent_title = recent.querySelector('#title');
    const recent_category = recent.querySelector('#category');
    recent_title.innerHTML = title.textContent;
    recent_category.innerHTML = category.textContent;
    const rand = event.getAttribute("data-tag");
    recent.setAttribute('data-tag', rand);
    latestTag = rand;

    changeTag(rand)
}

const listContainer = document.getElementById('list_container');
const completeContainer = document.getElementById('complete_container');
const completeListContainer = document.getElementById('complete_list_container');
let listElement;
if (listContainer != null) {
    listElement = listContainer.querySelector('.list');
}

function clearList() {
    const childLists = listContainer.querySelectorAll('.list');
    childLists.forEach(child => {
        listContainer.removeChild(child);
    });
    
    const childCompletedLists = completeListContainer.querySelectorAll('.list');
    childCompletedLists.forEach(child => {
        completeListContainer.removeChild(child);
    });
}

function changeTag(tag) {
    clearList();
    const time = moment().calendar();

    const dataTag = tagAndList[tag][3];
    const uncheckedLists = dataTag.filter(list => {
        return list.status === false;
    });

    uncheckedLists.forEach(cList => {
        const cloneList = listElement.cloneNode(true);
        cloneList.classList.remove('d-none');
        cloneList.children[1].querySelector('input').value = cList.list;
        cloneList.querySelector('#timeline').innerHTML = `Created: ${time}`;
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
        cloneList.querySelector('input').setAttribute('disabled', true);
        cloneList.querySelector('.checkmark').style.cursor = 'unset';

        const checkmark = cloneList.children[0].children[0].children[1];
        checkmark.style.backgroundColor = 'rgb(77, 184, 148)';
        checkmark.className += ' active';

        cloneList.querySelector('#timeline').innerHTML = `Completed: ${time}`;

        completeListContainer.prepend(cloneList);
    });
}

const createList = forms[2];
let postIcon;
let loader;
if (createList != null) {
    postIcon = createList.childNodes[1].querySelector('i');
    loader = createList.childNodes[1].querySelector('.custom-loader');
}
const input = document.getElementById('create_list_bar');
if (createList != null) {
    createList.addEventListener('submit', event => {
        event.preventDefault();
        
        const inputFilled = createList['create'];
        $(inputFilled).attr('disabled', true);
        
        if (inputFilled.value.trim() != '') {
            $(inputFilled).removeAttr('disabled');
            $(inputFilled).siblings().attr('disabled', true);
            $(postIcon).hide();
            $(loader).removeClass('d-none');
            const time = moment().calendar();
            setTimeout(() => {
                $(loader).addClass('d-none');
                const cloneList = listElement.cloneNode(true);
                cloneList.querySelector('.col-lg-10').querySelector('input').value = inputFilled.value;
                cloneList.querySelector('#timeline').innerHTML = `Created: ${time}`;
    
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
            tagAndList[recent][3].push(data);
        } else {
            return false;
        }
    
    });
}

function checkList(element) {
    const checkbox = element.querySelector('input');
    checkbox.addEventListener('click', event => {
        if (event.target.checked) {
            const element = $(event.target).closest('.list')[0];
            const audio = new Audio();
            audio.src = 'checked.mp3';
            audio.play();
            
            createCompleteList(element)

            const dataTag = document.getElementById('recent_tag').getAttribute('data-tag');
            const valueToChecked = $(event.currentTarget).closest('.col-2').next().children().children('input').val();
            const lists = tagAndList[dataTag][3];

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
    const completeListContainer = document.getElementById("complete_list_container");
    completeContainer.classList.add('border-top');
    
    const cloneElement = element.cloneNode(true);
    cloneElement.querySelector('input').setAttribute('disabled', true);
    cloneElement.querySelector('.checkmark').style.cursor = 'unset';
    const parentCheckmark = cloneElement.children[0].children[0];
    parentCheckmark.removeAttribute('title');
    parentCheckmark.setAttribute('title', 'Checked!');
    
    const time = moment().calendar();
    cloneElement.querySelector('#timeline').innerHTML = `Completed: ${time}`;

    completeListContainer.prepend(cloneElement);
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
    const input = $(event).parent().prev().children().children('input');
    const valueToEdit = $(input).val();
    inputValue = valueToEdit;
    $(input).removeAttr('readonly', true);
    $(input).focus();

    $(event).addClass('d-none');
    $(event).next().removeClass('d-none');
}

function saveList(event) {
    const recent_tag = document.getElementById('recent_tag').getAttribute('data-tag');
    const valueToUpdate = $(event).parent().prev().children().children('input').val();
    const lists = tagAndList[recent_tag][3];

    let index = lists.indexOf(lists.find(item => item.list === inputValue));
     
    if (index !== -1) {
        const dataValue = lists.find(item => item.list === inputValue);
        dataValue.list = valueToUpdate;
    }

    const input = $(event).parent().prev().children().children('input');
    $(input).attr('readonly', true);
    
    $(event).addClass('d-none');
    $(event).prev().removeClass('d-none');
}

function delList(event) {
    const recent_tag = document.getElementById('recent_tag').getAttribute('data-tag');
    const valueToDelete = $(event).parent().prev().children().children('input').val();
    const lists = tagAndList[recent_tag][3];

    let index = lists.indexOf(lists.find(item => item.list === valueToDelete));
     
    if (index !== -1) {
        lists.pop(valueToDelete);
    }

    const container = $(event).closest('.list');
    $(container).remove();
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
}

function deleteTag(event) {
    const tag = $(event).closest('#tag').data('tag');

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-danger shadow-none',
          cancelButton: 'btn btn-secondary shadow-none'
        },
        buttonsStyling: false
    });
      
    swalWithBootstrapButtons.fire({
        icon: 'warning',
        text: "Are you sure ?",
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Delete it!'
      }).then((result) => {
            if (result.isConfirmed) {
                delete tagAndList[tag];
                $(event).closest('#tag').remove();
                $('#recent_tag').addClass('d-none');
                $('#top').removeClass('justify-content-between');
                $('#top').addClass('justify-content-end');
                clearList();
            }
      });
}

function findTag(event) {
    const value = event.value.toLowerCase();
    
    const tagValues = Object.entries(tagAndList);
    const getValue = tagValues.map(tag => {
        return [tag[0], tag[1][0], tag[1][1]];
    });

    const matchingValue = getValue.filter(tag => {
        const tagValue = tag[1].toLowerCase();
        return tagValue.startsWith(value);
    });

    if (value.trim()) {
        displayTag(matchingValue)
    } else {
        displayTag(matchingValue)
    }
}

function resetTag() {
    const allTag = tags_container.querySelectorAll('#tag');
    const lastTag = allTag[allTag.length - 1];
    
    allTag.forEach(tag => {
        tags_container.removeChild(tag);
    });
    
    tags_container.prepend(lastTag); 
    
    return tags_container.children[0].cloneNode(true);
}

function displayTag(tags) {
    
    const clone_tag = resetTag();
    
    if (tags.length < 1 && Object.keys(tagAndList).length != 0) {
        clone_tag.classList.remove('d-none')
        clone_tag.querySelector('#title').innerHTML = 'No Tag Found!';
        clone_tag.removeAttribute('onclick');
        tags_container.insertAdjacentHTML('afterbegin', clone_tag.outerHTML);
    } else {
        tags.forEach(tag => {
            clone_tag.classList.remove('d-none')
            clone_tag.querySelector('#title').innerHTML = tag[1];
            clone_tag.querySelector('#category').innerHTML = tag[2];
            clone_tag.setAttribute('data-tag', tag[0]);
            const dataTag = latestTag != undefined ? latestTag : $('#recent_tag').data('tag');
            if (clone_tag.getAttribute('data-tag') !== dataTag) {
                clone_tag.classList.remove('active');
            } else {
                clone_tag.classList.add('active');
            }
            tags_container.insertAdjacentHTML('afterbegin', clone_tag.outerHTML);
        });
    }
}

const stars = document.querySelectorAll('.star_rating');
stars.forEach(star => {
    star.addEventListener('click', e => {
        e.preventDefault();

        const element = $(e.currentTarget);
        $(element).addClass('active');
        $(element).prevAll().addClass('active');
        $(element).nextAll().removeClass('active');
    });
});
