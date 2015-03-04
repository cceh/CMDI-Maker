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
		
		//as form template we use always the default languge (english)
		var template = APP.forms.getTemplateFromDataObject(APP.languages[0].terms, "terms", "no_default_values");
		
		//get from each environment a form template from its first language
		var environment_language_templates = map(APP.environments.environments, function(env){
			
			var LP_0 = env.languages[0];
			var template = APP.forms.getTemplateFromDataObject(LP_0.terms, "terms", "no_default_values");
			return template;
			
		});
		
		forEach(APP.languages, function(LP){
			
			var terms = LP.terms;
		
			var id = LP.id;
		
			my.makeLPForm(view, template, id, terms, environment_language_templates);
			
		});
		
		//create form for new language
		my.makeLPForm(view, template, "new", undefined);
		
	}
	
	
	my.makeLPForm = function(parent, template, id, data, environment_language_templates){
		
		var form_wrapper = dom.div(parent, "form_" + id, "intl_form");
		
		var form_title = dom.h1(form_wrapper, id);
		
		APP.forms.make(form_wrapper, template, "intl_" + id + "_", "intl_", data, undefined);
		
		dom.br(form_wrapper);
		
		var save_link = dom.a(form_wrapper, "save_intl_" + id, "save_intl_link", undefined,
			"Save as JSON",
			function(){
				log("Saving intl form with id " + id + "as json");
				var data = APP.forms.makeObjectWithFormData(template, "intl_" + id + "_");
				
				APP.saveTextfile(JSON.stringify(data, null, "\t"), id + ".json");
			}
		);
		
		dom.br(form_wrapper);
		dom.br(form_wrapper);
		
		//Create form in this language for every loaded environment
		forEach(environment_language_templates, function(template){
			
			APP.forms.make(form_wrapper, template, "intl_" + id + "_", "intl_", data, undefined);
			
		});
		
	};
	
	
	my.view = function(){
		
		APP.view("VIEW_intl");
		
	}
	
	return my;
	
})();
