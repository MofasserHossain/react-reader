import { getEbookHighlights, getImageFromUrl } from "@/app/_api/ebook.api";
import { getProductDetails } from "@/app/_api/product-details.api";
import { PageProps } from "@/types";
// import dynamic from 'next/dynamic'
import Reader from "./epub/render";

export default async function MainPage({ params: { slug } }: PageProps) {
  const productDetails = await getProductDetails({ url_slug: slug as string });
  const getHighLights = await getEbookHighlights({
    bookId: productDetails?.id as string,
  });
  const base64String = await getImageFromUrl(
    productDetails?.File_URL as string
  );
  return (
    <div className="min-h-screen">
      <Reader
        book={base64String}
        bookData={productDetails}
        hightLights={getHighLights}
      />
    </div>
  );
}
