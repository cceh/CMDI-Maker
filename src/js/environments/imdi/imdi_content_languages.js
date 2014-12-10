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

	//PRIVATE

	var corpus;
	
	var refresh = function(){
	
		my.content_languages.forEach(my.render);	
	
	};
	
	
	//PUBLIC
	
	var my = {};
	
	my.content_languages = new ObjectList();
	
	my.parent = imdi_environment;
	my.l = my.parent.l;
	

	my.init = function(view){
	
		corpus = imdi_environment.workflow[0];
	
		var cl = dom.make("div","content_languages","",view);
		
		var lsd = dom.div(cl, "lang_search_div", "");
		dom.h1(lsd, my.l("languages", "set_global_languages_of_content"));
		
		APP.GUI.makeLanguageSearchForm(
			lsd, 
			"content_language_", 
			true, 
			true,
			my.choose
		);
		
		var ccld = dom.div(cl, "content_languages_display", "");
		dom.h1(ccld, my.l("languages", "current_content_languages"));
	
	};
	
	
	my.recall = function(data){
	
		my.content_languages.setState(data);
		refresh();
		
	};
	
	
	my.getSaveData = function(){
	
		return my.content_languages.getState();
		
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
		var CLO = cloneObject(LanguageObjectFromDB);

		my.content_languages.add(CLO);
		
		refresh();
		
		return true;
		
	};
	
	
	my.render = function(LanguageObject){
	
		var id = LanguageObject.id;

		var div = dom.make("div","content_language_"+id+"_div","content_language_entry", g("content_languages_display"));
		
		dom.span(div,"","","ISO639-3 Code: " + LanguageObject[0]);
		
		var img = APP.GUI.icon(div,"delete_lang_"+id+"_icon","delete_lang_icon", "reset");
		img.addEventListener('click', function(num) { 
			return function(){
				corpus.content_languages.removeByID(num);  
			};
		}(id) );
		
		dom.br(div);
		dom.spanBR(div,"","","Name: " + LanguageObject[3]);
		dom.span(div,"","","Country ID: " + LanguageObject[1]);

	};

	
	my.removeAll = function(){

		my.content_languages.reset();
		refresh();

	};	
	
	return my;
	
})();