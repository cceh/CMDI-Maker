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


function erase_actor_database(){

	alertify.set({ labels: {
		ok     : "No",
		cancel : "Yes, delete all actors"
	} });

	alertify.confirm("Really?<br>You want to erase the whole actors database?", function (e) {

		if (e) {
			// user clicked "ok"
			
		}
	
		else {
			// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
			
			counters.actor_id = 0;
			localStorage.setItem("actor_id_counter",0);
			
			localStorage.setItem("actors","[]");

			alertify.log("Actor Database deleted", "", "5000");
			GetActorsFromWebStorage();
  
			for (var s=0;s<sessions.length;s++){
				RemoveAllActorsFromSession(sessions[s].id);
			}
			
			
  
		}
	});
}


function show_actor(actor_id){
// -1 = empty form to create a new actor

	console.log("Showing actor "+actor_id);
	
	//new actors cannot be deleted, so remove the icon:
	if (actor_id == -1) {
		g('link_delete_active_actor').style.display = "none";
		g('link_duplicate_active_actor').style.display = "none";
	}
	
	else {
		g('link_delete_active_actor').style.display = "inline";
		g('link_duplicate_active_actor').style.display = "inline";
	}

	close_actor_language_select();	
	highlight_active_actor_div(actor_id);
	clear_active_actor_languages();

	active_actor = actor_id;

	if (actor_id != -1){
		//show data of selected actor in form

		g("actor_form_title").innerHTML = actors[actor_id].name;

		set_form_value("actor_name",actors[actor_id].name);
		set_form_value("actor_full_name",actors[actor_id].full_name);
		set_form_value("actor_code",actors[actor_id].code);
		set_form_value("actor_role",actors[actor_id].role);
		set_form_value("actor_ethnic_group",actors[actor_id].ethnic_group);
		set_form_value("actor_family_social_role",actors[actor_id].family_social_role);
		set_form_value("actor_age",actors[actor_id].age);
		set_form_value("actor_birth_date_year",actors[actor_id].birth_date.year);
		set_form_value("actor_birth_date_month",actors[actor_id].birth_date.month);
		set_form_value("actor_birth_date_day",actors[actor_id].birth_date.day);
		set_form_value("actor_sex",actors[actor_id].sex);
		set_form_value("actor_education",actors[actor_id].education);
		
		document.getElementsByName("actor_contact_name")[0].value = actors[actor_id].contact.email;
		document.getElementsByName("actor_contact_address")[0].value = actors[actor_id].contact.address;
		document.getElementsByName("actor_contact_email")[0].value = actors[actor_id].contact.email;
		document.getElementsByName("actor_contact_organisation")[0].value = actors[actor_id].contact.organisation;
		document.getElementsByName("actor_description")[0].value = actors[actor_id].description;
	
		document.getElementsByName("actor_anonymized")[0].checked = actors[actor_id].anonymized;
		
		show_languages_of_active_actor();
		g("save_actor_span").innerHTML = " Save changes to this actor";

	}

	else {

		blank_actor_form();

		g("save_actor_span").innerHTML = " Save Actor";

	}


}

function export_actors(){
	
	var actors_json = JSON.stringify(actors);
	
	save_file(actors_json, "actors.json", "application/json;charset=utf-8");


}


function import_actors(evt){

    var files = evt.target.files; // FileList object

	console.log(files);
	
	var file = files[0];
	
	console.log(file);
	
	reader = new FileReader();
	
	reader.onload = function(e){
	
		try {
			var imported_actors = JSON.parse(e.target.result);
		}
		
		catch (e) {
			console.log(e);
			return;
		}
		
		for (var a=0; a<imported_actors.length; a++){
			save_actor(imported_actors[a], true);
		}
		
		RefreshActorsInWebStorage();
		RefreshActorsListDisplay();
		
		alertify.log(imported_actors.length + " actors imported");
	
	}
	
	reader.readAsText(file);
	
}

function calcAgeAtDate(dateString,birthDate) {
	
	var date = +new Date(dateString);
	var birthday = +new Date(birthDate);
	return ~~((date - birthday) / (31557600000));
}



