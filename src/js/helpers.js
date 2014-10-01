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


function ajax_get(url, success_callback){

	var http = new XMLHttpRequest();
	
	http.open("GET", url, true);

	http.onreadystatechange = function() { //Call a function when the state changes.

		if(http.readyState == 4 && http.status == 200) {
			
			console.log("AJAX successful!");
			
			var response = http.responseText;

			success_callback(response);
			
		}
	}
	
	console.log("Sending ajax request to: " + url);
	
	return http.send();
	
}


function readFileAsText(file, onsuccess){

	var reader = new FileReader();
	
	reader.onload = function(e){
		
		var result = e.target.result;
		
		onsuccess(result);
		
	};
	
	reader.readAsText(file);

}


function getFileTypeFromFilename(filename){

	var pos_of_dot = filename.lastIndexOf(".");
	
	return filename.slice(pos_of_dot+1,filename.length).toLowerCase();

}


function getFilenameFromUNIXFilePath(path){

	var pos_of_slash = path.lastIndexOf("/");
	
	if (pos_of_slash == -1){
		return path;
	}
	
	return path.substring(pos_of_slash+1);

}


function addScript(url, onloaded){

	console.log("adding script: " + url);

	var script = document.createElement("script");
	script.src = url;
	script.addEventListener("load", onloaded, false);
	
	document.head.appendChild(script);

}


function getDirectoryFromUNIXFilePath(path){

	var pos_of_slash = path.lastIndexOf("/");
	
	if (pos_of_slash == -1){
		return undefined;
	}
	
	return path.substring(0, pos_of_slash+1);

}


var linesToArray = function(string){

	return string.split("\n");

};


var getIndex = function(array, key, value){

	for (var i=0; i < array.length; i++){
		
		if (array[i][key] == value){
			return i;
		}
	}
	
	return undefined;

};


var getObject = function(array, key, value){

	for (var i=0; i < array.length; i++){
		
		if (array[i][key] == value){
			return array[i];
		}
	}
	
	return undefined;

};


var map = function(array, transform) {
	var mapped = [];
	
	for (var i = 0; i < array.length; i++){
		mapped.push(transform(array[i]));
	}
	
	return mapped;
};


var getArrayWithValuesByKey = function(array, key){

	var new_array = map(array, function(item){
		return item[key];
	});

	return new_array;

}


var getArrayWithIDs = function(array){

	return getArrayWithValuesByKey(array, "id");

}


var filter = function(array, test) {
	var passed = [];
	for (var i = 0; i < array.length; i++) {
		if (test(array[i])){
			passed.push(array[i]);
		}
	}
	
	return passed;
	
};


var forEach = function(array, action) {
	for (var i = 0; i < array.length; i++){
		action(array[i], i);
	}
}


function get(name){

	var elem = document.getElementsByName(name)[0];
	
	if (typeof elem == "undefined"){
	
		elem = g(name);
	
	}
	
	if (typeof elem == "undefined"){
	
		console.error("get: Element " + name + " is undefined!");
		return;
	
	
	}	
	
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
			
			break;
		}
		
		default: console.log("Function \"get\" has been misused with a "+elem.nodeName+" element. This should not have happened!");
	
	}
}



function g_value(id){

	return document.getElementById(id).options[document.getElementById(id).options.selectedIndex].value;

}


var g = function (id){
	
	if (document.getElementById(id)){
		return document.getElementById(id);
	}
	
	if (document.getElementsByName(id).length > 0){
		return document.getElementsByName(id);
	}
	
	return undefined;

};


function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}


function replaceAccentBearingLettersWithASCISubstitute(string){

	var text = string;
	text = text.replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/Ä/g,"Ae").replace(/Ö/g,"Oe").replace(/Ü/g,"Ue").replace(/ß/g,"ss");
	text = text.replace(/á/g,"a").replace(/à/g,"a").replace(/Á/g,"A").replace(/À/g,"A");
	text = text.replace(/é/g,"e").replace(/è/g,"e").replace(/É/g,"E").replace(/È/g,"E");
	text = text.replace(/\s+/g, '_');

	return text;
}


var removeCharactersFromString = function (string, char_string){
	var character;
	var pos;
	
	for (var c=0; c< char_string.length; c++){

		character = char_string[c];
	
		while (string.indexOf(character) != -1){
		
			pos = string.indexOf(character);
		
			string = string.slice(0, pos) + string.slice(pos+1, string.length);
		
		}

	}
	
	return string;
};


var replaceCharactersInStringWithSubstitute = function (string, char_string, substitute){

	var character;
	
	//for each char in char_string, i. e. for each char, that is to be replaced
	for (var c=0; c< char_string.length; c++){

		character = char_string[c];
		
		for (var i=0; i<string.length;){  //here it is important, that string.length gets evaluated anew each loop
			
			if (string[i] == character) {
				
				string = string.slice(0, i) + substitute + string.slice(i+1);
				
				//move the pointer to the point after the substitute and continue
				i += substitute.length;
				continue;
			}
			
			i += 1;
		
		}

	}
	
	return string;
};


function calcAgeAtDate(dateString,birthDate) {
	
	var date = +new Date(dateString);
	var birthday = +new Date(birthDate);
	return ~~((date - birthday) / (31557600000));
}


function isSubstringAStartOfAWordInString(string, substring){
	
	string = string.toLowerCase();
	substring = substring.toLowerCase();
	
	//check if there is no letter in front of the substring
	switch (string.indexOf(substring)){
	
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


function removeEndingFromFilename(filename){

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


	var today_date = now.getFullYear() + "-" + month + "-" + day;

	return today_date;
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


function sortBySubKey(array,keys){

    return array.sort(function(a, b) {
        var x = a[keys[0]][keys[1]];
        var y = b[keys[0]][keys[1]];

        if (typeof x == "string"){
            x = x.toLowerCase(); 
            y = y.toLowerCase();
        }

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });


}


function sortByKey(array, key) {

    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string"){
            x = x.toLowerCase(); 
            y = y.toLowerCase();
        }

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
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


var parse_birth_date = function(string){
	var year;
	var month;
	var day;

	if (string.length != 10 || string == "Unspecified" || string == "Unknown"){
		year = "YYYY";
		month = "MM";
		day = "DD";
	}
	
	else {
	
		year = string.slice(0,4);
		month = string.slice(5,7);
		day = string.slice(8,10);	

	}

	var object = {
	
		year: year,
		month: month,
		day: day
	
	
	};
	
	
	return object;

};


var areOnlyTheseCharsInString = function(string, chars){

	for (var i=0; i<string.length; i++){

		if (chars.indexOf(string[i]) == -1){
			return false;
		}
		
	}

	return true;

}