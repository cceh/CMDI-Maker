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


eldp_environment.eldp_generator = function(){
"use strict";
	
	var resources = eldp_environment.workflow[0];
	var person = eldp_environment.workflow[1];
	var bundle = eldp_environment.workflow[2];


	var create_bundle = function(bundle){
		
		xml.reset();  //we're starting a new xml file here, so tabula rasa!
		xml.setElementPrefix("cmd");

		var return_string = "";
		return_string += xml.header;		
		
		return_string += xml.open("CMD",[
			["xmlns:cmd","http://www.clarin.eu/cmd/"],
			["xmlns:dcr","http://www.isocat.org/ns/dcr"],
			["xmlns:ann","http://www.clarin.eu"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["xsi:schemaLocation","http://www.clarin.eu/cmd/ file:/C:/Users/Jan/Desktop/Arbeit/ELDP.xsd"],
			["CMDVersion", "1.1"]
		]);
		

		//CMDI Header
		return_string += xml.open("Header");
		return_string += xml.close("Header");
		
		//return_string+=insert_header(get("metadata_creator"),today()+"+01:00",imdi_session_profile);
		
		return_string += xml.open("ELDP-Bundle")
		
		return_string += xml.element("Name", bundle.bundle.name);
		return_string += xml.element("Title", bundle.bundle.title);
		return_string += xml.element("Date", bundle.bundle.date.year + "-" + bundle.bundle.date.month + "-" + bundle.bundle.date.day);
		return_string += xml.element("Description", bundle.bundle.description);
		
		return_string += xml.open("Location");
		return_string += xml.element("Continent", bundle.bundle.location.continent);
		return_string += xml.element("Country", bundle.bundle.location.country);
		return_string += xml.element("Region", bundle.bundle.location.region);
		return_string += xml.element("Address", bundle.bundle.location.address);
		return_string += xml.close("Location")
		
		return_string += xml.open("Persons");
		return_string += insert_persons(bundle.persons.persons);
		return_string += xml.close("Persons");
		
		return_string += xml.close("ELDP-Bundle");
		
		return return_string;
		
	};
	
	var insert_person_languages = function(languages){
	
		return_string = "";
	
		forEach(languages, function(lang){
		
			return_string += xml.open("Language");
			return_string += xml.element("ID", lang.LanguageObject[0]);
			return_string += xml.element("Name", lang.LanguageObject[3]);
			return_string += xml.close("Language");
		
		});
		
		return return_string;
	
	
	};
	
	
	var insert_persons = function(person_in_bundles){
	
		var return_string = "";
		
		forEach(person_in_bundles, function(person_in_bundle){
			var pers = person.getPersonByID(person_in_bundle.id);
			
			return_string += xml.open("Person")
			return_string += xml.element("Title", pers.title);
			return_string += xml.element("Role", person_in_bundle.role);
			return_string += xml.element("Forenames", pers.forenames);
			return_string += xml.element("Surname", pers.surname);
			return_string += xml.open("Languages");
			return_string += insert_person_languages(pers.languages);
			return_string += xml.close("Languages");
			return_string += xml.close("Person");
		
		});
	
		return return_string;
	
	
	}

	
	var insert_content_languages = function (session_id) {

		var return_string = "";
		
		var languages = corpus.content_languages.content_languages;
	
		for (var l=0;l<languages.length;l++){  //for all content languages // no session separate languages yet
	
			return_string += xml.open("Content_Language");
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+languages[l][0]);
			return_string += xml.element("Name",languages[l][3]);
			return_string += xml.close("Content_Language");
	
		}

		return return_string;
		
	};
	

	var insert_resource = function(link,size){

		var return_string = "";
		
		return_string += xml.open("WrittenResource");

		return_string += xml.element("ResourceLink",link);
		return_string += xml.element("MediaResourceLink","");

		return_string += xml.element("Date","Unspecified");
		//no input yet, but should come soon
		
		return_string += xml.element("Type",resources.getFileType(link).type);
		return_string += xml.element("SubType",resources.getFileType(link).type);
		return_string += xml.element("Format",resources.getFileType(link).mimetype);
		return_string += xml.element("Size",size);
		
		return_string += xml.open("Validation");
		return_string += xml.element("Type","");
		return_string += xml.element("Methodology","");
		return_string += xml.element("Level","Unspecified");
		return_string += xml.element("Description","");
		return_string += xml.close("Validation");

		return_string += xml.element("Derivation","");

		return_string += xml.element("CharacterEncoding","");
		return_string += xml.element("ContentEncoding","");
		return_string += xml.element("LanguageId","");
		return_string += xml.element("Anonymized","Unspecified");

		return_string += xml.open("Access");
	  
		return_string += xml.tag("Availability",2);
		return_string += xml.tag("Date",2);
		return_string += xml.tag("Owner",2);
		return_string += xml.tag("Publisher",2);
		
		return_string += xml.tag("Contact",0);
		return_string += xml.tag("Name",2);
		return_string += xml.tag("Address",2);
		return_string += xml.tag("Email",2);
		return_string += xml.tag("Organisation",2);
		return_string += xml.tag("Contact",1);

		return_string += xml.element("Description","");

		return_string += xml.tag("Access",1);

		return_string += xml.element("Description","");
		return_string += xml.element("Keys","");
		return_string += xml.tag("WrittenResource",1);

		return return_string;
		
	};


	var insert_actor = function(session_id,actor_id){

		var i = actor.getActorsIndexFromID(actor_id);
		var ac = actor.actors[i];

		var return_string = "";
		return_string+=xml.tag("Actor",0);
		return_string+=xml.element("Role",ac.role);
		return_string+=xml.element("Name",ac.name);
		return_string+=xml.element("FullName",ac.full_name);
		return_string+=xml.element("Code",ac.code);
		return_string+=xml.element("FamilySocialRole",ac.family_social_role);
		return_string+=xml.element("EthnicGroup",ac.ethnic_group);   
		
		//Age field
		return_string += xml.tag("Age",0);
		return_string += actor.getAge(session_id,actor_id);
		return_string += xml.tag("Age",1);	
		//End of age field
		
		if ((ac.birth_date.year != "") && (ac.birth_date.year != "YYYY")){
		
			return_string += xml.element("BirthDate",ac.birth_date.year+"-"+ac.birth_date.month+"-"+ac.birth_date.day);
			
		}
		
		else {
		
			return_string += xml.element("BirthDate","Unspecified");
		
		}
		
		return_string+=xml.element("Sex",ac.sex);
		return_string+=xml.element("Education",(ac.education != "") ? ac.education : "Unspecified" );
		return_string+=xml.element("Anonymized",(ac.anonymized) ? "true" : "false"); 
		
		return_string+=xml.tag("Contact",0);
		return_string+=xml.element("Name",ac.contact.name);   
		return_string+=xml.element("Address",ac.contact.address);   
		return_string+=xml.element("Email",ac.contact.email);   
		return_string+=xml.element("Organisation",ac.contact.organisation);   
		return_string+=xml.tag("Contact",1);

		return_string += xml.tag("Keys",2);
		
		return_string += xml.tag("descriptions",0);
		return_string += xml.element("Description",ac.description);
		return_string += xml.tag("descriptions",1);	
		
		return_string += xml.tag("Actor_Languages",0);
		//return_string += xml.element("Description","");
		
		for (var l=0; l<ac.languages.length; l++){
		
			return_string += xml.tag("Actor_Language",0);
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+ac.languages[l].iso_code);
			return_string += xml.element("Name",ac.languages[l].name);
			
			return_string += xml.element("MotherTongue",(ac.languages[l].MotherTongue) ? "true" : "false");
			return_string += xml.element("PrimaryLanguage",(ac.languages[l].PrimaryLanguage) ? "true" : "false");		

			
			return_string += xml.tag("Actor_Language",1);
		
		}

		return_string += xml.tag("Actor_Languages",1);
		
		return_string+=xml.tag("Actor",1);
	  
		return return_string;
		
	}
	
	var my = {};
	
	my.bundles = map(bundle.bundles, function (bundle){
		xml.reset();
		return create_bundle(bundle);
	});

	return my;

}