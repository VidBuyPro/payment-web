import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routes } from './routes.constant';
import TestCheckoutWrapper from '@/views/TestCheckout/TestCheckout.view';
import IntentSuccessView from '@/views/IntentSuccess/IntentSuccess.view';
import CheckoutOrderView from '@/views/CheckoutOrder/CheckoutOrder.view';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={routes.inital}
          element={<>Ola</>}
        />

        <Route
          path={routes.checkoutOrder}
          element={<CheckoutOrderView />}
        />

        <Route
          path={routes.testCheckout}
          element={<TestCheckoutWrapper />}
        />

        <Route
          path={routes.intentSuccess}
          element={<IntentSuccessView />}
        />
      </Routes>
    </BrowserRouter>
  );
}
