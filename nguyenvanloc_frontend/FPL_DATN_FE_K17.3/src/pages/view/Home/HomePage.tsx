import "./Homepage.css";
import "./Responsive_homepage.css";
import Homeslides from "@/components/Homeslides";
import Categories from "@/components/Categories";
import ProductSell from "@/components/ProductSell";
import ProductList from "@/components/ProductList";
import NewsComponent from "@/components/News";
const HomePage = () => {
  return (
    <div className="main">
      <section className="mx-auto">
        <Homeslides />
      </section>
      <br />
      <Categories />
      <ProductSell />
      <ProductList />
      <NewsComponent />
    </div>
  );
};

export default HomePage;
