
import { Navigate, createBrowserRouter } from "react-router-dom";
import LayoutWebsite from "./layouts/LayoutWebsite";
import LayoutAdmin from "./layouts/LayoutAdmin";
import DashBoardPage from "./pages/admin/dashboard/DashBoardPage";
import News from "./pages/view/News/News";
import CartPage from "./pages/view/Cart/CartPage";
import PayPage from "./pages/view/Pay/PayPage";
import ProductPage from "./pages/view/ProductPage/ProductPage";
import Signup from "./pages/view/Auth/Signup";
import Productlist from "./pages/admin/products/Productlist";
import Productupdate from "./pages/admin/products/Productupdate";
import Categorylist from "./pages/admin/category/Categorylist";
import Categoryadd from "./pages/admin/category/Categoryadd";
import Categoryupdate from "./pages/admin/category/Categoryupdate";
import Order from "./pages/view/Orders/Order";
import ForgotPassword from "./pages/view/Auth/ForgotPassword";
import SignIn from "./pages/view/Auth/SignIn";
import Profile from "./pages/view/User/Account/Profile";
import Purchase from "./pages/view/User/purchase";
import Voucher from "./pages/view/User/voucher";
import Userlist from "./pages/admin/user/Userlist";
import HomePage from "./pages/view/Home/HomePage";
import Product_Detail from "./pages/view/Product_Detail/Product_Detail";
import OrderDetail from "./pages/view/Orders/Order_Detail";
import BrandAdd from "./pages/admin/brands/BrandAdd";
import BrandsList from "./pages/admin/brands/BrandsList";
import BrandUpdate from "./pages/admin/brands/BrandUpdate";
import ColorsAdd from "./pages/admin/colors/Colorsadd";
import Colorslist from "./pages/admin/colors/ColorsList";
import SizesList from "./pages/admin/sizes/Sizeslist";
import Sizesadd from "./pages/admin/sizes/SizesAdd";
import ReviewPage from "./pages/view/Review/ReviewPage";
import MaterialAdd from "./pages/admin/material/MaterialAdd";
import MaterialUpdate from "./pages/admin/material/MaterialUpdate";
import MaterialList from "./pages/admin/material/MaterialList";
import ColorsUpdate from "./pages/admin/colors/ColorsUpdate";
import SizesUpdate from "./pages/admin/sizes/SizesUpdate";
import UserPage from "./pages/view/User/User";
import CategoryTrash from "./pages/admin/category/CategoryTrash";
import CouponsList from "./pages/admin/coupons/CouponsList";
import CouponsAdd from "./pages/admin/coupons/CouponsAdd";
import CouponsUpdate from "./pages/admin/coupons/CouponsUpdate";
import ListproductChill from "./pages/admin/productchill/ListproductChill";
import AddChildProduct from "./pages/admin/productchill/AddChildProduct";
import UpdateChildProduct from "./pages/admin/productchill/UpdateChildProduct";
import VerifyOTP from "./pages/view/Auth/VerifyOTP";
import ProductTrash from "./pages/admin/products/ProductTrash";
import OrdersDetail from "./pages/admin/orders/OrdersDetail";
import CustomizedProductAdd from "./pages/view/CustomizedProduct/CustomizedProductAdd";
import ListCustomizedProduct from "./pages/view/CustomizedProduct/ListCustomizedProduct";
import CustomProductslist from "./pages/admin/customProducts/CustomProductslist";
import CustomProductsTrash from "./pages/admin/customProducts/CustomProductsTrash";
import ListCustomizedProductTrash from "./pages/view/CustomizedProduct/ListCustomProductTrash";
import ProfileUpdate from "./pages/view/User/Account/ProfileUpdate";
import OrdersManager from "./pages/admin/orders/OrdersManager";
import Commentdetail from "./pages/admin/comment/Commentdetail";
import Category_Detail from "./pages/view/Category_Detail/Category_Detail";
import Newslist from "./pages/admin/news/NewsList";
import NewsAdd from "./pages/admin/news/NewsAdd";
import NewsTrash from "./pages/admin/news/NewsTrash";
import NewsUpdate from "./pages/admin/news/NewsUpdate";
import PrivateRouter from "./PrivateRouter";
import Banneradd from "./pages/admin/banners/Banneradd";
import Bannerupdate from "./pages/admin/banners/Bannerupdate";
import Bannerlist from "./pages/admin/banners/Bannerlist";
import VerifyOTPForgotPassword from "./pages/view/Auth/VerifyOTPForgotPassword";
import ResetPassword from "./pages/view/Auth/ResetPassword";
import UserUpdate from "./pages/admin/user/UserUpdate";
import NotFoundPage from "./pages/notfound/NotFoundPage";
import ContactList from "./pages/admin/contact/ContactList";
import ChangePassword from "./pages/view/User/Account/Changepassword";
import CustomProductDetail from "./pages/view/Product_Detail/CustomProductDetail";
import Productadd from "./pages/admin/products/Productadd";
import Listcomments from "./pages/admin/comment/Listcomments";
import ContactPage from "./pages/view/contact/ContactPage";
import FavoritePage from "./pages/view/ProductPage/FavoritePage";



