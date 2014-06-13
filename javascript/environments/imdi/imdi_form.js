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


var session_form = {

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
					comment: "A short name or abbreviation of one or two words. This identifier distinguishes the session from others in the same (sub-) corpus and is used for quick browsing.",
					onkeypress: function(e) {
						var chr = String.fromCharCode(e.which);
						if (not_allowed_chars.indexOf(chr) >= 0){
							alertify.log("This character is not allowed here.","error",5000);
							return false;
						}
					}
				},    
				{
					heading: "Title",
					name: "title",
					type: "text",
					comment: "The session title is the complete title of the session without any abbreviations.",
				},
				{
					heading: "Date",
					name: "date",
					type: "date",
					comment: "In general the primary date of the session is audio or video date. If this session is about written resources only it indicates the creation date of the primary document.",
				},	
				{
					heading: "Description",
					name: "description",
					type: "textarea",
					comment: "Here a relevant description referring to the session as a whole can be given. Example: A conversation of mother, father and child at the breakfast table.", 
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
							comment: "If the document is about \"the languages of South-America\", only Continent is supposed to be specified.",
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
							comment: "This element can also be used to describe sub-regions. Examples: europe, the netherlands, gelderland, achterhoek.",
						},
						{
							heading: "Address",
							name: "address",
							type: "text",
							comment: "For instance if recording sessions took place at an institution, the address of the institute is meant.",
						}
					]
				}
			]
		},
		{
			title: "Project",
			name: "project",
			type: "column",
			comment: "If the session was made within the context of a project, the project element contains information regarding this project. This information is typically reused for many sessions and corpus leafs when they all belong to the same project.",
			fields: [
				{
					heading: "Name",
					name: "name",
					type: "text",
					comment: "A short name or abbreviation of the project.",
				},
				{
					heading: "Title",
					name: "title",
					type: "text",
					comment: "The full title of the project.",
				},
				{
					heading: "ID",
					name: "id",
					type: "text",
					comment: "A unique identifier for the project.",
				},
				{
					heading: "Description",
					name: "description",
					type: "textarea",
					comment: "An elaborate description of the scope and goals of the project.",
				},
				{	
					heading: "Contact",
					name: "contact",
					type: "subarea",
					comment: "Contact information about the person or institution responsible for the project.", 		
					fields: [
						{
							heading: "Name",
							name: "name",
							type: "text",
							comment: "Contact information about the person or institution responsible for the project."
						},
						{
							heading: "Address",
							name: "address",
							type: "text",
							comment: "Contact information about the person or institution responsible for the project."
						},						
						{
							heading: "Email",
							name: "email",
							type: "text",
							comment: "Contact information about the person or institution responsible for the project."
						},		
						{
							heading: "Organisation",
							name: "organisation",
							type: "text",
							comment: "Contact information about the person or institution responsible for the project."
						},
					]
				}
			]
		},
		{
			title: "Content",
			name: "content",
			type: "column",
			comment: "The content group is used to describe the content of the session. This is done using four dimensions (communication context, genre, task and modalities).",
			fields: [
				{
					heading: "Genre",
					name: "genre",
					type: "open_vocabulary",
					size: 1,
					vocabulary: ["Unknown","Unspecified","Discourse","Ritual/religious texts","Fiction","Newspaper article",
					"Radio/TV feature","Drama","Singing","Instrumental music","Poetry","Literature","Secondary document","Personal notes","Stimuli"],
					comment: "The conventionalized discourse types of the content of the session."
				},
				{
					heading: "Sub Genre",
					type: "text",
					name: "subgenre",
					comment: "The conventionalized discourse sub-types of the content of the session."
				},
				{
					heading: "Task",
					name: "task",
					type: "open_vocabulary",
					size: 1,
					vocabulary: ["Unknown","Unspecified","info-kiosk","travel-planning","room reservation","frog story","pear story"],
					comment: "In areas such as language engineering often typical tasks are carried out or typical situations are dealt with such as \"info kiosk task\" or \"frog story\"."
				},
				{
					heading: "Description",
					name: "description",
					type: "textarea",
					comment: "In opposition to the elements prose text can be used here to describe the content."
				},
				{
					heading: "Communication Context",
					name: "communication_context",
					type: "subarea",
					comment: "This group of elements is used to describe the communication context in which the recording took place.",
					fields: [
						{
							heading: "Event Structure",
							name: "eventstructure",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","Monologue","Dialogue","Conversation","Not a natural format"],
							comment: "Indicates the structure of the communication event."
						},
						{
							heading: "Planning Type",
							name: "planningtype",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","spontaneous","semi-spontaneous","planned"],
							comment: "Indicates in how far the consultant planned the linguistic event."
						},					
						{
							heading: "Interactivity",
							name: "interactivity",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","interactive","non-interactive","semi-interactive"],
							comment: "Characterizes the degree of interactivity between all the Actors in the session."
						},	
						{
							heading: "Social Context",
							name: "socialcontext",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","Family","Private","Public","Controlled environment"],
							comment: "Indicates the social context the event took place in."
						},	
						{
							heading: "Involvement",
							name: "involvement",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","elicited","non-elicited","no-observer"],
							comment: "Indicates in how far the researcher was involved in the linguistic event."
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
					comment: "Note that this description concerns all Actors and should be used to describe interactions and interrelations between Actors.",
					name: "description",
				},
				{
					type: "special",
					name: "actors"
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
					name: "resources"
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

var actor_form_imdi = {

	title: "imdi-actors",
	type: "form",
	fields: [
		{
			title: "",
			name: "",
			type: "column",
			fields: [
				{
					heading: "Name",
					name: "name",
					type: "text",
				},    
				{
					heading: "Full Name",
					name: "full_name",
					type: "text",
				},
   				{
					heading: "Code",
					name: "code",
					type: "text",
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
					vocabulary: ["Unknown","Unspecified","NAP","Female","Male"]
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
					]
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
					vocabulary: ["Unknown","Unspecified","Father","Mother","Sibling","Boss","Partner","Student","Teacher","Shaman/Priest","Mayor","Doctor"]
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


function make_new_session_object(){

	var session_object = {
	
		session: {
		
			name: "",
		
			date: {
				year: "",
				month: "",
				day: ""
			},	

			location: {
				continent: ""
			},			
		
		},
	
		id: null,


		project: {
		
			contact: {},
		
		},
		
		content: {
		
			communication_context: {}
		
		},
		
		actors: {
			description: "",
			actors: []
			//which actors are in this session?
			//Ex.: [21, 36];  //I. e. Session contains actor_ids 21 and 36
		},
	
		resources: {
		
			writtenResources: [],
			//values represent resource ids in respective session	
		
			mediaFiles: []
			//values represent resource ids in respective session
			
		},
		
		expanded: false

	};
	
	return session_object;

}

var imdi_environment = {
	name: "imdi",
	title: "IMDI",
	workflow: [corpus, resources, actor, session, output]
};