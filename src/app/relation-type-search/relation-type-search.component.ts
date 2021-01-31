import { Component, OnInit } from "@angular/core";
import { JdmRequestService } from "../jdm-request.service";
import {
	mergeMap,
	map,
	startWith,
	debounceTime,
} from "rxjs/operators";
import { of, from, Observable } from "rxjs";
import { FormControl } from "@angular/forms";

@Component({
	selector: "app-relation-type-search",
	templateUrl: "./relation-type-search.component.html",
	styleUrls: ["./relation-type-search.component.css"],
})
export class RelationTypeSearchComponent implements OnInit {
	Relations: any[] = new Array();
	RelationsNames: any[] = new Array();
	NodesOfARelation: any[] = new Array();
	NodesOfThisWord: any[] = new Array();
	AssociatedRelations: any[] = new Array();
	displayedColumns: string[] = ["name"];
	DataReady: boolean = false;
	tableDataSrc: any;
	LoadingData: boolean = false;
	GetDataClicked: boolean = false;
	resultlength = 0;
	selectedValue: any;
	raffTabs: any[] = new Array();
	RaffArray: any[] = new Array();
	RaffDesc: any[] = new Array();
	DefArray: any[] = new Array();
    DefGenerale: String;
    
	ShowDefGenerale: boolean = false;
	ShowRaffinements: boolean = false;
	ShowSelectRelation: boolean = false;

	entries: any[] = new Array();
	word: string;
    wordId: any;
    wordQuery = new FormControl();
	wordOptions: Observable<any[]>;

	constructor(private jdmservice: JdmRequestService) { }

	ngOnInit() {
		this.jdmservice.getEntries().subscribe((data) => {
			this.entries = data;
			this.wordOptions = this.wordQuery.valueChanges.pipe(
				startWith(""),
				debounceTime(500),
				map((value) => this._filter(value))
			);
        });
	}

	private _filter(value: string): string[] {
		if (value.length < 3) return null;
		return this.entries
			.filter((word) => word.indexOf(value) === 0)
			.sort((a, b) => a.length - b.length)
			.slice(1, 10);
	}

	selection(selected) {
		this.word = selected;
	}

	getRelationsType() {
        this.word = this.wordQuery.value;
		this.DefArray = new Array();
		this.NodesOfARelation = new Array();
		this.ShowDefGenerale = false;
        this.ShowRaffinements = false;
        this.ShowSelectRelation = false;
        this.LoadingData = true;
		//id du mot cherche
		this.jdmservice.getWordId(this.word).subscribe((IdData) => {
			this.wordId = IdData;
			// recuperer les type de relations
			this.jdmservice.getRelationType(this.word).subscribe((data) => {
				this.RelationsNames = data;
				// recuperer tout les noeud associe au mot chercher
				this.jdmservice.getNodes(this.word).subscribe((worddata) => {
					this.NodesOfThisWord = worddata;
					// recuperer toutes les relations associes
					this.jdmservice.getRelations(this.word).subscribe((relations) => {
						this.Relations = relations;
						this.ShowSelectRelation = true;
						this.DataReady = false;
						this.GetDataClicked = false;
						this.LoadingData = false;
						// recuperer les raffinements (relations d'id 1)
						this.jdmservice.getIdRaff(this.word).subscribe((raffdata) => {
							this.RaffArray = raffdata;
							// recuperer une definition generale du mot
							this.jdmservice.getDef(this.word).subscribe((def) => {
								this.DefGenerale = def.value;
                                this.DefGenerale = this.DefGenerale.substring(2);
                                if (this.DefGenerale.indexOf('1.') === 0) {
                                    const regex = new RegExp("([2-99]\\. )", 'g');
                                    this.DefGenerale = this.DefGenerale.replace(regex, "\n$1");
                                }

                                if (this.DefGenerale.length > 3) {
									this.ShowDefGenerale = true;
                                }
							});

							//recuperer les raffinements et pour chaque raffinement avoir sa definition
							from(this.RaffArray)
								.pipe(
									mergeMap((param) => {
										this.RaffDesc.push(param.raffdesc);
										return this.jdmservice.getDef(param.raffid);
									})
								)
								.subscribe((val) => {
									if (val.value !== null) {
										this.DefArray.push(val);
										this.ShowRaffinements = true;
									}
								});
						});
					});
				});
			});
		});
	}

	getNodesOfARelation(relationclicked) {
		this.GetDataClicked = true;
		this.NodesOfARelation = new Array();
		var relationId;
		for (var r of this.RelationsNames) {
			if (r.desc === relationclicked) relationId = r.id;
		}

		// choper les relations de cette idRelation
		// renvoie on a le poid ici
		this.jdmservice
			.getRelationsNodebyId(this.word, relationId)
			.subscribe((data) => {
				this.AssociatedRelations = data;
				var IdWordsToDisplay = new Array();

				// chercher l'id du noeud avec lequel le mot est en relation et l'ajouter a un tableau
				for (var relation of this.AssociatedRelations) {
					if (relation.idRelationType === relationId) {
						var IdMot;
						if (relation.idSource != this.wordId) {
							IdMot = relation.idSource;
							let node = {
								id: relation.idSource,
								poidRelation: relation.poidRelation,
							};

							IdWordsToDisplay.push(node);
						} else {
							IdMot = relation.idTarget;
							let node = {
								id: relation.idTarget,
								poidRelation: relation.poidRelation,
							};
							IdWordsToDisplay.push(node);
						}
					}
				}

				// le poid est perdu ici car on retourne sur le tableau des noeud ou on ne renvoie que lid et le nom
				// parcourir le tableau de tout les noeud et l ajouter a un tableau de nom pour le widget material
				for (var node of this.NodesOfThisWord)
					for (var word of IdWordsToDisplay) {
						if (node.id === word.id && word.poidRelation > 0) {
							if (this.NodesOfARelation.includes(node.name) === false) {
								word.name = node.name;
								this.NodesOfARelation.push(word);
							}
						}
					}
				this.resultlength = this.NodesOfARelation.length;
				this.DataReady = true;

				//virer les termes inintelligibles de jeux de mot
				this.NodesOfARelation = this.NodesOfARelation.filter((item) => {
					return (
						!item.name.includes("::") &&
						!item.name.includes(":?") &&
						item.poidRelation < 9999
					);
				});
				this.NodesOfARelation.sort(function (a, b) {
					return b.poidRelation - a.poidRelation;
                });
			});
	}

	showDef(def) {
        let newWord = def.id.split('>')[1];
        this.wordQuery.setValue(newWord);
        this.word = newWord;
        this.ShowSelectRelation = false;
        this.getRelationsType();
	}

	getFontsize(node) {
		return 20 + Math.sqrt(node.poidRelation);
	}
	getFontcolor(node) {
		return node.poidRelation.toString(16);
	}
}