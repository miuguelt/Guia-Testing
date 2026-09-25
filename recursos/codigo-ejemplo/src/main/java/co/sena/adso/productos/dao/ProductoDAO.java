package co.sena.adso.productos.dao;

import co.sena.adso.productos.model.Producto;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** JDBC example kept separate from the Spring Data JPA fincas application. */
public final class ProductoDAO {
    private static final String INSERT_SQL =
        "INSERT INTO productos (nombre, precio, stock, categoria) VALUES (?, ?, ?, ?)";
    private static final String SELECT_SQL =
        "SELECT id, nombre, precio, stock, categoria FROM productos";

    private final Connection connection;

    public ProductoDAO(Connection connection) {
        this.connection = Objects.requireNonNull(connection, "connection is required");
    }

    public boolean crear(Producto producto) throws SQLException {
        Objects.requireNonNull(producto, "producto is required");
        try (PreparedStatement statement = connection.prepareStatement(INSERT_SQL)) {
            statement.setString(1, producto.getNombre());
            statement.setDouble(2, producto.getPrecio());
            statement.setInt(3, producto.getStock());
            statement.setString(4, producto.getCategoria());
            return statement.executeUpdate() > 0;
        }
    }

    public List<Producto> listar() throws SQLException {
        List<Producto> productos = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(SELECT_SQL);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                productos.add(new Producto(
                    resultSet.getInt("id"),
                    resultSet.getString("nombre"),
                    resultSet.getDouble("precio"),
                    resultSet.getInt("stock"),
                    resultSet.getString("categoria")
                ));
            }
        }
        return productos;
    }
}
