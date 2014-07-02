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


var dom = (function() {

	var my = {};

	my.getSelectedRadioIndex = function (radios){


		for (var r=0; r< radios.length; r++){
		
			if (radios[r].checked == true){
			
				return r;
			
			}
		
		}
		
		return 0;

	}

	my.getValueOfRadios = function (radios_name){
		
		var radios = document.getElementsByName(radios_name);
		var index = my.getSelectedRadioIndex(radios);
		return radios[index].value;

	}

	my.setRadioIndex = function (radios, index){

		if ((!index) || (typeof index == "undefined")){
			var index = 0;
		}

		radios[index].checked = true;

	}
	
	
	my.getOptionValuesOfSelect = function(select){

		var option_values = [];

		for (var o=0; o<select.options.length; o++){
			
			option_values.push(select.options[o].value);
		
		}

		return option_values;

	}


	my.setFormValue = function (element_id, value, open_vocabulary){

		var element = g(element_id);

		if (element.nodeName == "SELECT"){
		
			var options = [];
			
			for (var o=0;o<element.options.length;o++){
			
				options.push(element.options[o].value);
			
			
			}
			
			//if options of select contain do not contain the value, we have to change the input type to text
			if (options.indexOf(value) == -1){
		
				var new_element = my.changeOVInput(element_id, options);
				
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
			
				var new_element = my.changeOVInput(element_id, open_vocabulary);
				
				new_element.value = value;
			
			}
			
			else {
		
				element.value = value;
				
			}
		
		}

	}


	my.makeTextInput = function (parent,title,name,id,value,hover){

		if (!hover){
			var hover = "";
		}
		
		var span = document.createElement("span");
		span.title = hover;
		span.innerHTML = title;
		
		parent.appendChild(span);
		parent.appendChild(document.createElement("br"));
		
		var input = document.createElement("input");
		input.type = "text";
		input.name = name;
		input.id = id;
		input.value = value;
		input.title = hover;
		
		parent.appendChild(input);
		
		parent.appendChild(document.createElement("br"));

		return input;	
		
	}


	my.makeCheckbox = function (parent,title,name,id,checked,hover){

		if (!hover){
			var hover = "";
		}
		
		var input = document.createElement("input");
		input.type = "checkbox";
		input.name = name;
		input.id = id;
		input.checked = checked;
		input.title = hover;
		
		parent.appendChild(input);
		
		var span = dom.newElement("span","","",parent,title);
		span.title = hover;

		parent.appendChild(document.createElement("br"));

		return input;	
		
	}


	my.openVocabulary = function (parent, title, name, id, size, options, value, hover){

		if (!hover){
			var hover = "";
		}

		var span = dom.newElement("span","","",parent,title);
		span.title = hover;
		
		parent.appendChild(document.createElement("br"));


		var select = document.createElement("select");
		select.name = name;
		select.id = id;
		select.size = size;
		select.title = hover;
		
		for (var o=0; o<options.length; o++){
		
			var NewOption = new Option(options[o], options[o], false, true);
			select.options[select.options.length] = NewOption;
		}
		
		if (options.indexOf(value) != -1) {
			select.selectedIndex = options.indexOf(value);
		}
		
		else {
			select.selectedIndex = 0;
		}


		var input = document.createElement("input");
		input.name = name;
		input.id = id;
		input.type = "text";
		input.title = hover;
		

		if ((value == "") || (options.indexOf(value) !=-1)) {	
			parent.appendChild(select);
		}
		
		else {
			input.value = value;
			parent.appendChild(input);
		}
		
		var img = dom.newElement("img","","edit_img",parent);
		img.src = APP.CONF.path_to_icons + "textedit.png";
		img.alt = "Custom Property";
		img.title = "Custom Property";

		
		
		img.addEventListener("click", function(){
			
			if (document.contains(select)){
				my.removeElement(select);
				parent.insertBefore(input,img);
			}
			
			else {
				my.removeElement(img.previousSibling);
				parent.insertBefore(select,img);
			}
		
		} );


		parent.appendChild(document.createElement("br"));	

	}


	my.copyField = function (target_element_name,source_element_name){

		var value = get(source_element_name);
		
		var source_element = document.getElementsByName(source_element_name)[0];
		var target_element = document.getElementsByName(target_element_name)[0];
		
		
		if (source_element.nodeName != target_element.nodeName){
		
			if (source_element.nodeName == "SELECT"){
		
				var options = my.getOptionValuesOfSelect(source_element);
			}

			var new_e = document.createElement(source_element.nodeName);
			new_e.name = target_element.name;
			new_e.className = target_element.className;

			target_element.parentNode.insertBefore(new_e,target_element);	
			my.removeElement(target_element);
		
			if (new_e.nodeName == "SELECT"){
		
			
		
				for (var o=0; o<options.length; o++){
		
					NewOption = new Option(options[o], options[o], false, true);
					new_e.options[new_e.options.length] = NewOption;
				}
		
				new_e.selectedIndex = options.indexOf(value);
		
			}
			
			else {
			
				new_e.value = value;
			}
			
		}
		
		else {

			target_element.value = value;
		
		}
		
	}


	my.changeOVInput = function (id, options){
	//change input form of open vocabulary (=make select to text input and vice versa)

		var object = g(id);
		
		
		if (object.nodeName == "SELECT"){

			var new_object = document.createElement("input");
			new_object.type = "text";
		
		}

		else {
		
			var new_object = document.createElement("select");
			
			
			for (var o=0; o<options.length;o++){
			
				NewOption = new Option(options[o], options[o], false, true);
				new_object.options[new_object.options.length] = NewOption;
			
			
			}
			
			new_object.selectedIndex = 0;
		
		}
		
		new_object.id = object.id;
		new_object.name = object.name;
		new_object.className = object.className;

		object.parentNode.insertBefore(new_object,object);
		
		my.removeElement(object);
		
		return new_object;
		
	}


	my.makeSelect = function (parent, title, name, id, size, options, value, hover){
		//parameters: parent to append to, title, name of element, id of element, size, array of options
		
		if (!hover){
			var hover = "";
		}

		var span = document.createElement("span");
		span.innerHTML = title;
		span.title = hover;
		
		parent.appendChild(span);
		parent.appendChild(document.createElement("br"));
		
		var select = document.createElement("select");
		select.name = name;
		select.id = id;
		select.size = size;
		select.title = hover;
		
		parent.appendChild(select);
		
		parent.appendChild(document.createElement("br"));

		for (var o=0; o<options.length; o++){
		
			var NewOption = new Option(options[o], options[o], false, true);
			select.options[select.options.length] = NewOption;
		}

		if (value !=0){
			select.selectedIndex = options.indexOf(value);
		}
		
		else {
			select.selectedIndex = 0;
		
		}

		

		return select;	

	}


	my.makeDateInput = function (parent, title, name_prefix, id_prefix, y_value, m_value, d_value, hover){

		if (!hover){
			var hover = "";
		}

		var span = document.createElement("span");
		span.innerHTML = title;
		span.title = hover;
		
		parent.appendChild(span);
		
		span.appendChild(document.createElement("br"));
		
		var y_input = document.createElement("input");
		y_input.name = name_prefix+"_year";
		y_input.id = id_prefix+"_year";
		y_input.className = "YearInput";
		y_input.value = (y_value != "") ? y_value : "YYYY";
		y_input.title = hover;
		parent.appendChild(y_input);
		
		var span2 = document.createElement("span")
		parent.appendChild(span2);
		span2.innerHTML = " ";
		
		var m_input = document.createElement("input");
		m_input.name = name_prefix+"_month";
		m_input.id = id_prefix+"_month";
		m_input.className = "MonthInput";
		m_input.value = (m_value != "") ? m_value : "MM";
		m_input.title = hover;
		parent.appendChild(m_input);
		
		
		var span2 = document.createElement("span")
		parent.appendChild(span2);
		span2.innerHTML = " ";
		span2.title = hover;
		
		var d_input = document.createElement("input");
		d_input.name = name_prefix+"_day";
		d_input.id = id_prefix+"_day";
		d_input.className = "DayInput";
		d_input.value = (d_value != "") ? d_value : "DD";
		d_input.title = hover;
		parent.appendChild(d_input);
		
		parent.appendChild(document.createElement("br"));
		
	}


	my.makeTextarea = function (t_cols,t_rows,parent,title,t_name,t_id,t_class,t_value, hover){

		if (!hover){
			var hover = "";
		}
		
		var span = document.createElement("span");
		span.innerHTML = title;
		span.title= hover;
		
		parent.appendChild(span);
		parent.appendChild(document.createElement("br"));
		
		var textarea = document.createElement("textarea");
		textarea.name = t_name;
		textarea.id = t_id;
		textarea.value = t_value;
		textarea.cols = t_cols;
		textarea.rows = t_rows;
		textarea.className = t_class;
		textarea.title = hover;
		
		parent.appendChild(textarea);
		
		parent.appendChild(document.createElement("br"));	
		
		return textarea;
		
	}


	my.createTextarea = function (id, className, rows, cols, containing_string){
		
		var return_string = "<textarea id=\""+id+"\" class=\""+className+"\" rows=\""+rows+"\" cols=\""+cols+"\">"+containing_string+"\n</textarea>";
		return return_string;

	}


	my.newElement = function (element_tag,element_id,element_class,parent_to_append_to,innerHTML){

		var element = document.createElement(element_tag);
		
		if (element_id != ""){
			element.id = element_id;
		}
		
		if (element_class != ""){
			element.className = element_class;
		}
		
		parent_to_append_to.appendChild(element);

		if (innerHTML){
		
			element.innerHTML = innerHTML;
		
		}
		
		return element;
	}


	my.remove = function (id){

		var elem = g(id);
		
		return my.removeElement(elem);
		
	}


	my.removeElement = function (elem){

		//console.log("Trying to remove element " + elem);
		
		return elem.parentNode.removeChild(elem);
		
	}
	
	
	my.hideAllChildren = function(elem){
		
		var children = elem.children;
	
		for (var c=0; c<children.length; c++){
	
			children[c].style.display = "none";
	
		}
		
	}
	
	
	my.showAllChildren = function(elem){
		
		var children = elem.children;
	
		for (var c=0; c<children.length; c++){
	
			children[c].style.display = "";
	
		}
		
	}
	
	
	my.makeAllFunctionsInvisible = function(){
	
		//make all functions invisible
		var functions = g("functions").children;
		for (var f=0; f<functions.length; f++){
			functions[f].style.display = "none";
		}		
	
	}
	
	
	my.showFunctionsForView = function (module){

		my.makeAllFunctionsInvisible();
		
		//If this view is not from a module, it wont have functions
		if (!module){
			return;
		}

		//if this module has functions, make them visible
		if (module.functions){
			//make functions visible
			for (var f=0; f < module.functions.length; f++){
				var func = module.functions[f];
			
				if (func.type == "function_wrap"){
					g(module.functions[f].wrapper_id).style.display = "inline";
				}
				
				else {
					g(module.functions[f].id).style.display = "inline";
				}
			}	
		}

	}
	
	
	my.closeSelectFrame = function(){
		
		if (g("SF")){	
		
			var view = g("SF").parentNode;
		
			my.showAllChildren(view);
			my.remove("SF");

			var module = APP.getModuleOfViewID(view.id);
			my.showFunctionsForView(module);
			
		}
	
	}
	
	
	my.onOffSwitch = function(input){

		if (input.on == false){
			my.setOnOffSwitchValue(input, true);
		}
		
		else {
			my.setOnOffSwitchValue(input, false);
		}		
	};
	
	
	my.setOnOffSwitchValue = function(input, value){
	
		if (value == true){
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
		
		my.hideAllChildren(active_view);
		
		var frame = my.newElement("div","SF","SF",active_view,"");	
		frame.style.display = "block";
		
		dom.newElement("h1","","",frame,title); 
		
		var img = dom.newElement("img","","close_select_frame_icon",frame);
		img.src = APP.CONF.path_to_icons + "reset.png";
		img.addEventListener('click', function() { 
			my.closeSelectFrame(); 
		} );
		
		dom.newElement("h3","","",frame,subtitle);

		
		for (var j=0;j<options.length;j++){
		
			var a = dom.newElement("a",'cl_results_link_'+j,'cl_results_link',frame);
			dom.newElement("div","",'SF_search_entry',a,titles[j]);
			a.href = '#';
		
			a.addEventListener('click', function(num) {
				return function(){
					my.closeSelectFrame();
					callback(num);
				};
			}(options[j]) );
		}
	
		my.makeAllFunctionsInvisible();
	
	}
	
	
	my.scrollTop = function(){
	
		g("content_wrapper").scrollTop = 0;
	
	}
	

	my.createXMLOutputDIV = function (parent, title, textarea_id, value, filename){

		var div = my.newElement("div", "", "output_div", parent);
		
		var img = my.newElement("img","","download_icon",div);
		img.src = APP.CONF.path_to_icons + "save.png";
		
		var h1 = my.newElement("h1", "", "", div, title);
		
		var textarea = my.newElement("textarea", textarea_id, APP.CONF.xml_textarea_class_name, div, value);
		textarea.cols = APP.CONF.output_textarea_columns;
		textarea.rows = APP.CONF.output_textarea_rows;
		textarea.filename = filename;
		
		img.addEventListener("click", function(){
			APP.save_file(textarea.value, filename, APP.CONF.file_download_header);
		});

	}
	
	return my;
	
})();

