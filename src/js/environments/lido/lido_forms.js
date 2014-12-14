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


lido_environment.start_form = {

	title: "lido-start",
	type: "form",
	fields: [
		{
			heading: "Type",
			name: "type",
			type: "select",
			comment: "Select the type of record.",
			vocabulary: ["Programmhefte", "Kritiken", "Noten", "Libretti", "Szenische Grafik", "Porträtgrafik",
			"Theaterbaugrafik", "Papiertheater", "Gemälde", "Theaterplakate", "Inszenierungsfotografien",
			"Personenfotografien", "Theaterbaufotografien", "Tanzfotografien", "Glasplattennegative", "Fotoalben",
			"Bühnenmodelle", "Masken", "Puppen", "Schattenspielfiguren", "Marionetten", "Plastiken", "Filmfotos",
			"Filmplakate"],
		},
		{
			heading: "Classification",
			name: "classification",
			type: "text",
		},
		{
			heading: "Legal Body",
			name: "legal_body",
			type: "textarea",
			default_value: "Theaterwissenschaftliche Sammlung, Universität zu Köln\nGrafikabteilung, Theaterwissenschaftliche Sammlung, Universität zu Köln\nSzenische Grafik ,Grafikabteilung, Theaterwissenschaftliche Sammlung, Universität zu Köln"
		},
	]

};