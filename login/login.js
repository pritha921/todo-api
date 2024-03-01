let signupBtn= document.getElementById("signupBtn");
let signinBtn= document.getElementById("signinBtn");
let nameField= document.getElementById("nameField");
let title= document.getElementById("title");

// signinBtn.onclick = function(){
//     nameField.style.maxHeight = "0";
//     title.innerHTML="Sign In"
//     signupBtn.classList.add("disable");
//     signinBtn.classList.remove("disable");

// }

// signupBtn.onclick = function(){
//     nameField.style.maxHeight = "60px";
//     title.innerHTML="Sign Up"
//     signupBtn.classList.remove("disable");
//     signinBtn.classList.add("disable");

// }

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    const signInBtn = document.getElementById('signinBtn');
    signInBtn.addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior


        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

    
        try {
            const response = await fetch('http://localhost:3000/todo/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
            
                console.log('Login successful');
            } else {
                
                const errorMessage = await response.text();
                console.error('Login failed:', errorMessage);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });
});
