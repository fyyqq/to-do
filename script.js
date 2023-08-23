
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
const insertForm = document.getElementById('insert');
const completeListContainer = document.getElementById('complete_list_container');
 
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
            tagAndList[rand] = [title.value, category.value, desc.value, [], false];
            const existingData = localStorage.getItem('data');
            const checkExistingData = existingData ? JSON.parse(existingData) : {};
            const combineData = {...checkExistingData, ...tagAndList}
            localStorage.setItem('data', JSON.stringify(combineData));
            createTagSidebar(rand)
            createRecentTag(rand)

            const listContainer = document.getElementById('list_container');
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
            
            $(insertForm).show();
        } else {
            return false;
        }
    });
}

function editTag(event) {
    const parent_modal = document.querySelector('#editTagModal .modal-body');

    const tag = $(event).closest('#tag').data('tag');
    const data = JSON.parse(localStorage.getItem('data'));
    const title = data[tag][0];
    const category = data[tag][1];
    const description = data[tag][2];

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
        
        const data = JSON.parse(localStorage.getItem('data'));
        const dataEntries = Object.entries(data);
        for (const item of dataEntries) {
            if (item[1][4] ) {
                item[1][0] = title.value;
                item[1][1] = category.value;
                item[1][2] = description.value;
                createRecentTag(item[0]);
                const tag = document.querySelector(`[data-tag='${item[0]}']`);
                tag.querySelector('#title').innerHTML = title.value;
                tag.querySelector('#category').innerHTML = category.value;

                const recent_tag = document.getElementById('recent_tag');
                recent_tag.querySelector('#title').innerHTML = title.value;
                recent_tag.querySelector('#category').innerHTML = category.value;

                localStorage.setItem('data', JSON.stringify(data));
            }
        }
    
        $(event.currentTarget).parent().closest('.modal').modal('hide');
    });
}

function createTagSidebar(rand) {
    const tags_container = document.getElementById('tags');
    $(tags_container).children('#icon').addClass('d-none');
    tags_container.style.overflowY = 'scroll';
    const tag = document.getElementById('tag');
    const clone_tag = tag.cloneNode(true);
    
    const dataTag = JSON.parse(localStorage.getItem('data'))[rand];

    $(createTag).parent().closest('.modal').modal('hide');
    $(clone_tag).removeClass('d-none');

    const tags = document.querySelectorAll('#tag');
    tags.forEach(tag => {
        tag.classList.remove('active');
    });

    const dataStorage = JSON.parse(localStorage.getItem('data'));

    for (const key in dataStorage) {
        dataStorage[key][4] = false;
    }

    dataStorage[rand][4] = true;
    localStorage.setItem('data', JSON.stringify(dataStorage));

    clone_tag.querySelector('#title').textContent = dataTag[0];
    clone_tag.querySelector('#category').textContent = dataTag[1]
    clone_tag.setAttribute('data-tag', rand);
    clone_tag.classList.add('active');

    tags_container.prepend(clone_tag);
}

const noTag = $('#notag');

function createRecentTag(rand) {
    const recent = document.getElementById('recent_tag');
    recent.classList.remove('d-none');
    $(noTag).hide();

    const dataTag = JSON.parse(localStorage.getItem('data'))[rand];

    recent.setAttribute('data-tag', rand);
    
    const recent_title = recent.querySelector('#title');
    const recent_category = recent.querySelector('#category');
    
    recent_title.innerHTML = dataTag[0];
    recent_category.innerHTML = dataTag[1];
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
    const dataTag = event.getAttribute('data-tag');
    const dataStorage = JSON.parse(localStorage.getItem('data'));

    for (const key in dataStorage) {
        dataStorage[key][4] = false;
    }

    dataStorage[dataTag][4] = true;
    localStorage.setItem('data', JSON.stringify(dataStorage));
    
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

    $(noTag).hide();

    changeTag(rand)
}

