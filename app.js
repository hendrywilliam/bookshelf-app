const inputForm = document.getElementById('inputform');
const books = []
const keyLocalStorage = 'BOOKSHELF_APPS'

//blueprint for new book
function BookData(id, name, author, year, status) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.year = year;
    this.status = status;
}

function checkBookStatus() {
    const bookStatusElement = document.getElementById('status')
    if(bookStatusElement.checked) return true;
    return false;
}

//add new book
function addNewBook() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('releaseyear').value;
    const status = checkBookStatus();

    //create new book object
    const newBook = new BookData(id, name, author, year, status);
    books.push(newBook);
    makeBookshelf(newBook); //container
    saveDataBook();
    Swal.fire(`You just added ${name} into bookshelf`);
}

function makeBookshelf(bookObject) {
    const {id, name, author, year, status} = bookObject;
    const textID = document.createElement('h2');
    textID.innerText = id;
    const textName = document.createElement('h1');
    textName.innerText = name;
    const textAuthorName = document.createElement('h3');
    textAuthorName.innerText = author;
    const textYear = document.createElement('h3');
    textYear.innerText = year;
    const infoStatus = document.createElement('h3');
    infoStatus.innerText = status;
    const container = document.createElement('div');
    container.append(textID, textName, textAuthorName, textYear, infoStatus);
    if(status) {
        const editButton = document.createElement('button');
        editButton.innerText = "Edit";
        editButton.addEventListener('click', () => {
            console.log(id);
            editDataBook(id);
        });

        const moveButton = document.createElement('button');
        moveButton.innerText = "Move"
        moveButton.addEventListener('click', () => {
            moveBook(id);
        })

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "Delete"
        deleteButton.addEventListener('click', () => {
            deleteDataBook(id);
        })
        
        const buttonContainer = document.createElement('div');
        buttonContainer.append(editButton, deleteButton, moveButton);
        container.append(buttonContainer);

    } else {
        const editButton = document.createElement('button');
        editButton.innerText = "Edit";
        editButton.addEventListener('click', () => {
            console.log(id);
            editDataBook(id);
        });

        const moveButton = document.createElement('button');
        moveButton.innerText = "Move";
        moveButton.addEventListener('click', () => {
            moveBook(id)
        })

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener('click', () => {
            deleteDataBook(id);
        })
        
        const buttonContainer = document.createElement('div');
        buttonContainer.append(editButton, deleteButton, moveButton);
        container.append(buttonContainer);

    }

    return container;

}

//save progress & load progress
function saveDataBook(){
    const parsedToString = JSON.stringify(books);
    localStorage.setItem(keyLocalStorage, parsedToString);
    renderDisplay();
}

function loadDataBook() {
    const getData = localStorage.getItem(keyLocalStorage);
    const data = JSON.parse(getData);
    if(data !== null) {
        for(const book of data){
            books.push(book)
        }
    }
    renderDisplay();

}

//edit, move, delete button here
function editDataBook(bookId) {
    const targetBook = bookId;
    const id = document.getElementById('id');
    const name = document.getElementById('name');
    const author = document.getElementById('author');
    const year = document.getElementById('releaseyear');
    const status = document.getElementById('status');
    for(const index in books){ 
        if(books[index].id == targetBook);
        id.value = books[index].id;
        name.value = books[index].name;
        author.value = books[index].author;
        year.value = books[index].year;
        status.checked = books[index].status;
        books.splice(index, 1);
    }
    saveDataBook();
    renderDisplay();

}

function deleteDataBook(bookId) {
    const targetBook = bookId;
    for(const index in books) {
        if(books[index].id == targetBook) {
            Swal.fire(`You just deleted ${books[index].name} from bookshelf`);
            books.splice(index,1);
        }
    }
    saveDataBook();
    renderDisplay();
}

function moveBook(bookId) {
    const targetBook = bookId;
    for(const index in books) {
        if(books[index].id == targetBook) {
            if(books[index].status) {
                books[index].status = false;
                Swal.fire(`You just moved ${books[index].name} into unfinished section`);
            } else {
                books[index].status = true;
                Swal.fire(`You just moved ${books[index].name} into finished section`);
            }
        }
    }
    saveDataBook();
    renderDisplay();
}


//render to html
function renderDisplay() {
    const finishedBookList = document.getElementById('finishedbooklist');
    const unfinishedBookList = document.getElementById('unfinishedbooklist');
    finishedBookList.innerHTML = '';
    unfinishedBookList.innerHTML = '';
    for( const book of books) {
        const bookElement = makeBookshelf(book);
        if(book.status) {
            finishedBookList.append(bookElement);
        } else {
            unfinishedBookList.append(bookElement);
        }
    }
}


//content loaded
document.addEventListener('DOMContentLoaded', function (){
    inputForm.addEventListener('submit', (e) => {
        addNewBook();
        renderDisplay();
        e.preventDefault();
    })

    loadDataBook();
})
