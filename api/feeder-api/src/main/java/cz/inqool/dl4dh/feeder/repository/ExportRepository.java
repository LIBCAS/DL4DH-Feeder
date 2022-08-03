package cz.inqool.dl4dh.feeder.repository;

import cz.inqool.dl4dh.feeder.model.Export;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExportRepository extends PagingAndSortingRepository<Export, Long> {
	Page<Export> findByUsername(String username, Pageable pageable);
}
