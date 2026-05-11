import { ContentArea } from '@/components/layout/content-area';

export default function SettingsPage() {
  return (
    <ContentArea>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Theme and AI preferences will live here. Default review view and model selection ship next.
      </p>
    </ContentArea>
  );
}
