
var tools=require("../core/tools")
var core=require("../core/core")

module.exports = function(app,dbo) {
    //Ruta publica
    app.post('/apiClient/newUser', function(req, res) {
        //Set navegación
        console.log('acaa ',req.body)
        try{
	        if (req.body.hasOwnProperty('Email') && req.body.hasOwnProperty('Nombre') && req.body.hasOwnProperty('Id')){
	        	var user={
	        		Email:req.body.Email,
	        		Name:req.body.Nombre,
	        		IdSocket:req.body.Id
	        	}
	        	var saveUser = core.saveUser(dbo,user)
	        	saveUser.then(function(data) {
	        		res.status(200).json(data);
	        	})
	        	
			}else{
				
				res.status(400).json(tools.getResponse(false,'E','Información recibida no válida','Login_02'));
			}
		}
		catch(e){
			console.log('se cayo ',e)
			res.status(500).json(tools.getResponse(false,'E','Ocurrió un error interno','Login_03'));

		}
          
    });
}

