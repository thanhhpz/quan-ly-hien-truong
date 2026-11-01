// app/(public)/layout.tsx
import Header from '@/shared/components/Header/header';
import Footer from '@/shared/components/Footer/footer';

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