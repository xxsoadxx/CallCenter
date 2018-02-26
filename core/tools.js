var tools ={ 
	

	getResponse:function(success,severity,msg,code,data){
		var result = {
			success: success,
			severity:severity,
			message: msg,
			code: code,
			data:data
		};
		return result
	},





	
};


module.exports = tools;