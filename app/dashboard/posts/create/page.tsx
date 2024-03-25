import Form from '@/app/ui/posts/create-form';
import Breadcrumbs from '@/app/ui/posts/breadcrumbs';
import { fetchUsers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchUsers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}