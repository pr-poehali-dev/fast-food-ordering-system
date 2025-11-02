import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  protein: number;
  fat: number;
  carbs: number;
  ingredients: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
  removedIngredients: string[];
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Биг Мак',
    category: 'burgers',
    price: 350,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/3049c90b-955c-46ea-9196-39159f019333.jpg',
    description: 'Двойная котлета из 100% говядины с фирменным соусом, сыром чеддер и овощами.',
    protein: 25,
    fat: 28,
    carbs: 45,
    ingredients: ['Котлета', 'Сыр', 'Салат', 'Помидор', 'Огурцы', 'Соус'],
  },
  {
    id: '2',
    name: 'Макчикен',
    category: 'burgers',
    price: 280,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/0d251416-2d08-4565-821c-ec7828c68578.jpg',
    description: 'Хрустящая куриная котлета в панировке с майонезным соусом и свежим салатом.',
    protein: 18,
    fat: 22,
    carbs: 38,
    ingredients: ['Куриная котлета', 'Майонез', 'Салат', 'Булочка'],
  },
  {
    id: '3',
    name: 'Макчикен Премьер Пиканто',
    category: 'burgers',
    price: 320,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/de136920-c7f7-473c-bb01-a3787697207d.jpg',
    description: 'Острая версия Макчикена с пикантным соусом и перцем халапеньо.',
    protein: 20,
    fat: 24,
    carbs: 40,
    ingredients: ['Куриная котлета', 'Острый соус', 'Халапеньо', 'Сыр', 'Салат'],
  },
  {
    id: '4',
    name: 'Монблан Бургер',
    category: 'burgers',
    price: 400,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/74db4ccc-6de9-42ff-9354-5c118866672a.jpg',
    description: 'Премиальный бургер с говяжьей котлетой, беконом и трюфельным соусом.',
    protein: 30,
    fat: 35,
    carbs: 42,
    ingredients: ['Говяжья котлета', 'Бекон', 'Трюфельный соус', 'Сыр', 'Лук'],
  },
  {
    id: '5',
    name: 'Монблан Бургер с курицей',
    category: 'burgers',
    price: 380,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/85e0f543-de8a-48ed-ba99-d2d84d118be1.jpg',
    description: 'Премиальный бургер с куриным филе, беконом и авокадо.',
    protein: 28,
    fat: 30,
    carbs: 40,
    ingredients: ['Куриное филе', 'Бекон', 'Авокадо', 'Сыр', 'Салат'],
  },
  {
    id: '6',
    name: 'Наггетсы',
    category: 'other',
    price: 180,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/61083188-578e-489c-beae-88ccde4b9982.jpg',
    description: 'Хрустящие куриные наггетсы из нежного белого мяса в золотистой панировке.',
    protein: 15,
    fat: 12,
    carbs: 18,
    ingredients: ['Куриное филе', 'Панировка'],
  },
  {
    id: '7',
    name: 'Картофель фри',
    category: 'other',
    price: 120,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/a8e74906-099d-4102-83b5-66b8b971547e.jpg',
    description: 'Золотистый картофель фри, обжаренный до хрустящей корочки.',
    protein: 3,
    fat: 15,
    carbs: 35,
    ingredients: ['Картофель', 'Соль'],
  },
  {
    id: '8',
    name: 'МакМаффин',
    category: 'breakfast',
    price: 150,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/3049c90b-955c-46ea-9196-39159f019333.jpg',
    description: 'Классический английский маффин с сыром и ветчиной.',
    protein: 12,
    fat: 10,
    carbs: 28,
    ingredients: ['Маффин', 'Ветчина', 'Сыр'],
  },
  {
    id: '9',
    name: 'МакМаффин с яйцом и беконом',
    category: 'breakfast',
    price: 180,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/3049c90b-955c-46ea-9196-39159f019333.jpg',
    description: 'Сытный завтрак с яйцом-пашот, хрустящим беконом и сыром.',
    protein: 18,
    fat: 15,
    carbs: 30,
    ingredients: ['Маффин', 'Яйцо', 'Бекон', 'Сыр'],
  },
  {
    id: '10',
    name: 'МакМаффин с курицей',
    category: 'breakfast',
    price: 170,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/3049c90b-955c-46ea-9196-39159f019333.jpg',
    description: 'Нежное куриное филе с сыром на английском маффине.',
    protein: 16,
    fat: 12,
    carbs: 29,
    ingredients: ['Маффин', 'Куриное филе', 'Сыр', 'Салат'],
  },
  {
    id: '11',
    name: 'Омлет',
    category: 'breakfast',
    price: 140,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/3049c90b-955c-46ea-9196-39159f019333.jpg',
    description: 'Воздушный омлет с молоком и свежей зеленью.',
    protein: 14,
    fat: 18,
    carbs: 5,
    ingredients: ['Яйца', 'Молоко', 'Зелень'],
  },
  {
    id: '12',
    name: 'Блины',
    category: 'breakfast',
    price: 160,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/3049c90b-955c-46ea-9196-39159f019333.jpg',
    description: 'Тонкие блины с вареньем или сгущенным молоком.',
    protein: 8,
    fat: 10,
    carbs: 45,
    ingredients: ['Мука', 'Яйца', 'Молоко', 'Варенье'],
  },
  {
    id: '13',
    name: 'Маффины',
    category: 'breakfast',
    price: 130,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Свежие маффины с черникой или шоколадной крошкой.',
    protein: 5,
    fat: 12,
    carbs: 38,
    ingredients: ['Мука', 'Черника', 'Сахар', 'Масло'],
  },
  {
    id: '14',
    name: 'Мороженое',
    category: 'desserts',
    price: 100,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Нежное ванильное мороженое из натуральных сливок.',
    protein: 4,
    fat: 8,
    carbs: 22,
    ingredients: ['Молоко', 'Сливки', 'Сахар', 'Ваниль'],
  },
  {
    id: '15',
    name: 'Шейки',
    category: 'desserts',
    price: 150,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Густой молочный коктейль с мороженым и сиропом.',
    protein: 6,
    fat: 12,
    carbs: 45,
    ingredients: ['Мороженое', 'Молоко', 'Сироп'],
  },
  {
    id: '16',
    name: 'Мороженое с сиропом',
    category: 'desserts',
    price: 120,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Ванильное мороженое с выбором сиропа: шоколад, карамель или клубника.',
    protein: 4,
    fat: 9,
    carbs: 28,
    ingredients: ['Мороженое', 'Сироп'],
  },
  {
    id: '17',
    name: 'Шоколадные батончики',
    category: 'desserts',
    price: 80,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Хрустящие вафли в шоколадной глазури.',
    protein: 3,
    fat: 15,
    carbs: 32,
    ingredients: ['Шоколад', 'Вафли', 'Карамель'],
  },
  {
    id: '18',
    name: 'Кофе',
    category: 'drinks',
    price: 120,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Ароматный кофе из свежемолотых зерен арабики.',
    protein: 0,
    fat: 0,
    carbs: 2,
    ingredients: ['Кофе', 'Вода'],
  },
  {
    id: '19',
    name: 'Чай',
    category: 'drinks',
    price: 80,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Черный или зеленый чай высшего качества.',
    protein: 0,
    fat: 0,
    carbs: 1,
    ingredients: ['Чай', 'Вода'],
  },
  {
    id: '20',
    name: 'Газированные напитки',
    category: 'drinks',
    price: 100,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Освежающая газировка: кола, спрайт или фанта.',
    protein: 0,
    fat: 0,
    carbs: 35,
    ingredients: ['Вода', 'Сахар', 'Газ'],
  },
  {
    id: '21',
    name: 'Соки',
    category: 'drinks',
    price: 120,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Натуральные соки: апельсин, яблоко или вишня.',
    protein: 1,
    fat: 0,
    carbs: 28,
    ingredients: ['Фрукты', 'Вода'],
  },
  {
    id: '22',
    name: 'Вода',
    category: 'drinks',
    price: 50,
    image: 'https://cdn.poehali.dev/projects/d1ea1302-a333-405d-b3c5-51c2c556f80f/files/02ebcc5a-044f-4369-9c17-9c6c7068d639.jpg',
    description: 'Чистая питьевая вода.',
    protein: 0,
    fat: 0,
    carbs: 0,
    ingredients: ['Вода'],
  },
];

