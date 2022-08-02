package cz.inqool.dl4dh.feeder.repository;

import cz.inqool.dl4dh.feeder.model.Export;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExportRepository extends JpaRepository<Export, Long> {
	List<Export> findByUsername(String username);
}
