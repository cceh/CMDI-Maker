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

		forEach(my.persons.getActive().languages.actor_languages, my.languages.set);

	};
	
	
	var getLanguagesOfActivePersonFromForm = function(){
	
		var array = my.languages.languages_of_active_person.map(function(ALO){
			
			if (ALO.name_type == "LOCAL"){
			
				ALO.name = get("person_languages_" + ALO.id + "_name_input");
			
			}
			
			ALO.additional_information = get("person_languages_" + ALO.id + "addInfo");
			
			return ALO;
			
		});
		
		return array;
	
	};
	
	
	var makePersonObjectFromFormInput = function(){

		var object = APP.forms.createEmptyObjectFromTemplate(person_form);

		APP.forms.fillObjectWithFormData(object, my.element_id_prefix, person_form);
		
		object.languages.actor_languages = getLanguagesOfActivePersonFromForm();

		return object;
	 
	};
	
	
	var blankForm = function(){

		g(my.element_id_prefix + "form_title").innerHTML = l("new_person");

		APP.forms.fill(person_form, my.element_id_prefix);

		my.languages.clearActivePersonLanguages();
		
	};
	
	
	var handleClickOnPersonList = function(index){

		my.saveActivePerson("without_refreshing");
		
		my.show(my.persons.idOf(index));
	
	};
	
	
	var isEveryPersonNamed = function(){
	
		return !(my.persons.isThereAnyItemWhereKeyIsValue("name", ""));
	
	};
	
	
	//PUBLIC

	var my = {};
	my.parent = eldp_environment;
	var bundle;
	
	var l = function(arg1, arg2){
		return my.parent.l("persons", arg1, arg2);
	}
	
	var person_form = my.parent.person_form;
	
	my.persons = new ObjectList();
	
	my.element_id_prefix = "person_";
	
	my.identity = {
		id: "persons",
		title: "Persons",
		icon: "user"
	};
	
	my.module_view;
	
	my.init = function(view){
	
		my.persons.reset();
		
		my.module_view = view;
		
		bundle = my.parent.workflow[2];
		
		my.gui_list = new APP.GUI.FORMS.clickableListSmall(view, [], [], handleClickOnPersonList, my.element_id_prefix + "list", 0);
		
		var ac_view = dom.make("div", my.element_id_prefix + "view","",view);
	
		my.languages.init();
		
		my.refresh(true);
		
	};
	
	
	my.getSaveData = function(){
	
		var object = {};
		
		my.saveActivePerson();
		
		object.persons = my.persons.getState();
		
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

		no_persons_message.innerHTML += l("why_not_create_one__after_link");

		g("new_person_link").addEventListener('click', function() {my.createNewPerson(); });
		//we have to use g here instead of no_bundles_link, because latter isn't there anymore. it has been overwritten by ...innerHTML --> logically!
		
	
	};
	
	
	my.recall = function(data){
	
		if (data.persons){
			my.persons.setState(data.persons);
		}
		
		my.refresh();
		
		my.show(my.persons.getPointer());
	
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
				type: "function_wrap",
				wrapper_id: "sa_div",
				sub_div: "sa_subdiv",
				sub_div_innerHTML: 
					'<input type="radio" name="sa_by" value="nameKnownAs"> By Name (known as)<br>'+
					'<input type="radio" name="sa_by" value="fullName" checked> By Full Name<br>'+
					'<input type="radio" name="sa_by" value="nameSortBy"> By Name (Sort By)',
				onclick: function() {
				
					my.saveActivePerson();
			
					var key = dom.getSelectedRadioValue(dom.getByName("sa_by"));
					my.persons.sortByKey(key);
					my.refresh();
		
					APP.log(l("persons_alphabetically_sorted"));
					
				}
			},
			{
				id: "link_duplicateActivePerson",
				icon: "duplicate_user",
				label: l("duplicate_this_person"),
				onclick: function() {
					my.saveActivePerson();
					my.persons.duplicateActive();
					my.refresh();
				
					APP.log(l("person_saved_and_duplicated"),"success");
			
				}
			}
		];
	};
	

	my.erase_database = function(){

		APP.confirm(l("confirm_erasing_persons_db"), function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button
				
				my.persons.reset();

				APP.log(l("all_persons_deleted"));
				
				my.refresh();

			}
		}, l("no"), l("yes_delete_all_persons"));
	};


	my.show = function(person_id){
	
		if (my.persons.length == 0){
			console.info("person.show: No persons to show!");
			return;
		}		

		var person_index = my.persons.getIndexByID(person_id);
		
		if (typeof person_index == "undefined"){
			console.warn("person.show: Undefined person_id! Showing person 0");
			person_index = 0;
		}

		console.log("Showing person " + person_index);
		
		my.createFormIfNotExistent();
		
		my.gui_list.changeHighlight(person_index);
		my.languages.clearActivePersonLanguages();
		
		my.persons.setPointer(person_id);
		
		my.refreshFormTitle();
		
		var person_to_display = my.persons.getActive();
		
		APP.forms.fill(person_form, my.element_id_prefix, person_to_display);
		
		showLanguagesOfActivePerson();

	};
	
	
	my.refreshFormTitle = function(){
	
		var form_title = g(my.element_id_prefix + "form_title");
		
		var person_name = my.getDisplayName(my.persons.getActive());
		
		if (person_name == ""){
			form_title.innerHTML = l("unnamed_person");
		}
		
		else {
			form_title.innerHTML = person_name;
		}
	
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
		g(my.element_id_prefix + "nameKnownAs").addEventListener("blur", my.saveActivePerson);
		g(my.element_id_prefix + "fullName").addEventListener("blur", my.saveActivePerson);
		g(my.element_id_prefix + "nameSortBy").addEventListener("blur", my.saveActivePerson);

	};


	my.saveActivePerson = function(flag){
	
		if (my.persons.getPointer() == -1){
			return;
		}
	
		var person_to_put = makePersonObjectFromFormInput();
		
		person_to_put.display_name = my.getDisplayName(person_to_put);
		
		my.save(person_to_put);

		if (flag != "without_refreshing"){
			my.refresh();
			my.refreshFormTitle();
		}
		
		return person_to_put;

		//how do we require person name?
	};


	my.save = function(person_to_put){
	//this will always overwrite an existing person

		my.persons.replaceActive(person_to_put);

		//if the person does already exist, check if it is in a bundle and correct the person name in the bundle, if required
		bundle.updatePersonNameInAllBundles(person_to_put.id);

		return person_to_put;

	};
	
	
	my.createNewPerson = function(person_to_put){
	
		my.saveActivePerson();
		
		//after the current person is saved, check, if all persons have a name
		if (!isEveryPersonNamed()){
			APP.alert(l("please_give_all_persons_a_name_before_creating_new_one"));
			return;
		}
		
		
		//if no person object is given, get the form input
		if (!person_to_put){
			person_to_put = APP.forms.createEmptyObjectFromTemplate(person_form);
		}
		
		person_to_put.display_name = my.getDisplayName(person_to_put);
		
		var person_id = my.persons.add(person_to_put);
		
		my.createFormIfNotExistent();

		my.refresh();
		
		//show this created person
		my.show(person_id);
	};


	my.handleClickOnDeletePerson = function(){
	
		if (typeof my.persons.pointer == -1){
			console.warn("Active Person is undefined. Don't know what to delete!");
			return;
		}
	
		var name_of_person = my.persons.getActive().name;
		var confirm_message;
		
		if (name_of_person == ""){
		
			confirm_message = l("really_erase_this_person");
		
		}
		
		else {
		
			confirm_message = l("really_erase_before_name") + name_of_person + l("really_erase_after_name");
		
		}

		APP.confirm(confirm_message, function (e) {

			if (e) {
				// user clicked "ok"
			}
		
			else {
				// user clicked "cancel"
				
				my.deleteActivePerson();
				
				APP.log(l("person_deleted_before_name") + name_of_person + l("person_deleted_after_name"));

			}
		}, l("no"), l("yes_delete_person"));
	
	};
	

	my.deleteActivePerson = function(){

		my.persons.removeActive();
		my.refresh();

	};
	
	
	my.getAge = function (bundle_id, person_id){

		var pers = my.persons.getByID(person_id);
		
		if (pers.age === ""){   //at first, check, if person's age hasn't been specified yet
		
			if (g("radio_age_calc").on){  //then, check if auto calculate feature in settings is activated
				
				var birthDate = pers.birth_date.year + "-" + pers.birth_date.month + "-" + my.persons[i].birth_date.day;
				var bundleDate = get(bundle.dom_element_prefix+bundle_id+"_bundle_date_year") + "-" +
				get(bundle.dom_element_prefix+bundle_id+"_bundle_date_month") + "-" + get(bundle.dom_element_prefix+bundle_id+"_bundle_date_day"); 
				var age_calc_result = calcAgeAtDate(bundleDate,birthDate);
				
				if (age_calc_result !== 0){
				
					console.info("person's age successfully calculated");			
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
		
			return pers.age;
		
		}

	};
	

	my.refresh = function(not_in_bundles){
		
		my.module_view.innerHTML = "";
		
		var display_names = my.persons.map(function(pers){
			return my.getDisplayName(pers.id);
		});
		
		my.gui_list.refresh(display_names);
		
		if (my.persons.length == 0){
			my.showNoPersonsMessage();
			
			APP.environments.disableFunction("link_delete_active_person");
			APP.environments.disableFunction("sa_div");
			APP.environments.disableFunction("link_duplicateActivePerson");
			
		}
		
		else {
		
			my.createFormIfNotExistent();
			my.show(my.persons.getActiveIndex());
		
			my.gui_list.changeHighlight(my.persons.getActiveIndex());
			
			APP.environments.enableFunction("link_delete_active_person");
			APP.environments.enableFunction("sa_div");
			APP.environments.enableFunction("link_duplicateActivePerson");
		}

		if ((bundle) && (!not_in_bundles)){
			bundle.refreshPersonLists(my.persons.getAll());
		}
		
	};
	
	
	my.getDisplayName = function(person_or_person_id){
	
		var person;
	
		if (typeof person_or_person_id == "object"){
			person = person_or_person_id;
		}
		
		else if (my.persons.existsByID(person_or_person_id)){		
			person = my.persons.getByID(person_or_person_id);
		}
		
		if (!person){
			return console.warn("Person undefined!");
		}
		
		if (person.fullName && person.fullName != ""){
			return person.fullName;
		}
		
		if (person.nameSortBy && person.nameSortBy != ""){
			return person.nameSortBy;
		}
		
		if (person.nameKnownAs && person.nameKnownAs != ""){
			return person.nameKnownAs;
		}

		return l("unnamed_person");
	
	};
	
	
	my.doesEveryPersonHaveValidBirthYear = function(){
	
		for (var i = 0; i < my.persons.length; i++){
		
			var year = my.persons.get(i).birth_year;
		
			if (year.length > 4 || year == "YYYY" || year == ""){
			
				return false;
			
			}
			
		}
		
		return true;	
	
	};
	
	
	my.doesEveryPersonHaveALanguage = function(){
	
		for (var i = 0; i < my.persons.length; i++){
		
			if (my.persons.get(i).languages.actor_languages.length == 0){
			
				return false;
			
			}
			
		}
		
		return true;	
	
	};


	return my;
	
})();