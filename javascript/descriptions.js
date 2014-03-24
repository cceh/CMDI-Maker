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

var comments = {

	session: {
	
		name: "A short name or abbreviation of one or two words. This identifier distinguishes the session from others in the same (sub-) corpus and is used for quick browsing.",
		title: "The session title is the complete title of the session without any abbreviations.",
		date: "In general the primary date of the session is audio or video date. If this session is about written resources only it indicates the creation date of the primary document.",
		description: "Here a relevant description referring to the session as a whole can be given. Example: A conversation of mother, father and child at the breakfast table.", 
	
		location: {
		
			continent: "If the document is about \"the languages of South-America\", only Continent is supposed to be specified.",
			region: "This element can also be used to describe sub-regions. Examples: europe, the netherlands, gelderland, achterhoek.",
			address: "For instance if recording sessions took place at an institution, the address of the institute is meant.",
			

		},
		
		project: {
			main: "If the session was made within the context of a project, the project element contains information regarding this project. This information is typically reused for many sessions and corpus leafs when they all belong to the same project.",
			name: "A short name or abbreviation of the project.",
			title: "The full title of the project.",
			id: "A unique identifier for the project.",
			contact: "Contact information about the person or institution responsible for the project.", 
			description: "An elaborate description of the scope and goals of the project." 

		},
		
		content: {
			
			main: "The content group is used to describe the content of the session. This is done using four dimensions (communication context, genre, task and modalities).",
			genre: "The conventionalized discourse types of the content of the session.",
			subgenre: "The conventionalized discourse sub-types of the content of the session.",
			
			communication_context: {
			
				main: "This group of elements is used to describe the communication context in which the recording took place.",
				interactivity: "Characterizes the degree of interactivity between all the Actors in the session.",
				planning_type: "Indicates in how far the consultant planned the linguistic event.",
				involvement: "Indicates in how far the researcher was involved in the linguistic event.",
				social_context: "Indicates the social context the event took place in.",
				event_structure: "Indicates the structure of the communication event.",
				channel: "Indicates the channel of the communication."

			},
			
			task: "In areas such as language engineering often typical tasks are carried out or typical situations are dealt with such as \"info kiosk task\" or \"frog story\".",
			description: "In opposition to the elements prose text can be used here to describe the content."
			

		},
		
		actors: {
		
			description: "Note that this description concerns all Actors and should be used to describe interactions and interrelations between Actors." 
		
		}
		
	}
	
	
	
};