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


APP.GUI = (function() {
	
	var l = APP.l;
	
	var my = {};

	my.setIcon = function (element, icon_id){
	
		element.src = APP.CONF.path_to_icons + icon_id + ".png";
	
	};
	
	
	my.setFormValue = function (element_id, value, open_vocabulary){

		var element = g(element_id);
		var new_element;

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


	my.makeTextInput = function (parent,title,name,id,value,hover){

		var span = dom.spanBR(parent, "", "", title);
		
		if (hover){		
			span.title = hover;
		}

		var input = dom.input(parent, id, "", name, "text", value);
		
		if (hover){		
			input.title = hover;
		}
		
		dom.br(parent);

		return input;	
		
	};


	my.makeCheckbox = function (parent,title,name,id,checked,hover){

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


	my.openVocabulary = function (parent, title, name, id, size, options, value, hover){

		if (!hover){
			hover = "";
		}

		var span = dom.spanBR(parent,"","",title);
		span.title = hover;

		var select = document.createElement("select");
		select.name = name;
		select.id = id;
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
		
		} );


		dom.br(parent);	

	};
	
	
	my.makeLanguageSearchForm = function(parent, element_id_prefix, on_search, on_add_ISO, no_br){
		
		var p = dom.make("p","", "", parent);
		var input = dom.make("input", element_id_prefix + "input","language_input",p);
		input.type = "text";
		input.size = 1;
		input.name = element_id_prefix + "input";
		
		dom.make("span","","",p," ");
		var button = dom.make("input", element_id_prefix + "search_button" ,"language_search_button",p);
		button.type = "button";
		button.value = l("language_search", "search");

		if (no_br && no_br == true){
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
		iso_button.value = l("ok");			
		
		dom.make("div",element_id_prefix + "display", "", parent);	

		button.addEventListener('click', function() {  on_search(input.value);   });
		iso_button.addEventListener('click', function() {  on_add_ISO(iso_input.value);    });
		
		input.onkeydown = function(event) {
			if (event.keyCode == 13) {  //if enter is pressed
				on_search(input.value);
			}
		};
		
		iso_input.onkeydown = function(event) {
			if (event.keyCode == 13) {  //if enter is pressed
				on_add_ISO(iso_input.value);
			}
		};
		
	};
	
	
	my.icon = function(parent, id, className, icon, onclick){
	
		var img = dom.make("img",id,className,parent);
		my.setIcon(img, icon);
		
		if (onclick){
			img.addEventListener("click", onclick, false);
		}
		
		return img;	
	
	};
	
	
	my.copyField = function (target_element_name,source_element_name){

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


	my.changeOVInput = function (id, options){
	//change input form of open vocabulary (=make select to text input and vice versa)

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


	my.makeDateInput = function (parent, title, name_prefix, id_prefix, y_value, m_value, d_value, hover){
		var span;
		
		if (!hover){
			hover = "";
		}

		span = dom.spanBR(parent,"","",title);
		span.title = hover;
		
		var y_input = dom.input(parent, id_prefix+"_year", "YearInput", name_prefix+"_year", "text", (y_value !== "") ? y_value : "YYYY");
		y_input.title = hover;
		
		span = dom.span(parent, "", "", " ");
		span.title = hover;
		
		var m_input = dom.input(parent, id_prefix+"_month", "MonthInput", name_prefix+"_month", "text", (m_value !== "") ? m_value : "MM");
		m_input.title = hover;
		
		span = dom.span(parent, "", "", " ");
		span.title = hover;
		
		var d_input = dom.input(parent, id_prefix+"_day", "DayInput", name_prefix+"_day", "text", (d_value !== "") ? d_value : "DD");
		d_input.title = hover;
		
		dom.br(parent);
		
	};


	my.makeTextarea = function (t_cols,t_rows,parent,title,t_name,t_id,t_class,t_value, hover){

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


	my.makeAllFunctionsInvisible = function(){
	
		//make all functions invisible
		var functions = g("functions").children;
		forEach(functions, dom.hideElement);
	
	};
	
	
	my.showFunctionsForView = function (module){

		my.makeAllFunctionsInvisible();
		
		//If this view is not from a module, it wont have functions
		if (!module){
			return;
		}

		//if this module has functions, make them visible
		if (module.functions){
			
			var functions = module.functions;
			
			if (typeof functions == "function"){
				functions = functions();
			}
			
			//make functions visible
			forEach(functions, function(func){
				if (func.type == "function_wrap"){
					g(func.wrapper_id).style.display = "inline";
					
					//set the sub_div to same width and position as function_div
					var rect = g(func.wrapper_id).children[0].getBoundingClientRect();
					g(func.wrapper_id).children[1].style.left = rect.left + "px";
					g(func.wrapper_id).children[1].style.width = (rect.width - 30) + "px";
					//-30 because of the 15px border of sub_divs

				}
				
				else {
					g(func.id).style.display = "inline";
				}
			});
		}

	};
	
	
	my.closeSelectFrame = function(){
		
		if (g(APP.CONF.select_frame_id)){	
		
			var view = g(APP.CONF.select_frame_id).parentNode;
		
			dom.showAllChildren(view);
			dom.remove(APP.CONF.select_frame_id);

			var module = APP.environments.getModuleByViewID(view.id);
			my.showFunctionsForView(module);
			
		}
	
	};
	
	
	my.onOffSwitch = function(input){

		if (input.on === false){
			my.setOnOffSwitchValue(input, true);
		}
		
		else {
			my.setOnOffSwitchValue(input, false);
		}		
	};
	
	
	my.setOnOffSwitchValue = function(input, value){
	
		if (value === true){
			input.value = APP.l("on");
			input.style.backgroundColor = "limegreen";
			input.on = true;
		}
		
		else {
			input.value = APP.l("off");
			input.style.backgroundColor = "tomato";
			input.on = false;
		}		
	
	};
	
	
	my.showSelectFrame = function(options, titles, callback, title, subtitle){
	//options are the parameters for the callback method
	
		//first, make sure, existing select frames are closed
		my.closeSelectFrame();
	
		var active_view = g(APP.active_view);
		
		dom.hideAllChildren(active_view);
		
		var frame = dom.make("div",APP.CONF.select_frame_id,APP.CONF.select_frame_id,active_view,"");	
		frame.style.display = "block";
		
		dom.make("h1","","",frame,title); 
		
		var img = dom.make("img","","close_select_frame_icon",frame);
		img.src = APP.CONF.path_to_icons + "reset.png";
		img.addEventListener('click', function() { 
			my.closeSelectFrame(); 
		} );
		
		dom.h3(frame,subtitle);
		
		for (var j=0;j<options.length;j++){
		
			var a = dom.a(frame,'cl_results_link_'+j,'cl_results_link',"#","",function(num) {
				return function(){
					my.closeSelectFrame();
					callback(num);
				};
			}(options[j]));
			
			dom.make("div","",'SF_search_entry',a,titles[j]);

		}
	
		my.makeAllFunctionsInvisible();
	
	};
	
	
	my.scrollTop = function(){
	
		dom.scrollTop(g(APP.CONF.content_wrapper_id));
	
	};
	
	
	my.createXMLOutputDIV = function (parent, title, textarea_id, value, filename, mockup){

		var div = dom.make("div", "", "output_div", parent);
		
		var img = my.icon(div,"","download_icon", "save");
		
		var h1 = dom.h1(div, title);
		
		var textarea = dom.textarea(div, textarea_id, APP.CONF.xml_textarea_class_name, 
		APP.CONF.output_textarea_rows, APP.CONF.output_textarea_columns, value);
		textarea.filename = filename;
		
		img.addEventListener("click", function(){
			APP.save_file(textarea.value, filename, APP.CONF.file_download_header);
		});
		
		if (mockup && mockup == true){
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
		
			var menu = dom.div(document.body, APP.CONF.main_menu_div_id, "");
			
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
	
	
	return my;
	
})();

