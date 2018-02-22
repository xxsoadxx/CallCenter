

 var socket = io();

socket.on('connect', function() {
    console.log("Successfully connected!");
});

function sendMessage(){
    
    var text = $("#msg").val();
    if(text !== ''){
        var id = $( ".msg-box" ).attr("id");

        $("#msg").val('');
        
        console.log("sendMsg");
        console.log("text = " + text);

        var egPayload = {
            "message": text,
            "id": id.replace("box-", "")
        };
        $("#container").append('<div class="bubble bubble-alt "><p style="font-size: 16px;color: rgb(152, 152, 152);margin-bottom: 10px;margin-top: 10px;">'+text+'</p></div>');
        $("#container").animate({ scrollTop: $('#container').prop("scrollHeight")}, 1000);
        //socket.emit('admresponse', egPayload);
        
        $.ajax({
            url: "http://localhost:3000/adminMsg",
            type: "POST",
            dataType: "JSON",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(egPayload),
            beforeSend: function () {
                    console.log("beforeSend");
            },
            success: function (res) {
               
            },
            
        });
        
        
    }
}

$(document).keypress(function(e) {
    if(e.which == 13) {
        sendMessage();
    }
});
    

    
function viewChat(elem) {
    var id = $(elem).attr("id");
    $(".selected").removeClass( "selected" );
    $(elem).addClass("selected");

  
    $( "#"+id+" .new" ).hide( );
    $( ".msg-box" ).attr("id", "box-"+id );
    
    if ($('#'+id+' .connected').length){
        $('#msg').prop("disabled",false);
        $('#send').prop("disabled",false);
    
    }else{
        $('#msg').prop("disabled",true);
        $('#send').prop("disabled",true);
    
    }
    
    ///Cargo todos los mensajes desde servicio y los dibujo
    

    //Muestro la caja
    $( ".msg-box" ).show( );



    
}

// Whenever the server emits 'login', log the login message
socket.on('desconectado', function (data) {
    
    if ($('#'+data.id).length){
        $( "#"+data.id+" .connected" ).attr( "class","desconectado" );

        if ($('#box-'+data.id).length){
            $('#msg').prop("disabled",true);
            $('#send').prop("disabled",true);
        }
    }
});
// Whenever the server emits 'login', log the login message
socket.on('message', function (data) {
    console.log(data);
    if ($('#'+data.id).length){
        console.log("Existe");
        $( "#"+data.id+" .last-msg" ).text( data.message );
       

        if ($('#box-'+data.id).length){
            $("#container").append('<div class="bubble yellow "><p style="font-size: 16px;color: #FFF;margin-bottom: 10px;margin-top: 10px;">'+data.message+'</p></div>');
            if(data.response !== undefined){
            $("#container").append('<div class="bubble bubble-alt sofia"><p style="font-size: 16px;color: rgb(152, 152, 152);margin-bottom: 10px;margin-top: 10px;">'+data.response+'</p></div>');
            }
            $("#container").animate({ scrollTop: $('#container').prop("scrollHeight")}, 1000);
        }else{
            $( "#"+data.id+" .new" ).show( );
        }

    }else{
        console.log("No Existe");
        var html = '<div id="'+data.id+'" onclick="viewChat(this)" class="box"><img class="person-avatar" src="./profile.png" /> \
        <h2 class="name">'+data.name+'<div class="connected"></h2><p class="last-msg">'+data.message+'</p> \
        <span class="time">Ahora</span><span class="new">Nuevo</span></div>'

        $( "#boxes" ).prepend( html );
    }
    /*
    if(typeof $scope.chats[data.id] === 'undefined') {
        // does not exist
        $scope.chats[data.id].name = "Santiago Ravera";
        $scope.chats[data.id].messages = [];
        $scope.chats[data.id].messages.push(data.message)
        $scope.chats[data.id].messages.push(data.response)
    }
    else {
        // does exist
        $scope.chats[data.id].messages.push(data.message)
        $scope.chats[data.id].messages.push(data.response)
    }
    */
    
});





