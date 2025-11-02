import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { MenuItem } from '@/types/menu';

interface ItemDetailsDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  removedIngredients: string[];
  onClose: () => void;
  onToggleIngredient: (ingredient: string) => void;
  onAddToCart: () => void;
}

export default function ItemDetailsDialog({
  item,
  isOpen,
  removedIngredients,
  onClose,
  onToggleIngredient,
  onAddToCart,
}: ItemDetailsDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <img
            src={item.image}
            alt={item.name}
            className="w-full aspect-video object-cover rounded-lg"
          />
          <div>
            <p className="text-muted-foreground mb-4">{item.description}</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{item.protein}г</div>
                <div className="text-sm text-muted-foreground">Белки</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{item.fat}г</div>
                <div className="text-sm text-muted-foreground">Жиры</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{item.carbs}г</div>
                <div className="text-sm text-muted-foreground">Углеводы</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Состав:</h3>
            <div className="space-y-2">
              {item.ingredients.map((ingredient) => (
                <div key={ingredient} className="flex items-center gap-3">
                  <Checkbox
                    id={ingredient}
                    checked={!removedIngredients.includes(ingredient)}
                    onCheckedChange={() => onToggleIngredient(ingredient)}
                  />
                  <label
                    htmlFor={ingredient}
                    className={`flex-1 cursor-pointer ${
                      removedIngredients.includes(ingredient)
                        ? 'line-through text-muted-foreground'
                        : ''
                    }`}
                  >
                    {ingredient}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-3xl font-bold text-primary">{item.price}₽</div>
            <Button size="lg" onClick={onAddToCart} className="gap-2">
              <Icon name="ShoppingCart" size={20} />
              Добавить в корзину
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
