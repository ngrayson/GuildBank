let characters = {
		collMod: 'characters',
		validator: {
			$jsonSchema: {
				bsonType: "object",
         		required: [ "character_name", "player_id", /*"date_created",*/ "experience", "moneyCP", "class", "subclass"], 
         		properties: { 
                  character_name_full: { 
                     bsonType: "string", 
                     description: "required and must be a string"
                  },
                  character_name_short: { 
                     bsonType: "string", 
                     description: "optional and must be a string"
                  }, 
            		player_id: { 
               		bsonType: "int", 
               		description: "required and must be an integer"
               	},/*
               	date_created: {
               		bsonType: "date",
               		description: "required and must be a timestamp"
               	},*/
                  experience: {
                     bsonType: "int",
                     description: "required and must be an integer"
                  },
                  moneyCp: {
                     bsonType: "int",
                     description: "required and must be an integer"
                  },
                  class: {
                     bsonType: "int",
                     description: "required and must be an integer"
                  },
                  subclass: {
                     bsonType: "int",
                     description: "required and must be an integer"
                  },
                  current_activity: {
                     bsonType: "int",
                     description: "required and must be an integer"
                  }
         		}
       		}
		},	
		validationLevel: "off", 
		validationAction: "error" 
	}

let sessions = {
		collMod: 'sessions',
		validator: {
			$jsonSchema: {
				bsonType: "object",
         		required: [ "DateTime"], 
         		properties: { 
            		name: { 
               			bsonType: "date", 
               			description: "required and must be a string"
               		}, 
                  dungeonMaster: { 
                        bsonType: "string", 
                        description: "optional and must be a string"
                     }, 
                  playLocation: { 
                        bsonType: "string", 
                        description: "optional and must be a string"
                     }, 
                  maxPlayers: { 
                        bsonType: "string", 
                        description: "optional and must be a string"
                     }, 
                  enrolledPlayers: { 
                        bsonType: "string", 
                        description: "optional and must be a string"
                     }, 
                  recapWriter: { 
                        bsonType: "string", 
                        description: "optional and must be a string"
                     }, 
                  adventure: { 
                        bsonType: "string", 
                        description: "optional and must be a string"
                     }, 
                  status: { 
                        bsonType: "int", 
                        description: "optional and must be an integer.\n 0 - building\n 1 - adventuring\n 2 - completed"
                     }
         		}
       		}
		},	
		validationLevel: "off", 
		validationAction: "error" 
	}

let players = {
		collMod: 'players',
		validator: {
			$jsonSchema: {
				bsonType: "object",
         		required: [ "discordId" ], 
         		properties: { 
            		name: { 
               			bsonType: "string", 
               			description: "optional and must be a string"
               		}, 
            		discordId: { 
               			bsonType: "string", 
               			description: "required and must be a string"
               		},
                  active: {
                        bsonType: "bool",
                        description: "required and must be a boolean. indicates if the player is currently active"
                  }
         		}
       		}
		},	
		validationLevel: "off", 
		validationAction: "error" 
	}

let monsters = {
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
		validationLevel: "off", 
		validationAction: "error" 
	}

module.exports ={
	monsters,
	players,
   characters,
   sessions
}