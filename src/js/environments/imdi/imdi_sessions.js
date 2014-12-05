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


imdi_environment.workflow[3] = (function(resources, actor) {
	'use strict';

	var my = {};
	my.parent = imdi_environment;
	var l = my.parent.l;
	
	var session_form = undefined;  //yet
	
	my.identity = {
		id: "session",
		title: "Sessions",
		icon: "edit",
	};
	
	my.sessions = new ObjectList();
	my.resource_id_counter = 0;
	
	my.dom_element_prefix = "session_";

	my.reset = function(){ my.sessions.reset(); refresh();};
	
	my.init = function(view){
	
		my.sessions.reset();
		my.resource_id_counter = 0;
		
		session_form = my.parent.session_form();
		
		var actions = {
			deleteSession: my.userErase,
			newSession: my.newSession,
			addActor: my.addActor,
			addResource: my.addResource,
			removeActor: my.removeActor,
			removeResource: my.removeResource
			
		};
		
		
		my.GUI.init(view, actions);
		
		my.GUI.createCopySessionOptions(session_form.fields_to_copy);
		
		refresh();

	};
	
	
	my.deleteSession = function(session_id){
	
		my.refreshSessionsArray();
		my.sessions.removeByID(session_id);
		refresh();
	
	}
	
	
	my.view = function(){
	
		my.GUI.view();
	
	};
	
	
	my.recall = function(data){
	
		//check if legacy data array
		if (Array.isArray(data) == true){
		
			for (var s = 0; s < data.length; s++){
			
				my.sessions.add(data[s]);
			
			}
		
		}
		
		else {
		
			my.sessions.setState(data);
			
		}
		
		refresh();
	
	};
	
	
	my.getSaveData = function(){
	
		my.refreshSessionsArray();
	
		return my.sessions.getState();
	
	};
	
	
	my.refreshSessionsArray = function(){
	
		var array = [];
	
		my.sessions.forEach(function(session){
		
			APP.forms.fillObjectWithFormData(session, my.dom_element_prefix+session.id+"_", session_form);		
			
		});
		
	};
	
	
	my.functions = function(){
		return [
			{
				label: l("session", "new_session"),
				icon: "plus",
				id: "link_newSession",
				onclick: function() {my.newSession(); }
			},
			{
				label: l("session", "copy_session_1_metadata"),
				icon: "copy",
				id: "link_copy_sessions",
				wrapper_id: "copy_sessions_div",
				type: "function_wrap",
				sub_div: "copy_sessions_select",
				onclick: function() {
					
					APP.confirm(l("really_overwrite_data"), function (e) {
						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							my.assignSession1Metadata();
							
						}
					}, l("no"), l("yes_overwrite_data"));
				
				}
			},
			{
				label: l("session", "reset_form"),
				icon: "reset",
				id: "session_link_reset_form",
				onclick: function() {
				
					APP.confirm(l("really_reset_form"), function (e) {
						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							APP.environments.resetActive();
							APP.log(l("form_reset"));
							
						}
					}, l("no"), l("yes_delete_form"));
					
				}
			},
			{
				label: l("session", "sort_by_name"),
				icon: "az",
				id: "session_link_sort_by_name",
				onclick: function() { my.sortAlphabetically(); }
			}
		];
	};
	

	my.newSession = function(){

		var session_object = APP.forms.createEmptyObjectFromTemplate(session_form);
		
		//new sessions are always expanded
		session_object.expanded = true;
		
		//push new session object into sessions array
		my.sessions.add(session_object);

		my.GUI.drawNewSession(session_object);
		
		return session_object.id;
	};
	
	
	my.createNewSessionWithResources = function(name, expanded, resources){
	
		var session_object = APP.forms.createEmptyObjectFromTemplate(session_form);
		session_object.session.name = removeCharactersFromString(name, my.parent.not_allowed_chars);
		session_object.expanded = expanded;

		my.sessions.add(session_object);
		
		my.drawNewSession(session_object);
		
		forEach(resources, function(resource){
		
			my.addResource(session_object.id, resource);
			
		});
		
		APP.log(l("session", "new_session_has_been_created") + "<br>" +
		l("session", "name") + ": " + name);
		
		return session_object.id;
		
	};
	
	
	var refresh = function(){
	
		my.GUI.refresh(my.sessions.getAll());
		
	};
	
	
	my.getName = function(session_index){

		if (my.sessions.get(session_index).name === ""){
		
			return l("session", "unnamed_session");
			
		}
		
		else {
			return l("session", "session") + ": " + my.sessions.get(session_index).name;
		
		}
		
	};
	
	
	my.refreshActorLists = function(actors){
		//Offer possibility to add every available actor to all session
		//refresh all sessions with available actors

		var all_available_actor_ids = getArrayWithIDs(actors);
		
		for (var s=0;s<my.sessions.length;s++){   //for all existing sessions
		
			my.GUI.refreshActorListInSession(my.sessions.get(s));

		}

	};
	
	
	my.sortAlphabetically = function(){
		
		//Before we sort the sessions, we save the newest user input
		my.refreshSessionsArray();
		
		my.sessions.sortBySubKey("session", "name");
		refresh();
		
		console.log("Sessions sorted by name");
		
	};


	my.userErase = function(session_id){

		APP.confirm(l("session", "really_erase_session"), function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel"
				
				my.refreshSessionsArray();
				my.sessions.removeByID(session_id);
				refresh();

				APP.log(l("session", "session_deleted"));
			}
		}, l("no"), l("session", "yes_delete_session"));

	};


	my.getIndexFromResourceID = function (resource_id){
		var r;

		for (var s=0;s<my.sessions.length;s++){
		
			for (r=0; r<my.sessions.get(s).resources.resources.writtenResources.length; r++){
		
				if (my.sessions.get(s).resources.resources.writtenResources[r].id == resource_id){
					return r;
				}
			
			}
			
			for (r=0; r<my.sessions.get(s).resources.resources.mediaFiles.length; r++){
		
				if (my.sessions.get(s).resources.resources.mediaFiles[r].id == resource_id){
					return r;
				}
			
			}
		
		
		
		}


	};
	

	my.addActor = function(session_id, actor_id){
	//add existing actor to session
	//new actors are only created in manage actors


		//if session doesn't already contain this actor
		if (my.sessions.getByID(session_id).actors.actors.indexOf(actor_id) == -1){
		
			if (actor.actors[actor.getIndexByID(actor_id)]){  //check if actor still exists before adding
		
				my.sessions.getByID(session_id).actors.actors.push(actor_id);
				refresh();
				
			}
			
			else {
			
				console.log("Tried to add actor to session although this actor is not in the actors database. This is odd.");
				return;
			
			}

		}
		
		else {
		
			APP.log(l("session", "this_actor_is_already_in_the_session"),"error");
		
		}
	};


	my.removeActor = function(session_id, actor_id){

		var position_in_array = my.sessions.getByID(session_id).actors.actors.indexOf(actor_id);
		
		console.log("Removing actor. Position in array: " + position_in_array);

		//remove actor_id in array
		my.sessions.getByID(session_id).actors.actors.splice(position_in_array,1);
		
		refresh();
		
	};


	my.addResource = function(session_id, resource_file_index, without_questions){
	// resource_file_index is the index of the available media file, that is to be added to the session
	// if resource_file_index is -1, a new empty field with no available media file is created
	//if without_questions == true, no alerts will be thrown (e.g. when resources are added at start up)
	
		var resource_type;

		if (resource_file_index >= resources.available_resources.length){
			return;
		}
		
		var resource_id = my.resource_id_counter;
		
		var file_type = resources.getValidityOfFile(resources.available_resources[resource_file_index].name).type;

		if (file_type == "Media File"){
			
			resource_type = "mf";
		
			my.sessions.getByID(session_id).resources.resources.mediaFiles.push({
				name: resources.available_resources[resource_file_index].name,
				size: resources.available_resources[resource_file_index].size,
				id: my.resource_id_counter,
				resource_file_index: resource_file_index
			});

		}
		
		else if (file_type == "Written Resource"){
			
			resource_type = "wr";
		
			my.sessions.getByID(session_id).resources.resources.writtenResources.push({
				name: resources.available_resources[resource_file_index].name,
				size: resources.available_resources[resource_file_index].size,
				id: my.resource_id_counter,
				resource_file_index: resource_file_index
			});
			
		}
		
		else {
		
			if (!without_questions){
			
				APP.alert(l("session", "unknown_file_problem__before_filename") + "<br>" +
				resources.available_resources[resource_file_index].name + 
				"<br>" + l("session", "unknown_file_problem__after_filename"));
			
			}
			
			resource_type = "wr";
			
			my.sessions.getByID(session_id).resources.resources.writtenResources.push({
				name: resources.available_resources[resource_file_index].name,
				size: resources.available_resources[resource_file_index].size,
				id: my.resource_id_counter,
				resource_file_index: resource_file_index
			});
			
		}
		
		var filename;
		var filesize;
		
		if (resource_file_index!=-1){
		// if an existing media file is added, adopt its name and date to the input fields
			filename = resources.available_resources[resource_file_index].name;
			filesize = resources.available_resources[resource_file_index].size;

		}
		
		else {
			filename = "";
			filesize = "";
		}	
		
		
		//Rename the session if an EAF file is added for the first time and session has no name yet
		if ((getFileTypeFromFilename(filename) == "eaf") && (get(my.dom_element_prefix+session_id+"_session_name") === "")){
		
			var name = removeEndingFromFilename(resources.available_resources[resource_file_index].name);
			
			g(my.dom_element_prefix+session_id+"_session_name").value = name;
			
			my.GUI.refreshSessionHeading(session_id);
		
			APP.log(l("session", "session_name_taken_from_eaf"));
		
		}
		
		
		//Check, if there is a date string in the form of YYYY-MM-DD in the filename of an eaf file. If so, adopt it for the session date
		//only, if session date is still YYYY
		if ((getFileTypeFromFilename(filename) == "eaf") && (get(my.dom_element_prefix+session_id+"_session_date_year") == "YYYY")){
			
			var date = parseDate(resources.available_resources[resource_file_index].name);
			
			if (date !== null){
			
				g(my.dom_element_prefix+session_id+"_session_date_year").value = date.year;
				g(my.dom_element_prefix+session_id+"_session_date_month").value = date.month;
				g(my.dom_element_prefix+session_id+"_session_date_day").value = date.day;
				
				APP.log(l("session", "session_date_extracted_from_eaf_file_name") +
				": " + date.year + "-" + date.month + "-" + date.day);
			
			}
		
		
		}
		
		my.GUI.renderResource(resource_id, session_id, resource_type, filename, filesize);

		my.resource_id_counter += 1;
		
		return my.resource_id_counter - 1;
		
	};


	my.removeResource = function(session_id, resource_id){
	
		var ids_of_sessions_media_files = getArrayWithIDs(my.sessions.getByID(session_id).resources.resources.mediaFiles);
		var ids_of_sessions_written_resources = getArrayWithIDs(my.sessions.getByID(session_id).resources.resources.writtenResources);

		if (ids_of_sessions_written_resources.indexOf(resource_id) != -1){

			my.sessions.getByID(session_id).resources.resources.writtenResources.splice(my.getIndexFromResourceID(resource_id),1);
		
		}
		
		if (ids_of_sessions_media_files.indexOf(resource_id) != -1){

			my.sessions.getByID(session_id).resources.resources.mediaFiles.splice(my.getIndexFromResourceID(resource_id),1);
		
		}
		
		dom.remove(my.dom_element_prefix+session_id+"_mediafile_"+resource_id);

	};


	my.assignSession1Metadata = function(){
		var session_form_template = session_form;

		if (my.sessions.length < 2){
		
			APP.log(l("session", "at_least_2_sessions_to_assign_metadata"), "error");
			return;
			
		}
		
		for (var i=0; i<session_form_template.fields_to_copy.length; i++){
		
			if (g(APP.CONF.copy_checkbox_element_prefix+session_form_template.fields_to_copy[i].name).checked){  //if checkbox is checked
			
				if (session_form_template.fields_to_copy[i].name == "actors"){  //special case: actors!
				
					for (var s=1; s<my.sessions.length; s++){
						my.removeAllActors(my.sessions.idOf(s));
			
						// copy actors from session 1 to session session
						forEach(my.sessions.get(0).actors.actors, function (actor){
							my.addActor(my.sessions.idOf(s), actor);
						});
					
					}
				
				}
			
				my.copyFieldsToAllSessions(session_form_template.fields_to_copy[i].fields);
				
			}
		
		}

		APP.log(l("session", "session_1_metadata_assigned_to_all_sessions"));

	};


	my.copyFieldsToAllSessions = function(fields_to_copy){
	//fields_to_copy is an array
	//it is indeed html conform to get textarea.value
		
		for (var s=1;s<my.sessions.length;s++){   //important to not include the first session in this loop
		
			forEach(fields_to_copy, function(field_to_copy){
				APP.GUI.copyField(
					my.dom_element_prefix + my.sessions.idOf(s) + "_" + field_to_copy,
					my.dom_element_prefix + my.sessions.idOf(0) + "_" + field_to_copy
				);
			});
		
		}
		
	};

	my.removeAllActors = function(session_id){
	//Remove all actors from respective session
		
		while (my.sessions.getByID(session_id).actors.actors.length > 0){
			my.removeActor(session_id, my.sessions.getByID(session_id).actors.actors[0]);
			//Remove always the first actor of this session because every actor is at some point the first	
		}
	};


	my.refreshResourcesOfAllSessions = function(){
	//Offer possibility to add every available media file to all session
	//refresh all sessions with available media files

		my.sessions.forEach(function(sess){
		
			my.GUI.refreshResources(sess.id);
			
		});

	};
	
	
	my.areAllSessionsNamed = function(){
	
		for (var i=0;i<my.sessions.length;i++){
		
			if (get(my.dom_element_prefix+my.sessions.idOf(i) + "_session_name") === ""){
			
				return false;
			
			}
			
		}
		
		return true;	
	
	}


	my.areAllSessionsProperlyNamed = function(){

		for (var i=0;i<my.sessions.length;i++){
		
			if (get(my.dom_element_prefix + my.sessions.idOf(i) + "_session_name") === ""){
			
				return false;
			
			}
			
			for (var c=0; c<my.parent.not_allowed_chars.length; c++){
		
				if (get(my.dom_element_prefix + my.sessions.idOf(i) + "_session_name").indexOf(my.parent.not_allowed_chars[c]) != -1){
			
					return false;
				
				}
		
			}
			
		}
		
		return true;
		
	};


	my.doesEverySessionHaveAProjectName = function(){

		for (var i=0; i<my.sessions.length; i++){
		
			if (get(my.dom_element_prefix + my.sessions.idOf(i) + "_project_name") === ""){
			
				return false;
			
			}
			
		}
		
		return true;

	};
	
	
	my.updateActorNameInAllSessions = function(actor_id){
	
		forEach(my.sessions, function(session){
	
			//search for actor_id in this session's actors
			if (session.actors.actors.indexOf(actor_id) != -1){
				
				my.refreshActorName(session.id, actor_id);
	
			}
			
		});
		
	};
	
	
	
	my.checkAllSessionNamesForInvalidChars = function(){
	
		forEach(my.sessions, my.checkSessionNameForInvalidChar);
		refresh();
		
	}
	
	
	my.checkSessionNameForInvalidChar = function(session){

		var session_name = get("session_" + session.id + "_session_name");

		session_name = replaceAccentBearingLettersWithASCISubstitute(session_name);
		session_name = removeAllCharactersFromStringExcept(session_name, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_");
		
		session.session.name = session_name;
		
		refresh();
	
	}


	return my;

})(imdi_environment.workflow[1],imdi_environment.workflow[2]);