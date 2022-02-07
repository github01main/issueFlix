// if sub-menu button is clicked.
const sub_menu = document.querySelector(".sub-menu");
const container = document.querySelector(".container");

sub_menu.addEventListener("click", () => {
    container.classList.toggle("active");
});