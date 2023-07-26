import clsx from 'clsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const cx = (...styles: string[]) => clsx(...styles);

export const copyToClipboard = (value: string) =>
  navigator.clipboard.writeText(value).then(() => console.log('Copied!'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pathname]);

  return null;
}

export { ScrollToTop };
