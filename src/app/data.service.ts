import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private dataURL = "http://localhost:8888/api/data"
    private entries: string[] = [];

    constructor(private httpClient: HttpClient, private router: Router) { }

    getEntries(): Observable<string[]> {
        return this.httpClient.get<string[]>(this.dataURL);
    }
}