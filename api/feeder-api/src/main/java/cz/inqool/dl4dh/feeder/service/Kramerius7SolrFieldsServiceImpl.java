package cz.inqool.dl4dh.feeder.service;

import java.util.List;

public class Kramerius7SolrFieldsServiceImpl implements KrameriusSolrFieldsService {

    @Override
    public String pid() {
        return "pid";
    }

    @Override
    public String rootPid() {
        return "root.pid";
    }

    @Override
    public String parentPid() {
        return "own_parent.pid";
    }

    @Override
    public String accessibility() {
        return "licenses.facet";
    }

    @Override
    public String model() {
        return "model";
    }

    @Override
    public String author() {
        return "authors";
    }

    @Override
    public String title() {
        return "title.search";
    }

    @Override
    public String dateFrom() {
        return "date.min";
    }

    @Override
    public String dateTo() {
        return "date.max";
    }

    @Override
    public String dateYearFrom() {
        return "date_range_start.year";
    }

    @Override
    public String dateYearTo() {
        return "date_range_end.year";
    }

    @Override
    public String date() {
        return "date.str";
    }

    @Override
    public String keywords() {
        return "keywords.search";
    }

    @Override
    public String language() {
        return "languages.facet";
    }

    @Override
    public String collection() {
        return "collection.desc";
    }

    @Override
    public String created() {
        return "created";
    }

    @Override
    public String titleSort() {
        return "title.sort";
    }

    @Override
    public String authorFacet() {
        return "authors.facet";
    }

    @Override
    public String modelPath() {
        return "own_model_path";
    }

    @Override
    public String textOcr() {
        return "text_ocr";
    }

    @Override
    public String rootTitle() {
        return "root.title";
    }

    @Override
    public String licenses() {
        return "licenses.facet";
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
