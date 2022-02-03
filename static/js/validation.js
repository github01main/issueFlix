function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var password_check = document.getElementById("password_check").value;
    var nickname = document.getElementById("nickname").value;
    var status = false;

    if (username == "") {
        document.getElementById("username").style.borderColor = "red";
        document.getElementById("nameError").style.color = "red";
        document.getElementById("nameError").innerHTML = "Don't do empty box.";
        status = false;
    }
    else {
        document.getElementById("username").style.borderColor = "green";
        document.getElementById("nameError").style.color = "green";
        document.getElementById("nameError").innerHTML = "Good!";
        status = true;
    }

    if(password == '') {
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('passwordError').style.color = 'red';
        document.getElementById('passwordError').innerHTML = "Don't do empty box.";
        status = false;
    } else {
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('passwordError').style.color = 'green';
        document.getElementById('passwordError').innerHTML = "Good!";
        status = true;
    }

    if(password_check == '') {
        document.getElementById('password_check').style.borderColor = 'red';
        document.getElementById('password_checkError').style.color = 'red';
        document.getElementById('password_checkError').innerHTML = "Don't do empty box.";
        status = false;
    } else {
        document.getElementById('password_check').style.borderColor = 'green';
        document.getElementById('password_checkError').style.color = 'green';
        document.getElementById('password_checkError').innerHTML = "Good!";
        status = true;
    }

    if(nickname == '') {
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

// **** jQuery Validation Check ****

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
