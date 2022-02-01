$(document).ready(function () {
    $('#registerForm').validate({
        rules: {
            username: {required:true, minlength:3},
            password: "required",
            password_check: {required: true, equalTo: '#password'},
            nickname: {required: true}
        },
        messages: {
            username: {
                required: "Check your ID.",
                minlength: jQuery.format("Please enter your ID in at least {0} characters."),
            },
            password: "Check your password.",
            password_check: {
                requried: "Check your password.",
                equalTo: "Password is not the same."
            },
            nickname: {
                required: "Enter your nickname."
            }
        },
        submitHandler: function (frm) {
            frm.submit();
        },
        success: function(e) {

        }
    });
    
});