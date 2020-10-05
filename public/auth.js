const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    auth.createUserWithEmailAndPassword(email, password).then(credential => {
        signupForm.reset();
    });

});


const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();

    auth.signOut();
});


const signinForm = document.querySelector("#signin-form");
signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signinForm["signin-email"].value;
    const password = signinForm["signin-password"].value;

    console.log(email, password);

    auth.signInWithEmailAndPassword(email, password).then(credential => {
        signinForm.reset();
    });

});


auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("user logged in", user);
    } else {
        console.log("user logged out");
    }
});