function set_form_value(element_id,value){

	var element = g(element_id);
	
	if (element.nodeName == "SELECT"){
	
		var options = [];
		
		for (var o=0;o<element.options.length;o++){
		
			options.push(element.options[o].value);
		
		
		}
		
		if (options.indexOf(value) == -1){
	
			console.log("Now i should change the nodename of the object.");
			
			var new_element = change_ov_input(element_id, options);
			
			new_element.value = value;
		
		}
		
		else {
		
			element.value = value;
			
		}
	
	}
	
	else {
	
		element.value = value;
	
	}


}


function blank_actor_form(){

	g("actor_form_title").innerHTML = "New Actor";

	set_form_value("actor_name","");
	set_form_value("actor_full_name","");
	set_form_value("actor_code","");
	set_form_value("actor_role","Unknown");
	set_form_value("actor_ethnic_group","");
	set_form_value("actor_family_social_role","Unknown");
	set_form_value("actor_age","");
	set_form_value("actor_birth_date_year","YYYY");
	set_form_value("actor_birth_date_month","MM");
	set_form_value("actor_birth_date_day","DD");
	set_form_value("actor_sex","Unknown");
	set_form_value("actor_education","");

	set_form_value("actor_contact_name","");
	set_form_value("actor_contact_address","");
	set_form_value("actor_contact_email","");
	set_form_value("actor_contact_organisation","");
	
	set_form_value("actor_description","");

	document.getElementsByName("actor_anonymized")[0].checked = false;

	clear_active_actor_languages();
	
}


function MakeActorObjectOutOfForm(){

	var object = {
		role: "",
		name: '',
		full_name: '',
		code: '',
		ethnic_group: '',
		family_social_role: '',
		age: 52,
		birth_date: {
			year: '',
			month: '',
			day: ''
		},
		sex: '',
		education: '',
		contact: {
			name: '',
			address: '',
			email: '',
			organisation: ''
		},
		description: '',
		anonymized: false,
		id: 0,
		
		languages: []
	};

	object.role = get("actor_role");
	object.name = get("actor_name");
	object.full_name = get("actor_full_name");
	object.code = get("actor_code");
	object.ethnic_group = get("actor_ethnic_group");
	object.family_social_role = get("actor_family_social_role");
	object.age = get("actor_age");
	object.birth_date.year = get("actor_birth_date_year");
	object.birth_date.month = get("actor_birth_date_month");
	object.birth_date.day = get("actor_birth_date_day");
	object.sex = get("actor_sex");
	object.education = get("actor_education");

	object.contact.name = get("actor_contact_name");
	object.contact.address = get("actor_contact_address");
	object.contact.email = get("actor_contact_email");
	object.contact.organisation = get("actor_contact_organisation");
	
	object.description = get("actor_description");

	object.anonymized = document.getElementsByName("actor_anonymized")[0].checked;
	
	for (var l=0; l<languages_of_active_actor.length; l++){
	
		var id = languages_of_active_actor[l].id;
	
		var ActorLanguageObject = {
			
			LanguageObject: languages_of_active_actor[l].LanguageObject,
			MotherTongue: g("mothertongue_" + id).checked,
			PrimaryLanguage: g("primarylanguage_" + id).checked
			
		}
		
		object.languages.push(ActorLanguageObject);
		
	}
	

	//if we're not creating a new actor but updating an existing one, we also pass the id of active actor to the db
	if (active_actor != -1) {
		object.id = actors[active_actor].id;
		console.log("Saving actor with id "+object.id);
	}
	
	else {
	
		object.id = counters.actor_id;
		console.log("Saving actor with id "+object.id);
		counters.actor_id++;
		
		localStorage.setItem("actor_id_counter",counters.actor_id);
	
	}

	return object;
 
}


function duplicate_active_actor(){

	//first, save changes to the actor
	var save = save_active_actor();
	
	//then create a duplicate
	if (save == true){
		save_active_actor(true);
		alertify.log("Actor saved and duplicated.","success",5000);
	}

}


