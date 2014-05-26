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


function GetRecallData(){

	var form = localStorage.getItem("form");

	if (!form){
		console.log("No recall data found");
		show_no_session_text();
		setAutosaveInterval(interval_time);
		view("default");
		return;
	}
	
	var form_object = JSON.parse(form);
	
	console.log("Recall object: ");
	console.log(form_object);
	
	FillForm(form_object);	
	
}


function setAutosaveInterval(time){

	window.clearInterval(interval);
	
	if (time == -1){

		console.log("Auto Save off");
		return;
		//nothing to do here because interval is already cleared. just return
	
	}
	
	console.log("Auto Save Time in seconds: " + time);
	
	interval_time = time;
	
	// if not switched off
	interval = window.setInterval(function() { save_form(); },interval_time*1000);

}


function FillForm(recall_object){

	console.log("Filling the form with recalled data");
	
	g("metadata_language_select").selectedIndex = recall_object.settings.metadata_language;
	g("metadata_creator").value = recall_object.settings.metadata_creator;
	set_radio_index(document.metadata_form.output_format, recall_object.settings.output_format);
	
	if (recall_object.settings.calc_actors_age == true){
	
		document.metadata_form.radio_age_calc[0].checked = true;
	
	}
	
	else {
	
		document.metadata_form.radio_age_calc[1].checked = true;	
	
	}
	
	for (var l=0;l<recall_object.content_languages.length;l++){
	
		set_content_language(recall_object.content_languages[l]);
		
	}
	
	available_resources = recall_object.available_resources;
	refreshFileListDisplay();
	FillCorpus(recall_object.corpus);
	erase_all_sessions();
	
	for (var s=0; s<recall_object.sessions.length; s++){
	
		new_session(recall_object.sessions[s]);
	
	}
	
	if (sessions.length == 0){
		show_no_session_text();
	}
	
	setAutosaveInterval(recall_object.settings.save_interval_time);

	view(recall_object.active_view);	
	
}

function FillCorpus(corpus){

	g("corpus_name").value = corpus.name;
	g("corpus_title").value = corpus.title;
	g("corpus_description").value = corpus.description;

}

function delete_recall_data(){

	localStorage.removeItem("form");

}

function save_form(){
	
	var form_object = MakeObjectOutOfForm();
	
	localStorage.setItem("form", JSON.stringify(form_object));

}

function MakeObjectOutOfForm(){

	var object = {
	
		corpus: {},
		sessions: [],
		
		content_languages: [],
		available_resources: [],
		
		settings: {
			save_interval_time: 0,
			output_format: get_selected_radio_index(document.metadata_form.output_format),
			calc_actors_age: (document.getElementsByName("radio_age_calc")[0].checked ? true : false),
			metadata_creator: get("metadata_creator"),
			metadata_language: g("metadata_language_select").selectedIndex
		}
		
	};
	
	object.corpus.name = g("corpus_name").value;
	object.corpus.title = g("corpus_title").value;
	object.corpus.description = g("corpus_description").value;
	
	object.content_languages = content_languages;
	
	object.settings.save_interval_time = document.metadata_form.radio_auto_save.value;
	
	if (active_view != "wait"){
		object.active_view = active_view;
	}
	
	else {
		object.active_view = "default";
	}
	
	object.available_resources = available_resources;
	
	for (var s=0; s<sessions.length; s++){
	
		var session_object = make_new_session_object();
		
		fill_object_with_form_element(session_object, session_dom_element_prefix+sessions[s].id+"_", session_form);		
		
		session_object.actors.actors = sessions[s].actors.actors;
		session_object.resources = sessions[s].resources;
		session_object.expanded = sessions[s].expanded;
		
		object.sessions.push(session_object);
	}
	
	return object;

}


function fill_object_with_form_element(object, element_id_prefix, form_element){
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
			
			fill_object_with_form_element(object, element_id_prefix, form_element.fields[f]);
		
		}
	}
	
	if (form_element.type == "subarea"){
	
		element_id_prefix += form_element.name + "_";
		
		for (var f=0; f<form_element.fields.length; f++){
			
			fill_object_with_form_element(object[form_element.name], element_id_prefix, form_element.fields[f]);
		
		}
	}
	
	if (form_element.type == "form"){
	
		for (var f=0; f<form_element.fields.length; f++){
			
			fill_object_with_form_element(object[form_element.fields[f].name], element_id_prefix, form_element.fields[f]);
		
		}
	}
	
	if (form_element.type == "special"){
	
		return;
	
	}

}