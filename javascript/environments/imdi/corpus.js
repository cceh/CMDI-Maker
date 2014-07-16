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
	
	my.corpus = {
	
		name: "",
		title: "",
		description: ""
	
	};
	
	my.form_id_prefix = "corpus_";
	
	my.reset = function(){
	
		APP.forms.fill(my.parent.corpus_form, my.form_id_prefix);
		my.content_languages.removeAll();
	
	};
	
	
	my.identity = {
		id: "corpus",
		title: "Corpus",
		icon: "box.png"
	};
	
	my.parent = imdi_environment;
	my.l = my.parent.l;
	
	my.init = function(){
		
		var corpus_form = dom.newElement("div","corpus_form","",g(APP.CONF.view_id_prefix + my.identity.id));
		dom.newElement("h1","","",corpus_form,"Corpus");
		
		APP.forms.make(corpus_form, my.parent.corpus_form, my.form_id_prefix, my.form_id_prefix);

		my.content_languages.init();
		
	}
	
	
	my.recall = function(corpus){
	
		APP.forms.fill(my.parent.corpus_form, my.form_id_prefix, corpus);
		
		my.content_languages.recall(corpus.content_languages);
	
	}
	
	
	my.getSaveData = function(){
	
		var object = APP.forms.makeObjectWithFormData(my.parent.corpus_form, my.form_id_prefix);
	
		object.content_languages = my.content_languages.getSaveData();
		
		return object;
	
	}
	
	
	my.functions = function(){
		return [
			{
				label: my.l("reset_form"),
				icon: "reset.png",
				id: "link_reset_form",
				onclick: function() {     

					alertify.set({ labels: {
						ok     : my.l("no"),
						cancel : my.l("yes_delete_form")
					} });
					
					alertify.confirm(my.l("really_reset_form"), function (e) {
						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							APP.environments.resetActive();
							alertify.log(my.l("form_reset"),"",5000);
							
						}
					});
				}
			}
		];
	};
	
	
	my.isCorpusProperlyNamed = function (){

		if (get(my.form_id_prefix + "name") == ""){
			
			return false;
			
		}
		
		for (var c=0; c<APP.CONF.not_allowed_chars.length; c++){
		
			if (get(my.form_id_prefix + "name").indexOf(APP.CONF.not_allowed_chars[c]) != -1){
			
				return false;
				
			}
		
		}

		return true;

	}

	return my;
	
})();