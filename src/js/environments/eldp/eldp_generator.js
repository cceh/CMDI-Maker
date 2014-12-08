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


eldp_environment.eldp_generator = function(data){
"use strict";


	//var eldp_bundle_profile="clarin.eu:cr1:p_1271859438204";
	var eldp_bundle_profile="clarin.eu:cr1:p_1407745711992";
	var language_code_prefix = "ISO639-3:";
	
	
	var IDREFS = [];
	
	var createIDREFS = function(){

		var rString1 = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString2 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString3 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString4 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString5 = randomString(12, '0123456789abcdefghijklmnopqrstuvwxyz');

		return "res_"+rString1+"_"+rString2+"_"+rString3+"_"+rString4+"_"+rString5;

	};

	var insert_cmdi_header = function(MdCreator,MdCreationDate,MdProfile){
		
		var rs = "";
		rs+=xml.tag("Header",0);
		rs+=xml.element("MdCreator",MdCreator);
		rs+=xml.element("MdCreationDate",MdCreationDate);
		rs+=xml.element("MdProfile",MdProfile);
		rs+=xml.tag("Header",1);
		
		return rs;
		
	};
	
	
	var getXMLLangAttribute = function(){
	
		return ["xml:lang", get("metadata_language_select")];
	
	};
	
	
	var insertLanguages = function(langs){
	
		var rs = "";
		
		rs += xml.open("ContentLanguages");
		
		forEach(langs, function(lang){
		
			rs += xml.open("ContentLanguage");
			rs += xml.element("Name", lang.name);
			rs += xml.element("Code", language_code_prefix + lang.code);
			
			if (lang.content_language === true){
				rs += xml.element("Use", "Content");
			}
			
			else {
				rs += xml.element("Use", "Working");
			}
			
			rs += xml.close("ContentLanguage");		
		
		});
		
		rs += xml.close("ContentLanguages");
		
		return rs;
	
	};
	
	
	var createBundle = function(bundle, persons, resources){
		
		xml.reset();  //we're starting a new xml file here, so tabula rasa!
		//xml.setElementPrefix("cmd");

		var rs = ""; //return string
		rs += xml.header;	
		
		rs += xml.open("CMD",[
			["xmlns", "http://www.clarin.eu/cmd/"],
			["xmlns:cmd","http://www.clarin.eu/cmd/"],
			["xmlns:dcr","http://www.isocat.org/ns/dcr"],
			["xmlns:ann","http://www.clarin.eu"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["xsi:schemaLocation","http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/" + eldp_bundle_profile + "/xsd"],
			["CMDVersion", "1.1"]
		]);
		

		//CMDI Header
		rs += insert_cmdi_header(get("metadata_creator"),today()+"+01:00",eldp_bundle_profile);
		
		
		//in resources is nothing, as this is a session and no corpus. attached media files in a cmdi session are further down
		rs += xml.open("Resources");
		
		
		if (bundle.resources.resources.length > 0){
		
			rs += xml.open("ResourceProxyList");
			
			for (var i = 0; i < bundle.resources.resources.length; i++){  
			
				IDREFS.push(createIDREFS());
				
				rs += xml.open("ResourceProxy", [["id",IDREFS[i]]]);
				rs += xml.element("ResourceType", "Resource");  //MIMETYPE AS ATTRIBUTE!
				console.log(resources);
				rs += xml.element("ResourceRef", resources.getByID(bundle.resources.resources[i].resource_id).name);
				rs += xml.close("ResourceProxy");
			}
			
			rs += xml.close("ResourceProxyList");
		}
		
		else {
			rs += xml.element("ResourceProxyList",2);
		}
		
		
		rs += xml.tag("JournalFileProxyList",2);
		rs += xml.tag("ResourceRelationList",2);
		rs += xml.close("Resources");
		
		rs += xml.open("Components");
		
		
		rs += xml.open("ELDP_Bundle");

		rs += xml.element("Title", bundle.bundle.title);		
		rs += xml.element("ID", bundle.bundle.id_element);
		rs += xml.element("Description", bundle.bundle.description, [getXMLLangAttribute()]);
		
		rs += xml.open("StatusInfo");
		rs += xml.element("Status", "in-progress");  //no input
		rs += xml.element("ChangeDate", today());
		rs += xml.close("StatusInfo");
		
		//No depositor input
		rs += insertDummyDepositor();

		
		rs += insertLanguages(bundle.languages.bundle_languages);
		rs += insertGenres(bundle.content.genre);
		rs += insertKeywords(bundle.content.keywords);
		rs += insertPersons(bundle.persons.persons, persons, bundle);

		rs += xml.open("ProjectLocations");
		
		rs += xml.open("ProjectLocation");
		rs += xml.element("Name", bundle.bundle.location.name);
		rs += xml.open("ProjectGeographic");
		rs += xml.element("Country", bundle.bundle.location.country);
		//rs += xml.element("Region", bundle.bundle.location.region);
		//rs += xml.element("Address", bundle.bundle.location.address);
		rs += xml.close("ProjectGeographic");
		rs += xml.close("ProjectLocation");
		
		rs += xml.close("ProjectLocations");

		rs += insertBundleResources(bundle.resources.resources, resources, bundle.languages.bundle_languages, bundle.persons.persons, persons, bundle);
		
		rs += xml.close("ELDP_Bundle");
		rs += xml.close("Components");
		rs += xml.close("CMD");
		
		return rs;
		
	};
	
	
	var insertGenres = function(genre){
	
		var rs = "";
		
		if (genre == ""){
			return "";
		}
		
		
		rs += xml.open("Genres");
		
		rs += xml.element("Genre", genre);
		
		rs += xml.close("Genres");
		
		return rs;
	
	
	};
	
	
	
	var insertDummyDepositor = function(){
	
		var rs = "";
	
		rs += xml.open("Depositors");
		rs += xml.open("Depositor");
		rs += xml.element("Role", "Depositor");  
		rs += xml.element("AdditionalInformation", "");
		rs += xml.open("PersonalData");
		rs += xml.open("Name");
		rs += xml.element("Name", "");
		rs += xml.close("Name");
		rs += xml.open("BiographicalData");
		/*rs += xml.element("BirthYear", "");*/
		rs += xml.close("BiographicalData");
		rs += xml.close("PersonalData");
		rs += xml.element("Gender", "");
		rs += xml.open("Languages");
		rs += xml.open("Language");
		rs += xml.element("Name", "");
		rs += xml.element("Autoglottonym", "");
		rs += xml.close("Language");
		rs += xml.close("Languages");
		rs += xml.close("Depositor");
		rs += xml.close("Depositors");
	
		return rs;	
	
	};
	
	
	var insertPersonLanguages = function(languages){
	
		var rs = "";
		
		if (languages.length == 0){
			return "";
		}
		
		
		rs += xml.open("Languages");
	
		forEach(languages, function(lang){
		
			rs += xml.open("Language");
			rs += xml.element("Name", lang.name);
			rs += xml.element("Code", language_code_prefix + lang.iso_code);
			rs += xml.element("Additional_Information", lang.additional_information);
			rs += xml.close("Language");
		
		});
		
		rs += xml.close("Languages");
		
		return rs;
	
	
	};
	
	/*
	
	!! AGE  = BUNDLE_DATE - PERSON BIRTH YEAR
	
	*/
	var insertPersons = function(person_in_bundles, persons, bundle){
	
		if (person_in_bundles.length === 0){
			return "";
		}
		
		var rs = "";
		
		rs += xml.open("Persons");
		
		forEach(person_in_bundles, function(person_in_bundle){
			var pers = persons.getByID(person_in_bundle.person_id);
			
			rs += xml.open("Person");
			
			rs += xml.element("PersonID", "");  //no input
			
			//cheap way to calculate person's age, as wished by ELDP
			if (bundle.bundle.date.year !== "" && bundle.bundle.date.year !== "YYYY"){
				rs += xml.element("Age_at_Time_of_Recording", bundle.bundle.date.year - pers.birth_year);
			}
			
			rs += xml.element("Role", person_in_bundle.role);
			
			rs += xml.element("AdditionalInformation", pers.person_additional_information);
			
			rs += xml.element("BiographicalNote", pers.biographical_note);
			
			var ethnicities = linesToArray(pers.ethnicity);
			var ethnicities_add_infos = linesToArray(pers.ethnicity_additional_info);
			
			if (ethnicities.length == ethnicities_add_infos.length && ethnicities.length != 0){
			
				//No wrapper element here!
			
				for (var i = 0; i < ethnicities.length; i++){
				
					rs += xml.open("Ethnicity");
					
					rs += xml.element("EthnicAffiliation", ethnicities[i]);
					rs += xml.element("AdditionalInformation", ethnicities_add_infos[i]);
					
					rs += xml.close("Ethnicity");				
				
				}
				
			}
			
			rs += xml.open("PersonalData");
			rs += xml.open("Name");
			
			rs += xml.element("Title", pers.title);
			
			if (pers.nameKnownAs !== ""){
				rs += xml.element("Name", pers.nameKnownAs, [["kind", "KnownAs"]]);
			}
			
			if (pers.fullName !== ""){
				rs += xml.element("Name", pers.fullName, [["kind", "FullName"]]);
			}
			
			if (pers.nameSortBy !== ""){
				rs += xml.element("Name", pers.nameSortBy, [["kind", "asSortBy"]]);
			}
			
			rs += xml.close("Name");
			
			rs += xml.open("BiographicalData");
			
			rs += xml.element("BirthYear", (pers.birth_year != "YYYY") ? pers.birth_year : "");
			
			if (pers.death_year != "YYYY" && pers.death_year != ""){
				rs += xml.element("DeathYear", pers.death_year);
			}
			
			
			rs += xml.close("BiographicalData");
			
			rs += xml.close("PersonalData");
			
			rs += xml.open("Gender");
			rs += xml.element("GenderIdentification", pers.sex);
			rs += xml.element("AdditionalInformation", "");  //No input!
			rs += xml.close("Gender");
			
			rs += xml.open("Education");
			rs += xml.element("Level", pers.education);
			rs += xml.element("AdditionalInformation", "");  //No input!
			rs += xml.close("Education");
			
			rs += insertPersonLanguages(pers.languages.actor_languages);

			
			var nationalities = linesToArray(pers.nationality);
			var nationalities_add_infos = linesToArray(pers.nationality_additional_info);
			
			if (nationalities.length == nationalities_add_infos.length && nationalities.length != 0){
			
				//No wrapper element here!
			
				for (var i = 0; i < nationalities.length; i++){
				
					rs += xml.open("Nationality");
					
					rs += xml.element("Name", nationalities[i]);
					rs += xml.element("AdditionalInformation", nationalities_add_infos[i]);
					
					rs += xml.close("Nationality");				
				
				}
				
			}
			
			rs += xml.close("Person");
		
		});

		rs += xml.close("Persons");	
		
		return rs;
	
	
	};
	

	var insertBundleResource = function(res_in_bun, resource, languages, persons_in_bundle, persons, bundle){

		var rs = "";
		
		console.log(res_in_bun);
		
		rs += xml.open("Resource");
		rs += xml.element("Title", resource.name);
		
		rs += xml.element("ID", "");
		rs += xml.element("Host", "");
		rs += xml.open("StatusInfo");
		rs += xml.element("Status", resource.status);
		
		rs += xml.element("ChangeDate", today());
		rs += xml.close("StatusInfo");
		
		
		//Depositor!
		rs += insertDummyDepositor();
		
		
		rs += insertLanguages(languages);
		rs += insertGenres(bundle.content.genre);
		rs += insertKeywords(bundle.content.keywords);
		rs += insertPersons(persons_in_bundle, persons, bundle);
		
		
		rs += xml.open("AccessInformation");
		
		rs += xml.element("Restrictions", bundle.resources.access_restrictions);
		rs += xml.element("ConditionsofAccess", bundle.resources.access_conditions);
		
		var oURCS = "Open Access";
		if (res_in_bun.urcs.u == true) oURCS = "User";
		if (res_in_bun.urcs.r == true) oURCS = "Researcher";
		if (res_in_bun.urcs.c == true) oURCS = "Community member";
		if (res_in_bun.urcs.s == true) oURCS = "Subscriber";
		
		rs += xml.element("oURCS", oURCS);
		
		rs += xml.close("AccessInformation");
		
		rs += xml.close("Resource");
		
		return rs;
		
	};
	
	
	var insertKeywords = function(keywords){
	
		keywords = linesToArray(keywords);
		
		
		if ((keywords.length == 0) || (keywords.length == 1 && keywords[0] == "")){
			return "";
		}
		
		var rs = "";
		
		rs += xml.open("Keywords");
		
		for (var i = 0; i < keywords.length; i++){
		
			rs += xml.element("Keyword", keywords[i]);
			
		}
		
		rs += xml.close("Keywords");
		
		return rs;	
	
	};
	
	
	var insertBundleResources = function(resources_in_bundle, resources, languages, persons_in_bundle, persons, bundle){

		var rs = "";
		
		if (resources_in_bundle.length === 0){
		
			return rs;
			
		}
		
		rs += xml.open("Resources");
		
		forEach(resources_in_bundle, function(res_in_bun){
		
			var res = resources.getByID(res_in_bun.resource_id);
		
			rs += insertBundleResource(res_in_bun, res, languages, persons_in_bundle, persons, bundle);
			
		});
		
		rs += xml.close("Resources");
		
		return rs;
		
	};

	
	var my = {};
	

	my.bundles = map(data.bundles, function (bundle){
		xml.reset();
		return createBundle(bundle, data.persons, data.resources);
	});

	return my;

};