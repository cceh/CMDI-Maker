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


var eldp_environment = (function(){

	var my = {};

	my.name = "eldp";
	my.id = "eldp";
	my.title = "ELDP (pre-alpha)";
	
	my.workflow = [];
	my.languages = [];
	
	my.not_allowed_chars = " !\"§$%&/\\()=?^°`´'#*+~<>[]{}|²³,.;:áÁäÄàÀéÉîöÖóÓòÒüÜúÚùÙ";
	
	my.l = function(arg1, arg2, arg3){
		return APP.getTermInActiveLanguage(my.languages, arg1, arg2, arg3);
	};
	
	my.metadataLanguageIDs = [
		["eng","English"],
		["ger", "German"],
		["spa","Spanish"],
		["fra","French"],
		["rus","Russian"],
		["ind","Indonesian"],
		["por","Portuguese"],
		["arb","Standard Arabic"]
	];
	
	my.init = function(){
	
		my.displayMetadataLanguages();
	
	};
	
	
	my.displayMetadataLanguages = function (){
	
		var select = g("metadata_language_select");
		dom.setSelectOptions(select, my.metadataLanguageIDs, 1, 0, false);

	};
	
	
	my.settings = function(){
		return [
			{
				
				title: my.l("settings", "calculate_persons_age"),
				description: my.l("settings", "calculate_persons_age_description"),
				type: "toggle",
				default_value: true,
				name: "radio_age_calc",
				id: "radio_age_calc"
			},
			{
				
				title: my.l("settings", "global_language_of_metadata"),
				type: "select",
				name: "metadata_language",
				id: "metadata_language_select"
			},
			{
				title: my.l("settings", "cmdi_metadata_creator"),
				description: my.l("settings", "cmdi_metadata_creator_description"),
				type: "text",
				name: "metadata_creator",
				id: "metadata_creator",
				value: "CMDI Maker User"
			}/*,
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
				file_input_name: "actors_file_input",
				onchange: function () {actor.import_actors();}
			}*/
		];
	};
	
	my.recall = function (settings){
		
		return;
	
	};
	
	my.getSaveData = function(){
	
		var object = {};

		object.calc_actors_age = (document.getElementsByName("radio_age_calc")[0].checked ? true : false);
	
		return object;
	
	};
	
	
	my.reset = function(){
	
		return;
	
	};
	
	APP.environments.add(my);
	
	return my;
	
})();