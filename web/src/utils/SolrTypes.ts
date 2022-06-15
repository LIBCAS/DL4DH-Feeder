export type SolrParams = {
	query?: string;
	searchAfter?: string;
	flipDirection?: boolean;
	start?: number;
	pageSize?: number;
	yearFrom?: string;
	yearTo?: string;
};
/*
{
    "query": "string",
    "availability": "PUBLIC",
    "models": [
      "MONOGRAPH"
    ],
    "keywords": [
      "string"
    ],
    "authors": [
      "string"
    ],
    "languages": [
      "string"
    ],
    "collections": [
      "string"
    ],
    "yearFrom": 0,
    "yearTo": 0,
    "start": 0,
    "pageSize": 0
  }*/
