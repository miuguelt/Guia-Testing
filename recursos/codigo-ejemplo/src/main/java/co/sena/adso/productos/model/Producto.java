package co.sena.adso.productos.model;

/** Simple product model used by the JDBC DAO testing example. */
public final class Producto {
    private final int id;
    private final String nombre;
    private final double precio;
    private final int stock;
    private final String categoria;

    public Producto(int id, String nombre, double precio, int stock, String categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }

    public int getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public int getStock() {
        return stock;
    }

    public String getCategoria() {
        return categoria;
    }
}
