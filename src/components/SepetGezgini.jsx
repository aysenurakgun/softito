// React kütüphanesinden performans optimizasyonu sağlayan 'useMemo' kancasını içe aktarıyoruz.
import { useMemo } from "react";

// SepetGezgini bileşeni; sepet verisini, açık/kapalı durumunu ve sepet işlemlerini yöneten fonksiyonları üst bileşenden alır.
export default function SepetGezgini({
  sepet,
  isOpen,
  onClose,
  onAdetGuncelle,
  onUrunCikar
}) {

  // 1. PERFORMONS OPTİMİZASYONU (useMemo):
  // Sepetteki ürünlerin toplam fiyatını hesaplıyoruz. 
  // useMemo kullanımı: Eğer 'sepet' dizisinin içeriği DEĞİŞMEDİYSE, bu hesaplamayı baştan yapma, hafızadaki eski sonucu kullan deriz.
  // Bu sayede sepetle alakası olmayan başka bir işlem yüzünden sayfa yenilenirse gereksiz hesaplama yapılmaz.
  const toplamFiyat = useMemo(() => {
    // reduce metodu: Dizideki tüm elemanları gezip tek bir değer (toplam fiyat) üretir. '0' başlangıç değeridir.
    return sepet.reduce((toplam, item) => toplam + item.fiyat * item.adet, 0);
  }, [sepet]); // Bağımlılık dizisi [sepet]: Sadece sepet değiştiğinde bu fonksiyon tekrar tetiklenir.

  // 2. KANUNLAR VE MATEMATİKSEL HESAPLAMALAR (STATİK DEĞERLER):
  const kargoLimit = 1500; // Bedava kargo için aşılması gereken baraj.
  
  // Kargo Ücreti Kontrolü: Toplam fiyat limitten büyükse VEYA sepet boşsa (0 ise) kargo 0 TL, değilse 50 TL.
  const kargoUcreti = toplamFiyat >= kargoLimit || toplamFiyat === 0 ? 0 : 50;
  
  // Bedava kargoya ne kadar kaldığını bulur. Math.max(0, ...) sayesinde sonucun eksiye düşmesi engellenir.
  const kalanTutar = Math.max(0, kargoLimit - toplamFiyat);
  
  // İlerleme barının doluluk yüzdesi. Math.min(..., 100) ile yüzdenin 100'ü aşması engellenir.
  const ilerlemeYuzdesi = Math.min((toplamFiyat / kargoLimit) * 100, 100);

  // 3. DİNAMİK CLASS YÖNETİMİ:
  // Sepet panelinin sağdan kayarak açılıp kapanma animasyonunu CSS sınıfları (visible/hidden) ile yönetiyoruz.
  const drawerClass = `sepet-drawer ${isOpen ? "sepet-drawer-visible" : "sepet-drawer-hidden"}`;

  // ERKEN DÖNÜŞ (EARLY RETURN):
  // Eğer sepet açık değilse (isOpen = false), aşağıdaki ağır HTML kodlarını hiç çalıştırma, doğrudan null (boşluk) dön.
  if (!isOpen) return null;

  return (
    <>
      {/* Sepet açıldığında arkada kalan siyah puslu gölgelik alan. Tıklanınca sepeti kapatır (onClose). */}
      <div onClick={onClose} className="drawer-arka-plan"></div>

      <div className={drawerClass}>
        <div>
          {/* Üst Başlık ve Kapatma Butonu */}
          <div className="drawer-ust">
            {/* reduce ile sepetteki toplam ürün ADEDİNİ hesaplayıp başlığa yazdırıyoruz */}
            <h3 className="app-card-title">Sepetim ({sepet.reduce((sum, item) => sum + item.adet, 0)} Ürün)</h3>
            <button onClick={onClose} className="drawer-kapat-btn">✕</button>
          </div>

          {/* KARGO İLERLEME BAR ALANI: Sepette ürün varsa (sepet.length > 0) burayı göster */}
          {sepet.length > 0 && (
            <div className="sepet-kargo-ilerleme-kutusu">
              {toplamFiyat >= kargoLimit ? (
                <span className="sepet-kargo-ilerleme-metni">🎉 Kargonuz Bedava!</span>
              ) : (
                <span className="sepet-kargo-ilerleme-metni">
                  {/* .toFixed(2): Sayının virgülden sonra sadece 2 hanesini gösterir (Örn: 45.50 TL) */}
                  🚚 Kargo bedava için <strong>{kalanTutar.toFixed(2)} TL</strong> daha ekleyin!
                </span>
              )}
              {/* İlerleme Barının Görsel Kısmı */}
              <div className="ilerleme-bar-yolu">
                <div
                  className="ilerleme-bar-doluluk"
                  style={{ width: `${ilerlemeYuzdesi}%` }} // CSS width değerini dinamik olarak yüzdelik hesapla dolduruyoruz.
                ></div>
              </div>
            </div>
          )}

          {/* SEPETTEKİ ÜRÜNLERİN LİSTELENDİĞİ ALAN */}
          <div className="sepet-liste-alani">
            {sepet.length === 0 ? (
              <div className="sepet-bos-etiket">
                <span>Sepetiniz şu anda boş.</span>
              </div>
            ) : (
              // sepet.map: Sepetteki her bir ürünü dönerek ekrana alt alta HTML satırları halinde basar.
              sepet.map((item) => (
                <div key={item.id} className="sepet-urun-satir"> {/* React'ın listeleri tanıyabilmesi için benzersiz bir 'key' verdik */}
                  <div className="sepet-eleman-bilgi">
                    <span className="sepet-urun-ad">{item.ad}</span>
                    <span className="sepet-urun-fiyat">{item.fiyat.toFixed(2)} TL</span>
                    
                    {/* Ürün Adedi Artırma ve Azaltma Butonları */}
                    <div className="sepet-adet-controlleri">
                      {/* Eksi butonuna basınca mevcut adedi 1 azaltarak üst bileşene gönderir */}
                      <button
                        onClick={() => onAdetGuncelle(item.id, item.adet - 1)}
                        className="sepet-adet-btn"
                      >
                        -
                      </button>
                      <span className="sepet-adet-yazi">{item.adet}</span>
                      {/* Artı butonuna basınca mevcut adedi 1 artırarak üst bileşene gönderir */}
                      <button
                        onClick={() => onAdetGuncelle(item.id, item.adet + 1)}
                        className="sepet-adet-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Ürünün Satır Toplam Fiyatı (Fiyat x Adet) ve Silme Butonu */}
                  <div className="sepet-satir-sag">
                    <span className="sepet-satir-toplam-fiyat">
                      {(item.fiyat * item.adet).toFixed(2)} TL
                    </span>
                    {/* Sil butonuna basınca o ürünün id'sini silme fonksiyonuna paslar */}
                    <button
                      onClick={() => onUrunCikar(item.id)}
                      className="sepet-satir-sil-btn"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ALT ÖDEME ÖZETİ PANELİ */}
        {sepet.length > 0 && (
          <div className="sepet-alt-odeme-paneli">
            <div className="odeme-detay-satiri">
              <span className="detail-meta-label">Ara Toplam</span>
              <span className="detail-meta-val font-mono">{toplamFiyat.toFixed(2)} TL</span>
            </div>
            <div className="odeme-detay-satiri">
              <span className="detail-meta-label">Kargo Ücreti</span>
              <span className="detail-meta-val font-mono">
                {kargoUcreti === 0 ? "Bedava" : `${kargoUcreti.toFixed(2)} TL`}
              </span>
            </div>
            <div className="odeme-detay-satiri border-t border-slate-100 pt-3">
              <span className="app-card-title">Genel Toplam</span>
              <span className="odeme-genel-toplam">
                {(toplamFiyat + kargoUcreti).toFixed(2)} TL
              </span>
            </div>
            <div className="terminal-header">
              <button
                onClick={() => alert("Siparişiniz başarıyla alındı! (Simülasyon)")}
                className="btn btn-primary w-full"
              >
                Alışverişi Tamamla
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}