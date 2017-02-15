var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
}
const escapeHtml = string => String(string).replace(/[&<>"'`=/]/g, s => entityMap[s])

let todos = {}

function checkall(checkStatus, callback) {
    $.ajax({
        url: `/update/`,
        type: 'PUT',
        data: `checkAll=${checkStatus}`,
        success: (result, status, xhr) => {
            for (let key in todos) {
                todos[key].status = checkStatus
            }
            render()
            callback(xhr)
        },
        error: function(textStatus, errorThrown) {
            render()
            console.log(textStatus, errorThrown)
            callback(textStatus, errorThrown)
        }
    })
}

function deleteCompleted(callback) {
    $.ajax({
        url: `/delete/`,
        type: 'DELETE',
        data: `status=true`,
        success: (result, status, xhr) => {
            for (let key in todos) {
                if (todos[key].status === true) {
                    delete todos[key]
                }
            }
            render()
            callback(xhr)
        },
        error: function(textStatus, errorThrown) {
            render()
            console.log(textStatus, errorThrown)
            callback(textStatus, errorThrown)
        }
    })
}

function updateStatus(id, status, callback) {
    const ItemStatus = status
    $.ajax({
        url: `/update/${id}`,
        type: 'PUT',
        data: `description=&status=${ItemStatus}`,
        success: (result, status, xhr) => {
            if (xhr.responseText === `The task with id=${id} doesnt exist to update`);
            else {
                todos[id].status = ItemStatus
            }
            render()
            callback(xhr)
        },
        error: function(textStatus, errorThrown) {
            render()
            console.log(textStatus, errorThrown)
            callback(textStatus, errorThrown)
        }
    })
}

function updateDescription(id, updateDescription, callback) {
    $.ajax({
        url: `/update/${id}`,
        type: 'PUT',
        data: `description=${escapeHtml(updateDescription)}&status=`,
        success: (result, status, xhr) => {
            if (xhr.responseText === `The task with id=${id} doesnt exist to update`);
            else {
                todos[id].description = updateDescription
            }
            render()
            callback(xhr)
        },
        error: function(textStatus, errorThrown) {
            render()
            console.log(textStatus, errorThrown)
            callback(textStatus, errorThrown)
        }
    })
}

function deleteItem(id, callback) {
    $.ajax({
        url: `/delete/${id}`,
        type: 'DELETE',
        success: (result, status, xhr) => {
            delete todos[id]
            render()
            callback(xhr)
        },
        error: function(textStatus, errorThrown) {
            render()
            console.log(textStatus, errorThrown)
            callback(textStatus, errorThrown)
        }
    })
}

function filterTodo(status) {
    if (status === true || status === false) {
        let filteredList = {}
        for (let key in todos) {
            if (todos[key].status === status) {
                filteredList[key] = todos[key]
            }
        }
        return filteredList
    } else {
        return 'Invalid Status'
    }
}

function getDomList() {
    let domList = '<ul class="todo-list">'
    let checked
    for (let key in todos) {
        let description = escapeHtml(todos[key].description)
        checked = (todos[key].status === true) ? 'checked' : ''
        domList += createLi(key, description, checked)
        if (todos[key].status === false) {
            $('.toggle-all').prop('checked', false)
        }
    }
    domList += '</ul>'
    return domList
}

function addItem(content) {
    $.post(`/write/${escapeHtml(content)}`, function(data) {
        todos[data] = { 'description': escapeHtml(content), 'status': false }
        $('.new-todo').val('')
        $('html, body').animate({ scrollTop: $(document).height() }, 'slow')
        render()
    })
}

function createLi(id, description, checked = '') {
    const className = (checked === '') ? 'active' : 'completed'
    return `<li id="${id}" class ="${className}">
      <div class="view">
      <input class ="toggle" type="checkbox" id="todo-checkbox-${id}" ${checked}>
      <label id="todo-label-${id}">${description}</label>
      <input id="todo-edit-textbox-${id}" class="edit" type="text" name="editableText">
      <button id="todo-button-${id}" class="destroy"></button>
      </div>
      
      </li>`
}

function itemFunctionality() {
    $('.destroy').click(function() {
        deleteItem($(this).closest('li').attr('id'), callback)
    })

    $('.toggle').change(function() {
        const id = $(this).closest('li').attr('id');
        (this.checked) ? updateStatus(id, true, callback): updateStatus(id, false, callback)
    })

    $('li').dblclick(function() {
        const value = $(this).find('label').hide().text()
        $(this).find('.destroy').hide()
        $(this).find('.edit').show().focus().val(value)
    })

    $('.edit').focusout(function() {
        const changedContent = $(this).hide().val()
        if (changedContent === '') {
            deleteItem($(this).closest('li').attr('id'), callback)
        } else {
            const originalContent = $(this).prev().text()
            if (changedContent !== originalContent) {
                updateDescription($(this).closest('li').attr('id'), changedContent, callback)
            } else {
                $(this).prev().show()
            }
        }
    })

    $('.edit').keyup(function(event) {
        if (event.which === 13) {
            $(this).focusout()
        } else if (event.which === 27) {
            $(this).off('focusout').hide()
            $(this).prev().show()
        }
    })
}

function listFunctionality() {
    $('.header .new-todo').keyup(function(event) {
        const content = $('.new-todo').val()
        if (event.keyCode === 13 && content !== '') {
            addItem(content)
        } else {
            $('html, body').animate({ scrollTop: 0 }, 50)
        }
    })

    $('.toggle-all').change(function() {
        const status = this.checked
        const toggle = (status) ? 'check' : 'uncheck'
        const r = confirm(`Are you u want to ${toggle} all items?`)
        if (r === true) {
            $('.toggle').prop('checked', status)
            checkall(status, callback)
        } else {
            $('.toggle-all').prop('checked', !this.checked)
        }
    })

    $('.clear-completed').click(() => deleteCompleted(callback))

    $(window).on('hashchange', () => filterList())

    $('#scrollUp').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800)
        return false
    })
}

