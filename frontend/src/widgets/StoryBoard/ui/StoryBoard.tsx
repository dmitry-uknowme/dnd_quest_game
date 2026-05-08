export const StoryBoard = () => {
  return (
    <>
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1519074063912-ad25b5ceb967?auto=format&fit=crop&q=80&w=1200" 
          alt="Location" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-6 left-8 right-8">
          <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">КОРОНОВАННЫЕ ДОЛИНЫ</h2>
          <div className="flex items-center gap-2 text-primary-300 text-sm font-medium">
            <span>📍 Таверна "Подкова и кость"</span>
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90 first-letter:text-4xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
          Городок Серый Брод стоит на краю выжженных пустошей — пыльный, усталый, пахнущий кожевенными мастерскими и дешевым элем. Три дороги сходятся здесь в одну: с севера — тракт из рухнувшего герцогства Валлен, с востока — торговый путь мимо гномьих шахт, с юга — грунтовка через крестьянские деревни. Войны пока обходят Серый Брод стороной, но голод — нет.
        </p>
        <p className="text-lg leading-relaxed text-foreground/90">
          Geralion, ДимаЛарго и Дядя Фёдор сидят в общем зале таверны — единственного приличного заведения в городке, хотя слово «приличного» здесь применимо очень условно. За соседними столами бубнят дорожные торговцы, пара солдат в потрёпанных ливреях неизвестного барона тихо режется в кости, трактирщик — широкий мужик с рыжей бородой — протирает кружки тряпкой сомнительной чистоты.
        </p>
      </div>
    </>
  );
};
