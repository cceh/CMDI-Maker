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


var imdi_environment = {
	name: "imdi",
	title: "IMDI",
	workflow: [corpus, resources, actor, session, output],
	settings: [
		{
			title: "Output Format",
			id: "output_format_select",
			type: "empty"
		},
		{
			
			title: "Calculate Actor's Age",
			description: "When this feature is activated, CMDI Maker checks if the age of an actor (if it has not been specified already) "+
				"can be calculated from the actor's birth date and the session date.<br>"+
				"When an age can be calculated, it will appear in the output file.<br>"+
				"(Age = Session Date - Actor's Birth Date)",
			type: "radio",
			options: ["On", "Off"],
			default_option: 0,
			radio_name: "radio_age_calc"
		},
		{
			title: "Export Actors as JSON",
			onclick: function (){actor.export_actors();},
			type: "link"
		},
		{
			title: "Import Actors from JSON or IMDI",
			description: "Please import UTF-8 encoded files only!",
			type: "file",
			file_input_id: "actors_file_input",
			file_input_name: "actors_file_input"
		},
		{
			title: "Delete Actors Database",
			description: "CMDI Maker saves all your actors in a Web Storage browser database, so that they are kept, even if you close the browser window.",
			type: "link",
			onclick: function (){actor.erase_database();}
		}
	]
};