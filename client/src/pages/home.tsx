import { useState } from "react";
import WeekNavigation from "@/components/week-navigation";
import DataTable from "@/components/data-table";
import BottomNavigation from "@/components/bottom-navigation";
import PWAInstallPrompt from "@/components/pwa-install-prompt";

export type ScreenType = "crossings" | "tides" | "weather";

// Maritime quotes that change daily
const getDailyQuote = () => {
  const quotes = [
    { text: "The sea, once it casts its spell, holds one in its net of wonder forever.", author: "Jacques Cousteau" },
    { text: "A smooth sea never made a skilled sailor.", author: "Franklin D. Roosevelt" },
    { text: "The cure for anything is salt water: sweat, tears or the sea.", author: "Isak Dinesen" },
    { text: "We know more about the movement of celestial bodies than about the soil underfoot.", author: "Leonardo da Vinci" },
    { text: "The sea does not reward those who are too anxious, too greedy, or too impatient.", author: "Anne Morrow Lindbergh" },
    { text: "In one drop of water are found all the secrets of all the oceans.", author: "Kahlil Gibran" },
    { text: "The voice of the sea speaks to the soul.", author: "Kate Chopin" },
    { text: "There are plenty of fish in the sea, but you are my catch of a lifetime.", author: "Linda Poindexter" },
    { text: "The sea is everything. It covers seven tenths of the terrestrial globe.", author: "Jules Verne" },
    { text: "I must go down to the seas again, for the call of the running tide is a wild call.", author: "John Masefield" },
    { text: "The ocean stirs the heart, inspires the imagination and brings eternal joy to the soul.", author: "Robert Wyland" },
    { text: "You can't cross the sea merely by standing and staring at the water.", author: "Rabindranath Tagore" },
    { text: "The sea, being smooth, how many shallow bauble boats dare sail upon her patient breast, making their way with those same winds that wrecked them!", author: "William Shakespeare" },
    { text: "Calm seas never made good sailors.", author: "English Proverb" },
    { text: "The sea is a desert of waves, a wilderness of water.", author: "Langston Hughes" },
    { text: "A man who is not afraid of the sea will soon be drowned, for he will go out on a day he shouldn't.", author: "John Millington Synge" },
    { text: "The sea lives in every one of us.", author: "Robert Wyland" },
    { text: "There must be something strangely sacred in salt. It is in our tears and in the sea.", author: "Kahlil Gibran" },
    { text: "The sea complains upon a thousand shores.", author: "Alexander Smith" },
    { text: "We are tied to the ocean. And when we go back to the sea, we are going back from whence we came.", author: "John F. Kennedy" },
    { text: "The sea, once it casts its spell, holds one in its net of wonder forever.", author: "Jacques Cousteau" },
    { text: "At sea, I learned how little a person needs, not how much.", author: "Robin Lee Graham" },
    { text: "The sea will grant each man new hope, and sleep will bring dreams of home.", author: "Christopher Columbus" },
    { text: "I have always been fascinated by the ocean, to dip a limb beneath its surface and know that I'm touching eternity.", author: "Lauren DeStefano" },
    { text: "The edge... there is no honest way to explain it because the only people who really know where it is are the ones who have gone over.", author: "Hunter S. Thompson" },
    { text: "The sea is the universal sewer.", author: "Jacques Cousteau" },
    { text: "Every time I slip into the ocean, it's like going home.", author: "Sylvia Earle" },
    { text: "The sea is only the embodiment of a supernatural and wonderful existence.", author: "Jules Verne" },
    { text: "On life's vast ocean diversely we sail, reason the card, but passion is the gale.", author: "Alexander Pope" },
    { text: "The sea does not belong to despots. Upon its surface men can still exercise unjust laws, fight, tear one another to pieces.", author: "Jules Verne" },
    { text: "Ships are the nearest things to dreams that hands have ever made.", author: "Robert N. Rose" },
    { text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd" },
    { text: "The sea, washing the equator and the poles, offers its perilous aid, and the power and empire that follow it.", author: "Ralph Waldo Emerson" },
    { text: "It is not the mountain we conquer, but ourselves.", author: "Sir Edmund Hillary" },
    { text: "Wherever you go, no matter what the weather, always bring your own sunshine.", author: "Anthony J. D'Angelo" },
    { text: "I must go down to the seas again, to the lonely sea and the sky.", author: "John Masefield" },
    { text: "For whatever we lose, it's always ourselves we find in the sea.", author: "E.E. Cummings" },
    { text: "The sea calls to me, as it has always done.", author: "Anonymous" },
    { text: "Roll on, thou ball, roll on!", author: "W.S. Gilbert" },
    { text: "The sea is a treaty written in water.", author: "Victor Hugo" },
    { text: "Salt water is the cure for everything.", author: "Danish Proverb" },
    { text: "The fishermen know that the sea is dangerous and the storm terrible, but they have never found these dangers sufficient reason for remaining ashore.", author: "Vincent van Gogh" },
    { text: "Dance with the waves, move with the sea, let the rhythm of the water set your soul free.", author: "Christy Ann Martine" },
    { text: "The sea whispers to the shore its ancient secrets.", author: "Anonymous" },
  ];

  // Use current date to get consistent daily quote
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const quoteIndex = dayOfYear % quotes.length;
  
  return quotes[quoteIndex];
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("crossings");
  const [weekOffset, setWeekOffset] = useState(0);
  
  const dailyQuote = getDailyQuote();

  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white px-3 py-2 shadow-md relative">
        <div className="flex items-center justify-between">
          {/* Left Flag */}
          <svg width="32" height="21" viewBox="0 0 32 21" className="flex-shrink-0">
            {/* Yellow background */}
            <rect width="32" height="21" fill="#FFD700"/>
            {/* Red cross - vertical bar */}
            <rect x="14" y="0" width="4" height="21" fill="#DC143C"/>
            {/* Red cross - horizontal bar */}
            <rect x="0" y="8.5" width="32" height="4" fill="#DC143C"/>
          </svg>
          
          {/* Center Title and Quote */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold leading-tight">Holy Crosser</h1>
            <p className="text-xs italic opacity-80 mt-0.5 px-4 leading-tight">
              "{dailyQuote.text}"
            </p>
            <p className="text-xs opacity-60 mt-0.5 leading-tight">
              — {dailyQuote.author}
            </p>
          </div>
          
          {/* Right Flag */}
          <svg width="32" height="21" viewBox="0 0 32 21" className="flex-shrink-0">
            {/* Yellow background */}
            <rect width="32" height="21" fill="#FFD700"/>
            {/* Red cross - vertical bar */}
            <rect x="14" y="0" width="4" height="21" fill="#DC143C"/>
            {/* Red cross - horizontal bar */}
            <rect x="0" y="8.5" width="32" height="4" fill="#DC143C"/>
          </svg>
        </div>
        <p className="opacity-60 absolute top-0 right-3" style={{ fontSize: '9px' }}>Version 2.8.1</p>
      </header>

      {/* Week Navigation */}
      <WeekNavigation
        weekOffset={weekOffset}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      {/* Data Table */}
      <DataTable
        screenType={currentScreen}
        weekOffset={weekOffset}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Bottom padding for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}
