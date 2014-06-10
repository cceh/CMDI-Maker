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


var content_languages = (function() {

	var my = {};
	
	my.content_languages = [];
	
	//Auto save my.content_languages (not yet implemented!)
	my.save = my.content_languages;
	
	my.id_counter = 0;


	my.search = function(){

		var non_letters = " ,";


		var input = g("content_language_select").value;
		
		
		if (input.length < 3){
		
			g("content_language_results_div").innerHTML = "";
			
			my.closeCLS();
			
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
				
				//name_hits.splice(name_hits.indexOf(LanguageIndex[j][0]),1);   //delete the ID in name_hits, so that it won't be taken/chosen again
			
			}
		
		
		
		}
		
		
		var clrd = g("content_language_results_div");	
		clrd.style.display = "block";
		
		g("current_content_languages_display").style.display = "none";
		
		clrd.innerHTML = "";
		
		dom.newElement("h1","","",clrd,"Language Search: " + results.length + " result" + ((results.length == 1) ? "" : "s")); 
		
		var img = dom.newElement("img","close_clrd_icon","",clrd);
		//clrd = content language results div
		img.src = path_to_icons + "reset.png";
		img.addEventListener('click', function() { 
			content_languages.closeCLS();  
		} );
		
		dom.newElement("h3","","",clrd, "(ISO639-3 Code, Country ID, Language Name)");

		
		for (var j=0;j<results.length;j++){
		
			var a = dom.newElement("a",'cl_results_link_'+j,'cl_results_link',clrd);
			dom.newElement("div","",'content_lang_search_entry',a,results[j][0] + ", "+results[j][1]+", " + results[j][3]);
			a.href = '#';
		
			a.addEventListener('click', function(num) { 
				return function(){
					content_languages.set(num);  
				};
			}(results[j]) );
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
				content_languages.remove(num);  
			};
		}(my.id_counter) );
		
		dom.newElement("br","","",div);
		dom.newElement("span","","",div,"Name: " + LanguageObject[3]);
		dom.newElement("br","","",div);
		dom.newElement("span","","",div,"Country ID: " + LanguageObject[1]);

		my.closeCLS();

		alertify.log("\"" + LanguageObject[3]+"\" is a new Global Content Language", "", "5000");
		
		my.id_counter+=1;
		
	}

	my.closeCLS = function(){

		g("content_language_results_div").style.display = "none";
		g("current_content_languages_display").style.display = "inline";

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

				my.set(LanguageIndex[j]);
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