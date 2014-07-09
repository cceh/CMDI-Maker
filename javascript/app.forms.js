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
		
			var h3 = dom.h3(parent, field.heading);
			
			if (field.comment){
				h3.title = field.comment;
			}
			
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
		
			if (field.name && field.name !== ""){
			
				td_name = field.name+"_td";
			
			}
			
			else {
			
				td_name = "td";
			
			}
		
			var td = dom.newElement("td",element_id_prefix+td_name,element_class_prefix+td_name,parent);
			
			if (field.title && field.title !== ""){
				dom.newElement("h2","","",td,field.title);
			}
			
			if (field.fields){
			
				if (field.name && field.name !== ""){
			
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
	var sub_object;

	switch (field.type){
	
		case "form": {
		
			var object = {};
			
			for (f=0; f<field.fields.length; f++){
				
				APP.createEmptyObjectFromFormTemplate(field.fields[f], object);
			
			}
			
			return object;

		}
		
		case "column": {
			
			if (field.name && field.name != ""){
				//create sub object
				sub_object = {};
				resulting_object[field.name] = sub_object;
			}
			
			else {  //if field has no name, do not create a sub object
				sub_object = resulting_object;
			}
		
			if (field.fields){
			
				for (f=0; f<field.fields.length; f++){
				
					APP.createEmptyObjectFromFormTemplate(field.fields[f], sub_object);
			
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


	APP.fillObjectWithFormElement = function(object, element_id_prefix, form_element){
	//object = the object to be filled with form data
	//form_element = element of the form as specified in session_form
	
		var f;
		var sub_object;

		if ((form_element.type == "text") || (form_element.type == "textarea") || (form_element.type == "select") || (form_element.type == "open_vocabulary")){

			object[form_element.name] = get(element_id_prefix+form_element.name);
			
		}
		
		if (form_element.type == "check"){

			object[form_element.name] = g(element_id_prefix+form_element.name).checked;
			
		}
		
		if (form_element.type == "date"){
		
			object[form_element.name].year = get(element_id_prefix+form_element.name+"_year");
			object[form_element.name].month = get(element_id_prefix+form_element.name+"_month");
			object[form_element.name].day = get(element_id_prefix+form_element.name+"_day");
		}
		
		if (form_element.type == "column"){
			
			if (form_element.name && form_element.name != ""){
				element_id_prefix += form_element.name + "_";
			}
			
			for (f=0; f<form_element.fields.length; f++){

				APP.fillObjectWithFormElement(object, element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "subarea"){
		
			if (form_element.name && form_element.name != ""){
				element_id_prefix += form_element.name + "_";
			}
			
			for (f=0; f<form_element.fields.length; f++){
				
				APP.fillObjectWithFormElement(object[form_element.name], element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "form"){
		
			for (f=0; f<form_element.fields.length; f++){
				
				//check if a sub object has to be created
				if (form_element.fields[f].name && form_element.fields[f].name != ""){
					sub_object = object[form_element.fields[f].name];
				}
				
				else {
					sub_object = object;
				}
				
				
				APP.fillObjectWithFormElement(sub_object, element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "special"){
		
			return;
		
		}

	};