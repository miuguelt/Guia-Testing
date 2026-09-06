import co.sena.adso.fincas.controller.FincaController;
import co.sena.adso.fincas.dto.FincaRequest;
import co.sena.adso.fincas.entity.Finca;
import co.sena.adso.fincas.service.FincaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FincaController.class)
@DisplayName("FincaController - Tests del API REST")
class FincaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FincaService service;

    private Finca fincaEjemplo;

    @BeforeEach
    void setUp() {
        fincaEjemplo = new Finca(1L, "La Esperanza", "Carlos", "El Gualilo", "Vélez", 12.5);
    }

    @Test
    @DisplayName("GET /api/fincas retorna 200 con lista JSON")
    void testListar() throws Exception {
        when(service.listar()).thenReturn(List.of(fincaEjemplo));

        mockMvc.perform(get("/api/fincas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.size()").value(1))
            .andExpect(jsonPath("$[0].nombre").value("La Esperanza"));
    }

    @Test
    @DisplayName("GET /api/fincas retorna 200 con lista vacia")
    void testListarVacio() throws Exception {
        when(service.listar()).thenReturn(List.of());

        mockMvc.perform(get("/api/fincas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.size()").value(0));
    }

    @Test
    @DisplayName("GET /api/fincas/1 retorna 200 con finca JSON")
    void testObtenerPorId() throws Exception {
        when(service.obtenerPorId(1L)).thenReturn(fincaEjemplo);

        mockMvc.perform(get("/api/fincas/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nombre").value("La Esperanza"))
            .andExpect(jsonPath("$.propietario").value("Carlos"))
            .andExpect(jsonPath("$.hectareas").value(12.5));
    }

    @Test
    @DisplayName("GET /api/fincas/999 retorna 404")
    void testObtenerPorIdNoExistente() throws Exception {
        when(service.obtenerPorId(999L))
            .thenThrow(new IllegalArgumentException("Finca no encontrada con id: 999"));

        mockMvc.perform(get("/api/fincas/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("Finca no encontrada con id: 999"));
    }

    @Test
    @DisplayName("POST /api/fincas retorna 201 con finca creada")
    void testCrear() throws Exception {
        FincaRequest request = new FincaRequest("La Esperanza", "Carlos", "El Gualilo", "Vélez", 12.5);
        when(service.crear(any())).thenReturn(fincaEjemplo);

        mockMvc.perform(post("/api/fincas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.nombre").value("La Esperanza"));
    }

    @Test
    @DisplayName("POST /api/fincas con datos invalidos retorna 400")
    void testCrearConDatosInvalidos() throws Exception {
        FincaRequest request = new FincaRequest("", "", "", "", -1.0);

        mockMvc.perform(post("/api/fincas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/fincas/1 retorna 204")
    void testEliminar() throws Exception {
        doNothing().when(service).eliminar(1L);

        mockMvc.perform(delete("/api/fincas/1"))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/fincas/999 retorna 404")
    void testEliminarNoExistente() throws Exception {
        doThrow(new IllegalArgumentException("Finca no encontrada con id: 999"))
            .when(service).eliminar(999L);

        mockMvc.perform(delete("/api/fincas/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("Finca no encontrada con id: 999"));
    }
}
