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
 * A sub module of APP that deals with the GUI.
 *
 * @class APP.GUI
 */
APP.GUI = (function() {
	
	var l = APP.l;
	
	var my = {};
	
/**
 * Displays a busy indicator. (This feature is in pre-alpha state. Do not use it yet.)
 * @param parent Parent element
 * @method showBusyIndicator
 */	
	my.showBusyIndicator = function(parent){
	
		if (g("busy_div")){
			dom.remove("busy_div");
		}
		
		//g("environment_view").style.display = "none";
		
		parent.innerHTML = "";
	
		var busy_div = dom.div(parent, "busy_div", "busy_div");
		
		var p = dom.p(busy_div, "", "", "center");
		
		var img = dom.img(p, "busy_icon", "busy_icon", "img/busy.svg");
		
		img.width = "700";
		img.height = "300";
		
	}

/**
 * Hides the busy indicator again.  (This feature is in pre-alpha state. Do not use it yet.)
 * @method showBusyIndicator
 */
	my.hideBusyIndicator = function(){
	
		dom.remove("busy_div");
		
		g("environment_view").style.display = "block";
	
	}

	
/**
 * Displays a busy indicator. (This feature is in pre-alpha state. Do not use it yet.)
 * @method setIcon
 * @param element DOM element of the icon (has to be be img)
 * @param icon_id Name of the icon.
 */	
	my.setIcon = function (element, icon_id){
	
		element.src = APP.CONF.path_to_icons + icon_id + ".png";
	
	};

	
/**
 * Sets a value to a form element
 * @method setFormValue
 * @param element_id ID of DOM element
 * @param value Value
 * @param open_vocabulary If element is an open vocabulary, it should be provided here, too.
 */	
	my.setFormValue = function (element_id, value, open_vocabulary){

		var element = g(element_id);
		var new_element;
		
		if (!element){
			console.error("setFormValue: No element found! element_id = " + element_id);
			return;
		}

		if (element.nodeName == "SELECT"){
		
			var options = [];
			
			forEach(element.options, function(option){
			
				options.push(option.value);
			
			});
			
			//if options of select contain do not contain the value, we have to change the input type to text
			if (options.indexOf(value) == -1){
		
				new_element = my.changeOVInput(element_id, options);
				new_element.value = value;
			
			}
			
			else {
			
				element.value = value;
				
			}
		
		}
		
		else {  //if element is not select
		
			//if the element is text input, but there's an entry in the open vocabulary for the value
			//that's great, because we can then go back to a select
			if ((element.type == "text") && (open_vocabulary) && (open_vocabulary.indexOf(value) != -1)){
			
				new_element = my.changeOVInput(element_id, open_vocabulary);
				new_element.value = value;
			
			}
			
			else if (element.type == "checkbox"){
			
				element.checked = value;
			
			}
			
			else {
		
				element.value = value;
				
			}
		
		}

	};


/**
 * Creates a text input element with heading. Used a lot by APP.forms
 * @method makeTextInput
 * @param parent Parent element in DOM
 * @param {String} title Title or heading that is displayed above the form element
 * @param {String} name Name of the input element
 * @param {String} id ID of the input element
 * @param {String} value Value
 * @param {String} hover HTML Title Element value. This value is displayed as a tooltip when mouse is hovering above the element.
 * @param maxLength Maximum length of chars in element.
 * @return {Object} Element that is to be created.
 */	
	my.makeTextInput = function (parent, title, name, id, value, hover, maxLength){

		var span = dom.spanBR(parent, "", "", title);
		
		if (hover){		
			span.title = hover;
		}

		var input = dom.input(parent, id, "", name, "text", value);
		
		if (hover){		
			input.title = hover;
		}
		
		if (maxLength){		
			input.maxLength = maxLength;
		}
		
		dom.br(parent);

		return input;	
		
	};
	

/**
 * Creates a text input element with heading. The element can be used to type year numbers.
 * @method makeYearInput
 * @param parent Parent element in DOM
 * @param {String} title Title or heading that is displayed above the form element
 * @param {String} name Name of the input element
 * @param {String} id ID of the input element 
 * @param {String} value Value
 * @param hover HTML Title Element value. This value is displayed as a tooltip when mouse is hovering above the element.
 * @return {Object} Element that is to be created.
 */		
	my.makeYearInput = function (parent, title, name, id, value, hover){

		var span = dom.spanBR(parent, "", "", title);
		
		if (hover){		
			span.title = hover;
		}

		var input = dom.input(parent, id, "YearInput", name, "text", (value !== "") ? value : "YYYY");
		
		if (hover){		
			input.title = hover;
		}
		
		input.maxLength = 4;  //MaxLength of Year = 4
		
		dom.br(parent);

		return input;	
		
	};


/**
 * Creates an input element of type "checkbox" with a heading above the element.
 * @method makeCheckbox
 * @param {Object} parent Parent element in DOM
 * @param {String} title Title or heading that is displayed above the form element
 * @param {String} name Name of the input element
 * @param {String} id ID of the input element
 * @param {Boolean} checked Set to true if the checkbox is to be checked.
 * @param {String} hover HTML Title Element value. This value is displayed as a tooltip when mouse is hovering above the element.
 * @return {Object} Element that is to be created.
 */	
	my.makeCheckbox = function (parent, title, name, id, checked, hover){

		var input = dom.input(parent, id, "", name, "checkbox");
		input.checked = checked;
		if (hover){		
			input.title = hover;
		}
		
		var span = dom.spanBR(parent,"","",title);
		
		if (hover){
			span.title = hover;
		}

		return input;	
		
	};


/**
 * Creates a user input field where the user either can select an option from a given vocabulary or type in a custom option. As always, there is a heading above the element.
 * @method openVocabulary
 * @param {Object} parent Parent element in DOM
 * @param {String} title Title or heading that is displayed above the form element
 * @param {String} name Name of the input elements
 * @param {String} id ID of the input elements. Note that both select and input will have the same ID.
 * @param options Array with strings. Vocabulary of values.
 * @param {String} value Value of the input field. Note that if the value is part of options, the select element will be used, otherwise the text input element. 
 * @param {String} hover HTML Title Element value. This value is displayed as a tooltip when mouse is hovering above the element.
 * @param {String} className Class name of the select and input elements. 
 * @return {Object}  Returns an object that contains both the select and the input element. Keys are "text" and "select".
 */	
	my.openVocabulary = function (parent, title, name, id, size, options, value, hover, className){

		if (!hover){
			hover = "";
		}
		
		if (typeof title != "undefined"){
			var span = dom.spanBR(parent,"","",title);
			span.title = hover;
		}

		var select = document.createElement("select");
		select.name = name;
		select.id = id;
		select.className = className;
		select.size = size;
		if (hover){		
			select.title = hover;
		}
		
		dom.setSelectOptions(select, options);
		
		if (typeof value != "undefined" && options.indexOf(value) != -1) {
			select.selectedIndex = options.indexOf(value);
		}
		
		else {
			select.selectedIndex = 0;
		}


		var input = document.createElement("input");
		input.name = name;
		input.id = id;
		input.className = className;
		input.type = "text";
		if (hover){		
			input.title = hover;
		}
		

		if ((typeof value == "undefined") || (options.indexOf(value) != -1)) {	
			parent.appendChild(select);
		}
		
		else {
			input.value = value;
			parent.appendChild(input);
		}
		
		var img = my.icon(parent,"","edit_img", "textedit");
		img.alt = "Custom Property";
		img.title = "Custom Property";
		
		img.addEventListener("click", function(){
			
			if (document.contains(select)){
				dom.remove(select);
				parent.insertBefore(input,img);
			}
			
			else {
				dom.remove(img.previousSibling);
				parent.insertBefore(select,img);
			}
		
		});

		dom.br(parent);
		
		var return_object = {
			text: input,
			select: select
		};
		
		return return_object;

	};
	
	
/**
 * Creates a language search form, where the user can search a language or type in an ISO639-3 code to add a language somewhere.
 * @method makeLanguageSearchForm
 * @param {Object}  Parent element in DOM
 * @param {String} element_id_prefix Prefix of the IDs of all elements that are created here.
 * @param {Boolean} no_br Set true, if there shall be no line break between the search input part and the add ISO part.
 * @param {Boolean} no_display Set true, if there shall no display element be created that could contain added languages to display.
 * @param {Function} on_select Callback function that is called, when the user adds a language.
 */		
	my.makeLanguageSearchForm = function(parent, element_id_prefix, no_br, no_display, on_select){
		var on_search = APP.doStandardLanguageSearch;
		var on_add_ISO = my.addLanguageByISOCode;
		
		var p = dom.make("p","", "", parent);
		var input = dom.make("input", element_id_prefix + "input","language_input",p);
		input.type = "text";
		input.size = 1;
		input.name = element_id_prefix + "input";
		
		dom.make("span","","",p," ");
		var button = dom.make("input", element_id_prefix + "search_button" ,"language_search_button",p);
		button.type = "button";
		button.value = l("language_search", "search");

		if (no_br && no_br === true){
			dom.make("span","","",p," ");
		}
		
		else {
			dom.br(p);
		}
		
		dom.make("span","","",p,l("language_search", "or_type_in_iso_code") + " ");
		
		var iso_input = dom.make("input", element_id_prefix + "iso_input","language_iso_input",p);
		iso_input.type = "text";
		iso_input.size = 1;
		iso_input.name = element_id_prefix + "iso_input";
		
		dom.make("span","","",p," ");
		
		var iso_button = dom.make("input", element_id_prefix + "iso_ok","language_iso_add_button",p);
		iso_button.type = "button";
		iso_button.value = l("main", "ok");			
		
		if (!no_display){
			dom.make("div",element_id_prefix + "display", "", parent);	
		}

		
		button.addEventListener('click', function() {  on_search(input.value, on_select);   });
		iso_button.addEventListener('click', function() {  on_add_ISO(iso_input, on_select);    });
		
		input.onkeydown = function(event) {
			if (event.keyCode == 13) {  //if enter is pressed
				on_search(input.value, on_select);
			}
		};
		
		iso_input.onkeydown = function(event) {
			if (event.keyCode == 13) {  //if enter is pressed
				on_add_ISO(iso_input, on_select);
			}
		};
		
	};
	
	
	my.addLanguageByISOCode = function(input_element, on_success){
		var input = input_element.value.toLowerCase();

		console.log("ADDING ISO LANGUAGE " + input);
		
		for (var j=0;j<LanguageIndex.length;j++){   //for all entries in LanguageIndex
		
			if ( (LanguageIndex[j][0] == input)  &&  (LanguageIndex[j][2] == "L")){		//look for their l-name entry
				
				on_success(LanguageIndex[j]);
				
				input_element.value = "";
				return;

			}

		}
		
		// the iso codes qaa ... qtz are reserved for local use and aren't part of the LanguageIndex, check for them
		if (my.isISOCodeReservedForLocalUse(input) === true){
			on_success(
				[input, "", "LOCAL", ""]
			);
			
			input_element.value = "";
			
			return;
		}
		
		APP.alert(l("languages", "iso_code") + " " + input + " " + l("languages", "not_found_in_db") + ".");

	};
	

/**
 * Checks if an ISO code is reserved for local use. These are all ISO codes between "qaa" and "qtz"
 * @method isISOCodeReservedForLocalUse
 * @param {String} code ISO Code
 * @return {Boolean} True or false.
 */	
	my.isISOCodeReservedForLocalUse = function(code){
		//check for codes between qaa ... qtz
		
		if (code.length != 3){
			return false;
		}
		
		if (code[0] != "q"){
			return false;
		}
		
		if ("abcdefghijklmnopqrst".indexOf(code[1]) == -1){
			return false;
		}
		
		if ("abcdefghijklmnopqrstuvwxyz".indexOf(code[2]) == -1){
			return false;
		}
		
		return true;
	
	};
	

/**
 * Creates a DOM element containing an icon based on the available icons in src/img/icons.
 * @method icon
 * @param {Object} parent Parent DOM element
 * @param {String} id ID of the element.
 * @param {String} className Class name of the element.
 * @param {String} icon Name of the icon, e.g. "star" or "about". Must be one of the icons in src/img/icons, but without file ending.
 * @param {Function} onclick Callback function that is called when the icon is clicked upon.
 * @return {Object} DOM object of icon.
 */	
	my.icon = function(parent, id, className, icon, onclick){
	
		var img = dom.make("img", id, className, parent);
		my.setIcon(img, icon);
		
		if (onclick){
			img.addEventListener("click", onclick, false);
		}
		
		return img;	
	
	};
	

/**
 * Copies the value of a form element to another form element, no matter if elements are select or input, type=text.
 * @method copyField
 * @param {String} target_element_name Name of the target element.
 * @param {String} source_element_name Name of the source element.
 */		
	my.copyField = function (target_element_name, source_element_name){

		var value = get(source_element_name);
		
		var source_element = document.getElementsByName(source_element_name)[0];
		var target_element = document.getElementsByName(target_element_name)[0];
		
		if (source_element.nodeName != target_element.nodeName){
			var options;
		
			if (source_element.nodeName == "SELECT"){
		
				options = my.getOptionValuesOfSelect(source_element);
				
			}

			var new_e = document.createElement(source_element.nodeName);
			new_e.name = target_element.name;
			new_e.className = target_element.className;

			target_element.parentNode.insertBefore(new_e,target_element);	
			dom.remove(target_element);
		
			if (new_e.nodeName == "SELECT"){
		
			
				dom.setSelectOptions(new_e, options);		
				new_e.selectedIndex = options.indexOf(value);
		
			}
			
			else {
			
				new_e.value = value;
			}
			
		}
		
		else {

			target_element.value = value;
		
		}
		
	};


/**
 * Changes the type of input element for an Open Vocabulary input field.
 * @method changeOVInput
 * @param {String} id ID of the element.
 * @param {Array} options If the field changes from text input to select, this is the vocabulary for the select.
 * @return {Object} Returns the newly created DOM node.
 */
	my.changeOVInput = function (id, options){
	//change input form of open vocabulary (=make select to text input and vice versa)
	//This method has to be changed!
	//my.openVocabulary creates already both elements select and text input.
	//Here we should make use of that and the fact, that data-binding has been
	//already applied to them
	
	
		var object = g(id);
		var new_object;
		
		
		if (object.nodeName == "SELECT"){

			new_object = document.createElement("input");
			new_object.type = "text";
		
		}

		else {
		
			new_object = document.createElement("select");
			
			dom.setSelectOptions(new_object, options);
			
		}
		
		new_object.id = object.id;
		new_object.name = object.name;
		new_object.className = object.className;

		object.parentNode.insertBefore(new_object,object);
		
		dom.remove(object);
		
		return new_object;
		
	};


/**
 * Creates a select element in the DOM. As always, there is a heading above the element.
 * @method makeSelect
 * @param {Object} parent Parent element in DOM
 * @param {String} title Title or heading that is displayed above the form element
 * @param {String} name Name of the input element.
 * @param {String} id ID of the input element.
 * @param {Array} options Vocabulary of values.
 * @param {String} value Value of the select. 
 * @param {String} hover HTML Title Element value. This value is displayed as a tooltip when mouse is hovering above the element.
 * @return {Object}  Returns the newly created DOM node.
 */		
	my.makeSelect = function (parent, title, name, id, size, options, value, hover){
		//parameters: parent to append to, title, name of element, id of element, size, array of options
		
		if (!hover){
			hover = "";
		}

		var span = dom.spanBR(parent, "", "", title);
		span.title = hover;
		
		var select = document.createElement("select");
		select.name = name;
		select.id = id;
		select.size = size;
		select.title = hover;
		
		parent.appendChild(select);
		
		dom.br(parent);
		
		dom.setSelectOptions(select, options);

		if (typeof value != "undefined" && options.indexOf(value) != -1){
			select.selectedIndex = options.indexOf(value);
		}
		
		else {
			select.selectedIndex = 0;
		}

		return select;	

	};


/**
 * Creates input elements to input a date. As always, there is a title above the form element.
 * @method makeDateInput
 * @param {Object} parent Parent element in DOM
 * @param {String} title Title or heading that is displayed above the form element
 * @param {String} name_prefix Prefix that is used for all names of DOM elements to be created.
 * @param {String} id_prefix Prefix that is used for all IDs of DOM elements to be created.
 * @param {String} y_value Value of the year element.
 * @param {String} m_value Value of the month element.
 * @param {String} d_value Value of the day element.
 * @param {String} hover HTML Title Element value. This value is displayed as a tooltip when mouse is hovering above the element.
 * @return {Object} Returns an object containing references to the newly created DOM nodes. Keys are "year", "month" and "day".
 */	
	my.makeDateInput = function (parent, title, name_prefix, id_prefix, y_value, m_value, d_value, hover){
		var span;
		
		if (!hover){
			hover = "";
		}

		span = dom.spanBR(parent,"","",title);
		span.title = hover;
		
		var y_input = dom.input(parent, id_prefix+"_year", "YearInput", name_prefix+"_year", "text", (y_value !== "") ? y_value : "YYYY");
		y_input.title = hover;
		y_input.maxLength = 4;
		
		span = dom.span(parent, "", "", " ");
		span.title = hover;
		
		var m_input = dom.input(parent, id_prefix+"_month", "MonthInput", name_prefix+"_month", "text", (m_value !== "") ? m_value : "MM");
		m_input.title = hover;
		m_input.maxLength = 2;
		
		span = dom.span(parent, "", "", " ");
		span.title = hover;
		
		var d_input = dom.input(parent, id_prefix+"_day", "DayInput", name_prefix+"_day", "text", (d_value !== "") ? d_value : "DD");
		d_input.title = hover;
		d_input.maxLength = 2;
		
		dom.br(parent);
		
		return_object = {
			year: y_input,
			month: m_input,
			day: d_input
		};
		
		return return_object;
		
	};


/**
 * Creates a textarea. As always, there is a title above the form element.
 * @method makeTextarea
 * @param {Number} t_cols Number of columns of the textarea.
 * @param {Number} t_rows Number of rows of the textarea. 
 * @param {Object} parent Parent element in DOM.
 * @param {String} title Title or heading that is displayed above the form element
 * @param {String} t_name Name of the textarea element.
 * @param {String} t_id ID of the textarea element.
 * @param {String} t_class Class of the textarea element.
 * @param {String} t_value Value of the element.
 * @param {String} hover HTML Title Element value. This value is displayed as a tooltip when mouse is hovering above the element.
 * @return {Object} Returns the textarea DOM node.
 */	
	my.makeTextarea = function (t_cols, t_rows, parent, title, t_name, t_id, t_class, t_value, hover){

		if (!hover){
			hover = "";
		}
		
		var span = dom.spanBR(parent, "", "", title);
		span.title = hover;
		
		var textarea = dom.make("textarea", t_id, t_class, parent);
		textarea.name = t_name;
		textarea.value = t_value;
		textarea.cols = t_cols;
		textarea.rows = t_rows;
		textarea.title = hover;
		
		dom.br(parent);
		
		return textarea;
		
	};


/**
 * Hides all functions from the user.
 * @method makeAllFunctionsInvisible
 */	
	my.makeAllFunctionsInvisible = function(){
	
		//make all functions invisible
		var functions = g(APP.CONF.functions_div_id).children;
		forEach(functions, dom.hideElement);
	
	};
	

/**
 * Hides the div wrapper that contains the functions.
 * @method hideFunctionsDIV
 */	
	my.hideFunctionsDIV = function(){
	
		g(APP.CONF.functions_div_id).style.height = "0px";
		g(APP.CONF.content_wrapper_id).style.bottom = "0px";
		
		if (g(APP.CONF.log_section_id)){
			g(APP.CONF.log_section_id).style.bottom = "10px";
		}
	
	};
	

/**
 * Shows the div wrapper that contains the functions.
 * @method showFunctionsDIV
 */		
	my.showFunctionsDIV = function(){
	
		g(APP.CONF.functions_div_id).style.height = APP.CONF.functions_div_height;
		g(APP.CONF.content_wrapper_id).style.bottom = APP.CONF.functions_div_height;
		
		if (g(APP.CONF.log_section_id)){
			g(APP.CONF.log_section_id).style.bottom = "50px";
		}
	
	};
	

/**
 * Shows the div wrapper that contains the functions.
 * @method showFunctionsForView
 * @param {Object} module Module of which the functions are to be displayed.
 */		
	my.showFunctionsForView = function (module){

		my.makeAllFunctionsInvisible();
		
		//If this view is not from a module, it wont have functions
		if (!module){
			my.hideFunctionsDIV();
			return;
		}

		//if this module has functions, make them visible
		if (module.functions){
		
			my.showFunctionsDIV();
			
			var functions = module.functions;
			
			if (typeof functions == "function"){
				functions = functions();
			}

			forEach(functions, my.renderFunctionIfNotDisabled);
			
		}

	};
	
	
/**
 * Renders a function if it is not disabled, i.e. part of the array APP.environments.disabled_functions
 * @method renderFunctionIfNotDisabled
 * @param {Object} function CMDI Maker Function object. Note that the parameter is an object, not a function.
 */		
	my.renderFunctionIfNotDisabled = function(func){
		var id;
		
		if (func.type == "function_wrap"){
		
			id = func.wrapper_id;
		
		}
		
		else {
		
			id = func.id;
			
		}
		
		if (APP.environments.disabled_functions.indexOf(id) != -1){
			return;
		}
		
		my.renderFunction(func);
	
	};
	

/**
 * Renders a function.
 * @method renderFunction
 * @param {Object} function CMDI Maker Function object. Note that the parameter is an object, not a function.
 */		
	my.renderFunction = function (func){
	
		if (func.type == "function_wrap"){
			
			g(func.wrapper_id).style.display = "inline";
			
			//set the sub_div to same width and position as function_div
			var rect = g(func.wrapper_id).children[0].getBoundingClientRect();
			g(func.wrapper_id).children[1].style.left = rect.left + "px";
			g(func.wrapper_id).children[1].style.minWidth = (rect.width - 30) + "px";
			//-30 because of the 15px border of sub_divs

		}
		
		else {
			g(func.id).style.display = "inline";
		}
		
	};
	

/**
 * Switches a CMDI Maker toggle switch from on to off or the other way aroud.
 * @method switchToggle
 * @param {Object} input DOM Node of the toggle.
 */			
	my.switchToggle = function(input){

		if (input.on === false){
			my.setToggleValue(input, true);
		}
		
		else {
			my.setToggleValue(input, false);
		}		
	};
	

/**
 * Sets CMDI Maker toggle switch to on or off.
 * @method setToggleValue
 * @param {Object} input DOM Node of the toggle.
 * @param {Boolean} value True = toggle on, false = toggle off. 
 */				
	my.setToggleValue = function(input, value){
	
		if (value === true){
			input.value = APP.l("main", "on");
			input.style.backgroundColor = APP.CONF.toggle_color_on;
			input.on = true;
		}
		
		else {
			input.value = APP.l("main", "off");
			input.style.backgroundColor = APP.CONF.toggle_color_off;
			input.on = false;
		}		
	
	};
	

/**
 * Shows a frame on the screen where the user can select one of multiple values. For this selection frame, a new view is created, if it does not exist yet.
 * @method showSelectFrame
 * @param {Array} options Options to be displayed. Note, that the values in this array are not displayed on screen.
 * @param {Array} titles Titles of the options. Titles are displayed on screen.
 * @param {Function} callback Function to be called, when the user clicks on one option. The respective option from the options array is passed here as parameter.
 * @param {String} title Title of the selection frame. 
 * @param {String} subtitle Subtitle of the selection frame.  
 */		
	my.showSelectFrame = function(options, titles, callback, title, subtitle){
	//options are the parameters for the callback method
	
		var old_view = APP.active_view;
		
		//create new view for select frame or get old one
		if (g("VIEW_SF")){
			var SF_view = g("VIEW_SF");
			SF_view.innerHTML = "";
		}
		
		else {
			
			SF_view = dom.div(g("content_wrapper"), "VIEW_SF", "content");
			
		}
		
		var frame = dom.make("div",APP.CONF.select_frame_id,APP.CONF.select_frame_id,SF_view,"");	
		frame.style.display = "block";
		
		dom.make("h1","","",frame,title); 
		
		var img = dom.make("img","","close_select_frame_icon",frame);
		img.src = APP.CONF.path_to_icons + "reset.png";
		img.addEventListener('click', function() { 
			//go back to old view
			APP.view(old_view); 
		} );
		
		dom.h3(frame,subtitle);
		
		for (var j=0; j<options.length; j++){
		
			var a = dom.link(frame,'cl_results_link_'+j,'cl_results_link',"",function(num) {
				return function(){
					callback(num);
					
					//go back to old view
					APP.view(old_view);
				};
			}(options[j]));
			
			dom.make("div","",'SF_search_entry',a,titles[j]);

		}
		
		APP.view("VIEW_SF");
	
	};
	

/**
 * Scrolls the content to the top.
 * @method scrollTop
 */		
	my.scrollTop = function(){
	
		dom.scrollTop(g(APP.CONF.content_wrapper_id));
	
	};
	

/**
 * Creates a GUI form that can contain an XML document. With this form, it is possible then to download the XML or to send it to an URL via HTTP POST.
 * @method createXMLOutputDIV
 * @param {Object} parent Parent DOM element
 * @param {String} title Heading of the form.
 * @param {String} textarea_id DOM element id of the textarea, that contains the XML document.
 * @param {String} value XML document
 * @param {String} filename Name of the file that is saved on the computer, when the user clicks on "Save"
 * @param {Boolean} mockup If true, the form's color will be red and there will be a warning message to not use this XML document as it is invalid.
 * @param {Object} http_post_information Object that contains information on how to send this XML document via HTTP post. Keys are "xml_string_key" (Key of the POST parameter that contains the XML string), "url", "additional_headers" (array of key-value-pairs, that are added as headers to the HTTP request) and "additional_data" (data that is appended to post payload)
 */		
	my.createXMLOutputDIV = function (parent, title, textarea_id, value, filename, mockup, http_post_information){

		var div = dom.make("div", "", "output_div", parent);
		
		var img = my.icon(div,"","download_icon xml_output_area_icon", "save");
		
		if (typeof http_post_information != "undefined"){
			var post_img = my.icon(div,"","download_icon xml_output_area_icon", "send_mail");
			
			post_img.title = "Post data to server";
			
		}
		
		var h1 = dom.h1(div, title);
		
		var textarea = dom.textarea(div, textarea_id, APP.CONF.xml_textarea_class_name, 
		APP.CONF.output_textarea_rows, APP.CONF.output_textarea_columns, value);
		
		//Sanitize filename
		filename = strings.replaceAccentBearingLettersWithASCISubstitute(filename);
		filename = strings.removeAllCharactersFromStringExcept(filename, APP.CONF.valid_chars_for_filename);
		
		textarea.filename = filename;
		
		img.addEventListener("click", function(){
			APP.saveTextfile(textarea.value, filename, APP.CONF.file_download_header);
		});
		
		
		if (typeof http_post_information != "undefined"){
			
			var xml_in_one_line = strings.removeCharactersFromString(textarea.value, "\r\n");
			
			var post_data = http_post_information.xml_string_key + "=" + xml_in_one_line + "&" + http_post_information.additional_data;			
			
			post_img.addEventListener("click", function(){
				postWithAJAX(
					http_post_information.url,
					post_data,
					function(){APP.log("Data saved on server!", "success");},
					http_post_information.additional_headers
				);					
			});			
		}
		
		if (mockup && mockup === true){
			console.warn("Created invalid XML");
			div.style.backgroundColor = "tomato";
			h1.style.color = "#AA0000";
			textarea.style.color = "red";
			h1.innerHTML += " - INVALID XML!";
			textarea.value = "############################################################################\n"+
			"WARNING: THE FOLLOWING XML IS NOT VALID AND MEANT ONLY FOR TESTING PURPOSES!\n"+
			"############################################################################\n"+
			value;
			dom.remove(img);
		}
		
		

	};
	

/**
 * Highlights a view icon, e.g. a workflow item. Unhighlights all the other view icons.
 * @method highlightViewIcon
 * @param {String} id Module identity. NOT the id of a DOM node.
 */		
	my.highlightViewIcon = function (id) {
		
		if (typeof APP.environments.active_environment != "undefined"){
		
			//Unhighlight all workflow icons
			forEach(APP.environments.active_environment.workflow, function(workflow){
				g(APP.CONF.viewlink_id_prefix + workflow.identity.id).style.backgroundColor = "";
			});
		}

		//Unhighlight APP VIEWLINKS
		g(APP.CONF.viewlink_id_prefix + "start").style.backgroundColor = "";
		
		var module = APP.environments.getModuleByViewID(id);
		
		if (module){
			g(APP.CONF.viewlink_id_prefix + module.identity.id).style.backgroundColor = APP.CONF.highlight_color;
		}
		
		else if (id == "VIEW_start"){
			id = id.substr(APP.CONF.view_id_prefix.length);
			g(APP.CONF.viewlink_id_prefix+id).style.backgroundColor = APP.CONF.highlight_color;
		}

	};
	
	
	my.mainMenu = (function() {
		
		var my = {};
		
		my.drawElement = function(element, parent){
			
			var div = dom.div(parent, element.id, "main_menu_entry");
			APP.GUI.icon(div, "", "main_menu_entry_img", element.icon);
			dom.span(div, "", "main_menu_entry_span", element.title);
			
			div.addEventListener("click", element.onclick, false);
			div.addEventListener("click", my.close, false);
			
		};	
		
		my.draw = function(menu_elements){
			var menu;
			
			//if main menu already exists
			if (g(APP.CONF.main_menu_div_id)){
				menu = g(APP.CONF.main_menu_div_id);
				menu.innerHTML = "";
			}
			
			else {
				menu = dom.div(document.body, APP.CONF.main_menu_div_id, "");
			}
			
			forEach(menu_elements, function(element){ my.drawElement(element, menu); });
			
			my.close();
			
			g("main_menu_icon").addEventListener("click", my.changeDisplay);
			g("content_wrapper").addEventListener("click", my.close);
		};
		
		
		my.changeDisplay = function(){
		
			if (g(APP.CONF.main_menu_div_id).style.display == "none"){
				my.open();
			}
			
			else {
				my.close();
			}
			
		
		};
		
		
		my.close = function(){
			
			if (!g(APP.CONF.main_menu_div_id)){
				return;
			}
			
			dom.hideElement(g(APP.CONF.main_menu_div_id));
			g("main_menu_icon").style.backgroundColor = "";
			
		};
		
		
		my.open = function(){

			g(APP.CONF.main_menu_div_id).style.display = "block";
			g("main_menu_icon").style.backgroundColor = "cornflowerblue";
		
		};
		
		return my;
		
	})();
	
	
	my.showFileDialog = function(onchange){
	
		alertify.set({ labels: {
			ok     : APP.l("main", "abort")
		} });
		
		var innerHTML = "<input type='file' id='generic_file_input'>";
		
		
		alertify.alert(innerHTML);
	
		g("generic_file_input").addEventListener("change", function(evt){
		
			var file = evt.target.files[0];
			
			onchange(file);
			
			g("alertify-ok").click();  //dirty, but it works!
			
		});
	
	};
	
	
	my.selectionMechanism = function (file_entry_prefix, selected_flag_in_className, callback){
	//This constructor function provides a selection mechanism for objects in the GUI.
	//SHIFT = Select multiple resources
	//ESCAPE = Deselect all resources
	
		var self = this;
		
		this.shift = false;
		this.last_selected_file = -1;
		this.selected_files = [];
		
		this.selectFile = function(i){

			var pos = self.selected_files.indexOf(i);

			if (pos == -1){
				self.selected_files.push(i);
				self.last_selected_file = i;
			}
			
			else {
				self.selected_files.splice(pos,1);
				self.last_selected_file = i;
			}

			self.markFileEntry(i);

		};
		
		
		this.markFileEntry = function(i){
			var event;

			var pos = g(file_entry_prefix + i).className.indexOf(" " + selected_flag_in_className);
			
			if (pos == -1) {
				
				g(file_entry_prefix + i).className = g(file_entry_prefix + i).className + " " + selected_flag_in_className;
				
				event = {
					index: i,
					selected: true
				};
				
			}
			
			else {
			
				g(file_entry_prefix + i).className = g(file_entry_prefix + i).className.slice(0,pos);
				
				event = {
					index: i,
					selected: false
				};
				
			}
			
			callback(event);

		};
		
		
		this.deselectAllFiles = function(){

			while (self.selected_files.length > 0){
			
				self.selectFile(self.selected_files[0]);
			
			}

		};
		
		
		this.clickedOnFile = function(i){
			var f;
			
			if (self.shift === true){
				
				if (i < self.last_selected_file){
				
					for (f = self.last_selected_file-1; f>=i; f--){
				
						self.selectFile(f);
				
					}		
				
				}
				
				if (i > self.last_selected_file){
				
					for (f = self.last_selected_file+1; f<=i; f++){
				
						self.selectFile(f);
				
					}
				}
				
			}
			
			else {
				self.selectFile(i);	
			}

		};
		
		
		document.onkeydown = function(event) {
		
			if (event.keyCode == 16) {  //if shift is pressed
				if (self.shift === false){
					self.shift = true;
					console.log("shift on");
				}
			}
			
			if (event.keyCode == 27)  {   //escape pressed
			
				self.deselectAllFiles();
			
			}
		
		};
		
		
		document.onkeyup = function(event) {
		
			if (event.keyCode == 16) {  //if shift is let go
				self.shift = false;
				console.log("shift off");
			}
			
		};
	
	};
	
	
	return my;
	
})();

