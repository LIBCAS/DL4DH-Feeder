package cz.inqool.dl4dh.feeder.repository;

import cz.inqool.dl4dh.feeder.model.ExportItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExportItemRepository extends JpaRepository<ExportItem, UUID> {

}
