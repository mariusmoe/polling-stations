import { Component } from '@angular/core';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  searchResult: any;

  lat = 59.910465;
  lon = 10.748851;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.getData().subscribe((sub) => {
      this.searchResult = sub?.data?.hits;
    });
  }

  getLat(location: string): number {
    if (location) {
      return +location.split(',')[0];
    }
    return 59.94052059999999;
  }

  getLon(location: string): number {
    if (location) {
      return +location.split(',')[1];
    }
    return 11;
  }
}
