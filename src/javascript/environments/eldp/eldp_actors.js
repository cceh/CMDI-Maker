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
	'use strict';
	
	
	//PRIVATE
	
	var showLanguagesOfActiveperson = function(){

		forEach(my.persons[my.active_person].languages, my.languages.set);

	};
	
	
	var highlightActivepersonInList = function(person_id){

		for (var i=0;i<my.persons.length;i++){
			g(my.element_id_prefix + "list_entry_"+i).style.background = "#FF8BC7";
		}

		g(my.element_id_prefix + "list_entry_-1").style.background = "#FF8BC7";
		//make everything normal at first

		g(my.element_id_prefix + "list_entry_"+person_id).style.background = "lightskyblue";

	};
	
	
	var getLanguagesOfActivepersonFromForm = function(){
	
		var array = []; 
		
		forEach(my.languages.languages_of_active_person, function(AL){
		
			var personLanguageObject = {
				
				LanguageObject: AL.LanguageObject,
				MotherTongue: g("mothertongue_" + AL.id).checked,
				PrimaryLanguage: g("primarylanguage_" + AL.id).checked
				
			};
			
			array.push(personLanguageObject);
			
		});
		
		return array;
	
	};
	
	
	var makepersonObjectFromFormInput = function(){

		var object = APP.forms.createEmptyObjectFromTemplate(person_form);

		APP.forms.fillObjectWithFormData(object, my.element_id_prefix, person_form);
		
		object.languages = getLanguagesOfActivepersonFromForm();  //PRELIMINARY OVERWRITE!

		//if we're not creating a new person but updating an existing one, we also pass the id of active person to the db
		if (my.active_person != -1) {
			object.id = my.persons[my.active_person].id;
			console.log("Saving person with id "+object.id);
		}
		
		else {
		
			object.id = my.id_counter;
			console.log("Saving person with id "+object.id);
			my.id_counter++;
			
		}

		return object;
	 
	};
	
	
	var blankForm = function(){

		g(my.element_id_prefix + "form_title").innerHTML = l("new_person");

		APP.forms.fill(person_form, my.element_id_prefix);

		my.languages.clearActivePersonLanguages();
		
	};
	
	
	var parseIMDIForpersons = function(xml){

		var persons_in_xml = xml.getElementsByTagName("person");
		
		var persons_in_json = map(persons_in_xml, function(xml_person){
		
			console.log("person in IMDI found. Name: " + xml_person.querySelector("Name").textContent.trim());
			
			var person_object = {
				name: xml_person.querySelector("Name").textContent.trim(),
				role: xml_person.querySelector("Role").textContent.trim(),
				full_name: xml_person.querySelector("FullName").textContent.trim(),
				code: xml_person.querySelector("Code").textContent.trim(),		
				age: xml_person.querySelector("Age").textContent.trim(),
				sex: xml_person.querySelector("Sex").textContent.trim(),		
				education: xml_person.querySelector("Education").textContent.trim(),
				birth_date: parse_birth_date(xml_person.querySelector("BirthDate").textContent.trim()),
				ethnic_group: xml_person.querySelector("EthnicGroup").textContent.trim(),
				family_social_role: xml_person.querySelector("FamilySocialRole").textContent.trim(),
				
				description: xml_person.querySelector("Description").textContent.trim(),
				
				contact: {
				
					name: xml_person.querySelector("Contact").querySelector("Name").textContent.trim(),
					address: xml_person.querySelector("Contact").querySelector("Address").textContent.trim(),
					email: xml_person.querySelector("Contact").querySelector("Email").textContent.trim(),
					organisation: xml_person.querySelector("Contact").querySelector("Organisation").textContent.trim(),
				
				
				},
				
				anonymized: (xml_person.querySelector("Anonymized").textContent.trim() == "true") ? true : false,
				
				languages: []
			
			};
			
			var person_languages = xml_person.querySelector("Languages");
			
			forEach(person_languages.children, function(xml_AL){
			
				if (xml_AL.nodeName != "Language"){
					return;
				}
			
				var person_Language = {
				
					LanguageObject: [
						xml_AL.querySelector("Id").textContent.trim().slice(9),
						"?",
						"?",
						xml_AL.querySelector("Name").textContent.trim()
					],
					
					MotherTongue: (xml_AL.querySelector("MotherTongue").textContent.trim() == "true") ? true : false,
					PrimaryLanguage: (xml_AL.querySelector("PrimaryLanguage").textContent.trim() == "true") ? true : false
				
				
				};
				
				
				person_object.languages.push(person_Language);
			
			});
			
			return person_object;

		});
		
		console.log(persons_in_xml);
		
		return persons_in_json;

	};

	
	//PUBLIC

	var my = {};
	my.parent = eldp_environment;
	var bundle;
	
	var l = function(arg1, arg2){
		return my.parent.l("persons", arg1, arg2);
	}
	
	var person_form = my.parent.person_form;
	
	my.persons = [];
	
	my.element_id_prefix = "person_";
	
	my.identity = {
		id: "persons",
		title: "Persons",
		icon: "user"
	};
	
	my.id_counter = 0;
	my.active_person = -1;
	
	my.init = function(view){
	
		my.persons = [];
		my.id_counter = 0;
		my.active_person = -1;
		
		bundle = my.parent.workflow[2];
		
		dom.make("div",my.element_id_prefix + "list","",view);
		var ac_view = dom.make("div",my.element_id_prefix + "view","",view);
		var title_div = dom.make("div", my.element_id_prefix + "title_div","",ac_view);
		dom.make("h1", my.element_id_prefix + "form_title", "", title_div, l("new_person"));
		dom.make("div", my.element_id_prefix + "content_div","",ac_view);
		dom.make("div", my.languages.element_id_prefix + "results_div","",view);
		
		my.createForm();
		
		my.languages.init();
		
		my.refreshListDisplay(true);
		
	};
	
	
	my.getSaveData = function(){
	
		var object = {};
		
		object.persons = my.persons;
		object.id_counter = my.id_counter;
		object.active_person = my.active_person;
		
		return object;
	
	};
	
	
	my.recall = function(data){
	
		my.persons = data.persons;
		my.id_counter = data.id_counter;
		my.active_person = data.active_person;
		
		my.refreshListDisplay();
	
	};
	
	
	my.functions = function(){
		return [
			{
				id: "link_save_active_person",
				icon: "save",
				label_span_id: "save_person_span",
				onclick: function() { my.save_active_person(); }
			},
			{
				id: "link_delete_active_person",
				icon: "reset",
				label: l("delete_this_person"),
				onclick: function() { my.delete_active_person(); }
			},
			{
				id: "link_sort_persons_alphabetically",
				icon: "az",
				label: l("sort_persons_alphabetically"),
				onclick: function() { my.sortAlphabetically(); }
			},
			{
				id: "link_duplicate_active_person",
				icon: "duplicate_user",
				label: l("save_and_duplicate_this_person"),
				onclick: function() { my.duplicate_active_person(); }
			}
		];
	};
	

	my.erase_database = function(){

		alertify.set({ labels: {
			ok     : l("no"),
			cancel : l("yes_delete_all_persons")
		} });

		alertify.confirm(l("confirm_erasing_persons_db"), function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button
				
				my.id_counter = 0;
				my.persons = [];

				APP.log(l("all_persons_deleted"));
				
				my.refreshListDisplay();

			}
		});
	};


	my.show = function(person_id){
	// -1 = empty form to create a new person

		console.log("Showing person " + person_id);
		
		highlightActivepersonInList(person_id);
		my.languages.clearActivePersonLanguages();

		my.active_person = person_id;

		if (person_id != -1){
			//show data of selected person in form

			g(my.element_id_prefix + "form_title").innerHTML = my.persons[person_id].title;
			
			var person_to_display = my.persons[person_id];
			
			APP.forms.fill(person_form, my.element_id_prefix, person_to_display);
			
			showLanguagesOfActiveperson();
			
			g('link_delete_active_person').style.display = "inline";
			g('link_duplicate_active_person').style.display = "inline";
			g("save_person_span").innerHTML = l("save_changes_to_this_person");

		}

		else {

			blankForm();
			
			dom.hide(g('link_delete_active_person'));
			dom.hide(g('link_duplicate_active_person'));
			g("save_person_span").innerHTML = l("save_person");

		}


	};
	
	
	my.getPersonIndexByID = function(person_id) {

		for (var i = 0, len = my.persons.length; i < len; i++) {
			if (my.persons[i].id == person_id){
				return i;
			}
		}
		
		return alert("An error has occured.\nCould not find persons cache index from person id!\n\nperson_id = " + person_id);
		
	};
	
	
	my.getPersonByID = function(person_id){
	
		return getObject(my.persons, "id", person_id);
		
	}
	
	
	my.export_persons = function(){
		
		if (my.persons.length !== 0){
		
			var persons_json = JSON.stringify(my.persons);
			
			APP.save_file(persons_json, "persons.json", APP.CONF.file_download_header);
			
		}
		
		else {
		
			APP.alert(l("there_are_no_persons"));
		
		}


	};
	
	
	my.handleImportFileInputChange = function (evt){
	
		var files = evt.target.files; // FileList object

		console.log(files);
		
		var file = files[0];
		
		console.log(file);
		
		var reader = new FileReader();
		
		reader.onload = function(e){
			var imported_persons;
		
			var result = e.target.result;
		
			try {
				imported_persons = JSON.parse(result);
			}
			
			catch (e) {
			//if json parsing is not possible, try xml parsing

				if (window.DOMParser) {
					var parser = new DOMParser();
					
					var xml = parser.parseFromString(result,"text/xml");
					
					imported_persons = parseIMDIForpersons(xml);
					
				}
				
				
			}
			
			if (!imported_persons){
				return;
			}
			
			for (var a=0; a<imported_persons.length; a++){
				my.save(imported_persons[a], true);
			}
			
			my.refreshListDisplay();
			
			alertify.log(imported_persons.length + " " + l("persons_imported"));
		
		};
		
		reader.readAsText(file);
		
	};


	my.createForm = function(){

		APP.forms.make(g(my.element_id_prefix + "content_div"), person_form, my.element_id_prefix, my.element_id_prefix, undefined, my.languages.makeInputInForm);

	};


	my.duplicate_active_person = function(){

		//first, save changes to the person
		var save = my.save_active_person();
		
		//then create a duplicate
		if (save === true){
			my.save_active_person(true);
			APP.log(l("person_saved_and_duplicated"),"success");
		}

	};


	my.save_active_person = function(do_not_overwrite){
	//do_not_overwrite can be true or false. if true, active person will not be overwritten, but duplicated

		if (get(my.element_id_prefix + "title") !== ""){

			if (!do_not_overwrite){
				do_not_overwrite = false;
			}
			
			var person_to_put = makepersonObjectFromFormInput();
			
			return my.save(person_to_put, do_not_overwrite);
			
		}

		else {
		
			APP.alert(l("give_your_person_a_name_first"));
			return false;
			
		}

	};


	my.save = function(person_to_put, do_not_overwrite){

		var person_ids = [];
		
		//create array with all person ids
		for (var a=0; a<my.persons.length;a++){
			person_ids.push(my.persons[a].id);
		}

		//if this person does already exist and is to be overwritten, overwrite the object in the array
		if ((person_ids.indexOf(person_to_put.id ) != -1) && (do_not_overwrite === false)) {
			
			my.persons.splice(my.getPersonIndexByID(person_to_put.id),1,person_to_put);
			
			//if the person does already exist, check if it is in a bundle and correct the person name in the bundle, if required
			bundle.updatePersonNameInAllBundles(person_to_put.id);
			
		}
		
		else {    //if person shall not be overwritten, give the duplicate/new generated person a new id
			
			person_to_put.id = my.id_counter;
			console.log("Saving person with id " + person_to_put.id);
			my.id_counter++;
			
			my.persons.push(person_to_put);
		}
	 
		console.log('Yeah, dude inserted! insertId is: ' + person_to_put.id);

		my.refreshListDisplay();
		
		return true;

	};


	my.delete_active_person = function(){

		var name_of_person = my.persons[my.active_person].title;

		alertify.set({ labels: {
			ok     : l("no"),
			cancel : l("yes_delete_person")
		} });

		alertify.confirm(l("really_erase_before_name") + name_of_person + l("really_erase_after_name"), function (e) {

			if (e) {
				// user clicked "ok"
			}
		
			else {
				// user clicked "cancel"
				
				my.persons.splice(my.active_person,1);
				my.refreshListDisplay();
				
				APP.log(l("person_deleted_before_name") + name_of_person + l("person_deleted_after_name"));

			}
		});
	};
	
	
	my.getAge = function (bundle_id, person_id){

		var i = my.getPersonIndexByID(person_id);
		
		if (my.persons[i].age === ""){   //at first, check, if person's age hasn't been specified yet
		
			if (g("radio_age_calc").on){  //then, check if auto calculate feature in settings is activated
				
				var birthDate = my.persons[i].birth_date.year + "-" + my.persons[i].birth_date.month + "-" + my.persons[i].birth_date.day;
				var bundleDate = get(bundle.dom_element_prefix+bundle_id+"_bundle_date_year") + "-" +
				get(bundle.dom_element_prefix+bundle_id+"_bundle_date_month") + "-" + get(bundle.dom_element_prefix+bundle_id+"_bundle_date_day"); 
				var age_calc_result = calcAgeAtDate(bundleDate,birthDate);
				
				if (age_calc_result !== 0){
				
					console.log("person's age successfully calculated");			
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
		
		else { //if person's age has been specified
		
			return my.persons[i].age;
		
		}

	};
	

	my.sortAlphabetically = function(){

		my.persons = sortByKey(my.persons,"title");

		my.refreshListDisplay();
		
		APP.log(l("persons_alphabetically_sorted"));

	};


	my.refreshListDisplay = function(not_in_bundles){
		var div;
	
		g(my.element_id_prefix + 'list').innerHTML = "";

		for (var i=0;i<my.persons.length;i++){

			div = dom.make('div', my.element_id_prefix + "list_entry_"+(i), my.element_id_prefix + "list_entry", g(my.element_id_prefix + 'list'));
			dom.h2(div, my.persons[i].title);
			dom.p(div, my.persons[i].role);
		
			div.addEventListener('click', function(num) { 
				return function(){ my.show(num); }; 
			}(i), false );
			
		}

		//create field for new person
		div = dom.make('div', my.element_id_prefix + "list_entry_-1", my.element_id_prefix + "list_entry", g(my.element_id_prefix + 'list'), "<h2>" + l("new_person") + "</h2>");
		div.addEventListener('click', function() { my.show(-1); } , false );

		if ((bundle) && (!not_in_bundles)){
			bundle.refreshPersonLists(my.persons);
		}

		switch (my.persons.length){
		
			case 0: {
				my.show(-1);
				break;
			}
			
			case 1: {
				my.show(0);
				break;
			}
			
			default: {
			
				if (my.active_person >= my.persons.length){
					my.show(my.persons.length-1);
				}
				
				else {
					my.show(my.active_person);
				}
			
				break;
			}
		}
	};


	return my;
	
})();