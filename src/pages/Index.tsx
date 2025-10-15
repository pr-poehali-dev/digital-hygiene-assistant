import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  type: 'password' | 'cleanup' | 'security' | 'device';
}

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [passwordLength, setPasswordLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: 'Обновить пароль Gmail',
      description: 'Последнее обновление было 3 месяца назад',
      dueDate: '2025-10-20',
      completed: false,
      type: 'password'
    },
    {
      id: 2,
      title: 'Очистить кэш браузера',
      description: 'Рекомендуется очищать раз в месяц',
      dueDate: '2025-10-18',
      completed: false,
      type: 'cleanup'
    },
    {
      id: 3,
      title: 'Проверить настройки конфиденциальности',
      description: 'Социальные сети и приложения',
      dueDate: '2025-10-22',
      completed: false,
      type: 'security'
    }
  ]);

  const securityScore = Math.round((reminders.filter(r => r.completed).length / reminders.length) * 100);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      toast({
        title: 'Ошибка',
        description: 'Выберите хотя бы один тип символов',
        variant: 'destructive'
      });
      return;
    }

    let password = '';
    for (let i = 0; i < passwordLength[0]; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPassword(password);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: 'Скопировано!',
      description: 'Пароль скопирован в буфер обмена'
    });
  };

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'password': return 'Key';
      case 'cleanup': return 'Trash2';
      case 'security': return 'Shield';
      case 'device': return 'Smartphone';
      default: return 'Bell';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Цифровая Гигиена</h1>
          <p className="text-gray-600">Ваш помощник в поддержании безопасности устройств</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="home" className="gap-2">
              <Icon name="Home" size={18} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="gap-2">
              <Icon name="Bell" size={18} />
              <span className="hidden sm:inline">Напоминания</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Icon name="Key" size={18} />
              <span className="hidden sm:inline">Пароли</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="gap-2">
              <Icon name="BookOpen" size={18} />
              <span className="hidden sm:inline">Обучение</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <Icon name="BarChart3" size={18} />
              <span className="hidden sm:inline">Дашборд</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-scale-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-safe/10 rounded-lg">
                    <Icon name="Shield" size={32} className="text-safe" />
                  </div>
                  <span className="text-2xl font-bold text-safe">{securityScore}%</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Уровень защиты</h3>
                <Progress value={securityScore} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">
                  {securityScore >= 80 ? 'Отличный уровень безопасности!' : 
                   securityScore >= 50 ? 'Есть что улучшить' : 
                   'Требуется внимание'}
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-info/10 rounded-lg">
                    <Icon name="Bell" size={32} className="text-info" />
                  </div>
                  <span className="text-2xl font-bold text-info">
                    {reminders.filter(r => !r.completed).length}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Активных задач</h3>
                <p className="text-sm text-gray-600">
                  Напоминаний требует вашего внимания
                </p>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => setActiveTab('reminders')}
                >
                  Посмотреть задачи
                </Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <Icon name="Key" size={32} className="text-warning" />
                  </div>
                  <Icon name="AlertCircle" size={24} className="text-warning" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Генератор паролей</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Создайте надежный пароль для защиты аккаунта
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => setActiveTab('password')}
                >
                  Создать пароль
                </Button>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Lightbulb" size={24} className="text-warning" />
                Быстрые советы
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="CheckCircle" size={20} className="text-safe mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Используйте 2FA</h4>
                    <p className="text-sm text-gray-600">Двухфакторная аутентификация добавляет дополнительный уровень защиты</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                  <Icon name="CheckCircle" size={20} className="text-info mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Регулярно обновляйте ПО</h4>
                    <p className="text-sm text-gray-600">Обновления закрывают уязвимости безопасности</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Ваши напоминания</h2>
              <Button>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить
              </Button>
            </div>

            {reminders.map((reminder) => (
              <Card 
                key={reminder.id} 
                className={`p-5 transition-all hover:shadow-md ${
                  reminder.completed ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    reminder.type === 'password' ? 'bg-orange-100' :
                    reminder.type === 'cleanup' ? 'bg-blue-100' :
                    reminder.type === 'security' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <Icon 
                      name={getTypeIcon(reminder.type)} 
                      size={24} 
                      className={
                        reminder.type === 'password' ? 'text-warning' :
                        reminder.type === 'cleanup' ? 'text-info' :
                        reminder.type === 'security' ? 'text-safe' : 'text-purple-600'
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${reminder.completed ? 'line-through' : ''}`}>
                      {reminder.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon name="Calendar" size={16} />
                      {new Date(reminder.dueDate).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <Button
                    variant={reminder.completed ? 'outline' : 'default'}
                    onClick={() => toggleReminder(reminder.id)}
                  >
                    <Icon name={reminder.completed ? 'RotateCcw' : 'Check'} size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="password" className="space-y-6 animate-scale-in">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Icon name="Key" size={28} className="text-warning" />
                Генератор надежных паролей
              </h2>

              <div className="space-y-6">
                <div>
                  <Label className="text-base mb-3 block">
                    Длина пароля: {passwordLength[0]} символов
                  </Label>
                  <Slider
                    value={passwordLength}
                    onValueChange={setPasswordLength}
                    min={8}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="uppercase" className="cursor-pointer">
                      Заглавные буквы (A-Z)
                    </Label>
                    <Switch
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={setIncludeUppercase}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="lowercase" className="cursor-pointer">
                      Строчные буквы (a-z)
                    </Label>
                    <Switch
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={setIncludeLowercase}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="numbers" className="cursor-pointer">
                      Цифры (0-9)
                    </Label>
                    <Switch
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={setIncludeNumbers}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="symbols" className="cursor-pointer">
                      Символы (!@#$%...)
                    </Label>
                    <Switch
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={setIncludeSymbols}
                    />
                  </div>
                </div>

                <Button 
                  onClick={generatePassword}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Сгенерировать пароль
                </Button>

                {generatedPassword && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 animate-scale-in">
                    <Label className="text-sm text-gray-600 mb-2 block">
                      Ваш новый пароль:
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedPassword}
                        readOnly
                        className="font-mono text-lg"
                      />
                      <Button onClick={copyPassword} variant="outline">
                        <Icon name="Copy" size={18} />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 flex items-start gap-2">
                      <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
                      Сохраните пароль в надежном месте. Рекомендуем использовать менеджер паролей.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6 animate-scale-in">
            <h2 className="text-2xl font-bold mb-4">Обучение и советы</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="ShieldAlert" size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Как распознать фишинг?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Проверяйте адрес отправителя</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Не переходите по подозрительным ссылкам</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Банки никогда не просят пароли по email</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Обращайте внимание на грамматические ошибки</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Trash2" size={24} className="text-info" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Очистка устройств</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Удаляйте неиспользуемые приложения</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Очищайте кэш браузера раз в месяц</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Проверяйте автозагрузку программ</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Используйте облачное хранилище</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Lock" size={24} className="text-safe" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Безопасность паролей</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Используйте уникальные пароли для каждого сервиса</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Минимум 12 символов с разными типами</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Включайте двухфакторную аутентификацию</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Меняйте пароли каждые 3-6 месяцев</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Smartphone" size={24} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Утилизация устройств</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Сделайте полный сброс до заводских настроек</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Извлеките SIM-карту и карту памяти</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Выйдите из всех аккаунтов</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={18} className="text-safe mt-1 flex-shrink-0" />
                    <span>Сдайте в специализированные пункты приёма</span>
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6 animate-scale-in">
            <h2 className="text-2xl font-bold mb-4">Панель безопасности</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 mb-1">Общий балл</p>
                    <p className="text-4xl font-bold text-safe">{securityScore}</p>
                  </div>
                  <Icon name="TrendingUp" size={24} className="text-safe" />
                </div>
                <Progress value={securityScore} className="h-2" />
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 mb-1">Выполнено задач</p>
                    <p className="text-4xl font-bold text-info">
                      {reminders.filter(r => r.completed).length}/{reminders.length}
                    </p>
                  </div>
                  <Icon name="CheckCircle" size={24} className="text-info" />
                </div>
                <Progress 
                  value={(reminders.filter(r => r.completed).length / reminders.length) * 100} 
                  className="h-2" 
                />
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 mb-1">Активных напоминаний</p>
                    <p className="text-4xl font-bold text-warning">
                      {reminders.filter(r => !r.completed).length}
                    </p>
                  </div>
                  <Icon name="Bell" size={24} className="text-warning" />
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Статистика по категориям</h3>
              <div className="space-y-4">
                {['password', 'cleanup', 'security', 'device'].map((type) => {
                  const typeReminders = reminders.filter(r => r.type === type);
                  const completed = typeReminders.filter(r => r.completed).length;
                  const total = typeReminders.length;
                  const percentage = total > 0 ? (completed / total) * 100 : 0;

                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Icon name={getTypeIcon(type)} size={20} />
                          <span className="font-medium capitalize">
                            {type === 'password' ? 'Пароли' :
                             type === 'cleanup' ? 'Очистка' :
                             type === 'security' ? 'Безопасность' : 'Устройства'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {completed} из {total}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Sparkles" size={24} className="text-info" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Рекомендация дня</h3>
                  <p className="text-gray-700">
                    Включите автоматические обновления на всех ваших устройствах. 
                    Это самый простой способ защититься от известных уязвимостей.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