const listContainer = document.getElementById('list_container');
const completeContainer = document.getElementById('complete_container');
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

    const dataTag = JSON.parse(localStorage.getItem('data'))[tag][3];
    const uncheckedLists = dataTag.filter(list => {
        return list.status === false;
    });

    uncheckedLists.forEach(cList => {
        const clone_list = listElement.cloneNode(true);
        clone_list.classList.remove('d-none');
        clone_list.children[1].querySelector('input').value = cList.list;
        clone_list.querySelector('#timeline').innerHTML = `Created: ${cList.startTime}`;
        checkList(clone_list)
        listContainer.append(clone_list);
    });
    
    const checkedLists = dataTag.filter(list => {
        return list.status === true;
    });

    checkedLists.forEach(cList => {
        const clone_list = listElement.cloneNode(true);
        clone_list.classList.remove('d-none');
        clone_list.children[1].querySelector('input').value = cList.list;
        clone_list.children[1].querySelector('#timeline').innerHTML = `Completed: ${cList.startTime}`;
        checkList(clone_list)
        clone_list.querySelector('input').setAttribute('disabled', true);
        clone_list.querySelector('.checkmark').style.cursor = 'unset';
        clone_list.querySelector('.container-checkbox').setAttribute('title', 'Checked');
        clone_list.querySelector('.container-checkbox').classList.add('active');

        const checkmark = clone_list.children[0].children[0].children[1];
        checkmark.style.backgroundColor = 'rgb(77, 184, 148)';
        checkmark.className += ' active';

        completeListContainer.prepend(clone_list);
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
                const clone_list = listElement.cloneNode(true);
                clone_list.classList.remove('d-none');
                clone_list.querySelector('.col-lg-10').querySelector('input').value = inputFilled.value;
                clone_list.querySelector('#timeline').innerHTML = `Created: ${time}`;
    
                checkList(clone_list)
    
                listContainer.append(clone_list);
                input.value = '';
    
                $(postIcon).show();
                $(inputFilled).focus();
            }, 1000);
    
            const data = {
                list: inputFilled.value,
                status: false,
                startTime: time,
                endTime: null
            }
            
            const dataTaglist = JSON.parse(localStorage.getItem('data'));
            const dataObj = Object.entries(dataTaglist);
            for (const item of dataObj) {
                const value = item[1][4];
                if (value ) {
                    const dataId = item[0];
                    dataTaglist[dataId][3].push(data);
                    localStorage.setItem('data', JSON.stringify(dataTaglist));
                }
            }
            
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
            const time = moment().calendar();
            
            const dataTag = JSON.parse(localStorage.getItem('data'));
            const valueToChecked = $(event.currentTarget).closest('.col-2').next().children().children('input').val();
            const dataEntries = Object.entries(dataTag);
            for (const item of dataEntries) {
                if (item[1][4] ) {
                    const lists = item[1][3];
                    
                    let index = lists.indexOf(lists.find(item => item.list === valueToChecked));
                    
                    if (index !== -1) {
                        const dataValue = lists.find(item => item.list === valueToChecked);
                        dataValue.endTime = time;
                        dataValue.status = true;
                        localStorage.setItem('data', JSON.stringify(dataTag));
                    }
                    const timeline = lists.find(item => item.list === valueToChecked).endTime;
                    createCompleteList(element, timeline)
                }
            }
            element.remove();
        }
    });
}

function createCompleteList(element, time) {
    const cloneElement = element.cloneNode(true);
    cloneElement.querySelector('input').setAttribute('disabled', true);
    cloneElement.querySelector('.checkmark').style.cursor = 'unset';
    cloneElement.querySelector('.container-checkbox').setAttribute('title', 'Checked');
    
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
    const valueToUpdate = $(event).parent().prev().children().children('input').val();
    const dataObj = JSON.parse(localStorage.getItem('data'));
    const dataEntries = Object.entries(dataObj);
    for (const item of dataEntries) {
        if (item[1][4] ) {
            const lists = item[1][3];
            let index = lists.indexOf(lists.find(item => item.list === inputValue));
                
            if (index !== -1) {
                const dataValue = lists.find(item => item.list === inputValue);
                dataValue.list = valueToUpdate;
                localStorage.setItem('data', JSON.stringify(dataObj));
            }
        }
    }

    const input = $(event).parent().prev().children().children('input');
    $(input).attr('readonly', true);
    
    $(event).addClass('d-none');
    $(event).prev().removeClass('d-none');
}

