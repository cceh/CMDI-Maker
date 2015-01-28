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
	
	
var XMLString = function () {
	"use strict";

	//PRIVATE

	var element_prefix;
	var buffer = "";
	

	var createTag = function(name, mode, attributes){
		
		name = self.escapeOrRemoveIllegalCharacters(name);
		
		var return_string = "<";
		
		//if it's a closing tag, add closing slash at the beginning
		if (mode == "close"){
			return_string+="/";
		}
		
		
		//if there is an element_prefix, add it with a colon!
		if (element_prefix && element_prefix !== ""){
			return_string += element_prefix + ":" + name;
		}
		
		else {
			return_string += name;		
		}
		
		//if tag is not closing tag, insert attributes
		if ((mode === "open") || (mode == "self-closing")){
		
			//Calculate element name length for addAttributes function
			var en_length = name.length;
			
			if (element_prefix && element_prefix !== ""){
				en_length = en_length + element_prefix.length + 1;  //+1 because of the colon after the element prefix
			}
		
		
			return_string += addAttributes(attributes, en_length);
		}
		
		if (mode == "self-closing"){
			return_string+="/";
		}
	
		return_string += ">";
		
		return return_string;

	};
	
	
	var addAttributes = function(attributes, length_of_element_name){
		
		var return_string = "";
		
		for (var i = 0; i < attributes.length; i++){
			
			/*
			when this is not the first and only attribute to add,
			start a new line and begin in the column where the attribute above began,
			that means after self.tab, <, length_of_element_name and
			the space between element_name and the first attribute
			*/
			if (i !== 0){
				return_string+="\n";
				return_string += addTabs(self.tab);
               
				for (var j = 0; j < length_of_element_name; j++){
					return_string += " ";
				}
				
				return_string += "  ";
				
			}
			
			//when this is the first attribute to add, just make a space and start with it
			if (i === 0){
				return_string += " ";
			}
			
			//attribute key
			return_string += self.escapeOrRemoveIllegalCharacters(attributes[i][0]);
			
			return_string += "=";
			
			//attribute value in quotation marks
			return_string += "\"";
			return_string += self.escapeOrRemoveIllegalCharacters(attributes[i][1]);
			return_string += "\"";
			
		}
		
		return return_string;
	
	
	};
	
	
	var addTabs = function(number){
		var return_string = "";
		
		for (var x = 0; x < number; x++){
			for (var y = 0; y < self.spaces_per_tab; y++){
				return_string += " ";
			}
		}
		
		return return_string;
	};
	

	
	//PUBLIC
	var self = this;
	
	self.header = function(){
		buffer += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
	};

	self.last_mode = null;
	self.tab = 0;
	self.spaces_per_tab = 3;
	
	self.reset = function(){
	
		self.last_mode = null;
		buffer = "";
		self.tab = 0;
		element_prefix = undefined;
	
	};
	
	
	self.escapeOrRemoveIllegalCharacters = function(string){
		var illegal_char;
		var entity_reference;
		
		var illegal_chars = [
			["&amp;",	"&"],			//ampersand
			//ampersand HAS TO BE FIRST in this array, so that the ampersands of the other entity references wont get escaped too.
			["&lt;",	"<"],			//less than
			["&gt;",	">"],			//greater than
			["&apos;",	"'"],			//apostrophe
			["&quot;",	"\""]			//quotation mark
		];
	
		//Escape XML special chars
		for (var i = 0; i < illegal_chars.length; i++){
			
			illegal_char = illegal_chars[i][1];
			entity_reference = illegal_chars[i][0];
			string = strings.replaceCharactersInStringWithSubstitute(string, illegal_char, entity_reference);
			
		}
		
		
		//Remove not allowed UTF-8 chars from string
		// XML PCDATA does not allow some Unicode-Chars, see: http://stackoverflow.com/questions/12229572/php-generated-xml-shows-invalid-char-value-27-message
		string = string.replace('/[^\\x{0009}\\x{000a}\\x{000d}\\x{0020}-\\x{D7FF}\\x{E000}-\\x{FFFD}]+/u', '');
	
		return string;
	
	};
	
	
	self.setElementPrefix = function(string){
		
		if ((typeof string == "string") && (string !== "")){
			element_prefix = string;
		}
		
		else {
			element_prefix = undefined;
		}
	
	};
	

	self.tag = function(name, mode, keys){   //keys as array
		//mode open = opening tag
		//mode close = closing tag
		//mode self-closing = self-closing tag
		
		if (typeof name != "string"){
			console.error("XML.Element: typeof Element name = " + typeof name + ". Must be string!");
			return;
		}
		
		
		if (!keys){
			keys = [];
		}
    
		var return_string = "";
    
		if (mode == "close"){
			self.tab -= 1;
		}
		
		//if this is NOT a closing tag just after an opening tag, 
		//AND if this is not the beginning of all, then start a new line
		if ((!(mode == "close" && self.last_mode == "open")) && self.last_mode !== null){
			return_string += "\n";
			return_string += addTabs(self.tab);
		}
		
		return_string += createTag(name, mode, keys);
		
		if (mode === "open"){
			self.tab += 1;
		}
	
		self.last_mode = mode;
		
		buffer += return_string;
		
		return return_string;
		
	};
	
	
	self.insertValue = function(value){
	
		value = self.escapeOrRemoveIllegalCharacters(value);
		
		buffer += value;
		
		return value;	
	
	};
	
	
	self.element = function (name, value, keys){
		
		var return_string = "";
		
		if (typeof value == "undefined"){
			value = "undefined";
			console.warn("XML.Element: Value of " + name + " is undefined!");
		}
		
		if (typeof value == "number"){
			value = value.toString();
		}
		
		
		//when there is a value, there must be opening and closing tags
		if (value !== ""){
		
			return_string += self.open(name, keys);
			return_string += self.insertValue(value);
			return_string += self.close(name);
		
		}
	
		else {
			return_string += self.tag(name, "self-closing", keys);
		}
		
		return return_string;
		
	};
	
	
	self.open = function(name, keys){
		return self.tag(name, "open", keys);
	};
	
	self.close = function(name){
		return self.tag(name, "close");
	};
	
	self.selfClosing = function(name, keys){
		return self.tag(name, "self-closing", keys);
	};
	
	self.getString = function(){
	
		var output = buffer;
		
		self.reset();
		
		return output;
	
	};
	
};