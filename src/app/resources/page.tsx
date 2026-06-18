import type { Metadata } from 'next';
import { ResourcesClient } from '@/components/ResourcesClient';

export const metadata: Metadata = {
  title: 'Resurser — CA Design',
  description: 'Kurerad samling resurser för AI-design: verktyg, bibliotek, skills och inspiration.',
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
