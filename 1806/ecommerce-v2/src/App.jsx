import { useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import AddProductForm from "./components/AddProductForm";
import AboutUs from "./components/AboutUs";
import HelpCenter from "./components/HelpCenter";
import OrderTracking from "./components/OrderTracking";
import ProductReturns from "./components/ProductReturns";
import CategoriesList from "./components/CategoriesList";
import ProductDetail from "./components/ProductDetail";
import CartDrawer from "./components/CartDrawer";
import LoginModal from "./components/LoginModal";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "./productsMock";
function AppContent() {
const [products, setProducts] = useState(MOCK_PRODUCTS);
const [selectedCategory, setSelectedCategory] = useState("Tümü");
const [view, setView] = useState("home");
const [searchQuery, setSearchQuery] = useState("");
const [searchInput, setSearchInput] = useState("");
const [isLoginOpen, setIsLoginOpen] = useState(false);
const [isCartOpen, setIsCartOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [cart, setCart] = useState([]);
const handleAddProduct = (data) => {
const newProduct = {
id: Date.now(),
title: data.title,
price: Number(data.price),
category: data.category,
rating: 5,
ratingCount: 1,
image: data.image,
description: data.description,
};
setProducts((prev) => [newProduct, ...prev]);
};
const handleSearchSubmit = (e) => {
e.preventDefault();
setSearchQuery(searchInput);
setView("home");
};
const handleProductClick = (product) => {
setSelectedProduct(product);
setView("detail");
};
const handleBackToList = () => {
setSelectedProduct(null);
setView("home");
};
const handleCategoryClick = (category) => {
setSelectedCategory(category);
setView("home");
};
const handleAddToCart = (product) => {
setCart((prevCart) => {
const existing = prevCart.find(
(item) => item.id === product.id
);
  if (existing) {
    return prevCart.map((item) =>
      item.id === product.id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );
  }

  return [
    ...prevCart,
    {
      ...product,
      quantity: 1,
    },
  ];
});
};
const handleRemoveFromCart = (id) => {
setCart((prev) =>
prev.filter((item) => item.id !== id)
);
};
const handleUpdateQuantity = (id, delta) => {
setCart((prev) =>
prev
.map((item) =>
item.id === id
? {
...item,
quantity: item.quantity + delta,
}
: item
)
.filter((item) => item.quantity > 0)
);
};
const filteredProducts = products.filter((product) => {
const matchesCategory =
selectedCategory === "Tümü" ||
product.category === selectedCategory;
const matchesSearch =
  product.title
    .toLowerCase()
    .includes(searchQuery.toLowerCase()) ||
  product.description
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

return matchesCategory && matchesSearch;
});
const cartCount = cart.reduce(
(sum, item) => sum + item.quantity,
0
);
return (
<>
<Header
searchInput={searchInput}
setSearchInput={setSearchInput}
handleSearchSubmit={handleSearchSubmit}
setSearchQuery={setSearchQuery}
setSelectedCategory={setSelectedCategory}
setView={setView}
cartCount={cartCount}
onLoginClick={() => setIsLoginOpen(true)}
onCartClick={() => setIsCartOpen(true)}
/>
  <Navbar
    categories={MOCK_CATEGORIES}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    setView={setView}
  />

  {view === "home" && (
    <main className="main-layout">
      <Sidebar
        categories={MOCK_CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="content-area">
        <div className="content-header">
          <h1 className="page-title">
            {selectedCategory}
            {searchQuery &&
              ` → "${searchQuery}"`}
            {" "}Ürünler
          </h1>

          <span className="text-sm">
            Toplam {filteredProducts.length} Ürün
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
<p className="text-red-900">
Aradığınız kriterlere uygun ürün
bulunamadı.
</p>
</div>
) : (
<ProductGrid
products={filteredProducts}
onAddToCart={handleAddToCart}
onProductClick={handleProductClick}
/>
)}
</div>
</main>
)}
  {view === "categories" && (
    <CategoriesList
      categories={MOCK_CATEGORIES}
      products={products}
      onCategoryClick={handleCategoryClick}
    />
  )}

  {view === "addProduct" && (
    <AddProductForm
      categories={MOCK_CATEGORIES}
      setView={setView}
      onAddProduct={handleAddProduct}
    />
  )}

  {view === "detail" && selectedProduct && (
    <ProductDetail
      product={selectedProduct}
      onBack={handleBackToList}
      onAddToCart={handleAddToCart}
    />
  )}

  {view === "about" && <AboutUs />}

  {view === "help" && <HelpCenter />}

  {view === "tracking" && <OrderTracking />}

  {view === "returns" && <ProductReturns />}

  <CartDrawer
    isOpen={isCartOpen}
    onClose={() => setIsCartOpen(false)}
    cartItems={cart}
    onUpdateQuantity={handleUpdateQuantity}
    onRemove={handleRemoveFromCart}
  />

  <LoginModal
    isOpen={isLoginOpen}
    onClose={() => setIsLoginOpen(false)}
  />

  <Footer
    setView={setView}
    setSelectedCategory={setSelectedCategory}
  />
</>
);
}
function App() {
return (
<ThemeProvider>
<UserProvider>
<AppContent />
</UserProvider>
</ThemeProvider>
);
}
export default App;