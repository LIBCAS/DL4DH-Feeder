package cz.inqool.dl4dh.feeder.enums;

import cz.inqool.dl4dh.feeder.service.KrameriusSolrFieldsService;

public enum FiltersSortEnum {
    TITLE_ASC,
    CREATED_DESC,
    DATE_ASC,
    DATE_DESC,
    LAST_ENRICHED,
    PAGE_TITLE_ASC,
    PAGE_LAST_ENRICHED;

    public String toSolrSort(boolean kplus, KrameriusSolrFieldsService solrFields) {
        switch (this) {
            case TITLE_ASC:
                return solrFields.titleSort()+" asc";

            case PAGE_TITLE_ASC:
                return solrFields.rootTitle()+" asc";

            case CREATED_DESC:
                return solrFields.created()+" desc";

            case DATE_ASC:
                return solrFields.dateFrom()+" asc";

            case DATE_DESC:
                return solrFields.dateTo()+" desc, "+solrFields.dateFrom()+" desc";

            case LAST_ENRICHED:
                return kplus ? "import_date desc, "+solrFields.titleSort()+" asc" : null;

            case PAGE_LAST_ENRICHED:
                return kplus ? "import_date desc, "+solrFields.rootTitle()+" asc" : null;

            default:
                return null;
        }
    }
}
