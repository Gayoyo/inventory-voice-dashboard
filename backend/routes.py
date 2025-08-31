from flask import Blueprint, request, jsonify
from models import db, Produk, Penjualan

api = Blueprint("api", __name__)

# ---------------- PRODUK ----------------
@api.route("/produk", methods=["GET"])
def get_produk():
    produk = Produk.query.all()
    return jsonify([{"id": p.id, "nama": p.nama, "harga": p.harga, "stok": p.stok} for p in produk])

@api.route("/produk", methods=["POST"])
def add_produk():
    data = request.json
    produk = Produk(nama=data["nama"], harga=data["harga"], stok=data["stok"])
    db.session.add(produk)
    db.session.commit()
    return jsonify({"message": "Produk ditambahkan!"}), 201

# ---------------- PENJUALAN ----------------
@api.route("/penjualan", methods=["GET"])
def get_penjualan():
    penjualan = Penjualan.query.all()
    return jsonify([{
        "id": p.id,
        "produk_id": p.produk_id,
        "jumlah": p.jumlah,
        "total": p.total
    } for p in penjualan])

@api.route("/penjualan", methods=["POST"])
def add_penjualan():
    data = request.json
    produk = Produk.query.get(data["produk_id"])
    if not produk or produk.stok < data["jumlah"]:
        return jsonify({"error": "Stok tidak cukup"}), 400

    produk.stok -= data["jumlah"]
    penjualan = Penjualan(produk_id=produk.id, jumlah=data["jumlah"], total=produk.harga * data["jumlah"])
    db.session.add(penjualan)
    db.session.commit()
    return jsonify({"message": "Penjualan berhasil!"}), 201
