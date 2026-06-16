// React kütüphanesinden yan etkileri yönetmek (useEffect) için gerekli Hook'u içe aktarıyoruz.
import { useEffect } from "react";

// UrunDetayi bileşeni; seçilen ürünü (product), modalı kapatma (onClose) ve sepete ekleme (onSepeteEkle) fonksiyonlarını üst bileşenden alır.
export default function UrunDetayi({ product, onClose, onSepeteEkle }) {
  
  // 1. YAN ETKİ - KLAVYE DİNLEYİCİSİ (ESCAPE TUŞU)
  // Kullanıcı klavyede "Escape" (ESC) tuşuna bastığında bu modalın otomatik kapanmasını sağlıyoruz.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose(); // ESC tuşuna basıldıysa kapatma fonksiyonunu tetikle.
      }
    };
    // Tarayıcının tamamında klavye hareketlerini dinlemeye başlıyoruz.
    window.addEventListener("keydown", handleKeyDown);
    
    // TEMİZLEME (CLEANUP) FONKSİYONU:
    // Modal kapandığında arka planda klavyeyi dinleyen bu mekanizmayı çöpe atıyoruz.
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]); // onClose fonksiyonu değişirse bu efekti güvenli bir şekilde güncelle.

  // 2. YAN ETKİ - SAYFA KAYDIRMASINI ENGELLEME (SCROLL LOCK)
  // Modal açıldığında, kullanıcının arka plandaki ana sayfayı aşağı yukarı kaydırmasını engelliyoruz.
  useEffect(() => {
    // [MOUNT] Modal ekrana ilk geldiğinde: Sayfanın taşma (overflow) özelliğini gizle (hidden yap).
    document.body.style.overflow = "hidden";
    
    // [UNMOUNT] TEMİZLEME FONKSİYONU: Modal kapandığında sayfa kaydırmayı eski haline döndür (boşalt).
    return () => {
      document.body.style.overflow = "";
    };
  }, []); // Boş dizi [], bu işlemin sadece modal İLK açıldığında ve EN SON kapandığında çalışacağını söyler.

  // 3. YAN ETKİ - HOCA İÇİN DERS NOTU (LOGLAMA)
  // Ürünün değişme durumunu veya modalın ömrünü konsolda (Console) izlemek için yazılmıştır.
  useEffect(() => {
    if (product) {
      // [MOUNT] Ürün ekrana yüklendiğinde çalışır.
      console.log(`[Ders Notu - Mount] UrunDetayi modalı açıldı: ${product.ad}`);
    }
    // [UNMOUNT] Temizleme fonksiyonu: Bileşen bellekten tamamen silindiğinde tetiklenir.
    return () => {
      console.log("[Ders Notu - Unmount] UrunDetayi modalı kapatıldı ve bellekten temizlendi.");
    };
  }, [product]); // Her yeni ürün seçildiğinde bu loglama mekanizması tetiklenir.

  // 4. YARDIMCI FONKSİYON - STOK DURUMU KONTROLÜ
  // Ürünün kalan stok adedine göre kullanıcıya uyarı mesajı ve seviyesi (danger/warning) hazırlar.
  const getInventoryWarning = () => {
    if (!product) return null;
    
    // Stok hiç yoksa kritik tehlike (danger) mesajı dön.
    if (product.stok === 0) {
      return {
        level: "danger",
        text: "Tükendi: Bu ürün geçici olarak temin edilemiyor."
      };
    }
    // Stok var ama 5'ten azsa kullanıcıyı acele ettirecek bir uyarı (warning) mesajı dön.
    if (product.stok < 5) {
      return {
        level: "warning",
        text: `Düşük Stok: Bu üründen son ${product.stok} adet kaldı!`
      };
    }
    return null; // Stok 5 veya daha fazlaysa hiçbir uyarı gösterme.
  };

  // Stok kontrol fonksiyonunu çalıştırıp sonucunu bir değişkene bağlıyoruz.
  const warning = getInventoryWarning();

  // ERKEN DÖNÜŞ (EARLY RETURN)
  // Eğer ortada seçilmiş bir ürün yoksa ekrana hiçbir şey çizme (null dön).
  if (!product) return null;

  return (
    // 'modal-maske' arkadaki koyu saydam alandır. Oraya tıklanırsa modal kapanır.
    <div onClick={onClose} className="modal-maske">
      
      {/* e.stopPropagation(): Çok önemli! İçerideki kutuya tıklandığında modalın kapanmasını ENGELLER. 
          Tıklama olayının yukarıdaki 'modal-maske'ye sıçramasını durdurur. */}
      <div onClick={(e) => e.stopPropagation()} className="modal-kutu">
        
        {/* Ürün Görsel Bölümü */}
        <div className="modal-resim-bolumu">
          <span className="modal-kategori-badge">{product.kategori}</span>
          <span className="modal-resim-emoji">{product.gorsel}</span>
        </div>

        {/* Ürün Detay ve İçerik Bölümü */}
        <div className="modal-icerik-bolumu">
          
          {/* Başlık Alanı ve Kapatma Butonu */}
          <div className="modal-baslik-alani">
            <div>
              <span className="marka-etiketi">{product.marka}</span>
              <h2 className="app-card-title">{product.ad}</h2>
            </div>
            <button onClick={onClose} className="modal-kapat-butonu">✕</button>
          </div>

          <div className="modal-urun-bilgi">
            {/* Eğer stok uyarısı (warning) varsa ekranda uyarı şeridini göster */}
            {warning && (
              <div className="alert-banner">
                <span className="modal-detay-deger">{warning.text}</span>
              </div>
            )}

            {/* Teknik Detay Listesi */}
            <div className="modal-detay-listesi">
              <div className="modal-detay-satiri">
                <span className="modal-detay-etiket">Birim Fiyat</span>
                <span className="yeni-fiyat-etiketi">{product.fiyat.toFixed(2)} TL</span>
              </div>
              <div className="modal-detay-satiri">
                <span className="modal-detay-etiket">Kalan Stok</span>
                <span className="modal-detay-deger">{product.stok} adet</span>
              </div>
              <div className="modal-detay-satiri">
                <span className="modal-detay-etiket">Müşteri Beğenisi</span>
                <span className="modal-detay-deger">★ {product.degerlendirme.toFixed(1)} ({product.yorumAdedi} Yorum)</span>
              </div>
              <div className="modal-detay-satiri">
                <span className="modal-detay-etiket">Açıklama</span>
                <span className="modal-detay-deger">{product.tanim}</span>
              </div>
            </div>

            {/* MÜŞTERİ YORUMLARI ALANI */}
            <span className="modal-yorumlar-baslik">Müşteri Değerlendirmeleri</span>
            <div className="modal-yorumlar-listesi">
              {/* product.incelemeler varsa bunları map metoduyla tek tek karta dönüştür */}
              {product.incelemeler && product.incelemeler.map((review, index) => {
                // regex (düzenli ifade) kullanarak "[12.06.2026]" gibi tarih formatlarını metinden ayıklıyoruz.
                const timeMatch = review.match(/^\[(.*?)\]/);
                const time = timeMatch ? timeMatch[0] : ""; // Ayıklanan tarih bilgisi
                const message = timeMatch ? review.slice(time.length).trim() : review; // Tarihten arındırılmış net yorum metni

                return (
                  <div key={index} className="modal-yorum-kart">
                    <div className="modal-yorum-yazar-satir">
                      <span className="modal-yorum-yazar">{time ? "Kullanıcı Değerlendirmesi" : "Anonim Müşteri"}</span>
                      <span>{time}</span>
                    </div>
                    <p className="modal-yorum-metin">{message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alt Sepete Ekleme Alanı */}
          <div className="modal-aksiyon-alani">
            <button
              onClick={() => {
                onSepeteEkle(product); // Ürünü sepete ekle
                onClose(); // Modalı otomatik kapat
              }}
              // disabled özelliği: Eğer ürünün stoğu 0 ise butonu tıklanamaz (pasif) hale getirir.
              disabled={product.stok === 0}
              className="urun-sepet-ekle-butonu"
            >
              {product.stok === 0 ? "Tükendi" : "Sepete Ekle"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}