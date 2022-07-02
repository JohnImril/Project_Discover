new Gallery(document.getElementById("gallery"), {
	margin: 10,
	dots: false,
});

const MENU_OPENED_CLASS = "burger-menu__opened";
const burgerNode = document.querySelector(".burger-menu");
const burgerControlNode = document.querySelector(".burger-menu__control");

burgerControlNode.addEventListener("click", (_event) => {
	burgerNode.classList.toggle(MENU_OPENED_CLASS);
} )