# polling-stations
Søk og finn valglokaler nær deg!

## Hvordan sette opp

Forutsetninger:
  
  - Node 14 og npm
  - Angular CLI (```  npm install -g @angular/cli  ```)
  - docker v20.10.2+
  - elasticdump (```  npm install elasticdump -g  ```)



``` shell
$ cd  elasticsearch7-docker

$ docker-compose up -d
```

``` shell
$ elasticdump \
    --input=../my_index_data.json \
    --output=http://localhost:9200/polling-station \
    --type=data
```

``` shell
$ elasticdump \
    --input=http://localhost:9200/polling-station \
    --output=./index_mapping.json \
    --type=mapping
``` 

I hver sin terminal:

``` shell
$ cd server
$ npm run dev
```

``` shell
$ cd  client

$ ng serve
```

notat: lag en docker-compose med services til neste gang