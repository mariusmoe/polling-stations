# Solidsquare case - 11.02.2021

Etter å ha lest oppgaven tenkte jeg raskt igjennom føgende teknologier for å løse oppgaven:

- Firebase + Angular

  - pro: Firebase lar en lagre og søke med lokasjonsdata. Mulighet for å deploye koden for ekstra Shazam!
  
  - con: Får ikke vist så mye mer enn Angular kode. Kronglete å importere data med gcloud util(data må behandles i tilleg).

- MongoDB + Express + Angular

  - pro: Kjenner godt til stacken.

  - con: Litt tungvint å gjøre manipulering av data for å få lokasjonsobjekter. Rangert søk blir ofte ikke så bra(personlig erfaring).

- Elasticsearch + hapi + Angular

  - pro: Superenkelt å importere data og få lokasjonsobjekter i elasticsearch. Lagd for søk. Hapi har mindre setup overhead enn express.

  - con: Har ikke jobbet så my med elasticsearch.

En Java backend kunne også vært aktuelt, men Node kommer man litt raskere igang med.

## Notater til framgang

Satte opp elasticsearch med docker. Brukte Kibana File Data Visualizer wizard for å importere data. Var nødt til å legge til følgende:

``` text
## i mappings
    "location": {
        "type": "geo_point"
    } 
## i ingest pipeline
    {
      "append": {
        "field": "location",
        "value": ["{{gps_coordinates}}"]
      }
    }
```

Selv om elasticsearch er rakt er query DSL-en kronglete å skrive.
