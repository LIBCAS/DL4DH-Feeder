package cz.inqool.dl4dh.feeder.enums;

import lombok.Getter;

@Getter
public enum AdvancedFilterFieldEnum {
    TITLE("dc.title"),
    AUTHOR("dc.creator"),
    KEYWORDS("keywords"),
    NUMBERS_IN_ADDRESSES("nameTag.numbersInAddresses"),
    GEOGRAPHICAL_NAMES("nameTag.geographicalNames"),
    INSTITUTIONS("nameTag.institutions"),
    MEDIA_NAMES("nameTag.mediaNames"),
    NUMBER_EXPRESSIONS("nameTag.numberExpressions"),
    ARTIFACT_NAMES("nameTag.artifactNames"),
    PERSONAL_NAMES("nameTag.personalNames"),
    TIME_EXPRESSIONS("nameTag.timeExpression"),
    COMPLEX_PERSON_NAMES("nameTag.complexPersonNames"),
    COMPLEX_TIME_EXPRESSION("nameTag.complexTimeExpression"),
    COMPLEX_ADDRESS_EXPRESSION("nameTag.complexAddressExpression"),
    COMPLEX_BIBLIO_EXPRESSION("nameTag.complexBiblioExpression"),
//    ALL("dc.title^10 "+
//            "dc.creator^2 "+
//            "keywords " +
//            "nameTag.numbersInAddresses "+
//            "nameTag.geographicalNames "+
//            "nameTag.institutions "+
//            "nameTag.mediaNames "+
//            "nameTag.numberExpressions "+
//            "nameTag.artifactNames "+
//            "nameTag.personalNames "+
//            "nameTag.timeExpression "+
//            "nameTag.complexPersonNames "+
//            "nameTag.complexTimeExpression "+
//            "nameTag.complexAddressExpression "+
//            "nameTag.complexBiblioExpression"),
    NONE("");

    private final String solrField;

    AdvancedFilterFieldEnum(String solrField) {
        this.solrField = solrField;
    }

}
