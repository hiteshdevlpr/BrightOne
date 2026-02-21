import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Brochure | BrightOne Creative',
  description: 'BrightOne Creative brochure – real estate media and personal branding services.',
};

export default function BrochurePage() {
  redirect('/assets/BrightOne-brochure.pdf');
}
