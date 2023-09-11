
// const cardList = [
//     {
//         title: "Kitten 2",
//         image: "images/brown-kitten2.jpg",
//         link: "About Kitten 2",
//         desciption: "Demo desciption about kitten 2"
//     },
//     {
//         title: "Kitten 3",
//         image: "images/white-kitten.jpg",
//         link: "About Kitten 3",
//         desciption: "Demo desciption about kitten 3"
//     }
// ]


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

const submitForm = () => {
    let formData = {};
    formData.fullName = $('#fullName').val();
    formData.email = $('#subTitle').val();
    formData.phone = $('#phone').val();
    formData.goal = $('#goal').val();

    // console.log(formData)
    postClient(formData);
}

// POST request 
function postClient(client){
    console.log("in  postClient")
    $.ajax({
        url:'/api/user',
        type:'POST',
        data: client,
        success: function(result){
            if(result.statusCode === 201){
                alert('client post successful')
            }
        }
    });
}

// GET request
function getAllClients(){
    $.get('/api/users', (response)=>{
        if(response.statusCode === 200){
            addCards(response.data)

        }
    })
}


$(document).ready(function(){
    $('.materialbox').materialbox();

    $('#formSubmit').click(()=>{
        submitForm();
        console.log("formSubmit")
    })
    $('.modal').modal();
    getAllClients();
})

