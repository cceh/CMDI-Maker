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


eldp_environment.bundle_form = {

	title: "eldp-form",
	type: "form",
	fields: [
		{
			title: "Bundle",
			name: "bundle",
			type: "column",
			fields: [
				{
					heading: "Name",
					name: "name",
					type: "text",
					comment: "A short name or abbreviation of one or two words. This identifier distinguishes the bundle from others in the same (sub-) corpus and is used for quick browsing.",
					not_allowed_chars: " !\"§$%&/\\()=?^°`´'#*+~<>[]{}|²³,.;:"
				},    
				{
					heading: "Title",
					name: "title",
					type: "text",
					comment: "The bundle title is the complete title of the bundle without any abbreviations.",
				},
				{
					heading: "Date",
					name: "date",
					type: "date",
					comment: "In general the primary date of the bundle is audio or video date. If this bundle is about written resources only it indicates the creation date of the primary document.",
				},	
				{
					heading: "Description",
					name: "description",
					type: "textarea",
					comment: "Here a relevant description referring to the bundle as a whole can be given. Example: A conversation of mother, father and child at the breakfast table.", 
				},
				{
					heading: "Additional Information of Bundle",
					name: "additional_information",
					type: "textarea",
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
							comment: "For instance if recording bundles took place at an institution, the address of the institute is meant.",
						}
					]
				},
			]
		},
		{
			title: "Content",
			name: "content",
			type: "column",
			comment: "The content group is used to describe the content of the bundle. This is done using four dimensions (communication context, genre, task and modalities).",
			fields: [
				{
					heading: "Genre",
					name: "genre",
					type: "open_vocabulary",
					size: 1,
					vocabulary: ["Unknown","Unspecified","Discourse","Ritual/religious texts","Fiction","Newspaper article",
					"Radio/TV feature","Drama","Singing","Instrumental music","Poetry","Literature","Secondary document","Personal notes","Stimuli"],
					comment: "The conventionalized discourse types of the content of the bundle."
				},
				{
					heading: "Keywords",
					type: "textarea",
					name: "keywords"
				},
				{
					heading: "Restrictions of Access",
					type: "textarea",
					name: "access_restrictions"
				},
				{
					heading: "Conditions of Access",
					type: "textarea",
					name: "access_conditions"
				}
			]
		},
		{
			title: "Languages",
			name: "languages",
			type: "column",
			fields: [
				{
					name: "bundle_languages",
					type: "special",
					object_structure: "array"
				}
			]
		},
		{
			title: "Persons",
			type: "column",
			name: "persons",
			fields: [
				{
					heading: "Description of Persons",
					type: "textarea",
					comment: "Note that this description concerns all Persons and should be used to describe interactions and interrelations between Persons.",
					name: "description",
				},
				{
					type: "special",
					name: "persons",
					object_structure: "array"
				}
			]
		},
		{
			title: "Objects",
			name: "resources",
			type: "column",
			fields: [
				{
					type: "special",
					name: "resources",
					object_structure: "array"
				},
				{
					heading: "Recording Equipment",
					name: "recording_equipment",
					type: "textarea",
				},
				{
					heading: "Recording Conditions",
					name: "recording_conditions",
					type: "textarea",
				},
			]
		}
	],
	fields_to_copy: [ 
	//fields_to_copy is important for the function "Copy bundle 1 metadata to all bundle" so that it knows, what can be copied 
	
		{
			name: "date",
			label: "Date",
			fields: ["bundle_date_year","bundle_date_month","bundle_date_day"]
		},
		{
			name: "location",
			label: "Location",
			fields: ["bundle_location_continent","bundle_location_country","bundle_location_region","bundle_location_address"]
		},
		{
			name: "content",
			label: "Content",
			fields: ["content_genre","content_keywords"]
		},
		{
			name: "persons",
			label: "Persons",
			fields: ["persons_description"]
			//since type of field actors is "special", there will be other stuff going on as well here!
		}	
	]
};


eldp_environment.person_form = {

	title: "eldp-actors",
	type: "form",
	fields: [
		{
			type: "column",
			fields: [
				{
					heading: "Title",
					name: "title",
					type: "text",
				},    
				{
					heading: "Name (known as)",
					name: "nameKnownAs",
					type: "text",
				},
   				{
					heading: "Name (Full Name)",
					name: "fullName",
					type: "text",
				},
   				{
					heading: "Name (Sort By)",
					name: "nameSortBy",
					type: "text",
				},
				{
					heading: "Code",
					name: "code",
					type: "text",
					comment: "Short unique code to identify the actor as used in the transcription"
				},
   				{
					heading: "Birth Year",
					name: "birth_year",
					type: "year",
				},
   				{
					heading: "Death Year",
					name: "death_year",
					type: "year"
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
					heading: "Biographical Note",
					name: "biographical_note",
					type: "textarea",
				}/*,  //Role gets specified in bundle
				{
					heading: "Role",
					name: "role",
					type: "open_vocabulary",
					vocabulary: [
						"annotator","author","compiler","consultant","data_inputter","depositor",
						"developer","editor","illustrator","interpreter","interviewee","interviewer",
						"participant","performer","photographer","recorder","researcher","research_participant",
						"responder","signer","singer","speaker","sponsor","transcriber","translator"
					],
					default_value: "Unspecified",
					comment: "Functional role of the actor e.g. consultant, contributor, interviewer, researcher, publisher, collector, translator"
				},*/   
			]
		},
		{
			title: "",
			name: "",
			type: "column",
			fields: [
				{
					heading: "Ethnicities",
					name: "ethnicity",
					type: "textarea",  //multiple values
				},
   				{
					heading: "Nationalities",
					name: "nationality",
					type: "textarea",  //multiple values
				},
				{
					heading: "Additional Information (Person)",
					name: "person_additional_information",
					type: "textarea"
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
			type: "column",
			fields: [
			   	{
					heading: "Additional Information (Ethnicity)",
					name: "ethnicity_additional_info",
					type: "textarea"
				},
   				{
					heading: "Additional Information (Nationality)",
					name: "nationality_additional_info",
					type: "textarea"
				},
   				{
					heading: "Education",
					name: "education",
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