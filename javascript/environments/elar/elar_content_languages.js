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


elar_project.content_languages = (function() {

	var my = {};
	
	my.content_languages = [];
	
	my.id_counter = 0;
	

	my.init = function(){
	
		var div = dom.newElement("div","content_languages","",g("VIEW_elar_project"),
			'<div id="lang_search_div">'+
			'<h1>Set Global Languages of Content</h1>'+
			'<p><input type="text" name="content_language_select" id="content_language_select" size="1"> '+
			'<input type="button" id="content_language_search_button" value="Search"> or type in ISO code '+
			'<input type="text" name="content_language_iso_input" id="content_language_iso_input" size="1"> '+
			'<input type="button" id="content_language_iso_ok" value="OK">'+
			'</p>'+
			'</div>'+

			'<div id="current_content_languages_display">'+
			'<h1>Current Content Languages</h1>	'+			
			'</div>'+
					
			'<div id="content_language_results_div">'+
			'</div>'
		);
		
		g('content_language_search_button').addEventListener('click', function() {  corpus.content_languages.search();     });
		g('content_language_iso_ok').addEventListener('click', function() {  corpus.content_languages.addByISO();     });

		g("content_language_select").onkeydown = function(event) {

			if (event.keyCode == 13) {  //if enter is pressed
				corpus.content_languages.search();
			}
		};
		
		g("content_language_iso_input").onkeydown = function(event) {

			if (event.keyCode == 13) {  //if enter is pressed
				corpus.content_languages.addByISO();
			}
		};		
	
	}
	
	
	my.recall = function(data){
	
		for (var l=0;l<data.length;l++){
		
			my.set(data[l]);
			
		}
		
	}
	
	
	my.getSaveData = function(){
	
		return my.content_languages;
		
	}


	my.search = function(){

		var non_letters = " ,";

		var input = g("content_language_select").value;
		
		if (input.length < 3){
	
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
		
		//now we have all relevant languageIDs in name_hits. next-step: get the L-names of theses language IDs. i.e. get the respective entries with the l-names.
		
		for (var j=0;j<LanguageIndex.length;j++){   //for all entries in LanguageIndex
		
			if ( (name_hits.indexOf(LanguageIndex[j][0]) != -1)  &&  (LanguageIndex[j][2] == "L" )){		//look for their l-name entry
			
				results.push(LanguageIndex[j]);
			
			}
		
		}
		
		var titles = [];
		
		for (var j=0;j<results.length;j++){

			titles.push(results[j][0] + ", "+results[j][1]+", " + results[j][3]);

		}
		
		dom.showSelectFrame(results, titles, corpus.content_languages.choose, "Language Search: " + results.length + " result" + ((results.length == 1) ? "" : "s"),
		"(ISO639-3 Code, Country ID, Language Name)"); 
		
	}
	
	
	my.choose = function(LanguageObject){
	
		if (my.set(LanguageObject)){
			alertify.log("\"" + LanguageObject[3]+"\" is a new Global Content Language", "", "5000");	
		}
	
	}


	my.set = function(LanguageObjectFromDB){

		//LanguageObjectFromDB is only a reference to the original array in the LanguageIndex.
		// We have to clone our Language Object from the DB first.
		// Otherwise we would overwrite the DB array which we do not want.
		// More info: http://davidwalsh.name/javascript-clone-array
		var LanguageObject = LanguageObjectFromDB.slice(0);

		//add an id to the object before it goes to content_languages
		
		switch (LanguageObject.length){
		
			case 4: {
			
				LanguageObject.push(my.id_counter);
				break;
			}
			
			case 5: {
			
				LanguageObject[4] = my.id_counter;
				break;
				
			}
			
			default: {
			
				console.log("Error: LanguageObject.length = "+LanguageObject.length);
				break;
			
			}
		
		}
		
		console.log("Chosen Content Language: " + LanguageObject);
		
		my.content_languages.push(LanguageObject);
		
		var div = dom.newElement("div","content_language_"+my.id_counter+"_div","current_content_language_entry",g("current_content_languages_display"));
		
		dom.newElement("span","","",div,"ISO639-3 Code: " + LanguageObject[0]);
		
		var img = dom.newElement("img","delete_lang_"+my.id_counter+"_icon","delete_lang_icon",div);
		img.src = path_to_icons+"reset.png";
		img.addEventListener('click', function(num) { 
			return function(){
				corpus.content_languages.remove(num);  
			};
		}(my.id_counter) );
		
		dom.newElement("br","","",div);
		dom.newElement("span","","",div,"Name: " + LanguageObject[3]);
		dom.newElement("br","","",div);
		dom.newElement("span","","",div,"Country ID: " + LanguageObject[1]);

		my.id_counter+=1;
		
		return true;
		
	}

	
	my.removeAll = function(){

		while (my.content_languages.length > 0){
		
			my.remove(my.content_languages[0][4]);  //remove always the first element of content_languages, until there are no elements anymore

		}
		
		my.id_counter = 0;

	}

	
	my.remove = function(cl_id){

		var index = my.getLanguageObjectIndexByID(cl_id);

		alertify.log("Content Language \"" + my.content_languages[index][3] + "\" removed","",5000);

		my.content_languages.splice(index,1);
		
		dom.remove("content_language_"+cl_id+"_div");

	}


	my.addByISO = function(){

		var input = g("content_language_iso_input").value;
		console.log("ADDING ISO LANGUAGE " + input);
		
		for (var j=0;j<LanguageIndex.length;j++){   //for all entries in LanguageIndex
		
			if ( (LanguageIndex[j][0] == input)  &&  (LanguageIndex[j][2] == "L")){		//look for their l-name entry

				my.choose(LanguageIndex[j]);
				g("content_language_iso_input").value = "";
				return;

			}

		}
		
		alertify.set({ labels: {
			ok     : "OK"
		} });
		
		alertify.alert("ISO code " + input + " not found in database.");
		

	}
	
	
	my.getLanguageObjectIndexByID = function(cl_id){

		for (var l=0; l<my.content_languages.length; l++){
		
			if (my.content_languages[l][4] == cl_id){
				return l;
			}
		
		}

	}
	
	
	return my;
	
})();