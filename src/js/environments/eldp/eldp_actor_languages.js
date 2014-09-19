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

	my.languages_of_active_person = [];
	
	my.element_id_prefix = actor.element_id_prefix + "languages_";
	
	my.id_counter = 0;
	
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

		var index = my.getActorLanguageObjectIndexFromID(al_id);

		my.languages_of_active_person.splice(index,1);
		
		dom.remove(my.element_id_prefix + al_id + "_div");

	};


	my.clearActivePersonLanguages = function(){

		while (my.languages_of_active_person.length > 0){

			my.remove(my.languages_of_active_person[0].id);
			
		}
		
		my.id_counter = 0;

	};
	

	my.getActorLanguageObjectIndexFromID = function (al_id){

		for (var l=0; l<my.languages_of_active_person.length; l++){
		
			if (my.languages_of_active_person[l].id == al_id){
				return l;
			}
		
		}

	};


	my.set = function(ALO){

		ALO.id = my.id_counter;
		
		my.languages_of_active_person.push(ALO);
		
		my.renderActorLanguage(g(my.element_id_prefix + "display"), ALO);

		my.id_counter += 1;

	};
	
	
	my.renderActorLanguage = function(parent, ALO){
	//ALO = ActorLanguageObject
	
		var div = dom.make("div",my.element_id_prefix + my.id_counter+"_div",my.element_id_prefix + "entry", parent);
		
		APP.GUI.icon(div,"delete_lang_"+my.id_counter+"_icon","delete_lang_icon", "reset", function(num) {
			return function(){ actor.languages.remove(num);  
			};
		}(my.id_counter));
		
		dom.spanBR(div,"","", "ISO639-3 Code: " + ALO.iso_code);
		dom.spanBR(div,"","", "Name: " + ALO.name);
		dom.spanBR(div,"","", "Country ID: " + ALO.country_code);
		
		var input = dom.input(div, "mothertongue_" + my.id_counter, "", "", "checkbox");
		
		if (ALO.MotherTongue === true){
			input.checked = true;
		}

		dom.span(div,"","", "Mother Tongue  ");
		input = dom.input(div, "primarylanguage_" + my.id_counter, "", "", "checkbox");
		
		if (ALO.PrimaryLanguage === true){
			input.checked = true;
		}
		
		dom.spanBR(div,"","","Primary Language");
		
		dom.br(div);
		//NOW: Additional information
		
		APP.GUI.makeTextarea(18, 4, div, "Additional Information", my.element_id_prefix + my.id_counter+ "addInfo", my.element_id_prefix + my.id_counter+ "addInfo" , "className", ALO.additional_information, "");
		
	};


	my.addFromForm = function(LanguageObject){
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
			
			MotherTongue: first_added_language,
			PrimaryLanguage: first_added_language,
			
			additional_information: ""

		};

		my.set(ALO);  

	};
	
	return my;
	
})();
