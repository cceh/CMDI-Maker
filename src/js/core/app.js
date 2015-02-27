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

/**
 * The main module for the app.
 *
 * @module CORE
 */

/**
 * The main module for the app.
 *
 * @class APP
 */
var APP = (function () {
	'use strict';
	
	//PRIVATE
	var renderStartPage = function (){
	
		var view = g("VIEW_start");

		var random_index = Math.floor(Math.random() * APP.CONF.hellos.length);
		g("hello").innerHTML = APP.CONF.hellos[random_index][0];
		g("hello").addEventListener("click", function () {
			my.log(my.l("start", "this_is","before_language") + APP.CONF.hellos[random_index][1] + my.l("start", "this_is","after_language"));
		});

		g("greeting_text").innerHTML = my.l("start","greeting_text");
		g("start_select_profile_span").innerHTML = my.l("start","select_your_profile");
		
		g("before_lets_go").innerHTML = my.l("start","and_lets_go__before_link");
		g("link_lets_go").innerHTML = my.l("start","and_lets_go__link");
		g("after_lets_go").innerHTML = my.l("start","and_lets_go__after_link");
		
		g("supported_by_label").innerHTML = my.l("start","is_supported_by");
		g("need_help_label").innerHTML = my.l("start","need_help");
		g("help_pages_description").innerHTML = my.l("start","help_pages_description");
		
		var lang_links = g("lang_links");
		
		forEach(my.languages, function(language, counter){
			
			dom.link(lang_links, "", "", language.code.toUpperCase(), function(){
				APP.changeLanguage(counter);
			});
			
			dom.span(lang_links, "", "", "  ");
		
		});
		
		
		g('link_lets_go').addEventListener('click', function() {
		
			if (typeof my.environments.active_environment == "undefined"){
				my.environments.load(my.environments.get(0));	
			}
			
			if (my.environments.active_environment.workflow[0]){
				my.view(my.environments.active_environment.workflow[0]);
			}
			
			else {
			
				console.error("ERROR: The active profile does not have a workflow!");
				
			}
			
		});
		
	};
	
	
	var displayLanguages = function (){
		
		var select = g("language_select");
		dom.setSelectOptions(select, my.languages, "name", "id", false);

	};
	

	//PUBLIC
	
	var my = {};
	
/**
 * Initializes the app. This method is called on "DOMContentLoaded".
 * @method init
 * @param {Boolean} no_recall If true, the app will not attempt to recall saved data from the application cache.
 * @static 
 */
	my.init = function (no_recall) {
		var recall_object;
		
		my.active_language = my.getActiveLanguageByNavigatorLanguageOrTakeDefault();
		
		if (!no_recall){
			recall_object = my.save_and_recall.getRecallDataForApp();
			
			if (recall_object && recall_object.settings.active_language_id){
				my.active_language = my.getLPFromID(recall_object.settings.active_language_id);
			}
			
			if (recall_object && recall_object.version && recall_object.version != APP.CONF.version){
				console.info("APP version is different than recall object version. "+
				"APP version = " + APP.CONF.version +
				" , Recall Object version = " + recall_object.version);
				
				my.log(
					my.l("start", "you_are_now_using_version__before_version_number")+
					APP.CONF.version+
					my.l("start", "you_are_now_using_version__after_version_number")
				);
			}
		}
		
		renderStartPage();
		my.checkIfFirstStart();
		g("version_span").innerHTML = "v" + APP.CONF.version;
		
		g("settings_heading").innerHTML = my.l("settings","settings");
		my.settings.init(my.coreSettings(), g("core_settings"));
		displayLanguages();
		

		g("VIEWLINK_start").addEventListener("click", function() { my.view("VIEW_start"); });
	
		document.addEventListener("keydown", function(event) {
		
			if (event.keyCode == 27)  {   //escape pressed
			
				APP.GUI.closeSelectFrame();
			
			}
		
		});
		
		my.environments.displayAllInSelect();
		
		if ((!no_recall) && (typeof recall_object != "undefined")){
			my.recall(recall_object);
		}
		
		my.GUI.mainMenu.draw(my.main_menu_elements());
		
		window.addEventListener("beforeunload", my.save, false);
		
		
		//since this is a very big one, that would slow code parsing and executing, we add it async when everything else is done
		addScript(APP.CONF.path_to_scripts + APP.CONF.languageIndex_filename, function(){
			console.log("LanguageIndex ready!");
		}, true);
		
		console.log("Welcome to CMDI Maker v" + APP.CONF.version);
		
	};
	

/**
 * Tries to retrieve the APP language by looking at what language the browser is set (navigator.language).
 * @method getActiveLanguageByNavigatorLanguageOrTakeDefault
 * @return {Object} LanguagePack Returns an APP LanguagePack, that matches the browser language or returns the default LanguagePack of the APP.
 * @static 
 */	
	my.getActiveLanguageByNavigatorLanguageOrTakeDefault = function(){
		//check if there is a LanguagePack whose code property is equal to the browser language
		
		var navigator_language = navigator.language;
		
		var hyphen_position = navigator_language.indexOf("-");
		
		//extract the substring before the hyphen, e.g. take "en" from "en-US"
		if (hyphen_position != -1){
			navigator_language = navigator_language.substring(0, hyphen_position); 
		}
		
		var lang = getObject(my.languages, "code", navigator_language);
		
		if (typeof lang != "undefined"){
			return lang;
		}
		
		else {
			return my.languages[0];
		}
	
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
			icon: "wrench",
		},
		{
			id: "about",
			icon: "about",
		}
	];
	
	
	my.l = function(arg1, arg2, arg3, arg4){
		
		return my.getTermInActiveLanguage(my.languages, arg1, arg2, arg3, arg4);
		
	};
	
	
	my.getActiveLanguagePackFromID = function(id, LPArray){
	
		return getObject(LPArray, "id", id);
	
	};
	
	
	var getTermInLP = function(LP, arg1, arg2, arg3, arg4){
		
		if (!LP){
			return undefined;
		}
		
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
	
/**
 * Tries to get a term in a specific language. This method is called by environments each time a language dependent term is displayed by an environment.
 * @method getTermInActiveLanguage
 * @param {array} LanguagePacksArray An array with all the available LanguagePacks of the environment.
 * @param {string} arg1 First key in LanguagePack to look at.
 * @param {string} arg2 Second key in LanguagePack to look at.
 * @param {string} arg3 Third key in LanguagePack to look at.
 * @param {string} arg4 Fourth key in LanguagePack to look at.
 * @return {string} term Returns the term in the specific language. If there is no term in that language, the term in the default language is returned. If there is no term in the default language, APP.CONF.language_error_placeholder is returned.
 * @static 
 */	
	my.getTermInActiveLanguage = function(LanguagePacksArray, arg1, arg2, arg3, arg4){
	
		//Look in the LanguagesArray, that's been given by the APP or by one environment and then search for the language that has the id of the APP's active language
		var LP = my.getActiveLanguagePackFromID(my.active_language.id, LanguagePacksArray);
	
		var termInLP = getTermInLP(LP, arg1, arg2, arg3, arg4);
		
		if (typeof termInLP != "undefined"){
			return termInLP;
		}
		
		console.warn("Haven't found a term in " + my.active_language.name + ": " +
		arg1 +
		(arg2 ? ", " + arg2 : "") +
		(arg3 ? ", " + arg3 : "") +
		(arg4 ? ", " + arg4 : "") +
		". Trying to get it in default language.");
		
		//try to get term in default language
		var defaultLP = LanguagePacksArray[0];
		var termInDefaultLP = getTermInLP(defaultLP,arg1,arg2,arg3,arg4);
		
		if (typeof termInDefaultLP != "undefined"){
			return termInDefaultLP;
		}
		
		//if there's no term at all, BAD!!!
		console.error("LANGUAGE ERROR: " +
		arg1 +
		(arg2 ? ", " + arg2 : "") +
		(arg3 ? ", " + arg3 : "") +
		(arg4 ? ", " + arg4 : ""));
		
		return APP.CONF.language_error_placeholder;

	};
	
	
	my.main_menu_elements = function(){
		return [
		/*	{
				title: my.l("save"),
				id: "LINK_save_form",
				icon:	"save",
				onclick: function(){ my.save_and_recall.userSave(); }
			},*/
		// This is completely unnecessary because Auto Save is on and data will be saved
		// beforeUnload anyway.
			{
				title: my.l("open_file"),
				id: "LINK_open_file",
				icon:	"open",
				onclick: function(){ my.GUI.showFileDialog(APP.save_and_recall.loadFromFile);}
			},
			{
				title: my.l("export_to_file"),
				id: "LINK_export_to_file",
				icon:	"save",
				onclick: function(){ my.save_and_recall.saveActiveEnvironmentStateToFile(); }
			},
			{
				title: my.l("reset_form"),
				icon: "reset",
				id: "LINK_reset_form",
				onclick: function() {     

					APP.confirm(my.l("really_reset_form"), function (e) {
						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							APP.environments.resetActive();
							APP.log(my.l("form_reset"));
							
						}
						
					}, my.l("no"), my.l("yes_delete_form"));
					
				}
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
	

	my.coreSettings = function(){
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
			/*{
				title: my.l("settings","load_project"),
				description: my.l("settings","load_project_description"),
				type: "file",
				file_input_id: "project_file_input",
				file_input_name: "project_file_input",
				onchange: my.save_and_recall.handleProjectFileInputChange
			},*/
			//Unneccessary, as this function is already in main menu
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

					APP.confirm(my.l("confirm","hard_reset"), function (e) {

						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							my.hard_reset();
						}
						
					}, my.l("confirm","no"), my.l("confirm","yes_delete_everything"));

				}
			}
		];
	};
	
	

