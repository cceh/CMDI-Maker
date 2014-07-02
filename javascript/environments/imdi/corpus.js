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
	
	my.identity = {
		id: "corpus",
		title: "Corpus",
		icon: "box.png"
	};
	
	my.init = function(){
		
		var corpus_form = dom.newElement("div","corpus_form","",g(APP_CONF.view_id_prefix + my.identity.id));
		dom.newElement("h1","","",corpus_form,"Corpus");
		var p = dom.newElement("p","","",corpus_form);
		
		dom.makeTextInput(p,"Name","corpus_name","corpus_name","","A short archivable name of your corpus");
		dom.makeTextInput(p,"Title","corpus_title","corpus_title","","The complete and extensive title of your corpus");
		dom.makeTextarea(APP_CONF.form_textarea_rows,APP_CONF.form_textarea_columns,p,"Description","corpus_description","corpus_description","","","");
		
		g("corpus_name").onkeypress = function(e) {
			var chr = String.fromCharCode(e.which);
			
			if (APP_CONF.not_allowed_chars.indexOf(chr) >= 0){
				alertify.log("This character is not allowed here.","error",5000);
				return false;
			}
		};

		my.content_languages.init();
		
	}
	
	
	my.recall = function(corpus){
	
		g("corpus_name").value = corpus.name;
		g("corpus_title").value = corpus.title;
		g("corpus_description").value = corpus.description;
		
		my.content_languages.recall(corpus.content_languages);
	
	}
	
	
	my.getSaveData = function(){
	
		var object = {};
	
		object.name = g("corpus_name").value;
		object.title = g("corpus_title").value;
		object.description = g("corpus_description").value;
	
		object.content_languages = my.content_languages.getSaveData();
		
		return object;
	
	}
	
	
	my.functions = [
		{
			label: "Reset Form",
			icon: "reset.png",
			id: "link_reset_form",
			onclick: function() {       

				alertify.set({ labels: {
					ok     : "No",
					cancel : "Yes, delete form"
				} });
				
				alertify.confirm("Really?<br>You want to reset the form and delete corpus and all sessions?", function (e) {
					if (e) {
						// user clicked "ok"
					}
			
					else {
						// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
						APP.reset_form();
						alertify.log("Form reset","",5000);
						
					}
				});
			}
		}
	];
	
	
	my.isCorpusProperlyNamed = function (){

		if (get("corpus_name") == ""){
			
			return false;
			
		}
		
		for (var c=0; c<APP_CONF.not_allowed_chars.length; c++){
		
			if (get("corpus_name").indexOf(APP_CONF.not_allowed_chars[c]) != -1){
			
				return false;
				
			}
		
		}

		return true;

	}

	return my;
	
})();