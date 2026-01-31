import '@/styles/globals.css';
import Layout from '@/components/Layout';
import ClaimsReference from '@/components/ClaimsReference';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <ClaimsReference />
      <Component {...pageProps} />
    </Layout>
  );
}

