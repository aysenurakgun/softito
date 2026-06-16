// React kütüphanesinden tüm durum, yan etki ve performans optimizasyonu kancalarını (hook) içe aktarıyoruz.
import { useState, useMemo, useEffect, useCallback } from "react";

// Daha önce tek tek hazırladığımız alt bileşenleri (component) buraya dahil ediyoruz.
import Baslik from "./components/Baslik";
import KampanyaBanner from "./components/KampanyaBanner";
import UrunListesi from "./components/UrunListesi";
import UrunDetayi from "./components/UrunDetayi";
import SepetGezgini from "./components/SepetGezgini";

export default function App() {
  // 1. GLOBAL STATE (DURUM) YÖNETİMİ: Tüm sitenin ortak hafızası burasıdır.
  const [products, setProducts] = useState([]);          // API'den gelen orijinal ürün listesi
  const [sepet, setSepet] = useState([]);                // Kullanıcının sepetindeki ürünler
  const [sepetAcik, setSepetAcik] = useState(false);      // Sepet çekmecesinin açık/kapalı durumu
  const [loading, setLoading] = useState(true);           // Yükleniyor durumu (Skeleton tetikleyici)
  const [error, setError] = useState(null);               // Hata mesajı hafızası
  const [selectedProductId, setSelectedProductId] = useState(null); // Detay modalı açılacak ürünün ID'si
  const [currentCategory, setCurrentCategory] = useState("all");    // O an seçili filtre kategorisi
  const [searchTerm, setSearchTerm] = useState("");      // Arama çubuğuna yazılan canlı metin

  // 2. API'DEN VERİ ÇEKME (FETCH): 
  // Sayfa ilk açıldığında (mount) public klasöründeki urunler.json dosyasından verileri çeker.
  useEffect(() => {
    fetch("/urunler.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Katalog yüklenemedi. Sunucu hata kodu: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data); // Ürünleri hafızaya al
        setLoading(false); // Yükleme bitti, iskelet ekranı kapat
      })
      .catch((err) => {
        setError(err.message); // Hatayı kaydet
        setLoading(false);
      });
  }, []); // Boş dizi [], bu isteğin sadece sayfa ilk açıldığında bir kez atılmasını sağlar.

  // 3. DİNAMİK STOK VE KATEGORİ HESAPLAMASI (useMemo):
  // Kullanıcı sepete ürün ekledikçe mağazadaki stokların ANLIK düşmesini sağlar.
  const displayProducts = useMemo(() => {
    // Önce seçilen kategoriye göre ürünleri filtrele
    const filtered = currentCategory === "all"
      ? products
      : products.filter((item) => item.kategori === currentCategory);

    // Sonra filtrelenmiş ürünlerin güncel stok durumlarını hesapla
    return filtered.map((item) => {
      const sepetUrun = sepet.find((c) => c.id === item.id);
      const sepetAdet = sepetUrun ? sepetUrun.adet : 0;
      return {
        ...item,
        // Orijinal stoktan sepetteki adedi çıkarıyoruz. 0'ın altına düşmesin diye Math.max kullanıyoruz.
        stok: Math.max(0, item.stok - sepetAdet)
      };
    });
  }, [products, currentCategory, sepet]); // Bu üçünden biri değişirse hesaplamayı yenile.

  // Seçilen ID'ye göre detay modalında gösterilecek olan net ürün nesnesini bulur.
  const selectedProduct = useMemo(() => {
    return displayProducts.find((p) => p.id === selectedProductId) || null;
  }, [displayProducts, selectedProductId]);

  // 4. AKSİYON FONKSİYONLARI VE PERFORMANS KORUMASI (useCallback):
  // useCallback fonksiyonların her render'da sıfırdan tekrar üretilmesini önler (Hafıza optimizasyonu).

  // SEPETE ÜRÜN EKLEME FONKSİYONU
  const handleSepeteEkle = useCallback((urun) => {
    if (urun.stok <= 0) return; // Stok yoksa işlem yapma.

    setSepet((prevSepet) => {
      // Ürün sepette zaten var mı diye kontrol et
      const varOlan = prevSepet.find((item) => item.id === urun.id);
      if (varOlan) {
        // Varsa, adet bilgisini 1 artır
        return prevSepet.map((item) =>
          item.id === urun.id ? { ...item, adet: item.adet + 1 } : item
        );
      }
      // Yoksa, yeni bir eleman olarak sepet dizisinin sonuna ekle (adet: 1 olarak)
      return [...prevSepet, { id: urun.id, ad: urun.ad, fiyat: urun.fiyat, adet: 1 }];
    });
  }, []);

  // SEPET