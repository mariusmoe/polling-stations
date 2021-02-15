import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, AfterViewInit {
  location: { lat: number; lon: number } | undefined;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getLocation();

    const initSearch = {
      size: 10,
      query: 'oslo',
      filter: {
        locationFilter: {
          distance: '5000km',
          location: {
            lat: 59.910465,
            lon: 10.748851,
          },
        },
      },
    };
    this.searchService.search(initSearch);
  }

  form = new FormGroup({});
  model: any = {
    query: "",
    showAdvancedSearch: false,
    slider: 5000,
    myLocation: false,
  };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'query',
      type: 'input',
      templateOptions: {
        placeholder: 'Søk',
        appearance: 'outline',
      },
    },
    {
      key: 'myLocation',
      type: 'checkbox',
      templateOptions: {
        label: 'Use my location',
        // description: 'In order to proceed, please accept terms',
        pattern: 'true',
      },
      hideExpression: '!model.showAdvancedSearch',
      expressionProperties: {
        'templateOptions.disabled': 'model.place',
      },
    },
    {
      key: 'place',
      type: 'input',
      templateOptions: {
        placeholder: 'Sted',
        appearance: 'outline',
      },
      hideExpression: '!model.showAdvancedSearch',
    },
    {
      key: 'slider',
      type: 'slider',
      templateOptions: {
        label: 'Antall kilometer fra valgt sed',
        thumbLabel: true,
        max: 1000,
        min: 1,
        step: 1,
      },
      hideExpression: '!model.showAdvancedSearch',
    },
  ];

  toggleShowAdvancedSearch() {
    this.model.showAdvancedSearch = !this.model.showAdvancedSearch;
  }

  startSearch() {
    const locationFilter = {
      locationFilter: {
        distance: `${this.model.slider}km`,
        location: {
          lat: this.location?.lat,
          lon: this.location?.lon,
        },
      },
    };

    const searchParam = {
      size: 10,
      query: this.model.query,
      filter: this.location || this.model.place ?  locationFilter : {},
      place: this.model.place
    };


    console.log('searching: ', JSON.stringify(searchParam, null, 2));

    this.searchService.search(searchParam);
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.callApi(longitude, latitude);
      });
    } else {
      console.log('No support for geolocation');
    }
  }

  callApi(lon: number, lat: number) {
    this.location = { lat: lat, lon: lon };
  }
}
