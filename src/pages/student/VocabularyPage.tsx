import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { VocabularyWord } from '../../types/index.js';
import {
  BookmarkCheck,
  Search,
  Star,
  Layers,
  HelpCircle,
  RotateCw,
  Volume2,
  CheckCircle2,
  BookOpen,
  Filter,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const VocabularyPage: React.FC = () => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBand, setSelectedBand] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'dictionary' | 'flashcards' | 'quiz'>('dictionary');

  // Flashcards State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    async function loadVocab() {
      try {
        const res = await apiRequest<{ words: VocabularyWord[] }>('/content/vocabulary');
        setWords(res.words || []);
      } catch (err) {
        console.error('Failed to load vocabulary:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVocab();
  }, []);

  const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const res = await apiRequest<{ isFavorite: boolean }>(`/content/vocabulary/${id}/favorite`, {
        method: 'POST'
      });
      setWords(prev => prev.map(w => w.id === id ? { ...w, isFavorite: res.isFavorite } : w));
    } catch (err) {
      console.warn('Failed to toggle favorite:', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'new' | 'learning' | 'review' | 'mastered') => {
    try {
      await apiRequest(`/content/vocabulary/${id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ status })
      });
      setWords(prev => prev.map(w => w.id === id ? { ...w, learningStatus: status } : w));
    } catch (err) {
      console.warn('Failed to update progress:', err);
    }
  };

  const categories = ['ALL', ...Array.from(new Set(words.map(w => w.category)))];

  const filtered = words.filter(w => {
    const q = search.toLowerCase();
    const matchesSearch = w.word.toLowerCase().includes(q) || 
                          w.definition.toLowerCase().includes(q) ||
                          w.exampleSentence.toLowerCase().includes(q);
    const matchesCat = selectedCategory === 'ALL' || w.category === selectedCategory;
    const matchesBand = selectedBand === 'ALL' || w.bandLevel === selectedBand;
    return matchesSearch && matchesCat && matchesBand;
  });

  // Current Flashcard
  const currentCard = filtered[flashcardIndex] || filtered[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev + 1) % (filtered.length || 1));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
  };

  // Speak word aloud using browser synthesis
  const speakWord = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Quiz items based on current filtered list
  const currentQuizWord = filtered[quizIndex] || filtered[0];
  const generateQuizOptions = () => {
    if (!currentQuizWord) return [];
    const others = words
      .filter(w => w.id !== currentQuizWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.definition);
    return [currentQuizWord.definition, ...others].sort(() => 0.5 - Math.random());
  };

  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === 'quiz' && currentQuizWord) {
      setQuizOptions(generateQuizOptions());
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [activeTab, quizIndex, currentQuizWord?.id]);

  const handleQuizAnswer = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    if (opt === currentQuizWord.definition) {
      setQuizScore(prev => prev + 1);
      handleUpdateStatus(currentQuizWord.id, 'mastered');
    } else {
      handleUpdateStatus(currentQuizWord.id, 'review');
    }
  };

  const nextQuizQuestion = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setQuizIndex(prev => (prev + 1) % (filtered.length || 1));
  };

  // SRS Stats
  const masteredCount = words.filter(w => w.learningStatus === 'mastered').length;
  const learningCount = words.filter(w => w.learningStatus === 'learning').length;
  const reviewCount = words.filter(w => w.learningStatus === 'review').length;
  const favoritesCount = words.filter(w => w.isFavorite).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>IELTS ACADEMIC VOCABULARY & COLLOCATIONS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Comprehensive Lexicon ({words.length} Words)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized across 18 thematic categories with IPA phonetics, definitions, examples, flashcards, and spaced repetition.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-950 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'dictionary'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dictionary
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Flashcards</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Quiz Mode</span>
          </button>
        </div>
      </div>

      {/* SRS Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="text-slate-500">Mastered Terms</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {masteredCount}
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="text-slate-500">Currently Learning</div>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
            {learningCount}
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="text-slate-500">Needs Revision</div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
            {reviewCount}
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="text-slate-500">Bookmarked Stars</div>
          <div className="text-xl font-bold font-mono text-amber-500 mt-0.5">
            {favoritesCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search words, definitions..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedBand}
            onChange={e => setSelectedBand(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Bands</option>
            <option value="Band 6.0">Band 6.0</option>
            <option value="Band 7.0">Band 7.0</option>
            <option value="Band 8.0+">Band 8.0+</option>
          </select>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'All 18 Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. DICTIONARY VIEW */}
      {activeTab === 'dictionary' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading 500+ vocabulary database...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500">No vocabulary items match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(w => (
                <div
                  key={w.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                          {w.category}
                        </span>
                        <span className="text-[11px] text-slate-400 italic">
                          {w.partOfSpeech}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(w.id, e)}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                          w.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                        }`}
                        title="Bookmark Word"
                      >
                        <Star className={`w-4 h-4 ${w.isFavorite ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{w.word}</span>
                        <button
                          type="button"
                          onClick={(e) => speakWord(w.word, e)}
                          className="text-slate-400 hover:text-blue-600 transition"
                          title="Pronounce Word"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </h3>
                      <span className="text-xs font-mono text-slate-400">{w.phonetic}</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {w.definition}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs italic text-slate-600 dark:text-slate-400 font-serif">
                      "{w.exampleSentence}"
                    </div>

                    {w.synonyms && w.synonyms.length > 0 && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Synonyms:</span>
                        {w.synonyms.map((s, idx) => (
                          <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SRS Status Selector */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">{w.bandLevel}</span>
                    <select
                      value={w.learningStatus || 'new'}
                      onChange={(e) => handleUpdateStatus(w.id, e.target.value as any)}
                      className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300"
                    >
                      <option value="new">New</option>
                      <option value="learning">Learning</option>
                      <option value="review">Review Needed</option>
                      <option value="mastered">Mastered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. FLASHCARDS MODE */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6 py-6">
          {currentCard ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Card {flashcardIndex + 1} of {filtered.length}</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-sans font-semibold">
                  {currentCard.category}
                </span>
              </div>

              {/* 3D Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full min-h-[300px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl p-8 shadow-xl flex flex-col justify-between cursor-pointer transition-all select-none text-center"
              >
                {!isFlipped ? (
                  /* Front of Card */
                  <div className="my-auto space-y-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Tap anywhere to flip card
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
                      <span>{currentCard.word}</span>
                      <button
                        type="button"
                        onClick={(e) => speakWord(currentCard.word, e)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </h2>
                    <div className="text-sm font-mono text-slate-400">{currentCard.phonetic}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{currentCard.partOfSpeech}</div>
                  </div>
                ) : (
                  /* Back of Card */
                  <div className="my-auto space-y-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Definition & Usage
                    </span>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed max-w-md mx-auto">
                      {currentCard.definition}
                    </p>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs italic text-slate-600 dark:text-slate-400 font-serif">
                      "{currentCard.exampleSentence}"
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span>Band: {currentCard.bandLevel}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {isFlipped ? 'Click to show front' : 'Click to reveal definition'}
                  </span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Previous Card
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(currentCard.id, 'mastered')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Mark Mastered
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(currentCard.id, 'review')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Need Review
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNextCard}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  Next Card
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-500">No cards in current selection.</div>
          )}
        </div>
      )}

      {/* 3. QUIZ MODE */}
      {activeTab === 'quiz' && (
        <div className="max-w-xl mx-auto space-y-6 py-6">
          {currentQuizWord ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
                <span className="font-mono text-slate-400">Question {quizIndex + 1} of {filtered.length}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Score: {quizScore}</span>
              </div>

              <div className="space-y-2 text-center py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Select the Correct Definition
                </span>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {currentQuizWord.word}
                </h3>
                <div className="text-xs font-mono text-slate-400">{currentQuizWord.phonetic} · {currentQuizWord.partOfSpeech}</div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {quizOptions.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = opt === currentQuizWord.definition;

                  let btnStyle = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleQuizAnswer(opt)}
                      className={`w-full p-3.5 text-left text-xs rounded-xl border transition flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={nextQuizQuestion}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <span>Next Quiz Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-500">No quiz questions available.</div>
          )}
        </div>
      )}

    </div>
  );
};
