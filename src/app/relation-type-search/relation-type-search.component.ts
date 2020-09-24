import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
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
        this.dataSubscription = this.dataService.getEntries().subscribe(data => {
            // this.entries = data;
            console.log(data);
        });

        this.searchedWord = this.searchQuery.valueChanges.pipe(
            startWith(''),
            map((value) => this._searchedWord(value))
        );
    }

    private _searchedWord(value: string): string[] {
        const searchValue = value.toLowerCase();

        return this.entries.filter(
            (entrie) => entrie.toLowerCase().indexOf(searchValue) === 0
        );
    }

    updateData(value) {
        this.word = value;
        //console.log(this.sentence);
    }

    getRelationsType() {

        this.RelationsNames = new Array();

        this.jdmservice.getRelationType(this.word).subscribe(data => {
            this.RelationsNames = data;
            console.log("data update");
            //		
        });
    }

    ngOnDestroy(): void {
        this.dataSubscription.unsubscribe();
    }
}
