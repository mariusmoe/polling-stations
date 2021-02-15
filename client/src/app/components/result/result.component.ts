import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SearchService } from 'src/app/services/search.service';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ResultComponent implements OnInit {
  searchResult: any;
  expandedTable = false;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.getData().subscribe((sub) => {
      this.searchResult = sub?.data?.hits;
    });
  }

  columnsToDisplay = [
    'county_name',
    'municipality_name',
    'polling_place_name',
    'address_line',
  ];
  norwegianColumnNames = [
    'fylkesnavn',
    'Kommunenavn',
    'Valglokale',
    'Addresse',
  ];
  expandedElement!: PeriodicElement | null;

  toggleExpandTable() {
    this.expandedTable = !this.expandedTable;
    console.log(this.expandedTable);
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}
