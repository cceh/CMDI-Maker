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

	//remove no sessions message
	if (sessions.length == 0) { g("sessions").innerHTML = ""; };

	var session_id = counters.session_id;
	
	if (!session_object){
		var session_expanded = true;
	}
	
	else {
		var session_expanded = session_object.expanded;
	}

	//push new object into sessions array
	sessions.push({
		name: "",
		
		
		date: {
			year: "",
			month: "",
			day: ""
		},
	
		id: session_id,
		actors: [],
		//which actors are in this session?
		//Ex.: [21, 36];  //I. e. Session contains actor_ids 21 and 36
		
		writtenResources: [],
		//values represent resource ids in respective session	
		
		mediaFiles: [],
		//values represent resource ids in respective session
		
		expanded: session_expanded
		
	});  
	
	var session_div = new_element('div','session'+session_id,'session_div',g('sessions')); 
	//sessions_count is right! but it has to be clear which session in sessions has which session_id

	var session_header = new_element('div','session'+session_id+'_header','session_header',session_div);

	//create session label with function
	var session_label = new_element('a','session_'+session_id+'_label','session_label',session_header);
	session_label.addEventListener('click', function(num) { 
		return function(){
			display(num);  
		};
	}(session_id) );
	
	
	if (o(session_object,["name"]) == ""){
	
		session_label.innerHTML = "<h1 class=\"session_heading\">Unnamed Session   </h1>";
		sessions[GetSessionIndexFromID(session_id)].name = "";
		
	}
	
	else {
		session_label.innerHTML = "<h1 class=\"session_heading\">Session: " + o(session_object,["name"]) + "   </h1>";
		sessions[GetSessionIndexFromID(session_id)].name = o(session_object,["name"]);
	
	}
	
	session_label.href = "#";

	//create icon to expand/collapse the session
	var session_display_link = new_element('a','session_'+session_id+'_display_link','session_display_link',session_header);
	session_display_link.addEventListener('click', function(num) { 
				return function(){ display(num);  
				};
				}(session_id) );
	session_display_link.innerHTML = "<img id=\"session_"+session_id+"_expand_img\" class=\"expand_img\" src=\""+path_to_images+"icons/down.png\">";
	session_display_link.href = "#";

	//create icon for deleting the session
	var session_delete_link = new_element('a','session_'+session_id+'_delete_link','session_delete_link',session_header);
	session_delete_link.addEventListener('click', function(num) { 
				return function(){ user_erase_session(num);  
				};
				}(session_id) );
	session_delete_link.innerHTML = "<img id=\"session_"+session_id+"_delete_img\" class=\"delete_img\" src=\""+path_to_images+"icons/reset.png\" alt=\"Delete Session\">";
	session_delete_link.href = "#";

	var session_content = new_element('div','session'+session_id+'_content','session_content',session_div)

	var table = new_element("table","session"+session_id+"_table","session_table",session_content);
	
	var tr = document.createElement("tr");
	table.appendChild(tr);
	
	var td = document.createElement("td");
	tr.appendChild(td);
	
	var h2 = document.createElement("h2");
	h2.innerHTML = "Session";
	td.appendChild(h2);
	
	//make_text_input parameters: parent element, Title in front of input, element name, element id,  element value
	var input = make_text_input(td,"Name","session_"+session_id+"_name","session_"+session_id+"_name",o(session_object,["name"]),comments.session.name);
	
	input.onkeypress = function(e) {
		var chr = String.fromCharCode(e.which);
		if (not_allowed_chars.indexOf(chr) >= 0){
			alertify.log("This character is not allowed here.","error",5000);
			return false;
		}
	};
	
	
	make_text_input(td,"Title","session_"+session_id+"_title","session_"+session_id+"_title",o(session_object,["title"]),comments.session.title);
	make_date_input(td,"Date","session_"+session_id,"session_"+session_id,o(session_object,["date","year"]),o(session_object,["date","month"]),o(session_object,["date","day"]),comments.session.date);
	make_textarea(18,5,td,"Description","session_"+session_id+"_description","session_"+session_id+"_description","textarea",o(session_object,["description"]),comments.session.description);
	
	var h3 = document.createElement("h3");
	h3.innerHTML = "Location";
	td.appendChild(h3);

	make_select(td, "Continent","session_"+session_id+"_location_continent","session_"+session_id+"_location_continent",1,vocabularies.continent,o(session_object,["location","continent"]),comments.session.location.continent);
	//parameters: parent to append to, title, name of element, id of element, size, array of options
	
	make_text_input(td,"Country","session_"+session_id+"_location_country","session_"+session_id+"_location_country",o(session_object,["location","country"]),comments.session.location.country);
	make_text_input(td,"Region","session_"+session_id+"_location_region","session_"+session_id+"_location_region",o(session_object,["location","region"]),comments.session.location.region);
	make_text_input(td,"Address","session_"+session_id+"_location_address","session_"+session_id+"_location_address",o(session_object,["location","address"]),comments.session.location.address);
	
	
	//Project TD
	var td = document.createElement("td");
	td.id = "session_"+session_id+"_project_td";
	td.className = "session_project_td";
	tr.appendChild(td);
	
	var h2 = document.createElement("h2");
	h2.innerHTML = "Project";
	h2.title = comments.session.project.main;

	td.appendChild(h2);
	
	make_text_input(td,"Name","session_"+session_id+"_project_name","session_"+session_id+"_project_name",o(session_object,["project","name"]),comments.session.project.name);
	make_text_input(td,"Title","session_"+session_id+"_project_title","session_"+session_id+"_project_title",o(session_object,["project","title"]),comments.session.project.title);
	make_text_input(td,"ID","session_"+session_id+"_project_id","session_"+session_id+"_project_id",o(session_object,["project","id"]),comments.session.project.id);
	
	make_textarea(18,5,td,"Description","session_"+session_id+"_project_description","session_"+session_id+"_project_description","textarea",o(session_object,["project","description"]),comments.session.project.description);
	
	var h3 = document.createElement("h3");
	h3.innerHTML = "Contact";
	h3.title = comments.session.project.contact;
	td.appendChild(h3);

	make_text_input(td,"Name","session_"+session_id+"_contact_name","session_"+session_id+"_contact_name",o(session_object,["contact","name"]),comments.session.project.contact);
	make_text_input(td,"Address","session_"+session_id+"_contact_address","session_"+session_id+"_contact_address",o(session_object,["contact","address"]),comments.session.project.contact);
	make_text_input(td,"Email","session_"+session_id+"_contact_email","session_"+session_id+"_contact_email",o(session_object,["contact","email"]),comments.session.project.contact);
	make_text_input(td,"Organisation","session_"+session_id+"_contact_organisation","session_"+session_id+"_contact_organisation",o(session_object,["contact","organisation"]),comments.session.project.contact);
	
	
	// Content td
	var td = document.createElement("td");
	td.id = "session_"+session_id+"_content_td";
	td.className = "session_content_td";
	tr.appendChild(td);
	
	var h2 = document.createElement("h2");
	h2.innerHTML = "Content";
	h2.title = comments.session.content.main;
	td.appendChild(h2);

	open_vocabulary(td, "Genre","session_"+session_id+"_content_genre","session_"+session_id+"_content_genre",1,vocabularies.genre,o(session_object,["content","genre"]),comments.session.content.genre);	
	make_text_input(td,"Sub Genre","session_"+session_id+"_content_subgenre","session_"+session_id+"_content_subgenre",o(session_object,["content","subgenre"]),comments.session.content.subgenre);
	//Language
	//Session-wide content language not supported yet, only corpus-wide content language possible at this time
	open_vocabulary(td,"Task","session_"+session_id+"_content_task","session_"+session_id+"_content_task",1,vocabularies.task,o(session_object,["content","task"]),comments.session.content.task);
	
	make_textarea(18,5,td,"Description","session_"+session_id+"_content_description","session_"+session_id+"_content_description","textarea",o(session_object,["content","description"]),comments.session.content.description);

	var h3 = document.createElement("h3");
	h3.innerHTML = "Communication Context";
	h3.title = comments.session.content.communication_context.main;
	td.appendChild(h3);
	
	make_select(td, "Event Structure","session_"+session_id+"_content_eventstructure","session_"+session_id+"_content_eventstructure",1,vocabularies.event_structure,o(session_object,["content","eventstructure"]),comments.session.content.communication_context.event_structure);	
	make_select(td, "Planning Type","session_"+session_id+"_content_planningtype","session_"+session_id+"_content_planningtype",1,vocabularies.planning_type,o(session_object,["content","planningtype"]),comments.session.content.communication_context.planning_type);	
	make_select(td, "Interactivity","session_"+session_id+"_content_interactivity","session_"+session_id+"_content_interactivity",1,vocabularies.interactivity,o(session_object,["content","interactivity"]),comments.session.content.communication_context.interactivity);	
	make_select(td, "Social Context","session_"+session_id+"_content_socialcontext","session_"+session_id+"_content_socialcontext",1,vocabularies.social_context,o(session_object,["content","socialcontext"]),comments.session.content.communication_context.social_context);	
	make_select(td, "Involvement","session_"+session_id+"_content_involvement","session_"+session_id+"_content_involvement",1,vocabularies.involvement,o(session_object,["content","involvement"]),comments.session.content.communication_context.involvement);	

	
	//Actors td
	var td = document.createElement("td");
	td.className = "actors_TD";
	tr.appendChild(td);

	td.innerHTML = "<h2>Actors</h2>"+

	"Description of Actors:<br>"+
	"<textarea title=\"" + comments.session.actors.description + "\" name=\"session_"+session_id+"_actors_description\" id=\"session_"+session_id+"_actors_description\" cols=\"19\" rows=\"5\">"+o(session_object,"name")+"</textarea><br><br>"+
	"<div id='actors_of_session_"+session_id+"' class='actors'></div>"+
	"<div id='session_"+session_id+"_add_actors_div' class='actors'></div>";
	
	var td = document.createElement("td");
	td.className = "mediafiles_TD";
	td.id = "session_"+session_id+"_mf_td";
	tr.appendChild(td);

	td.innerHTML = 
	"<h2>Resources</h2>"+
	"<div id='mfs_of_session_"+session_id+"' class='mfs'></div>"+
	"<div id='session_"+session_id+"_add_mf_div'>"+

	"</div>";
	
	
	g("session_"+session_id+"_name").addEventListener("blur", function(num){
	
		return function(){
		
			RefreshSessionNameDisplay(num);
		}
	}(session_id) );
	
	
	if (typeof(session_object.actors) != "undefined"){
	
		for (var a=0; a<session_object.actors.length; a++){
	
			add_actor_to_session(session_id, session_object.actors[a]);
	
		}
	}
	
	
	if (typeof(session_object.writtenResources) != "undefined"){
		
		for (var r=0; r<session_object.writtenResources.length; r++){
	
			add_resource_to_session(session_id, session_object.writtenResources[r].resource_file_index,true);
	
		}
	
	}
	
	if (typeof(session_object.mediaFiles) != "undefined"){
		
		for (var r=0; r<session_object.mediaFiles.length; r++){
	
			add_resource_to_session(session_id, session_object.mediaFiles[r].resource_file_index,true);
	
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
		console.log("showing no session text cause session.length is 0 after erasing session " + session_id);
	} 


}

