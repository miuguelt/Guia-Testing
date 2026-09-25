import co.sena.adso.productos.dao.ProductoDAO;
import co.sena.adso.productos.model.Producto;
import org.junit.jupiter.api.*;
import java.sql.*;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("ProductoDAO - Tests del CRUD")
class ProductoDAOTest {

    private Connection mockConn;
    private PreparedStatement mockStmt;
    private ResultSet mockRs;

    @BeforeEach
    void setUp() throws SQLException {
        mockConn = mock(Connection.class);
        mockStmt = mock(PreparedStatement.class);
        mockRs = mock(ResultSet.class);
        when(mockConn.prepareStatement(anyString())).thenReturn(mockStmt);
    }

    @Test
    @DisplayName("crear producto ejecuta INSERT correctamente")
    void testCrearProducto() throws SQLException {
        when(mockStmt.executeUpdate()).thenReturn(1);
        Producto p = new Producto(0, "Laptop", 1500.0, 10, "Electronica");
        ProductoDAO dao = new ProductoDAO(mockConn);
        boolean result = dao.crear(p);
        assertTrue(result);
        verify(mockStmt).executeUpdate();
    }

    @Test
    @DisplayName("listar productos retorna lista")
    void testListarProductos() throws SQLException {
        when(mockStmt.executeQuery()).thenReturn(mockRs);
        when(mockRs.next()).thenReturn(true, false);
        when(mockRs.getInt("id")).thenReturn(1);
        when(mockRs.getString("nombre")).thenReturn("Mouse");
        when(mockRs.getDouble("precio")).thenReturn(25.0);
        ProductoDAO dao = new ProductoDAO(mockConn);
        List<Producto> productos = dao.listar();
        assertEquals(1, productos.size());
    }
}
