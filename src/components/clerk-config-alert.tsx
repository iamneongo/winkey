import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CLERK_SETUP_STEPS } from '@/lib/clerk-env';

export function ClerkConfigAlert({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className='mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-6 py-12'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Alert>
            <AlertTitle>Cần cấu hình Clerk trước khi dùng khu quản trị</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </Alert>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <p>Thêm các biến môi trường sau vào `.env.local`:</p>
            <ul className='space-y-1 rounded-lg border bg-muted/30 p-4 font-mono text-xs'>
              {CLERK_SETUP_STEPS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
