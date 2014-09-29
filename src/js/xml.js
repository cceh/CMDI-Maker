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
	
	
var xml = (function () {

	var element_prefix;

	var createTag = function(name, mode, attributes){
		
		return_string = "<";
		
		//if it's a closing tag, add closing slash at the beginning
		if (mode==1){
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
		if ((mode === 0) || (mode == 2)){
			return_string += addAttributes(attributes, name.length);
		}
		
		if (mode==2){
			return_string+="/";
		}
	
		return_string+=">";
		
		return return_string;

	};
	
	
	var addAttributes = function(attributes, length_of_element_name){
		
		var return_string = "";
		
		for (var i=0;i<attributes.length;i++){
			
			/*
			when this is not the first and only attribute to add,
			start a new line and begin in the column where the attribute above began
			that means after my.tab, <, length_of_element_name and
			the space between element_name and the first attribute
			*/
			if (i !== 0){
				return_string+="\n";
				return_string += addTabs(my.tab);
               
				for (var j=0;j<length_of_element_name;j++){
					return_string+=" ";
				}
				
				return_string += "  ";
				
			}
			
			/*when this is the first attribute to add, just make a space and start*/
			if (i === 0){
				return_string+=" ";
			}
			
			//attribute key
			return_string += attributes[i][0];
			
			return_string += "=";
			
			//attribute value in quotation marks
			return_string += "\"";
			return_string += attributes[i][1];
			return_string += "\"";
			
		}
		
		return return_string;
	
	
	};
	
	
	var addTabs = function(number){
		return_string = "";
		
		for (var x=0;x<number;x++){
			return_string += "   ";
		}
		
		return return_string;
	};

	
	var my = {};
	my.header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";

	my.last_mode = -1;
	my.tab = 0;
	
	my.reset = function(){
	
		my.last_mode = -1;
		my.tab = 0;
		my.element_prefix = undefined;
	
	};
	
	
	my.setElementPrefix = function(string){
		
		if ((typeof string == "string") && (string !== "")){
			element_prefix = string;
		}
		
		else {
			element_prefix = undefined;
		}
	
	};
	

	my.tag = function(name,mode,keys){   //keys as array
		//mode 0 = opening tag
		//mode 1 = closing tag
		//mode 2 = self-closing tag
		
		if (!keys){
			keys = [];
		}
    
		var return_string = "";
    
		if (mode == 1){
			my.tab -= 1;
		}
		
		//if this is NOT a closing tag just after an opening tag, 
		//AND if this is not the beginning of all, then start a new line
		if ((!(mode == 1 && my.last_mode === 0)) && my.last_mode != -1){
			return_string += "\n";
			return_string += addTabs(my.tab);
		}
		
		return_string += createTag(name, mode, keys);
		
		if (mode === 0){
			my.tab += 1;
		}
	
		my.last_mode = mode;
		
		return return_string;
		
	};
	
	
	my.element = function (name,value,keys){
		
		var return_string = "";
		
		//when there is a value, there must be opening and closing tags
		if (value !== ""){
		
			return_string += my.open(name, keys);
			return_string += value;
			return_string += my.close(name);
		
		}
	
		else {
			return_string+=my.tag(name,2,keys);
		}
		
		return return_string;
		
	};
	
	my.open = function(name, keys){
		return my.tag(name, 0, keys);
	};
	
	my.close = function(name){
		return my.tag(name, 1);
	};
	
	return my;
	
}());