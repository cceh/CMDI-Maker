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


function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}



function make_text_input(parent,title,name,id,value,hover){

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


function open_vocabulary(parent, title, name, id, size, options, value, hover){

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
	
	for (var o=0; o<options.length; o++){
	
		NewOption = new Option(options[o], options[o], false, true);
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
	
	var img = document.createElement("img");
	img.src = path_to_images + "icons/textedit.png";
	img.className = "edit_img";
	img.alt = "Custom Property";
	img.title = "Custom Property";
	
	parent.appendChild(img);
	
	
	img.addEventListener("click", function(){
		
		if (document.contains(select)){
			remove_element(select);
			parent.insertBefore(input,img);
		}
		
		else {
			remove_element(img.previousSibling);
			parent.insertBefore(select,img);
		}
	
	} );


	parent.appendChild(document.createElement("br"));	

}


function copy_field(target_element_name,source_element_name){

	var value = get(source_element_name);
	
	var source_element = document.getElementsByName(source_element_name)[0];
	var target_element = document.getElementsByName(target_element_name)[0];
	
	
	if (source_element.nodeName != target_element.nodeName){
	
		if (source_element.nodeName == "SELECT"){
	
			var options = getOptionValuesOfSelect(source_element);
		}


	
		var new_e = document.createElement(source_element.nodeName);
		new_e.name = target_element.name;
		new_e.className = target_element.className;

		target_element.parentNode.insertBefore(new_e,target_element);	
		remove_element(target_element);
	
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


function change_ov_input(id, options){

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
	
	remove_element(object);
	
	return new_object;
	
}


function make_select(parent, title, name, id, size, options, value, hover){
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
	
		NewOption = new Option(options[o], options[o], false, true);
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


function make_date_input(parent, title, name_prefix, id_prefix, y_value, m_value, d_value, hover){

	if (!hover){
		var hover = "";
	}

	var span = document.createElement("span");
	span.innerHTML = title;
	span.title = hover;
	
	parent.appendChild(span);
	
	span.appendChild(document.createElement("br"));
	
	var y_input = document.createElement("input");
	y_input.name = name_prefix+"_date_year";
	y_input.id = id_prefix+"_date_year";
	y_input.className = "YearInput";
	y_input.value = (y_value != "") ? y_value : "YYYY";
	y_input.title = hover;
	parent.appendChild(y_input);
	
	var span2 = document.createElement("span")
	parent.appendChild(span2);
	span2.innerHTML = " ";
	
	var m_input = document.createElement("input");
	m_input.name = name_prefix+"_date_month";
	m_input.id = id_prefix+"_date_month";
	m_input.className = "MonthInput";
	m_input.value = (m_value != "") ? m_value : "MM";
	m_input.title = hover;
	parent.appendChild(m_input);
	
	
	var span2 = document.createElement("span")
	parent.appendChild(span2);
	span2.innerHTML = " ";
	span2.title = hover;
	
	var d_input = document.createElement("input");
	d_input.name = name_prefix+"_date_day";
	d_input.id = id_prefix+"_date_day";
	d_input.className = "DayInput";
	d_input.value = (d_value != "") ? d_value : "DD";
	d_input.title = hover;
	parent.appendChild(d_input);
	
	parent.appendChild(document.createElement("br"));
	
}


function make_textarea(t_cols,t_rows,parent,title,t_name,t_id,t_class,t_value, hover){

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


function isSubstringAStartOfAWordInString(string, substring){

	//check if there is no letter in front of the substring
	switch (string.toLowerCase().indexOf(substring.toLowerCase())){
	
		case -1: {   //if substring is not part of string
			return false;
		}

		case 0: {  //if substring is at the beginning of the string
			return true;
		
		}
		
		default: { //if substring is somewhere in string, check if the character before substring is a letter
		
			var char_before_substring = string[string.indexOf(substring)-1];
			
			if (",. ".indexOf(char_before_substring) != -1){
				
				return true;

			}
			
			else {
				return false;
			
			}
		
		}

	}

}


function RemoveEndingFromFilename(filename){

	var pos_of_dot = filename.lastIndexOf(".");
	
	return filename.slice(0,pos_of_dot);

}


function create_textarea(id, className, rows, cols, containing_string){
    
    var return_string = "<textarea id=\""+id+"\" class=\""+className+"\" rows=\""+rows+"\" cols=\""+cols+"\">"+containing_string+"\n</textarea>";
    return return_string;

}


function o(object, property_array){ 
//returns value of object properties if they exist, if not returns ""

	var value = object;
	
	for (var p=0; p<property_array.length; p++){
	
	
		if (property_array[p] in value){
			value = value[property_array[p]];
			
		}
		
		else { 
			return "";
		}

	}
	
	return value;


}


function a(array,index){

	var list = [];

	for (var i=0;i<array.length;i++){

		list.push(array[i][index]);
	
	}

	return list;

}


function today(){

	var now = new Date();

	var day = now.getDate();	
	if (day < 10) {day = "0" + day;}
	
	var month = now.getMonth();
	month += 1;  //as months begin with 0 here
	if (month < 10) {month = "0" + month;}


	var today = now.getFullYear() + "-" + month + "-" + day;

	return today;
}    


function bytesToSize(bytes, precision){
  
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;
   
    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';
 
    }
	
	else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';
 
    }
	
	else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';
 
    }
	
	else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';
 
    }
	
	else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';
 
    }
	
	else {
        return bytes + ' B';
    }
}


function new_element(element_tag,element_id,element_class,parent_to_append_to){

	var element = document.createElement(element_tag);
	element.id = element_id;
	element.className = element_class;
	parent_to_append_to.appendChild(element);

	return element;
}


function remove(id){

	console.log("Trying to remove element with id " + id);
	
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
	
}


function remove_element(elem){

	//console.log("Trying to remove element " + elem);
	
    return elem.parentNode.removeChild(elem);
	
}


function get_file_type(filename){

	var index_of_dot = filename.lastIndexOf(".");

	var fileending = filename.slice(index_of_dot+1);
	
	var fileinfo = {
		type: "Unknown",
		mimetype: "Unknown"
	};
	
	var list = a(valid_lamus_written_resource_file_types,0);
	var pos = list.indexOf(fileending);
	
	if (list.indexOf(fileending) != -1){
	
		fileinfo.type = valid_lamus_written_resource_file_types[pos][2];
		fileinfo.mimetype = valid_lamus_written_resource_file_types[pos][1];
		return fileinfo;
	
	}
	
	list = a(valid_lamus_media_file_types,0);
	pos = list.indexOf(fileending);
	
	if (list.indexOf(fileending) != -1){
	
		fileinfo.type = valid_lamus_media_file_types[pos][2];
		fileinfo.mimetype = valid_lamus_media_file_types[pos][1];
		return fileinfo;
	
	}
	
	list = a(invalid_lamus_media_file_types,0);
	pos = list.indexOf(fileending);
	
	if (pos != -1){
	
		fileinfo.type = invalid_lamus_media_file_types[pos][2];
		fileinfo.mimetype = invalid_lamus_media_file_types[pos][1];
		return fileinfo;
	
	}
	
	list = a(invalid_lamus_written_resource_file_types,0);
	pos = list.indexOf(fileending);
	
	if (pos != -1){
	
		fileinfo.type = invalid_lamus_written_resource_file_types[pos][2];
		fileinfo.mimetype = invalid_lamus_written_resource_file_types[pos][1];
		return fileinfo;
	
	}

	return fileinfo;
}