let monsterValidator = {
		collMod: 'monsters',
		validator: {
			$jsonSchema: {
				bsonType: "object",
         		required: [ "name", "special" ], 
         		properties: { 
            		name: { 
               			bsonType: "string", 
               			description: "required and must be a string" }, 
            		special: { 
               			bsonType: "string", 
               			description: "required and must be a string" }
         		}
       		}
		},	
		validationLevel: "strict", 
		validationAction: "error" 
	}

module.exports ={
	monsterValidator
}