import type { Metadata } from 'next';
import Wrapper from '@/layouts/wrapper';
import WorkPageClient from './WorkPageClient';

export const metadata: Metadata = {
  title: 'Our Work | BrightOne Creative',
  description: 'Real estate photography, listing shoots, agent social media content, and location shoots by BrightOne Creative.',
};

export default function WorkPage() {
  return (
    <Wrapper>
      <WorkPageClient />
    </Wrapper>
  );
}