function save_active_actor(do_not_overwrite){
//do_not_overwrite can be true or false. if true, active actor will not be overwritten, but duplicated

	if (get("actor_name") != ""){

		if (!do_not_overwrite){
			var do_not_overwrite = false;
		}
		
		var actor_to_put = MakeActorObjectOutOfForm();
		
		return save_actor(actor_to_put, do_not_overwrite);
		
	}

	else {
	
		alertify.set({ labels: {
			ok     : "OK"
		} });

		alertify.alert("Please give your actor a name first.");
		return false;
		
	}

}


function save_actor(actor_to_put, do_not_overwrite){

	var actor_ids = [];
	
	//create array with all actor ids
	for (var a=0; a<actors.length;a++){
		actor_ids.push(actors[a].id);
	}

	//if this actor does already exist and is to be overwritten, overwrite the object in the array
	if ((actor_ids.indexOf(actor_to_put.id ) != -1) && (do_not_overwrite == false)) {
		actors.splice(getActorsIndexFromID(actor_to_put.id),1,actor_to_put);
		
		//if the actor does already exist, check if it is in a session and correct the actor name in the session, if required
		for (var s=0; s<sessions.length; s++){
	
			//search for actor_id in this session's actors
			if (sessions[s].actors.indexOf(actor_to_put.id) != -1){
				
				RefreshActorNameInSession(sessions[s].id, actor_to_put.id);
	
			}
			
		}
	
		
	}
	
	else {    //if actor shall not be overwritten, give the duplicate/new generated actor a new id
		
		actor_to_put.id = counters.actor_id;
		console.log("Saving actor with id "+actor_to_put.id);
		counters.actor_id++;
		
		localStorage.setItem("actor_id_counter",counters.actor_id);
		
		actors.push(actor_to_put);
	}
 
	console.log('Yeah, dude inserted! insertId is: ' + actor_to_put.id);

	RefreshActorsInWebStorage();
	RefreshActorsListDisplay();
	
	return true;

}

function RefreshActorNameInSession(session_id, actor_id){

	var div = g("session_" + session_id + "_actor_" + actor_id + "_label");
	div.innerHTML = "<h2 class='actor_name_disp'>" + actors[getActorsIndexFromID(actor_id)].name + "</h2>";  //display name of actor
	div.innerHTML += "<p class='actor_role_disp'>" + actors[getActorsIndexFromID(actor_id)].role + "</p>";   //display role of actor


}



function highlight_active_actor_div(actor_id){

	for (var i=0;i<actors.length;i++){
		g("ac_list_entry_"+i).style.background = "#FF8BC7";
	}

	g("ac_list_entry_-1").style.background = "#FF8BC7";
	//make everything normal at first

	g("ac_list_entry_"+actor_id).style.background = "lightskyblue";

}



function delete_active_actor(){

	var name_of_actor = actors[active_actor].name;

	alertify.set({ labels: {
		ok     : "No",
		cancel : "Yes, delete actor"
	} });

	alertify.confirm("Really?<br>You want to erase "+name_of_actor+"?", function (e) {

		if (e) {
			// user clicked "ok"
		}
	
		else {
			// user clicked "cancel"
			
			actors.splice(active_actor,1);
			RefreshActorsListDisplay();
			RefreshActorsInWebStorage();
			
			

  
			alertify.log("Actor "+name_of_actor+" deleted", "", "5000");

		}
	});
}


function RefreshActorsInWebStorage(){

	localStorage.setItem("actors", JSON.stringify(actors));
	
	localStorage.setItem("actor_id_counter",counters.actor_id);

}

function GetActorsFromWebStorage(){

	actors = [];  //Reset the cache!
	

	var actors_db = localStorage.getItem("actors");
	
	if (actors_db == null){
		actors_db = "[]";
	}
	
	counters.actor_id = localStorage.getItem("actor_id_counter");
	
	if (counters.actor_id == null){
		counters.actor_id = 0;
	}
	
	actors = JSON.parse(actors_db);

	console.log(actors.length + ' actors taken from Web Storage');
	
	RefreshActorsListDisplay();
	
}

