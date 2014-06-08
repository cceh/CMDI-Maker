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



function searchContentLanguage(){

	var non_letters = " ,";


	var input = g("content_language_select").value;
	
	
	if (input.length < 3){
	
		g("content_language_results_div").innerHTML = "";
		
		close_content_language_select();
		
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
	
	
	
	var h1 = document.createElement("h1");
	h1.innerHTML = "Language Search: " + results.length + " result" + ((results.length == 1) ? "" : "s"); 
	clrd.appendChild(h1);
	
	var img = document.createElement("img");
	img.id = "close_clrd_icon";
	//clrd = content language results div
	img.src = "img/icons/reset.png";
	clrd.appendChild(img);
	
	
	img.addEventListener('click', function() { 
		close_content_language_select();  
	} );
	
	var h3 = document.createElement("h3");
	h3.innerHTML = "(ISO639-3 Code, Country ID, Language Name)";
	clrd.appendChild(h3);
	

	
	for (var j=0;j<results.length;j++){
	
		var a = document.createElement("a");
		a.id = 'cl_results_link_'+j;
		a.className = 'cl_results_link';
		a.href = '#';
		
		clrd.appendChild(a);
		
		a.innerHTML = "<div class='content_lang_search_entry'>" + results[j][0] + ", "+results[j][1]+", " + results[j][3] + "</div>";
	
	}
	
	for (var j=0;j<results.length;j++){
		//adding event listeners to objects has to be executed in a separate for loop. otherwise .innerHTML would overwrite them again.
		
		g('cl_results_link_'+j).addEventListener('click', function(num) { 
		return function(){ set_content_language(num);  
		};
		}(results[j]) );
	}
	
	
	
}


function set_content_language(LanguageObjectFromDB){

	//LanguageObjectFromDB is only a reference to the original array in the LanguageIndex.
	// We have to clone our Language Object from the DB first.
	// Otherwise we would overwrite the DB array which we do not want.
	// More info: http://davidwalsh.name/javascript-clone-array
	var LanguageObject = LanguageObjectFromDB.slice(0);


	//add an id to the object before it goes to content_languages
	
	switch (LanguageObject.length){
	
		case 4: {
		
			LanguageObject.push(counters.cl_id);
			break;
		}
		
		case 5: {
		
			LanguageObject[4] = counters.cl_id;
			break;
			
		}
		
		default: {
		
			console.log("Error: LanguageObject.length = "+LanguageObject.length);
			break;
		
		}
	
	}
	
	console.log("Chosen Content Language: " + LanguageObject);
	
	content_languages.push(LanguageObject);
	
	var div = dom.newElement("div","content_language_"+counters.cl_id+"_div","current_content_language_entry",g("current_content_languages_display"));
	
	var span = document.createElement("span");
	span.innerHTML = "ISO639-3 Code: " + LanguageObject[0];
	div.appendChild(span);
	
	var img = dom.newElement("img","delete_lang_"+counters.cl_id+"_icon","delete_lang_icon",div);
	
	img.src = path_to_icons+"reset.png";
	
	img.addEventListener('click', function(num) { 
		return function(){ RemoveLanguage(num);  
		};
	}(counters.cl_id) );
	
	var br = document.createElement("br");
	div.appendChild(br);
	
	span = document.createElement("span");
	span.innerHTML = "Name: " + LanguageObject[3];
	div.appendChild(span);
	
	br = document.createElement("br");
	div.appendChild(br);
	
	span = document.createElement("span");
	span.innerHTML = "Country ID: " + LanguageObject[1];
	div.appendChild(span);

	close_content_language_select();

	alertify.log("\"" + LanguageObject[3]+"\" is a new Global Content Language", "", "5000");
	
	counters.cl_id+=1;
	
}

function close_content_language_select(){

	g("content_language_results_div").style.display = "none";
	g("current_content_languages_display").style.display = "inline";

}


function RemoveAllContentLanguages(){

	while (content_languages.length > 0){
	
		RemoveLanguage(content_languages[0][4]);  //remove always the first element of content_languages, until there are no elements anymore

	}
	
	counters.cl_id = 0;

}

function RemoveLanguage(cl_id){

	var index = GetLanguageObjectIndexFromID(cl_id);

	alertify.log("Content Language \"" + content_languages[index][3] + "\" removed","",5000);

	content_languages.splice(index,1);
	
	var child = document.getElementById("content_language_"+cl_id+"_div");
	
	document.getElementById("current_content_languages_display").removeChild(child);

}



function addISOLanguage(){

	var input = g("content_language_iso_input").value;
	console.log("ADDING ISO LANGUAGE " + input);
	
	for (var j=0;j<LanguageIndex.length;j++){   //for all entries in LanguageIndex
	
		if ( (LanguageIndex[j][0] == input)  &&  (LanguageIndex[j][2] == "L")){		//look for their l-name entry

			set_content_language(LanguageIndex[j]);
			g("content_language_iso_input").value = "";
			return;

		}

	}
	
	alertify.alert("ISO code " + input + " not found in database.");
	

}