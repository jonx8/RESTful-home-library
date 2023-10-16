import showMessage from "./message.js";
import {sendBookForm} from "./requests.js";

const bookForm = document.getElementById("book-form");
const issuanceDialog = document.querySelector(".issuance-book-dialog");
const issuanceForm = issuanceDialog.querySelector("#issuance-form");
const issuanceButton = document.getElementById("issuance-btn");
const deleteBookDialog = document.querySelector(".delete-book-dialog");

function updateBookData(formData) {
    const fields = bookForm.getElementsByTagName("input");
    const availabilityField = fields.namedItem('availability');
    const isAvailable = formData.get("return_date") === "";

    for (const field of fields) {
        field.value = formData.get(field.name);
    }
    availabilityField.value = isAvailable ? "В наличии" : "Отсутствует";
    availabilityField.classList.remove("w3-red", "w3-green");
    availabilityField.classList.add(isAvailable ? "w3-green" : "w3-red");
    issuanceButton.innerText = isAvailable ? "Выдать" : "Вернуть";
}


bookForm.onsubmit = ev => {
    ev.preventDefault();
    const formData = new FormData(bookForm);
    formData.set("return_date", bookForm.querySelector("#return-date-field").value);
    formData.set("reader", bookForm.querySelector("#reader-book-field").value);
    sendBookForm(formData, "PUT")
        .then(res => res.ok
            ? showMessage("success", "Успешно")
            : showMessage("error", "Ошибка"));
}


document.querySelector(".close-icon").onclick = () => issuanceDialog.close();

issuanceButton.onclick = async function (ev) {
    ev.preventDefault();
    if (this.innerText === "Вернуть") {
        const formData = new FormData(bookForm);
        formData.set("return_date", "");
        formData.set("reader", "");
        const response = await sendBookForm(formData, "PUT")
        if (response.ok) {
            updateBookData(formData);
            showMessage("success", "Успешно");
        } else {
            showMessage("error", "Ошибка")
        }
    } else {
        issuanceDialog.querySelector("#required-non-empty-msg").style.visibility = "hidden";
        issuanceDialog.showModal();
    }
}


issuanceForm.onsubmit = async ev => {
    ev.preventDefault();
    issuanceDialog.querySelector("#required-non-empty-msg").style.visibility = "hidden";
    const formData = new FormData(bookForm);
    formData.set("reader", issuanceForm.querySelector("#reader-field").value);
    formData.set("return_date", issuanceForm.querySelector("#return-field").value);
    if (formData.get("reader").trim() === "" || formData.get("return_date").trim() === "") {
        issuanceDialog.querySelector("#required-non-empty-msg").style.visibility = "visible";
        return;
    }

    const response = await sendBookForm(formData, "PUT");
    if (response.ok) {
        showMessage("success", "Успешно", "Книга выдана.");
        updateBookData(formData);
    } else {
        showMessage("error", "Ошибка валидации формы", "Проверьте корректность формы")
    }

    issuanceDialog.close();
}


deleteBookDialog.querySelector(".cancel-btn").onclick = () => deleteBookDialog.close();
document.querySelector(".delete-detail-icon > i").onclick = () => {
    deleteBookDialog.showModal();
    deleteBookDialog.querySelector(".confirm-btn").onclick = async () => {
        const response = await fetch(location.href, {method: "DELETE"});
        if (response.ok) {
            location.href = "/";
        } else {
            showMessage("error", "Ошибка удаления", "Ресурс был удалён или перемещён");
        }
    }
}