document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);

        function toggleMenu() {
            document.querySelector('#menu').classList.toggle('active');
        }

        function closeMenu() {
            const menu = document.querySelector('#menu');
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        }

        document.querySelectorAll('header ul li a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });


        function typeText() {
    const textElement = document.getElementById("text-changing");
    const texts = ["< Web Developer />", "< UI/UX Designer />", "< Frontend Engineer />", "< Software Engineer />"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        let displayedText = currentText.substring(0, charIndex);

        textElement.textContent = displayedText + "|";

        if (!isDeleting) {
            if (charIndex < currentText.length) {
                charIndex++;
                setTimeout(type, 100); // Typing speed
            } else {
                isDeleting = true;
                setTimeout(type, 2000); // Pause before deleting
            }
        } else {
            if (charIndex > 0) {
                charIndex--;
                setTimeout(type, 50); // Deleting speed
            } else {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500); // Pause before next word
            }
        }
    }

    type();
}

window.addEventListener("DOMContentLoaded", typeText);

function sendEmail() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (name && email && message) {
        alert(`Email sent successfully!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
        // Here you would typically send the email using a backend service
    } else {
        alert("Please fill in all fields.");
    }
}
a
