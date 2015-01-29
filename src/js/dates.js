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


var dates = (function() {

	var my = {};
	
	
	my.today = function(){

		var now = new Date();

		var day = now.getDate();	
		if (day < 10) {day = "0" + day;}
		
		var month = now.getMonth();
		month += 1;  //as months begin with 0 here
		if (month < 10) {month = "0" + month;}


		var today_date = now.getFullYear() + "-" + month + "-" + day;

		return today_date;
		
	};
	
	
	//parameters must be strings
	my.calcAgeAtDate = function(dateString, birthDateString) {
		
		var date = +new Date(dateString);
		var birthday = +new Date(birthDateString);
		return ~~((date - birthday) / (31557600000));
		
	};
	
	
	my.getTimezoneOffsetInHours = function(){
	
		function pad(number, length){
			var str = "" + number
			while (str.length < length) {
			str = '0'+str
			}
			return str;
		}

		var offset = new Date().getTimezoneOffset()
		offset = ((offset<0? '+':'-')+ // Note the reversed sign!
			pad(parseInt(Math.abs(offset/60)), 2) +
			":" +   //the colon is there because arbil does it too. normally, timezone offsets are like +0100 or -0600
			pad(Math.abs(offset%60), 2));
			
		return offset;
		
	};
	
	
	my.getDateStringByDateInput = function(element_prefix){
	
		var date_object = {};
	
		date_object.year = g(element_prefix + "_year").value;
		date_object.month = g(element_prefix + "_month").value;	
		date_object.day = g(element_prefix + "_day").value;

		return my.getDateStringByDateObject(date_object);
		
	};
	
	
	my.getDateStringByDateObject = function(date_object){
	
		if (!date_object || !date_object.month || !date_object.day){
			console.error("date object is not valid");
			return undefined;
		}
		
		
		var valid_chars = "0123456789";
	
		//when we get a date object with strings instead of integers, then we must validate them
		
		if (typeof date_object.year == "string" && (date_object.year.length != 4 || !strings.areOnlyTheseCharsInString(date_object.year, valid_chars))){
			return undefined;
		}

		if (typeof date_object.month == "string" && (date_object.month.length != 2 || !strings.areOnlyTheseCharsInString(date_object.month, valid_chars))){
			return undefined;
		}

		if (typeof date_object.day == "string" && (date_object.day.length != 2 || !strings.areOnlyTheseCharsInString(date_object.day, valid_chars))){
			return undefined;
		}
		
	
		return date_object.year + "-" + date_object.month + "-" + date_object.day;	
	
	};
	
	
	my.isUserDefinedDateInvalid = function(element_prefix_or_date_object){
		
		var year, month, day;
		var typeOfDate;
		
		if (typeof element_prefix_or_date_object == "string"){
			var element_prefix = element_prefix_or_date_object;
			
			year = get(element_prefix + "_year");
			month = get(element_prefix + "_month");
			day = get(element_prefix + "_day");
			
			typeOfDate = typeof my.getDateStringByDateInput(element_prefix);
		}
		
		else {
			var date_object = element_prefix_or_date_object;
			
			year = date_object.year;
			month = date_object.month;
			day = date_object.day;
			
			typeOfDate = typeof my.getDateStringByDateObject(date_object);
		}
	
	
		if (typeOfDate == "undefined" && (year != "YYYY" || month != "MM" || day != "DD" )) {
		
			return true;
			
		}
		
		else {
		
			return false;
		
		}
	
	};
	
	
	my.parseDate = function(str){
	
		var date;

		if (typeof str == "undefined"){
			return null;
		}

		var t = str.match(/([1-2][0-9][0-9][0-9])\-([0-1][0-9])\-([0-3][0-9])/);
		
		if(t!==null){
			
			var y=+t[1], m=+t[2], d=+t[3];
			date = new Date(y,m-1,d);
			
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
			date = new Date(parts[2], parts[1]-1, parts[0]);
			
			if(date.getFullYear()==parts[2] && date.getMonth()==parts[1]-1){
			
				return {
				
					year: parts[2],
					month: parts[1],
					day: parts[0]
					
				
				};   
			}		
			
		}
		
		return null;
		
	}


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

	
	my.dateAsString = function(date){

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
	
	
	return my;
	
	
})();

