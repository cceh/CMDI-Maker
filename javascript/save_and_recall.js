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


var recallDB;


function start_recallDB(){


	recallDB = new IDBStore({
		dbVersion: 3,
		storeName: 'recall',
		keyPath: 'id',
		autoIncrement: false,    // !!!  
		onStoreReady: function(){
			console.log('RecallDB ready!');
			GetRecallData();
		}
	});

}


function GetRecallData(){

	console.log("Recalling form data from RecallDB");
	
	var onItem = function (item) {
		console.log('Found RecallDB item:', item);
		
		if (item != null){
			FillForm(item);	
		}
		
		else {   //recall data not found
		
			show_no_session_text();
			console.log("Showing No session text because item is null");
			
		}
		
	};
	
	var onEnd = function (item) {
		
		if (sessions.length == 0){
			show_no_session_text();
			console.log("Showing No session text because sessions.length is 0 after recallDB iteration");
		
		}
		
		console.log('End of iterating recallDB. Starting Auto Save interval.');
		
		setAutosaveInterval(interval_time);

		
	};
	
	recallDB.iterate(onItem, {
		order: 'DESC',
		onEnd: onEnd
	});

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
	
	g("metadata_language_select").selectedIndex = recall_object.metadata_language;
	g("metadata_creator").value = recall_object.metadata_creator;
	
	if (recall_object.output_format == "imdi"){
		g("radio_imdi").checked = true;
	}
	
	else {
		g("radio_cmdi").checked = true;
	}
	
	if (recall_object.calc_actors_age == true){
	
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
	
	show_window(recall_object.active_window);	
	
}

function FillCorpus(corpus){

	g("corpus_name").value = corpus.name;
	g("corpus_title").value = corpus.title;
	g("corpus_description").value = corpus.description;

}

function delete_recall_data(){

	var onsuccess = function(){

		alertify.log("Recall data deleted", "", "5000");
  
	}
	
	var onerror = function(error){
		console.log('Oh noes, sth went wrong!', error);
	}
 
	recallDB.clear(onsuccess, onerror);

}

function save_form(){
	
	var form_object = MakeObjectOutOfForm();

	var onsuccess = function(id){
		console.log('Form saved. insertId = ' + id);
	}

	var onerror = function(error){
		console.log('Oh noes, sth went wrong when trying to save the form!', error);
	}
 
	recallDB.put(form_object, onsuccess, onerror);

}

function MakeObjectOutOfForm(){

	var object = {
	
		corpus: {},
		sessions: [],
		
		metadata_language: {},
		content_languages: [],
		
		interval: 60000,
		output_format: (document.getElementsByName("output_format")[0].checked ? "imdi" : "cmdi"),
		calc_actors_age: (document.getElementsByName("radio_age_calc")[0].checked ? true : false),
		metadata_creator: get("metadata_creator"),
		
		available_resources: [],
		
		id: 0   //id is always 0, because we only want to overwrite the object
	
	};
	
	object.corpus.name = g("corpus_name").value;
	object.corpus.title = g("corpus_title").value;
	object.corpus.description = g("corpus_description").value;
	
	object.metadata_language = g("metadata_language_select").selectedIndex;
	object.content_languages = content_languages;
	
	object.active_window = active_window;
	object.available_resources = available_resources;
	
	for (var s=0; s<sessions.length; s++){
		
		object.sessions.push(make_new_session_object());
		
		object.sessions[s].name = get("session_"+sessions[s].id+"_name");
		object.sessions[s].title = get("session_"+sessions[s].id+"_title");
		
		object.sessions[s].date.year = get("session_"+sessions[s].id+"_date_year");
		object.sessions[s].date.month = get("session_"+sessions[s].id+"_date_month");
		object.sessions[s].date.day = get("session_"+sessions[s].id+"_date_day");		
		
		object.sessions[s].description = get("session_"+sessions[s].id+"_description");
		
		object.sessions[s].location.continent = get("session_"+sessions[s].id+"_location_continent");
		object.sessions[s].location.country = get("session_"+sessions[s].id+"_location_country");
		object.sessions[s].location.region = get("session_"+sessions[s].id+"_location_region");
		object.sessions[s].location.address = get("session_"+sessions[s].id+"_location_address");
		
		object.sessions[s].project.name = get("session_"+sessions[s].id+"_project_name");
		object.sessions[s].project.title = get("session_"+sessions[s].id+"_project_title");
		object.sessions[s].project.id = get("session_"+sessions[s].id+"_project_id");
		object.sessions[s].project.description = get("session_"+sessions[s].id+"_project_description");
		
		object.sessions[s].contact.name = get("session_"+sessions[s].id+"_contact_name");
		object.sessions[s].contact.address = get("session_"+sessions[s].id+"_contact_address");	
		object.sessions[s].contact.email = get("session_"+sessions[s].id+"_contact_email");
		object.sessions[s].contact.organisation = get("session_"+sessions[s].id+"_contact_organisation");

		object.sessions[s].content.genre = get("session_"+sessions[s].id+"_content_genre");
		object.sessions[s].content.subgenre = get("session_"+sessions[s].id+"_content_subgenre");
		//object.sessions[s].content.language = get("session_"+sessions[s].id+"_content_language");
		object.sessions[s].content.task = get("session_"+sessions[s].id+"_content_task");
		object.sessions[s].content.description = get("session_"+sessions[s].id+"_content_description");
		
		object.sessions[s].content.eventstructure = get("session_"+sessions[s].id+"_content_eventstructure");
		object.sessions[s].content.planningtype = get("session_"+sessions[s].id+"_content_planningtype");
		object.sessions[s].content.interactivity = get("session_"+sessions[s].id+"_content_interactivity");
		object.sessions[s].content.socialcontext = get("session_"+sessions[s].id+"_content_socialcontext");
		object.sessions[s].content.involvement = get("session_"+sessions[s].id+"_content_involvement");
		
		
		object.sessions[s].actorsDescription = get("session_"+sessions[s].id+"_actorsDescription");
		object.sessions[s].actors = sessions[s].actors;
		
		object.sessions[s].writtenResources = sessions[s].writtenResources;
		object.sessions[s].mediaFiles = sessions[s].mediaFiles;
		
		object.sessions[s].expanded = sessions[s].expanded;

	}
	
	return object;

}