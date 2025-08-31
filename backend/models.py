from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Produk(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    harga = db.Column(db.Float, nullable=False)
    stok = db.Column(db.Integer, nullable=False)

class Penjualan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    produk_id = db.Column(db.Integer, db.ForeignKey("produk.id"))
    jumlah = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Float, nullable=False)
