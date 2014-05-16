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
	columns: [
		{
			title: "Session",
			name: "session_td",
			type: "column",
			fields: [
				{
					heading: "Name",
					name: "name",
					session_object_name: ["name"],
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
					heading: "title",
					name: "title",
					type: "text",
					session_object_name: ["title"],
					
					comment: "The session title is the complete title of the session without any abbreviations.",
				},
				{
					heading: "Date",
					name: "date",
					type: "date",
					session_object_name: ["date"],
					comment: "In general the primary date of the session is audio or video date. If this session is about written resources only it indicates the creation date of the primary document.",
				},	
				{
					heading: "Description",
					name: "description",
					type: "textarea",
					session_object_name: ["description"],
					comment: "Here a relevant description referring to the session as a whole can be given. Example: A conversation of mother, father and child at the breakfast table.", 
				},
				
				{
					heading: "Location",
					type: "subarea",
					fields: [
						{
							heading: "Continent",
							name: "location_continent",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","Africa","Asia","Europe","Australia","Oceania","North-America","Middle-America","South-America"],
							session_object_name: ["location","continent"],
							comment: "If the document is about \"the languages of South-America\", only Continent is supposed to be specified.",
						},					
						{
							heading: "Country",
							name: "location_country",
							type: "text",
							session_object_name: ["location","country"],
							comment: "",
						},
						{
							heading: "Region",
							name: "location_region",
							type: "text",
							session_object_name: ["location","region"],
							comment: "This element can also be used to describe sub-regions. Examples: europe, the netherlands, gelderland, achterhoek.",
						},
						{
							heading: "Address",
							name: "location_address",
							type: "text",
							session_object_name: ["location","address"],
							comment: "For instance if recording sessions took place at an institution, the address of the institute is meant.",
						}
					]
				}
			]
		},
		{
			title: "Project",
			name: "project_td",
			type: "column",
			comment: "If the session was made within the context of a project, the project element contains information regarding this project. This information is typically reused for many sessions and corpus leafs when they all belong to the same project.",
			fields: [
				{
					heading: "Name",
					name: "project_name",
					type: "text",
					session_object_name: ["project","name"],
					comment: "A short name or abbreviation of the project.",
				},
				{
					heading: "title",
					name: "project_title",
					type: "text",
					session_object_name: ["project","title"],
					comment: "The full title of the project.",
				},
				{
					heading: "ID",
					name: "project_id",
					type: "text",
					session_object_name: ["project","id"],
					comment: "A unique identifier for the project.",
				},
				{
					heading: "Description",
					name: "project_description",
					type: "textarea",
					session_object_name: ["project","description"],
					comment: "An elaborate description of the scope and goals of the project.",
				},
				{	
					heading: "Contact",
					type: "subarea",
					comment: "Contact information about the person or institution responsible for the project.", 		
					fields: [
						{
							heading: "Name",
							name: "contact_name",
							type: "text",
							session_object_name: ["contact", "name"],
							comment: "Contact information about the person or institution responsible for the project."
						},
						{
							heading: "Address",
							name: "contact_address",
							type: "text",
							session_object_name: ["contact", "address"],
							comment: "Contact information about the person or institution responsible for the project."
						},						
						{
							heading: "Email",
							name: "contact_email",
							type: "text",
							session_object_name: ["contact", "email"],
							comment: "Contact information about the person or institution responsible for the project."
						},		
						{
							heading: "Organisation",
							name: "contact_organisation",
							type: "text",
							session_object_name: ["contact", "organisation"],
							comment: "Contact information about the person or institution responsible for the project."
						},
					]
				}
			]
		},
		{
			title: "Content",
			name: "content_td",
			type: "column",
			comment: "The content group is used to describe the content of the session. This is done using four dimensions (communication context, genre, task and modalities).",
			fields: [
				{
					heading: "Genre",
					name: "content_genre",
					type: "open_vocabulary",
					size: 1,
					vocabulary: ["Unknown","Unspecified","Discourse","Ritual/religious texts","Fiction","Newspaper article",
					"Radio/TV feature","Drama","Singing","Instrumental music","Poetry","Literature","Secondary document","Personal notes","Stimuli"],
					session_object_name: ["content","genre"],
					comment: "The conventionalized discourse types of the content of the session."
				},
				{
					heading: "Sub Genre",
					type: "text",
					name: "content_subgenre",
					session_object_name: ["content","subgenre"],
					comment: "The conventionalized discourse sub-types of the content of the session."
				},
				{
					heading: "Task",
					name: "content_task",
					type: "open_vocabulary",
					size: 1,
					vocabulary: ["Unknown","Unspecified","info-kiosk","travel-planning","room reservation","frog story","pear story"],
					session_object_name: ["content","task"],
					comment: "In areas such as language engineering often typical tasks are carried out or typical situations are dealt with such as \"info kiosk task\" or \"frog story\"."
				},
				{
					heading: "Description",
					name: "content_description",
					type: "textarea",
					session_object_name: ["content","description"],
					comment: "In opposition to the elements prose text can be used here to describe the content."
				},
				{
					heading: "Communication Context",
					type: "subarea",
					comment: "This group of elements is used to describe the communication context in which the recording took place.",
					fields: [
						{
							heading: "Event Structure",
							name: "content_eventstructure",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","Monologue","Dialogue","Conversation","Not a natural format"],
							session_object_name: ["content","eventstructure"],
							comment: "Indicates the structure of the communication event."
						},
						{
							heading: "Planning Type",
							name: "content_planningtype",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","spontaneous","semi-spontaneous","planned"],
							session_object_name: ["content","planningtype"],
							comment: "Indicates in how far the consultant planned the linguistic event."
						},					
						{
							heading: "Interactivity",
							name: "content_interactivity",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","interactive","non-interactive","semi-interactive"],
							session_object_name: ["content","interactivity"],
							comment: "Characterizes the degree of interactivity between all the Actors in the session."
						},	
						{
							heading: "Social Context",
							name: "content_socialcontext",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","Family","Private","Public","Controlled environment"],
							session_object_name: ["content","socialcontext"],
							comment: "Indicates the social context the event took place in."
						},	
						{
							heading: "Involvement",
							name: "content_involvement",
							type: "select",
							size: 1,
							vocabulary: ["Unknown","Unspecified","elicited","non-elicited","no-observer"],
							session_object_name: ["content","eventstructure"],
							comment: "Indicates in how far the researcher was involved in the linguistic event."
						}
					]
				}
			]
		},
		{
			title: "Actors",
			type: "column",
			name: "actors_td",
			fields: [
				{
					heading: "Description of Actors",
					type: "textarea",
					comment: "Note that this description concerns all Actors and should be used to describe interactions and interrelations between Actors.",
					name: "actorsDescription",
					session_object_name: ["actorsDescription"],
				},
				{
					type: "special",
					name: "actors"
				}
			]
		},
		{
			title: "Resources",
			name: "resources_td",
			type: "column",
			fields: [
				{
					type: "special",
					name: "resources"
				}
			]
		}
	]
};