/**
 * Checks if the app is started for the first time or not and fires a fitting welcome note. (TO DO: The check in this method should be replaced by a check, if a data object can be retrieved or not.
 * @method checkIfFirstStart
 * @static 
 */	
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
	

/**
 * Shows a log message to the user
 * @method log
 * @param {string} message The message to display.
 * @param {string} type Type of the log message resulting in different colors ("error" => red flag, "success" => green flag, else: black flag).
 * @static 
 */		
	my.log = function(message, type){
		
		if (!type){
			type = "";
		}
		
		alertify.log(message, type, APP.CONF.log_message_period);
	
	};

	
/**
 * Shows a confirm dialog to the user
 * @method confirm
 * @param {string} message The message to display.
 * @param {function} callback The function to be called when the user makes a decision. An bool value is passed to this function: true when user pressed ok, false when user pressed cancel.
 * @param {function} ok_label The text of the OK button.
 * @param {function} cancel_label The text of the cancel button.
 * @static 
 */	
	my.confirm = function(message, callback, ok_label, cancel_label){
	
		alertify.set({ labels: {
			ok     : ok_label,
			cancel : cancel_label
		} });
		
		alertify.confirm(message, callback);
	
	};
	

/**
 * Shows an alert message to the user.
 * @method alert
 * @param {string} message The message to display.
 * @static 
 */		
	my.alert = function(message) {
	
		alertify.set({ labels: {
			ok     : my.l("ok")
		} });
		
		alertify.alert(message);
	
	};


