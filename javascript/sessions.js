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


function new_session(session_object){

	//remove no sessions message before drawing new session
	if (sessions.length == 0) {
		g("sessions").innerHTML = "";
	};


	
	var session_id = counters.session_id;
	
	if (!session_object){
		var session_expanded = true;
		
		var session_object = make_new_session_object();
		
	}
	
	else {
		var session_expanded = session_object.expanded;
	}

	//push new session object into sessions array
	session_object.id = session_id;
	session_object.expanded = session_expanded;
	sessions.push(session_object);
	
	var session_div = new_element('div','session'+session_id,'session_div',g('sessions')); 
	//sessions_count is right! but it has to be clear which session in sessions has which session_id

	var session_header = new_element('div','session'+session_id+'_header','session_header',session_div);
	session_header.addEventListener('click', function(num) { 
		return function(){
			display(num);  
		};
	}(session_id) );

	var session_label = new_element('a',session_dom_element_prefix+session_id+'_label','session_label',session_header);
	
	if ((!session_object.session) || (!session_object.session.name) || (session_object.session.name == "")){
	
		session_label.innerHTML = "<h1 class=\"session_heading\">Unnamed Session   </h1>";
		sessions[GetSessionIndexFromID(session_id)].name = "";
		
	}
	
	else {
		session_label.innerHTML = "<h1 class=\"session_heading\">Session: " + session_object.session.name + "   </h1>";
		sessions[GetSessionIndexFromID(session_id)].name = session_object.session.name;
	
	}

	session_label.href = "#";

	//create icon for deleting the session
	var session_delete_link = new_element('a',session_dom_element_prefix+session_id+'_delete_link','session_delete_link',session_header);
	session_delete_link.addEventListener('click', function(num) {
		return function(){
			user_erase_session(num);  
			display(num);   //because otherwise session.expanded would change
		};
	}(session_id) );
	session_delete_link.innerHTML = "<img id=\""+session_dom_element_prefix+session_id+"_delete_img\" class=\"delete_img\" src=\""+path_to_images+"icons/reset.png\" alt=\"Delete Session\">";
	session_delete_link.href = "#";
	
	//create icon to expand/collapse the session
	var session_display_link = new_element('a',session_dom_element_prefix+session_id+'_display_link','session_display_link',session_header);
	session_display_link.innerHTML = "<img id=\""+session_dom_element_prefix+session_id+"_expand_img\" class=\"expand_img\" src=\""+path_to_images+"icons/down.png\">";
	session_display_link.href = "#";


	var session_content = new_element('div','session'+session_id+'_content','session_content',session_div)

	//create the form
	make_input(session_content, session_form, session_dom_element_prefix+session_id+"_", session_object);

	
	g(session_dom_element_prefix+session_id+"_session_name").addEventListener("blur", function(num){
	
		return function(){
		
			RefreshSessionNameDisplay(num);
		}
	}(session_id) );
	

	if (typeof(session_object.actors.actors) != "undefined"){
	
		for (var a=0; a<session_object.actors.actors.length; a++){
	
			draw_actor_in_session(session_id, session_object.actors.actors[a]);
	
		}
	}
	
	
	if (typeof(session_object.resources.writtenResources) != "undefined"){
		
		for (var r=0; r<session_object.resources.writtenResources.length; r++){
		
			var file = session_object.resources.writtenResources[r];	
			file.id = counters.resource_id;
			draw_resource_in_session(counters.resource_id, session_id, "wr", file.name, file.size);
			
			counters.resource_id += 1;
	
		}
	
	}
	
	
	if (typeof(session_object.resources.mediaFiles) != "undefined"){
		
		for (var r=0; r<session_object.resources.mediaFiles.length; r++){
		
			var file = session_object.resources.mediaFiles[r];
			file.id = counters.resource_id;
			draw_resource_in_session(file.id, session_id, "mf", file.name, file.size);

			counters.resource_id += 1;
		}
	
	}
	
	refresh_resources_of_session(GetSessionIndexFromID(session_id));
	
	var all_available_actor_ids = [];
	
	for (var n=0; n<actors.length; n++){
		all_available_actor_ids.push(actors[n].id);
	}   // find a better place for that

	RefreshActorListInSession(GetSessionIndexFromID(session_id),all_available_actor_ids);
	
	if (session_expanded == false){
		display(session_id);
	}
	
	counters.session_id+=1;   //this is the id, always unique, even if session created after one is deleted
	
	return counters.session_id-1;
}


