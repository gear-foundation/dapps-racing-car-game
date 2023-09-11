import { createRoot } from 'react-dom/client';
import TagManager from 'react-gtm-module';
import { App } from '@/App';
import './styles/global.scss';

if (process.env.NODE_ENV === 'production') {
  TagManager.initialize({
    gtmId: 'GTM-5H6FVXRQ',
  });
}

const container = document.getElementById('root');
const root = createRoot(container as Element);

root.render(<App />);
