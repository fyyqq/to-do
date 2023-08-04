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

$(document).ready(() => {
    $('.btn-explore').on("mousemove", function(e) {
        e.preventDefault();
        const parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
        $(this).find("span").css({
            top : relY,
            left : relX,
        });
    });
});

function myForm() {
    var x = $('.input-text').val();
    if (x === "") {
        alert(`Please fill text first`);
    } else {
        $('tr').append(`
            <td class="d-flex justify-content-between align-items-center list-parent">
                <input type="text" name="text" id="text" class="list" value="${x}" readonly>
                <div class="btn-list">
                    <button class="btn btn-success" data-bs-target="tooltip" title="Save List" id="fa-save">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                    <button class="btn btn-primary" data-bs-target="tooltip" title="Edit List" id="fa-pen">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-danger" data-bs-target="tooltip" title="Delete List" id="fa-trash">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>`);
    }
    return $('.input-text').val('');
}

function myButton() {
    const editBtn = document.querySelectorAll('#fa-pen');
    const saveBtn = document.querySelectorAll('#fa-save');
    const delBtn = document.querySelectorAll('#fa-trash');
    editBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            const each = e.currentTarget;
            each.style.display = 'none';
            const inputAttr = each.parentElement.parentElement.childNodes[1];
            inputAttr.removeAttribute("readonly");
            $(inputAttr).focus();
            if (each) {
                const save = each.parentElement.childNodes[1];
                $(save).css('display', 'inline-block');
            }
        });
    });
    saveBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            const each = e.currentTarget;
            each.style.display = 'none';
            const inputAttr = each.parentElement.parentElement.childNodes[1];
            inputAttr.setAttribute("readonly", "");
            if (each) {
                const edit = each.parentElement.childNodes[3];
                $(edit).css('display', 'inline-block');
            }
        });
    });
    delBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            const each = e.currentTarget;
            const parent = each.parentElement.parentElement;
            $(parent).remove();
        });
    });
}

function deleteAll() {
    $('#delAll').click(() => {
        const allList = document.querySelectorAll('.list-parent');
        console.log(allList);
    });
}

$(document).ready(() => {
    $('.form-text').submit(() => {
        myForm();
        myButton();
        deleteAll();
    });
});

$(document).ready(() => {
    $('.save-btn').click(() => {
        myForm();
        myButton();
        deleteAll();
    });
});

$(document).ready(() => {
    $('.input-text').on({
        'focus' : function() {
            $(this).css({
                'width': '400px',
                'transition': '.4s ease-out',
                'border': '2px solid red'
            });
        },
        'blur' : function() {
            $(this).css({
                'width': '250px',
                'transition': '.4s ease-out'
            });
        }
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

const forms = document.forms;
const tags_container = document.getElementById('tags');
const tag = document.getElementById('tag');

const createListsForm = forms[0];
createListsForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const title = createListsForm['title'];
    const category = createListsForm['category'];
    const desc = createListsForm['description'];
    
    if (title.value.trim() != '') {
        const clone_tag = tag.cloneNode(true);
        $(createListsForm).parent().closest('.modal').modal('hide');
        $(clone_tag).removeClass('d-none');
        clone_tag.querySelector('#title').textContent = title.value;
        clone_tag.querySelector('#category').textContent = category.value;
        tags_container.children[1].style.display = 'none';
        tags_container.append(clone_tag);

        title.value = '';
        category.value = '';
        desc.value = '';

    } else {
        return false;
    }
});

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
        $(postIcon).hide();
        $(loader).removeClass('d-none');
        setTimeout(() => {
            $(loader).addClass('d-none');
            const cloneList = listElement.cloneNode(true);
            cloneList.querySelector('small').textContent = inputFilled.value;
            listContainer.append(cloneList);
            input.value = '';
            $(postIcon).show();
            $(inputFilled).siblings().attr('disabled', true);
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