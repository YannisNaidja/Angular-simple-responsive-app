import { Component, OnInit, ViewChild } from '@angular/core';
import { JdmRequestService } from '../jdm-request.service';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material';



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
    private ShowSelectRelation : boolean = false;
    private DataReady : boolean = false;
    private GetDataClicked : boolean = false;
    private ShowData : boolean = false;
    private resultlength = 0;
    private selectedValue: any;
    tableDataSrc : any;
    @ViewChild (MatPaginator, {static : false }) mypaginator : MatPaginator

    
    
    

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
                        this.ShowSelectRelation = true;
                        this.DataReady = false;
                        this.GetDataClicked = false;
                        this.ShowData = false;
                        
                    });
                });	
            });
        });
        
    }

    getNodesOfARelation(relationclicked){

        this.GetDataClicked = true;
        this.NodesOfARelation = new Array();

            console.log(relationclicked);
            var relationId;
            for(var r of this.RelationsNames){
                if(r.desc === relationclicked)
                    relationId = r.id;
                    console.log("id trouvee "+relationId);
            }
            console.log("valeur : "+relationId)
            

            // choper les relations de cette idRelation
            this.jdmservice.getRelationsNodebyId(this.word,relationId).subscribe(data =>{
                console.log("recu l'id " + relationclicked);
                this.AssociatedRelations = data;
                var IdWordsToDisplay = new Array();

                // chercher l'id du noeud avec lequel le mot est en relation et l'ajouter a un tableau 
                 for(var relation of this.AssociatedRelations){
                     if(relation.idRelationType===relationId){
                         var IdMot;
                         if(relation.idSource!=this.wordId){
                             IdMot = relation.idSource;
                             IdWordsToDisplay.push(IdMot);
                         }else{
                             IdMot = relation.idTarget;
                             IdWordsToDisplay.push(IdMot);
                         }
                         
                         
                     }
                 }
                 console.log(IdWordsToDisplay.length+" id de noeuds on ete ajoutes ");
    
    
                // parcourir le tableau et l ajouter a un tableau de nom pour le widget material 
                for(var node of this.NodesOfThisWord)
                    for(var id of IdWordsToDisplay){
                        if(node.id === id){
                           
                            this.NodesOfARelation.push(
                                {
                                    name : node.name
                                }
                            );
                        }
                    }

                    console.log(this.NodesOfARelation.length+" mot sont contenus dans le tab");
                        this.resultlength = this.NodesOfARelation.length;
                   
                        this.DataReady = true;
                        this.tableDataSrc = new MatTableDataSource(this.NodesOfARelation);
                        this.tableDataSrc.paginator = this.mypaginator;
                        console.log("data ready mis a true");
                            
                });
                
            }

            showDataClick(){
                this.ShowData = true ;
            }


   
}  
        
