package co.sena.adso.fincas.service;

import co.sena.adso.fincas.dto.FincaRequest;
import co.sena.adso.fincas.entity.Finca;
import co.sena.adso.fincas.repository.FincaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FincaService {

    private final FincaRepository repository;

    public FincaService(FincaRepository repository) {
        this.repository = repository;
    }

    public List<Finca> listar() {
        return repository.findAll();
    }

    public Finca obtenerPorId(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Finca no encontrada con id: " + id));
    }

    public Finca crear(FincaRequest request) {
        Finca finca = new Finca();
        finca.setNombre(request.nombre());
        finca.setPropietario(request.propietario());
        finca.setVereda(request.vereda());
        finca.setMunicipio(request.municipio());
        finca.setHectareas(request.hectareas());
        return repository.save(finca);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Finca no encontrada con id: " + id);
        }
        repository.deleteById(id);
    }
}
