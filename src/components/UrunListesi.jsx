// Not: useState import edilmiş ama bileşen içinde doğrudan kullanılmamış. 
// Bu bileşen durumları (loading, error vb.) üst bileşenden 'Props' olarak alıyor.
import { useState } from "react";

export default function UrunListesi({
  products,          // Üst bileşenden gelen tüm ürünlerin listesi (Dizi)
  loading,           // Verilerin internetten yüklenip yüklenmediğini belirten durum (Boolean)
  error,             // Eğer veri yüklenirken bir hata oluştuysa hata mesajını tutan değişken (String)
  activeCategory,    // O an seçili olan aktif kategoriyi tutar (Örn: "Elektronik")
  onCategoryChange,  // Kullanıcı farklı bir kategoriye tıkladığında tetiklenen fonksiyon
  onSelectProduct,   // Kullanıcı bir ürüne tıkladığında detay modalını açan fonksiyon
  onSepeteEkle,      // Ürünü doğrudan sepete ekleyen fonksiyon
  searchTerm         // Üst bileşetteki arama çubuğuna yazılan canlı metin (String)
}) {

  // 1. CANLI FİLTRELEME MEKANİZMASI (Array.filter)
  // Kullanıcı arama kutusuna (searchTerm) bir şey yazdığı anda, ürün listesini anlık olarak süzer.
  const filteredProducts = products.filter(
    (item) =>
      // Ürünün adında veya markasında aranan kelime geçiyor mu diye bakar.
      // .toLowerCase() kullanımı: "iPhone" arandığında "iphone" yazılsa bile eşleşsin diye harfleri küçültür.
      item.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marka.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-card">
      {/* Mağaza Başlık Alanı */}
      <div className="app-card-header">
        <h2 className="app-card-title">Mağaza Kataloğu</h2>
      </div>

      <div className="app-card-body">
        <div className="etiket-izgara">
          
          {/* SOL PANEL: KATEGORİ FİLTRELERİ */}
          <div className="filtre-paneli">
            <span className="filtre-baslik">Kategoriler</span>
            <div className="kategori-secenekleri">
              {/* Her bir buton tıklandığında 'onCategoryChange' fonksiyonuna kendi kategori adını gönderir. */}
              {/* Dinamik Class kullanımı: Eğer activeCategory butonun ismiyle eşleşiyorsa '-aktif' CSS sınıfını giyer. */}
              <button
                onClick={() => onCategoryChange("all")}
                className={`kategori-secenek-btn ${activeCategory === "all" ? "kategori-secenek-btn-aktif" : "kategori-secenek-btn-pasif"}`}
              >
                Tümü
              </button>
              <button
                onClick={() => onCategoryChange("Elektronik")}
                className={`kategori-secenek-btn ${activeCategory === "Elektronik" ? "kategori-secenek-btn-aktif" : "kategori-secenek-btn-pasif"}`}
              >
                Elektronik
              </button>
              <button
                onClick={() => onCategoryChange("Giyim")}
                className={`kategori-secenek-btn ${activeCategory === "Giyim" ? "kategori-secenek-btn-aktif" : "kategori-secenek-btn-pasif"}`}
              >
                Giyim
              </button>
              <button
                onClick={() => onCategoryChange("Kitap")}
                className={`kategori-secenek-btn ${activeCategory === "Kitap" ? "kategori-secenek-btn-aktif" : "kategori-secenek-btn-pasif"}`}
              >
                Kitaplar
              </button>
            </div>
          </div>

          {/* SAĞ PANEL: ÜRÜN VİTRİNİ */}
          <div className="urun-vitrini-alan">
            <div className="filter-bar">
              <div></div>
              {/* Filtrelenmiş ürün dizisinin uzunluğunu (.length) alarak kaç ürün listelendiğini dinamik yazar */}
              <div className="detail-meta-val">
                Bulunan: {filteredProducts.length} adet envanter
              </div>
            </div>

            {/* 3'LÜ KOŞUL YÖNETİMİ (Üçlü Operatör ve Kısa Devre Kombinasyonu) */}
            
            {/* SENARYO 1: Eğer veri hala yükleniyorsa (loading true) ve hata yoksa ekrana gri yükleniyor kutuları (Skeleton) çiz */}
            {loading && !error ? (
              <div className="vitrin-grid">
                {/* 3 adet yapay yüklenme alanı (Skeleton Container) simüle edilmiş */}
                <div className="skeleton-container">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-bar-long"></div>
                  <div className="skeleton-bar-short"></div>
                </div>
                <div className="skeleton-container">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-bar-long"></div>
                  <div className="skeleton-bar-short"></div>
                </div>
                <div className="skeleton-container">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-bar-long"></div>
                  <div className="skeleton-bar-short"></div>
                </div>
              </div>
            ) : error ? (
              // SENARYO 2: Eğer yükleme bitti ama bir hata oluştuysa (error doluysa) ekrana hata mesajını bas
              <div className="skeleton-container">
                <span className="detail-meta-label">
                  Katalog yüklenirken bir hata oluştu: {error}
                </span>
              </div>
            ) : (
              // SENARYO 3: Yükleme başarıyla tamamlandıysa ve hata yoksa filtrelenmiş ürünleri map ile ekrana listele
              <div className="vitrin-grid">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item)} // Ürün kartına tıklanınca detay modalını açar
                    className="urun-kart"
                  >
                    {/* Ürün Kartı Üst Kısım (Görsel ve Rozetler) */}
                    <div className="urun-kart-ust">
                      <span className="resim-ikoni">{item.gorsel}</span>
                      <div className="urun-kart-content">
                        <div className="urun-kart-etiket-grubu">
                          {/* Kısa devre mantığı: Eğer kargo bedava ise rozeti göster */}
                          {item.kargoBedava && (
                            <span className="urun-kargo-bedava-badge">Kargo Bedava</span>
                          )}
                          {/* Eğer eski fiyat ile yeni fiyat arasında 300 TL'den fazla fark varsa Süper Fiyat rozeti tak */}
                          {item.eskiFiyat - item.fiyat > 300 && (
                            <span className="urun-super-fiyat-badge">Süper Fiyat</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ürün Bilgileri ve Aksiyonlar */}
                    <div className="urun-kart-detay">
                      <div>
                        <span className="marka-etiketi">{item.marka}</span>
                        <h3 className="urun-baslik-etiketi">{item.ad}</h3>
                        
                        {/* Puan ve Yorum Sayısı */}
                        <div className="puan-satiri">
                          <span>★ {item.degerlendirme.toFixed(1)}</span>
                          <span className="yorum-adedi-etiket">({item.yorumAdedi} yorum)</span>
                        </div>

                        {/* Stok Durumu Uyarı Şeritleri */}
                        {item.stok > 0 && item.stok < 5 && (
                          <div className="stok-uyari-seridi">
                            <span>Son {item.stok} ürün!</span>
                          </div>
                        )}
                        {item.stok === 0 && (
                          <div className="stok-uyari-seridi bg-rose-50 border-rose-100 text-rose-600">
                            <span>Tükendi</span>
                          </div>
                        )}
                      </div>

                      {/* Fiyat Grubu ve Sepete Ekleme Butonu */}
                      <div className="urun-fiyat-grubu">
                        <div>
                          {/* Eğer indirimli ürünse eski fiyatın üstünü çizmek üzere ekrana bas */}
                          {item.eskiFiyat && (
                            <span className="eski-fiyat-etiketi">
                              {item.eskiFiyat.toFixed(2)} TL
                            </span>
                          )}
                          <span className="yeni-fiyat-etiketi">
                            {item.fiyat.toFixed(2)} TL
                          </span>
                        </div>

                        {/* SEPETE EKLE BUTONU */}
                        <button
                          onClick={(e) => {
                            // ÇOK KRİTİK: Butona tıklandığında olayın yukarı tırmanıp 'onSelectProduct'ı (modalı) tetiklemesini engeller.
                            e.stopPropagation();
                            onSepeteEkle(item);
                          }}
                          // Ürün tükendiyse butonu basılamaz yap
                          disabled={item.stok === 0}
                          className="urun-sepet-ekle-butonu"
                        >
                          {item.stok === 0 ? "Tükendi" : "Sepete Ekle"}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}