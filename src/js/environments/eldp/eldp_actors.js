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
	
	var showLanguagesOfActivePerson = function(){

		forEach(my.persons[my.active_person_index].languages, my.languages.set);

	};
	
	
	var highlightActivePersonInList = function(person_index){

		if (typeof person_index == "undefined"){
			console.log("I shall highlight a person with index = undefined! Returning!");
			return;
		}
	
		for (var i=0;i<my.persons.length;i++){
			g(my.element_id_prefix + "list_entry_"+i).style.background = "lightskyblue";
		}

		g(my.element_id_prefix + "list_entry_"+person_index).style.background = "#FF8BC7";

	};
	
	
	var getLanguagesOfActivePersonFromForm = function(){
	
		var array = map(my.languages.languages_of_active_person, function(ALO){
		
			ALO.MotherTongue = g("mothertongue_" + ALO.id).checked;
			ALO.PrimaryLanguage = g("primarylanguage_" + ALO.id).checked;
			
			return ALO;
			
		});
		
		return array;
	
	};
	
	
	var makePersonObjectFromFormInput = function(){

		var object = APP.forms.createEmptyObjectFromTemplate(person_form);

		APP.forms.fillObjectWithFormData(object, my.element_id_prefix, person_form);
		
		object.languages = getLanguagesOfActivePersonFromForm();  //PRELIMINARY OVERWRITE!

		object.id = my.persons[my.active_person_index].id;
		console.log("Saving person with id " + object.id);

		return object;
	 
	};
	
	
	var blankForm = function(){

		g(my.element_id_prefix + "form_title").innerHTML = l("new_person");

		APP.forms.fill(person_form, my.element_id_prefix);

		my.languages.clearActivePersonLanguages();
		
	};
	
	
	var handleClickOnPersonList = function(index){
	
		my.saveActivePerson();
		
		my.show(my.persons[index].id);
	
	};
	
	
	var isEveryPersonNamed = function(){
	
		for (var i=0; i<my.persons.length; i++){
			if (my.persons[i].name == ""){
				return false;
			}
		}
		
		return true;
	
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
	my.active_person_index;
	
	my.module_view;
	
	my.init = function(view){
	
		my.persons = [];
		my.id_counter = 0;
		my.active_person = undefined;  //Necessary!
		
		my.module_view = view;
		
		bundle = my.parent.workflow[2];
		
		my.createListDIV(view);
		var ac_view = dom.make("div", my.element_id_prefix + "view","",view);
	
		my.languages.init();
		
		my.refreshListDisplay(true);
		
	};
	
	
	my.createListDIV = function(view){
	
		dom.make("div",my.element_id_prefix + "list","",view);
		
	}
	
	
	my.getSaveData = function(){
	
		var object = {};
		
		my.saveActivePerson();
		
		object.persons = my.persons;
		object.id_counter = my.id_counter;
		object.active_person = my.active_person;
		
		return object;
	
	};
	
	
	my.showNoPersonsMessage = function(){
	
		var view = my.module_view;
	
		view.innerHTML = "";
		
		var no_persons_message = dom.make("h2","no_persons_text","no_persons_text", view);
		no_persons_message.innerHTML = l("there_are_no_persons_yet") + " " + 
		l("why_not_create_one__before_link");

		var new_person_link = dom.make("a","new_person_link","new_person_link", no_persons_message);

		new_person_link.innerHTML = l("why_not_create_one__link");
		new_person_link.href = "#";

		no_persons_message.innerHTML += l("why_not_create_one__after_link");

		g("new_person_link").addEventListener('click', function() {my.createNewPerson(); });
		//we have to use g here instead of no_bundles_link, because latter isn't there anymore. it has been overwritten by ...innerHTML --> logically!
		
	
	};
	
	
	my.recall = function(data){
	
		if (data.persons){
			my.persons = data.persons;
		}
		
		if (data.id_counter){
			my.id_counter = data.id_counter;
		}
		
		if (data.active_person_index){
			my.active_person_index = data.active_person_index;
		}
		
		//if active_person_index cannot be recalled but there are persons, set it to 0
		else if (my.persons.length > 0){
			my.active_person_index = 0;
		}
		
		my.refreshListDisplay();
		
		if (typeof my.active_person_index != "undefined"){
			my.show(my.persons[my.active_person_index].id);
		}
	
	};
	
	
	my.functions = function(){
		return [
			{
				id: "link_new_person",
				icon: "plus",
				label: l("new_person"),
				onclick: function() { my.createNewPerson(); }
			},
			{
				id: "link_delete_active_person",
				icon: "reset",
				label: l("delete_this_person"),
				onclick: function() { my.handleClickOnDeletePerson(); }
			},
			{
				id: "link_sort_persons_alphabetically",
				icon: "az",
				label: l("sort_persons_alphabetically"),
				onclick: function() { my.sortAlphabetically(); }
			},
			{
				id: "link_duplicateActivePerson",
				icon: "duplicate_user",
				label: l("duplicate_this_person"),
				onclick: function() { my.duplicateActivePerson(); }
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

		var person_index = my.getIndexByID(person_id);
		
		if (typeof person_index == "undefined"){
			console.error("person.show: Undefined person_id!");
			person_index = 0;
		}
		
		if (my.persons.length == 0){
			console.info("person.show: No persons to show!");
			return;
		}
		
		console.log("Showing person " + person_index);
		
		my.createFormIfNotExistent();
		
		highlightActivePersonInList(person_index);
		my.languages.clearActivePersonLanguages();
		
		my.active_person_index = person_index;
		
		my.refreshFormTitle();
		
		var person_to_display = my.persons[person_index];
		
		APP.forms.fill(person_form, my.element_id_prefix, person_to_display);
		
		showLanguagesOfActivePerson();

	};
	
	
	my.refreshFormTitle = function(){
	
		var form_title = g(my.element_id_prefix + "form_title");
		
		var person_name = my.persons[my.active_person_index].name;
		
		if (person_name == ""){
			form_title.innerHTML = l("unnamed_person");
		}
		
		else {
			form_title.innerHTML = person_name;
		}
	
	};
	
	
	my.getIndexByID = function(person_id) {

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
		
		readFileAsText(file, function(result){
			var imported_persons;
		
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
		
		});

	};


	my.createFormIfNotExistent = function(){
	
		var ac_view = g("person_view");
		
		if (ac_view){
			return;
		};
	
		ac_view = dom.make("div", "person_view", "person_view", my.module_view);
		
		ac_view.innerHTML = "";
		
		var title_div = dom.make("div", my.element_id_prefix + "title_div","",ac_view);
		dom.make("h1", my.element_id_prefix + "form_title", "", title_div, l("new_person"));
		dom.make("div", my.element_id_prefix + "content_div","", ac_view);

		APP.forms.make(g(my.element_id_prefix + "content_div"), person_form, my.element_id_prefix, my.element_id_prefix, undefined, my.languages.makeInputInForm);
		
		//To refresh name and role in person list as soon as they are changed by the user
		//g(my.element_id_prefix + "name").addEventListener("blur", my.saveActivePerson);
		//g(my.element_id_prefix + "role").addEventListener("blur", my.saveActivePerson);

	};


	my.duplicate_active_person = function(){

		//first, save changes to the current person
		var person_object = my.saveActivePerson();
		
		//then create a new person with this object
		my.createNewPerson(person_object);
		
		APP.log(l("person_saved_and_duplicated"),"success");

	};


	my.saveActivePerson = function(){
	
		if (typeof my.active_person_index == "undefined"){
			console.info("Shall save active person but active person is undefined! No problem!");
			return;
		}
	
		var person_to_put = makePersonObjectFromFormInput();

		my.save(person_to_put);

		my.refreshListDisplay();
		
		my.refreshFormTitle();
		
		return person_to_put;

		//how do we require person name?
	};


	my.save = function(person_to_put){
	//this will always overwrite an existing person

		//create array with all person ids
		var person_ids = getArrayWithIDs(my.persons);

		my.persons.splice(my.getIndexByID(person_to_put.id),1,person_to_put);

		//if the person does already exist, check if it is in a bundle and correct the person name in the bundle, if required
		bundle.updatePersonNameInAllBundles(person_to_put.id);

		return person_to_put;

	};
	
	
	my.createNewPerson = function(person_to_put){
	
		if (typeof my.active_person_index != "undefined"){
			my.saveActivePerson();
		}	
		
		//after the current person is saved, check, if all persons have a name
		if (!isEveryPersonNamed()){
			APP.alert(l("please_give_all_persons_a_name_before_creating_new_one"));
			return;
		}
		
		
		//if no person object is given, get the form input
		if (!person_to_put){
			person_to_put = APP.forms.createEmptyObjectFromTemplate(person_form);
		}
		
		person_to_put.id = my.id_counter;
		console.log("Saving person with id " + person_to_put.id);
		my.id_counter++;
		
		my.persons.push(person_to_put);
	 
		console.log('Yeah, dude inserted! insertId is: ' + person_to_put.id);

		my.refreshListDisplay();
		
		//show this created person
		my.show(person_to_put.id);
	};


	my.handleClickOnDeletePerson = function(){
	
		if (typeof my.active_person_index == "undefined"){
			console.warn("Active Person is undefined. Don't know what to delete!");
			return;
		}
	
		var name_of_person = my.persons[my.active_person_index].name;
		var confirm_message;
		
		if (name_of_person == ""){
		
			confirm_message = l("really_erase_this_person");
		
		}
		
		else {
		
			confirm_message = l("really_erase_before_name") + name_of_person + l("really_erase_after_name");
		
		}

		alertify.set({ labels: {
			ok     : l("no"),
			cancel : l("yes_delete_person")
		} });

		alertify.confirm(confirm_message, function (e) {

			if (e) {
				// user clicked "ok"
			}
		
			else {
				// user clicked "cancel"
				
				my.deleteActivePerson();
				
				APP.log(l("person_deleted_before_name") + name_of_person + l("person_deleted_after_name"));

			}
		});
	
	};
	

	my.deleteActivePerson = function(){

		my.persons.splice(my.active_person_index,1);
		
		if (my.persons.length == 0){
			my.active_person_index = undefined;
		}		
		
		if (my.active_person_index > 0){
			my.show(my.persons[my.active_person_index - 1].id);
		}
		
		else if (my.persons.length > 0){
			my.show(my.persons[0].id)
		}
		
		my.refreshListDisplay();
	};
	
	
	my.getAge = function (bundle_id, person_id){

		var i = my.getIndexByID(person_id);
		
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
		
		if (!g(my.element_id_prefix + 'list')){
			my.module_view.innerHTML = "";
			my.createListDIV(my.module_view);
		}
		
		
		g(my.element_id_prefix + 'list').innerHTML = "";

		forEach(my.persons, renderPersonListEntry);
		
		if (my.persons.length == 0){
			my.showNoPersonsMessage();
			
			APP.environments.disableFunction("link_delete_active_person");
			APP.environments.disableFunction("link_sort_persons_alphabetically");
			APP.environments.disableFunction("link_duplicateActivePerson");
			
		}
		
		else {
			highlightActivePersonInList(my.active_person_index);
			
			APP.environments.enableFunction("link_delete_active_person");
			APP.environments.enableFunction("link_sort_persons_alphabetically");
			APP.environments.enableFunction("link_duplicateActivePerson");
		}

		if ((bundle) && (!not_in_bundles)){
			bundle.refreshPersonLists(my.persons);
		}
		
	};
	
	
	var renderPersonListEntry = function(person, i){
	
		var div = dom.make('div', my.element_id_prefix + "list_entry_" + i, my.element_id_prefix + "list_entry", g(my.element_id_prefix + 'list'));
		
		var name_display = (person.name != "") ? person.name : l("unnamed_person");
		
		dom.h2(div, name_display);
		dom.p(div, person.role);
		
		div.addEventListener('click', function(num) { 
			return function(){ handleClickOnPersonList(num); }; 
		}(i), false );
	
	};


	return my;
	
})();