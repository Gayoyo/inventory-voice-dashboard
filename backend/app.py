from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # biar frontend React bisa akses API

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# ======================
# Model Database
# ======================
class Produk(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    kategori = db.Column(db.String(50))
    harga = db.Column(db.Integer, nullable=False)
    stok = db.Column(db.Integer, default=0)

class Penjualan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    produk_id = db.Column(db.Integer, db.ForeignKey("produk.id"), nullable=False)
    jumlah = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    tanggal = db.Column(db.DateTime, default=datetime.utcnow)

    produk = db.relationship("Produk", backref=db.backref("penjualan", lazy=True))

# ======================
# Endpoint Produk
# ======================
@app.route("/api/produk", methods=["GET"])
def get_produk():
    produk = Produk.query.all()
    return jsonify([
        {"id": p.id, "nama": p.nama, "kategori": p.kategori, "harga": p.harga, "stok": p.stok}
        for p in produk
    ])

@app.route("/api/produk", methods=["POST"])
def add_produk():
    data = request.json
    produk = Produk(
        nama=data["nama"],
        kategori=data.get("kategori", ""),
        harga=data["harga"],
        stok=data.get("stok", 0)
    )
    db.session.add(produk)
    db.session.commit()
    return jsonify({"message": "Produk berhasil ditambahkan"})

# ======================
# Endpoint Penjualan
# ======================
@app.route("/api/penjualan", methods=["GET"])
def get_penjualan():
    penjualan = Penjualan.query.order_by(Penjualan.tanggal.desc()).all()
    return jsonify([
        {
            "id": p.id,
            "nama_produk": p.produk.nama,
            "jumlah": p.jumlah,
            "total": p.total,
            "tanggal": p.tanggal.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for p in penjualan
    ])

@app.route("/api/penjualan", methods=["POST"])
def add_penjualan():
    data = request.json
    produk = Produk.query.get(data["produk_id"])

    if not produk:
        return jsonify({"error": "Produk tidak ditemukan"}), 404
    if produk.stok < data["jumlah"]:
        return jsonify({"error": "Stok tidak mencukupi"}), 400

    total = produk.harga * data["jumlah"]
    penjualan = Penjualan(
        produk_id=produk.id,
        jumlah=data["jumlah"],
        total=total
    )

    # Kurangi stok produk
    produk.stok -= data["jumlah"]

    db.session.add(penjualan)
    db.session.commit()

    return jsonify({"message": "Penjualan berhasil disimpan"})

# ======================
# Init DB
# ======================
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