function showActiveCount() {
    const activeList = filterTodo(false)
    const activeListCount = Object.keys(activeList).length
    const itemString = (activeListCount === 1) ? 'item' : 'items'
    $('.todo-count').text(`${activeListCount} ${itemString} left`);
    (activeListCount === 0) ? $('.toggle-all').prop('checked', true): $('.toggle-all').prop('checked', false)
}

function showClearComplete() {
    const completedList = filterTodo(true);
    (Object.keys(completedList).length === 0) ? $('.clear-completed').hide(): $('.clear-completed').show()
}

function hideWhenNoList() {
    if (Object.keys(todos).length === 0) {
        $('.footer').hide()
        $('.toggle-all').hide()
    } else {
        $('.footer').show()
        $('.toggle-all').show()
    }
}

function filterList() {
    const url = location.hash
    $('.filters a').prop('class', '')
    switch (url) {
        case '#/':
            $('a[href$="#/"').attr('class', 'selected')
            $('.todo-list li').show()
            break
        case '#/active':
            $('a[href$="#/active"]').attr('class', 'selected')
            $('.todo-list .active').show()
            $('.todo-list .completed').hide()
            break
        case '#/completed':
            $('a[href$="#/completed" ]').attr('class', 'selected')
            $('.todo-list .active').hide()
            $('.todo-list .completed').show()
            break
        default:
            $('a[href$="#/"').attr('class', 'selected')
            $('.todo-list li').show()
    }
}

function render() {
    const domList = getDomList()
    $('.main').html(domList)
    $('.editTextbox').hide()
    showActiveCount()
    showClearComplete()
    hideWhenNoList()
    filterList()
    itemFunctionality()
}

function read() {
    $.get('/read', (data) => {
        data.forEach(function(item) {
            todos[item.id] = item
        })
        render()
        listFunctionality()
    })
}

function callback() {}

$(document).ready(function() {
    read()
})