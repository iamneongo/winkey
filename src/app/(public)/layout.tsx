import './public.css';
import { Providers } from '../providers';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className='public-site'><Providers>{children}</Providers></div>;
}
