const url='http://localhost:3000/apiClient/'
var socket = io();
var Opened = false;
var data = false;
var sofia = true;
var name;
var email;
var idConversation;

socket.on('connect', function() {
    console.log("Successfully connected! ",socket.id);
    $.get("chat.html", function (data) {
        $("#chatZone").append(data);
    });
});


// Whenever the server emits 'login', log the login message
socket.on('response', function (data) {
    console.log(data);
    sofia = data.sofia
    $("#container").append('<div class="bubble bubble-alt "><p style="font-size: 16px;color: rgb(255, 116, 4);;margin-bottom: 0px;">'+data.message+'</p></div>');
    $("#container").animate({ scrollTop: $('#container').prop("scrollHeight")}, 100);
});

function sendMessage(){

    var text = $("#msg").val();
    if(text !== ''){
        $("#msg").val('');
        $("#container").append('<div class="bubble yellow"><p style="font-size:16px;margin-bottom: 0px;color:#FFF;">'+text+'</p></div>');
        $("#container").animate({ scrollTop: $('#container').prop("scrollHeight")}, 100);
        console.log("sendMsg");
        var egPayload = {
            "name":name,
            "email":email,
            "sofia":sofia,
            "message": text,
            "id":socket.id,
            "idConversation":idConversation
        };
        console.log(egPayload);
        socket.emit('message', egPayload);
        
    }
}

$(document).keypress(function(e) {
    if(e.which == 13) {
        sendMessage();
    }
});
    
    


function chatBox() {
    console.log("chatBox");
    if(Opened === false){
        console.log("false");
        $('.chatHead').css( "bottom", "375px", 'important');
        $( "#arrow" ).removeClass( "fa-chevron-up" ).addClass("fa-chevron-down");

        if(!data){
            $('.chatLogin').css( "display", "block", 'important' );
        }else{
            $('.chatBody').css( "display", "block", 'important' );
        }
        
        Opened = true;
    }else{
        if(Opened === true){
            console.log("true");
            $('.chatHead').css( "bottom", "0px", 'important' );
            $( "#arrow" ).removeClass( "fa-chevron-down" ).addClass("fa-chevron-up");

            if(!data){
                $('.chatLogin').css( "display", "none", 'important' );
            }else{
                $('.chatBody').css( "display", "none", 'important' );
            }

            Opened = false;
        }
    }
    
} 



function LoginData(){
    name = $("#name").val();
    email = $("#email").val();
    console.log(name);
    console.log(email);
    if(name !== '' && email !== ''){
        console.log('socket ',socket.id)
        var body={
            Email:email,
            Nombre:name,
            Id:socket.id
        }
        $.ajax({
          url:url+"newUser",
          type:"POST",
          data:JSON.stringify(body),
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(response){
            console.log(response)
            if(response.success){
                idConversation=response.data.ConversationId
                console.log('idConversation ',idConversation)
                data = true;
                $('.chatLogin').css( "display", "none", 'important' );
                $('.chatBody').css( "display", "block", 'important' );
            }
            else{
                alert(response.message)
            }
          }
        })
    }
    else{
        alert('Complete los datos')
    }

}
