import { Component, OnInit } from '@angular/core';
import { JdmRequestService } from '../jdm-request.service';


@Component({
    selector: 'app-relation-type-search',
    templateUrl: './relation-type-search.component.html',
    styleUrls: ['./relation-type-search.component.css']
})
export class RelationTypeSearchComponent implements OnInit {

    private RelationsNames: any[] = new Array();
    private Relations: any[] = new Array();
    private NodesOfARelation: any[] = new Array();
    private NodesOfThisWord: any[] = new Array();
    private AssociatedRelations : any[] = new Array();
    private word: any;
    private wordId : any;
    displayedColumns: string[] = ['name'];
    clicked : boolean = false;
    resultsLength = 0;
    private RelationClicked : boolean[] = new Array(100000);
    

    constructor(private jdmservice: JdmRequestService) { }

    ngOnInit() {
        
    }

    updateData(value) {
        this.word = value;
        //console.log(this.sentence);
    }

    getRelationsType() {

        this.jdmservice.getWordId(this.word).subscribe(IdData =>{
            this.wordId=IdData;
            this.jdmservice.getRelationType(this.word).subscribe(data => {
                this.RelationsNames = data;
                console.log("data update");
                this.jdmservice.getNodes(this.word).subscribe(worddata =>{
                    this.NodesOfThisWord = worddata;
                    console.log("node tab update");
                    this.jdmservice.getRelations(this.word).subscribe(relations =>{
                        this.Relations = relations;
                    });
                });	
            });
        });
        
    }

    getNodesOfARelation(relationclicked){

        if(this.RelationClicked[relationclicked]===true){
            this.RelationClicked[relationclicked]===false;
            console.log("mis a false");
        }else{

            // choper les relations de cette idRelation
            this.jdmservice.getRelationsNodebyId(this.word,relationclicked).subscribe(data =>{
                console.log("recu l'id " + relationclicked);
                this.AssociatedRelations = data;
                var IdWordsToDisplay = new Array();

                // chercher l'id du noeud avec lequel le mot est en relation et l'ajouter a un tableau 
                 for(var relation of this.AssociatedRelations){
                     console.log("boucle 1 : comparaison de "+relation.idRelationType+ " avec "+relationclicked)
                     if(relation.idRelationType===relationclicked){
                         var IdMot;
                         if(relation.idSource!=this.wordId){
                             IdMot = relation.idSource;
                             IdWordsToDisplay.push(IdMot);
                         }else{
                             IdMot = relation.idTarget;
                             IdWordsToDisplay.push(IdMot);
                         }
                         
                         console.log("IdMot vaut "+IdMot);
                     }
                 }
                 console.log(IdWordsToDisplay.length+" id de noeuds on ete ajoutes ");
    
            /*
            for(var id of IdWordsToDisplay){
                this.jdmservice.getNodebyId(this.word,id).subscribe(data =>{
                    console.log("ajout de "+data.name);
                    this.NodesOfARelation.push(data.name);
                    
                });*/
    
                // parcourir le tableau et l ajouter a un tableau de nom pour le widget material 
                for(var node of this.NodesOfThisWord)
                    for(var id of IdWordsToDisplay){
                        if(node.id === id){
                            console.log("ajout de "+node.name);
                            this.NodesOfARelation.push(
                                {
                                    name : node.name
                                }
                            );
                        }
                    }

                    console.log(this.NodesOfARelation.length+" mot sont contenus dans le tab");
                    this.resultsLength = this.NodesOfARelation.length
                });
                this.RelationClicked[relationclicked] = true;
                }
            }  
        }
