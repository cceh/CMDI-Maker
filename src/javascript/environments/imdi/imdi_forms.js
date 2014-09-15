/*
Copyright 2014 Sebastian Zimmer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


imdi_environment.session_form = function () {

	var l = imdi_environment.l;
	
	return {

		title: "imdi-form",
		type: "form",
		fields: [
			{
				title: "Session",
				name: "session",
				type: "column",
				fields: [
					{
						heading: "Name",
						name: "name",
						type: "text",
						comment: l("session_form_comments", "name"),
						not_allowed_chars: " !\"§$%&/\\()=?^°`´'#*+~<>[]{}|²³,.;:áÁäÄàÀéÉîöÖóÓòÒüÜúÚùÙ"
					},    
					{
						heading: "Title",
						name: "title",
						type: "text",
						comment: l("session_form_comments", "title"),
					},
					{
						heading: "Date",
						name: "date",
						type: "date",
						comment: l("session_form_comments", "date"),
					},	
					{
						heading: "Description",
						name: "description",
						type: "textarea",
						comment: l("session_form_comments", "description"), 
					},
					{
						heading: "Location",
						name: "location",
						type: "subarea",
						fields: [
							{
								heading: "Continent",
								name: "continent",
								type: "select",
								size: 1,
								vocabulary: ["Unknown","Unspecified","Africa","Asia","Europe","Australia","Oceania","North-America","Middle-America","South-America"],
								default_value: "Unspecified",
								comment: l("session_form_comments", "location", "continent"),
							},					
							{
								heading: "Country",
								name: "country",
								type: "text",
								comment: "",
							},
							{
								heading: "Region",
								name: "region",
								type: "text",
								comment: l("session_form_comments", "location", "region"),
							},
							{
								heading: "Address",
								name: "address",
								type: "text",
								comment: l("session_form_comments", "location", "address"),
							}
						]
					}
				]
			},
			{
				title: "Project",
				name: "project",
				type: "column",
				comment: l("session_form_comments", "project", "main"),
				fields: [
					{
						heading: "Name",
						name: "name",
						type: "text",
						comment: l("session_form_comments", "project", "name"),
					},
					{
						heading: "Title",
						name: "title",
						type: "text",
						comment: l("session_form_comments", "project", "title"),
					},
					{
						heading: "ID",
						name: "id",
						type: "text",
						comment: l("session_form_comments", "project", "id"),
					},
					{
						heading: "Description",
						name: "description",
						type: "textarea",
						comment: l("session_form_comments", "project", "description"),
					},
					{	
						heading: "Contact",
						name: "contact",
						type: "subarea",
						comment: l("session_form_comments", "project", "contact"), 		
						fields: [
							{
								heading: "Name",
								name: "name",
								type: "text",
								comment: l("session_form_comments", "project", "contact")
							},
							{
								heading: "Address",
								name: "address",
								type: "text",
								comment: l("session_form_comments", "project", "contact")
							},						
							{
								heading: "Email",
								name: "email",
								type: "text",
								comment: l("session_form_comments", "project", "contact")
							},		
							{
								heading: "Organisation",
								name: "organisation",
								type: "text",
								comment: l("session_form_comments", "project", "contact")
							},
						]
					}
				]
			},
			{
				title: "Content",
				name: "content",
				type: "column",
				comment: l("session_form_comments", "content", "main"),
				fields: [
					{
						heading: "Genre",
						name: "genre",
						type: "open_vocabulary",
						size: 1,
						vocabulary: ["Unknown","Unspecified","Discourse","Ritual/religious texts","Fiction","Newspaper article",
						"Radio/TV feature","Drama","Singing","Instrumental music","Poetry","Literature","Secondary document","Personal notes","Stimuli"],
						comment: l("session_form_comments", "content", "genre"),
						default_value: "Unspecified"
					},
					{
						heading: "Sub Genre",
						type: "text",
						name: "subgenre",
						comment: l("session_form_comments", "content", "sub_genre")
					},
					{
						heading: "Task",
						name: "task",
						type: "open_vocabulary",
						size: 1,
						vocabulary: ["Unknown","Unspecified","info-kiosk","travel-planning","room reservation","frog story","pear story"],
						comment: l("session_form_comments", "content", "task"),
						default_value: "Unspecified"
					},
					{
						heading: "Description",
						name: "description",
						type: "textarea",
						comment: l("session_form_comments", "content", "description")
					},
					{
						heading: "Communication Context",
						name: "communication_context",
						type: "subarea",
						comment: l("session_form_comments", "content", "communication_context", "main"),
						fields: [
							{
								heading: "Event Structure",
								name: "eventstructure",
								type: "select",
								size: 1,
								vocabulary: ["Unknown","Unspecified","Monologue","Dialogue","Conversation","Not a natural format"],
								comment: l("session_form_comments", "content", "communication_context", "event_structure"),
								default_value: "Unspecified"
							},
							{
								heading: "Planning Type",
								name: "planningtype",
								type: "select",
								size: 1,
								vocabulary: ["Unknown","Unspecified","spontaneous","semi-spontaneous","planned"],
								comment: l("session_form_comments", "content", "communication_context", "planning_type"),
								default_value: "Unspecified"
							},					
							{
								heading: "Interactivity",
								name: "interactivity",
								type: "select",
								size: 1,
								vocabulary: ["Unknown","Unspecified","interactive","non-interactive","semi-interactive"],
								comment: l("session_form_comments", "content", "communication_context", "interactivity"),
								default_value: "Unspecified"
							},	
							{
								heading: "Social Context",
								name: "socialcontext",
								type: "select",
								size: 1,
								vocabulary: ["Unknown","Unspecified","Family","Private","Public","Controlled environment"],
								comment: l("session_form_comments", "content", "communication_context", "social_context"),
								default_value: "Unspecified"
							},	
							{
								heading: "Involvement",
								name: "involvement",
								type: "select",
								size: 1,
								vocabulary: ["Unknown","Unspecified","elicited","non-elicited","no-observer"],
								comment: l("session_form_comments", "content", "communication_context", "involvement"),
								default_value: "Unspecified"
							}
						]
					}
				]
			},
			{
				title: "Actors",
				type: "column",
				name: "actors",
				fields: [
					{
						heading: "Description of Actors",
						type: "textarea",
						comment: l("session_form_comments", "actors", "description"),
						name: "description",
					},
					{
						type: "special",
						name: "actors",
						object_structure: "array"
					}
				]
			},
			{
				title: "Resources",
				name: "resources",
				type: "column",
				fields: [
					{
						type: "special",
						name: "resources",
						object_structure: "object",
						object_arrays: ["writtenResources", "mediaFiles"]
					}
				]
			}
		],
		fields_to_copy: [ 
		//fields_to_copy is important for the function "Copy session 1 metadata to all session" so that it knows, what can be copied 
		
			{
				name: "date",
				label: "Date",
				fields: ["session_date_year","session_date_month","session_date_day"]
			},
			{
				name: "location",
				label: "Location",
				fields: ["session_location_continent","session_location_country","session_location_region","session_location_address"]
			},
			{
				name: "project",
				label: "Project",
				fields: ["project_name","project_title","project_id","project_description","project_contact_name","project_contact_address","project_contact_email","project_contact_organisation"]
			},
			{
				name: "content",
				label: "Content",
				fields: ["content_genre","content_subgenre","content_task","content_description","content_communication_context_eventstructure","content_communication_context_planningtype","content_communication_context_interactivity","content_communication_context_socialcontext","content_communication_context_involvement"]
			},
			{
				name: "actors",
				label: "Actors",
				fields: ["actors_description"]
				//since type of field actors is "special", there will be other stuff going on as well here!
			}	
		]
	};
};


imdi_environment.actor_form = {

	title: "imdi-actors",
	type: "form",
	fields: [
		{
			type: "column",
			fields: [
				{
					heading: "Name",
					name: "name",
					type: "text",
					comment: "Name of the actor as used by others in the transcription"
				},    
				{
					heading: "Full Name",
					name: "full_name",
					type: "text",
					comment: "Official name of the actor"
				},
   				{
					heading: "Code",
					name: "code",
					type: "text",
					comment: "Short unique code to identify the actor as used in the transcription"
				},
   				{
					heading: "Birth Date",
					name: "birth_date",
					type: "date",
				},
   				{
					heading: "Age",
					name: "age",
					type: "text",
				},
   				{
					heading: "Sex",
					name: "sex",
					type: "select",
					vocabulary: ["Unknown","Unspecified","NAP","Female","Male"],
					default_value: "Unspecified"
				},
   				{
					heading: "Education",
					name: "education",
					type: "text",
				}
			]
		},
		{
			title: "",
			name: "",
			type: "column",
			fields: [
				{
					heading: "Role",
					name: "role",
					type: "open_vocabulary",
					vocabulary: [
						"Unknown","Unspecified","Annotator","Author","Collector","Consultant","Computer","Depositor","Editor","Filmer",	
						"Illustrator","Interviewer","Musician","Photographer","Publisher","Recorder","Referent","Researcher","Singer","Speaker/Signer","Translator"
					],
					default_value: "Unspecified",
					comment: "Functional role of the actor e.g. consultant, contributor, interviewer, researcher, publisher, collector, translator"
				},    
				{
					heading: "Ethnic Group",
					name: "ethnic_group",
					type: "text",
				},
   				{
					heading: "Family Social Role",
					name: "family_social_role",
					type: "open_vocabulary",
					vocabulary: ["Unknown","Unspecified","Father","Mother","Sibling","Boss","Partner","Student","Teacher","Shaman/Priest","Mayor","Doctor"],
					default_value: "Unspecified"
				},
   				{
					heading: "Description of the actor",
					name: "description",
					type: "textarea",
				},
   				{
					heading: "Anonymized",
					name: "anonymized",
					type: "check",
					comment: "Indicates if real names or anonymized codes are used to identify the actor"
				}
			]
		},	
		{
			title: "Contact",
			name: "contact",
			type: "column",
			fields: [
				{
					heading: "Name",
					name: "name",
					type: "text"
				},    
				{
					heading: "Address",
					name: "address",
					type: "text"
				},
   				{
					heading: "Email",
					name: "email",
					type: "text"
				},
   				{
					heading: "Organisation",
					name: "organisation",
					type: "text"
				}
			]
		},	
		{
			title: "Languages",
			name: "languages",
			type: "column",
			fields: [
				{
					heading: "Actor Languages",
					name: "actor_languages",
					type: "special"
				}
			]
		}
	]
};


imdi_environment.corpus_form = function () {

	var l = imdi_environment.l;
	
	return {
		type: "form",
		fields: [
			{
				heading: "Name",
				name: "name",
				comment: l("corpus_form_comments", "name"),
				type: "text",
				not_allowed_chars: " !\"§$%&/\\()=?^°`´'#*+~<>[]{}|²³,.;:"
			},
			{
				heading: "Title",
				name: "title",
				comment: l("corpus_form_comments", "title"),
				type: "text"
			},	
			{
				heading: "Description",
				name: "description",
				type: "textarea"
			}
		]
	};
};