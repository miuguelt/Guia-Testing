package co.sena.adso.fincas.controller;

import co.sena.adso.fincas.dto.FincaRequest;
import co.sena.adso.fincas.entity.Finca;
import co.sena.adso.fincas.service.FincaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fincas")
public class FincaController {

    private final FincaService service;

    public FincaController(FincaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Finca>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Finca> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Finca> crear(@Valid @RequestBody FincaRequest request) {
        Finca finca = service.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(finca);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
