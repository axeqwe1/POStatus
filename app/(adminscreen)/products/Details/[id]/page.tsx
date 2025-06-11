type DetailProps = {
  params: { id: string };
};

export default function ProductDetailPage({ params }: DetailProps) {
  const { id } = params;

  return (
    <div>
      <h1>Product Details</h1>
      <p>Product ID: {id}</p>
    </div>
  );
}
