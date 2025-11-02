import { useState, useEffect } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CartItem, MenuItem } from '@/types/menu';
import { menuItems, categories } from '@/data/menuData';
import Header from '@/components/Header';
import CartSheet from '@/components/CartSheet';
import ItemDetailsDialog from '@/components/ItemDetailsDialog';
import MenuGrid from '@/components/MenuGrid';

export default function Index() {
  const [balance, setBalance] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('burgers');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedBalance = localStorage.getItem('balance');
    if (savedBalance) {
      setBalance(parseInt(savedBalance));
    }
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (item: MenuItem, customRemovedIngredients: string[] = []) => {
    const existingItem = cart.find(
      (cartItem) =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.removedIngredients.sort()) ===
          JSON.stringify(customRemovedIngredients.sort())
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem === existingItem
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity: 1,
          removedIngredients: customRemovedIngredients,
        },
      ]);
    }

    toast({
      title: 'Добавлено в корзину',
      description: `${item.name} добавлен в корзину`,
    });
  };

  const updateCartItemQuantity = (itemId: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
    toast({
      title: 'Удалено из корзины',
      description: 'Товар удален из корзины',
    });
  };

  const checkout = async () => {
    if (cartTotal > balance) {
      toast({
        title: 'Недостаточно средств',
        description: 'Пополните баланс для оформления заказа',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('https://faas.poehali.dev/d1ea1302-a333-405d-b3c5-51c2c556f80f/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            removedIngredients: item.removedIngredients,
          })),
          total: cartTotal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      const newBalance = balance - cartTotal;
      setBalance(newBalance);
      localStorage.setItem('balance', newBalance.toString());
      setCart([]);

      toast({
        title: 'Заказ оформлен!',
        description: `Спасибо за заказ! С вашего баланса списано ${cartTotal}₽`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить заказ',
        variant: 'destructive',
      });
    }
  };

  const addBalance = () => {
    const amount = prompt('Введите сумму пополнения (₽):');
    if (amount) {
      const numAmount = parseInt(amount);
      if (!isNaN(numAmount) && numAmount > 0) {
        const newBalance = balance + numAmount;
        setBalance(newBalance);
        localStorage.setItem('balance', newBalance.toString());
        toast({
          title: 'Баланс пополнен',
          description: `На ваш счет зачислено ${numAmount}₽`,
        });
      }
    }
  };

  const openItemDetails = (item: MenuItem) => {
    setSelectedItem(item);
    setRemovedIngredients([]);
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
    setRemovedIngredients([]);
  };

  const toggleIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const addItemFromDialog = () => {
    if (selectedItem) {
      addToCart(selectedItem, removedIngredients);
      closeItemDetails();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sheet>
        <Header balance={balance} cart={cart} onAddBalance={addBalance} />
        <CartSheet
          cart={cart}
          cartTotal={cartTotal}
          balance={balance}
          onUpdateQuantity={updateCartItemQuantity}
          onRemove={removeFromCart}
          onCheckout={checkout}
        />
      </Sheet>

      <ItemDetailsDialog
        item={selectedItem}
        isOpen={!!selectedItem}
        removedIngredients={removedIngredients}
        onClose={closeItemDetails}
        onToggleIngredient={toggleIngredient}
        onAddToCart={addItemFromDialog}
      />

      <main className="container px-4 py-8">
        <MenuGrid
          categories={categories}
          selectedCategory={selectedCategory}
          items={menuItems}
          onCategoryChange={setSelectedCategory}
          onItemClick={openItemDetails}
          onAddToCart={addToCart}
        />
      </main>
    </div>
  );
}
