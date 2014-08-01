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


imdi_environment.workflow[0].content_languages = (function() {
	var corpus;
	
	var my = {};
	
	my.content_languages = [];
	
	my.id_counter = 0;
	
	my.parent = imdi_environment;
	
	my.l = my.parent.l;
	

	my.init = function(view){
	
		corpus = imdi_environment.workflow[0];
	
		var cl = dom.newElement("div","content_languages","",view);
		
		var lsd = dom.div(cl, "lang_search_div", "");
		dom.h1(lsd, my.l("languages", "set_global_languages_of_content"));
		
		var span = dom.span(lsd);
		dom.input(span, "content_language_select", "", "content_language_select", "text", "");
		span.innerHTML += " ";
		dom.input(span, "content_language_search_button", "", "content_language_search_button", "button", my.l("search"));
		span.innerHTML += ' ' + my.l("languages", "or_type_in_iso_code") + ' ';
		dom.input(span, "content_language_iso_input", "", "content_language_iso_input", "text", "");
		span.innerHTML += " ";		
		dom.input(span, "content_language_iso_ok", "", "content_language_iso_ok", "button", my.l("ok"));

		var ccld = dom.div(cl, "current_content_languages_display", "");
		dom.h1(ccld, my.l("languages", "current_content_languages"));

		dom.div(cl, "content_language_results_div", "");
		
		
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
	
	};
	
	
	my.recall = function(LanguageObjects){
	
		forEach(LanguageObjects, my.set);
		
	};
	
	
	my.getSaveData = function(){
	
		return my.content_languages;
		
	};


	my.search = function(){

		var input = g("content_language_select").value;
		
		if (input.length < 3){
	
			APP.alert(my.l("languages", "specify_search_request_at_least_3_chars"));
			
			return;
		}
		
		var name_hits = [];
		
		var results = [];

		forEach(LanguageIndex, function(LanguageObject){
			
			if (isSubstringAStartOfAWordInString(LanguageObject[3],input)){
				
				//get an array with all relevant IDs
				name_hits.push(LanguageObject[0]);
			}

		});
		
		//now we have all relevant languageIDs in name_hits. next-step: get the L-names of theses language IDs. i.e. get the respective entries with the l-names.
		
		forEach(LanguageIndex, function(LanguageObject){   //for all entries in LanguageIndex
		
			if ( (name_hits.indexOf(LanguageObject[0]) != -1)  &&  (LanguageObject[2] == "L" )){		//look for their l-name entry
			
				results.push(LanguageObject);
			
			}
		
		});
		
		var titles = map(results, function(result){

			return result[0] + ", " + result[1] + ", " + result[3];

		});
		
		var heading = my.l("languages", "language_search") + ": " + results.length + " " +
		((results.length == 1) ? my.l("languages", "result") : my.l("languages", "results"));
		
		var subheading = "(ISO639-3 Code, Country ID, " + my.l("languages", "language_name") + ")";
		
		dom.showSelectFrame(results, titles, corpus.content_languages.choose, heading, subheading);
		
	};
	
	
	my.choose = function(LanguageObject){
	
		if (my.set(LanguageObject)){
			APP.log("\"" + LanguageObject[3]+"\" " + my.l("languages", "is_new_global"));	
		}
	
	};


	my.set = function(LanguageObjectFromDB){

		//LanguageObjectFromDB is only a reference to the original array in the LanguageIndex.
		// We have to clone our Language Object from the DB first.
		// Otherwise we would overwrite the DB array which we do not want.
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
			
				console.log("Error: LanguageObject.length = " + LanguageObject.length);
				break;
			
			}
		
		}
		
		console.log("Chosen Content Language: " + LanguageObject);
		
		my.content_languages.push(LanguageObject);
		
		my.render(LanguageObject, my.id_counter);
		
		my.id_counter+=1;
		
		return true;
		
	};
	
	
	my.render = function(LanguageObject, id){

		var div = dom.newElement("div","content_language_"+id+"_div","current_content_language_entry",g("current_content_languages_display"));
		
		dom.span(div,"","","ISO639-3 Code: " + LanguageObject[0]);
		
		var img = dom.img(div,"delete_lang_"+id+"_icon","delete_lang_icon",APP.CONF.path_to_icons+"reset.png");
		img.addEventListener('click', function(num) { 
			return function(){
				corpus.content_languages.remove(num);  
			};
		}(id) );
		
		dom.br(div);
		dom.span(div,"","","Name: " + LanguageObject[3]);
		dom.br(div);
		dom.span(div,"","","Country ID: " + LanguageObject[1]);

	};

	
	my.removeAll = function(){

		while (my.content_languages.length > 0){
		
			my.remove(my.content_languages[0][4]);  //remove always the first element of content_languages, until there are no elements anymore

		}
		
		my.id_counter = 0;

	};

	
	my.remove = function(cl_id){

		var index = my.getLanguageObjectIndexByID(cl_id);

		APP.log(
			my.l("languages", "content_language_removed__before_lang") +
			my.content_languages[index][3] +
			my.l("languages", "content_language_removed__after_lang")
		);

		my.content_languages.splice(index, 1);
		
		dom.remove("content_language_"+cl_id+"_div");

	};


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
		
		APP.alert(my.l("languages", "iso_code") + " " + input + " " + my.l("languages", "not_found_in_db") + ".");
		
	};
	
	
	my.getLanguageObjectIndexByID = function(cl_id){

		for (var l=0; l<my.content_languages.length; l++){
		
			if (my.content_languages[l][4] == cl_id){
				return l;
			}
		
		}

	};
	
	
	return my;
	
})();