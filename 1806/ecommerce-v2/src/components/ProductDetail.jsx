export default function ProductDetail() {
  const product = {
    title: "Apple İphone 15 Pro max 256 GB Titanyum",
    price: 79999,
    category: "Telefon",
    rating: 4.9,
    ratingCount: 124,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description:
      "Titanyum tasarımı, güçlü A17 Pro çipi ve gelişmiş kamera sistemiyle en üst segment iPhone deneyimi.",
  };
  return (
    <>
      <div className="detail-container">
        <div className="detail-img-box">
          <img src={product.image} alt={product.title} className="detail-img" />
        </div>
        <div className="detail-info-box">
          <span className="detail-badge">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>
          <div className="detail-rating">
            <span>*</span>
            <span>{product.rating}</span>
            <span className="text-gray-400">
              {product.ratingCount} Değerlendirme
            </span>
          </div>
          <div className="detail-price">
            {product.price.toLocaleString("tr-TR")} TL
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-btn-group">
            <button className="detail-add-btn">Sepete Ekle</button>
            <button className="detail-back-btn">Geri Dön</button>
          </div>
        </div>
      </div>
    </>
  );
}
