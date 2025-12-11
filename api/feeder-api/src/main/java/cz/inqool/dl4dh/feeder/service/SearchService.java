package cz.inqool.dl4dh.feeder.service;

import cz.inqool.dl4dh.feeder.dto.SearchDto;
import cz.inqool.dl4dh.feeder.enums.NameTagEntityType;
import cz.inqool.dl4dh.feeder.model.Filter;

import java.util.List;
import java.util.Set;

public interface SearchService {

    List<String> hint(String query, boolean publicOnly);
    List<String> hint(String query, NameTagEntityType nameTagType, boolean publicOnly);
    void saveSearch(Filter filters, String username);
    SearchDto search(Filter filters);
    boolean areEnriched(Set<String> PIDs);

}
