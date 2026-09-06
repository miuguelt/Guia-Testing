import co.sena.adso.fincas.dto.FincaRequest;
import co.sena.adso.fincas.entity.Finca;
import co.sena.adso.fincas.repository.FincaRepository;
import co.sena.adso.fincas.service.FincaService;
import org.junit.jupiter.api.*;
import org.mockito.*;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("FincaService - Tests de logica de negocio")
class FincaServiceTest {

    @Mock
    private FincaRepository repository;

    @InjectMocks
    private FincaService service;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    @DisplayName("listar retorna todas las fincas")
    void testListar() {
        when(repository.findAll()).thenReturn(List.of(
            new Finca(1L, "La Esperanza", "Carlos", "El Gualilo", "Vélez", 12.5),
            new Finca(2L, "El Porvenir", "Ana", "La Loma", "Puente Nacional", 8.0)
        ));

        List<Finca> resultado = service.listar();

        assertEquals(2, resultado.size());
        assertEquals("La Esperanza", resultado.get(0).getNombre());
        verify(repository).findAll();
    }

    @Test
    @DisplayName("listar retorna lista vacia cuando no hay fincas")
    void testListarVacio() {
        when(repository.findAll()).thenReturn(List.of());

        List<Finca> resultado = service.listar();

        assertTrue(resultado.isEmpty());
        verify(repository).findAll();
    }

    @Test
    @DisplayName("obtenerPorId retorna finca cuando existe")
    void testObtenerPorId() {
        Finca finca = new Finca(1L, "La Esperanza", "Carlos", "El Gualilo", "Vélez", 12.5);
        when(repository.findById(1L)).thenReturn(Optional.of(finca));

        Finca resultado = service.obtenerPorId(1L);

        assertEquals("La Esperanza", resultado.getNombre());
        assertEquals(12.5, resultado.getHectareas());
        verify(repository).findById(1L);
    }

    @Test
    @DisplayName("obtenerPorId lanza excepcion cuando no existe")
    void testObtenerPorIdNoExistente() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
            () -> service.obtenerPorId(999L),
            "Finca no encontrada con id: 999"
        );
        verify(repository).findById(999L);
    }

    @Test
    @DisplayName("crear guarda y retorna la finca")
    void testCrear() {
        FincaRequest request = new FincaRequest("Nueva", "Pedro", "Centro", "Vélez", 5.0);
        Finca fincaGuardada = new Finca(1L, "Nueva", "Pedro", "Centro", "Vélez", 5.0);
        when(repository.save(any(Finca.class))).thenReturn(fincaGuardada);

        Finca resultado = service.crear(request);

        assertNotNull(resultado.getId());
        assertEquals("Nueva", resultado.getNombre());
        assertEquals("Pedro", resultado.getPropietario());
        assertEquals(5.0, resultado.getHectareas());
        verify(repository).save(any(Finca.class));
    }

    @Test
    @DisplayName("eliminar elimina finca existente")
    void testEliminar() {
        when(repository.existsById(1L)).thenReturn(true);

        service.eliminar(1L);

        verify(repository).existsById(1L);
        verify(repository).deleteById(1L);
    }

    @Test
    @DisplayName("eliminar lanza excepcion cuando no existe")
    void testEliminarNoExistente() {
        when(repository.existsById(999L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class,
            () -> service.eliminar(999L),
            "Finca no encontrada con id: 999"
        );
        verify(repository).existsById(999L);
        verify(repository, never()).deleteById(any());
    }
}