function make_input(parent, field, element_id_prefix, session_object){

	if (field.type == "text"){
		var input = make_text_input(parent, field.heading,
			element_id_prefix+field.name,
			element_id_prefix+field.name,
			(session_object[field.name] ? session_object[field.name] : ""),
			field.comment
		);
	}
	
	if (field.type == "date"){
		var input = make_date_input(parent, field.heading,
			element_id_prefix+field.name,
			element_id_prefix+field.name,
			(session_object[field.name] ? session_object[field.name]["year"] : ""),
			(session_object[field.name] ? session_object[field.name]["month"] : ""),				
			(session_object[field.name] ? session_object[field.name]["day"] : ""),					
			field.comment
		);
	}
	
	if (field.type == "textarea"){
		var input = make_textarea(
			form_textarea_rows,
			form_textarea_columns,
			parent,
			field.heading,
			element_id_prefix+field.name,
			element_id_prefix+field.name,
			element_id_prefix+field.name,
			(session_object[field.name] ? session_object[field.name] : ""),
			field.comment
		);
	}			
	
	if (field.type == "subarea"){
	
		var h3 = document.createElement("h3");
		h3.innerHTML = field.heading;
		parent.title = field.comment;
		parent.appendChild(h3);
		
		if (field.fields){
		
			element_id_prefix += field.name + "_";
	
			for (var f=0; f<field.fields.length; f++){
			
				make_input(parent, field.fields[f], element_id_prefix, session_object[field.name]);
		
			}
		
		}
	}
	
	if (field.type == "column"){
	
		var td = new_element("td",element_id_prefix+field.name+"_td",session_dom_element_prefix+field.name+"_td",parent);
		var h2 = new_element("h2","","",td,field.title);
		
		if (field.fields){
		
			element_id_prefix += field.name + "_";
		
			for (var f=0; f<field.fields.length; f++){
			
				make_input(td, field.fields[f], element_id_prefix, session_object[field.name]);
		
			}
		
		}
	}
	
	if (field.type == "form"){
	
		var table = new_element("table",element_id_prefix+"_table","session_table",parent);
		var tr = new_element("tr","","",table);
		
		for (var f=0; f<field.fields.length; f++){
			
			make_input(tr, field.fields[f], element_id_prefix, session_object);
		
		}
	}
	
	if (field.type == "special"){
	
		if (field.name == "actors"){
		
			new_element("br","","",parent);
			
			new_element("div",element_id_prefix+"actors", "actors", parent);
			new_element("div",element_id_prefix+"add_actors_div", "actors", parent);
		
		}
		
		if (field.name == "resources"){
		
			new_element("div",element_id_prefix+"resources", "mfs", parent);
			new_element("div",element_id_prefix+"add_mf_div", "", parent);
		
		}
	
	}
	
	if (field.type == "select"){
		var input = make_select(
			parent, field.heading,
			element_id_prefix+field.name,
			element_id_prefix+field.name,
			field.size,
			field.vocabulary,
			(session_object[field.name] ? session_object[field.name] : ""),
			field.comment
		);
	}

	if (field.type == "open_vocabulary"){
		var input = open_vocabulary(
			parent, field.heading,
			element_id_prefix+field.name,
			element_id_prefix+field.name,
			field.size,
			field.vocabulary,
			(session_object[field.name] ? session_object[field.name] : ""),
			field.comment
		);
	}

	if (field.onkeypress){
		input.onkeypress = field.onkeypress;
	}

}



