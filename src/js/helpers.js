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


function cloneObject(obj) {
    var clone = {};
	
	if (Array.isArray(obj)){
		clone = [];
	}
	

    for (var i in obj) {
        if (obj[i] && typeof obj[i] == 'object') {
            clone[i] = cloneObject(obj[i]);
        } else {
            clone[i] = obj[i];
        }
    }

    return clone;
}


function readFileAsText(file, onsuccess){

	var reader = new FileReader();
	
	reader.onload = function(e){
		
		var result = e.target.result;
		
		onsuccess(result);
		
	};
	
	reader.readAsText(file);

}


function addScript(url, onloaded){

	console.log("adding script: " + url);

	var script = document.createElement("script");
	script.src = url;
	script.addEventListener("load", onloaded, false);
	
	document.head.appendChild(script);

}


var getIndex = function(array, key, value){

	for (var i=0; i < array.length; i++){
		
		if (array[i][key] == value){
			return i;
		}
	}
	
	return undefined;

};


var getIndexByID = function(array, id){

	return getIndex(array, "id", id);

};


var getObject = function(array, key, value){

	for (var i=0; i < array.length; i++){
		
		if (array[i][key] == value){
			return array[i];
		}
	}
	
	return undefined;

};


var getObjectByID = function(array, id){

	return getObject(array, "id", id);

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
};


//this method is also in dom, but has to be here too to avoid circular dependencies
var getSelectedRadioIndex = function (radios){

	for (var r = 0; r < radios.length; r++){
		
		if (radios[r].checked === true){
			
			return r;
			
		}
		
	}
	
	return 0;
	
};


//this method is also in dom, but has to be here too to avoid circular dependencies
var getSelectedRadioValue = function (radios){
	
	if (typeof radios == "string"){
		
		radios = document.getElementsByName(radios);
		
	}
	
	return radios[getSelectedRadioIndex(radios)].value;
	
};


function get(name){

	var elem = document.getElementsByName(name);
	
	if (elem[0] && elem[0].nodeName == "INPUT" && elem[0].type == "radio"){
		return getSelectedRadioValue(elem);
	}
	
	elem = elem[0];
	
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


/**
 * Remove an element and provide a function that inserts it into its original position
 * @param element {Element} The element to be temporarily removed
 * @return {Function} A function that inserts the element into its original position
 **/
var removeToInsertLater = function(element) {
	var parentNode = element.parentNode;
	var nextSibling = element.nextSibling;
	parentNode.removeChild(element);
	return function() {
		if (nextSibling) {
			parentNode.insertBefore(element, nextSibling);
		} else {
			parentNode.appendChild(element);
		}
	};
}


function calcAgeAtDate(dateString,birthDate) {
	
	var date = +new Date(dateString);
	var birthday = +new Date(birthDate);
	return ~~((date - birthday) / (31557600000));
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

	if (typeof str == "undefined"){
		return null;
	}

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
	
	//if not successful, try other date format
	var parts = str.match(/(\d+)/g);
	
	// note parts[1]-1
	if (parts !== null){
		var date = new Date(parts[2], parts[1]-1, parts[0]);
		
		if(date.getFullYear()==parts[2] && date.getMonth()==parts[1]-1){
		
			return {
			
				year: parts[2],
				month: parts[1],
				day: parts[0]
				
			
			};   
		}		
		
	}
	
	return null;
	
};


/*
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
	
		year = string.slice(0, 4);
		month = string.slice(5, 7);
		day = string.slice(8, 10);	

	}

	var object = {
	
		year: year,
		month: month,
		day: day
	
	
	};
	
	
	return object;

};
*/

var dateAsString = function(date){

	var year = date.year;
	var month = date.month;
	var day = date.day;

	if (month < 10){
	
		month = "0" + month;
		
	}
	
	if (day < 10){
	
		day = "0" + day;
		
	}

	return year + "-" + month + "-" + day;

};