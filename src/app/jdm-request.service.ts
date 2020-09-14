import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JdmRequestService {

  private servUrl = 'http://localhost:8888/';

  constructor(private http : HttpClient) { }

  // tous les types de relations pour ce mot

  getRelationType(word : string) : Observable<any>{
      return this.http.get(this.servUrl+ "getRelationType/"+ word);    
  }

  //toutes les relations pour ce mot 

  getRelations(word : string) : Observable<any>{
    return this.http.get(this.servUrl+ "getRelations/"+ word);    
}

  // tous les noeuds pour ce mot 

  getNodes(word : string) : Observable<any>{
  return this.http.get(this.servUrl+ "getAssociatedNodes/"+ word);    
}

// trouver un noeud associé au mot recherche via son id 

getNodebyId(word:string, id:string){
  return this.http.get(this.servUrl+ "getAssociatedNodeById/"+ word+"/"+id);   
}

// toutes les relations du mot pour un id de relation donné

getRelationsNodebyId(word:string, idRelation:string){
  return this.http.get(this.servUrl+ "getAssociatedRelationsById/"+ word+"/"+idRelation);   
}


}