function user_erase_session(session_id){

	alertify.set({ labels: {
		ok     : "No",
		cancel : "Yes, delete session"
	} });

	alertify.confirm("Really?<br>You want to erase a whole session? Are you sure about that?", function (e) {

		if (e) {
			// user clicked "ok"
			
		}
	
		else {
			// user clicked "cancel"
			erase_session(session_id);

			alertify.log("Session deleted", "", "5000");
		}
	});


}


function erase_session(session_id){

	var node = document.getElementById("session"+session_id);
	g("sessions").removeChild(node);
	
	sessions.splice(GetSessionIndexFromID(session_id),1);
	
	if (sessions.length == 0) {
		show_no_session_text();
	} 


}

function show_no_session_text(){

	console.log("Showing no session text");

	g("sessions").innerHTML = "";

	var no_sessions_message = new_element("h2","no_session_text","no_session_text",g("sessions"));
	no_sessions_message.innerHTML = "This corpus contains no sessions yet. Why not ";

	var new_session_link = new_element("a","new_session_link","new_session_link",no_sessions_message);

	new_session_link.innerHTML = "create one";
	new_session_link.href = "#";

	no_sessions_message.innerHTML += "?";

	g("new_session_link").addEventListener('click', function(){ new_session(); });
	//we have to use g here instead of no_sessions_link, because letter isn't there anymore. it has been overwritten by ...innerHTML --> logically!
	
	g("sessions").scrollTop = 0;

}


function erase_all_sessions(){

	while (sessions.length > 0){
	
		erase_last_session();
	
	}

}



function erase_last_session(){

	if (sessions.length > 0){
	
		erase_session(sessions[sessions.length-1].id);

	}
	
	else {
	
		alert("There is no session that can be erased!\nTo erase one, you have to create one first.");
	
	}
}




function add_actor_to_session(session_id, actor_id){
//add existing actor to session
//new actors are only created in manage actors


	//if session doesn't already contain this actor
	if (sessions[GetSessionIndexFromID(session_id)].actors.actors.indexOf(actor_id) == -1){
	
		if (actors[getActorsIndexFromID(actor_id)]){  //check if actor still exists before adding
	
			sessions[GetSessionIndexFromID(session_id)].actors.actors.push(actor_id);
		
			draw_actor_in_session(session_id, actor_id);
			
		}
		
		else {
		
			console.log("Tried to add actor to session although this actor is not in the actors database. This is odd.");
			return;
		
		}

	}
	
	else {
	
		alertify.log("This actor is already in the session.","error",5000);
	
	}
}


function draw_actor_in_session(session_id, actor_id){

	new_element("div", session_dom_element_prefix + session_id + "_actor_" + actor_id, "actor_in_session_wrap", g(session_dom_element_prefix+session_id+"_actors_actors"));
	var div = new_element("div", session_dom_element_prefix+session_id+"_actor_" + actor_id + "_label", "actor_in_session", g(session_dom_element_prefix+session_id+"_actor_" + actor_id));
	
	RefreshActorNameInSession(session_id, actor_id);
	
	var img = new_element("img", "delete_actor_"+actor_id+"_icon", "delete_actor_icon", g(session_dom_element_prefix+session_id+"_actor_" + actor_id));
	img.src = path_to_images+"icons/reset.png";

	img.addEventListener('click', function(num, num2) { 
		return function(){ RemoveActorFromSession(num, num2);  
		};
	}(session_id, actor_id) );

}


function RemoveActorFromSession(session_id, actor_id){

	var position_in_array = sessions[GetSessionIndexFromID(session_id)].actors.actors.indexOf(actor_id);
	
	console.log("Removing actor. Position in array: " + position_in_array);

	//remove actor_id in array
	sessions[GetSessionIndexFromID(session_id)].actors.actors.splice(position_in_array,1);
	
	remove(session_dom_element_prefix+session_id+"_actor_"+actor_id);
	
	save_form();
	
}


