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


eldp_environment.workflow[1] = (function(){

	var my = {};
	var session;
	
	var actor_form = eldp_environment.actor_form;
	
	my.actors = [];
	
	my.identity = {
		id: "actor",
		title: "Persons",
		icon: "user.png"
	};
	
	my.id_counter = 0;
	my.active_actor = -1;
	
	my.init = function(){
	
		my.actors = [];
		my.id_counter = 0;
		my.active_actor = -1;
		
		session = eldp_environment.workflow[2];
		
		var view = g(APP_CONF.view_id_prefix + my.identity.id);
		
		dom.newElement("div","ac_list","",view);
		var ac_view = dom.newElement("div","ac_view","",view);
		dom.newElement("div","actor_title_div","",ac_view,'<h1 id="actor_form_title">New Actor</h1>');
		dom.newElement("div","actor_content_div","",ac_view);
		
		my.createForm();
		
		my.refreshListDisplay(true);
		
	}
	
	
	my.getSaveData = function(){
	
		var object = {};
		
		object.actors = my.actors;
		object.id_counter = my.id_counter;
		object.active_actor = my.active_actor;
		
		return object;
	
	}
	
	
	my.recall = function(data){
	
		my.actors = data.actors;
		my.id_counter = data.id_counter;
		my.active_actor = data.active_actor;
		
		my.refreshListDisplay();
	
	}
	
	
	my.view = function(){
	
		my.show(my.active_actor);
	
	}
	
	
	my.functions = [
		{
			id: "link_save_active_actor",
			icon: "save.png",
			label_span_id: "save_actor_span",
			onclick: function() { my.save_active_actor(); }
		},
		{
			id: "link_delete_active_actor",
			icon: "reset.png",
			label: "Delete this actor",
			onclick: function() { my.delete_active_actor(); }
		},
		{
			id: "link_sort_actors_alphabetically",
			icon: "az.png",
			label: "Sort Actors alphabetically",
			onclick: function() { my.sortAlphabetically(); }
		},
		{
			id: "link_duplicate_active_actor",
			icon: "duplicate_user.png",
			label: "Save and duplicate this actor",
			onclick: function() { my.duplicate_active_actor(); }
		}	
	];
	

	my.erase_database = function(){

		alertify.set({ labels: {
			ok     : "No",
			cancel : "Yes, delete all actors"
		} });

		alertify.confirm("Really?<br>You want to erase the whole actors database?", function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button
				
				my.id_counter = 0;
				my.actors = [];

				alertify.log("All actors deleted", "", "5000");
				save_and_recall.save();
	  
				for (var s=0;s<session.sessions.length;s++){
					session.removeAllActors(session.sessions[s].id);
				}
				
				
	  
			}
		});
	}


	my.show = function(actor_id){
	// -1 = empty form to create a new actor

		console.log("Showing actor "+actor_id);
		
		if (actor_id == -1) {
			g('link_delete_active_actor').style.display = "none";
			g('link_duplicate_active_actor').style.display = "none";
			
			g("save_actor_span").innerHTML = "Save actor";
		}
		
		else {
			g('link_delete_active_actor').style.display = "inline";
			g('link_duplicate_active_actor').style.display = "inline";
			
			g("save_actor_span").innerHTML = "Save changes to this actor";
		}
		
		my.highlight_active_actor_div(actor_id);

		my.active_actor = actor_id;

		if (actor_id != -1){
			//show data of selected actor in form

			g("actor_form_title").innerHTML = my.actors[actor_id].name;

			dom.setFormValue("actor_name",my.actors[actor_id].name);
			dom.setFormValue("actor_full_name",my.actors[actor_id].full_name);
			dom.setFormValue("actor_code",my.actors[actor_id].code);
			dom.setFormValue("actor_role",my.actors[actor_id].role, actor_form.fields[1].fields[0].vocabulary);
			dom.setFormValue("actor_ethnic_group",my.actors[actor_id].ethnic_group);
			dom.setFormValue("actor_family_social_role",my.actors[actor_id].family_social_role, actor_form.fields[1].fields[2].vocabulary);
			dom.setFormValue("actor_age",my.actors[actor_id].age);
			dom.setFormValue("actor_birth_date_year",my.actors[actor_id].birth_date.year);
			dom.setFormValue("actor_birth_date_month",my.actors[actor_id].birth_date.month);
			dom.setFormValue("actor_birth_date_day",my.actors[actor_id].birth_date.day);
			dom.setFormValue("actor_sex",my.actors[actor_id].sex);
			dom.setFormValue("actor_education",my.actors[actor_id].education);
			
			dom.setFormValue("actor_contact_name",my.actors[actor_id].contact.name);
			dom.setFormValue("actor_contact_address",my.actors[actor_id].contact.address);
			dom.setFormValue("actor_contact_email",my.actors[actor_id].contact.email);
			dom.setFormValue("actor_contact_organisation",my.actors[actor_id].contact.organisation);
			dom.setFormValue("actor_description",my.actors[actor_id].description);
		
			document.getElementsByName("actor_anonymized")[0].checked = my.actors[actor_id].anonymized;
			
			if (APP.active_view == APP_CONF.view_id_prefix + my.identity.id){
				g("save_actor_span").innerHTML = " Save changes to this actor";
			}

		}

		else {

			my.blank_form();

			if (APP.active_view == APP_CONF.view_id_prefix + my.identity.id){
				g("save_actor_span").innerHTML = " Save Actor";
			}

		}


	}
	
	
	my.getActorsIndexFromID = function(actor_id) {

		for(var i = 0, len = my.actors.length; i < len; i++) {
			if (my.actors[i].id == actor_id) return i;
		}
		
		return alert("An error has occured.\nCould not find actors cache index from actor id!\n\nactor_id = " + actor_id);
		
	}
	
	
	my.export_actors = function(){
		
		if (my.actors.length != 0){
		
			var actors_json = JSON.stringify(my.actors);
			
			APP.save_file(actors_json, "actors.json", APP_CONF.file_download_header);
			
		}
		
		else {
		
			alertify.alert("There are no actors!")
		
		}


	}


	my.import_actors = function(evt){

		var files = evt.target.files; // FileList object

		console.log(files);
		
		var file = files[0];
		
		console.log(file);
		
		var reader = new FileReader();
		
		reader.onload = function(e){
		
			var result = e.target.result;
		
			try {
				var imported_actors = JSON.parse(result);
			}
			
			catch (e) {
			//if json parsing is not possible, try xml parsing

				if (window.DOMParser) {
					var parser = new DOMParser();
					
					var xml = parser.parseFromString(result,"text/xml");
					
					var imported_actors = parse_imdi_for_actors(xml);
					
				}
				
				
			}
			
			if (!imported_actors){
				return;
			}
			
			for (var a=0; a<imported_actors.length; a++){
				my.save(imported_actors[a], true);
			}
			
			save_and_recall.save();
			my.refreshListDisplay();
			
			alertify.log(imported_actors.length + " actors imported");
		
		}
		
		reader.readAsText(file);
		
	}


	my.parse_imdi_for_actors = function(xml){

		var actors_in_xml = xml.getElementsByTagName("Actor");
		
		var actors_in_json = [];
		
		for (var a=0; a<actors_in_xml.length; a++){
		
			
			console.log("Actor in IMDI found. Name: " + actors_in_xml[a].querySelector("Name").textContent.trim());
			
			var actor = {
				name: actors_in_xml[a].querySelector("Name").textContent.trim(),
				role: actors_in_xml[a].querySelector("Role").textContent.trim(),
				full_name: actors_in_xml[a].querySelector("FullName").textContent.trim(),
				code: actors_in_xml[a].querySelector("Code").textContent.trim(),		
				age: actors_in_xml[a].querySelector("Age").textContent.trim(),
				sex: actors_in_xml[a].querySelector("Sex").textContent.trim(),		
				education: actors_in_xml[a].querySelector("Education").textContent.trim(),
				birth_date: parse_birth_date(actors_in_xml[a].querySelector("BirthDate").textContent.trim()),
				ethnic_group: actors_in_xml[a].querySelector("EthnicGroup").textContent.trim(),
				family_social_role: actors_in_xml[a].querySelector("FamilySocialRole").textContent.trim(),
				
				description: actors_in_xml[a].querySelector("Description").textContent.trim(),
				
				contact: {
				
					name: actors_in_xml[a].querySelector("Contact").querySelector("Name").textContent.trim(),
					address: actors_in_xml[a].querySelector("Contact").querySelector("Address").textContent.trim(),
					email: actors_in_xml[a].querySelector("Contact").querySelector("Email").textContent.trim(),
					organisation: actors_in_xml[a].querySelector("Contact").querySelector("Organisation").textContent.trim(),
				
				
				},
				
				anonymized: (actors_in_xml[a].querySelector("Anonymized").textContent.trim() == "true") ? true : false,
			
			}
			
			actors_in_json.push(actor);

		}
		
		console.log(actors_in_xml);
		
		return actors_in_json;

	}


	my.blank_form = function(){

		g("actor_form_title").innerHTML = "New Actor";

		dom.setFormValue("actor_name","");
		dom.setFormValue("actor_full_name","");
		dom.setFormValue("actor_code","");
		dom.setFormValue("actor_role","Unknown", actor_form.fields[1].fields[0].vocabulary);
		dom.setFormValue("actor_ethnic_group","");
		dom.setFormValue("actor_family_social_role","Unknown", actor_form.fields[1].fields[2].vocabulary);
		dom.setFormValue("actor_age","");
		dom.setFormValue("actor_birth_date_year","YYYY");
		dom.setFormValue("actor_birth_date_month","MM");
		dom.setFormValue("actor_birth_date_day","DD");
		dom.setFormValue("actor_sex","Unknown");
		dom.setFormValue("actor_education","");

		dom.setFormValue("actor_contact_name","");
		dom.setFormValue("actor_contact_address","");
		dom.setFormValue("actor_contact_email","");
		dom.setFormValue("actor_contact_organisation","");
		
		dom.setFormValue("actor_description","");

		document.getElementsByName("actor_anonymized")[0].checked = false;

	}


	my.make_actor_object_out_of_form = function(){

		var object = {
			role: "",
			name: '',
			full_name: '',
			code: '',
			ethnic_group: '',
			family_social_role: '',
			age: 0,
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
		
		//if we're not creating a new actor but updating an existing one, we also pass the id of active actor to the db
		if (my.active_actor != -1) {
			object.id = my.actors[my.active_actor].id;
			console.log("Saving actor with id "+object.id);
		}
		
		else {
		
			object.id = my.id_counter;
			console.log("Saving actor with id "+object.id);
			my.id_counter++;
			
			localStorage.setItem("actor_id_counter",my.id_counter);
		
		}

		return object;
	 
	}
	
	
	my.createForm = function(){

		APP.makeInput(g("actor_content_div"), actor_form, "actor_", "actor_", undefined);

	}


	my.duplicate_active_actor = function(){

		//first, save changes to the actor
		var save = my.save_active_actor();
		
		//then create a duplicate
		if (save == true){
			my.save_active_actor(true);
			alertify.log("Actor saved and duplicated.","success",5000);
		}

	}


	my.save_active_actor = function(do_not_overwrite){
	//do_not_overwrite can be true or false. if true, active actor will not be overwritten, but duplicated

		if (get("actor_name") != ""){

			if (!do_not_overwrite){
				var do_not_overwrite = false;
			}
			
			var actor_to_put = my.make_actor_object_out_of_form();
			
			return my.save(actor_to_put, do_not_overwrite);
			
		}

		else {
		
			alertify.set({ labels: {
				ok     : "OK"
			} });

			alertify.alert("Please give your actor a name first.");
			return false;
			
		}

	}


	my.save = function(actor_to_put, do_not_overwrite){

		var actor_ids = [];
		
		//create array with all actor ids
		for (var a=0; a<my.actors.length;a++){
			actor_ids.push(my.actors[a].id);
		}

		//if this actor does already exist and is to be overwritten, overwrite the object in the array
		if ((actor_ids.indexOf(actor_to_put.id ) != -1) && (do_not_overwrite == false)) {
			my.actors.splice(my.getActorsIndexFromID(actor_to_put.id),1,actor_to_put);
			
			//if the actor does already exist, check if it is in a session and correct the actor name in the session, if required
			for (var s=0; s<session.sessions.length; s++){
		
				//search for actor_id in this session's actors
				if (session.sessions[s].actors.actors.indexOf(actor_to_put.id) != -1){
					
					session.refreshActorName(session.sessions[s].id, actor_to_put.id);
		
				}
				
			}
		
			
		}
		
		else {    //if actor shall not be overwritten, give the duplicate/new generated actor a new id
			
			actor_to_put.id = my.id_counter;
			console.log("Saving actor with id "+actor_to_put.id);
			my.id_counter++;
			
			localStorage.setItem("actor_id_counter",my.id_counter);
			
			my.actors.push(actor_to_put);
		}
	 
		console.log('Yeah, dude inserted! insertId is: ' + actor_to_put.id);

		save_and_recall.save();
		my.refreshListDisplay();
		
		return true;

	}


	my.highlight_active_actor_div = function(actor_id){

		for (var i=0;i<my.actors.length;i++){
			g("ac_list_entry_"+i).style.background = "#FF8BC7";
		}

		g("ac_list_entry_-1").style.background = "#FF8BC7";
		//make everything normal at first

		g("ac_list_entry_"+actor_id).style.background = "lightskyblue";

	}
	

	my.delete_active_actor = function(){

		var name_of_actor = my.actors[my.active_actor].name;

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
				
				my.actors.splice(my.active_actor,1);
				my.refreshListDisplay();
				save_and_recall.save();
				
				alertify.log("Actor "+name_of_actor+" deleted", "", "5000");

			}
		});
	}
	
	
	my.getAge = function (session_id, actor_id){

		var i = my.getActorsIndexFromID(actor_id);
		
		if (my.actors[i].age == ""){   //at first, check, if actor's age hasn't been specified yet
		
			if (document.getElementsByName("radio_age_calc")[0].checked == true){  //then, check if auto calculate feature in settings is activated
				
				var birthDate = my.actors[i].birth_date.year + "-" + my.actors[i].birth_date.month + "-" + my.actors[i].birth_date.day;
				var sessionDate = get(APP_CONF.session_dom_element_prefix+session_id+"_session_date_year") + "-" + get(APP_CONF.session_dom_element_prefix+session_id+"_session_date_month") + "-" + get(APP_CONF.session_dom_element_prefix+session_id+"_session_date_day"); 
				var age_calc_result = calcAgeAtDate(sessionDate,birthDate);
				
				if (age_calc_result != 0){
				
					console.log("Actor's age successfully calculated");			
					return age_calc_result;
			
				}
				
				else {  //if age calc = 0, age could not be calculated
				
					return "Unspecified";
				
				}
				
			}
			
			else {	//if feature is activated, but age has not been specified
			
				return "Unspecified";
			
			}
		}
		
		else { //if actor's age has been specified
		
			return my.actors[i].age;
		
		}

	}
	

	my.sortAlphabetically = function(){

		my.actors = sortByKey(my.actors,"name");

		save_and_recall.save();
		my.refreshListDisplay();
		
		alertify.log("Actors sorted.","",5000);

	}


	my.refreshListDisplay = function(not_in_sessions){
	
		g('ac_list').innerHTML = "";

		for (var i=0;i<my.actors.length;i++){

			var div = dom.newElement('div', "ac_list_entry_"+(i), "ac_list_entry", g('ac_list'), "<h2>" + my.actors[i].name + "</h2>" + "<p>"+my.actors[i].role+"</p>");
			//display name of actor
		
			div.addEventListener('click', function(num) { 
				return function(){ my.show(num); }; 
			}(i), false );
			
		}

		//create field for new actor
		var div = document.createElement('div');
		div.id = "ac_list_entry_-1";
		div.className = "ac_list_entry";

		div.addEventListener('click', function() { my.show(-1); } , false );


		div.innerHTML = "<h2>New Actor</h2>";

		g('ac_list').appendChild(div);	

		if ((session) && (!not_in_sessions)){
			session.refreshActorLists(my.actors);
		}

		switch (my.actors.length){
		
			case 0: {
				my.show(-1);
				break;
			}
			
			case 1: {
				my.show(0);
				break;
			}
			
			default: {
			
				if (my.active_actor >= my.actors.length){
					my.show(my.actors.length-1);
				}
				
				else {
					my.show(my.active_actor);
				}
			
				break;
			}
		}
	}


	return my;
	
})();