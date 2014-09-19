﻿/*
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

	my.languages_of_active_actor;
	
	my.parent = imdi_environment;
	var l = my.parent.l;
	
	my.element_id_prefix = actor.element_id_prefix + "languages_";
	
	my.id_counter = 0;
	
	my.init = function(view){

		my.languages_of_active_actor = [];
		
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

		var index = my.getActorLanguageObjectIndexFromID(al_id);

		my.languages_of_active_actor.splice(index,1);
		
		dom.remove(my.element_id_prefix + al_id + "_div");

	};


	my.clearActiveActorLanguages = function(){
		
		while (my.languages_of_active_actor.length > 0){
			
			console.log("removing " + my.languages_of_active_actor[0].id);
			
			my.remove(my.languages_of_active_actor[0].id);
			
		}
		
		my.id_counter = 0;

	};
	

	my.getActorLanguageObjectIndexFromID = function (al_id){

		return getIndex(my.languages_of_active_actor, "id", al_id);

	};


	my.set = function(ActorLanguageObject){

		//LanguageObject is only a reference to the original array in the LanguageIndex.
		// We have to clone our Language Object from the DB first.
		// Otherwise we would overwrite the DB array which we do not want.
		// More info: http://davidwalsh.name/javascript-clone-array
		var LanguageObject = ActorLanguageObject.LanguageObject.slice(0);

		ActorLanguageObject.id = my.id_counter;
		
		my.languages_of_active_actor.push(ActorLanguageObject);
		
		var div = dom.newElement("div", my.element_id_prefix + my.id_counter+"_div",my.element_id_prefix + "entry",g(my.element_id_prefix + "display"));
		var img = APP.GUI.icon(div,"","delete_lang_icon", "reset", function(num) {
			return function(){ actor.languages.remove(num);  
			};
		}(my.id_counter) );
		
		dom.spanBR(div,"","", "ISO639-3 Code: " + LanguageObject[0]);
		dom.spanBR(div,"","", "Name: " + LanguageObject[3]);
		dom.spanBR(div,"","", "Country ID: " + LanguageObject[1]);
		
		var input = dom.input(div, "mothertongue_" + my.id_counter, "", "", "checkbox");
		
		if (ActorLanguageObject.MotherTongue === true){
			input.checked = true;
		}

		dom.span(div,"","", l("languages", "mother_tongue") + "  ");
		input = dom.input(div, "primarylanguage_" + my.id_counter, "", "", "checkbox");
		
		if (ActorLanguageObject.PrimaryLanguage === true){
			input.checked = true;
		}
		
		dom.span(div,"","",l("languages", "primary_language"));

		my.id_counter += 1;

	};


	my.addFromForm = function(LanguageObject){
	//if actor language is added by user
		var first_added_language;

		if (my.languages_of_active_actor.length === 0){
			first_added_language = true;
		}
		
		else {
			first_added_language = false;	
		}			
		
		//Let's create a new ActorLanguageObject
		var ActorLanguageObject = {
		
			LanguageObject: LanguageObject,
			MotherTongue: first_added_language,
			PrimaryLanguage: first_added_language

		};

		my.set(ActorLanguageObject);  

	};
	
	return my;
	
})();