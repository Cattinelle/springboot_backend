import BookSummary from "@/components/BookSummary";
import { useLocalSearchParams } from "expo-router";

export default function SummaryPage() {
  const params = useLocalSearchParams();
  return <BookSummary {...params} />;
}
