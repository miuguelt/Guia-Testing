package co.sena.adso.fincas.repository;

import co.sena.adso.fincas.entity.Finca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FincaRepository extends JpaRepository<Finca, Long> {
}
