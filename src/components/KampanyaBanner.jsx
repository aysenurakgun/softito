// React kütüphanesinden durum yönetimi (useState) ve yan etkileri yönetmek (useEffect) için gerekli Hook'ları içe aktarıyoruz.
import { useState, useEffect } from "react";

export default function KampanyaBanner() {
  // 1. STATE (DURUM) TANIMLAMASI:
  // Kalan süreyi saniye cinsinden hafızada tutuyoruz. 
  // Başlangıç değeri: 3 saat (3600 * 3) + 20 dakika (1200) = Toplam 12000 saniye.
  // secondsLeft: Güncel saniye değerini tutar, setSecondsLeft: Bu değeri değiştirmemizi sağlar.
  const [secondsLeft, setSecondsLeft] = useState(3600 * 3 + 1200);

  // 2. YAN ETKİ (SIDE EFFECT) YÖNETİMİ - ZAMANLAYICI:
  // Sayfa ilk açıldığında arka planda bir kronometre (setInterval) başlatmak için useEffect kullanıyoruz.
  useEffect(() => {
    // Her 1000 milisaniyede (1 saniyede) bir çalışacak bir zamanlayıcı (timer) kuruyoruz.
    const timer = setInterval(() => {
      // Sürekli güncel saniyeyi azaltmak için setSecondsLeft fonksiyonunu tetikliyoruz.
      setSecondsLeft((prev) => {
        // Eğer süre 1 saniyeye veya altına düştüyse, sayacı başa sar (3 saat 20 dakika yap)
        if (prev <= 1) {
          return 3600 * 3 + 1200;
        }
        // Süre henüz bitmediyse, mevcut saniyeden (prev) 1 eksilt.
        return prev - 1;
      });
    }, 1000);

    // TEMİZLEME (CLEANUP) FONKSİYONU:
    // Kullanıcı sayfadan ayrıldığında veya bileşen kapandığında arka plandaki kronometreyi durdururuz.
    // Bellek sızıntısını (memory leak) önlemek için bu işlem çok önemlidir.
    return () => {
      clearInterval(timer);
    };
    // En sondaki boş dizi [], bu efektin sayfa İLK AÇILDIĞINDA sadece bir kez çalışacağını belirtir.
  }, []);

  // 3. YARDIMCI FONKSİYON - FORMATLAMA:
  // Toplam saniyeyi alıp ekranda düzgün görünecek şekilde "SAAT:DAKİKA:SANİYE" formatına çevirir.
  const formatCountdown = (totalSecs) => {
    // Toplam saniyeyi 3600'e bölerek içinde kaç tam saat olduğunu buluyoruz.
    const hours = Math.floor(totalSecs / 3600);
    // Saatten kalan saniyeleri 60'a bölerek kaç dakika olduğunu buluyoruz.
    const minutes = Math.floor((totalSecs % 3600) / 60);
    // Dakikalardan arta kalan net saniyeyi buluyoruz.
    const seconds = totalSecs % 60;
    
    // toString().padStart(2, "0") metodu: Sayı tek haneliyse (örn: 5) başına "0" koyarak iki haneli yapar (örn: "05").
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // 4. EKRANA BASILAN ARAYÜZ (JSX):
  return (
    <div className="slider-banner">
      <div className="slider-bilgi">
        <span className="slider-etiket">GÜNÜN FIRSATI</span>
        <h2 className="slider-baslik">Büyük Yaz İndirimleri Başladı!</h2>
        <p className="slider-detay">
          Tüm Elektronik, Giyim ve Kitaplarda sepette anında %40'a varan indirimleri kaçırmayın.
        </p>
      </div>

      <div className="slider-sayac">
        <span>⏰ Kalan Süre:</span>
        {/* formatCountdown fonksiyonuna elimizdeki güncel saniyeyi gönderip sonucu ekrana yazdırıyoruz */}
        <span>{formatCountdown(secondsLeft)}</span>
      </div>
    </div>
  );
}