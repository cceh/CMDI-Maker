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
	
		var view = dom.div(g("content_wrapper"), "VIEW_intl", "content");
		
		//as form template we use always the default languge (english)
		var template = APP.forms.getTemplateFromDataObject(APP.languages[0].terms, "terms", "no_default_values");
		
		log("template with no def values:");
		log(template);
		
		forEach(APP.languages, function(LP){
			
			var terms = LP.terms;
		
			var form_wrapper = dom.div(view, "form_" + LP.id, "intl_form");
			
			var form_title = dom.h1(form_wrapper, LP.id);
			
			APP.forms.make(form_wrapper, template, "intl_" + LP.id + "_", "intl_", terms, undefined);
			
			var save_link = dom.a(form_wrapper, "save_intl_" + LP.id, "save_intl_link", undefined,
				"Save as JSON",
				function(){
					log("Saving intl form with id " + LP.id + "as json");
					var data = APP.forms.makeObjectWithFormData(template, "intl_" + LP.id + "_");
					
					APP.saveTextfile(JSON.stringify(data, null, "\t"), LP.id + ".json");
				}
			);
			
		});
		
		
		//create form for new language
		var form_wrapper = dom.div(view, "form_new", "intl_form");
		
		var form_title = dom.h1(form_wrapper, "New LP");
		
		APP.forms.make(form_wrapper, template, "intl_new_", "intl_", undefined);
		
		var save_link = dom.a(form_wrapper, "save_intl_new", "save_intl_link", undefined,
			"Save as JSON",
			function(){
				log("Save to do");
			}
		);
		
	}
	
	
	my.view = function(){
		
		APP.view("VIEW_intl");
		
	}
	
	return my;
	
})();
