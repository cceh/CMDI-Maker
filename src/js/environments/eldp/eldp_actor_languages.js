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


eldp_environment.workflow[1].languages = (function (){
//Sub-object of actor
	'use strict';

	var my = {};
	my.parent = eldp_environment;
	var actor = my.parent.workflow[1];

	my.languages_of_active_person = new ObjectList();
	
	my.element_id_prefix = actor.element_id_prefix + "languages_";
	
	my.l = my.parent.l;
	
	my.init = function(){
	
		return;
		
	};
	
	
	my.makeInputInForm = function (field, parent, element_id_prefix, element_class_prefix){
		
		if (field.name == "actor_languages"){
		
			APP.GUI.makeLanguageSearchForm(
				parent,
				element_id_prefix,
				false,
				false,
				my.addFromForm
			);
			
		}
		
	};
	

	my.remove = function (al_id){

		my.languages_of_active_person.removeByID(al_id);
		
		dom.remove(my.element_id_prefix + al_id + "_div");

	};


	my.clearActivePersonLanguages = function(){

		my.languages_of_active_person.reset();

		g(my.element_id_prefix + "display").innerHTML = "";

	};
	

	my.set = function(ALO){

		my.languages_of_active_person.add(ALO);
		my.renderActorLanguage(g(my.element_id_prefix + "display"), ALO);

	};
	
	
	my.renderActorLanguage = function(parent, ALO){
	//ALO = ActorLanguageObject
	
		var div = dom.make("div",my.element_id_prefix + ALO.id + "_div",my.element_id_prefix + "entry", parent);
		
		APP.GUI.icon(div,"delete_lang_" + ALO.id + "_icon","delete_lang_icon", "reset", function(num) {
			return function(){ actor.languages.remove(num);  
			};
		}(ALO.id));
		
		
		dom.spanBR(div,"","", "ISO639-3 Code: " + ALO.iso_code);
		dom.span(div,"","", "Name: ");
		
		//If lang type is local and name has not been specified yet, put a message there
		if (ALO.name_type == "LOCAL"){

			var textInputValue = (ALO.name !== "") ? ALO.name : my.l("bundle", "specify_local_used_language_name");

			dom.textInput(
				div, my.element_id_prefix + ALO.id + "_name_input", "eldp_person_lang_name_input", "",
				textInputValue
			);
			
		}
		
		else {

			dom.span(div, "", "", ALO.name);
			
		}
		
		dom.br(div);
		
		
		dom.spanBR(div,"","", "Country ID: " + ALO.country_code);
		
		dom.br(div);
		//NOW: Additional information
		
		APP.GUI.makeTextarea(18, 4, div, my.l("languages", "additional_information"), my.element_id_prefix + ALO.id + "addInfo", my.element_id_prefix + ALO.id + "addInfo" , "className", ALO.additional_information, "");
		
	};


	my.addFromForm = function(LanguageObject){
		console.log(LanguageObject);
		//if actor language is added by user
		var first_added_language;

		if (my.languages_of_active_person.length === 0){
			first_added_language = true;
		}
		
		else {
			first_added_language = false;	
		}			
		
		//Let's create a new ActorLanguageObject
		var ALO = {
		
			iso_code: LanguageObject[0],	
			name: LanguageObject[3],
			country_code: LanguageObject[1],
			name_type: LanguageObject[2],
			
			additional_information: ""

		};

		my.set(ALO);  

	};
	
	return my;
	
})();