function add_resource_to_session(session_id, resource_file_index, without_questions){
// resource_file_index is the index of the available media file, that is to be added to the session
// if resource_file_index is -1, a new empty field with no available media file is created
//if without_questions == true, no alerts will be thrown (e.g. when resources are added at start up)

	if (resource_file_index >= available_resources.length){
		return;
	}
	
	var resource_id = counters.resource_id;

	if ((GetValidityOfFile(available_resources[resource_file_index][0]) == 0) || (GetValidityOfFile(available_resources[resource_file_index][0]) == 2)){
		//Media File
	
		var resource_type = "mf";
	
		sessions[GetSessionIndexFromID(session_id)].resources.mediaFiles.push({
			name: available_resources[resource_file_index][0],
			size: available_resources[resource_file_index][2],
			id: counters.resource_id,
			resource_file_index: resource_file_index
		});

	}
	
	else if ((GetValidityOfFile(available_resources[resource_file_index][0]) == 1) || (GetValidityOfFile(available_resources[resource_file_index][0]) == 3)){
	
		var resource_type = "wr";
	
		sessions[GetSessionIndexFromID(session_id)].resources.writtenResources.push({
			name: available_resources[resource_file_index][0],
			size: available_resources[resource_file_index][2],
			id: counters.resource_id,
			resource_file_index: resource_file_index
		});
		
	}
	
	else {
	
		if (!without_questions){
		
			alertify.set({ labels: {
				ok     : "OK",
			} });
	
			alertify.alert("We have a problem.<br>I don't know if this file is a Media File or a Written Resource:<br>" + available_resources[resource_file_index][0] + 
			"<br>As for now, I will handle it as a written resource. But you really shouldn't do that");
		
		}
		
		var resource_type = "wr";
		
		sessions[GetSessionIndexFromID(session_id)].resources.writtenResources.push({
			name: available_resources[resource_file_index][0],
			size: available_resources[resource_file_index][2],
			id: counters.resource_id,
			resource_file_index: resource_file_index
		});
		
	}
	
	
	if (resource_file_index!=-1){
	// if an existing media file is added, adopt its name and date to the input fields
		var filename = available_resources[resource_file_index][0];	//name
		var filesize = available_resources[resource_file_index][2];	//size

	}
	
	else {
		var filename = "";
		var filesize = "";
	}	
	
	
	//Rename the session if an EAF file is added for the first time and session has no name yet
	if ((GetFileTypeFromFilename(filename) == "eaf") && (get(session_dom_element_prefix+session_id+"_session_name") == "")){
	
		var name = RemoveEndingFromFilename(available_resources[resource_file_index][0]);
		
		g(session_dom_element_prefix+session_id+"_session_name").value = name;
		
		RefreshSessionNameDisplay(session_id);
	
		alertify.log("Session name has been taken from EAF file name, since session has not been manually named yet.","",8000);
	
	}
	
	
	//Check, if there is a date string in the form of YYYY-MM-DD in the filename of an eaf file. If so, adopt it for the session date
	//only, if session date is still YYYY
	if ((GetFileTypeFromFilename(filename) == "eaf") && (get(session_dom_element_prefix+session_id+"_date_year") == "YYYY")){
		
		var date = parseDate(available_resources[resource_file_index][0]);
		
		if (date != null){
		
			g(session_dom_element_prefix+session_id+"_date_year").value = date.year;
			g(session_dom_element_prefix+session_id+"_date_month").value = date.month;
			g(session_dom_element_prefix+session_id+"_date_day").value = date.day;
			
			alertify.log("Session date has been extracted from EAF file name: " + date.year + "-" + date.month + "-" + date.day, "", 5000);
		
		}
	
	
	}
	
	draw_resource_in_session(resource_id, session_id, resource_type, filename, filesize);

	counters.resource_id+=1;
	
	return counters.resource_id-1;
	
}


