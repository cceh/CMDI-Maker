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


var APP = (function () {
	'use strict';

	var my = {};
	
	
	my.init = function (no_recall) {
		var recall_object;
		
		my.active_language = my.languages[0];
		
		if (!no_recall){
			recall_object = my.save_and_recall.getRecallDataForApp();
			
			if (recall_object && recall_object.settings.active_language_id){
				my.active_language = my.getLPFromID(recall_object.settings.active_language_id);
			}
		}
		
		my.checkIfFirstStart();
		g("version_span").innerHTML = APP.CONF.version;
		my.sayHello();
		g("settings_heading").innerHTML = my.l("settings","settings");
		my.initSettings(my.settings(), g("core_settings"));
		my.displayMetadataLanguages();
		my.displayLanguages();
		my.addEventListeners();
		
		my.environments.displayAllInSelect();
		
		if ((!no_recall) && (typeof recall_object != "undefined")){
			my.recall(recall_object);
		}
		
		my.drawMainMenu(my.main_menu_elements());
		
		window.addEventListener("beforeunload", my.save, false);
		
	};

	
	my.languages = [];
	
	my.getLPFromID = function(id){
	
		var LP = getObject(my.languages, "id", id);
		
		if (typeof LP == "undefined"){
			console.error("ERROR: No language object with id " + id + " found!");
		}
		
		return LP;
	
	};
	
	
	my.getIndexFromLPID = function(id){
	
		var index = getIndex(my.languages, "id", id);
		
		if (typeof index == "undefined"){
			console.error("ERROR: No language object with id " + id + " found!");
		}
		
		return index;
	
	};
	
	
	my.active_view = undefined;
	my.active_language = undefined;

	
	my.views = [
		{
			id: "start",
			place: "top"
		},
		{
			id: "settings",
			icon: "gear2.png",
		},
		{
			id: "about",
			icon: "about.png",
		}
	];
	
	
	my.l = function(arg1, arg2, arg3){
		
		return my.getTermInActiveLanguage(my.languages, arg1, arg2, arg3);
		
	};
	
	
	my.getActiveLanguagePackFromID = function(id, LPArray){
	
		return getObject(LPArray, "id", id);
	
	};
	
	
	var getTermInLP = function(LP, arg1, arg2, arg3, arg4){

		if (typeof LP[arg1] == "undefined"){
			return undefined;
		}
	
		if (arg4){

			if (typeof LP[arg1][arg2][arg3][arg4] != "undefined"){
				return LP[arg1][arg2][arg3][arg4];
			}
			
			else {
				return undefined;
			}
			
		}
	
		if (arg3){

			if (typeof LP[arg1] != "undefined" && typeof LP[arg1][arg2][arg3] != "undefined"){
				return LP[arg1][arg2][arg3];
			}
			
			else {
				return undefined;
			}
			
		}
		
		if (arg2){

			if (typeof LP[arg1] != "undefined" && typeof LP[arg1][arg2] != "undefined"){
				return LP[arg1][arg2];
			}
			
			else {
				return undefined;
			}
			
		}
		
		return LP[arg1];
	
	};
	
	
	my.getTermInActiveLanguage = function(LanguagePacksArray, arg1, arg2, arg3, arg4){
	
		//Look in the LanguagesArray, that's been given by the APP or by one environment and then search for the language that has the id of the APP's active language
		var LP = my.getActiveLanguagePackFromID(my.active_language.id, LanguagePacksArray);
	
		var termInLP = getTermInLP(LP, arg1, arg2, arg3, arg4);
		
		if (typeof termInLP != "undefined"){
			return termInLP;
		}
		
		//try to get term in default language
		console.info("Haven't found a term in " + LP.name + ": " + arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4 + ". " +
		"Trying to get it in default language.");
		
		var defaultLP = LanguagePacksArray[0];
		var termInDefaultLP = getTermInLP(defaultLP,arg1,arg2,arg3,arg4);
		
		if (typeof termInDefaultLP != "undefined"){
			return termInDefaultLP;
		}
		
		//if there's no word at all, PROBLEM!!!
		console.error("LANGUAGE ERROR: " + arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4);
		return "###";

	};
	
	
	my.main_menu_elements = function(){
		return [
			{
				title: my.l("save"),
				id: "LINK_save_form",
				icon:	"save",
				onclick: function(){ my.save_and_recall.userSave(); }
			},
			{
				title: my.l("settings", "settings"),
				id: "VIEWLINK_settings",
				icon:	"wrench",
				onclick: function(){ APP.view("VIEW_settings"); }
			},
			{
				title: my.l("about"),
				id: "VIEWLINK_about",
				icon:	"about",
				onclick: function(){ APP.view("VIEW_about"); }
			}
		];
	
	};
	
	
	my.drawMainMenuElement = function(element, parent){
		
		var div = dom.div(parent, element.id, "main_menu_entry");
		dom.icon(div, "", "main_menu_entry_img", element.icon);
		dom.span(div, "", "main_menu_entry_span", element.title);
		
		div.addEventListener("click", element.onclick, false);
		div.addEventListener("click", my.closeMainMenu, false);
		
	};
	
	
	my.drawMainMenu = function(menu_elements){
	
		var menu = dom.div(document.body, APP.CONF.main_menu_div_id, "");
		
		forEach(menu_elements, function(element){ my.drawMainMenuElement(element, menu); });
		
		my.closeMainMenu();
		
		g("main_menu_icon").addEventListener("click", my.changeMainMenuDisplay);
		g("content_wrapper").addEventListener("click", my.closeMainMenu);
	};
	
	
	my.changeMainMenuDisplay = function(){
	
		if (g(APP.CONF.main_menu_div_id).style.display == "none"){
			my.openMainMenu();
		}
		
		else {
			my.closeMainMenu();
		}
		
	
	};
	
	
	my.closeMainMenu = function(){
		
		if (!g(APP.CONF.main_menu_div_id)){
			return;
		}
		
		dom.hideElement(g(APP.CONF.main_menu_div_id));
		g("main_menu_icon").style.backgroundColor = "";
		
	};
	
	
	my.openMainMenu = function(){

		g(APP.CONF.main_menu_div_id).style.display = "block";
		g("main_menu_icon").style.backgroundColor = "cornflowerblue";
	
	};	
	
	
	my.settings = function(){
	
		return [
			{
				title: my.l("settings","program_language"),
				type: "select",
				name: "language_select",
				id: "language_select",
				onchange: function(){my.changeLanguage(g("language_select").selectedIndex);}
			},
			{
				title: my.l("settings","profile"),
				type: "select",
				name: "profile_select",
				id: "profile_select",
				onchange: function(){my.environments.change(g("profile_select").selectedIndex-1);}
			},
			{
				title: my.l("settings","auto_save"),
				radio_name: "radio_auto_save",
				type: "radio",
				options: [
					{
						title: my.l("settings","off"),
						value: -1
					},
					{
						title: my.l("settings","every_30_seconds"),
						value: 30
					},
					{
						title: my.l("settings","every_60_seconds"),
						value: 60
					},
					{
						title: my.l("settings","every_5_minutes"),
						value: 300
					},
					{
						title: my.l("settings","every_10_minutes"),
						value: 600
					}
				],
				default_option: 2,
				onchange: my.save_and_recall.setAutosaveInterval
			},
			{
				
				title: my.l("settings","global_language_of_metadata"),
				type: "select",
				name: "metadata_language",
				id: "metadata_language_select"
			},
			{
				title: my.l("settings","cmdi_metadata_creator"),
				description: my.l("settings","cmdi_metadata_creator_description"),
				type: "text",
				name: "metadata_creator",
				id: "metadata_creator",
				value: "CMDI Maker User"
			},
			{
				title: my.l("settings","save_project"),
				description: my.l("settings", "save_project_description"),
				type: "link",
				onclick: function () { my.save_and_recall.saveAllToFile(); }
			},
			{
				title: my.l("settings","load_project"),
				description: my.l("settings","load_project_description"),
				type: "file",
				file_input_id: "project_file_input",
				file_input_name: "project_file_input",
				onchange: my.save_and_recall.handleProjectFileInputChange
			},
			{
				title: my.l("settings","delete_recall_data"),
				type: "link",
				description: my.l("settings","delete_recall_data_description"),
				onclick: function() {my.save_and_recall.deleteEnvironmentData();}
			},
			{
				title: my.l("settings","hard_reset"),
				importance: "high",
				type: "link",
				description: my.l("settings","hard_reset_description"),
				onclick: function() {    

					alertify.set({ labels: {
						ok     : my.l("confirm","no"),
						cancel : my.l("confirm","yes_delete_everything")
					} });

					alertify.confirm(my.l("confirm","hard_reset"), function (e) {

						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							my.hard_reset();
						}
					});

				}
			}
		];
	};
	
	
	my.displayMetadataLanguages = function (){
	
		var select = g("metadata_language_select");
		
		dom.removeOptions(select);

		forEach(APP.CONF.MetadataLanguageIDs,function(ID){

			var NewOption = new Option(ID[1], ID[0], false, true);
			select.options[select.options.length] = NewOption;
			
		});
	
		select.selectedIndex = 0;

	};
	
	
	my.displayLanguages = function (){
		
		var select = g("language_select");
		
		dom.removeOptions(select);
	
		forEach(my.languages, function(language){

			var NewOption = new Option(language.name, language.id, false, true);
			select.options[select.options.length] = NewOption;
			
		});
	
		select.selectedIndex = 0;

	};
	
	
	my.displayEnvironments = function (){
		
		var select = g("profile_select");
		var start_select = g("start_profile_select");
		
		dom.setSelectOptions(select, my.environments, true);
		dom.setSelectOptions(start_select, my.environments, false);
		
		start_select.addEventListener("change", function(){my.changeEnvironment(start_select.selectedIndex);});
		
	};


	my.checkIfFirstStart = function (){

		var first_start = localStorage.getItem("first_start");
		
		if (first_start === null){  //if there's no data, assume it's the first start
			first_start = true;
		}
		
		
		if (first_start === true){

			localStorage.setItem("first_start", false);
			console.log("First start! Hey there and welcome to CMDI Maker!");
		
		}
		
		else {
		
			my.log(my.l("welcome_back"));
		
		}

	};
	
	
	my.log = function(message, type){
		
		if (!type){
			type = "";
		}
		
		alertify.log(message, type, APP.CONF.log_message_period);
	
	};
	
	
	my.alert = function(message) {
	
		alertify.set({ labels: {
			ok     : my.l("ok")
		} });
		
		alertify.alert(message);
	
	};


	my.sayHello = function (){

		var index = Math.floor(Math.random() * APP.CONF.hellos.length);

		g("hello").innerHTML = APP.CONF.hellos[index][0];
		
		g("hello").addEventListener("click", function () {
			my.log(my.l("start", "this_is","before_language") + APP.CONF.hellos[index][1] + my.l("start", "this_is","after_language"));
		});

		g("greeting_text").innerHTML = my.l("start","greeting_text");
		
		g("start_select_profile_span").innerHTML = my.l("start","select_your_profile");
		
		g("link_lets_go").innerHTML = my.l("start","lets_go");
		g("supported_by_label").innerHTML = my.l("start","is_supported_by");
		g("need_help_label").innerHTML = my.l("start","need_help");
		g("help_pages_description").innerHTML = my.l("start","help_pages_description");
	};
	
	
	my.hard_reset = function(){

		my.save_and_recall.deleteAllData();
		window.removeEventListener("beforeunload", my.save);
		location.reload();

	};


	my.saveAllOutputFiles = function(){
	
		var textareas = document.getElementsByClassName(APP.CONF.xml_textarea_class_name);
		
		forEach(textareas, function(textarea){
		
			my.save_file(textarea.value, textarea.filename);
			
		});
	
	};
	
	
	my.initFunctions = function(functions){
	
		var functions_div = g("functions");
		var function_div;
		var rect;
	
		forEach(functions, function(func){
		
			if (func.type != "function_wrap"){
			
				function_div = dom.make("div", func.id, "function_icon",functions_div);
				dom.icon(function_div,"","function_img", func.icon);
				var label = dom.h3(function_div, func.label);
				
				if (func.label_span_id){
					dom.make("span", func.label_span_id, "", label);
				}
				
				else if (func.label) {  //if label is there
					label.innerHTML = func.label;
				}
				
				function_div.addEventListener('click', func.onclick);

			}

			else {
			
				var function_wrap = dom.div(functions_div,func.wrapper_id,"function_wrap");
				
				function_div = dom.div(function_wrap, func.id, "function_icon");
				dom.icon(function_div,"","function_img", func.icon);
				dom.h3(function_div, func.label);
				
				function_div.addEventListener('click', func.onclick);

				var sub_div = dom.make("div",func.sub_div,"",function_wrap);
				
				if (func.sub_div_innerHTML){
					sub_div.innerHTML = func.sub_div_innerHTML;
				}
				
				
				//this cannot be done with css
				function_div.addEventListener('mousedown', function(elem) {
					return function(){
						elem.style.backgroundColor = "black";
					};
				}(function_div));
				
				function_div.addEventListener('mouseup', function(elem) {
					return function(){
						elem.style.backgroundColor = "";
					};
				}(function_div));
				
			}
			
			if (func.after_that){
				func.after_that();
			}
		
		});
	};

	
	my.view = function (module_or_id){
		var module;
		var id;
	
		dom.closeSelectFrame();
		my.closeMainMenu();
	
		if (typeof module_or_id === 'string') {
			
			id = module_or_id;
			module = my.environments.getModuleByViewID(id);
			
		}
		
		else { //if argument is a module
			module = module_or_id;
			id = APP.CONF.view_id_prefix + module.identity.id;
		
		}
		
		if (id == "default"){
			id = "VIEW_start";
		}
		
		var views = g(APP.CONF.content_wrapper_id).children;
		
		//make all views invisible
		forEach(views, dom.hide);
		
		var view_ids = map(views, function(view) {
			return view.id;
		});
		
		//check if view exists, if not, throw error
		if (view_ids.indexOf(id) == -1){
			console.warn("Warning: Unkown view requested (" + id +")!");
			my.view("default");
			return;
		}			

		my.active_view = id;

		my.highlightViewIcon(id);
		
		g("module_icons").style.display = "block";
		
		dom.showFunctionsForView(module);
		
		//make the selected view visible
		g(id).style.display = "block";
		
		//if a module view is selected, call the view method of the module
		//every module can have a view method for things to be done, before viewing the page
		if (module && module.view){
			module.view();
		}
		
	};
	
	
	my.highlightViewIcon = function (id) {
		
		if (typeof my.environments.active_environment != "undefined"){
		
			//Unhighlight all workflow icons
			forEach(my.environments.active_environment.workflow, function(workflow){
				g(APP.CONF.viewlink_id_prefix + workflow.identity.id).style.backgroundColor = "";
			});
		}

		//Unhighlight APP VIEWLINKS
		g(APP.CONF.viewlink_id_prefix + "start").style.backgroundColor = "";
		
		var module = my.environments.getModuleByViewID(id);
		
		if (module){
			g(APP.CONF.viewlink_id_prefix + module.identity.id).style.backgroundColor = APP.CONF.highlight_color;
		}
		
		else if (id == "VIEW_start"){
			id = id.substr(APP.CONF.view_id_prefix.length);
			g(APP.CONF.viewlink_id_prefix+id).style.backgroundColor = APP.CONF.highlight_color;
		}

	};
	
	
	my.save = function(){
	
		my.save_and_recall.save();
	
	};
	
	
	my.save_file = function (text, filename, mime_type){

		var clean_filename = remove_invalid_chars(filename);
		
		if (!mime_type){
			mime_type = APP.CONF.file_download_header;
		}

		var blob = new Blob([text], {type: mime_type});
		saveAs(blob, clean_filename);

	};
	
	
	my.makeSettingFunctions = {
	
		radio: function(setting, parent){
		
			dom.makeRadios(parent, setting.options, setting.radio_name, setting.radio_name + "_", "title", "value", setting.default_option, setting.onchange);
		
		},
		
		select: function(setting, parent){
		
			var select = dom.make("select",setting.id,"",parent);
			select.size = 1;
			select.name = setting.name;
			
			if (setting.onchange){
				select.addEventListener("change", setting.onchange, false);
			}
			
			dom.br(parent);
			
		},
		
		
		powerSwitch: function(setting, parent){
			
			var input = dom.input(parent,setting.id,"on_off_switch",setting.name, "button", "Off");
			input.on = false;
			input.addEventListener("click", function(){dom.onOffSwitch(this);}, false);
			
			dom.setOnOffSwitchValue(g(setting.id),setting.default_value);
			
			dom.br(parent);
			
		},
		
		file: function(setting, parent){
		
			var input = dom.input(parent,setting.file_input_id,"",setting.file_input_name,"file");
			input.addEventListener('change', setting.onchange, false);
			dom.br(parent);
		},
		
		text: function(setting, parent){
			
			var input = dom.input(parent,setting.id,"",setting.name, "text", setting.value);
			input.addEventListener('change', setting.onchange, false);
			dom.br(parent);
		},
		
		empty: function(setting, parent){
			
			dom.make("div",setting.id,"",parent);
		
		},
		
		link: function(){
			return;
		}
	
	
	};
	
	
	my.initSettings = function (settings, parent){
	
		parent.innerHTML = "";
		
		forEach(settings, function(setting) { my.initSetting(setting, parent); });
	
	};
	

	my.initSetting = function(setting, parent){
		
		var h2 = dom.h2(parent);
		
		if ((setting.importance) && (setting.importance == "high")){
			h2.style.color = "red";
		}
		
		if (setting.onclick){
			var a = dom.a(h2,"","","#",setting.title, setting.onclick);
			
			if ((setting.importance) && (setting.importance == "high")){
				a.style.color = "red";
			}
		}
		
		else {
		
			h2.innerHTML = setting.title;
		
		}
		
		if (setting.description){
			dom.make("p","","",parent,setting.description);
		}

		if (my.makeSettingFunctions[setting.type]) {
		
			my.makeSettingFunctions[setting.type](setting, parent);
		
		}
		
		else {
		
			console.warn("Unknown setting type: " + setting.type);
			
		}
		
		dom.br(parent);
		
	};
	
	
	my.addEventListeners = function(){
	
		g("VIEWLINK_start").addEventListener("click", function() { my.view("VIEW_start"); });
	
		g('link_lets_go').addEventListener('click', function() {
		
			if (typeof my.environments.active_environment == "undefined"){
				my.environments.create(my.environments.get(0));	
			}
			
			if (my.environments.active_environment.workflow[0]){
				my.view(my.environments.active_environment.workflow[0]);
			}
			
			else {
			
				console.error("ERROR: The active profile does not have a workflow!");
				
			}
			
		});
		
		document.addEventListener("keydown", function(event) {
		
			if (event.keyCode == 27)  {   //escape pressed
			
				dom.closeSelectFrame();
			
			}
		
		});
		
	};
	
	
	my.recall = function(recall_object, environment_data){
	//environment_data is an optional parameter, if it is not specified, the function tries to get the
	//environment_data from local storage

		console.log("Filling the form with recalled data");
		
		g("metadata_language_select").selectedIndex = recall_object.settings.metadata_language;
		g("metadata_creator").value = recall_object.settings.metadata_creator;
		
		if (recall_object.settings.active_language_id){
		
			var index = my.getIndexFromLPID(recall_object.settings.active_language_id);
		
			my.active_language = my.getLPFromID(recall_object.settings.active_language_id);
			g("language_select").selectedIndex = index;
			
		}		
		
		dom.setRadiosByValue(g("radio_auto_save"), recall_object.settings.save_interval_time);
		my.save_and_recall.setAutosaveInterval(recall_object.settings.save_interval_time);
		
		if (recall_object.active_environment_id){
		
			var environment = my.environments.getByID(recall_object.active_environment_id);
			my.environments.create(environment);
			
			if (typeof environment_data == "undefined"){
				environment_data = my.save_and_recall.getRecallDataForEnvironment(environment);
			}
			
			if (typeof environment_data != "undefined"){
				my.save_and_recall.recallEnvironmentData(environment_data);
			}
			
		}
		
		my.view(recall_object.active_view);
		g(APP.CONF.content_wrapper_id).scrollTop = recall_object.scroll_top;
		
	};
	
	
	my.changeLanguage = function(index){
		
		my.active_language = my.languages[index];
		location.reload(); //includes auto save before unload
	
	};
	
	
	return my;
	
})();
