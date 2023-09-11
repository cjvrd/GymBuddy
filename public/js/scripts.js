
const clickMe = () => {
    alert("Thanks for clicking. Hope you have a nice day!")
}

const addCards = (items) => {
    items.forEach(item => {
    let itemToAppend =
    '<div class="card"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="'+item.path+'">'+
    '</div><div class="card-content">'+
    '<span class="card-title activator grey-text text-darken-4">'+item.title+'<i class="material-icons right">more_vert</i></span><p><a href="#">'+item.link+'</a></p></div>'+
    '<div class="card-reveal">'+
    '<span class="card-title grey-text text-darken-4">'+item.title+'<i class="material-icons right">close</i></span>'+
    '<p class="card-text">'+item.desciption+'</p>'+
    '</div></div>';

    $(".cards-wrapper").append(itemToAppend)
    });
}

const submitForm = (e) => {
    e.prevenDefault();

    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();

    // Check if passwords match
    if (password !== confirmPassword) {
        M.toast({html: 'Passwords do not match!'});
        return; // Exit the function if passwords do not match
    }

    let formData = {};
    formData.fullName = $('#fullName').val();
    formData.email = $('#subTitle').val();
    formData.phone = $('#phone').val();
    formData.goal = $('#goal').val();
    formData.password = password; // Assuming you also want to send the password

    postUser(formData);
}


// POST request 
function postUser(user){
    console.log("in  postUser")
    $.ajax({
        url:'/api/users',
        type:'POST',
        data: user,
        success: function(result){
            if(result.statusCode === 201){
                alert('user post successful')
            }
        }
    });
}

// GET request
function getAllUsers(){
    $.get('/api/users', (response)=>{
        if(response.statusCode === 200){
            addCards(response.data)

        }
    })
}

    // This function checks if the passwords match
    function checkPasswordsMatch() {
        let password = $('#password').val();
        let confirmPassword = $('#confirmPassword').val();

        // Check if passwords match
        if (password !== confirmPassword) {
            M.toast({html: 'Passwords do not match!'});
            $('#confirmPassword').addClass('invalid'); // Adds a red underline for materializecss
        } else {
            $('#confirmPassword').removeClass('invalid').addClass('valid'); // Adds a green underline if they match
        }
    }


$(document).ready(function(){
    $('.materialbox').materialbox();
    $('select').formSelect();

    // Attach the blur event to the confirmPassword field
    $('#confirmPassword').on('blur', checkPasswordsMatch);

    $('#formSubmit').click(()=>{
        submitForm();
        console.log("formSubmit")
    })
    $('.modal').modal();
    getAllUsers();

})
