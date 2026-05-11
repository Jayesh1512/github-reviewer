import { ContentArea } from '@/components/layout/content-area';

export default function DashboardLoading() {
  return (
    <ContentArea>
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="mt-6 h-24 animate-pulse rounded-md bg-muted" />
    </ContentArea>
  );
}