function draw_resource_in_session(resource_id, session_id, type, name, size){

	var div = new_element('div', session_dom_element_prefix+session_id+"_mediafile_" + resource_id, type, g(session_dom_element_prefix+session_id+"_resources_resources"));

	var h3 = document.createElement("h3");
	
	if (type == "wr"){
		h3.innerHTML = "Written Resource";
	}
	
	else if (type == "mf"){
		h3.innerHTML = "Media File";	
	}
	
	else {
		console.log("ERROR: Strange File type!");
		return;
	}
	
	div.appendChild(h3);
	
	var img = new_element("img","delete_resource_" + resource_id +"_icon","delete_resource_icon",div);
	img.src = path_to_images+"icons/reset.png";
	img.addEventListener('click', function(num, num2) { 
		return function(){ RemoveResourceFromSession(num, num2);  
		};
	}(session_id,resource_id) );
	
	var span = document.createElement("span");
	span.className = "resource_file_content_span";
	
	span.innerHTML = "File Name<br><input type=\"text\" name=\""+session_dom_element_prefix+session_id+"_mediafile_" + resource_id + "_name\" value=\"\"><br>"+
	"Size<br><input type=\"text\" name=\""+session_dom_element_prefix+session_id+"_mediafile_" + resource_id + "_size\" value=\"\">";
	
	div.appendChild(span);
	
	div.getElementsByTagName("input")[0].value = name;
	div.getElementsByTagName("input")[1].value = size;


}


function RefreshSessionNameDisplay(session_id){

	if (get(session_dom_element_prefix+session_id+"_session_name") == ""){
		g(session_dom_element_prefix+session_id+"_label").innerHTML = "<h1 class=\"session_heading\">Unnamed Session   </h1>";
	}
	
	else {
	
		g(session_dom_element_prefix+session_id+"_label").innerHTML = "<h1 class=\"session_heading\">Session: "+get(session_dom_element_prefix+session_id+"_session_name")+"   </h1>";

	}

}


function RemoveResourceFromSession(session_id, resource_id){

	var ids_of_sessions_media_files = [];
	
	for (var m=0; m<sessions[GetSessionIndexFromID(session_id)].resources.mediaFiles.length; m++){
	
		ids_of_sessions_media_files.push(sessions[GetSessionIndexFromID(session_id)].resources.mediaFiles[m].id);
	
	}
	
	var ids_of_sessions_written_resources = [];
	
	for (var m=0; m<sessions[GetSessionIndexFromID(session_id)].resources.writtenResources.length; m++){
	
		ids_of_sessions_written_resources.push(sessions[GetSessionIndexFromID(session_id)].resources.writtenResources[m].id);
	
	}

	if (ids_of_sessions_written_resources.indexOf(resource_id) != -1){

		sessions[GetSessionIndexFromID(session_id)].resources.writtenResources.splice(GetIndexFromResourceID(resource_id),1);
	
	}
	
	if (ids_of_sessions_media_files.indexOf(resource_id) != -1){

		sessions[GetSessionIndexFromID(session_id)].resources.mediaFiles.splice(GetIndexFromResourceID(resource_id),1);
	
	}
	
	var child = document.getElementById(session_dom_element_prefix+session_id+"_mediafile_"+resource_id);
	
	g(session_dom_element_prefix+session_id+"_resources_resources").removeChild(child);

}



function assign_session1_metadata(){

	if (sessions.length < 2){
	
		alertify.log("There have to be at least 2 sessions to assign metadata from one to another.", "error", "5000");
		return;
		
	}
	
	for (var i=0; i<session_form.fields_to_copy.length; i++){
	
		if (g(copy_checkbox_element_prefix+session_form.fields_to_copy[i].name).checked){  //if checkbox is checked
		
			if (session_form.fields_to_copy[i].name == "actors"){  //special case: actors!
			
				for (var s=1; s<sessions.length; s++){
					RemoveAllActorsFromSession(sessions[s].id);
		
					// copy actors from session 1 to session session
					for (var a=0;a<sessions[0].actors.actors.length;a++){
						add_actor_to_session(sessions[s].id,sessions[0].actors.actors[a]);
					}
				
				}
			
			}
		
			copy_fields_to_all_sessions(session_form.fields_to_copy[i].fields);
			
		}
	
	}

	alertify.log("Session 1 metadata assigned to all sessions.", "", "5000");

}


