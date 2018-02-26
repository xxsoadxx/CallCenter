var tools= require("./tools")
var tableUser="Usuarios"
var tableConversations="Conversations"
var crypto = require('crypto');

var core={
	saveUser:function(dbo,newUser){
		var promise = new Promise(function(resolve, reject) {
		    try{
			  
			    var query = { Email: newUser.Email };
			    dbo.collection(tableUser).find(query).toArray(function(err, result) {
				    if (err) throw err;

				    if(result.length==0){
				    	
				    	dbo.collection(tableUser).insertOne(newUser, function(err, response) {
						    if (err) throw err;

						    var data={
						    	ConversationId:crypto.createHash('sha256').update(JSON.stringify(newUser)).digest('hex')
						    }

							resolve(tools.getResponse(true,'S','','',data));

						});
				    }
				    else{
						resolve(tools.getResponse(false,'E','Usuario actualmente logueado','Login_01'))
				    }
			    });
		    }
		    catch(e){
		    	throw e;
		    }
			   
		});
		return promise;
	},

	deleteUser:function(dbo,id){

		try{
		    var query = { Id: id };
		    dbo.collection(tableUser).deleteOne(query, function(err, obj) {
			    if (err) throw err;
			});
		}
		catch(e){
			throw e;
		}
	},

	saveConversationWithSofia:function(dbo,message){
	    try{
	    	console.log('saveConversationWithSofia')
		  	var conversation=[
		  		{IdConversation:message.idConversation,IdSocket:message.id,Name:message.name,Email:message.email,Message:message.message,Date:message.date},
		  		{IdConversation:message.idConversation,IdSocket:"SOFIACORP",Name:"Sofia",Email:"sofia@sofia.corp",Message:message.response,Date:new Date()}
		  	]
	    	dbo.collection(tableConversations).insertMany(conversation, function(err, response) {
			    if (err) throw err;
			});
	    }
	    catch(e){
	    	throw e;
	    }
		   
	},

	saveConversation:function(dbo,message){
	    try{
	    	dbo.collection(tableConversations).insertOne(message, function(err, response) {
			    if (err) throw err;
			});
	    }
	    catch(e){
	    	throw e;
	    }
		   
	},
}

module.exports = core;