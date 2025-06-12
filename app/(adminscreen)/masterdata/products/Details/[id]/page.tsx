type DetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: DetailProps) {
  const { id } = await params;

  return (
    <div>
      <h1>Product Details</h1>
      <p>Product ID: {id}</p>
    </div>
  );
}