function copy_fields_to_all_sessions(fields_to_copy){
//fields_to_copy is an array
//it is indeed html conform to get textarea.value
	
	for (var s=1;s<sessions.length;s++){   //important to not include the first session in this loop
	
		for (var k=0;k<fields_to_copy.length;k++){
			copy_field(session_dom_element_prefix+sessions[s].id+"_"+fields_to_copy[k],session_dom_element_prefix+sessions[0].id+"_"+fields_to_copy[k]);
		}
	
	}
	
}

function RemoveAllActorsFromSession(session_id){
//Remove all actors from respective session
	
	while (sessions[GetSessionIndexFromID(session_id)].actors.actors.length > 0){
		RemoveActorFromSession(session_id,sessions[GetSessionIndexFromID(session_id)].actors.actors[0]);
		//Remove always the first actor of this session because every actor is at some point the first	
	}
}


function refresh_resources_of_sessions(){
//Offer possibility to add every available media file to all session
//refresh all sessions with available media files

	for (var s=0;s<sessions.length;s++){
	
		refresh_resources_of_session(s);
		
	}

}

function refresh_resources_of_session(s){

	console.log("Refreshing Resources of Session " + s);

	g(session_dom_element_prefix+sessions[s].id+"_resources_add_mf_div").innerHTML = "";

	var select = document.createElement("select");
	
	for (var i=0;i<available_resources.length;i++){ 
		
		NewOption = new Option( available_resources[i][0], i, false, true);
		select.options[select.options.length] = NewOption;		
		
	}

	if (available_resources.length > 0){
	
		g(session_dom_element_prefix+sessions[s].id+"_resources_add_mf_div").appendChild(select);
	
		select.selectedIndex = 0;	
	
		var add_button = document.createElement("input");
		add_button.type = "button";
		add_button.value = "Add to session";
		
		g(session_dom_element_prefix+sessions[s].id+"_resources_add_mf_div").appendChild(document.createElement("br"));
		
		g(session_dom_element_prefix+sessions[s].id+"_resources_add_mf_div").appendChild(add_button);		
		
		add_button.addEventListener('click', function(num) { 
			return function(){ add_resource_to_session(num, select.selectedIndex);  };
		}(sessions[s].id) );
		
	}

	if (available_resources.length == 0){
	
		var p = document.createElement("h5");
		g(session_dom_element_prefix+sessions[s].id+"_resources_add_mf_div").appendChild(p);
		p.innerHTML = "No files have been added.<br>";
	
		var a = document.createElement("a");
		a.href="#";
		a.innerHTML = "Add some files.";
	
		p.appendChild(a);

		a.addEventListener('click', function() { 
			view("media_files");
		} );
		
	
	}
	
}


function is_corpus_properly_named(){

	if (get("corpus_name") == ""){
		
		return false;
		
	}
	
	for (var c=0; c<not_allowed_chars.length; c++){
	
		if (get("corpus_name").indexOf(not_allowed_chars[c]) != -1){
		
			return false;
			
		}
	
	}

	return true;

}


function are_all_sessions_properly_named(){

	for (var i=0;i<sessions.length;i++){
	
		if (get(session_dom_element_prefix+sessions[i].id+"_session_name") == ""){
		
			return false;
		
		}
		
		for (var c=0; c<not_allowed_chars.length; c++){
	
			if (get(session_dom_element_prefix+sessions[i].id+"_session_name").indexOf(not_allowed_chars[c]) != -1){
		
				return false;
			
			}
	
		}
		
	}
	
	return true;

}


function does_every_session_have_a_project_name(){

	for (var i=0;i<sessions.length;i++){
	
		if (get(session_dom_element_prefix+sessions[i].id+"_project_name") == ""){
		
			return false;
		
		}
		
	}
	
	return true;

}