const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

function toggleMenu() {
    menu?.classList.toggle('active');
}

function closeMenu() {
    if (menu?.classList.contains('active')) {
        menu.classList.remove('active');
    }
}

menuToggle?.addEventListener('click', toggleMenu);

document.querySelectorAll('header ul li a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

function typeText() {
    const textElement = document.getElementById('text-changing');

    if (!textElement) {
        return;
    }

    const texts = ['< Full Stack Developer />', '< UI/UX Designer />', '< Frontend Engineer />', '< Software Engineer />'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        const displayedText = currentText.substring(0, charIndex);

        textElement.textContent = `${displayedText}|`;

        if (!isDeleting) {
            if (charIndex < currentText.length) {
                charIndex++;
                setTimeout(type, 100);
            } else {
                isDeleting = true;
                setTimeout(type, 2000);
            }
        } else if (charIndex > 0) {
            charIndex--;
            setTimeout(type, 50);
        } else {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        }
    }

    type();
}

window.addEventListener('DOMContentLoaded', typeText);

function sendEmail() {
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;

    if (name && email && message) {
        alert(`Email sent successfully!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    } else {
        alert('Please fill in all fields.');
    }
}
