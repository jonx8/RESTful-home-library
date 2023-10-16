import showMessage from "./message.js";
import {sendBookForm} from "./requests.js";

const newBookDialog = document.querySelector(".new-book-dialog");
const deleteBookDialog = document.querySelector(".delete-book-dialog");
const deleteConfirmButton = deleteBookDialog.querySelector(".confirm-btn");
const newBookForm = document.getElementById("book-form")


document.getElementById("new-book-btn").onclick = () => newBookDialog.showModal();
newBookDialog.querySelector(".close-icon").onclick = () => newBookDialog.close();
deleteBookDialog.querySelector(".cancel-btn").onclick = () => deleteBookDialog.close();
updateDeleteLinks();

function updateDeleteLinks() {
    const deleteIcons = document.getElementsByClassName("deleteIconLink");
    for (let icon of deleteIcons) {
        icon.onclick = ev => {
            ev.preventDefault();
            deleteBookDialog.showModal();
            deleteConfirmButton.onclick = async () => {
                let response = await fetch(icon.href, {method: 'DELETE'});
                if (response.ok) {
                    let books = await response.json();
                    updateBooksTable(books.sort((a, b) => a.id - b.id));
                } else {
                    showMessage("error", "Ошибка при удалении", "Ресурс удалён или перемещён");
                }
                deleteBookDialog.close();
            }
        }
    }
}


function updateBooksTable(books) {
    let tbody = document.querySelector("#books-list-table > tbody");
    tbody.innerHTML = '';

    for (const book of books) {
        tbody.innerHTML += `
        <tr>
            <td class="id-cell">${book.id}</td>
            <td class="title-cell"><a href="/books/${book.id}">${book.title}</a></td>
            <td class="author-cell">${book.author}</td>
            <td class="year-cell">${book.year}</td>
            <td class="availability-cell">
                <span class="book-available-${book.return_date === ""}">
                    ${book.return_date ? "Отсутствует" : "В наличии"}
                </span>
            </td>
            <td class="return-date-cell">
                ${book.return_date}
            </td>
            <td class="delete-btn-cell">
                <a href="/books/${book.id}" class="deleteIconLink">
                    <i class="fa fa-solid fa-trash fa-bounce fa-2x"></i>
                </a>
            </td>
        </tr>
        `
    }
    updateDeleteLinks();
}

newBookForm.onsubmit = async function (ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    sendBookForm(formData, "POST").then(async response => {
        if (response.ok) {
            const books = await response.json();
            updateBooksTable(books.sort((a, b) => a.id - b.id));
            showMessage("success", "Успех", "Добавлена новая книга");
            newBookForm.reset();
        } else {
            showMessage("error", "Ошибка валидации формы", "Проверьте корректность введённых данных");
        }
        newBookDialog.close();
    });
}

document.getElementById("sort-selector").onchange = async function () {
    const response = await fetch(`/filter/${this.value}`);
    if (response.ok) {
        const books = await response.json();
        updateBooksTable(books);
    }
}