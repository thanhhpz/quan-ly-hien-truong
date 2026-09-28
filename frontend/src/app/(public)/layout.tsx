// app/(public)/layout.tsx
import Header from '@/components/layout/Header/header';
import Footer from '@/components/layout/Footer/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}