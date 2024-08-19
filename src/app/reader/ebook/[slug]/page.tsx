import { getEbookHighlights } from "@/app/_api/ebook.api";
import { getProductDetails } from "@/app/_api/product-details.api";
import { PageProps } from "@/types";
import EbookReader from "./components/book-reader";

const EPUB_URL = "/assets/ebook/ebook1.epub";
// ||
// // 'https://s3.amazonaws.com/moby-dick/moby-dick.epub' ||
// 'https://epubtest.org/books/Fundamental-Accessibility-Tests-Basic-Functionality-v1.0.0.epub' ||
// '/assets/ebook/ebook1.epub'

export default async function Ebook({ params: { slug } }: PageProps) {
  const productDetails = await getProductDetails({ url_slug: slug as string });
  const getHighLights = await getEbookHighlights({
    bookId: productDetails?.id as string,
  });
  const checkEPubUrl = (url: string) => {
    const check = url?.includes(".epub");
    if (!check) {
      return EPUB_URL;
    }
    return url;
  };
  return (
    <section>
      <EbookReader
        url={checkEPubUrl(productDetails?.File_URL)}
        bookData={productDetails}
        hightLights={getHighLights || []}
      />
    </section>
  );
}
