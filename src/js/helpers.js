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

/**
 * Helper functions. These are available in the global namespace!
 *
 * @module HELPERS
 */

/**
 * Helper functions. These are available in the global namespace!
 *
 * @class HELPERS
 */
 


/**
 * Downloads a resource via AJAX, using the HTTP GET method.
 * @method getWithAJAX
 * @param {string} url URL of the resource.
 * @param {function} success_callback Callback function to be called when resource is downloaded and ready. It gets the XMLHttpRequest object.
 * @return {mixed} http.send() Value of http.send()
 * @static 
 */	
function getWithAJAX(url, success_callback){

	var http = new XMLHttpRequest();
	
	http.open("GET", url, true);

	http.onreadystatechange = function() { //Call a function when the state changes.

		if (http.readyState == 4 && http.status == 200) {
			
			console.log("AJAX successful!");
			
			success_callback(http);
			
		}
	};
	
	console.log("Sending ajax request to: " + url);
	
	return http.send();
	
}


/**
 * Downloads a text resource via AJAX, using the HTTP GET method.
 * @method getTextWithAJAX
 * @param {string} url URL of the resource.
 * @param {function} success_callback Callback function to be called when resource is downloaded and ready. It gets the resource as text string.
 * @return {mixed} http.send() Value of http.send()
 * @static 
 */	
function getTextWithAJAX(url, success_callback){

	return getWithAJAX(url, function(http){
		var response = http.responseText;
		success_callback(response);
	});
	
}


/**
 * Downloads a JSON resource via AJAX, using the HTTP GET method.
 * @method getJSONWithAJAX
 * @param {string} url URL of the resource.
 * @param {function} success_callback Callback function to be called when resource is downloaded and ready. It gets the resulting javascript object, when JSON parsing was successful.
 * @return {mixed} http.send() Value of http.send()
 * @static 
 */	
function getJSONWithAJAX(url, success_callback){
	
	getTextWithAJAX(url, function(responseText){
		parseJSON(responseText, success_callback, undefined);		
	});
	
}


/**
 * Clones a javascript object (instead of just copying references of it).
 * @method cloneObject
 * @param {mixed} obj Source object.
 * @return {mixed} clone Clone of the object
 * @static 
 */	
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


/**
 * Parses a Javascript Blob object for its text. This obviously works only with text files.
 * @method readFileAsText
 * @param {mixed} file File as Blob object.
 * @param {function} onsuccess Callback function to be called when file is parsed. It gets the resulting string, if parsing was successful.
 * @static 
 */	
function readFileAsText(file, onsuccess){

	var reader = new FileReader();
	
	reader.onload = function(e){
		
		var result = e.target.result;
		
		onsuccess(result);
		
	};
	
	reader.readAsText(file);

}


function parseJSON(string, onsuccess, onerror){

	var object;

	try {
		object = JSON.parse(string);
	}
	
	catch (e) {
		log("parseJSON: String is not valid JSON");
		if (typeof onerror == "function"){
			onerror(e);
		}
		return;
	}
	
	if (typeof object == "undefined"){
		log("parseJSON: String is not valid JSON");
		if (typeof onerror == "function"){
			onerror();
		}
		return;
	}
	
	onsuccess(object);
	
};


function readFileAsJSON(file, onsuccess, onerror){

	readFileAsText(file, function(result){
		parseJSON(result, onsuccess, onerror);		
	});

}


function addScript(url, onloaded, async){

	var script = document.createElement("script");
	script.src = url;
	
	//if async parameter is not defined, load it sync
	script.async = async || false;
	
	console.log("adding script: " + url + ", async=" + script.async);
	
	if (onloaded){
		script.addEventListener("load", onloaded, false);
	}
	
	document.head.appendChild(script);
	
	script.addEventListener("load", function(){
		console.log("script " + url + " ready!");
	}, false);

}


function addStylesheet(filename){

	var fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", filename);

	if (typeof fileref != "undefined"){
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}
	
}


var addFile = function(filename){

	if (strings.getFileTypeFromFilename(filename) == "js"){
		addScript(filename);	
	}
	
	if (strings.getFileTypeFromFilename(filename) == "css"){
		addStylesheet(filename);	
	}

};


var addFiles = function(string_or_array, url_prefix){

	if (typeof string_or_array == "string"){
		
		if (url_prefix){
			string_or_array = url_prefix + string_or_array;
		}
		
		addFile(string_or_array);
		
		return;
	}
	
	if (Array.isArray(string_or_array)){
		
		forEach(string_or_array, function(file){
		
			if (url_prefix){
				file = url_prefix + file;
			}
		
			addFile(file);
			
		});
		
		return;
		
	}	

};


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


//iterates really through ALL items, even if some of them are deleted along the way
var forAllItems = function(array, action){

	var i = array.length;

	for (;;){
	
		if (i !== 0) {
			i = i - 1;
		}
		
		else {
			return;
		}
	
		action(array[i]);
	
	}


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

};


var getArrayWithIDs = function(array){

	return getArrayWithValuesByKey(array, "id");

};


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


var log = function(item){

	console.log(item);

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
		
		default: console.log("Function \"get\" has been misused with a " + elem.nodeName + " element. This should not have happened!");
	
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
};


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