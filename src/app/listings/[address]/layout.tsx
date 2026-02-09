export default function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="listing-page-wrapper" style={{ background: '#fff', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
