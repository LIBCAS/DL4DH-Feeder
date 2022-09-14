package cz.inqool.dl4dh.feeder.enums;

import lombok.Getter;

/**
 * @author Norbert Bodnar
 */
@Getter
public enum NameTagEntityType {
    NUMBERS_IN_ADDRESSES('a', "nameTag.numbersInAddresses"),
    GEOGRAPHICAL_NAMES('g', "nameTag.geographicalNames"),
    INSTITUTIONS('i', "nameTag.institutions"),
    MEDIA_NAMES('m', "nameTag.mediaNames"),
    NUMBER_EXPRESSIONS('n', "nameTag.numberExpressions"),
    ARTIFACT_NAMES('o', "nameTag.artifactNames"),
    PERSONAL_NAMES('p', "nameTag.personalNames"),
    TIME_EXPRESSIONS('t', "nameTag.timeExpression"),
    COMPLEX_PERSON_NAMES('P', "nameTag.complexPersonNames"),
    COMPLEX_TIME_EXPRESSION('T', "nameTag.complexTimeExpression"),
    COMPLEX_ADDRESS_EXPRESSION('A', "nameTag.complexAddressExpression"),
    COMPLEX_BIBLIO_EXPRESSION('C', "nameTag.complexBiblioExpression"),
    ALL('*', "nameTag.numbersInAddresses,"+
            "nameTag.geographicalNames,"+
            "nameTag.institutions,"+
            "nameTag.mediaNames,"+
            "nameTag.numberExpressions,"+
            "nameTag.artifactNames,"+
            "nameTag.personalNames,"+
            "nameTag.timeExpression,"+
            "nameTag.complexPersonNames,"+
            "nameTag.complexTimeExpression,"+
            "nameTag.complexAddressExpression,"+
            "nameTag.complexBiblioExpression");

    private final char typeSymbol;
    private final String solrField;

    NameTagEntityType(char ch, String solrField) {
        this.typeSymbol = ch;
        this.solrField = solrField;
    }

    public static NameTagEntityType fromString(String stringValue) {
        if (stringValue == null || stringValue.isEmpty()) {
            throw new IllegalArgumentException("Missing argument value");
        }

        char firstChar = stringValue.charAt(0);

        for (NameTagEntityType namedEntityType : NameTagEntityType.values()) {
            if (namedEntityType.getTypeSymbol() == firstChar) {
                return namedEntityType;
            }
        }

        throw new IllegalArgumentException("Cannot construct NamedEntityType enum from value: " + stringValue);
    }

    public static NameTagEntityType fromSolrField(String solrField) {
        if (solrField == null || solrField.isEmpty()) {
            throw new IllegalArgumentException("Missing argument value");
        }

        for (NameTagEntityType namedEntityType : NameTagEntityType.values()) {
            if (namedEntityType.getSolrField().equals(solrField)) {
                return namedEntityType;
            }
        }

        throw new IllegalArgumentException("Cannot construct NamedEntityType enum from value: " + solrField);
    }
}
