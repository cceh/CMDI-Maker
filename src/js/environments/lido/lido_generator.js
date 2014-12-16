lido_environment.lido_generator = function(data){
"use strict";

	xml.reset();
	xml.setElementPrefix("lido");
	
	var parent = lido_environment;

	var digitalisat = lido_environment.workflow[0];	

	var rs = ""; //Return string

	var create_lido_digitalisat = function () {
		var rs = "";
		create_lido_entry();
	}

	var create_lido_term = function (term,entity,etype) {
		if (etype=="search") {
			rs += xml.element("term", term , [["addedSearchTerm",entity]]);
		}
		else if (etype=="lang") {
			rs += xml.element("term", term , [["xml:lang",entity]]);
		}
		else if (etype=="encoding") {
			rs += xml.element("term", term , [["encodinganalog",entity]]);
		}
		else if (etype=="encoding_search") {
			rs += xml.element("term", term , [["addedSearchTerm",entity[0]],["encodinganalog",entity[1]]]);
		}
		else {
			rs += xml.element("term", term);
		};
		return rs;
	}

	var create_lido_entry = function () {
    
		rs += xml.header;	
		rs += xml.open("lido",[
			["xmlns:lido", "http://www.lido-schema.org"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["xsi:schemaLocation","http://www.lido-schema.org http://www.lido-schema.org/schema/v1.0/lido-v1.0.xsd"]
		]);

		rs += xml.open("lidoRecID", [["source","Theaterwissenschaftliche Sammlung, Universität zu Köln"],["type","locale"]]);
		rs += "???";
		rs += xml.close("lidoRecID");
		rs += xml.open("category");
			rs += xml.element("conceptID","300117127",[["type","???"]]);
			create_lido_term("Artefakt","de","lang");
		rs += xml.close("category");
		rs += xml.open("descriptiveMetadata", [["xml:lang","de"]]);
			rs += xml.open("objectClassificationWrap");
				rs += xml.open("objectWorkTypeWrap");
					rs += xml.open("objectWorkType");
						rs += xml.element("conceptID", "300264387" , [["type","AAT"]]);
						var entity = new Array("yes","300264387");
						create_lido_term("Gemälde / Painting", entity ,"encoding_search");
					rs += xml.close("objectWorkType");
				rs += xml.close("objectWorkTypeWrap");
				rs += xml.open("classificationWrap");
					rs += xml.open("classification", [["type","AAT:type"]]);
						rs += xml.element("conceptID", "300264387" , [["type","AAT:type"]]);
						rs += xml.element("term","Bühnenbildentwurf",[["addedSearchTerm","yes"]]);
					rs += xml.close("classification");
				rs += xml.close("classificationWrap");
			rs += xml.close("objectClassificationWrap");
			rs += xml.open("objectIdentificationWrap");
				rs += xml.open("titleWrap");
					rs += xml.open("titleSet");
						rs += xml.element("appellationValue","Gralstempel Parsifal",[["pref","preferred"],["xml:lang","de"]]);
					rs += xml.close("titleSet");
				rs += xml.close("titleWrap");
				rs += xml.open("repositoryWrap");
					rs += xml.open("repositorySet", [["type","current"]]);
						rs += xml.open("repositoryName");
							rs += xml.open("legalBodyName");
							rs += xml.element("appellationValue","Theaterwissenschaftlichesammlung, Universität zu Köln");
							rs += xml.close("legalBodyName");
						rs += xml.close("repositoryName");
						rs += xml.element("workID","G43952");
						rs += xml.element("workID","G43952",[["type","inventory number"]]);
					rs += xml.close("repositorySet");
				rs += xml.close("repositoryWrap");
				rs += xml.open("objectDescriptionWrap");
					rs += xml.open("objectDescriptionSet");
						rs += xml.element("descriptiveNoteValue","Tempera");
					rs += xml.close("objectDescriptionSet");
				rs += xml.close("objectDescriptionWrap");
				rs += xml.open("objectMeasurementsWrap");
					rs += xml.open("objectMeasurementsSet");
						rs += xml.element("displayObjectMeasurements","10 x 10 x 10");
					rs += xml.close("objectMeasurementsSet");
				rs += xml.close("objectMeasurementsWrap");
			rs += xml.close("objectIdentificationWrap");
			rs += xml.open("eventWrap");
				rs += xml.open("eventSet");
					rs += xml.element("displayEvent","Anfertigung im Auftrag Richard Wagners");
					rs += xml.open("event");
						rs += xml.open("eventType");
							create_lido_term("creation","en","lang");
							create_lido_term("Herstellung","de","lang");
						rs += xml.close("eventType");
						rs += xml.open("eventActor");
							rs += xml.open("actorInRole");
								rs += xml.open("actor", [["type","person"]]);
									rs += xml.element("actorID","p118713248",[["type","d-nb.info"],["source","http://d-nb.info/gnd/118713248"]]);
									rs += xml.open("nameActorSet");
										rs += xml.element("appellationValue","Joukowsky, Paul von",[["pref","preferred"]]);
										//rs += xml.element("sourceAppellation","http://d-nb.info/gnd/118713248");
									rs += xml.close("nameActorSet");
									rs += xml.open("vitalDatesActor");
										rs += xml.element("earliestDate","1845");
										rs += xml.element("latestDate","1912");
									rs += xml.close("vitalDatesActor");
								rs += xml.close("actor");
								rs += xml.open("roleActor");
									create_lido_term("Bühnenbildner");
								rs += xml.close("roleActor");
							rs += xml.close("actorInRole");
						rs += xml.close("eventActor");
						rs += xml.open("culture");
							create_lido_term("Europa");
						rs += xml.close("culture");
						rs += xml.open("eventDate");
							rs += xml.open("date");
								rs += xml.element("earliestDate","1845");
								rs += xml.element("latestDate","1912");
							rs += xml.close("date");
						rs += xml.close("eventDate");
						rs += xml.open("eventPlace");
							rs += xml.open("displayPlace");
							rs += xml.close("displayPlace");
							rs += xml.open("place");
								rs += xml.open("namePlaceSet");
									rs += xml.element("appellationValue","");
								rs += xml.close("namePlaceSet");
								rs += xml.open("gml");
								rs += xml.close("gml");
							rs += xml.close("place");
						rs += xml.close("eventPlace");
					rs += xml.close("event");
				rs += xml.close("eventSet");
			rs += xml.close("eventWrap");
			rs += xml.open("objectRelationWrap");
				rs += xml.open("subjectWrap");
					rs += xml.element("displaySubject","Portrait / Inszenierung / Schattenspielvorführung");
					rs += xml.open("subject");
						rs += xml.open("subjectActor");
							rs += xml.element("displayActor","");
							rs += xml.open("actor");
								rs += xml.open("nameActorSet");
									rs += xml.element("appellationValue","");
									rs += xml.element("sourceAppellation","http://d-nb.info/gnd/118713248");
								rs += xml.close("nameActorSet");
							rs += xml.close("actor");
						rs += xml.close("subjectActor");
						rs += xml.open("subjectDate");
							rs += xml.element("displayDate","");
						rs += xml.close("subjectDate");
						rs += xml.open("subjectEvent");
							rs += xml.element("displayEvent","Inszenierung von Parsifal");
							rs += xml.open("event");
								rs += xml.open("eventType");
									create_lido_term("Inszinierung");
								rs += xml.close("eventType");
								rs += xml.open("eventName");
									rs += xml.element("appellationValue","Parsifal");
								rs += xml.close("eventName");
								// Das muss noch in eine Funktion
								rs += xml.open("eventActor"); 
									rs += xml.element("displayActorInRole","Regie: Cosima Wagner");
									rs += xml.open("actorInRole");
										rs += xml.open("actor");
											rs += xml.open("nameActorSet");
												rs += xml.element("appellationValue","Wagner, Cosima");
											rs += xml.close("nameActorSet");
										rs += xml.close("actor");
										rs += xml.open("roleActor");
											create_lido_term("Regisseur");
										rs += xml.close("roleActor");
									rs += xml.close("actorInRole");
								rs += xml.close("eventActor");
								// bis hier
								rs += xml.open("culture");
									create_lido_term("Europa");
								rs += xml.close("culture");
								rs += xml.open("eventDate");
									rs += xml.element("displayDate","1882");
								rs += xml.close("eventDate");
								rs += xml.open("eventPlace");
									rs += xml.element("displayPlace","Bayreuth, Festspielhaus");
									rs += xml.open("place");
										rs += xml.element("gml","");
									rs += xml.close("place");
								rs += xml.close("eventPlace");
							rs += xml.close("event");
						rs += xml.close("subjectEvent");
					rs += xml.close("subject");
					//Funktion!!
					rs += xml.open("subject", [["type","description"]]);
						rs += xml.open("subjectConcept");
							rs += xml.element("conceptID","23 D 42",[["source","Iconclass"],["type","local"]]);
							create_lido_term("23 D 42");
							create_lido_term("spring, 'Ver'; 'Primavera' (Ripa)","yes","search");
							create_lido_term("Ver &amp; Primavera","yes","search");
							create_lido_term("nature","yes","search");
							create_lido_term("time","yes","search");
							create_lido_term("seasons of the year (esp. personifications); 'Stagione', 'Le quattro stagione dell'anno' (Ripa)","yes","search");
							create_lido_term("stagione &amp; quattro stagione dell'anno (le) &amp; season &amp; summer &amp; winter &amp; spring &amp; autumn","yes","search");
							create_lido_term("year divided into four seasons","yes","search");
							create_lido_term("four","yes","search");
							create_lido_term("spring; Ripa: Ver; Primavera","yes","search");
						rs += xml.close("subjectConcept");
					rs += xml.close("subject");
					rs += xml.open("subject", [["type","description"]]);
						rs += xml.open("subjectConcept");
							rs += xml.element("conceptID","57 A 9 :",[["source","Iconclass"],["type","local"]]);
							create_lido_term("57 A 9 :");
							create_lido_term("Humanity, Politeness; 'Cortesia', 'Humanità' (Ripa)","yes","search");
							create_lido_term("humanity &amp; humanità &amp; politeness &amp; cortesia &amp; courtesy","yes","search");
							create_lido_term("abstract ideas and concepts","yes","search");
							create_lido_term("abstract ideas and concepts &amp; allegory &amp; personification","yes","search");
							create_lido_term("morality","yes","search");
							create_lido_term("good and bad behaviour, moral qualities","yes","search");
							create_lido_term("morality &amp; behaviour","yes","search");
							create_lido_term("humanity; politeness; Ripa: Cortesia, Humanità","yes","search");
						rs += xml.close("subjectConcept");
					rs += xml.close("subject");
					rs += xml.open("subject", [["type","description"]]);
						rs += xml.open("subjectConcept");
							rs += xml.element("conceptID","92 C 47",[["source","Iconclass"],["type","local"]]);
							create_lido_term("92 C 47");
							create_lido_term("specific aspects, allegorical aspects of Venus; Venus as patroness","yes","search");
							create_lido_term("Aphrodite &amp; Venus","yes","search");
							create_lido_term("classical mythology und ancient history","yes","search");
							create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
							create_lido_term("gods in classical mythology","yes","search");
							create_lido_term("god (non-christian)","yes","search");
							create_lido_term("the great godesses of heaven, and their train","yes","search");
							create_lido_term("the story of Venus (Aphrodite)","yes","search");
							create_lido_term("Venus","yes","search");
							create_lido_term("specific aspects, allegorical aspects; Venus as patroness","yes","search");
						rs += xml.close("subjectConcept");
					rs += xml.close("subject");
					rs += xml.open("subject", [["type","description"]]);
						rs += xml.open("subjectConcept");
							rs += xml.element("conceptID","92 D 3",[["source","Iconclass"],["type","local"]]);
							create_lido_term("92 D 3");
							create_lido_term("Graces (Charites), generally three in number; 'Gratie' (Ripa)","yes","search");
							create_lido_term("Graces &amp; three &amp; Gratie","yes","search");
							create_lido_term("classical mythology und ancient history","yes","search");
							create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
							create_lido_term("gods in classical mythology","yes","search");
							create_lido_term("god (non-christian)","yes","search");
							create_lido_term("lesser divinities of Heaven ~ serving and attendant environment","yes","search");
							create_lido_term("serving &amp; god (non-christian) &amp; Cupid &amp; hours &amp; graces &amp; muses &amp; Nike &amp; Iris &amp; Hebe &amp; Ganymede","yes","search");
						rs += xml.close("subjectConcept");
					rs += xml.close("subject");
					rs += xml.open("subject", [["type","description"]]);
						rs += xml.open("subjectConcept");
							rs += xml.element("conceptID","92 E 54 21",[["source","Iconclass"],["type","local"]]);
							create_lido_term("92 E 54 21");
							create_lido_term("Zephyrus abducting Flora (or Chloris), who usually scatters flowers","yes","search");
							create_lido_term("abducting &amp; Flora &amp; Chloris &amp; flower &amp; scatter","yes","search");
							create_lido_term("classical mythology und ancient history","yes","search");
							create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
							create_lido_term("gods in classical mythology","yes","search");
							create_lido_term("god (non-christian)","yes","search");
							create_lido_term("lesser divinities of Heaven ~ phenomena of air and sky","yes","search");
							create_lido_term("air &amp; sky &amp; heaven &amp; god (non-christian)","yes","search");
							create_lido_term("gods of the winds","yes","search");
							create_lido_term("wind","yes","search");
							create_lido_term("(story of) Zephyrus (Favonius), the west wind; 'Favonio o Zeffiro' (Ripa)","yes","search");
							create_lido_term("Zephyrus &amp; wind &amp; westwind &amp; Favonio o Zeffiro","yes","search");
							create_lido_term("love affairs of Zephyrus","yes","search");
							create_lido_term("Zephyrus &amp; love affair &amp; west wind","yes","search");
						rs += xml.close("subjectConcept");
					rs += xml.close("subject");
					rs += xml.open("subject", [["type","description"]]);
						rs += xml.open("subjectConcept");
							rs += xml.element("conceptID","96 A 23 51",[["source","Iconclass"],["type","local"]]);
							create_lido_term("96 A 23 51");
							create_lido_term("Flora in her realm: a garden full of flowers, given to her by Zephyrus","yes","search");
							create_lido_term("garden &amp; flower &amp; Zephyrus","yes","search");
							create_lido_term("classical mythology und ancient history","yes","search");
							create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
							create_lido_term("Roman gods and legends","yes","search");
							create_lido_term("Roman &amp; legend &amp; god (non-christian)","yes","search");
							create_lido_term("Roman deities, and foreign deities included in the classical Pantheon","yes","search");
							create_lido_term("Roman gods &amp; god (non-christian)","yes","search");
							create_lido_term("female roman deities","yes","search");
							create_lido_term("god (non-christian)","yes","search");
							create_lido_term("(story of) Flora","yes","search");
							create_lido_term("Flora &amp; Primavera","yes","search");
							create_lido_term("non-aggressive, friendly or neutral activities and relationships of Flora","yes","search");
							create_lido_term("Flora","yes","search");
							create_lido_term("Flora in her realm: a garden full of flowers, given to her by Zephyrus","yes","search");
						rs += xml.close("subjectConcept");
					rs += xml.close("subject");
					rs += xml.open("subject", [["type","description"]]);
						rs += xml.open("subjectConcept");
							rs += xml.element("conceptID","92 D 15 21",[["source","Iconclass"],["type","local"]]);
							create_lido_term("92 D 15 21");
							create_lido_term("Cupid shooting a dart","yes","search");
							create_lido_term("love &amp; Cupid &amp; bow and arrow &amp; shooting","yes","search");
							create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
							create_lido_term("gods in classical mythology","yes","search");
							create_lido_term("god (non-christian)","yes","search");
							create_lido_term("lesser divinities of Heaven ~ serving and attendant environment","yes","search");
							create_lido_term("serving &amp; god (non-christian) &amp; Cupid &amp; hours &amp; graces &amp; muses &amp; Nike &amp; Iris &amp; Hebe &amp; Ganymede","yes","search");
							create_lido_term("(story of) Cupid, Amor (Eros)","yes","search");
							create_lido_term("Cupid &amp; love","yes","search");
							create_lido_term("non-aggressive, friendly or neutral activities and relationships of Cupid","yes","search");
							create_lido_term("Eros &amp; Amor &amp; Cupid","yes","search");
							create_lido_term("Cupid handling his weapons","yes","search");
							create_lido_term("bow and arrow &amp; arrowl","yes","search");
						rs += xml.close("subjectConcept");
					rs += xml.close("subject");
				rs += xml.close("subjectWrap");
			rs += xml.close("objectRelationWrap");
		rs += xml.close("descriptiveMetadata");
	rs += xml.close("lido");



		
			

	};

	create_lido_digitalisat();
	
	//TO DO: LIDO GENERIEREN :-)
	
	return rs;

};