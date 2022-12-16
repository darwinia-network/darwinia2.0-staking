import Root from "./Root";
import { WalletProvider } from "@darwinia/app-wallet";
import { i18nTranslationInit } from "@darwinia/app-locale";

i18nTranslationInit();

const App = () => {
  return (
    <WalletProvider>
      <Root />
    </WalletProvider>
  );
};

export default App;
