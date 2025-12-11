package cz.inqool.dl4dh.feeder.service;

import java.util.List;

public interface KrameriusSolrFieldsService {

    String pid();
    String rootPid();
    String parentPid();
    String accessibility();
    String model();
    String author();
    String title();
    String rootTitle();
    String dateFrom();
    String dateTo();
    String dateYearFrom();
    String dateYearTo();
    String date();
    String keywords();
    String language();
    String collection();
    String created();
    String titleSort();
    String authorFacet();
    String modelPath();
    String textOcr();
    String licenses();

    List<String> facetBaseList();
    List<String> filterBaseList(boolean throughPages, boolean throughArticles);

}
