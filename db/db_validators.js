let charactersValidator = {
		collMod: 'characters',
		validator: {
			$jsonSchema: {
				bsonType: "object",
         		required: [ "_id","character_name", "player_id", "date_created", "experience", "moneyCP", "resonite" ], 
         		properties: { 
         			_id: {
         				bsonType: "objectId" 
         			},
            		character_name: { 
               		bsonType: "string", 
               		description: "required and must be a string"
                  }, 
            		player_id: { 
               		bsonType: "int", 
               		description: "required and must be an integer"
               	},
               	date_created: {
               		bsonType: "timestamp",
               		description: "required and must be a timestamp"
               	},
                  experience: {
                     bsonType: "int",
                     description: "required and must be an integer"
                  },
                  moneyCP: {
                     bsonType: "int",
                     description: "required and must be an integer"
                  },
                  resonite: {
                     bsonType: "int",
                     description: "required and must be an integer"
                  },
                  inventory: {
                     bsonType: "object",
                     description: "must be an object"
                  }
         		}
       		}
		},	
		validationLevel: "strict", 
		validationAction: "error" 
	}

let sessionsValidator = {
		collMod: 'sessions',
		validator: {
			$jsonSchema: {
				bsonType: "object",
         		required: [ "name", "special" ], 
         		properties: { 
            		name: { 
               			bsonType: "string", 
               			description: "required and must be a string"
               		}, 
            		special: { 
               			bsonType: "string", 
               			description: "required and must be a string"
               		}
         		}
       		}
		},	
		validationLevel: "strict", 
		validationAction: "error" 
	}

let playersValidator = {
		collMod: 'players',
		validator: {
			$jsonSchema: {
				bsonType: "object",
         		required: [ "name", "_id" ], 
         		properties: { 
            		name: { 
               			bsonType: "string", 
               			description: "required and must be a string"
               		}, 
            		_id: { 
               			bsonType: "objectId", 
               			description: "required and must be an objectId"
               		}
         		}
       		}
		},	
		validationLevel: "strict", 
		validationAction: "error" 
	}

let monstersValidator = {
		collMod: 'monsters',
		validator: {
			$jsonSchema: {
				bsonType: "object",
         		required: [ "name", "special" ], 
         		properties: { 
            		name: { 
               			bsonType: "string", 
               			description: "required and must be a string"
               		}, 
            		special: { 
               			bsonType: "string", 
               			description: "required and must be a string"
               		}
         		}
       		}
		},	
		validationLevel: "strict", 
		validationAction: "error" 
	}

module.exports ={
	monstersValidator,
	playersValidator,
   charactersValidator
}