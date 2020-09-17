import { Component, OnInit } from '@angular/core';
import { JdmRequestService } from '../jdm-request.service';

@Component({
    selector: 'app-relation-type-search',
    templateUrl: './relation-type-search.component.html',
    styleUrls: ['./relation-type-search.component.css']
})
export class RelationTypeSearchComponent implements OnInit {

    private RelationsNames: any[] = new Array();
    private word: any;

    constructor(private jdmservice: JdmRequestService) { }

    ngOnInit() {
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
}
