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


var ObjectList = function() {
	"use strict";

	//PRIVATE
	
	var list = [];
	var id_counter = 0;
	
	var getNewID = function(){
	
		//this is the id, always unique
		var id = id_counter;
		
		id_counter += 1;
		
		return id;		
	
	};
	
	
	var cloneObject = function(obj) {
		var clone = {};

		for (var i in obj) {
			if (obj[i] && typeof obj[i] == 'object') {
				clone[i] = cloneObj(obj[i]);
			} else {
				clone[i] = obj[i];
			}
		}

		return clone;
	};
	
	
	//PUBLIC
	
	var self = this;
	
	this.length = 0;
	
	
	//GET METHODS
	
	this.getByIndex = function(index){
	
		return list[index];
	
	};
	
	
	this.getByID = function(id){
	
		for (var i=0; i < list.length; i++){
			
			if (list[i].id == id){
				return list[i];
			}
		}
		
		return undefined;

	};


	this.get = this.getByIndex;
	
	
	this.getFirst = function(){
	
		if (list.length > 0){
			
			return list[0];
			
		}
	
	}
	
	
	this.getLast = function(){
	
		if (list.length > 0){
			
			return list[list.length - 1];
			
		}
	
	}
	
	
	this.getFromEnd = function(backwards_index){
	
		if (backwards_index < list.length){
		
			return list[list.length - 1 - backwards_index];
			
		}
	
	}

	
	this.getAll = function(){
	
		return list;
	
	};
	
	
	//this.getByStatement
	
	
	this.getIndexByID = function(id){
	
		for (var i=0; i < list.length; i++){
			
			if (list[i].id == id){
				return i;
			}
		}
		
		return undefined;

	};
	
	
	this.getArrayWithIDs = function(array){

		return getArrayWithValuesByKey(array, "id");

	};
	
	
	this.idOf = function(index){
	
		return list[index].id;
		
	}
	
	
	//REMOVE METHODS
	this.removeByID = function(id){
	
		list.splice(self.getIndexByID(id),1);
		
		self.length = list.length;
	
	};
	
	
	this.removeByIndex = function(index){
	
		list.splice(index, 1);
		
		self.length = list.length;
	
	};
	
	
	this.remove = this.removeByIndex;
	this.erase = this.removeByIndex;
	
	
	this.removeFirst = function(){
	
		self.removeByIndex(0);
	
	};
	
	
	this.removeLast = function(){
	
		if (list.length > 0){
		
			self.remove(list[list.length - 1].id);

		}
	
	};
	
	
	this.removeAll = function(){
	
		list = [];
		
		self.length = list.length;
		
	};
	
	
	this.eraseAll = this.removeAll;
	
	
	//ADD  (add with new id)
	this.add = function(object){
	
		var id = getNewID();
		
		object.id = id;
		
		list.push(object);
		
		self.length = list.length;
		
		return id;
	
	};
	
	
	//DUPLICATE
	this.duplicateByID = function(id){
	
		var clone = cloneObject(self.getByID(id));
		
		self.add(clone);
	
	};
	
	
	this.duplicateByIndex = function(index){
	
		var clone = cloneObject(self.getByIndex(index));
		
		self.add(clone);
	
	};
	
	
	this.duplicate = this.duplicateByID;
	
	
	//this.duplicateKey //duplicates a subobject by key in another list item
	//this.duplicateKeyInAllItems
	
	
	//UTILS
	this.forEach = function(action){
	
		list.forEach(action);
	
	};
	
	
	this.map = function(transform) {
	
		var mapped = [];
		
		for (var i = 0; i < list.length; i++){
			mapped.push(transform(list[i]));
		}
		
		return mapped;
		
	};
	
	
	this.filter = function(test) {
		
		var passed = [];
		
		for (var i = 0; i < list.length; i++) {
			
			if (test(list[i])){
			
				passed.push(list[i]);
			
			}
			
		}
		
		return passed;
		
	};
	
	
	this.reset = function(){
	
		list = [];
		id_counter = 0;
		self.length = list.length;
	
	};
	
	
	this.setState = function(state){
	
		id_counter = state.id_counter;
		list = state.list;
		self.length = list.length;
	
	};	
	
	
	this.getState = function(){
	
		var state = {
			id_counter: id_counter,
			list: list
		};
		
		return state;
	
	};
	
	
	//SORT METHODS
	this.sortByKey = function(key) {

		return list.sort(function(a, b) {
			var x = a[key];
			var y = b[key];

			if (typeof x == "string"){
				x = x.toLowerCase(); 
				y = y.toLowerCase();
			}

			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	
	};
	
	
	this.sortBySubKey = function(key0, key1){

		return list.sort(function(a, b) {
			var x = a[key0][key1];
			var y = b[key0][key1];

			if (typeof x == "string"){
				x = x.toLowerCase(); 
				y = y.toLowerCase();
			}

			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});


	};


	//this.sortByID
	



	/*
	var getArrayWithValuesByKey = function(array, key){

		var new_array = map(array, function(item){
			return item[key];
		});

		return new_array;

	}
	*/

};