export const router = createBrowserRouter([
    {
        path: '/',
        element: < LayoutWebsite />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'carts', element: <CartPage /> },
            { path: 'pay', element: <PayPage /> },
            { path: 'category/:id', element: <Category_Detail /> },
            { path: 'products', element: <ProductPage /> },
            { path: 'products/:idProduct', element: <Product_Detail /> },
            { path: 'customized/:idProduct/add', element: <CustomizedProductAdd /> },
            { path: '/customized-products/:id', element: <CustomProductDetail /> },
            { path: 'customizedProducts', element: <ListCustomizedProduct /> },
            { path: 'customizedProducts/trash', element: <ListCustomizedProductTrash /> },
            { path: 'review', element: <ReviewPage /> },
            { path: 'contact', element: <ContactPage /> },
            {
                path: 'user', element: <UserPage />, children: [
                    {
                        path: 'profile', children: [
                            { index: true, element: <Profile /> },
                            { path: 'edit', element: <ProfileUpdate /> }
                        ]
                    },
                    { path: 'purchase', element: <Purchase /> },
                    { path: 'voucher', element: <Voucher /> },
                    {
                        path: 'orders', children: [
                            { index: true, element: <Order /> },
                            { path: ':id/orderdetail', element: <OrderDetail /> }
                        ],
                    },
                    { path: "changepasswordnew", element: <ChangePassword /> }
                ]
            },
            { path: 'products', element: <ProductPage /> },
            { path: 'products/favorite', element: <FavoritePage /> },

            { path: 'news', element: <News /> },
            {
                path: 'forgotpassword', children: [
                    { index: true, element: <ForgotPassword /> },
                    { path: 'verifyOTPForgotPassword/:userId', element: <VerifyOTPForgotPassword /> },
                    { path: 'resetPassword/:userId', element: <ResetPassword /> },
                ]
            },

            {
                path: 'signup', children: [
                    { index: true, element: <Signup /> },
                    { path: 'verifyOTP/:userId', element: <VerifyOTP /> }
                ],
            },
            { path: 'signin', element: <SignIn /> },

        ]
    },
    {
        path: '/admin',
        element: <PrivateRouter>< LayoutAdmin /></PrivateRouter>,
        children: [
            { index: true, element: <Navigate to='dashboard' /> },
            { path: 'dashboard', element: <DashBoardPage /> },
            {
                path: 'products', children: [
                    { index: true, element: <Productlist /> },
                    { path: 'add', element: <Productadd /> },
                    { path: 'edit/:id', element: <Productupdate /> },
                    { path: 'childProduct/:productId', element: <ListproductChill /> },
                    { path: 'childProduct/add/:productId', element: <AddChildProduct /> },
                    { path: 'childProduct/:id/edit', element: <UpdateChildProduct /> },
                    { path: 'trash', element: <ProductTrash /> },
                ],
            },
            {
                path: 'categories', children: [
                    { index: true, element: <Categorylist /> },
                    { path: 'add', element: <Categoryadd /> },
                    { path: 'trash', element: <CategoryTrash /> },
                    { path: ':id/edit', element: <Categoryupdate /> },
                ],
            },

            {
                path: 'news', children: [
                    { index: true, element: <Newslist /> },
                    { path: 'add', element: <NewsAdd /> },
                    { path: 'trash', element: <NewsTrash /> },
                    { path: ':id/edit', element: <NewsUpdate /> },
                ],
            },
            {
                path: 'contact', children: [
                    { index: true, element: <ContactList /> },
                    { path: 'add', element: <NewsAdd /> },
                    { path: 'trash', element: <NewsTrash /> },
                    { path: ':id/edit', element: <NewsUpdate /> },
                ],
            },

            {
                path: 'banners', children: [
                    { index: true, element: <Bannerlist /> },
                    { path: 'add', element: <Banneradd /> },
                    { path: ':id/edit', element: <Bannerupdate /> },
                ],
            },

            {
                path: 'users', children: [
                    { index: true, element: <Userlist /> },
                    { path: "edit/:id", element: <UserUpdate /> },
                ],
            },
            {
                path: 'brands', children: [
                    { index: true, element: <BrandsList /> },
                    { path: 'add', element: <BrandAdd /> },
                    { path: 'edit/:idBrand', element: <BrandUpdate /> },
                ],
            },
            {
                path: 'colors', children: [
                    { index: true, element: <Colorslist /> },
                    { path: 'add', element: <ColorsAdd /> },
                    { path: 'edit/:idColor', element: <ColorsUpdate /> },
                ],
            },
            {
                path: 'comments', children: [
                    { index: true, element: <Listcomments /> },
                    { path: ':id', element: <Commentdetail /> },
                ],
            },
            {
                path: 'sizes', children: [
                    { index: true, element: <SizesList /> },
                    { path: 'add', element: <Sizesadd /> },
                    { path: 'edit/:idSize', element: <SizesUpdate /> },
                ],
            },
            {
                path: 'coupons', children: [
                    { index: true, element: <CouponsList /> },
                    { path: 'add', element: <CouponsAdd /> },
                    { path: 'edit/:idCoupon', element: <CouponsUpdate /> },
                ],
            },
            {
                path: 'orders', children: [
                    { index: true, element: <OrdersManager /> },
                    { path: ':id/detail', element: <OrdersDetail /> },
                ],
            },
            {
                path: 'materials', children: [
                    { index: true, element: <MaterialList /> },
                    { path: 'add', element: <MaterialAdd /> },
                    { path: 'edit/:id', element: <MaterialUpdate /> },
                ],
            },
            {

                path: 'customized-products-list', children: [
                    { index: true, element: <CustomProductslist /> },
                    { path: 'trash', element: <CustomProductsTrash /> },

                ],
            },
        ]
    },
    { path: '*', element: <NotFoundPage /> }
])