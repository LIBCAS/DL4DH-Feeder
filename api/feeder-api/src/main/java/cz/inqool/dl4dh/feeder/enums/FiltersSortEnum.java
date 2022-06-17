package cz.inqool.dl4dh.feeder.enums;

public enum FiltersSortEnum {
    TITLE_ASC,
    CREATED_DESC,
    DATE_ASC,
    DATE_DESC;

    public String toSolrSort() {
        switch (this) {
            case TITLE_ASC:
                return "title_sort asc";

            case CREATED_DESC:
                return "created_date desc";

            case DATE_ASC:
                return "datum_begin asc";

            case DATE_DESC:
                return "datum_end desc, datum_begin desc";

            default:
                return null;
        }
    }
}
