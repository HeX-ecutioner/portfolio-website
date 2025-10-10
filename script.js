let count = 0;

document.getElementById("increaser").onclick = () => {
    document.getElementById("countValue").textContent = ++count;
}

document.getElementById("decreaser").onclick = () => {
    document.getElementById("countValue").textContent = --count;
}

document.getElementById("resetter").onclick = () => {
    document.getElementById("countValue").textContent = count = 0; // Resets the variable as well
}