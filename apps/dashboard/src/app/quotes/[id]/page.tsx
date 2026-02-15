import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { readQuote } from "../_utils/read-quote";
import QuoteDetailClientPage from "./client-page";
import { notFound } from "next/navigation";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = new QueryClient();

  const quote = await queryClient.fetchQuery({
    queryKey: ["quote", id],
    queryFn: () => readQuote(id),
  });

  if (!quote) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuoteDetailClientPage id={id} />
    </HydrationBoundary>
  );
}
