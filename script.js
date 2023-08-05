$('.lightMode').css('display', 'none');

$(document).ready(() => {
    $('.darkMode').click(() => {
        $('body').addClass('mode-color');
        $('.lightMode').css('display', 'grid');
        $(this).css('display', 'none');
    });
});

$(document).ready(() => {
    $('.lightMode').click(() => {
        $('body').removeClass('mode-color');
        $('.lightMode').css('display', 'none');
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

    $(window).scroll(function() {
        const scrollY = $(this).scrollTop();
        const navbar = $('.navbar');
        
        if (scrollY > 60) {
            $(navbar).addClass('fixed-top');
            $(navbar).addClass('shadow-sm');
            $(navbar).css({
                "background-color" : "#fff"
            });
            $(navbar).children().addClass('py-1');
        } else {
            $(navbar).removeClass('fixed-top');
            $(navbar).removeClass('shadow-sm');
            $(navbar).children().removeClass('py-1');
            $(navbar).css({
                "background-color" : "transparent"
            });
        }
    });
});

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const rand = generateString(5);

const tagsAndList = {}

const forms = document.forms;

const createTag = forms[0];
createTag.addEventListener('submit', event => {
    event.preventDefault();
    
    const title = createTag['title'];
    const category = createTag['category'];
    const desc = createTag['description'];
    
    if (title.value.trim() != '') {
        
        createTagSidebar(title, category)
        showTag(title, category)

        title.value = '';
        category.value = '';
        desc.value = '';
        
        $('#insert').show();
        
    } else {
        return false;
    }
});

function createTagSidebar(title, category, description) {
    const tags_container = document.getElementById('tags');
    const tag = document.getElementById('tag');
    const clone_tag = tag.cloneNode(true);
    $(createTag).parent().closest('.modal').modal('hide');
    $(clone_tag).removeClass('d-none');
    clone_tag.querySelector('#title').textContent = title.value;
    clone_tag.querySelector('#category').textContent = category.value;
    clone_tag.setAttribute('data-tag', rand);
    tags_container.children[1].style.display = 'none';
    tags_container.append(clone_tag);

    chooseTag()
}

function chooseTag() {
    const tags = document.querySelectorAll('#tag');
    tags.forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();
            
            const choose = event.currentTarget;            
            
            const recent = document.getElementById('recent_tag');
            recent.classList.remove('d-none');

            const title = choose.children[0].children[1].querySelector('#title');
            const category = choose.children[0].children[1].querySelector('#category');

            const recent_title = recent.children[1].querySelector('#title');
            const recent_category = recent.children[1].querySelector('#category');
            recent_title.innerHTML = title.textContent;
            recent_category.innerHTML = category.textContent;
        });
    });
}

function showTag(title, category) {
    const recent = document.getElementById('recent_tag');
    recent.classList.remove('d-none');

    const recent_title = recent.children[1].querySelector('#title');
    const recent_category = recent.children[1].querySelector('#category');
    
    recent_title.innerHTML = title.value;
    recent_category.innerHTML = category.value;
}

const listContainer = document.getElementById('list_container');
const listElement = document.querySelector('.list');

const createList = forms[1];
const postIcon = createList.childNodes[1].querySelector('i');
const loader = createList.childNodes[1].querySelector('.custom-loader');

const input = document.getElementById('create_list_bar');
createList.addEventListener('submit', event => {
    event.preventDefault();

    const inputFilled = createList['create'];

    if (inputFilled.value.trim() != '') {
        $(inputFilled).siblings().attr('disabled', true);
        $(postIcon).hide();
        $(loader).removeClass('d-none');
        setTimeout(() => {
            $(loader).addClass('d-none');
            const cloneList = listElement.cloneNode(true);
            cloneList.classList.remove('d-none');
            cloneList.querySelector('.col-10').children[0].value = inputFilled.value;
            listContainer.append(cloneList);
            input.value = '';
            $(postIcon).show();
        }, 1000);
    } else {
        return false;
    }
});

function createListInput(event) {
    if (event.value.trim() != '') {
        $(event).siblings().removeAttr('disabled');
    } else {
        $(event).siblings().attr('disabled', true);
    }
}

function editList(event) {
    const input = $(event).parent().prev().children('input');
    $(input).removeAttr('readonly', true);
    $(input).focus();

    $(event).addClass('d-none');
    $(event).next().removeClass('d-none');
}

function saveList(event) {
    const input = $(event).parent().prev().children('input');
    $(input).attr('readonly', true);
    
    $(event).addClass('d-none');
    $(event).prev().removeClass('d-none');
}

function delList(event) {
    const container = $(event).closest('.list');
    $(container).remove();
}