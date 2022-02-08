function signup_validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var password_check = document.getElementById("password_check").value;
    var nickname = document.getElementById("nickname").value;

    // IDReg
    var checkName = username.search(/[0-9]/g);
    var checkNameEng = username.search(/[a-z]/ig);

    // PasswordReg / Check if there are English and numbers
    var checkNumber = password.search(/[0-9]/g);
    var checkEnglish = password.search(/[a-z]/ig);
    var checkSpec = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/ig);

    // Qualification
    var status = false;

    // empty username case
    if (username == "") {
        document.getElementById("username").style.borderColor = "red";
        document.getElementById("nameError").style.color = "red";
        document.getElementById("nameError").innerHTML = "Don't do empty box.";
        status = false;
    }
    else if (username.length < 3 || username.length > 20) {
        document.getElementById("username").style.borderColor = "red";
        document.getElementById("nameError").style.color = "red";
        document.getElementById("nameError").innerHTML = "ID is too short or too long.";
        status = false;
    }

    else if (checkName < 0 || checkNameEng < 0) {
        document.getElementById("username").style.borderColor = "red";
        document.getElementById("nameError").style.color = "red";
        document.getElementById("nameError").innerHTML = "English and numbers are essential.";
        status = false;
    }

    else {
        document.getElementById("username").style.borderColor = "green";
        document.getElementById("nameError").style.color = "green";
        document.getElementById("nameError").innerHTML = "Good!";
        status = true;
    }


    // Password Validation
    // Empty password case
    if (password == '') {
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('passwordError').style.color = 'red';
        document.getElementById('passwordError').innerHTML = "Don't do empty box.";
        status = false;
    }
    // Password length
    else if (password.length < 8 || password.length > 20) {
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('passwordError').style.color = 'red';
        document.getElementById('passwordError').innerHTML = "Password is more than 9 and less than 20.";
        status = false;
    }
    // Password qualification(English, number, and Special characters)
    else if (checkNumber < 0 || checkEnglish < 0 || checkSpec < 0) {
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('passwordError').style.color = 'red';
        document.getElementById('passwordError').innerHTML = "Mix English, number and Special characters.";
        status = false;
    }
    // Password Success
    else {
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('passwordError').style.color = 'green';
        document.getElementById('passwordError').innerHTML = "Good!";
        status = true;
    }

    // empty password_check case
    if (password_check == '') {
        document.getElementById('password_check').style.borderColor = 'red';
        document.getElementById('password_checkError').style.color = 'red';
        document.getElementById('password_checkError').innerHTML = "Don't do empty box.";
        status = false;
    }
    // password is not password_check
    else if (password != password_check) {
        document.getElementById('password_check').style.borderColor = 'red';
        document.getElementById('password_checkError').style.color = 'red';
        document.getElementById('password_checkError').innerHTML = "Password is wrong.";
        status = false;
    } else {
        document.getElementById('password_check').style.borderColor = 'green';
        document.getElementById('password_checkError').style.color = 'green';
        document.getElementById('password_checkError').innerHTML = "Good!";
        status = true;
    }

    // empty nickname case
    if (nickname == '') {
        document.getElementById('nickname').style.borderColor = 'red';
        document.getElementById('nicknameError').style.color = 'red';
        document.getElementById('nicknameError').innerHTML = "Don't do empty box.";
        status = false;
    } else {
        document.getElementById('nickname').style.borderColor = 'green';
        document.getElementById('nicknameError').style.color = 'green';
        document.getElementById('nicknameError').innerHTML = "Good!";
        status = true;
    }

    return status;
}

function signin_validate() {
    var username = document.getElementById('signin_username').value;
    var password = document.getElementById('signin_password').value;
    var status = false;

    if (username == '') {
        document.getElementById('signin_username').style.borderColor = 'red';
        document.getElementById('login_nameError').style.color = 'red';
        document.getElementById('login_nameError').innerHTML = "Don't do empty box.";
        status = false;
    } else {
        document.getElementById('signin_username').style.borderColor = 'green';
        document.getElementById('login_nameError').style.color = 'green';
        document.getElementById('login_nameError').innerHTML = "Good!";
    }

    if (password == '') {
        document.getElementById('signin_password').style.borderColor = 'red';
        document.getElementById('login_passwordError').style.color = 'red';
        document.getElementById('login_passwordError').innerHTML = "Don't do empty box.";
        status = true;
    }

    return status;
}

// // **** jQuery Validation Check ****

// $(document).ready(function () {
//     $('#registerForm').validate({
//         rules: {
//             username: {required:true, minlength:3},
//             password: "required",
//             password_check: {required: true, equalTo: "#password"},
//             nickname: {required: true},
//         },
//         messages: {
//             username: {
//                 required: "Check your ID.",
//                 minlength: jQuery.format("Please enter your ID in at least {0} characters."),
//             },
//             password: "Check your password.",
//             password_check: {
//                 requried: "Check your password.",
//                 equalTo: "Password is not the same."
//             },
//             nickname: {
//                 required: "Enter your nickname."
//             }
//         },
//         submitHandler: function (frm) {
//             frm.submit();
//         },
//         success: function(e) {

//         }
//     });

// });