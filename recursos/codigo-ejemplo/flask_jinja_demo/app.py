"""Aplicacion Flask minima para practicar Playwright sobre HTML renderizado."""

import os

from flask import Flask, flash, redirect, render_template, request, session, url_for


def create_app():
    app = Flask(__name__)
    secret_key = os.environ.get("FLASK_SECRET_KEY")
    if not secret_key:
        raise RuntimeError("Define FLASK_SECRET_KEY antes de iniciar la demostracion.")
    app.config["SECRET_KEY"] = secret_key
    @app.get("/")
    def home():
        return redirect(url_for("products_view"))

    @app.route("/productos", methods=["GET", "POST"])
    def products_view():
        products = session.get("products", [])
        if request.method == "POST":
            name = request.form.get("nombre", "").strip()
            price_text = request.form.get("precio", "").strip()

            if not name:
                flash("El nombre es obligatorio.", "error")
                return render_template("productos.html", products=products), 400

            try:
                price = float(price_text)
            except ValueError:
                price = 0

            if price <= 0:
                flash("El precio debe ser mayor que cero.", "error")
                return render_template("productos.html", products=products), 400

            products.append({"nombre": name, "precio": f"{price:.2f}"})
            session["products"] = products
            flash("Producto creado.", "success")
            return redirect(url_for("products_view"))

        return render_template("productos.html", products=products)

    return app


app = create_app()
