const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const bookChecked = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookChecked);
  
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete
  }
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  uncompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeListBook(bookItem);
    if (!bookItem.isComplete) {
      uncompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

function makeListBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;
  textTitle.style.borderBottom = '2px solid #7a9ee0'; 
  textTitle.style.paddingBottom = '8px'; 
  textTitle.style.marginBottom = '10px'; 
  textTitle.style.fontWeight = 'bold'; 

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis: ' + bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun: ' + bookObject.year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');

  const bookContainer = document.createElement('article');
  bookContainer.classList.add('book_item');
  bookContainer.append(textTitle, textAuthor, textYear,  buttonContainer);
  bookContainer.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const unfinishedButton = document.createElement('button');
    unfinishedButton.innerHTML = '<i class="fas fa-undo-alt"></i> Belum Selesai dibaca';
    unfinishedButton.classList.add('green');

    unfinishedButton.addEventListener('click', function() {
      removeBookFromCompleteList(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i> Hapus Buku';
    deleteButton.classList.add('red');
    
    deleteButton.addEventListener('click', function(){
      deleteFromBookList(bookObject.id);
    });

    buttonContainer.append(unfinishedButton, deleteButton);
  } else {
    const finishedButton = document.createElement('button');
    finishedButton.innerHTML = '<i class="fas fa-check"></i> Selesai dibaca';
    finishedButton.classList.add('green');

    finishedButton.addEventListener('click', function() {
      addBookToCompleteList(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i> Hapus Buku';
    deleteButton.classList.add('red');

    deleteButton.addEventListener('click', function(){
      deleteFromBookList(bookObject.id);
    });

    buttonContainer.append(finishedButton, deleteButton);
  }
  return bookContainer;
}

function addBookToCompleteList (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleteList (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteFromBookList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}