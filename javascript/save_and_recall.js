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

var save_and_recall = (function(){

	var my = {};
	
	my.interval;
	my.interval_time = 60;

	my.get_recall_data = function(){

		var form = localStorage.getItem("form");

		if (!form){
			console.log("No recall data found");
			session.displayNoSessionText();
			my.set_autosave_interval(my.interval_time);
			APP.view("default");
			return;
		}
		
		var form_object = JSON.parse(form);
		
		console.log("Recall object: ");
		console.log(form_object);
		
		my.fill_form(form_object);	
		
	}


	my.set_autosave_interval = function(time){

		window.clearInterval(my.interval);
		
		if (time == -1){

			console.log("Auto Save off");
			return;
			//nothing to do here because interval is already cleared. just return
		
		}
		
		console.log("Auto Save Time in seconds: " + time);
		
		my.interval_time = time;
		
		// if not switched off
		my.interval = window.setInterval(function() { my.save_form(); },my.interval_time*1000);

	}


	my.fill_form = function(recall_object){

		console.log("Filling the form with recalled data");
		
		g("metadata_language_select").selectedIndex = recall_object.settings.metadata_language;
		g("metadata_creator").value = recall_object.settings.metadata_creator;
		dom.setRadioIndex(document.metadata_form.output_format, recall_object.settings.output_format);
		
		if (recall_object.settings.calc_actors_age == true){
		
			document.metadata_form.radio_age_calc[0].checked = true;
		
		}
		
		else {
		
			document.metadata_form.radio_age_calc[1].checked = true;	
		
		}
		
		for (var l=0;l<recall_object.content_languages.length;l++){
		
			content_languages.set(recall_object.content_languages[l]);
			
		}
		
		resources.available_resources = recall_object.available_resources;
		resources.refreshFileListDisplay();
		my.fill_corpus(recall_object.corpus);
		session.eraseAll();
		
		for (var s=0; s<recall_object.sessions.length; s++){
		
			session.newSession(recall_object.sessions[s]);
		
		}
		
		if (session.sessions.length == 0){
			session.displayNoSessionText();
		}
		
		my.set_autosave_interval(recall_object.settings.save_interval_time);

		APP.view(recall_object.active_view);	
		
	}

	my.fill_corpus = function(corpus){

		g("corpus_name").value = corpus.name;
		g("corpus_title").value = corpus.title;
		g("corpus_description").value = corpus.description;

	}

	my.delete_recall_data = function(){

		localStorage.removeItem("form");
		alertify.log("Recall data deleted","",5000);

	}

	my.save_form = function(){
		
		var form_object = my.make_object_out_of_form();
		
		localStorage.setItem("form", JSON.stringify(form_object));

	}

	my.make_object_out_of_form = function(){

		var object = {
		
			corpus: {},
			sessions: [],
			
			content_languages: [],
			available_resources: [],
			
			settings: {
				save_interval_time: 0,
				output_format: dom.getSelectedRadioIndex(document.metadata_form.output_format),
				calc_actors_age: (document.getElementsByName("radio_age_calc")[0].checked ? true : false),
				metadata_creator: get("metadata_creator"),
				metadata_language: g("metadata_language_select").selectedIndex
			}
			
		};
		
		object.corpus.name = g("corpus_name").value;
		object.corpus.title = g("corpus_title").value;
		object.corpus.description = g("corpus_description").value;
		
		object.content_languages = content_languages.content_languages;
		
		object.settings.save_interval_time = document.metadata_form.radio_auto_save.value;
		
		if (APP.active_view != "wait"){
			object.active_view = APP.active_view;
		}
		
		else {
			object.active_view = "default";
		}
		
		object.available_resources = resources.available_resources;
		
		for (var s=0; s<session.sessions.length; s++){
		
			var session_object = make_new_session_object();
			
			my.fill_object_with_form_element(session_object, session_dom_element_prefix+session.sessions[s].id+"_", session_form);		
			
			session_object.actors.actors = session.sessions[s].actors.actors;
			session_object.resources = session.sessions[s].resources;
			session_object.expanded = session.sessions[s].expanded;
			
			object.sessions.push(session_object);
		}
		
		return object;

	}


	my.fill_object_with_form_element = function(object, element_id_prefix, form_element){
	//object = the object to be filled with form data
	//form_element = element of the form as specified in session_form

		if ((form_element.type == "text") || (form_element.type == "textarea") || (form_element.type == "select") || (form_element.type == "open_vocabulary")){

			object[form_element.name] = get(element_id_prefix+form_element.name);
			
		}
		
		if (form_element.type == "date"){
		
			object[form_element.name]["year"] = get(element_id_prefix+form_element.name+"_year");
			object[form_element.name]["month"] = get(element_id_prefix+form_element.name+"_month");
			object[form_element.name]["day"] = get(element_id_prefix+form_element.name+"_day");
		}
		
		if (form_element.type == "column"){
		
			element_id_prefix += form_element.name + "_";
			
			for (var f=0; f<form_element.fields.length; f++){
				
				my.fill_object_with_form_element(object, element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "subarea"){
		
			element_id_prefix += form_element.name + "_";
			
			for (var f=0; f<form_element.fields.length; f++){
				
				my.fill_object_with_form_element(object[form_element.name], element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "form"){
		
			for (var f=0; f<form_element.fields.length; f++){
				
				my.fill_object_with_form_element(object[form_element.fields[f].name], element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "special"){
		
			return;
		
		}

	}
	
	return my;
	
})();