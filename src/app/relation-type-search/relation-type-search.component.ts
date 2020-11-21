import { Component, OnInit, ViewChild } from '@angular/core';
import { JdmRequestService } from '../jdm-request.service';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatPaginator, matTooltipAnimations } from '@angular/material';
import { mergeMap, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';



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
    private raffTabs : any[] = new Array();
    private word: string;
    private wordId : any;
    displayedColumns: string[] = ['name'];
    private ShowSelectRelation : boolean = false;
    private DataReady : boolean = false;
    private GetDataClicked : boolean = false;
    private ShowData : boolean = false;
    private resultlength = 0;
    private selectedValue: any;
    private RaffArray: any[] = new Array();
    private RaffDesc : any[] = new Array();
    private DefArray: any[] = new Array();
    private DefGenerale : String;
    private ShowDefGenerale : boolean = false;
    private ShowRaffinements : boolean = false;
    
    


    


    tableDataSrc : any;
    @ViewChild (MatPaginator, {static : false }) mypaginator : MatPaginator

    
    
    

    constructor(private jdmservice: JdmRequestService) { }

    ngOnInit() {
        
    }

    updateData(value) {
        this.word = value;

        console.log(this.word);
    }

    getRelationsType() {
        this.word = this.word.replace(" ","+");
         // supporte les mot avec espaces
        this.DefArray= new Array();
        this.ShowDefGenerale=false;
        this.ShowRaffinements = false;
        this.jdmservice.getWordId(this.word).subscribe(IdData =>{
            this.wordId=IdData;
            console.log("id du mot reçu");
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
                        console.log("relation recup");

                         this.jdmservice.getIdRaff(this.word).subscribe(raffdata =>{
                            this.RaffArray = raffdata;
                            console.log("raffinement recup");
                            this.jdmservice.getDef(this.word).subscribe(def =>{
                                this.DefGenerale = def.value;
                                console.log("la valeur de la def vaut "+this.DefGenerale+" de taille "+this.DefGenerale.length);
                                if(this.DefGenerale.length>3){
                                    this.ShowDefGenerale=true;
                                }
                            })
                            
                            from(this.RaffArray).pipe(
                                mergeMap(param => {
                                
                                console.log("param vaut "+param.raffid)
                                this.RaffDesc.push(param.raffdesc);
                                return this.jdmservice.getDef(param.raffid)})

                              ).subscribe(val =>  {
                               console.log("val vaut"+ val.value)
                               if(val.value!==null){
                                this.DefArray.push(val);
                                this.ShowRaffinements=true;
                               }
                                //console.log("node desc vaut "+ node.desc+" node value vaut "+node.value)
                                
                             
                            });
       
                        });
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
    
    
                // parcourir le tableau de tout les noeud et l ajouter a un tableau de nom pour le widget material 
                for(var node of this.NodesOfThisWord)
                    for(var id of IdWordsToDisplay){
                        if(node.id === id){
                           if(this.NodesOfARelation.includes(node.name)===false){
                               console.log("ajout de "+node.name)
                               
                                this.NodesOfARelation.push(node);   
                           }
                            
                        }
                    }
                    
                    console.log(this.NodesOfARelation.length+" mot sont contenus dans le tab");
                        this.resultlength = this.NodesOfARelation.length;
                   
                        this.DataReady = true;
                        this.tableDataSrc = new MatTableDataSource(this.NodesOfARelation);
                        this.tableDataSrc.paginator = this.mypaginator;
                        
                        console.log("data ready mis a true");
                        //virer les termes inintelligibles de jeux de mot
                        this.NodesOfARelation = this.NodesOfARelation.filter((item)=>{
                            return !item.name.includes("::") && !item.name.includes(":?");
                        })
                            
                });
                
            }

            showDef(def){
                if(def.show===false){
                    console.log(def.value);
                    def.show=true;   
                }else{
                    def.show=false;
                }
            }
 
}  

        