function delList(event) {
    const valueToDelete = $(event).parent().prev().children().children('input').val();
    const dataObj = JSON.parse(localStorage.getItem('data'));
    const dataEntries = Object.entries(dataObj);
    for (const item of dataEntries) {
        if (item[1][4] ) {
            const lists = item[1][3];

            let index = lists.indexOf(lists.find(item => item.list === valueToDelete));
             
            if (index !== -1) {
                for (let i = 0; i < lists.length; i++) {
                    if (lists[i].list === valueToDelete) {
                        lists.splice(i, 1);
                        break;
                    }
                }
                localStorage.setItem('data', JSON.stringify(dataObj));
                const container = $(event).closest('.list');
                $(container).remove();
            }
        }
    }
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
            const data = JSON.parse(localStorage.getItem('data'));
            delete data[tag];
            localStorage.setItem('data', JSON.stringify(data));
            $(event).closest('#tag').remove();
            $('#recent_tag').addClass('d-none');
            $('#top').removeClass('justify-content-between');
            $('#top').addClass('justify-content-end');
            clearList();
            $(insertForm).hide();
            if (Object.keys(data).length < 1) {
                $(noTag).text('No tag exists!').show();
                $('#icon').removeClass('d-none');
            } else {
                $(noTag).text('No tag selected!').show();
            }
        }
    });
}

function findTag(event) {
    const value = event.value.toLowerCase();
    
    const data = JSON.parse(localStorage.getItem('data'));
    const tagValues = Object.entries(data);
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
    const data = JSON.parse(localStorage.getItem('data'));
    
    if (tags.length < 1 && Object.keys(data).length != 0) {
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

const recent = document.getElementById('recent_tag');
const tag = document.getElementById('tag');
const storageData = localStorage.getItem('data')

if (storageData !== null) {
    const dataTaglist = Object.entries(JSON.parse(storageData));
    if (dataTaglist.length > 0) {
        $('#icon').addClass('d-none');
        $(noTag).hide();
        $(insertForm).show();
        $(recent).removeClass('d-none');
    }
    // Display Tag
    dataTaglist.forEach(data => {
        const clone_tag = tag.cloneNode(true);
        (data[1][4]) ? clone_tag.classList.add('active') : '';
        clone_tag.classList.remove('d-none');
        clone_tag.setAttribute('data-tag', data[0]);
        clone_tag.querySelector('#title').innerHTML = data[1][0];
        clone_tag.querySelector('#category').innerHTML = data[1][1];
        document.getElementById('tags').prepend(clone_tag);
    });
    for (const item of dataTaglist) {
        const activeTag = item[1][4];
        if (activeTag) {
            const dataLists = item[1][3];
            // Display Unchecked List
            const filteringUncheckedLists = dataLists.filter(dt => {
                return dt.status === false;
            });
            filteringUncheckedLists.forEach(unList => {
                const clone_list = listElement.cloneNode(true);
                clone_list.classList.remove('d-none');
                clone_list.querySelector('.col-lg-10').querySelector('input').value = unList.list;
                clone_list.querySelector('#timeline').innerHTML = `Created: ${unList.startTime}`;
                checkList(clone_list)
                listContainer.append(clone_list);
            });
            // Display checked List
            const filteringCheckedLists = dataLists.filter(dt => {
                return dt.status === true;
            });
            filteringCheckedLists.forEach(list => {
                const clone_list = listElement.cloneNode(true);
                clone_list.classList.remove('d-none');
                clone_list.querySelector('.col-lg-10').querySelector('input').value = list.list;
                clone_list.querySelector('#timeline').innerHTML = `Completed: ${list.endTime}`;
                clone_list.querySelector('.checkmark').style.cursor = 'unset';
                clone_list.querySelector('.container-checkbox').setAttribute('title', 'Checked');
                clone_list.querySelector('.container-checkbox').classList.add('active');
                completeListContainer.prepend(clone_list);
            });
            // Display Recent Tag
            recent.setAttribute('data-tag', item[0]);
            recent.querySelector('#title').innerHTML = item[1][0];
            recent.querySelector('#category').innerHTML = item[1][1];
        }
    }
}
