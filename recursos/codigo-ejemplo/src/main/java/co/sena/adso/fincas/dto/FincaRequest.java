package co.sena.adso.fincas.dto;

import jakarta.validation.constraints.*;

public record FincaRequest(
    @NotBlank String nombre,
    @NotBlank String propietario,
    String vereda,
    @NotBlank String municipio,
    @Positive Double hectareas
) {}
