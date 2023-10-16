export default function showMessage(type, header, text = "") {
    const messageBox = document.getElementById(`${type}-box`);
    messageBox.querySelector("span").onclick = () => messageBox.style.visibility = "hidden";
    messageBox.querySelector("h4").innerText = header;
    messageBox.querySelector("p").innerText = text;
    messageBox.style.visibility = "visible";
}
