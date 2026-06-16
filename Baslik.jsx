// React kütüphanesinden durum yönetimi (useState) ve yan etkiler (useEffect) için gerekli Hook'ları içe aktarıyoruz.
import { useState, useEffect } from "react";

// Baslik bileşeni, üst bileşenden (App.js gibi) bazı verileri ve fonksiyonları "Props" olarak parantez içinde teslim alıyor.
export default function Baslik({ env, sepetAdedi, onSepetAc, searchVal, onSearchChange }) {
  
  // 1. STATE (DURUM) TANIMLAMASI:
  // Tarayıcı penceresinin anlık genişlik (width) ve yükseklik (height) değerlerini nesne (object) olarak hafızada tutuyoruz.
  // Başlangıç değerlerini 'window.innerWidth' ve 'window.innerHeight' ile tarayıcının o anki boyutundan alıyoruz.
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // 2. YAN ETKİ (EFFECT) VE EVENT LISTENER (OLAY DİNLEYİCİ):
  // Tarayıcı penceresi her yeniden boyutlandırıldığında (resize) ekranı güncellemek için useEffect kullanıyoruz.
  useEffect(() => {
    // Tarayıcı boyutu değiştiğinde tetiklenecek olan yardımcı fonksiyon.
    const handleResize = () => {
      // Yeni pencere boyutlarını alıp state'i güncelliyoruz. Bu sayede ekran yeniden render edilir.
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Tarayıcıya (window), "Kullanıcı ekranı boyutlandırırsa (resize) git handleResize fonksiyonunu çalıştır" talimatı veriyoruz.
    window.addEventListener("resize", handleResize);

    // TEMİZLEME (CLEANUP) FONKSİYONU:
    // Bileşen ekrandan kaybolduğunda, tarayıcının arkasında gereksiz yere çalışan 'resize' dinleyicisini kaldırıyoruz.
    // Bu işlem performans kayıplarını ve bellek sızıntılarını önler.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // Boş dizi [] sayesinde bu dinleyici sadece sayfa ilk açıldığında 1 kez kurulur.
  }, []);

  // 3. YARDIMCI FONKSİYON (DÖNÜŞTÜRÜCÜ):
  // Gelen kategori (env) ismini kontrol eder. Eğer "all" ise Türkçe büyük harflerle "TÜM KATEGORİLER" yazar,
  // başka bir şeyse o kelimenin harflerini büyüterek (toUpperCase) geri döndürür.
  const getEnvName = (cat) => {
    if (cat === "all") return "TÜM KATEGORİLER";
    return cat.toUpperCase();
  };

  // 4. EKRANA BASILAN ARAYÜZ (JSX):
  return (
    <header className="eticaret-header">
      <div className="header-ust-alan">
        {/* Logo Alanı */}
        <div className="logo-alani">
          <div className="site-logo-link">HEPSİAL</div>
          <span className="site-logo-badge">STORE</span>
        </div>

        {/* Arama Çubuğu Alanı */}
        <div className="arama-alani">
          <input
            type="text"
            placeholder="Ürün, kategori veya marka ara..."
            value={searchVal} // Input'un içindeki yazı, üst bileşenden gelen searchVal state'ine bağlıdır (Controlled Component).
            // Kullanıcı her harf yazdığında üst bileşenden gelen 'onSearchChange' fonksiyonu tetiklenir ve ana state güncellenir.
            onChange={(e) => onSearchChange(e.target.value)}
            className="arama-input"
          />
          <button className="arama-butonu">Ara</button>
        </div>

        {/* Kullanıcı Menüleri ve Sepet */}
        <div className="kullanici-kontrolleri">
          <div className="menu-linki">Giriş Yap</div>
          <div className="menu-linki">Siparişlerim</div>
          
          {/* Sepet butonuna tıklandığında üst bileşenden gelen 'onSepetAc' fonksiyonu çalışır (Sepet menüsünü açar). */}
          <button onClick={onSepetAc} className="sepet-tetikleyici">
            <span>🛒 Sepetim</span>
            {/* Kısa devre (&&) mantığı: Eğer sepetAdedi 0'dan büyükse sağdaki sepet sayacını ekranda göster, 0 ise hiçbir şey gösterme. */}
            {sepetAdedi > 0 && (
              <span className="sepet-sayac-rozet">{sepetAdedi}</span>
            )}
          </button>
        </div>
      </div>

      {/* Alt Bilgi Şeridi */}
      <div className="kategori-seridi">
        {/* getEnvName fonksiyonuna gelen kategoriyi gönderip ekrana büyük harfli halini bastırıyoruz */}
        <span className="badge badge-gray">{getEnvName(env)}</span>
        {/* useState ile sürekli takip ettiğimiz pencere genişliğini anlık olarak ekrana yazdırıyoruz (Örn: 1920px) */}
        <span className="detail-meta-label">| Çözünürlük: {windowSize.width}px</span>
      </div>
    </header>
  );
}