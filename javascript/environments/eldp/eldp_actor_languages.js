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

	my.languages_of_active_actor = [];
	
	my.id_counter = 0;

	my.remove = function (al_id){


		var index = my.getActorLanguageObjectIndexFromID(al_id);

		my.languages_of_active_actor.splice(index,1);
		
		var child = g("actor_language_"+al_id+"_div");
		
		g("current_actor_languages_display").removeChild(child);

	};


	my.clearActiveActorLanguages = function(){

		while (my.languages_of_active_actor.length > 0){

			my.remove(my.languages_of_active_actor[0].id);
			
		}
		
		my.id_counter = 0;

	};
	

	my.getActorLanguageObjectIndexFromID = function (al_id){

		for (var l=0; l<my.languages_of_active_actor.length; l++){
		
			if (my.languages_of_active_actor[l].id == al_id){
				return l;
			}
		
		}

	};


	my.search = function(){
		var j;

		var input = g("actor_language_select").value;
		
		if (input.length < 3){
		
			g("actor_language_results_div").innerHTML = "";
			
			alertify.alert("Please specify your search request.\nType in at least 3 characters.");
			
			return;
		}
		
		var name_hits = [];
		
		var results = [];

		for (var i=0;i<LanguageIndex.length;i++){

			if (isSubstringAStartOfAWordInString(LanguageIndex[i][3],input)){
				
				//get an array with all relevant IDs
				name_hits.push(LanguageIndex[i][0]);
			}

		}
		
		//now we have all relevant languageIDs in name_hits. next step: get the L-names of theses language IDs.
		
		for (j=0;j<LanguageIndex.length;j++){
		
			if ( (name_hits.indexOf(LanguageIndex[j][0]) != -1)  &&  (LanguageIndex[j][2] == "L" )){		//look for their l-name entry
			
				results.push(LanguageIndex[j]);
				
			}
		
		}
		
		var titles = [];
		
		for (j=0;j<results.length;j++){

			titles.push(results[j][0] + ", "+results[j][1]+", " + results[j][3]);

		}		
		
		dom.showSelectFrame(results, titles, actor.languages.addFromForm, "Language Search: " + results.length + " result" + ((results.length == 1) ? "" : "s"),
		"(ISO639-3 Code, Country ID, Language Name)"); 

	};


	my.set = function(ActorLanguageObject){

		//LanguageObject is only a reference to the original array in the LanguageIndex.
		// We have to clone our Language Object from the DB first.
		// Otherwise we would overwrite the DB array which we do not want.
		// More info: http://davidwalsh.name/javascript-clone-array
		var LanguageObject = ActorLanguageObject.LanguageObject.slice(0);

		ActorLanguageObject.id = my.id_counter;
		
		my.languages_of_active_actor.push(ActorLanguageObject);
		
		var div = dom.newElement("div","actor_language_"+my.id_counter+"_div","current_actor_language_entry",g("current_actor_languages_display"));
		var img = dom.img(div,"delete_lang_"+my.id_counter+"_icon","delete_lang_icon", APP.CONF.path_to_icons+"reset.png");
		img.addEventListener('click', function(num) {
			return function(){ actor.languages.remove(num);  
			};
		}(my.id_counter) );
		
		dom.span(div,"","", "ISO639-3 Code: " + LanguageObject[0]);
		dom.br(div);
		dom.span(div,"","", "Name: " + LanguageObject[3]);
		dom.br(div);
		dom.span(div,"","", "Country ID: " + LanguageObject[1]);
		dom.br(div);
		
		var input = dom.input(div, "mothertongue_" + my.id_counter, "", "", "checkbox");
		
		if (ActorLanguageObject.MotherTongue === true){
			input.checked = true;
		}

		dom.span(div,"","", "Mother Tongue  ");
		input = dom.input(div, "primarylanguage_" + my.id_counter, "", "", "checkbox");
		
		if (ActorLanguageObject.PrimaryLanguage === true){
			input.checked = true;
		}
		
		dom.span(div,"","","Primary Language");

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


	my.addByISO = function(){

		var input = g("actor_language_iso_input").value;
		console.log("ADDING ISO LANGUAGE " + input);
		
		for (var j=0;j<LanguageIndex.length;j++){   //for all entries in LanguageIndex
		
			if ( (LanguageIndex[j][0] == input)  &&  (LanguageIndex[j][2] == "L")){		//look for their l-name entry
				
				my.addFromForm(LanguageIndex[j]);
				
				g("actor_language_iso_input").value = "";
				return;

			}

		}
		
		alertify.set({ labels: {
			ok: "OK"
		}});	
		
		alertify.alert("ISO code " + input + " not found in database.");

	};



	my.closeLanguageSelect = function(){

		g("actor_language_results_div").style.display = "none";
		g("ac_view").style.display = "inline";

	};
	
	
	return my;
	
})();
