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


function GetFileTypeFromFilename(filename){

	var pos_of_dot = filename.lastIndexOf(".");
	
	return filename.slice(pos_of_dot+1,filename.length).toLowerCase();

}



function GetLanguageObjectIndexFromID(cl_id){

	for (var l=0; l<content_languages.length; l++){
	
		if (content_languages[l][4] == cl_id){
			return l;
		}
	
	}

}

function GetActorLanguageObjectIndexFromID(al_id){

	for (var l=0; l<languages_of_active_actor.length; l++){
	
		if (languages_of_active_actor[l].id == al_id){
			return l;
		}
	
	}

}


function get(name){

	var elem = document.getElementsByName(name)[0];
	
	switch (elem.nodeName){
	
		case "INPUT": return elem.value;
	
		case "TEXTAREA": return elem.value;
	
		case "SELECT": {
			
			if (elem.selectedIndex != -1){
				return elem.options[elem.selectedIndex].value;
			}
			
			else {
				return "";
			}
		}
		
		default: console.log("Function \"get\" has been misused with a "+elem.nodeName+" element. This should not have happened!");
	
	}
}



function g_value(id){

	return document.getElementById(id).options[document.getElementById(id).options.selectedIndex].value;

}


function GetIndexFromResourceID(resource_id){

	for (var s=0;s<sessions.length;s++){
	
		for (var r=0; r<sessions[s].resources.writtenResources.length; r++){
	
			if (sessions[s].resources.writtenResources[r].id == resource_id){
				return r;
			}
		
		}
		
		for (var r=0; r<sessions[s].resources.mediaFiles.length; r++){
	
			if (sessions[s].resources.mediaFiles[r].id == resource_id){
				return r;
			}
		
		}
	
	
	
	}


}


function g(id){

	return document.getElementById(id);

}




function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}


function remove_invalid_chars(string){

	var text = string;
	text = text.replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/Ä/g,"Ae").replace(/Ö/g,"Oe").replace(/Ü/g,"Ue").replace(/ß/g,"ss");
	text = text.replace(/á/g,"a").replace(/à/g,"a").replace(/Á/g,"A").replace(/À/g,"A");
	text = text.replace(/é/g,"e").replace(/è/g,"e").replace(/É/g,"E").replace(/È/g,"E");
	text = text.replace(/\s+/g, '_');

	return text;
}


function calcAgeAtDate(dateString,birthDate) {
	
	var date = +new Date(dateString);
	var birthday = +new Date(birthDate);
	return ~~((date - birthday) / (31557600000));
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


function parseDate(str){

	var t = str.match(/([1-2][0-9][0-9][0-9])\-([0-1][0-9])\-([0-3][0-9])/);
	
	if(t!==null){
		
		var y=+t[1], m=+t[2], d=+t[3];
		var date = new Date(y,m-1,d);
		
		if(date.getFullYear()===y && date.getMonth()===m-1){
			return {
			
				year: t[1],
				month: t[2],
				day: t[3]
				
			
			};   
		}
	
	}
	
	return null;
}


function parse_birth_date(string){

	if (string.length != 10 || string == "Unspecified" || string == "Unknown"){
		var year = "YYYY";
		var month = "MM";
		var day = "DD";
	}
	
	else {
	
		var year = string.slice(0,4);
		var month = string.slice(5,7);
		var day = string.slice(8,10);	

	}

	var object = {
	
		year: year,
		month: month,
		day: day
	
	
	};
	
	
	return object;

}