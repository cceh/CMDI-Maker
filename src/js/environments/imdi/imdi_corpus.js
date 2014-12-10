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


imdi_environment.workflow[0] = (function(){

	var my = {};
	
	my.parent = imdi_environment;
	var corpus_form_template;
	
	my.form_id_prefix = "corpus_";
	
	my.reset = function(){
	
		APP.forms.fill(corpus_form_template, my.form_id_prefix);
		my.content_languages.removeAll();
	
	};
	
	
	my.identity = {
		id: "corpus",
		title: "Corpus",
		icon: "box"
	};
	
	
	my.l = my.parent.l;
	
	my.init = function(view){
	
		corpus_form_template = my.parent.corpus_form();
		
		var div = dom.make("div","corpus_form","",view);
		dom.make("h1", "", "", div, "Corpus");
		
		APP.forms.make(div, corpus_form_template, my.form_id_prefix, my.form_id_prefix);

		my.content_languages.init(view);
		
	}
	
	
	my.recall = function(corpus){
	
		APP.forms.fill(corpus_form_template, my.form_id_prefix, corpus);
		
		my.content_languages.recall(corpus.content_languages);
	
	}
	
	
	my.getSaveData = function(){
	
		var object = APP.forms.makeObjectWithFormData(corpus_form_template, my.form_id_prefix);
	
		object.content_languages = my.content_languages.getSaveData();
		
		return object;
	
	}
	
	
	my.functions = function(){
		return [];
	};
	
	
	my.isCorpusProperlyNamed = function (){

		if (get(my.form_id_prefix + "name") == ""){
			
			return false;
			
		}
		
		for (var c=0; c<my.parent.not_allowed_chars.length; c++){
		
			if (get(my.form_id_prefix + "name").indexOf(my.parent.not_allowed_chars[c]) != -1){
			
				return false;
				
			}
		
		}

		return true;

	}

	return my;
	
})();