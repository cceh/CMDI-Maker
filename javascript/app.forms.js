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

APP.forms = (function () {
	'use strict';
	
	//PRIVATE
	
	var checkForValueOrTakeDefault = function(data_object, field){
		var value;
		
		if (typeof data_object != "undefined"){
			value = data_object;
		}
		
		else if (field.default_value) {
			value = field.default_value;
		}
		
		else {
		
			if (field.type == "check"){
				value =  false;
			}
			
			else if (field.type == "date"){
				value = {
					year: "YYYY",
					month: "MM",
					day: "DD"
				};
			}
			
			else {
				value = "";
			}
			
		}
	
		return value;
	};
	
	
	var getValueFromDataObject = function(data_object, field){
		var value;
	
		if (field.name && field.name !== ""){  //sub object
			
			if (typeof data_object != "undefined" && data_object[field.name]){
				value = data_object[field.name];
			}
			
			else {
				value = undefined;
			}
			
		}
		
		else {
		
			if (data_object){
				value = data_object;
			}
			
			else {
				value = undefined;
			}
		
		}
	
		return value;
		
	};

	
	var my = {};
	
	my.make = function (parent, field, element_id_prefix, element_class_prefix, session_object){
		
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
					
						my.make(parent, field.fields[f], element_id_prefix, element_class_prefix, session_object[field.name]);
				
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
					
						my.make(td, field.fields[f], element_id_prefix, element_class_prefix, (session_object ? session_object[field.name] : undefined));
				
					}
				
				}
				
				break;
			}
			
			case "form": {
			
				var table = dom.newElement("table",element_id_prefix+"table","session_table",parent);
				var tr = dom.newElement("tr","","",table);
				
				for (f=0; f<field.fields.length; f++){
					
					my.make(tr, field.fields[f], element_id_prefix, element_class_prefix, session_object);
				
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

		if (field.not_allowed_chars){
		
			input.onkeypress = function(e) {
				var chr = String.fromCharCode(e.which);
				
				if (field.not_allowed_chars.indexOf(chr) >= 0){
					alertify.log("This character is not allowed here.","error",5000);
					return false;
				}
			};

		}

	};
	
	
	my.fill = function (field, element_id_prefix, data_object){
		
		var target;
		var f;
		
		if (field.type == "column"){
		
			if (field.name && field.name !== ""){
				element_id_prefix += field.name + "_";
			}
		
		}

		if (field.type == "form" || field.type == "subarea" || field.type == "column"){
			
			forEach(field.fields, function(field){
			
				target = getValueFromDataObject(data_object, field);
				
				my.fill(field, element_id_prefix, target);
			
			});
			
		}
	
		if (field.type == "text" || field.type == "textarea" || field.type == "select" || field.type == "open_vocabulary" || field.type == "check"){
		
			target = checkForValueOrTakeDefault(data_object, field);
		
			dom.setFormValue(element_id_prefix+field.name, target, field.vocabulary);

		}
		
		if (field.type == "date"){
		
			target = checkForValueOrTakeDefault(data_object, field);
		
			g(element_id_prefix+field.name+"_year").value = target.year;
			g(element_id_prefix+field.name+"_month").value = target.month;
			g(element_id_prefix+field.name+"_day").value = target.day;
			
		}
		
		if (field.type == "special"){
			//?????
			return;
		
		}
		
	};


	my.createEmptyObjectFromTemplate = function (field, resulting_object){
		
		var f;
		var sub_object;

		if (field.type == "form") {

			var object = {};
		
			forEach(field.fields, function(field){
			
				my.createEmptyObjectFromTemplate(field, object);
				
			});
			
			return object;

		}
		
		if (field.type == "column") {
			
			if (field.name && field.name !== ""){
				//create sub object
				sub_object = {};
				resulting_object[field.name] = sub_object;
			}
			
			else {  //if field has no name, do not create a sub object
				sub_object = resulting_object;
			}
		
			if (field.fields){
			
				forEach(field.fields, function(field){
			
					my.createEmptyObjectFromTemplate(field, sub_object);
				
				});
			
			}
			
		}
		
		if (field.type == "subarea") {
			var parent_field_name = field.name;
			
			//create sub object
			resulting_object[parent_field_name] = {};
		
			if (field.fields){
			
				forEach(field.fields, function(field){
				
					my.createEmptyObjectFromTemplate(field, resulting_object[parent_field_name]);
			
				});
			
			}
			
		}
		
		if (field.type == "date") {
		
			var date_object = {
				year: "",
				month: "",
				day: ""
			};
		
			resulting_object[field.name] = date_object;
			
			return;
		}
		
		if (field.type == "special") {
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
		
		if (field.type == "select" || field.type == "open_vocabulary" || field.type == "textarea" || field.type == "text") {
			resulting_object[field.name] = "";
			return;
		}
		
		if (field.type == "check") {
			resulting_object[field.name] = false;
			return;
		}
		
	};


	my.fillObjectWithFormData = function (object, element_id_prefix, form_element){
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
			
			if (form_element.name && form_element.name !== ""){
				element_id_prefix += form_element.name + "_";
			}
			
			for (f=0; f<form_element.fields.length; f++){

				my.fillObjectWithFormData(object, element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "subarea"){
		
			if (form_element.name && form_element.name !== ""){
				element_id_prefix += form_element.name + "_";
			}
			
			for (f=0; f<form_element.fields.length; f++){
				
				my.fillObjectWithFormData(object[form_element.name], element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "form"){
		
			for (f=0; f<form_element.fields.length; f++){
				
				//check if a sub object has to be created
				if (form_element.fields[f].name && form_element.fields[f].name !== ""){
					sub_object = object[form_element.fields[f].name];
				}
				
				else {
					sub_object = object;
				}
				
				
				my.fillObjectWithFormData(sub_object, element_id_prefix, form_element.fields[f]);
			
			}
			
		}
		
		if (form_element.type == "special"){
			// TO DO!!!
			//object[form_element.name] = APP.active_environment.getSpecialFormData(field, parent, element_id_prefix, element_class_prefix);
			return;
		}
		

	};
	
	return my;
	
})();