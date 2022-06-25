window.onload = () => {
    // const body = document.querySelector('.body');
    const sidebar = document.querySelector('nav');
    const toggle = document.querySelector(".toggle");
    const searchBtn = document.querySelector(".search-box");
    // const modeSwitch = document.querySelector(".toggle-switch");
    // const modeText = document.querySelector(".mode-text");
    // const dropdownArrow = document.querySelector('.dropdown-arrow')

    // const body = document.querySelector('body')
    // console.log(body)
    // console.log(toggle)


    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    })

    // dropdownArrow.addEventListener("click", () => {

    // })

    searchBtn.addEventListener("click", () => {
        sidebar.classList.remove("close");
    })

    // modeSwitch.addEventListener("click", () => {
    //     body.classList.toggle("dark");

    //     if (body.classList.contains("dark")) {
    //         modeText.innerText = "Light mode";
    //     } else {
    //         modeText.innerText = "Dark mode";

    //     }
    // });
}