function show_no_session_text(){

	console.log("Showing no session text");

	g("sessions").innerHTML = "";

	var no_sessions_message = new_element("h2","no_session_text","no_session_text",g("sessions"));
	no_sessions_message.innerHTML = "This corpus contains no sessions. Why not ";

	var new_session_link = new_element("a","new_session_link","new_session_link",no_sessions_message);

	new_session_link.innerHTML = "create one";
	new_session_link.href = "#";

	no_sessions_message.innerHTML += "?";

	g("new_session_link").addEventListener('click', function(){ new_session({}); });
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
	if (sessions[GetSessionIndexFromID(session_id)].actors.indexOf(actor_id) == -1){
	
		if (actors[getActorsIndexFromID(actor_id)]){  //check if actor still exists before adding
	
			sessions[GetSessionIndexFromID(session_id)].actors.push(actor_id);
		
			var div0 = document.createElement('div');
			div0.id = "session_" + session_id + "_actor_" + actor_id;
			div0.className = "actor_in_session_wrap";
			g('actors_of_session_'+session_id).appendChild(div0);
	
			var div = document.createElement('div');
			div.id = "session_"+session_id+"_actor_" + actor_id + "_label";
			div.className = "actor_in_session";
			g("session_"+session_id+"_actor_" + actor_id).appendChild(div);
			
			RefreshActorNameInSession(session_id, actor_id);
		
			//div.innerHTML = "<h2 class='actor_name_disp'>" + actors[getActorsIndexFromID(actor_id)].name + "</h2>"; //display name of actor
			//div.innerHTML += "<p class='actor_role_disp'>" + actors[getActorsIndexFromID(actor_id)].role + "</p>";   //display role of actor
			
			var img = document.createElement('img');
			img.id = "delete_actor_"+actor_id+"_icon";
			img.src = path_to_images+"icons/reset.png";
			img.className = "delete_actor_icon";
			g("session_"+session_id+"_actor_" + actor_id).appendChild(img);
	
			img.addEventListener('click', function(num, num2) { 
				return function(){ RemoveActorFromSession(num, num2);  
				};
			}(session_id, actor_id) );
			
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



function RemoveActorFromSession(session_id, actor_id){

	var position_in_array = sessions[GetSessionIndexFromID(session_id)].actors.indexOf(actor_id);
	
	console.log("Removing actor. Position in array: " + position_in_array);

	//remove actor_id in array
	sessions[GetSessionIndexFromID(session_id)].actors.splice(position_in_array,1);
	
	remove("session_"+session_id+"_actor_"+actor_id);
	
	save_form();
	
}


function add_resource_to_session(session_id, resource_file_index, without_questions){
// media_file_index is the index of the available media file, that is to be added to the session
// if resource_file_index is -1, a new empty field with no available media file is created
//if without_questions == true, no alerts will be thrown (e.g. when resources are added at start up)

	if (resource_file_index >= available_resources.length){
		return;
	}

	var div = document.createElement('div');
	div.id = "session_"+session_id+"_mediafile_" + counters.resource_id;

	var h3 = document.createElement("h3");
	
	if ((GetValidityOfFile(available_resources[resource_file_index][0]) == 0) || (GetValidityOfFile(available_resources[resource_file_index][0]) == 2)){
		h3.innerHTML = "Media File";
		
		sessions[GetSessionIndexFromID(session_id)].mediaFiles.push({
			name: available_resources[resource_file_index][0],
			size: available_resources[resource_file_index][2],
			id: counters.resource_id,
			resource_file_index: resource_file_index
		});
		
		div.className = "mf";	

	}
	
	else if ((GetValidityOfFile(available_resources[resource_file_index][0]) == 1) || (GetValidityOfFile(available_resources[resource_file_index][0]) == 3)){
	
		h3.innerHTML = "Written Resource";
		
		sessions[GetSessionIndexFromID(session_id)].writtenResources.push({
			name: available_resources[resource_file_index][0],
			size: available_resources[resource_file_index][2],
			id: counters.resource_id,
			resource_file_index: resource_file_index
		});
		
		div.className = "wr";	
		
	}
	
	else {
	
		if (!without_questions){
		
			alertify.set({ labels: {
				ok     : "OK",
			} });
	
			alertify.alert("We have a problem.<br>I don't know if this file is a Media File or a Written Resource:<br>" + available_resources[resource_file_index][0] + 
			"<br>As for now, I will handle it as a written resource. But you really shouldn't do that");
		
		}
		
		h3.innerHTML = "Written Resource";
		
		sessions[GetSessionIndexFromID(session_id)].writtenResources.push({
			name: available_resources[resource_file_index][0],
			size: available_resources[resource_file_index][2],
			id: counters.resource_id,
			resource_file_index: resource_file_index
		});
		
		div.className = "wr";
		
	}
	
	g('mfs_of_session_'+session_id).appendChild(div);
	
	div.appendChild(h3);
	
	var img = new_element("img","delete_resource_" + counters.resource_id +"_icon","delete_resource_icon",div);
	
	img.src = path_to_images+"icons/reset.png";
	
	img.addEventListener('click', function(num, num2) { 
		return function(){ RemoveResourceFromSession(num, num2);  
		};
	}(session_id,counters.resource_id) );
	
	
	var span = document.createElement("span");
	span.className = "resource_file_content_span";
	
	span.innerHTML = "File Name:<br><input type=\"text\" name=\"session_"+session_id+"_mediafile_" + counters.resource_id + "_name\" value=\"\"><br>"+
	"Size:<br><input type=\"text\" name=\"session_"+session_id+"_mediafile_" + counters.resource_id + "_size\" value=\"\">";
	
	div.appendChild(span);

	if (resource_file_index!=-1){
	// if an existing media file is added, adopt its name and date to the input fields

		div.getElementsByTagName("input")[0].value = available_resources[resource_file_index][0];	//name
		div.getElementsByTagName("input")[1].value = available_resources[resource_file_index][2];	//size

	}
	
	//Rename the session if an EAF file is added for the first time and session has no name yet
	if ((GetFileTypeFromFilename(div.getElementsByTagName("input")[0].value) == "eaf") && (get("session_"+session_id+"_name") == "")){
	
		var name = RemoveEndingFromFilename(available_resources[resource_file_index][0]);
		
		g("session_"+session_id+"_name").value = name;
		
		RefreshSessionNameDisplay(session_id);
	
		alertify.log("Session name has been taken from EAF file name, since session has not been manually named yet.","",8000);
	
	}
	
	
	//Check, if there is a date string in the form of YYYY-MM-DD in the filename of an eaf file. If so, adopt it for the session date
	//only, if session date is still YYYY
	if ((GetFileTypeFromFilename(div.getElementsByTagName("input")[0].value) == "eaf") && (get("session_"+session_id+"_date_year") == "YYYY")){
		
		var date = parseDate(available_resources[resource_file_index][0]);
		
		if (date != null){
		
			g("session_"+session_id+"_date_year").value = date.year;
			g("session_"+session_id+"_date_month").value = date.month;
			g("session_"+session_id+"_date_day").value = date.day;
			
			alertify.log("Session date has been extracted from EAF file name: " + date.year + "-" + date.month + "-" + date.day, "", 5000);
		
		}
	
	
	}

	counters.resource_id+=1;
	
	return counters.resource_id-1;
	
}


function parseDate(str){
	var t = str.match(/([1-2][0-9][0-9][0-9])\-([0-1][0-9])\-([0-3][0-9])/);
	
	if(t!==null){
		
		var y=+t[1], m=+t[2], d=+t[3];
		var date = new Date(y,m-1,d);
		
		if(date.getFullYear()===y && date.getMonth()===m-1){
			return {
			
				year: t[1],
				month: t[2],
				day: t[3]
				
			
			};   
		}
	
	}
	
	return null;
}


function RefreshSessionNameDisplay(session_id){

	if (get("session_"+session_id+"_name")==""){
		g("session_"+session_id+"_label").innerHTML = "<h1 class=\"session_heading\">Unnamed Session   </h1>";
	}
	
	else {
	
		g("session_"+session_id+"_label").innerHTML = "<h1 class=\"session_heading\">Session: "+get("session_"+session_id+"_name")+"   </h1>";

	}

}


function RemoveResourceFromSession(session_id, resource_id){

	var ids_of_sessions_media_files = [];
	
	for (var m=0; m<sessions[GetSessionIndexFromID(session_id)].mediaFiles.length; m++){
	
		ids_of_sessions_media_files.push(sessions[GetSessionIndexFromID(session_id)].mediaFiles[m].id);
	
	}
	
	var ids_of_sessions_written_resources = [];
	
	for (var m=0; m<sessions[GetSessionIndexFromID(session_id)].writtenResources.length; m++){
	
		ids_of_sessions_written_resources.push(sessions[GetSessionIndexFromID(session_id)].writtenResources[m].id);
	
	}

	if (ids_of_sessions_written_resources.indexOf(resource_id) != -1){

		sessions[GetSessionIndexFromID(session_id)].writtenResources.splice(GetIndexFromResourceID(resource_id),1);
	
	}
	
	if (ids_of_sessions_media_files.indexOf(resource_id) != -1){

		sessions[GetSessionIndexFromID(session_id)].mediaFiles.splice(GetIndexFromResourceID(resource_id),1);
	
	}
	
	var child = document.getElementById("session_"+session_id+"_mediafile_"+resource_id);
	
	document.getElementById("mfs_of_session_"+session_id).removeChild(child);

}



function assign_session1_metadata(){

	if (g("copy_check_location").checked){
		copy_fields_to_all_sessions(0);
	}
	
	if (g("copy_check_project").checked){
		copy_fields_to_all_sessions(1);
	}
	
	if (g("copy_check_content").checked){
		copy_fields_to_all_sessions(2);
	}
	
	if (g("copy_check_date").checked){
		copy_fields_to_all_sessions(3);
	}
	
	if (g("copy_check_actors").checked){

		for (var s=1;s<sessions.length;s++){
			RemoveAllActorsFromSession(sessions[s].id);
		
			// copy actors from session 1 to session session
			for (var a=0;a<sessions[0].actors.length;a++){
				add_actor_to_session(sessions[s].id,sessions[0].actors[a]);
			}
			
			copy_field("session_"+sessions[s].id+"_actors_description","session_"+sessions[0].id+"_actors_description");
		}
	}
	
	if (sessions.length < 2){
	
		alertify.log("There have to be at least 2 sessions to assign metadata from one to another.", "error", "5000");
	}
	
	else {
	
		alertify.log("Session 1 metadata assigned to all sessions.", "", "5000");
	
	}
}


function copy_fields_to_all_sessions(group){

	var fields_to_copy = [
		["location_continent","location_country","location_region","location_address"],
		["project_name","project_title","project_id","project_description","contact_name","contact_address","contact_email","contact_organisation"],
		["content_genre","content_subgenre",/*"content_language",*/"content_task","content_description","content_eventstructure","content_planningtype","content_interactivity","content_socialcontext","content_involvement"],
		["date_year","date_month","date_day"]
	];
	//it is indeed html conform to get textarea.value
	
	for (var s=1;s<sessions.length;s++){
	
		for (var k=0;k<fields_to_copy[group].length;k++){
			copy_field("session_"+sessions[s].id+"_"+fields_to_copy[group][k],"session_"+sessions[0].id+"_"+fields_to_copy[group][k]);
		}
	
	}
	
}

function RemoveAllActorsFromSession(session_id){
//Remove all actors from respective session
	
	while (sessions[GetSessionIndexFromID(session_id)].actors.length > 0){
		RemoveActorFromSession(session_id,sessions[GetSessionIndexFromID(session_id)].actors[0]);
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

	g("session_"+sessions[s].id+"_add_mf_div").innerHTML = "";

	var select = document.createElement("select");
	
	for (var i=0;i<available_resources.length;i++){ 
		
		NewOption = new Option( available_resources[i][0], i, false, true);
		select.options[select.options.length] = NewOption;		
		
	}

	if (available_resources.length > 0){
	
		g("session_"+sessions[s].id+"_add_mf_div").appendChild(select);
	
		select.selectedIndex = 0;	
	
		var add_button = document.createElement("input");
		add_button.type = "button";
		add_button.value = "Add to session";
		
		g("session_"+sessions[s].id+"_add_mf_div").appendChild(document.createElement("br"));
		
		g("session_"+sessions[s].id+"_add_mf_div").appendChild(add_button);		
		
		add_button.addEventListener('click', function(num) { 
			return function(){ add_resource_to_session(num, select.selectedIndex);  };
		}(sessions[s].id) );
		
	}

	if (available_resources.length == 0){
	
		var p = document.createElement("h5");
		g("session_"+sessions[s].id+"_add_mf_div").appendChild(p);
		p.innerHTML = "No files have been added.<br>";
	
		var a = document.createElement("a");
		a.href="#";
		a.innerHTML = "Add some files.";
	
		p.appendChild(a);

		a.addEventListener('click', function() { 
			show_window(3);
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
	
		if (get("session_"+sessions[i].id+"_name") == ""){
		
			return false;
		
		}
		
		for (var c=0; c<not_allowed_chars.length; c++){
	
			if (get("session_"+sessions[i].id+"_name").indexOf(not_allowed_chars[c]) != -1){
		
				return false;
			
			}
	
		}
		
	}
	
	return true;

}