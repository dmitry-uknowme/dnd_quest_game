# Frontend Architecture Decomposition: Main Game Interface

Согласно правилам `.agents\frontend-architector.md`, проведем декомпозицию главного экрана игры на основе обновленного мокапа `modern_dnd_ui_v2.png`.

## 1. Что изображено на референсе

Главный интерфейс игры (Game Layout), состоящий из:
- **Left Sidebar:** Список игроков и мастера с их аватарами, классами и индикаторами здоровья/маны.
- **Center Area (Main Story Area):** Изображение локации, текстовое описание сюжета.
- **Action Zone (под текстом):** Предопределенные кнопки выборов, поле ввода для собственного варианта действий (Input) и панель инвентаря (хотбар/кнопка).
- **Right Sidebar:** Вертикальный таймлайн (история глав).
- **Top Bar:** Общая информация (Золото, кнопка Саммари).

## 2. Какой FSD layer/slice подходит

- **Layer: Pages**
  - `pages/GamePage` — Точка входа для основного экрана игры.
  - `pages/HomePage` — Дашборд игрока (Профиль + Списки игр).
- **Layer: Widgets**
  - `widgets/PlayerProfile` — Большой блок профиля с мок-данными и статами.
  - `widgets/RecentGames` — Список текущих и прошлых партий игрока.
  - `widgets/PartySidebar` (Левая панель игры).
  - `widgets/StoryBoard` (Центральная панель с сюжетом и картинкой).
  - `widgets/ActionPanel` (Зона действий, инпут и инвентарь).
  - `widgets/TimelineSidebar` (Правая панель с главами).
  - `widgets/GameHeader` (Верхняя панель).
- **Layer: Features**
  - `features/make-choice` (Логика выбора готовых вариантов и кастомного ввода).
  - `features/use-inventory` (Логика открытия инвентаря и использования предметов).
- **Layer: Entities**
  - `entities/Player` (Карточки игроков, аватары, статы).
  - `entities/StoryNode` (Компоненты отображения текста истории и картинок).
  - `entities/Chapter` (Элементы таймлайна).

## 3. Какие существующие компоненты можно переиспользовать

Учитывая, что проект использует `theme.css` и имеет папку `shared/ui`, мы предполагаем наличие базовых UI-китов.
Возможные к переиспользованию:
- `shared/ui/Button` (для кнопок выбора и Top Bar).
- `shared/ui/Input` (для кастомного ввода действия).
- `shared/ui/Avatar` (для портретов игроков).
- `shared/ui/Progress` (для полосок HP/Mana).
- `shared/ui/ScrollArea` (для скролла длинных историй или списков игроков).

## 4. На какие компоненты разбить новый блок

Чтобы не создавать монолитный `GamePage`, мы собираем его из независимых виджетов:

1. **`GameLayout` (shared/ui или widgets):** Компонент-обертка, реализующий CSS-grid сетку (Left Sidebar, Center, Right Sidebar, Header).
2. **`PartySidebar` (widgets):** Включает в себя заголовок и список `PlayerCard`.
3. **`PlayerCard` (entities/Player):** Карточка игрока (Avatar, Имя, Класс, Progress Bar).
4. **`StoryBoard` (widgets):** Блок с картинкой локации и компонентом текста с кастомным скроллбаром.
5. **`ActionPanel` (widgets):**
   - Блок `ChoiceList` (готовые кнопки).
   - Блок `CustomActionInput` (Поле ввода + кнопка отправки).
   - Блок `InventoryHotbar` (Ряд иконок или кнопка вызова попапа).
6. **`TimelineSidebar` (widgets):** Список `TimelineNode`.

## 6. Архитектура Главной страницы (HomePage)

Главная страница спроектирована как дашборд, собирающий информацию о игроке и его активности.

- **Сетка:** Использует `MainLayout` без сайдбаров (ширина 100%). Контент центрирован с `max-w-6xl`.
- **Компоненты:**
  1. `PlayerProfile` (Widget): Располагается сверху, занимает всю ширину. Визуальный акцент на персонаже.
  2. `CreatePlayroomForm` (Feature/Card): Левая колонка снизу. Призывает к действию.
  3. `RecentGames` (Widget): Правая колонка снизу. Показывает историю и позволяет быстро вернуться в игру.

---

## 7. Как реализовать через Tailwind

В `theme.css` уже определены цвета: `--background`, `--card`, `--primary`, `--success`, `--destructive` и радиусы скругления.

- **Сетка Layout-а:** `grid grid-cols-[280px_1fr_280px] h-screen bg-background text-foreground overflow-hidden`.
- **Glassmorphism (Панели/Сайдбары):** `bg-card/40 backdrop-blur-md border border-border/50 rounded-lg shadow-main-shadow`.
- **Кнопки действий (Primary):** `bg-primary/20 hover:bg-primary/40 text-primary-100 border border-primary/50 transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--color-primary-500)]`.
- **Индикаторы HP (Success):** Обертка `w-full h-1.5 bg-muted rounded-full`, внутри ползунок `bg-success h-full rounded-full`.
- **Поле ввода (Input):** `bg-input/50 border border-border focus:border-ring focus:ring-1 focus:ring-ring text-foreground backdrop-blur-sm`.
- **Таймлайн (Right Sidebar):** Относительное позиционирование для линии `relative before:absolute before:left-4 before:h-full before:w-px before:bg-border`. Ноды таймлайна будут иметь `z-10 bg-card border border-border rounded-full flex items-center justify-center`. Активный нод — `border-primary shadow-[0_0_10px_var(--color-primary)]`.
