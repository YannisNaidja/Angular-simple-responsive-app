import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class JdmRequestService {

    private servUrl = 'http://localhost:8888/';
    // private servUrl ='http://217.182.170.118:8888/';

    private entries: Observable<any>;
    private entriesLoaded: boolean = false;

    constructor(private http: HttpClient) { }

    // tous les types de relations pour ce mot

    getEntries(): any {
        if (this.entries) return this.entries;

        this.entries = this.http.get(this.servUrl + "jdmentries").pipe(
            shareReplay(1),
        );
                
        return this.entries;
    }

    getDataAvailability(): boolean {
        return this.entriesLoaded;
    }

    getRelationType(word: string): Observable<any> {
        return this.http.get(this.servUrl + "getRelationType/" + word);
    }

    //toutes les relations pour ce mot 

    getRelations(word: string): Observable<any> {
        return this.http.get(this.servUrl + "getRelations/" + word);
    }

    // tous les noeuds pour ce mot 

    getNodes(word: string): Observable<any> {
        return this.http.get(this.servUrl + "getAssociatedNodes/" + word);
    }

    // trouver un noeud associé au mot recherche via son id 

    getNodebyId(word: string, id: string): Observable<any> {
        return this.http.get(this.servUrl + "getAssociatedNodeById/" + word + "/" + id);
    }

    // toutes les relations du mot pour un id de relation donné

    getRelationsNodebyId(word: string, idRelation: string): Observable<any> {
        return this.http.get(this.servUrl + "getAssociatedRelationsById/" + word + "/" + idRelation);
    }

    // recuperer l'id du mot rechercher

    getWordId(word:string){
        return this.http.get(this.servUrl + "getWordId/" + word);
    }
    getIdRaff(word:string) : Observable<any>{
        return this.http.get(this.servUrl + "getWordRel1/" + word );
    }
    getDef(word:string) : Observable<any>{
        return this.http.get(this.servUrl + "getDef/" + word );
    }
   
}