/**
 * This method deletes all saved data and reloads the app. It is quite DANGEROUS!
 * @method hard_reset
 * @static 
 */	
	my.hard_reset = function(){

		my.save_and_recall.deleteAllData();
		window.removeEventListener("beforeunload", my.save);
		location.reload();

	};

	
/**
* This method changes the view of the app. A view can be a view of the app, 
* or of a module of an environment.
* @method view
* @param {Mixed} module_or_id It can be a module or an id of a view element.
*/
	my.view = function (module_or_id){
		var module;
		var id;
		var pager;
	
		my.GUI.mainMenu.close();
		
		if (typeof module_or_id == "undefined"){
			console.warn("APP.view: module_or_id is undefined. Showing default view!");
			module_or_id = "default";
		}
		
		if (typeof module_or_id === 'string') {
			
			id = module_or_id;
			module = my.environments.getModuleByViewID(id);
			
		}
		
		else { //if argument seems to be a module
			
			if (module_or_id.identity){
				module = module_or_id;
				id = APP.CONF.view_id_prefix + module.identity.id;
			}
			
			else {
				console.warn("APP.view: module to view is undefined!");
				APP.view("default");
				return;
			}
		}
		
		if (id == "default"){
			id = "VIEW_start";
		}
		
		var views = g(APP.CONF.content_wrapper_id).children;
		
		//make all views invisible
		forEach(views, dom.hide);
		
		var view_ids = getArrayWithIDs(views);
		
		//check if view exists
		if (view_ids.indexOf(id) == -1){
			console.warn("Warning: Unkown view requested (" + id +")!");
			my.view("default");
			return;
		}			

		my.active_view = id;

		my.GUI.highlightViewIcon(id);
		
		g("module_icons").style.display = "block";
		
		my.GUI.showFunctionsForView(module);
		
		//make the selected view visible
		g(id).style.display = "block";
		
		//if there is a pager, remove it
		if (g("pager")){
			dom.remove("pager");
		}		
	
		//if a module view is selected, call the view method of the module
		//every module can have a view method for things to be done, before viewing the page
		if (module && module.view){
			module.view();
		}
		
	};
	

