import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { CartItem } from '@/types/menu';

interface HeaderProps {
  balance: number;
  cart: CartItem[];
  onAddBalance: () => void;
}

export default function Header({ balance, cart, onAddBalance }: HeaderProps) {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-2xl">
            🍔
          </div>
          <h1 className="text-xl font-bold">МакДоналдс</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onAddBalance} className="gap-2">
            <Icon name="Wallet" size={18} />
            <span className="text-foreground">{balance}₽</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
