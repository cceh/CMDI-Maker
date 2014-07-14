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
	
	my.l = function(arg1, arg2, arg3){
		return APP.getTermInActiveLanguage(my.languages, arg1, arg2, arg3);
	};
	
	
	my.settings = function(){
		return [
			{
				title: my.l("settings","output_format"),
				id: "output_format_select",
				type: "empty"
			},
			{
				
				title: my.l("settings","calculate_actors_age"),
				description: my.l("settings","calculate_actors_age_description"),
				type: "switch",
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
				description: my.l("import_actors_description"),
				type: "file",
				file_input_id: "actors_file_input",
				file_input_name: "actors_file_input",
				onchange: function () {my.workflow[2].import_actors();}
			},
			{
				title: my.l("settings","delete_actors_database"),
				description: my.l("delete_actors_database_description"),
				type: "link",
				onclick: function (){my.workflow[2].erase_database();}
			}
		];
	};
	
	
	my.recall = function (settings){
		
		dom.setRadioIndex(document.getElementsByName("output_format"), settings.output_format);
		dom.setOnOffSwitchValue(g("radio_age_calc"),settings.calc_actors_age);
		
	};
	
	
	my.getSaveData = function(){
		
		var object = {};

		object.output_format = dom.getValueOfRadios("output_format");
		object.calc_actors_age = g("radio_age_calc").on;
	
		return object;
		
	};
	
	
	my.specialInput = function(field, parent, element_id_prefix, element_class_prefix){
		
		if (field.name == "actors"){
			
			dom.br(parent);
			
			dom.newElement("div",element_id_prefix+"actors", "actors", parent);
			dom.newElement("div",element_id_prefix+"addActors_div", "actors", parent);
		
		}
		
		if (field.name == "resources"){
		
			dom.newElement("div",element_id_prefix+"resources", "mfs", parent);
			dom.newElement("div",element_id_prefix+"add_mf_div", "", parent);
		
		}
		
		if (field.name == "actor_languages"){
		
			var p = dom.newElement("p","", "", parent);
			var input = dom.newElement("input","actor_language_select","",p);
			input.type = "text";
			input.size = 1;
			input.name = "actor_language_select";
			
			dom.newElement("span","","",p," ");
			input = dom.newElement("input","actor_language_search_button","",p);
			input.type = "button";
			input.value = "Search";

			dom.br(p);
			dom.newElement("span","","",p,"or type in ISO code ");
			
			input = dom.newElement("input","actor_language_iso_input","",p);
			input.type = "text";
			input.size = 1;
			input.name = "actor_language_iso_input";
			
			dom.newElement("span","","",p," ");
			
			input = dom.newElement("input","actor_language_iso_ok","",p);
			input.type = "button";
			input.value = "OK";			
			
			dom.newElement("div","current_actor_languages_display", "", parent);									
			
		}
	
	};
	
	
	my.getSpecialFormData = function(field, parent, element_id_prefix, element_class_prefix){
	
		if (field.name == "actors"){
			
			//return actors in session?
			console.log(field);
			console.log(parent);
			console.log(element_id_prefix);
			console.log(element_class_prefix);
		
		}
		
		if (field.name == "resources"){
		
			//return resources in session??
		
		}
		
		if (field.name == "actor_languages"){
		
			//return current actor languages
			
		}	
	
	
	
	
	};
	
	
	my.reset = function(){
		
		return;
		
	};
	
	
	return my;
	
})();