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
$ cd ..
$ elasticdump \
    --input=./index_mapping.json \
    --output=http://localhost:9200/polling-station \
    --type=mapping
```

``` shell
$ elasticdump \
    --input=./index_data.json \
    --output=http://localhost:9200/polling-station \
    --type=data
```
Gå til http://localhost:5601/ stack management > Index patterns og klikk på 'create index pattern'
Skriv inn polling-station og følg veiviseren.

``` shell
elasticdump \
  --input=./index_analyzer.json \
  --output=http://localhost:9200/polling-station \
  --type=analyzer
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
