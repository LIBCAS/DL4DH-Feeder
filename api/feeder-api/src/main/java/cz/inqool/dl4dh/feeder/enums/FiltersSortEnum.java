package cz.inqool.dl4dh.feeder.enums;

public enum FiltersSortEnum {
    TITLE_ASC,
    CREATED_DESC,
    DATE_ASC,
    DATE_DESC,
    LAST_ENRICHED,
    PAGE_TITLE_ASC,
    PAGE_LAST_ENRICHED;

    public String toSolrSort(boolean kplus) {
        switch (this) {
            case TITLE_ASC:
                return "title_sort asc";

            case PAGE_TITLE_ASC:
                return "root_title asc";

            case CREATED_DESC:
                return "created_date desc";

            case DATE_ASC:
                return "datum_begin asc";

            case DATE_DESC:
                return "datum_end desc, datum_begin desc";

            case LAST_ENRICHED:
                return kplus ? "import_date desc, title_sort asc" : null;

            case PAGE_LAST_ENRICHED:
                return kplus ? "import_date desc, root_title asc" : null;

            default:
                return null;
        }
    }
}
