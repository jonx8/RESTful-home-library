export async function sendBookForm(formData, method) {
    return await fetch(location.href, {
        method: method,
        headers: {"Content-Type": "application/json;charset=utf-8"},
        body: JSON.stringify(Object.fromEntries(formData))
    });
}