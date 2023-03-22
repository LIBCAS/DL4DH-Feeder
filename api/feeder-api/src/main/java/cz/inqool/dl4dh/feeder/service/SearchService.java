package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.SearchDto;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.model.Filter;

import java.util.List;

public interface SearchService {

    List<String> hint(String query);
    List<String> hint(String query, NameTagEntityType nameTagType);
    void saveSearch(Filter filters, String username);
    SearchDto search(Filter filters);

}
