
import React, { useState, useMemo } from 'react';
import { 
  Library, Search, BookOpen, User, Calendar, Info, 
  ChevronLeft, Filter, BookText, ScrollText, Bookmark
} from 'lucide-react';
import { Page, Book, AnswerType } from '../types';

interface LibraryPageProps {
  onNavigate: (page: Page) => void;
}

const BOOKS_DATA: Book[] = [
  {
    id: '1',
    title: 'الموطأ',
    author: 'الإمام مالك بن أنس',
    category: AnswerType.Hadith,
    era: 'القرن الثاني الهجري',
    importance: 'أول كتاب صنف في الحديث الصحيح المبوب، وهو عمدة المذهب المالكي.',
    description: 'يجمع الموطأ بين الأحاديث المرفوعة والآثار الموقوفة عن الصحابة والتابعين، مع بيان فقه أهل المدينة.'
  },
  {
    id: '2',
    title: 'المنهاج في شرح صحيح مسلم',
    author: 'الإمام النووي',
    category: AnswerType.Hadith,
    era: 'القرن السابع الهجري',
    importance: 'من أشهر شروح صحيح مسلم وأكثرها تداولاً وقبولاً عند العلماء.',
    description: 'شرح شامل يتناول اللغة، الإسناد، والفوائد الفقهية والعقدية المستنبطة من الأحاديث.'
  },
  {
    id: '3',
    title: 'تفسير الجلالين',
    author: 'الجلال المحلي والجلال السيوطي',
    category: AnswerType.Tafsir,
    era: 'القرن العاشر الهجري',
    importance: 'يتميز باختصاره الشديد وتركيزه على المعنى اللفظي المباشر للآيات.',
    description: 'تفسير مدرسي معتمد في معظم الحواضر الإسلامية لدقته اللغوية ووضوح عبارته.'
  },
  {
    id: '4',
    title: 'فتح القدير',
    author: 'الإمام ابن الهمام',
    category: AnswerType.Fiqh,
    era: 'القرن التاسع الهجري',
    importance: 'أعظم شروح الهداية في الفقه الحنفي، ويعد مرجعاً في الاستدلال المقارن.',
    description: 'يمتاز بالتدقيق في الأدلة النقلية والعقلية للمسائل الفقهية وتخريج الأحاديث.'
  },
  {
    id: '5',
    title: 'المغني',
    author: 'الإمام ابن قدامة المقدسي',
    category: AnswerType.Fiqh,
    era: 'القرن السابع الهجري',
    importance: 'أكبر موسوعة في الفقه المقارن، وعمدة المذهب الحنبلي.',
    description: 'يستعرض الكتاب مسائل الفقه بأدلتها من الكتاب والسنة مع ذكر مذاهب الصحابة والتابعين والأئمة.'
  },
  {
    id: '6',
    title: 'تفسير القرآن العظيم',
    author: 'الإمام ابن كثير',
    category: AnswerType.Tafsir,
    era: 'القرن الثامن الهجري',
    importance: 'أصح كتب التفسير بالمأثور، يفسر القرآن بالقرآن ثم بالسنة.',
    description: 'يعتني بذكر الأسانيد وتصحيح الحديث وتضعيفه، مع البعد عن الإسرائيليات الضعيفة.'
  }
];

const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnswerType | 'All'>('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    return BOOKS_DATA.filter(book => {
      const matchesSearch = book.title.includes(searchTerm) || book.author.includes(searchTerm);
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 fade-in pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full" />
        <div className="relative z-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-neon-strong animate-float">
              <Library size={32} />
            </div>
            خزانة الأثر
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            استكشف أمهات المصادر والمراجع المعتمدة التي يستند إليها "الفقيه الافتراضي" في استنباط أحكامه.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ابحث عن كتاب أو مؤلف..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold text-emerald-700 dark:text-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer shadow-inner"
          >
            <option value="All">كل التصنيفات</option>
            {Object.values(AnswerType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <button 
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="group flex flex-col bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 text-right transition-all hover:shadow-neon hover:border-emerald-500/40 hover:-translate-y-2"
          >
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bookmark size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{book.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <User size={14} className="text-emerald-500" />
              {book.author}
            </p>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
                {book.category}
              </span>
              <div className="p-2 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors">
                <ChevronLeft size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-32 bg-slate-50/50 dark:bg-slate-900/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <BookText size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">لم نجد أي كتب تطابق بحثك</p>
          <button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}} className="mt-4 text-emerald-600 font-bold text-sm underline decoration-dotted underline-offset-4">إعادة الضبط</button>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-emerald-500/20 transform transition-all scale-100 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="relative h-48 bg-gradient-to-br from-emerald-600 to-emerald-900 p-8 flex items-end">
              <div className="absolute top-6 left-6">
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                >
                  <ChevronLeft className="rotate-90" size={24} />
                </button>
              </div>
              <div className="space-y-1">
                <span className="text-emerald-200 text-xs font-bold bg-white/10 px-3 py-1 rounded-full mb-2 inline-block">
                  {selectedBook.category}
                </span>
                <h2 className="text-3xl font-black text-white">{selectedBook.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl flex items-center gap-3">
                  <User className="text-emerald-500" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">المؤلف</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedBook.author}</p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl flex items-center gap-3">
                  <Calendar className="text-emerald-500" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">العصر</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedBook.era}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 border-r-4 border-emerald-500 pr-4">
                  <ScrollText size={18} className="text-emerald-500" />
                  أهمية الكتاب
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm bg-emerald-50/30 dark:bg-emerald-900/10 p-4 rounded-2xl">
                  {selectedBook.importance}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 border-r-4 border-emerald-500 pr-4">
                  <Info size={18} className="text-emerald-500" />
                  نبذة عن الكتاب
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {selectedBook.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button 
                onClick={() => setSelectedBook(null)}
                className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-300 transition-all"
              >
                إغلاق
              </button>
              <p className="text-[10px] text-slate-400 font-medium">هذا المرجع معتمد في قواعد بيانات الفقيه الافتراضي</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
