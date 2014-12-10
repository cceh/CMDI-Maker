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


imdi_environment.workflow[2].languages = (function (){
//Sub-object of actor
	'use strict';

	var my = {};
	var actor = imdi_environment.workflow[2];

	my.LOAA = new ObjectList();  //Languages of active actor
	
	my.parent = imdi_environment;
	var l = my.parent.l;
	
	my.element_id_prefix = actor.element_id_prefix + "languages_";
	
	my.init = function(view){

		return;
		
	};
	
	
	my.makeInputInForm = function(field, parent, element_id_prefix, element_class_prefix){

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

		my.LOAA.removeByID(al_id);
		
		dom.remove(my.element_id_prefix + al_id + "_div");

	};
	
	
	my.refreshLanguagesOfActiveActorInArray = function(){
	
		my.LOAA.forEach(function(ALO){
		
			ALO.MotherTongue = g("mothertongue_" + ALO.id).checked;
			ALO.PrimaryLanguage = g("primarylanguage_" + ALO.id).checked;
		
		});
		
	};


	my.clearActiveActorLanguages = function(){
		
		my.LOAA.reset();
		
		g(my.element_id_prefix + "display").innerHTML = "";

	};
	

	my.set = function(ALO){

		my.LOAA.add(ALO);
		actor.actors.getActive().languages.actor_languages = my.LOAA.getAll();
		my.renderActorLanguage(g(my.element_id_prefix + "display"), ALO);

	};
	
	
	
	my.renderActorLanguage = function(parent, ALO){
	
		var div = dom.make("div", my.element_id_prefix + ALO.id + "_div", my.element_id_prefix + "entry", parent);
		APP.GUI.icon(div,"","delete_lang_icon", "reset", function(num) {
			return function(){
				actor.languages.remove(num);  
			};
		}(ALO.id) );
		
		dom.spanBR(div,"","", "ISO639-3 Code: " + ALO.iso_code);
		dom.spanBR(div,"","", "Name: " + ALO.name);
		dom.spanBR(div,"","", "Country ID: " + ALO.country_id);
		
		var input = dom.input(div, "mothertongue_" + ALO.id, "", "", "checkbox");
		
		if (ALO.MotherTongue === true){
			input.checked = true;
		}

		dom.span(div,"","", l("languages", "mother_tongue") + "  ");
		input = dom.input(div, "primarylanguage_" + ALO.id, "", "", "checkbox");
		
		if (ALO.PrimaryLanguage === true){
			input.checked = true;
		}
		
		dom.span(div,"","",l("languages", "primary_language"));	
	
	};


	my.addFromForm = function(LanguageObject){
	//if actor language is added by user
		var first_added_language;

		if (my.LOAA.length === 0){
			first_added_language = true;
		}
		
		else {
			first_added_language = false;	
		}			
		
		//Let's create a new ActorLanguageObject
		var ALO = {
		
			name: LanguageObject[3],
			iso_code: LanguageObject[0],
			country_code: LanguageObject[1],
			type: LanguageObject[2],
			MotherTongue: first_added_language,
			PrimaryLanguage: first_added_language

		};

		my.set(ALO);  

	};
	
	return my;
	
})();
