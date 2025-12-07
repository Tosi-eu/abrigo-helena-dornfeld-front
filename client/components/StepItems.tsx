import { StockCard } from "@/components/StockCard";

interface Props {
  items: any[];
  allItemsCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  selected: any | null;
  onSelectItem: (item: any | null) => void;
  onBack: () => void;
  setPage: (p: number) => void;
}

export default function StepItems({
  items,
  selected,
  onSelectItem,
}: Props) {
  const getCardWidth = (totalCards: number) => {
    if (totalCards === 1) return "w-1/2";  
    if (totalCards === 2) return "w-2/5";   
    if (totalCards === 3) return "w[36%]";
    return "w-1/3";                          
  };

  const cardWidthClass = getCardWidth(items.length);

  console.log(items)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((item) => {
          const isDisabled = item.quantidade === 0;
          const isSelected = selected?.estoque_id === item.estoque_id;

          return (
            <div
              className={`${cardWidthClass} flex justify-center`}
              key={`${item.estoque_id}-${item.tipo_item}`}
            >
              <StockCard
                item={item}
                selected={isSelected}
                disabled={isDisabled}
                tooltip={isDisabled ? "Este item está sem estoque" : undefined}
                onSelect={() => onSelectItem(isSelected ? null : item)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}