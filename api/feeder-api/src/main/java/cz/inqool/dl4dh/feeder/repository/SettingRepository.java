package cz.inqool.dl4dh.feeder.repository;

import cz.inqool.dl4dh.feeder.model.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingRepository extends JpaRepository<Setting, String> {
	
}
