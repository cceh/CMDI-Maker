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

	var self = this;
	
	//PRIVATE
	
	var list = [];
	var id_counter = 0;
	
	//value is id of the object the pointer points to
	var pointer = -1;
	
	var getNewID = function(){
	
		//this is the id, always unique
		var id = id_counter;
		
		id_counter += 1;
		
		return id;		
	
	};
	
	
	var cloneObject = function(obj) {
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
	};
	
	
	var checkPointerValidity = function(){
	
		if (!self.IDexists(pointer) && self.length > 0){
		
			//take the id of the first person if invalid pointer
			pointer = self.IDof(0);
		
		}
		
		if (self.length === 0){
		
			pointer = -1;
		
		}
	
	};
	
	
	//PUBLIC
	
	this.length = 0;
	
	
	this.IDexists = function(id){
	
		for (var i = 0; i < list.length; i++){
		
			if (list[i].id == id){
				return true;
			}
		
		}
		
		return false;
	
	};
	this.existsByID = this.IDexists;
	
	
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
	
	};
	
	
	this.getLast = function(){
	
		if (list.length > 0){
			
			return list[list.length - 1];
			
		}
	
	};
	
	
	this.getFromEnd = function(backwards_index){
	
		if (backwards_index < list.length){
		
			return list[list.length - 1 - backwards_index];
			
		}
	
	};

	
	this.getAll = function(){
	
		return list;
	
	};
	
	
	this.getByKeyValue = function(key, value){
	
		for (var i=0; i < list.length; i++){
			
			if (list[i][key] == value){
				return list[i];
			}
		}
		
		return undefined;		
	
	};
	
	
	this.getIndexByID = function(id){
	
		for (var i=0; i < list.length; i++){
			
			if (list[i].id == id){
				return i;
			}
		}
		
		return undefined;

	};
	this.indexOf = this.getIndexByID;
	
	
	this.getArrayWithValuesByKey = function(key){

		var new_array = map(list, function(item){
			return item[key];
		});

		return new_array;

	};
	
	
	this.getArrayWithIDs = function(){

		return self.getArrayWithValuesByKey("id");

	};
	
	
	this.idOf = function(index){
	
		return list[index].id;
		
	};
	this.IDof = this.idOf;
	
	
	//REMOVE METHODS
	this.removeByID = function(id){
		
		if (Array.isArray(id) === true){
		
			forEach(id, self.removeByID);
			return;
		
		}

		var index = self.getIndexByID(id);
	
		list.splice(index, 1);
		
		self.length = list.length;
		
		checkPointerValidity();
	
	};
	
	this.eraseByID = this.removeByID;
	
	
	this.removeByIndex = function(index){
	
		list.splice(index, 1);
		
		self.length = list.length;
		
		checkPointerValidity();
	
	};
	
	
	this.remove = this.removeByIndex;
	this.erase = this.removeByIndex;
	
	
	this.removeFirst = function(){
	
		self.removeByIndex(0);
	
	};
	
	
	this.removeLast = function(){
	
		if (list.length > 0){
		
			self.removeByID(list[list.length - 1].id);

		}
	
	};
	
	
	this.removeAll = function(){
	
		list = [];
		
		self.length = list.length;
		
		pointer = -1;
		
	};
	
	
	this.removeActive = function(){
	
		self.removeByID(pointer);
	
	};
	
	
	this.eraseAll = this.removeAll;
	
	
	//ADD  (add with new id)
	this.add = function(object){
	
		var id = getNewID();
		
		object.id = id;
		
		list.push(object);
		
		self.length = list.length;
		
		checkPointerValidity();
		
		return id;
	
	};
	
	
	this.replaceByID = function(id, object){

		var index = self.getIndexByID(id);

		if (typeof index == "undefined"){
			return;
		}
		
		//set old id to object
		object.id = id;
	
		list.splice(index, 1, object);
		
	};
	this.replace = this.replaceByID;
	
	
	this.replaceActive = function(object){
	
		self.replaceByID(pointer, object);
	
	};
	
	
	//DUPLICATE
	this.duplicateByID = function(id){
	
		var clone = cloneObject(self.getByID(id));
		
		self.add(clone);
	
	};
	
	this.duplicate = this.duplicateByID;
	
	this.duplicateByIndex = function(index){
	
		var clone = cloneObject(self.getByIndex(index));
		
		self.add(clone);
	
	};
	
	
	this.duplicateActive = function(){
	
		self.duplicateByID(pointer);
	
	};
	
	
	
	//this.duplicateKey //duplicates a subobject by key in another list item
	//this.duplicateKeyInAllItems
	
	
	//UTILS
	this.forEach = function(action){
	
		for (var i = 0; i < list.length; i++){
		
			action(list[i], i);
	
		}
		
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
		pointer = -1;
		self.length = list.length;
	
	};
	
	
	this.setState = function(state){
	
		if ((!state) || (!state.list) || (typeof state.list != "object")){
			console.error("Error setState: Invalid data!");
			console.info("typeof state.list = " + typeof state.list);
			return;
		}
	
		id_counter = state.id_counter;
		list = state.list;
		self.length = list.length;
		
		pointer = state.pointer;
	
	};	
	
	
	this.getState = function(){
	
		var state = {
			id_counter: id_counter,
			list: list,
			pointer: pointer,
			info: "ObjectList state"
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
	
	
	this.isThereAnyItemWhereKeyIsValue = function(key, value){
	
		for (var i = 0; i < list.length; i++){
			if (self.get(i)[key] == value){
				return true;
			}
		}
		
		return false;	
	
	};
	
	
	this.isThereAnyItemWhereKeyIsNotValue = function(key, value){
	
		for (var i = 0; i < list.length; i++){
			if (self.get(i)[key] != value){
				return true;
			}
		}
		
		return false;	
	
	};
	
	
	this.isKeyValueInEveryItem = function(key, value){
	
		return (!(self.isThereAnyItemWhereKeyIsNotValue(key, value)));
	
	};
	
	
	this.isThereAnyItemWhereSubKeyIsValue = function(key, subkey, value){
	
		for (var i = 0; i < list.length; i++){
			if (self.get(i)[key][subkey] == value){
				return true;
			}
		}
		
		return false;	
	
	};
	
	
	this.isThereAnyItemWhereSubKeyIsNotValue = function(key, subkey, value){
	
		for (var i = 0; i < list.length; i++){
			if (self.get(i)[key][subkey] != value){
				return true;
			}
		}
		
		return false;	
	
	};


	//this.sortByID
	
	
	
	//POINTER METHODS
	this.setPointer = function(id){
	
		if (self.IDexists(id)){
			pointer = id;
		}
	
	};
	
	
	this.setPointerByIndex = function(index){
	
		if (list[index]){
			self.setPointer(list[index].id);
		}
	
	};
	
	
	this.getPointer = function(){
	
		return pointer;
		
	};
	
	
	this.getIndexOfActiveObject = function(){
		
		return self.getIndexByID(pointer);
	
	};
	
	this.getActiveIndex = this.getIndexOfActiveObject;
	
	
	this.getActiveObject = function(){
	
		return self.getByID(pointer);
	
	};
	
	this.getActive = this.getActiveObject;
	
	
	this.activeItemExists = function(){
	
		if (pointer != -1){
			return true;
		}
		
		else {
			return false;
		}
	
	};
	

	/////
	this.mapIndexesToIDs = function(array){
	
		var IDs = array.map(function(item){
		
			return list[item].id;
		
		});
		
		return IDs;
	
	};
	
	
	this.setForAll = function(key, value){
	
		list.forEach(function(item){
		
			item[key] = value;
		
		});
	
	};


	/*
	var getArrayWithValuesByKey = function(array, key){

		var new_array = map(array, function(item){
			return item[key];
		});

		return new_array;

	}
	*/

};