const categories = [
  { id: 'all', name: 'Всё меню', icon: 'UtensilsCrossed' },
  { id: 'burgers', name: 'Бургеры', icon: 'Beef' },
  { id: 'breakfast', name: 'Завтраки', icon: 'Coffee' },
  { id: 'other', name: 'Другое', icon: 'Package' },
  { id: 'desserts', name: 'Десерты', icon: 'IceCream' },
  { id: 'drinks', name: 'Напитки', icon: 'Wine' },
];

export default function Index() {
  const [balance, setBalance] = useState(1000);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUp, setShowTopUp] = useState(false);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item: MenuItem, customRemovedIngredients: string[] = []) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.id === item.id && 
        JSON.stringify(i.removedIngredients.sort()) === JSON.stringify(customRemovedIngredients.sort())
      );
      if (existing) {
        return prev.map(i => 
          i.id === item.id && 
          JSON.stringify(i.removedIngredients.sort()) === JSON.stringify(customRemovedIngredients.sort())
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, removedIngredients: customRemovedIngredients }];
    });
    toast({
      title: 'Добавлено в корзину',
      description: `${item.name} — ${item.price}₽`,
    });
  };

  const removeFromCart = (itemId: string, removedIngredients: string[]) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.id === itemId && 
        JSON.stringify(i.removedIngredients.sort()) === JSON.stringify(removedIngredients.sort())
      );
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter(
          i => !(i.id === itemId && 
          JSON.stringify(i.removedIngredients.sort()) === JSON.stringify(removedIngredients.sort()))
        );
      }
      return prev.map(i =>
        i.id === itemId && 
        JSON.stringify(i.removedIngredients.sort()) === JSON.stringify(removedIngredients.sort())
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    });
  };

  const checkout = () => {
    if (cartTotal > balance) {
      toast({
        variant: 'destructive',
        title: 'Недостаточно средств',
        description: 'Пополните баланс для оформления заказа',
      });
      return;
    }
    setBalance(prev => prev - cartTotal);
    setCart([]);
    toast({
      title: 'Заказ оформлен!',
      description: `Оплачено ${cartTotal}₽. Ваш заказ готовится.`,
    });
  };

  const topUpBalance = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Введите корректную сумму',
      });
      return;
    }
    setBalance(prev => prev + amount);
    setTopUpAmount('');
    setShowTopUp(false);
    toast({
      title: 'Баланс пополнен',
      description: `+${amount}₽`,
    });
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
    setRemovedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Icon name="Flame" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold">FastFood Premium</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowTopUp(true)}
              className="gap-2"
            >
              <Icon name="Wallet" size={20} />
              <span className="hidden sm:inline">Баланс:</span>
              <span className="font-semibold text-primary">{balance}₽</span>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="relative gap-2">
                  <Icon name="ShoppingCart" size={20} />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-destructive">
                      {cartItemsCount}
                    </Badge>
                  )}
                  <span className="hidden sm:inline">Корзина</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Icon name="ShoppingBag" size={48} className="mb-4 opacity-50" />
                      <p>Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 space-y-4 overflow-auto">
                        {cart.map((item, idx) => (
                          <Card key={`${item.id}-${idx}`} className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-20 w-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                {item.removedIngredients.length > 0 && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Без: {item.removedIngredients.join(', ')}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-lg font-bold text-primary">
                                    {item.price * item.quantity}₽
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeFromCart(item.id, item.removedIngredients)}
                                    >
                                      <Icon name="Minus" size={16} />
                                    </Button>
                                    <span className="w-8 text-center font-semibold">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addToCart(item, item.removedIngredients)}
                                    >
                                      <Icon name="Plus" size={16} />
                                    </Button>
                                  </div>
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
                          onClick={checkout}
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
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="gap-2">
                <Icon name={category.icon as any} size={18} />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
                    onClick={() => openItemDetails(item)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">
                          {item.price}₽
                        </Badge>
                      </div>
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
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                      >
                        <Icon name="Plus" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && closeItemDetails()}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedItem.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold mb-2">Описание</h3>
                  <p className="text-muted-foreground">{selectedItem.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Пищевая ценность</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{selectedItem.protein}г</div>
                      <div className="text-sm text-muted-foreground">Белки</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{selectedItem.fat}г</div>
                      <div className="text-sm text-muted-foreground">Жиры</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{selectedItem.carbs}г</div>
                      <div className="text-sm text-muted-foreground">Углеводы</div>
                    </Card>
                  </div>
                </div>
                {selectedItem.ingredients.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Состав (убрать ингредиенты)</h3>
                    <div className="space-y-2">
                      {selectedItem.ingredients.map(ingredient => (
                        <div key={ingredient} className="flex items-center gap-3">
                          <Checkbox
                            id={ingredient}
                            checked={removedIngredients.includes(ingredient)}
                            onCheckedChange={() => toggleIngredient(ingredient)}
                          />
                          <label
                            htmlFor={ingredient}
                            className={`text-sm cursor-pointer ${
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
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-2xl font-bold text-primary">
                    {selectedItem.price}₽
                  </div>
                  <Button
                    size="lg"
                    onClick={() => {
                      addToCart(selectedItem, removedIngredients);
                      closeItemDetails();
                    }}
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Добавить в корзину
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showTopUp} onOpenChange={setShowTopUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Пополнить баланс</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Текущий баланс</label>
              <div className="text-3xl font-bold text-primary">{balance}₽</div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Сумма пополнения</label>
              <Input
                type="number"
                placeholder="Введите сумму"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[500, 1000, 2000].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setTopUpAmount(amount.toString())}
                >
                  +{amount}₽
                </Button>
              ))}
            </div>
            <Button className="w-full" size="lg" onClick={topUpBalance}>
              <Icon name="CreditCard" size={20} className="mr-2" />
              Пополнить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}