/**
* Saves the current state of the APP and the active environment.
* @method save
* @static
*/
	my.save = function(){
	
		my.save_and_recall.save();
	
	}; 
	

/**
* Saves a file with text content. For the user, it looks like a download.
* @method saveTextfile
* @param {string} text Content of file as string
* @param {string} filename Filename
* @param {string} mime_type Mime type for download
* @static
*/	
	my.saveTextfile = function (text, filename, mime_type){

		var clean_filename = strings.replaceAccentBearingLettersWithASCISubstitute(filename);
		
		if (!mime_type){
			mime_type = APP.CONF.file_download_header;
		}

		var blob = new Blob([text], {type: mime_type});
		saveAs(blob, clean_filename);

	};
	
	
	
/**
* Gets all XML strings from output textareas, makes files and zips these files into one. For the user, it looks like a download of a ZIP file.
* @method zipAllOutputFiles
* @static
*/	
	my.zipAllOutputFiles = function(){
	
		var textareas = document.getElementsByClassName(APP.CONF.xml_textarea_class_name);
		
		var file_name;
		
		if (typeof APP.environments.active_environment.getProjectName == "function" && APP.environments.active_environment.getProjectName() !== ""){
			file_name = APP.environments.active_environment.getProjectName() + ".zip";
		}
		
		else {
			file_name = APP.CONF.zip_archive_file_name;
		}
		
		// use a BlobWriter to store the zip into a Blob object
		zip.createWriter(new zip.BlobWriter(), function(writer) {
			
			var asyncLoop = function(o){
				var i=-1;

				var loop = function(){
					i++;
					if(i==o.length){o.callback(); return;}
					o.functionToLoop(loop, i);
				};
				
				loop(); //init
			};
			
			asyncLoop({
				length : textareas.length,
				functionToLoop : function(loop, i){
				
					// use a TextReader to read the String to add, onsuccess: loop!
					writer.add(textareas[i].filename, new zip.TextReader(textareas[i].value), loop);
				
				},
				callback : function(){
					writer.close(function(blob) {
					
						// blob contains the zip file as a Blob object
						console.log("GOT ZIP BLOB");
						saveAs(blob, file_name);

					});
				}    
			});
			
			
		}, function(error) {
			// onerror callback
		});
	
	};
	

/**
* Gets all XML strings from output textareas, makes files and saves them. For the user, it looks like several downloads.
* @method saveAllOutputFiles
* @static
*/
	my.saveAllOutputFiles = function(){
	
		var textareas = document.getElementsByClassName(APP.CONF.xml_textarea_class_name);
		
		forEach(textareas, function(textarea){
		
			my.saveTextfile(textarea.value, textarea.filename);
			
		});
	
	};


