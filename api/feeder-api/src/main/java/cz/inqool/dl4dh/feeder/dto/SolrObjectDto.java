package cz.inqool.dl4dh.feeder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.apache.solr.client.solrj.beans.Field;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SolrObjectDto {
    @Field
    @NotNull
    private final String PID;

    @Field
    @NotNull
    private final String root_pid;

    @Field
    private List<String> collection;

    @Field
    private Integer datum_begin;

    @Field
    private Integer datum_end;

    @Field
    private String import_date;

    @Field
    private String created_date;

    @Field("dc.creator")
    private List<String> creator;

    @Field("dc.title")
    private String title;

    @Field
    private String title_sort;

    @Field
    private String dostupnost;

    @Field("fedora.model")
    private String model;

    @Field
    private List<String> facet_autor;

    @Field
    private List<String> model_path;

    @Field
    private List<String> keywords;

    @Field
    private List<String> language;

    @Field("nameTag.numbersInAddresses")
    private List<String> numbersInAddresses = new ArrayList<>();

    @Field("nameTag.geographicalNames")
    private List<String> geographicalNames = new ArrayList<>();

    @Field("nameTag.institutions")
    private List<String> institutions = new ArrayList<>();

    @Field("nameTag.mediaNames")
    private List<String> mediaNames = new ArrayList<>();

    @Field("nameTag.numberExpressions")
    private List<String> numberExpressions = new ArrayList<>();

    @Field("nameTag.artifactNames")
    private List<String> artifactNames = new ArrayList<>();

    @Field("nameTag.personalNames")
    private List<String> personalNames = new ArrayList<>();

    @Field("nameTag.timeExpression")
    private List<String> timeExpression = new ArrayList<>();

    @Field("nameTag.complexPersonNames")
    private List<String> complexPersonNames = new ArrayList<>();

    @Field("nameTag.complexTimeExpression")
    private List<String> complexTimeExpression = new ArrayList<>();

    @Field("nameTag.complexAddressExpression")
    private List<String> complexAddressExpression = new ArrayList<>();

    @Field("nameTag.complexBiblioExpression")
    private List<String> complexBiblioExpression = new ArrayList<>();
}
