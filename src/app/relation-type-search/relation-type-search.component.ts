import { query } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { DataService } from '../data.service';
import { JdmRequestService } from '../jdm-request.service';

@Component({
    selector: 'app-relation-type-search',
    templateUrl: './relation-type-search.component.html',
    styleUrls: ['./relation-type-search.component.css']
})
export class RelationTypeSearchComponent implements OnInit, OnDestroy {

    private RelationsNames: any[] = new Array();
    private word: string;

    entries: string[] = [];
    searchQuery: FormControl = new FormControl();
    searchedWord: Observable<string[]>;

    private dataSubscription: Subscription;

    constructor(private jdmservice: JdmRequestService, private dataService: DataService) { }

    ngOnInit() {
        console.log("whaaat ??");
        
        this.dataSubscription = this.dataService.getEntries().subscribe(data => {
            this.entries = data.entries;
            console.log("data collected !");
            console.log("1. " + this.entries[0]);
            console.log("2. " + this.entries[1]);
        });

        this.searchedWord = this.searchQuery.valueChanges.pipe(
            startWith(""),
            debounceTime(700),
            map(value => this._searchedWord(value))
        );
    }

    private _searchedWord(value: string): string[] {
        const searchValue = value.toLowerCase();


        // console.log(searchValue);
        // if (searchValue.length > 2) {
            return this.entries
                .filter(entrie => {
                    return entrie.toLowerCase().indexOf(searchValue) === 0;
                });
                // .slice(1,20));
        // }
        return null;
    }

    updateData(value) {
        this.searchQuery.setValue(value);
        //console.log(this.sentence);
    }

    getRelationsType() {

        this.RelationsNames = new Array();
        
        query: String = this.searchQuery.value;
        console.log("AAAh : " + query);

        if (query.length > 3) {
            this.jdmservice.getRelationType(this.searchQuery.value).subscribe(data => {
                this.RelationsNames = data;
                console.log("data update");
                //		
            });
        }

        console.log("EEEEHHH !!");
        
    }

    ngOnDestroy(): void {
        this.dataSubscription.unsubscribe();
    }
}
