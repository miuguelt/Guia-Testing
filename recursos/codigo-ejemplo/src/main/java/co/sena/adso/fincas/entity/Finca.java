package co.sena.adso.fincas.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "fincas")
public class Finca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotBlank
    @Column(nullable = false)
    private String propietario;

    private String vereda;

    @NotBlank
    @Column(nullable = false)
    private String municipio;

    @Positive
    @Column(nullable = false)
    private Double hectareas;

    public Finca() {}

    public Finca(Long id, String nombre, String propietario, String vereda, String municipio, Double hectareas) {
        this.id = id;
        this.nombre = nombre;
        this.propietario = propietario;
        this.vereda = vereda;
        this.municipio = municipio;
        this.hectareas = hectareas;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getPropietario() { return propietario; }
    public void setPropietario(String propietario) { this.propietario = propietario; }

    public String getVereda() { return vereda; }
    public void setVereda(String vereda) { this.vereda = vereda; }

    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }

    public Double getHectareas() { return hectareas; }
    public void setHectareas(Double hectareas) { this.hectareas = hectareas; }
}
