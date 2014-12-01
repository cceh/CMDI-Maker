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


	var eldp_bundle_profile="clarin.eu:cr1:p_1271859438204";

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
	
	
	var insertBundleLanguages = function(langs){
	
		if (langs.length === 0){
			return "";
		}
		
		var rs = "";
		
		rs += xml.open("ContentLanguages");
		
		forEach(langs, function(lang){
		
			rs += xml.open("ContentLanguage");
			rs += xml.element("Name", lang.name);
			rs += xml.element("Code", "ISO639-3:" + lang.code);
			
			if (lang.content_language === true){
				rs += xml.element("Use", "content");
			}
			
			else {
				rs += xml.element("Use", "working");
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
		rs += xml.tag("Resources",0);
		rs += xml.tag("ResourceProxyList",2);
		rs += xml.tag("JournalFileProxyList",2);
		rs += xml.tag("ResourceRelationList",2);
		rs += xml.tag("Resources",1);
		
		rs += xml.open("Components");
		
		
		rs += xml.open("ELDP-Bundle");

		rs += xml.element("Title", bundle.bundle.title);		
		rs += xml.element("ID", ""); //no input
		rs += xml.element("Description", bundle.bundle.description, [getXMLLangAttribute()]);
		
		rs += xml.open("StatusInfo");
		rs += xml.element("Status", "");
		rs += xml.element("ChangeDate", today());
		rs += xml.close("StatusInfo");
		
		//No depositors
		
		rs += insertBundleLanguages(bundle.languages.bundle_languages);
		rs += insertBundlePersons(bundle.persons.persons, persons);

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

		rs += insertBundleResources(bundle.resources.resources, resources);
		
		rs += xml.close("ELDP-Bundle");
		rs += xml.close("Components");
		rs += xml.close("CMD");
		
		return rs;
		
	};
	
	
	var insertPersonLanguages = function(languages){
	
		var rs = "";
	
		forEach(languages, function(lang){
		
			rs += xml.open("Language");
			rs += xml.element("ID", lang.iso_code);
			rs += xml.element("Name", lang.name);
			rs += xml.close("Language");
		
		});
		
		return rs;
	
	
	};
	
	/*
	
	!! AGE  = BUNDLE_DATE - PERSON BIRTH YEAR
	
	*/
	var insertBundlePersons = function(person_in_bundles, persons){
	
		if (person_in_bundles.length === 0){
			return "";
		}
		
		var rs = "";
		
		rs += xml.open("Persons");
		
		forEach(person_in_bundles, function(person_in_bundle){
			var pers = persons.getByID(person_in_bundle.person_id);
			console.log("PERS");
			console.log(pers);
			
			rs += xml.open("Person");
			
			rs += xml.element("PersonID", "");  //no input
			rs += xml.element("Role", person_in_bundle.role);
			
			rs += xml.element("BiographicalNote", pers.biographical_note);
			
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
			
			rs += xml.element("BirthYear", pers.birth_year);
			
			rs += xml.close("BiographicalData");
			
	
	
			rs += xml.open("Languages");
			rs += insertPersonLanguages(pers.languages);
			rs += xml.close("Languages");
			rs += xml.close("Person");
		
		});

		rs += xml.close("Persons");	
		
		return rs;
	
	
	};

	
	var insertContentLanguages = function (session_id) {

		var rs = "";
		
		var languages = corpus.content_languages.content_languages;
	
		for (var l=0;l<languages.length;l++){  //for all content languages // no session separate languages yet
	
			rs += xml.open("Content_Language");
			rs += xml.element("Id",APP.CONF.LanguageCodePrefix+languages[l][0]);
			rs += xml.element("Name",languages[l][3]);
			rs += xml.close("Content_Language");
	
		}

		return rs;
		
	};
	

	var insertBundleResource = function(res_in_bun, resource){

		var rs = "";
		
		console.log(res_in_bun);
		
		rs += xml.open("Resource");
		rs += xml.element("Title", resource.name);
		
		rs += xml.element("ID", "");
		rs += xml.element("Host", "");
		rs += xml.open("StatusInfo");
		rs += xml.element("Status", (resource.stable == true) ? "stable" : "in-progress");
		xml.element("ChangeDate", (typeof resource.lastModified != "undefined") ? resource.lastModified : "");
		rs += xml.close("StatusInfo");
		
		
		//rs += insertContentLanguages
		//rs += insertPersons
		
		
		rs += xml.close("Resource");
		
		return rs;
		
	};
	
	
	var insertBundleResources = function(resources_in_bundle, resources){

		var rs = "";
		
		if (resources_in_bundle.length === 0){
		
			return rs;
			
		}
		
		rs += xml.open("Resources");
		
		forEach(resources_in_bundle, function(res_in_bun){
		
			var res = resources.getByID(res_in_bun.resource_id);
		
			rs += insertBundleResource(res_in_bun, res);
			
		});
		
		rs += xml.close("Resources");
		
		return rs;
		
	};

	
	var insertActor = function(session_id,actor_id){

		var i = actor.getActorsIndexFromID(actor_id);
		var ac = actor.actors[i];

		var rs = "";
		rs+=xml.tag("Actor",0);
		rs+=xml.element("Role",ac.role);
		rs+=xml.element("Name",ac.name);
		rs+=xml.element("FullName",ac.full_name);
		rs+=xml.element("Code",ac.code);
		rs+=xml.element("FamilySocialRole",ac.family_social_role);
		rs+=xml.element("EthnicGroup",ac.ethnic_group);   
		
		//Age field
		rs += xml.tag("Age",0);
		rs += actor.getAge(session_id,actor_id);
		rs += xml.tag("Age",1);	
		//End of age field
		
		if ((ac.birth_date.year !== "") && (ac.birth_date.year != "YYYY")){
		
			rs += xml.element("BirthDate",ac.birth_date.year+"-"+ac.birth_date.month+"-"+ac.birth_date.day);
			
		}
		
		else {
		
			rs += xml.element("BirthDate","Unspecified");
		
		}
		
		rs+=xml.element("Sex",ac.sex);
		rs+=xml.element("Education",(ac.education !== "") ? ac.education : "Unspecified" );
		rs+=xml.element("Anonymized",(ac.anonymized) ? "true" : "false"); 
		
		rs+=xml.tag("Contact",0);
		rs+=xml.element("Name",ac.contact.name);   
		rs+=xml.element("Address",ac.contact.address);   
		rs+=xml.element("Email",ac.contact.email);   
		rs+=xml.element("Organisation",ac.contact.organisation);   
		rs+=xml.tag("Contact",1);

		rs += xml.tag("Keys",2);
		
		rs += xml.tag("descriptions",0);
		rs += xml.element("Description",ac.description);
		rs += xml.tag("descriptions",1);	
		
		rs += xml.tag("Actor_Languages",0);
		//rs += xml.element("Description","");
		
		for (var l=0; l<ac.languages.length; l++){
		
			rs += xml.tag("Actor_Language",0);
			rs += xml.element("Id",APP.CONF.LanguageCodePrefix+ac.languages[l].iso_code);
			rs += xml.element("Name",ac.languages[l].name);
			
			rs += xml.element("MotherTongue",(ac.languages[l].MotherTongue) ? "true" : "false");
			rs += xml.element("PrimaryLanguage",(ac.languages[l].PrimaryLanguage) ? "true" : "false");		

			rs += xml.tag("Actor_Language",1);
		
		}

		rs += xml.tag("Actor_Languages",1);
		
		rs+=xml.tag("Actor",1);
	
		return rs;
		
	};
	
	var my = {};
	

	my.bundles = map(data.bundles, function (bundle){
		xml.reset();
		return createBundle(bundle, data.persons, data.resources);
	});

	return my;

};



/*
<?xml version="1.0" encoding="UTF-8"?>
<CMD xmlns="http://www.clarin.eu/cmd/"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     CMDVersion="1.1"
     xsi:schemaLocation="http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/clarin.eu:cr1:p_1407745711992/xsd">
   <Header>
      <MdCreator>Sebastian</MdCreator>
      <MdCreationDate>2014-11-19+01:00</MdCreationDate>
      <MdProfile>clarin.eu:cr1:p_1407745711992</MdProfile>
   </Header>
   <Resources>
      <ResourceProxyList/>
      <JournalFileProxyList/>
      <ResourceRelationList/>
   </Resources>
   <Components>
      <ELDP_Bundle>
         <Title xml:lang="fra">b_title</Title>
         <TypeofRecord>umbrella</TypeofRecord>
         <ID>001</ID>
         <StatusInfo>
            <Status>stable</Status>
            <ChangeDate>2014-11-19</ChangeDate>
         </StatusInfo>
         <Depositor>
            <Role>dep role</Role>
            <AdditionalInformation>ad</AdditionalInformation>
            <PersonalData>
               <Name>
                  <Name>asd</Name>
               </Name>
               <BiographicalData>
                  <DeathYear>asd</DeathYear>
               </BiographicalData>
            </PersonalData>
            <Gender/>
            <Languages>
               <Language>
                  <Name>German</Name>
                  <Autoglottonym>deutsch</Autoglottonym>
               </Language>
            </Languages>
         </Depositor>
         <ContentLanguage>
            <Name>German</Name>
            <Use>Working</Use>
            <History/>
            <AdditionalInformation>this is some additional information</AdditionalInformation>
         </ContentLanguage>
         <Person>
            <Age_at_Time_of_Recording>12</Age_at_Time_of_Recording>
            <Role>data_inputter</Role>
            <BiographicalNote/>
            <Ethnicity>
               <EthnicAffiliation>ui</EthnicAffiliation>
               <AdditionalInformation>addinfo</AdditionalInformation>
            </Ethnicity>
            <PersonalData>
               <Name>
                  <Name>Guy Stone</Name>
               </Name>
               <BiographicalData>
                  <BirthYear>1922</BirthYear>
                  <DeathYear>2999</DeathYear>
               </BiographicalData>
            </PersonalData>
            <Gender>
               <GenderIdentification>huhu</GenderIdentification>
               <AdditionalInformation/>
            </Gender>
            <Education>
               <Level/>
               <AdditionalInformation/>
               <AdditionalInformation/>
               <AdditionalInformation/>
            </Education>
            <Nationality/>
         </Person>
         <ProjectLocation>
            <ProjectGeographic/>
         </ProjectLocation>
         <AccessInformation>
            <Restricitons xml:lang="aom">res_of_access</Restricitons>
            <ConditionsofAccess>cond of access</ConditionsofAccess>
            <oURCS>User</oURCS>
         </AccessInformation>
         <Resource>
            <Title/>
            <TypeofRecord/>
            <ID/>
            <Host/>
            <StatusInfo>
               <Status/>
               <ChangeDate/>
            </StatusInfo>
            <Depositor>
               <Role/>
               <AdditionalInformation/>
               <PersonalData>
                  <Name>
                     <Name/>
                  </Name>
                  <BiographicalData>
                     <DeathYear/>
                  </BiographicalData>
               </PersonalData>
               <Gender/>
               <Languages>
                  <Language>
                     <Name/>
                     <Autoglottonym/>
                  </Language>
               </Languages>
            </Depositor>
            <ContentLanguage>
               <Name/>
               <Use/>
               <History/>
               <AdditionalInformation/>
            </ContentLanguage>
            <Location/>
            <AccessInformation>
               <Restricitons/>
               <ConditionsofAccess/>
               <oURCS/>
            </AccessInformation>
            <VideoFile>
               <General>
                  <Name/>
                  <Date/>
               </General>
               <MediaInformations/>
               <ImageInformations/>
               <VideoInformations/>
               <Checksum/>
            </VideoFile>
         </Resource>
      </ELDP_Bundle>
   </Components>
</CMD>
*/