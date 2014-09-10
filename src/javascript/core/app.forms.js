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


	var makeFunctions = {
		text: function(parent, field, element_id_prefix, element_class_prefix, data_object){
		
			var input;
			
			input = APP.GUI.makeTextInput(parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(data_object && data_object[field.name] ? data_object[field.name] : ""),
				field.comment,
				field.maxLength
			);
			
			return input;
			
		},
		
		date: function(parent, field, element_id_prefix, element_class_prefix, data_object){
		
			var input;
		
			input = APP.GUI.makeDateInput(parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(data_object && data_object[field.name] ? data_object[field.name].year : ""),
				(data_object && data_object[field.name] ? data_object[field.name].month : ""),				
				(data_object && data_object[field.name] ? data_object[field.name].day : ""),					
				field.comment
			);
			
			return input;
		
		},
		
		textarea: function(parent, field, element_id_prefix, element_class_prefix, data_object){
		
			var input;
		
			input = APP.GUI.makeTextarea(
				APP.CONF.form_textarea_columns,
				APP.CONF.form_textarea_rows,
				parent,
				field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(data_object && data_object[field.name] ? data_object[field.name] : ""),
				field.comment
			);
			
			return input;
		
		},

		subarea: function(parent, field, element_id_prefix, element_class_prefix, data_object, on_special){

			var h3 = dom.h3(parent, field.heading);
			
			if (field.comment){
				h3.title = field.comment;
			}
			
			if (field.fields){
				if (field.name && field.name != ""){
					element_id_prefix += field.name + "_";
				}
				
				makeForEach(field.fields, parent, element_id_prefix, element_class_prefix, data_object[field.name], on_special);
				
			}
		},
		
		column: function(parent, field, element_id_prefix, element_class_prefix, data_object, on_special){
		
			var td_name;		
			
			if (field.name && field.name !== ""){
			
				td_name = field.name+"_td";
			
			}
			
			else {
			
				td_name = "td";
			
			}
		
			var td = dom.make("td", element_id_prefix+td_name,element_class_prefix+td_name, parent);
			
			if (field.title && field.title !== ""){
				dom.make("h2","","",td,field.title);
			}
			
			if (field.fields){
			
				if (field.name && field.name !== ""){
			
					element_id_prefix += field.name + "_";
					
				}
			
				makeForEach(field.fields, td, element_id_prefix, element_class_prefix, (data_object ? data_object[field.name] : undefined), on_special);
			
			}
			
		},
		
		form: function(parent, field, element_id_prefix, element_class_prefix, data_object, on_special){
			var form_parent;
			
			if ((field.fields) && (field.fields[0].type == "column")){
				var table = dom.make("table",element_id_prefix+"table","session_table",parent);
				var tr = dom.make("tr","","",table);
				form_parent = tr;
			}
			
			else {
				form_parent = parent;
			}
			
			makeForEach(field.fields, form_parent, element_id_prefix, element_class_prefix, data_object, on_special);
			
		},
		
		special: function(parent, field, element_id_prefix, element_class_prefix, data_object, on_special){
			
			if (!on_special){
			
				console.error("APP.forms.make: Form Template has special fields, but no method on_special has been specified!");
				console.error("field: ");
				console.error(field);
				console.error("element_id_prefix: " + element_id_prefix);
				return;
			
			}
			
			on_special(field, parent, element_id_prefix, element_class_prefix);
			
		},
		
		select: function(parent, field, element_id_prefix, element_class_prefix, data_object){
		
			var input;
			
			input = APP.GUI.makeSelect(
				parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				field.size,
				field.vocabulary,
				(data_object && data_object[field.name] ? data_object[field.name] : field.default_value),
				field.comment
			);
			
			return input;

		},
		
		open_vocabulary: function(parent, field, element_id_prefix, element_class_prefix, data_object){
		
			var value;
			var input;
		
			if (data_object && data_object[field.name]){
				value = data_object[field.name];
			}
			
			else if (field.default_value){
				value = field.default_value;
			}
			
			input = APP.GUI.openVocabulary(
				parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				field.size,
				field.vocabulary,
				value,
				field.comment
			);
			
			return input;
		
		},

		check:  function(parent, field, element_id_prefix, element_class_prefix, data_object){
		
			var input;
			
			input = APP.GUI.makeCheckbox(
				parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(data_object && data_object[field.name] ? data_object[field.name] : false),
				field.comment
			);
			
			return input;
		},
		

	};
	
	var setString = function(field, resulting_object){
		if (field.default_value){
			resulting_object[field.name] = field.default_value;
		}
		
		else {
			resulting_object[field.name] = "";
		}
	};
	
	
	var createEmptyObjectFunctions = {
		select: setString,
		open_vocabulary: setString,
		textarea: setString,
		text: setString,
		check: function (field, resulting_object){
			resulting_object[field.name] = false;
		},
		
		form: function(field) {

			var object = {};
		
			createEmptyObjectForEach(field.fields, object);
			
			return object;

		},
		
		column: function(field, resulting_object) {
			var sub_object;
			
			if (field.name && field.name !== ""){
				//create sub object
				sub_object = {};
				resulting_object[field.name] = sub_object;
			}
			
			else {  //if field has no name, do not create a sub object
				sub_object = resulting_object;
			}
		
			createEmptyObjectForEach(field.fields, sub_object);
			
		},
		
		subarea: function(field, resulting_object) {
			var parent_field_name = field.name;
			
			//create sub object
			resulting_object[parent_field_name] = {};
		
			createEmptyObjectForEach(field.fields, resulting_object[parent_field_name]);
			
		},
		
		date: function(field, resulting_object) {
		
			var date_object = {
				year: "",
				month: "",
				day: ""
			};
		
			resulting_object[field.name] = date_object;
			
		},
		
		special: function(field, resulting_object) {
			if (field.object_structure == "array"){
				resulting_object[field.name] = [];
			}
			
			else if (field.object_structure == "object"){
				resulting_object[field.name] = {};
				
				if (field.object_arrays){
				
					forEach(field.object_arrays, function (object_array){
						resulting_object[field.name][object_array] = [];
					});
				
				}
			}
			
			else {
				resulting_object[field.name] = null;
			}
			
		}
	};

	
	var makeForEach = function (fields, parent, element_id_prefix, element_class_prefix, data_object, on_special){
	
		forEach(fields, function (subfield){
			
			make(parent, subfield, element_id_prefix, element_class_prefix, data_object, on_special);
			
		});
		
	};	
	

	var make = function (parent, field, element_id_prefix, element_class_prefix, data_object, on_special){
		
		var input;

		if (makeFunctions[field.type]) {
			input = makeFunctions[field.type](parent, field, element_id_prefix, element_class_prefix, data_object, on_special);
		}
		
		else {
			console.error("ERROR: APP.forms.make: Field type not supported! Field type = " + field.type);
			return;
		}
		
		if (field.not_allowed_chars){
		
			input.onkeypress = function(e) {
				var chr = String.fromCharCode(e.which);
				
				if (field.not_allowed_chars.indexOf(chr) >= 0){
					APP.log("This character is not allowed here.","error");
					return false;
				}
			};

		}

	};
	

	var fill = function (field, element_id_prefix, data_object, on_special){
		
		var target;
		
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
		
			APP.GUI.setFormValue(element_id_prefix+field.name, target, field.vocabulary);

		}
		
		if (field.type == "date"){
		
			target = checkForValueOrTakeDefault(data_object, field);
		
			g(element_id_prefix+field.name+"_year").value = target.year;
			g(element_id_prefix+field.name+"_month").value = target.month;
			g(element_id_prefix+field.name+"_day").value = target.day;
			
		}
		
		if (field.type == "special" && on_special){
			on_special(field, element_id_prefix, data_object);
		}
		
	};
	
	
	var createEmptyObjectForEach = function (fields, resulting_object){
	
		if (typeof fields == "undefined"){
			return;
		}
	
		forEach(fields, function(field){
			
			createEmptyObjectFromTemplate(field, resulting_object);
			
		});
	
	};


	var createEmptyObjectFromTemplate = function (field, resulting_object){
	//resulting object does not have to be specified, when calling this method, it is only neccessary because of
	//the recursive nature of this method
		
		if (createEmptyObjectFunctions[field.type]) {
			return createEmptyObjectFunctions[field.type](field, resulting_object);
		}
		
		else {
			console.log("ERROR: createEmptyObjectFromTemplate: field.type not defined: " + field.type);
		}
		
	};
	
	
	var makeObjectWithFormData = function(field, element_id_prefix){
	
		var object = my.createEmptyObjectFromTemplate(field);
		
		my.fillObjectWithFormData(object, element_id_prefix, field);
		
		return object;
	
	
	};
	
	
	var fillObjectForEach = function(fields, object, element_id_prefix){

		forEach(fields, function(field){

			fillObjectWithFormData(object, element_id_prefix, field);
			
		});

	};


	var fillObjectWithFormData = function (object, element_id_prefix, field, on_special){
	//object = the object to be filled with form data
	//field = form template object
	
		var sub_object;

		if ((field.type == "text") || (field.type == "textarea") || (field.type == "select") || (field.type == "open_vocabulary")){

			object[field.name] = get(element_id_prefix+field.name);
			
		}
		
		if (field.type == "check"){

			object[field.name] = g(element_id_prefix+field.name).checked;
			
		}
		
		if (field.type == "date"){
		
			object[field.name].year = get(element_id_prefix+field.name+"_year");
			object[field.name].month = get(element_id_prefix+field.name+"_month");
			object[field.name].day = get(element_id_prefix+field.name+"_day");
		}
		
		if (field.type == "column"){
			
			if (field.name && field.name !== ""){
				element_id_prefix += field.name + "_";
			}
			
			fillObjectForEach(field.fields, object, element_id_prefix);
			
		}
		
		if (field.type == "subarea"){
		
			if (field.name && field.name !== ""){
				element_id_prefix += field.name + "_";
			}
			
			fillObjectForEach(field.fields, object[field.name], element_id_prefix);
			
		}
		
		if (field.type == "form"){
		
			forEach(field.fields, function(field){
				
				//check if a sub object has to be created
				if (field.name && field.name !== "" && (field.type == "column" || field.type == "subarea")){
					sub_object = object[field.name];
				}
				
				else {
					sub_object = object;
				}
				
				
				my.fillObjectWithFormData(sub_object, element_id_prefix, field);
			
			});
			
		}
		
		if (field.type == "special" && on_special){
			on_special(object, element_id_prefix, field);
		}
		

	};
	
	
	var my = {};
	
	my.make = make;
	my.fill = fill;
	my.makeObjectWithFormData = makeObjectWithFormData;
	my.fillObjectWithFormData = fillObjectWithFormData;
	my.createEmptyObjectFromTemplate = createEmptyObjectFromTemplate;
	
	return my;
	
})();