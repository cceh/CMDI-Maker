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

var languages_of_active_actor = [];

function RemoveActorLanguage(al_id){


	var index = GetActorLanguageObjectIndexFromID(al_id);

	languages_of_active_actor.splice(index,1);
	
	var child = document.getElementById("actor_language_"+al_id+"_div");
	
	document.getElementById("current_actor_languages_display").removeChild(child);

}


function show_languages_of_active_actor(){

	for (var l=0; l < actors[active_actor].languages.length; l++){
	
	
		set_actor_language( actors[active_actor].languages[l] );
	
	}

}


function clear_active_actor_languages(){

	while (languages_of_active_actor.length > 0){

		RemoveActorLanguage(languages_of_active_actor[0].id);
		
	}
	
	counters.al_id = 0;

}


function search_actor_language(){

	var input = g("actor_language_select").value;
	
	if (input.length < 3){
	
		g("actor_language_results_div").innerHTML = "";
		
		close_actor_language_select();
		
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
	
	//now we have all relevant languageIDs in name_hits. next-step: get the L-names of theses language IDs.
	
	for (var j=0;j<LanguageIndex.length;j++){
	
		if ( (name_hits.indexOf(LanguageIndex[j][0]) != -1)  &&  (LanguageIndex[j][2] == "L" )){		//look for their l-name entry
		
			results.push(LanguageIndex[j]);
			
			//name_hits.splice(name_hits.indexOf(LanguageIndex[j][0]),1);   //delete the ID in name_hits, so that it won't be taken/chosen again
		
		}
	
	
	
	}
	
	g("ac_view").style.display = "none";
	
	
	var alrd = g("actor_language_results_div");	
	
	alrd.style.display = "block";
	alrd.innerHTML = "";
	
	var h1 = document.createElement("h1");
	h1.innerHTML = "Language Search: " + results.length + " result" + ((results.length == 1) ? "" : "s"); 
	alrd.appendChild(h1);
	
	var img = document.createElement("img");
	img.id = "close_alrd_icon";
	//clrd = content language results div
	img.src = "img/icons/reset.png";
	alrd.appendChild(img);
	
	
	img.addEventListener('click', function() { 
		close_actor_language_select();  
	} );
	
	var h3 = document.createElement("h3");
	h3.innerHTML = "(ISO639-3 Code, Country ID, Language Name)";
	alrd.appendChild(h3);
	

	
	for (var j=0;j<results.length;j++){
	
		var a = document.createElement("a");
		a.id = 'al_results_link_'+j;
		a.className = 'al_results_link';
		a.href = '#';
		
		alrd.appendChild(a);
		
		a.innerHTML = "<div class='actor_lang_search_entry'>" + results[j][0] + ", "+results[j][1]+", " + results[j][3] + "</div>";
	
	}
	
	for (var j=0;j<results.length;j++){
		//adding event listeners to objects has to be executed in a separate for loop. otherwise .innerHTML would overwrite them again.
		
		g('al_results_link_'+j).addEventListener('click', function(num) { 
			return function(){ 
				
				add_language_from_form(num);
				
			};
		}(results[j]) );
	}

}


function set_actor_language(ActorLanguageObject){

	//LanguageObject is only a reference to the original array in the LanguageIndex.
	// We have to clone our Language Object from the DB first.
	// Otherwise we would overwrite the DB array which we do not want.
	// More info: http://davidwalsh.name/javascript-clone-array
	var LanguageObject = ActorLanguageObject.LanguageObject.slice(0);

	ActorLanguageObject.id = counters.al_id;
	
	languages_of_active_actor.push(ActorLanguageObject);
	
	var div = new_element("div","actor_language_"+counters.al_id+"_div","current_actor_language_entry",g("current_actor_languages_display"));
	var img = new_element("img","delete_lang_"+counters.al_id+"_icon","delete_lang_icon",div);
	img.src = path_to_images+"icons/reset.png";
	img.addEventListener('click', function(num) { 
		return function(){ RemoveActorLanguage(num);  
		};
	}(counters.al_id) );
	
	new_element("span","","",div, "ISO639-3 Code: " + LanguageObject[0]);
	new_element("br","","",div);
	new_element("span","","",div, "Name: " + LanguageObject[3]);
	new_element("br","","",div);
	new_element("span","","",div, "Country ID: " + LanguageObject[1]);
	new_element("br","","",div);
	
	var input = new_element("input", "mothertongue_" + counters.al_id, "", div);
	input.type = "checkbox";
	
	if (ActorLanguageObject.MotherTongue == true){
		input.checked = true;
	}

	new_element("span","","",div, "Mother Tongue  ");
	var input = new_element("input", "primarylanguage_" + counters.al_id, "", div);
	input.type = "checkbox";
	
	if (ActorLanguageObject.PrimaryLanguage == true){
		input.checked = true;
	}
	
	new_element("span","","",div, "Primary Language");

	close_actor_language_select();

	counters.al_id+=1;

}


function add_language_from_form(LanguageObject){

	if (languages_of_active_actor.length == 0){
		var first_added_language = true;
	}
	
	else {
		var first_added_language = false;	
	}			
	
	//Let's create a new ActorLanguageObject
	var ActorLanguageObject = {
	
		LanguageObject: LanguageObject,
		MotherTongue: first_added_language,
		PrimaryLanguage: first_added_language

	};

	set_actor_language(ActorLanguageObject);  

}


function addactorISOLanguage(){

	var input = g("actor_language_iso_input").value;
	console.log("ADDING ISO LANGUAGE " + input);
	
	for (var j=0;j<LanguageIndex.length;j++){   //for all entries in LanguageIndex
	
		if ( (LanguageIndex[j][0] == input)  &&  (LanguageIndex[j][2] == "L")){		//look for their l-name entry
			
			add_language_from_form(LanguageIndex[j]);
			
			g("actor_language_iso_input").value = "";
			return;

		}

	}
	
	alertify.set({ labels: {
		ok: "OK"
	}});	
	
	alertify.alert("ISO code " + input + " not found in database.");

}



function close_actor_language_select(){

	g("actor_language_results_div").style.display = "none";
	g("ac_view").style.display = "inline";

}
