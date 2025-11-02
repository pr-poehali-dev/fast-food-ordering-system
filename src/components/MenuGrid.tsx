import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { MenuItem, Category } from '@/types/menu';

interface MenuGridProps {
  categories: Category[];
  selectedCategory: string;
  items: MenuItem[];
  onCategoryChange: (category: string) => void;
  onItemClick: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuGrid({
  categories,
  selectedCategory,
  items,
  onCategoryChange,
  onItemClick,
  onAddToCart,
}: MenuGridProps) {
  const filteredItems = items.filter((item) => item.category === selectedCategory);

  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="mb-8">
      <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} className="gap-2">
            <Icon name={category.icon as any} size={18} />
            <span className="hidden sm:inline">{category.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                    <span>Б: {item.protein}г</span>
                    <span>Ж: {item.fat}г</span>
                    <span>У: {item.carbs}г</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-2xl font-bold text-primary">
                      {item.price}₽
                    </div>
                    <Button
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item);
                      }}
                    >
                      <Icon name="Plus" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
