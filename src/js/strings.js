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

var strings = (function(){

	var my = {};

	my.getFileTypeFromFilename = function(filename){

		var pos_of_dot = filename.lastIndexOf(".");
		
		var file_type = filename.slice(pos_of_dot+1,filename.length).toLowerCase();
		
		//because it sometimes happens that there is some crazy stuff in string that should be removed
		file_type = my.removeAllCharactersFromStringExcept(file_type, "abcdefghijklmnopqrstuvwxyz0123456789");
		
		return file_type;

	}


	my.getFilenameFromFilePath = function(path){

		if (path.indexOf("\\") != -1){
			return my.getFilenameFromWindowsFilePath(path);
		}
		
		else {
			return my.getFilenameFromUNIXFilePath(path);
		}

	}


	my.getFilenameFromUNIXFilePath = function(path){

		var pos_of_slash = path.lastIndexOf("/");
		
		if (pos_of_slash == -1){
			return path;
		}
		
		return path.substring(pos_of_slash + 1);

	}


	my.getFilenameFromWindowsFilePath = function(path){

		var pos_of_slash = path.lastIndexOf("\\");
		
		if (pos_of_slash == -1){
			return path;
		}
		
		return path.substring(pos_of_slash+1);

	}


	my.getDirectoryFromFilePath = function(path){

		if (path.indexOf("\\") != -1){
			return my.getDirectoryFromWindowsFilePath(path);
		}
		
		else {
			return my.getDirectoryFromUNIXFilePath(path);
		}

	}


	my.getDirectoryFromUNIXFilePath = function(path){

		var pos_of_slash = path.lastIndexOf("/");
		
		if (pos_of_slash == -1){
			return undefined;
		}
		
		return path.substring(0, pos_of_slash+1);

	}


	my.getDirectoryFromWindowsFilePath = function(path){

		var pos_of_slash = path.lastIndexOf("\\");
		
		if (pos_of_slash == -1){
			return undefined;
		}
		
		return path.substring(0, pos_of_slash+1);

	}


	my.linesToArray = function(string){
		
		var array = string.split("\n");
		
		for (var i = 0; i < array.length; i++){
		
			array[i] = removeCharactersFromString(array[i], "\r");
		
		}
		
		return array;

	};


	my.randomString = function(length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
		return result;
	}


	my.replaceAccentBearingLettersWithASCISubstitute = function(string){

		var text = string;
		
		if (typeof text != "string"){
		
			console.error("replaceAccentBearingLetters: Argument is not of type 'string'");
		
		}
		
		//A
		text = text.replace(/á/g,"a").replace(/à/g,"a").replace(/Á/g,"A").replace(/À/g,"A").replace(/ä/g,"ae").replace(/Ä/g,"Ae");
		
		//C
		text = text.replace(/Ç/g,"C").replace(/Ĉ/g,"C").replace(/ĉ/g,"c").replace(/ć/g,"c").replace(/č/g,"c").replace(/Ć/g,"C").replace(/Č/g,"C")
		.replace(/ï/g,"c").replace(/Ï/g,"C").replace(/ċ/g,"c").replace(/Ċ/g,"C");
		
		//E
		text = text.replace(/é/g,"e").replace(/è/g,"e").replace(/É/g,"E").replace(/È/g,"E").replace(/Ê/g,"E").replace(/ê/g,"e");
		
		//I
		text = text.replace(/î/g,"i").replace(/Î/g,"I").replace(/í/g,"i").replace(/ì/g,"i").replace(/Í/g,"I").replace(/Ì/g,"I")
		.replace(/ï/g,"i").replace(/Ï/g,"I");
		
		//O
		text = text.replace(/ö/g,"oe").replace(/Ö/g,"Oe").replace(/ó/g,"o").replace(/ò/g,"o").replace(/Ó/g,"O").replace(/Ò/g,"O")
		.replace(/Ô/g,"O").replace(/ô/g,"o").replace(/õ/g,"o");
		
		//U
		text.replace(/Ü/g,"Ue").replace(/ü/g,"ue").replace(/Û/g,"U").replace(/û/g,"u");
		
		//Y
		text.replace(/ÿ/g,"y").replace(/Ý/g,"Y");
		
		//ß
		text = text.replace(/ß/g,"ss").replace(/\s+/g, '_');

		return text;
	}


	my.removeCharactersFromString = function (string, char_string){
		var character;
		var pos;
		
		for (var c = 0; c < char_string.length; c++){

			character = char_string[c];
		
			while (string.indexOf(character) != -1){
			
				pos = string.indexOf(character);
			
				string = string.slice(0, pos) + string.slice(pos+1, string.length);
			
			}

		}
		
		return string;
		
	};


	my.removeAllCharactersFromStringExcept = function(string, valid_chars){

		var character;
		var pos;
		
		for (var c = 0; c < string.length;){

			character = string[c];
		
			if (valid_chars.indexOf(character) == -1){
			
				pos = string.indexOf(character);
			
				string = string.slice(0, pos) + string.slice(pos+1, string.length);
			
			}
			
			else {
			
				c++;
			
			}

		}
		
		return string;	



	}


	my.replaceCharactersInStringWithSubstitute = function (string, char_string, substitute){

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


	my.isSubstringAStartOfAWordInString = function(string, substring){
		
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


	my.removeEndingFromFilename = function(filename){

		var pos_of_dot = filename.lastIndexOf(".");
		
		return filename.slice(0,pos_of_dot);

	}


	my.bytesToSize = function(bytes, precision){
	  
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
		
	};


	my.areOnlyTheseCharsInString = function(string, chars){

		for (var i=0; i<string.length; i++){

			if (chars.indexOf(string[i]) == -1){
				return false;
			}
			
		}

		return true;

	};
	
	
	return my;
	
}());