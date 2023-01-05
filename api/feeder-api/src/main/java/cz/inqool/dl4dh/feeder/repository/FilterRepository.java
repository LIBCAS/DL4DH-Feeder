package cz.inqool.dl4dh.feeder.repository;

import cz.inqool.dl4dh.feeder.model.Filter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilterRepository extends PagingAndSortingRepository<Filter, Long> {
	Page<Filter> findByUsername(String username, Pageable pageable);
}