function sort_actors_alphabetically(){

	actors = sortByKey(actors,"name");

	RefreshActorsInWebStorage();
	RefreshActorsListDisplay();
	
	alertify.log("Actors sorted.","",5000);

}


function RefreshActorsListDisplay(){

	g('ac_list').innerHTML = "";

	for (var i=0;i<actors.length;i++){

		var div = document.createElement('div');
		div.id = "ac_list_entry_"+(i);
		div.className = "ac_list_entry";



		div.innerHTML = "<h2>" + actors[i].name + "</h2>" + //display name of actor
		"<p>"+actors[i].role+"</p>";
	

	
		div.addEventListener('click', function(num) { 
			return function(){ show_actor(num); }; 
		}(i), false );
		

		g('ac_list').appendChild(div);				
	}

	//create field for new actor
	var div = document.createElement('div');
	div.id = "ac_list_entry_-1";
	div.className = "ac_list_entry";

	div.addEventListener('click', function() { show_actor(-1); } , false );


	div.innerHTML = "<h2>New Actor</h2>";

	g('ac_list').appendChild(div);	

	RefreshActorListsInSessions();


	switch (actors.length){
	
		case 0: {
			show_actor(-1);
			break;
		}
		
		case 1: {
			show_actor(0);
			break;
		}
		
		default: {
		
			if (active_actor >= actors.length){
				show_actor(actors.length-1);
			}
			
			else {
				show_actor(active_actor);
			}
		
			break;
		}
	}
}


function RefreshActorListInSession(s,all_available_actor_ids){

	var aad = g("session_"+sessions[s].id+"_add_actors_div");
	
	aad.innerHTML = "";

	var select = document.createElement("select");
	
	for (var a=0;a<actors.length;a++){ 
	
		var value = actors[a].name + " (" + actors[a].role + ")";
		
		NewOption = new Option( value, a, false, true);
		select.options[select.options.length] = NewOption;		
		
	}

	if (actors.length > 0){
	
		aad.appendChild(select);
	
		select.selectedIndex = 0;	
	
		var add_button = document.createElement("input");
		add_button.type = "button";
		add_button.value = "Add to session";
		
		aad.appendChild(document.createElement("br"));
		
		aad.appendChild(add_button);		
		
		add_button.addEventListener('click', function(num) { 
			return function(){ add_actor_to_session(num, actors[select.selectedIndex].id);  };
		}(sessions[s].id) );
		
	}
	
	if (actors.length == 0){
	
		var link = document.createElement("a");
		link.href="#";
		link.innerHTML = "Create some actors.";
		
		var h5 = document.createElement("h5");
		h5.innerHTML = "There are no actors in the database yet.<br>";
	
		aad.appendChild(h5);
		h5.appendChild(link);
		
		link.addEventListener('click', function() { 
			show_window(1);  
		} );
	}
	
	
	console.log("Refreshing Actor List of Session "+s);
	
	
	//check if actor in session is part of actors[...].id(s)? if not, remove it immediately!
	for (var k=0;k<sessions[s].actors.length;k++){
		
		console.log("Trying to find id " + sessions[s].actors[k] + " in actors of session "+s);
		
		// if an actor k is not in all available actors, remove it in the session!
		if (all_available_actor_ids.indexOf(sessions[s].actors[k]) == -1){
			
			console.log("There is an actor in session "+s+" that does not exist anymore. Deleting!");
			RemoveActorFromSession(sessions[s].id,sessions[s].actors[k]);
		
		}
	
	
	}


}



function RefreshActorListsInSessions(){
	//Offer possibility to add every available actor to all session
	//refresh all sessions with available actors

	var all_available_actor_ids = [];
	
	for (var n=0; n<actors.length; n++){
		all_available_actor_ids.push(actors[n].id);
	}
	
	

	for (var s=0;s<sessions.length;s++){   //for all existing sessions
	
		RefreshActorListInSession(s,all_available_actor_ids);

	}

}