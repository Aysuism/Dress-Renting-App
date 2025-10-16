import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/sass/App.css'
import './assets/sass/style.scss'
import '../node_modules/swiper/swiper.css';
import '../node_modules/swiper/swiper-bundle.min.css';
import { WishlistProvider } from 'react-use-wishlist';
import { Provider } from "react-redux";
import store from "./tools/store.ts";
import { CookiesProvider } from 'react-cookie'
import Router from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <WishlistProvider>
          <Router />
        </WishlistProvider>
      </Provider>
    </CookiesProvider>
  </StrictMode>,
)
