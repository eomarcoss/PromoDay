import { SearchBar } from "@/components/shared/SearchBar";
import { BottomNav } from "@/components/shared/BottomNav";

export default function NavegationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SearchBar />
      <main className="grow">{children}</main>
      <BottomNav />
    </div>
  );
}
