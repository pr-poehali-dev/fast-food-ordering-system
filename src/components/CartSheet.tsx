import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { CartItem } from '@/types/menu';

interface CartSheetProps {
  cart: CartItem[];
  cartTotal: number;
  balance: number;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
}

export default function CartSheet({
  cart,
  cartTotal,
  balance,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartSheetProps) {
  return (
    <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Корзина</SheetTitle>
      </SheetHeader>
      <div className="mt-6">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Корзина пуста</p>
            <p className="text-sm text-muted-foreground mt-2">
              Добавьте товары из меню
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-primary font-semibold">
                            {item.price}₽
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemove(item.id)}
                        >
                          <Icon name="X" size={18} />
                        </Button>
                      </div>
                      {item.removedIngredients.length > 0 && (
                        <p className="text-xs text-muted-foreground mb-2">
                          Без: {item.removedIngredients.join(', ')}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                        >
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Итого:</span>
                <span className="text-primary">{cartTotal}₽</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={onCheckout}
                disabled={cartTotal > balance}
              >
                {cartTotal > balance ? (
                  <>
                    <Icon name="AlertCircle" size={20} className="mr-2" />
                    Недостаточно средств
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Оформить заказ
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </SheetContent>
  );
}
