import EbookSection from "@/components/EbookSection";
import { getAllEbooks } from "@/lib/frontendApi";

export default async function page() {
    const eBooks = await getAllEbooks();

    return (
        <EbookSection eBooksData={eBooks.data} />
    )
}

