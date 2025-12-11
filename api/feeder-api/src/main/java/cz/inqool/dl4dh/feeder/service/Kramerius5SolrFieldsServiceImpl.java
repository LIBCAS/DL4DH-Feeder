package cz.inqool.dl4dh.feeder.service;

import java.util.List;

public class Kramerius5SolrFieldsServiceImpl implements KrameriusSolrFieldsService {

    @Override
    public String pid() {
        return "PID";
    }

    @Override
    public String rootPid() {
        return "root_pid";
    }

    @Override
    public String parentPid() {
        return "parent_pid";
    }

    @Override
    public String accessibility() {
        return "dostupnost";
    }

    @Override
    public String model() {
        return "fedora.model";
    }

    @Override
    public String author() {
        return "dc.creator";
    }

    @Override
    public String title() {
        return "dc.title";
    }

    @Override
    public String dateFrom() {
        return "datum_begin";
    }

    @Override
    public String dateTo() {
        return "datum_end";
    }

    @Override
    public String date() {
        return "datum_str";
    }

    @Override
    public String dateYearFrom() {
        return "datum_begin";
    }

    @Override
    public String dateYearTo() {
        return "datum_end";
    }

    @Override
    public String keywords() {
        return "keywords";
    }

    @Override
    public String language() {
        return "language";
    }

    @Override
    public String collection() {
        return "collection";
    }

    @Override
    public String created() {
        return "created_date";
    }

    @Override
    public String titleSort() {
        return "title_sort";
    }

    @Override
    public String authorFacet() {
        return "facet_autor";
    }

    @Override
    public String modelPath() {
        return "model_path";
    }

    @Override
    public String textOcr() {
        return "text_ocr";
    }

    @Override
    public String rootTitle() {
        return "root_title";
    }

    @Override
    public String licenses() {
        return "dnnt-labels";
    }

    @Override
    public List<String> facetBaseList() {
        return List.of(keywords(),
                language(),
                authorFacet(),
                modelPath(),
                accessibility(),
                collection(),
                dateYearFrom());
    }

    @Override
    public List<String> filterBaseList(boolean throughPages, boolean throughArticles) {
        if (throughPages) {
            return List.of(model()+":page");
        }
        if (throughArticles) {
            return List.of(model()+":monograph",
                    model()+":periodical",
                    model()+":map",
                    model()+":sheetmusic",
                    model()+":monographunit",
                    model()+":page",
                    model()+":article");
        }
        return List.of(model()+":monograph",
                model()+":periodical",
                model()+":map",
                model()+":sheetmusic",
                model()+":monographunit");
    }
}
