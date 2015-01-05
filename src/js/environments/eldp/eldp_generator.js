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
	
	var xml = new XMLString();
	
	var IDREFS = [];
	var IDREF_index;
	
	var createIDREFS = function(){

		var rString1 = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString2 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString3 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString4 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString5 = randomString(12, '0123456789abcdefghijklmnopqrstuvwxyz');

		return "res_"+rString1+"_"+rString2+"_"+rString3+"_"+rString4+"_"+rString5;

	};

	var insert_cmdi_header = function(MdCreator,MdCreationDate,MdProfile){
		
		xml.open("Header");
		xml.element("MdCreator",MdCreator);
		xml.element("MdCreationDate",MdCreationDate);
		xml.element("MdProfile",MdProfile);
		xml.close("Header");
		
	};
	
	
	var getXMLLangAttribute = function(){
	
		return ["xml:lang", get("metadata_language_select")];
	
	};
	
	
	var insertLanguages = function(langs){
	
		xml.open("ContentLanguages");
		
		forEach(langs, function(lang){
		
			xml.open("ContentLanguage");
			xml.element("Name", lang.name);
			xml.element("Code", language_code_prefix + lang.code);
			
			if (lang.content_language === true){
				xml.element("Use", "Content");
			}
			
			else {
				xml.element("Use", "Working");
			}
			
			xml.close("ContentLanguage");		
		
		});
		
		xml.close("ContentLanguages");
	
	};
	
	
	var createBundle = function(bundle, persons, resources){
		
		xml.reset();  //we're starting a new xml file here, so tabula rasa!

		xml.header();	
		
		xml.open("CMD",[
			["xmlns", "http://www.clarin.eu/cmd/"],
			["xmlns:cmd","http://www.clarin.eu/cmd/"],
			["xmlns:dcr","http://www.isocat.org/ns/dcr"],
			["xmlns:ann","http://www.clarin.eu"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["xsi:schemaLocation","http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/" + eldp_bundle_profile + "/xsd"],
			["CMDVersion", "1.1"]
		]);
		

		//CMDI Header
		insert_cmdi_header(get("metadata_creator"),today()+"+01:00",eldp_bundle_profile);
		
		
		//in resources is nothing, as this is a session and no corpus. attached media files in a cmdi session are further down
		xml.open("Resources");
		
		
		if (bundle.resources.resources.length > 0){
		
			xml.open("ResourceProxyList");
			
			for (var i = 0; i < bundle.resources.resources.length; i++){  
			
				IDREFS.push(createIDREFS());
				
				xml.open("ResourceProxy", [["id",IDREFS[i]]]);
				xml.element("ResourceType", "Resource");  //MIMETYPE AS ATTRIBUTE!
				console.log(resources);
				xml.element("ResourceRef", resources.getByID(bundle.resources.resources[i].resource_id).name);
				xml.close("ResourceProxy");
			}
			
			xml.close("ResourceProxyList");
		}
		
		else {
			xml.element("ResourceProxyList", "");
		}
		
		
		xml.element("JournalFileProxyList", "");
		xml.element("ResourceRelationList", "");
		xml.close("Resources");
		
		xml.open("Components");
		
		xml.open("ELDP_Bundle");

		xml.element("Title", bundle.bundle.title);		
		xml.element("ID", bundle.bundle.id_element);
		xml.element("Description", bundle.bundle.description, [getXMLLangAttribute()]);
		
		xml.open("StatusInfo");
		xml.element("Status", "in-progress");  //no input
		xml.element("ChangeDate", today());
		xml.close("StatusInfo");
		
		//No depositor input
		insertDummyDepositor();

		
		insertLanguages(bundle.languages.bundle_languages);
		insertGenres(bundle.content.genre);
		insertKeywords(bundle.content.keywords);
		insertPersons(bundle.persons.persons, persons, bundle);

		xml.open("ProjectLocations");
		
		xml.open("ProjectLocation");
		xml.element("Name", bundle.bundle.location.name);
		xml.open("ProjectGeographic");
		xml.element("Country", bundle.bundle.location.country);
		//xml.element("Region", bundle.bundle.location.region);
		//xml.element("Address", bundle.bundle.location.address);
		xml.close("ProjectGeographic");
		xml.close("ProjectLocation");
		
		xml.close("ProjectLocations");

		insertBundleResources(bundle.resources.resources, resources, bundle.languages.bundle_languages, bundle.persons.persons, persons, bundle);
		
		xml.close("ELDP_Bundle");
		xml.close("Components");
		xml.close("CMD");
		
	};
	
	
	var insertGenres = function(genre){
	
		if (genre == ""){
			return;
		}
		
		
		xml.open("Genres");
		xml.element("Genre", genre);
		xml.close("Genres");
		
	};
	
	
	
	var insertDummyDepositor = function(){
	
		xml.open("Depositors");
		xml.open("Depositor");
		xml.element("Role", "Depositor");  
		xml.element("AdditionalInformation", "");
		xml.open("PersonalData");
		xml.open("Name");
		xml.element("Name", "");
		xml.close("Name");
		xml.open("BiographicalData");
		/*xml.element("BirthYear", "");*/
		xml.close("BiographicalData");
		xml.close("PersonalData");
		xml.element("Gender", "");
		xml.open("Languages");
		xml.open("Language");
		xml.element("Name", "");
		xml.element("Autoglottonym", "");
		xml.close("Language");
		xml.close("Languages");
		xml.close("Depositor");
		xml.close("Depositors");
	
	};
	
	
	var insertPersonLanguages = function(languages){
	
		if (languages.length == 0){
			return;
		}
		
		xml.open("Languages");
	
		forEach(languages, function(lang){
		
			xml.open("Language");
			xml.element("Name", lang.name);
			xml.element("Code", language_code_prefix + lang.iso_code);
			xml.element("Additional_Information", lang.additional_information);
			xml.close("Language");
		
		});
		
		xml.close("Languages");
		
	};
	
	/*

	!! AGE  = BUNDLE_DATE - PERSON BIRTH YEAR
	simple calculation wished by ELDP
	
	*/
	var insertPersons = function(person_in_bundles, persons, bundle){
	
		if (person_in_bundles.length === 0){
			return;
		}
		
		xml.open("Persons");
		
		forEach(person_in_bundles, function(person_in_bundle){
			var pers = persons.getByID(person_in_bundle.person_id);
			
			xml.open("Person");
			
			xml.element("PersonID", "");  //no input
			
			//cheap way to calculate person's age, as wished by ELDP
			if (bundle.bundle.date.year !== "" && bundle.bundle.date.year !== "YYYY"){
				xml.element("Age_at_Time_of_Recording", bundle.bundle.date.year - pers.birth_year);
			}
			
			xml.element("Role", person_in_bundle.role);
			
			xml.element("AdditionalInformation", pers.person_additional_information);
			
			xml.element("BiographicalNote", pers.biographical_note);
			
			var ethnicities = strings.linesToArray(pers.ethnicity);
			var ethnicities_add_infos = strings.linesToArray(pers.ethnicity_additional_info);
			
			if (ethnicities.length == ethnicities_add_infos.length && ethnicities.length != 0){
			
				//No wrapper element here!
			
				for (var i = 0; i < ethnicities.length; i++){
				
					xml.open("Ethnicity");
					
					xml.element("EthnicAffiliation", ethnicities[i]);
					xml.element("AdditionalInformation", ethnicities_add_infos[i]);
					
					xml.close("Ethnicity");				
				
				}
				
			}
			
			xml.open("PersonalData");
			xml.open("Name");
			
			xml.element("Title", pers.title);
			
			if (pers.nameKnownAs !== ""){
				xml.element("Name", pers.nameKnownAs, [["kind", "KnownAs"]]);
			}
			
			if (pers.fullName !== ""){
				xml.element("Name", pers.fullName, [["kind", "FullName"]]);
			}
			
			if (pers.nameSortBy !== ""){
				xml.element("Name", pers.nameSortBy, [["kind", "asSortBy"]]);
			}
			
			xml.close("Name");
			
			xml.open("BiographicalData");
			
			xml.element("BirthYear", (pers.birth_year != "YYYY") ? pers.birth_year : "");
			
			if (pers.death_year != "YYYY" && pers.death_year != ""){
				xml.element("DeathYear", pers.death_year);
			}
			
			
			xml.close("BiographicalData");
			
			xml.close("PersonalData");
			
			xml.open("Gender");
			xml.element("GenderIdentification", pers.sex);
			xml.element("AdditionalInformation", "");  //No input!
			xml.close("Gender");
			
			xml.open("Education");
			xml.element("Level", pers.education);
			xml.element("AdditionalInformation", "");  //No input!
			xml.close("Education");
			
			insertPersonLanguages(pers.languages.actor_languages);

			
			var nationalities = strings.linesToArray(pers.nationality);
			var nationalities_add_infos = strings.linesToArray(pers.nationality_additional_info);
			
			if (nationalities.length == nationalities_add_infos.length && nationalities.length != 0){
			
				//No wrapper element here!
			
				for (var i = 0; i < nationalities.length; i++){
				
					xml.open("Nationality");
					
					xml.element("Name", nationalities[i]);
					xml.element("AdditionalInformation", nationalities_add_infos[i]);
					
					xml.close("Nationality");				
				
				}
				
			}
			
			xml.close("Person");
		
		});

		xml.close("Persons");	
	
	};
	

	var insertBundleResource = function(res_in_bun, resource, languages, persons_in_bundle, persons, bundle, IDREF){

		log(res_in_bun);
		
		xml.open("Resource", [["ref", IDREF]]);
		xml.element("Title", resource.name);
		
		xml.element("ID", "");
		xml.element("Host", "");
		xml.open("StatusInfo");
		xml.element("Status", resource.status);
		
		xml.element("ChangeDate", today());
		xml.close("StatusInfo");
		
		
		//Depositor!
		insertDummyDepositor();
		
		insertLanguages(languages);
		insertGenres(bundle.content.genre);
		insertKeywords(bundle.content.keywords);
		insertPersons(persons_in_bundle, persons, bundle);
		
		xml.open("AccessInformation");
		
		xml.element("Restrictions", bundle.resources.access_restrictions);
		xml.element("ConditionsofAccess", bundle.resources.access_conditions);
		
		var oURCS = "Open Access";
		if (res_in_bun.urcs.u == true) oURCS = "User";
		if (res_in_bun.urcs.r == true) oURCS = "Researcher";
		if (res_in_bun.urcs.c == true) oURCS = "Community member";
		if (res_in_bun.urcs.s == true) oURCS = "Subscriber";
		
		xml.element("oURCS", oURCS);
		
		xml.close("AccessInformation");
		
		insertFileElement(resource);
		
		xml.close("Resource");
		
	};
	
	
	var insertFileElement = function(resource){
	
		var file_types = {
			"eaf": "TextFile",
			"txt": "TextFile",
			"jpg": "ImageFile",
			"png": "ImageFile",
			"tif": "ImageFile",
			"bmp": "ImageFile",
			"wav": "AudioFile",
			"mp4": "VideoFile",
			"avi": "VideoFile",
			
			
		};
	
	
		var file_ending = getFileTypeFromFilename(resource.name);
		
		if (file_types[file_ending]){
			var file_type = file_types[file_ending];
		}
		
		else {
		
			file_type = "TextFile";
		
		}
	
		xml.open("File");
		
		xml.open(file_type);
		
		xml.open("General");
		xml.element("Name", resource.name);
		
		var date = parseDate(resource.lastModified);
		
		if (date != null){
			var date_string = dateAsString(date);
		}
		
		else {
		
			date_string = "1977-01-01";
		
		}
		
		xml.element("Date", date_string);
		
		xml.close("General");
		
		xml.element("Checksum", "");
		
		xml.close(file_type);
		
		xml.close("File");
		
	};
	
	
	var insertKeywords = function(keywords){
	
		keywords = strings.linesToArray(keywords);
		
		if ((keywords.length == 0) || (keywords.length == 1 && keywords[0] == "")){
			return "";
		}
		
		xml.open("Keywords");
		
		for (var i = 0; i < keywords.length; i++){
		
			xml.element("Keyword", keywords[i]);
			
		}
		
		xml.close("Keywords");
		
	};
	
	
	var insertBundleResources = function(resources_in_bundle, resources, languages, persons_in_bundle, persons, bundle){

		if (resources_in_bundle.length === 0){
		
			return;
			
		}
		
		xml.open("Resources");
		
		forEach(resources_in_bundle, function(res_in_bun){
		
			var res = resources.getByID(res_in_bun.resource_id);
		
			insertBundleResource(res_in_bun, res, languages, persons_in_bundle, persons, bundle, IDREFS[IDREF_index]);
			
			IDREF_index += 1;
			
		});
		
		xml.close("Resources");
		
	};

	
	var my = {};
	

	my.bundles = map(data.bundles, function (bundle){
		xml.reset();
		IDREF_index = 0;
		
		createBundle(bundle, data.persons, data.resources);
		
		return xml.getString();
		
	});

	return my;

};