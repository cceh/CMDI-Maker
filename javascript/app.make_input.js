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


APP.makeInput = function (parent, field, element_id_prefix, element_class_prefix, session_object){
	'use strict';
	
	var input;
	var f;

	switch (field.type){
		
		case "text": {
		
			input = dom.makeTextInput(parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(session_object && session_object[field.name] ? session_object[field.name] : ""),
				field.comment
			);
			
			break;
		}
		
		case "date": {
		
			input = dom.makeDateInput(parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(session_object && session_object[field.name] ? session_object[field.name].year : ""),
				(session_object && session_object[field.name] ? session_object[field.name].month : ""),				
				(session_object && session_object[field.name] ? session_object[field.name].day : ""),					
				field.comment
			);
			
			break;
		}
		
		case "textarea": {
		
			input = dom.makeTextarea(
				APP.CONF.form_textarea_rows,
				APP.CONF.form_textarea_columns,
				parent,
				field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(session_object && session_object[field.name] ? session_object[field.name] : ""),
				field.comment
			);
			break;
		}			
		
		case "subarea": {
		
			var h3 = document.createElement("h3");
			h3.innerHTML = field.heading;
			parent.title = field.comment;
			parent.appendChild(h3);
			
			if (field.fields){
			
				element_id_prefix += field.name + "_";
		
				for (f=0; f<field.fields.length; f++){
				
					APP.makeInput(parent, field.fields[f], element_id_prefix, element_class_prefix, session_object[field.name]);
			
				}
			
			}
			
			break;
		}
		
		case "column": {
			var td_name;		
		
			if (field.name !== ""){
			
				td_name = field.name+"_td";
			
			}
			
			else {
			
				td_name = "td";
			
			}
		
			var td = dom.newElement("td",element_id_prefix+td_name,element_class_prefix+td_name,parent);
			dom.newElement("h2","","",td,field.title);
			
			if (field.fields){
			
				if (field.name !== ""){
			
					element_id_prefix += field.name + "_";
					
				}
			
				for (f=0; f<field.fields.length; f++){
				
					APP.makeInput(td, field.fields[f], element_id_prefix, element_class_prefix, (session_object ? session_object[field.name] : undefined));
			
				}
			
			}
			
			break;
		}
		
		case "form": {
		
			var table = dom.newElement("table",element_id_prefix+"table","session_table",parent);
			var tr = dom.newElement("tr","","",table);
			
			for (f=0; f<field.fields.length; f++){
				
				APP.makeInput(tr, field.fields[f], element_id_prefix, element_class_prefix, session_object);
			
			}
			
			break;
		}
		
		case "special": {
			APP.active_environment.specialInput(field, parent, element_id_prefix, element_class_prefix);
			break;
		
		}
		
		case "select": {
			input = dom.makeSelect(
				parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				field.size,
				field.vocabulary,
				(session_object && session_object[field.name] ? session_object[field.name] : field.default_value),
				field.comment
			);
			break;
		}

		case "open_vocabulary": {
		
			var value;
		
			if (session_object && session_object[field.name]){
				value = session_object[field.name];
			}
			
			else if (field.default_value){
				value = field.default_value;
			}
			
			console.log("making OV. value is: " + value + " /// typeof value = " + typeof value);
			
			input = dom.openVocabulary(
				parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				field.size,
				field.vocabulary,
				value,
				field.comment
			);
			break;
		}
		
		case "check": {
			input = dom.makeCheckbox(
				parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(session_object && session_object[field.name] ? session_object[field.name] : false),
				field.comment
			);
			break;
		}
		
	}

	if (field.onkeypress){
		input.onkeypress = field.onkeypress;
	}

};


APP.createEmptyObjectFromFormTemplate = function (field, resulting_object){
	'use_strict';
	
	var f;

	switch (field.type){
	
		case "form": {
		
			var object = {};
			
			for (f=0; f<field.fields.length; f++){
				
				APP.createEmptyObjectFromFormTemplate(field.fields[f], object);
			
			}
			
			return object;

		}
		
		case "column": {
		
			//create sub object
			resulting_object[field.name] = {};
		
			if (field.fields){
			
				for (f=0; f<field.fields.length; f++){
				
					APP.createEmptyObjectFromFormTemplate(field.fields[f], resulting_object[field.name]);
			
				}
			
			}
			
			break;
		}
		
		case "subarea": {
		
			//create sub object
			resulting_object[field.name] = {};
		
			if (field.fields){
			
				for (f=0; f<field.fields.length; f++){
				
					APP.createEmptyObjectFromFormTemplate(field.fields[f], resulting_object[field.name]);
			
				}
			
			}
			
			break;
		}
		
		
		case "text": {
		
			resulting_object[field.name] = "";
			return;
			
		}
		
		case "date": {
		
			var date_object = {
				year: "",
				month: "",
				day: ""
			};
		
			resulting_object[field.name] = date_object;
			
			return;
		}
		
		case "textarea": {
		
			resulting_object[field.name] = "";
			return;
			
		}			
		
		case "special": {
			if (field.object_structure == "array"){
				resulting_object[field.name] = [];
			}
			
			else if (field.object_structure == "object"){
				resulting_object[field.name] = {};
				
				if (field.object_arrays){
				
					for (var a=0; a<field.object_arrays.length; a++){
						resulting_object[field.name][field.object_arrays[a]] = [];
					}
				
				}
			}
			
			else {
				resulting_object[field.name] = null;
			}
			
			return;
		
		}
		
		case "select": {
			resulting_object[field.name] = "";
			return;
		}

		case "open_vocabulary": {
			resulting_object[field.name] = "";
			return;
		}
		
		case "check": {
			resulting_object[field.name] = false;
			return;
		}
		
	}

};