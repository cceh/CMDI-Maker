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


APP.intl = (function () {
	'use strict';

	var my = {};
	
	my.init = function(){
	
		if (!g("VIEW_intl")){
			var view = dom.div(g("content_wrapper"), "VIEW_intl", "content");
		}
		
		else {
			view = g("VIEW_intl");
			view.innerHTML = "";
		}		
	
	}
	
	
	//When this page gets viewed, re-initialize it and refresh it with all the new environments now available
	my.view = function(){
		
		if (!g("VIEW_intl")){
			var view = dom.div(g("content_wrapper"), "VIEW_intl", "content");
		}
		
		else {
			view = g("VIEW_intl");
			view.innerHTML = "";
		}
		
		var introduction = dom.p(view, "", "internationalization_introduction", "");
		introduction.innerHTML = "CMDI Maker was originally created to support linguists all over the world to create XML metadata. " +
		"This is the reason for implementing this internationalization module, where you can create, edit or just have a look at Language Packs (LPs) for the app.<br>" +
		"You can import them by including the resulting JSON files in the CMDI Maker source code or in the source code of the respective CMDI Maker environment.<br><br>"+
		"If you are not sure about translating tech terms, maybe <a target='_blank' href='http://www.microsoft.com/Language/en-US/Search.aspx?sString=Abort&langID=es-es'>Microsoft Terminology Search</a> is of help!<br>"+
		"English is the default and reference language. Translations should always take this language as source.";

		
		//templates of app core and each environment
		var templates = [];
		
		//as form template we use always the default languge (english)
		var app_core_template = APP.forms.getTemplateFromDataObject(APP.languages[0].terms, "core_terms", "no_default_values");
		
		templates.push(app_core_template);
		
		//get from each environment a form template from its first language
		forEach(APP.environments.environments, function(env){
			
			if (env.languages){
				var LP_0 = env.languages[0];
				var env_template = APP.forms.getTemplateFromDataObject(LP_0.terms, env.id + "_terms", "no_default_values");
				templates.push(env_template);
			}
			
			else {
				templates.push(undefined);
			}
			
		});
		
		log(templates);
		
		//The idea is: every environment language must be supported by the APP CORE too. it wouldn't make sense to have only the environment
		//but not the app core in french. that is why we create only forms for the languages supported by app core
		//as well as an empty column for a new language. the user can then create LPs for all loaded environments in the new language.
		forEach(APP.languages, function(APP_CORE_LP, i){
			
			var id = APP_CORE_LP.id;
			
			var all_LPs_of_one_language = [];
			all_LPs_of_one_language.push(APP_CORE_LP);
			
			//get languages packs of all environments for this language
			forEach(APP.environments.environments, function(env, j){
			
				if (env.languages && env.languages[i]){
					all_LPs_of_one_language.push(env.languages[i]);
				}
				
				else {
					all_LPs_of_one_language.push(undefined);
				}
			
			});	
		
			my.makeFormColumnForLanguage(view, id, templates, all_LPs_of_one_language);
			
		});
		
		//create column for new language
		my.makeFormColumnForLanguage(view, "new", templates, undefined);
		
		
		dom.scrollTop(view);
		
	};
	
	
	//creates a LP form for one language with all environments that are supporting that language
	my.makeFormColumnForLanguage = function(parent, id, templates, LPs){
		
		var form_wrapper = dom.div(parent, "form_" + id, "intl_form");
		var form_title = dom.h1(form_wrapper, id);
		
		if (LPs){
			var CORE_LP = LPs[0];
		}
		
		my.makeLPForm(form_wrapper, templates[0], id + "_core", "APP CORE", CORE_LP);
		
		//Create form in this language for every loaded environment
		for (var t = 1; t < templates.length; t++){
			
			var template = templates[t];
			if (LPs){
				var LP = LPs[t];
			}

			if (LP){
				
				var environment_id = APP.environments.environments[t-1].id;
				
				//Tell again, which language it is
				dom.h1(form_wrapper, id);
				
				my.makeLPForm(form_wrapper, template, id + "_" + environment_id, "Environment: " + environment_id, LP);
				
			}
			
		}

	};
	
	
	var deleteEmptyStringsInObject = function(obj){
	
		for (var key in obj){
		
			if (typeof obj[key] == "string" && obj[key] == ""){
				
				delete obj[key];
				
			}
			
			if (typeof obj[key] == "object"){
			
				deleteEmptyStringsInObject(obj[key]);
			
			}
			
		}
	
	}
	
	
	my.makeLPForm = function(parent, template, id, title, LP){
		
		if (LP){
			var data = LP.terms;
		}
		
		dom.h2(parent, title);
		log(template);
		APP.forms.make(parent, template, "intl_" + id + "_", "intl_", data, undefined);
		
		dom.br(parent);
		
		var save_link = dom.a(parent, "save_intl_" + id, "save_intl_link", undefined,
			"Save as JSON",
			function(){
				log("Saving intl form with id " + id + "as json");
				var data = APP.forms.makeObjectWithFormData(template, "intl_" + id + "_");
				
				deleteEmptyStringsInObject(data);				
				
				APP.saveTextfile(JSON.stringify(data, null, "\t"), id + ".json");
			}
		);
		
		
		dom.br(parent);
		dom.br(parent);
		dom.br(parent);
		dom.br(parent);
		
	};

	
	return my;
	
})();
