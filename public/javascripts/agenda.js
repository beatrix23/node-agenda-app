var allPersons = [];
var editPersonId;
var API_URL = {
    CREATE:'...',
    READ:'...',
    // ADD: 'data/add.json'
    ADD: 'users/add',
    UPDATE:'users/update',
    DELETE: 'users/delete'
};

var API_METHOD = {
    CREATE:'...',
    READ:'...',
    //ADD: 'GET'
    ADD: 'POST',
    UPDATE:'PUT',
    DELETE: 'DELETE'
}

fetch('data/persons.json').then(function (r) {
    return r.json();
}).then(function (persons) {
    console.log('all persons', persons);
    allPersons = persons;
    display(persons);
});
function display(persons) {
    var list = persons.map(function (person) {
        return `<tr data-id=${person.id}>
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.phone}</td>
        <td>
            <a href="#" class="delete">&#10006;</a>
            <a href="#" class="edit">&#9998;</a>
        </td>
    </tr>`;
    });

    document.querySelector('#agenda tbody').innerHTML = list.join('');
}

function savePerson() {
    var firstName = document.querySelector('[name=firstName]').value;
    var lastName = document.querySelector('[name=lastName]').value;
    var phone = document.querySelector('[name=phone]').value;
    
    if(editPersonId) {
        submitEditPerson(editPersonId, firstName, lastName, phone);
    } else {
        submitNewPerson(firstName, lastName, phone);
    }
}

function submitNewPerson(firstName, lastName, phone) {
    console.warn('savePerson', firstName, lastName, phone);
    var body = null;
    const method = API_METHOD.ADD;
    if (method === 'POST') {
        body = JSON.stringify({
            firstName,
            lastName,
            phone
        });
    }
    //body: JSON.stringify({
    //   firstName: firstName,
    //  lastName: lastName,
    //  person: phone, 
    fetch(API_URL.ADD, {
        method,
        body,
        headers: {
            "Content-Type": "application/json"
        }

    }).then(function (r) {
        return r.json();
    }).then(function (status) {
        if (status.success) {
            console.warn('saved', status)
            inlineAddPerson(status.id, firstName, lastName, phone);
        } else {
            console.warn('not saved!', status);
        }
    })
}

function submitEditPerson(id, firstName, lastName, phone) {
    var body = null;
    const method = API_METHOD.UPDATE;
    if (method === 'PUT') {
        body = JSON.stringify({
            id,
            firstName,
            lastName,
            phone
        });
    }

    fetch(API_URL.UPDATE, {
        method,
        body,
        headers: {
            "Content-Type": "application/json"
        }

    }).then(function (r) {
        return r.json();
    }).then(function (status) {
        if (status.success) {
            console.warn('saved', status)
            inlineEditPerson(status.id, firstName, lastName, phone);
        } else {
            console.warn('not saved!', status);
        }
    })
}

function inlineAddPerson(id, firstName, lastName, phone) {
    allPersons.push({
        id,
        firstName,
        lastName,
        phone
    });
    display(allPersons);
}

function inlineEditPerson(id, firstName, lastName, phone) {
    //window.location.reload();
    const person = allPersons.find((p) => {
        return p.id == id;
    });
    person.firstName = firstName;
    person.lastName = lastName;
    person.phone = phone;

    display(allPersons);

    editPersonId = '';
    document.querySelector('[name=firstName]').value = '';
    document.querySelector('[name=lastName]').value = '';
    document.querySelector('[name=phone]').value = '';
}

function inlineDeletePerson(id) {
    allPersons = allPersons.filter(function(person){
        return person.id != id;
    })
    display(allPersons);
}


function deletePerson(id) {
    var body = null;
    if (API_METHOD.DELETE === 'DELETE') {
        body = JSON.stringify({ id });
    }
    fetch(API_URL.DELETE, {
        method: API_METHOD.DELETE,
        body: body,
        headers: {
            "Content-Type": "application/json"
        }

    }).then(function (r) {
        return r.json();
    }).then(function (status) {
        if (status.success) {
            inlineDeletePerson(id);
        } else {
            console.warn('not saved!', status);
        }
    })
}

const editPerson = function(id) {
    var person = allPersons.find(function(p){
       // console.info('?', p.firstName);
        return p.id == id
    });
    console.warn('persoana', person);
    document.querySelector('[name=firstName]').value = person.firstName;
    document.querySelector('[name=lastName]').value = person.lastName;
    document.querySelector('[name=phone]').value = person.phone;
    editPersonId = id;
}

const search = value => {
    value = value.toLowerCase().trim();
    const filtered = allPersons.filter(person => {
        return person.firstName.toLowerCase().includes(value) ||
        person.lastName.toLowerCase().includes(value)
    });
    display(filtered);
};

function initEvents() {
    const tbody = document.querySelector('#agenda tbody');
    tbody.addEventListener('click', function (e) {
        console.warn('click on tbody', e.target.className);
        if (e.target.className == 'delete') {
            const tr = e.target.parentNode.parentNode;
            const id = tr.getAttribute('data-id');
            deletePerson(id);
        }
        else if (e.target.className == 'edit') {
            const tr = e.target.parentNode.parentNode;
            const id = tr.getAttribute('data-id');
            editPerson(id);
        }
    });

    const searchInput = document.getElementById('search')
    searchInput.addEventListener('input', () => {
        search(searchInput.value);
    })

}

initEvents ();