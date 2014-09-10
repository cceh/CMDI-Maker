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


var imdi_environment = (function(){

	var my = {};
	
	my.name = "imdi";
	my.id = "imdi";
	my.title = "IMDI";
	my.workflow = [];
	my.languages = [];
	
	my.l = function(arg1, arg2, arg3, arg4){
		return APP.getTermInActiveLanguage(my.languages, arg1, arg2, arg3, arg4);
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
				title: my.l("settings","output_format"),
				id: "output_format_select",
				type: "empty"
			},
			{
				
				title: my.l("settings","global_language_of_metadata"),
				type: "select",
				name: "metadata_language",
				id: "metadata_language_select"
			},
			{
				title: my.l("settings","cmdi_metadata_creator"),
				description: my.l("settings","cmdi_metadata_creator_description"),
				type: "text",
				name: "metadata_creator",
				id: "metadata_creator",
				value: "CMDI Maker User"
			},
			{
				
				title: my.l("settings","calculate_actors_age"),
				description: my.l("settings","calculate_actors_age_description"),
				type: "toggle",
				default_value: true,
				name: "radio_age_calc",
				id: "radio_age_calc"
			},
			{
				title: my.l("settings","export_actors_as_json"),
				onclick: function (){my.workflow[2].export_actors();},
				type: "link"
			},
			{
				title: my.l("settings","import_actors_from_json_or_imdi"),
				description: my.l("settings","import_actors_description"),
				type: "file",
				file_input_id: "actors_file_input",
				file_input_name: "actors_file_input",
				onchange: my.workflow[2].handleImportFileInputChange
			},
			{
				title: my.l("settings","delete_actors_database"),
				description: my.l("settings","delete_actors_database_description"),
				type: "link",
				onclick: function (){my.workflow[2].erase_database();}
			}
		];
	};
	
	
	my.recall = function (settings){
		
		dom.setRadiosByValue(g("output_format"), settings.output_format);
		APP.GUI.setToggleValue(g("radio_age_calc"),settings.calc_actors_age);
		g("metadata_language_select").selectedIndex = settings.metadata_language;
		g("metadata_creator").value = settings.metadata_creator;
	
		
	};
	
	
	my.getProjectName = function(){
	
		return get("corpus_name");
	
	};
	
	
	my.getSaveData = function(){
		
		var object = {};

		object.output_format = dom.getSelectedRadioValue(g("output_format"));
		object.calc_actors_age = g("radio_age_calc").on;
		object.metadata_creator = get("metadata_creator");
		object.metadata_language = g("metadata_language_select").selectedIndex;
	
		return object;
		
	};
	
	
	my.reset = function(){
		
		return;
		
	};
	
	
	return my;
	
})();