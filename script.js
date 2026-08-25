/* =================================
   CYBERSAFE
   PAGE SCROLL + SMART NAVIGATION
================================= */


/* =================================
   ВСЕ ОСНОВНЫЕ СТРАНИЦЫ
   0 = Startseite
   1 = Malware
   2 = Phishing
   3 = Social Engineering
   4 = Passwörter
   5 = 2FA
   6 = Internet
   7 = Schutz
   8 = Cyberangriff
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
    document.querySelector("#angriff")
].filter(Boolean);


/* =================================
   НАВИГАЦИЯ
================================= */

const navItems = document.querySelectorAll(".nav-item");
const navIndicator = document.querySelector(".nav-indicator");


/* =================================
   СОСТОЯНИЕ
================================= */

let currentPage = 0;
let isScrolling = false;


/* =================================
   ПОДСВЕТКА НАВИГАЦИИ
================================= */

function updateNavigation(index) {

    /*
       Проверяем, существует ли
       такой пункт навигации
    */

    if (!navItems[index]) {
        return;
    }


    /*
       Убираем active со всех
    */

    navItems.forEach(function(item) {

        item.classList.remove("active");

    });


    /*
       Получаем нужный пункт
    */

    const activeItem = navItems[index];


    /*
       Делаем его активным
    */

    activeItem.classList.add("active");


    /*
       Перемещаем светящийся
       индикатор
    */

    if (navIndicator) {

        navIndicator.style.top =
            activeItem.offsetTop + "px";

    }

}


/* =================================
   ОПРЕДЕЛЕНИЕ ТЕКУЩЕЙ СТРАНИЦЫ
================================= */

function detectCurrentPage() {

    /*
       Если сейчас выполняется
       автоматический переход,
       ничего не меняем.
    */

    if (isScrolling) {
        return;
    }


    /*
       Точка, по которой определяем
       текущий раздел.

       35% высоты экрана.
    */

    const detectionPoint =
        window.innerHeight * 0.35;


    let detectedPage = 0;


    /*
       Проверяем только 9 основных
       страниц.

       Fazit и Quellen сюда
       специально НЕ входят.
    */

    pages.forEach(function(page, index) {

        const rect =
            page.getBoundingClientRect();


        /*
           Если верх секции уже прошёл
           точку определения,
           значит мы на этой секции.
        */

        if (rect.top <= detectionPoint) {

            detectedPage = index;

        }

    });


    /*
       Если страница изменилась,
       обновляем навигацию.
    */

    if (detectedPage !== currentPage) {

        currentPage = detectedPage;

        updateNavigation(currentPage);

    }

}


/* =================================
   ПЕРЕХОД НА СТРАНИЦУ
================================= */

function goToPage(index) {

    /*
       Не позволяем выйти
       за пределы основных страниц.
    */

    if (
        index < 0 ||
        index >= pages.length
    ) {
        return;
    }


    /*
       Начинаем блокировку.
    */

    isScrolling = true;


    /*
       Запоминаем страницу.
    */

    currentPage = index;


    /*
       Сразу меняем островок.
    */

    updateNavigation(currentPage);


    /*
       Плавно переходим.
    */

    pages[currentPage].scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    /*
       После окончания анимации
       снова разрешаем определение
       текущей страницы.
    */

    setTimeout(function() {

        isScrolling = false;

        detectCurrentPage();

    }, 1000);

}


/* =================================
   КОЛЁСИКО МЫШИ
================================= */

window.addEventListener(

    "wheel",

    function(event) {

        /*
           Отключаем обычный свободный
           scroll браузера.
        */

        event.preventDefault();


        /*
           Если предыдущий переход
           ещё не закончился —
           ничего не делаем.
        */

        if (isScrolling) {
            return;
        }


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
   ОТСЛЕЖИВАЕМ РЕАЛЬНОЕ ПОЛОЖЕНИЕ
================================= */

window.addEventListener(

    "scroll",

    function() {

        detectCurrentPage();

    }

);


/* =================================
   ФОНОВЫЕ КАРТИНКИ
================================= */

const sections =
    document.querySelectorAll(".section");


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
   ДИНАМИЧЕСКИЕ ФОНЫ
================================= */

const backgroundObserver =
    new IntersectionObserver(

        function(entries) {

            entries.forEach(function(entry) {

                const section =
                    entry.target;

                const id =
                    section.id;


                if (entry.isIntersecting) {

                    /*
                       Устанавливаем картинку
                    */

                    if (backgrounds[id]) {

                        section.style.setProperty(

                            "--section-bg",

                            backgrounds[id]

                        );

                    }


                    /*
                       Включаем фон
                    */

                    section.classList.add(
                        "background-active"
                    );

                }

                else {

                    section.classList.remove(
                        "background-active"
                    );

                }

            });

        },

        {
            threshold: 0.4
        }

    );


/* =================================
   ЗАПУСК НАБЛЮДАТЕЛЯ
================================= */

sections.forEach(function(section) {

    backgroundObserver.observe(section);

});


/* =================================
   НАЧАЛЬНОЕ СОСТОЯНИЕ
================================= */

updateNavigation(0);