/**
* Recalls and sets the app state. If recall_object.active_environment_id is given, it tries to load that environment and recalls the environment state too.
* If environment_data is undefined, it tries to get the recall data for that environment by checking the browser database.
* @method recall
* @param {mixed} recall_object Object with the state of the app.
* @param {mixed} environment_data Object with the state of an environment to be loaded.
* @static
*/	
	my.recall = function(recall_object, environment_data){
	//environment_data is an optional parameter, if it is not specified, the function tries to get the
	//environment_data from local storage

		console.log("Filling the form with recalled data");
	
		if (recall_object.settings.active_language_id){
		
			var index = my.getIndexFromLPID(recall_object.settings.active_language_id);
		
			my.active_language = my.getLPFromID(recall_object.settings.active_language_id);
			g("language_select").selectedIndex = index;
			
		}		
		
		dom.setRadiosByValue(g("radio_auto_save"), recall_object.settings.save_interval_time);
		my.save_and_recall.setAutosaveInterval(recall_object.settings.save_interval_time);
		
		if (recall_object.active_environment_id){
		
			var environment = my.environments.getByID(recall_object.active_environment_id);
			my.environments.load(environment);
			
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
	
	
/**
* Changes the language of the app. Reloads the app, so that changes are effective immediately.
* @method changeLanguage
* @param {integer} index Index of the language in the array my.languages
* @static
*/
	my.changeLanguage = function(index){
		
		my.active_language = my.languages[index];
		location.reload(); //includes auto save before unload
	
	};
	

/**
* Searches for a language entry in LanguageIndex.js. Displays a screen where the user can select a language from the results. Selection will be passed as parameter to on_select
* @method doStandardLanguageSearch
* @param {string} input Input string
* @param {function} on_select Method to be called when the user selects a language. Selection will be passed as parameter.
* @static
*/
	my.doStandardLanguageSearch = function(input, on_select){
	//input = input string

		//if input string is shorter than 3 chars, return error
		if (input.length < 3){
		
			APP.alert(my.l("languages", "specify_search_request_at_least_3_chars"));
			
			return;
		}
		
		var name_hits = [];
		
		//look through the whole LanguageIndex file
		for (var i=0;i<LanguageIndex.length;i++){
			
			//if input is start of a word in string, add it to name_hits
			if (strings.isSubstringAStartOfAWordInString(LanguageIndex[i][3], input)){
				
				//get an array with all relevant ISO codes
				name_hits.push(LanguageIndex[i][0]);
			}

		}
		
		//now we have all relevant ISO codes in name_hits. next step: get the entries with the L-names of these ISO codes.
		
		//iterate again through the whole LanguageIndex file and filter it for the results
		var results = LanguageIndex.filter( function(LanguageObject){
			
			//if an entry of LanguageIndex is an L language AND its ISO code is part of name_hits, we have a result!
			return ((name_hits.indexOf(LanguageObject[0]) != -1) && (LanguageObject[2] == "L" ));
			
		});
		
		var titles = map(results, function(result){

			return result[0] + ", " + result[1] + ", " + result[3];

		});	

		var heading = my.l("languages", "language_search") + ": " + results.length + " " + ((results.length == 1) ? my.l("languages", "result") : my.l("languages", "results"));
		var subheading = "(ISO639-3 Code, Country ID, " + my.l("languages", "language_name") + ")";
		
		APP.GUI.showSelectFrame(results, titles, on_select, heading, subheading);		
		
	};

	
	document.addEventListener('DOMContentLoaded', function() {
	
		my.init();

	}, false);
	
	
	// Check if a new cache is available on page load.
	window.addEventListener('load', function(e) {

		window.applicationCache.addEventListener('updateready', function(e) {
			
			if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			// Browser downloaded a new app cache.
			// Swap it in and reload the page to get the new hotness.
				
				window.applicationCache.swapCache();
				
				//if (confirm('A new version of this site is available. Load it?')) {
					window.location.reload();
				//}
				
			}
			
			else {
				// Manifest didn't change. Nothing new to serve.
				console.log("Manifest file on server didn't change.");
			}
			
			
		}, false);

	}, false);

	
	return my;
	
})();
