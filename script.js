/* =================================
   CYBERSAFE
   SCROLL + NAVIGATION + BACKGROUNDS
================================= */


/* =================================
   СЕКЦИИ САЙТА
================================= */

const pages = [
    document.querySelector("#home"),
    document.querySelector("#malware"),
    document.querySelector("#phishing"),
    document.querySelector("#social"),
    document.querySelector("#passwort"),
    document.querySelector("#2fa"),
    document.querySelector("#internet"),
    document.querySelector("#schutz"),
    document.querySelector("#angriff"),
    document.querySelector(".final-section:not(.sources)"),
    document.querySelector(".sources")
].filter(Boolean);


/* =================================
   НАВИГАЦИЯ
================================= */

const navItems = document.querySelectorAll(".nav-item");

const navIndicator =
    document.querySelector(".nav-indicator");


let currentPage = 0;

let isScrolling = false;


/* =================================
   ПОДСВЕТКА НАВИГАЦИИ
================================= */

function setActivePage(index) {

    if (!navItems[index]) {
        return;
    }


    navItems.forEach((item, i) => {

        if (i === index) {

            item.classList.add("active");

        } else {

            item.classList.remove("active");

        }

    });


    /* Перемещение светящегося индикатора */

    const activeItem = navItems[index];


    if (navIndicator && activeItem) {

        navIndicator.style.top =
            activeItem.offsetTop + "px";

    }

}


/* =================================
   ОПРЕДЕЛЕНИЕ ТЕКУЩЕЙ СЕКЦИИ
================================= */

function detectPage() {

    const screenCenter =
        window.innerHeight / 2;


    let bestIndex = 0;

    let bestDistance = Infinity;


    pages.forEach((page, index) => {

        if (!page) {
            return;
        }


        const rect =
            page.getBoundingClientRect();


        const sectionCenter =
            rect.top + rect.height / 2;


        const distance =
            Math.abs(
                sectionCenter - screenCenter
            );


        if (distance < bestDistance) {

            bestDistance = distance;

            bestIndex = index;

        }

    });


    if (bestIndex !== currentPage) {

        currentPage = bestIndex;

        setActivePage(currentPage);

    }

}


/* =================================
   ПЕРЕХОД К СЕКЦИИ
================================= */

function goToPage(index) {

    if (
        index < 0 ||
        index >= pages.length
    ) {

        return;

    }


    isScrolling = true;


    currentPage = index;

    setActivePage(index);


    pages[index].scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    setTimeout(() => {

        isScrolling = false;

        detectPage();

    }, 900);

}


/* =================================
   КОЛЁСИКО МЫШИ
================================= */

window.addEventListener(

    "wheel",

    function(event) {

        /*
           Не перехватываем колесо,
           если пользователь находится
           внутри отдельной страницы.
        */

        if (pages.length === 0) {
            return;
        }


        event.preventDefault();


        if (isScrolling) {
            return;
        }


        /*
           Определяем,
           где сейчас пользователь
        */

        detectPage();


        /*
           ВНИЗ
        */

        if (event.deltaY > 0) {

            goToPage(
                currentPage + 1
            );

        }


        /*
           ВВЕРХ
        */

        else if (event.deltaY < 0) {

            goToPage(
                currentPage - 1
            );

        }

    },

    {
        passive: false
    }

);


/* =================================
   ОБЫЧНЫЙ SCROLL
================================= */

window.addEventListener(

    "scroll",

    function() {

        if (!isScrolling) {

            detectPage();

        }

    }

);


/* =================================
   ФОНОВЫЕ КАРТИНКИ
================================= */

/*
   ВАЖНО:

   Эти картинки используются именно
   как БОЛЬШОЙ ФОН секции.

   Они могут совпадать с картинками
   карточек, но это не обязательно.
*/


const backgrounds = {

    malware:
        "url('images/malware.jpg')",

    phishing:
        "url('images/phishing.jpg')",

    social:
        "url('images/social-engineering.jpg')",

    passwort:
        "url('images/passwords.jpg')",

    "2fa":
        "url('images/2fa.jpg')",

    internet:
        "url('images/internet.jpg')",

    schutz:
        "url('images/protection.jpg')",

    angriff:
        "url('images/cyberattack.jpg')"

};


/* =================================
   АКТИВНЫЙ ФОН
================================= */

const sections =
    document.querySelectorAll(".section");


sections.forEach((section) => {

    const id = section.id;


    /*
       Если для этой секции есть
       картинка — устанавливаем её
    */

    if (backgrounds[id]) {

        section.style.setProperty(
            "--section-bg",
            backgrounds[id]
        );

    }

});


/* =================================
   ОТСЛЕЖИВАНИЕ СЕКЦИЙ
================================= */

const backgroundObserver =
    new IntersectionObserver(

        function(entries) {

            entries.forEach((entry) => {

                const section =
                    entry.target;


                if (entry.isIntersecting) {

                    /*
                       Включаем фон
                    */

                    section.classList.add(
                        "background-active"
                    );

                } else {

                    /*
                       Выключаем фон
                    */

                    section.classList.remove(
                        "background-active"
                    );

                }

            });

        },

        {
            /*
               Фон включается,
               когда примерно 20%
               секции находятся на экране.
            */

            threshold: 0.2
        }

    );


/* Наблюдаем за всеми секциями */

sections.forEach((section) => {

    backgroundObserver.observe(section);

});


/* =================================
   ЗАПУСК
================================= */

setActivePage(0);

detectPage();